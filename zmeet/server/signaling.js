/**
 * ZMeet — signaling channel. (was: ZenMeet)
 *
 * A minimal RFC 6455 WebSocket implementation over Node's `upgrade` event, so
 * ZMeet stays dependency-free. It carries signaling only:
 *
 *   - presence + room state fan-out
 *   - WebRTC offer/answer/ICE relay between two named peers
 *   - chat, media state, polls, QnA, scenes (delegated to RoomService)
 *
 * Media never passes through this server (prompt §34). Payload size is capped
 * and every mutation re-checks the participant's role.
 */

import crypto from 'crypto';
import { roomService } from './rooms.js';
import { verifyToken } from './security.js';

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const MAX_FRAME_BYTES = 128 * 1024;
const HEARTBEAT_MS = 30_000;

/* ------------------------------ frame codec ------------------------------ */

function encodeFrame(payload) {
  const data = Buffer.isBuffer(payload) ? payload : Buffer.from(String(payload), 'utf8');
  const length = data.length;
  let header;

  if (length < 126) {
    header = Buffer.alloc(2);
    header[1] = length;
  } else if (length < 65536) {
    header = Buffer.alloc(4);
    header[1] = 126;
    header.writeUInt16BE(length, 2);
  } else {
    header = Buffer.alloc(10);
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(length), 2);
  }
  header[0] = 0x81; // FIN + text frame
  return Buffer.concat([header, data]);
}

/** Accumulates possibly-fragmented frames; yields complete text payloads. */
class FrameDecoder {
  constructor() {
    this.buffer = Buffer.alloc(0);
  }

  push(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    const messages = [];

    for (;;) {
      if (this.buffer.length < 2) break;
      const first = this.buffer[0];
      const second = this.buffer[1];
      const opcode = first & 0x0f;
      const masked = Boolean(second & 0x80);
      let length = second & 0x7f;
      let offset = 2;

      if (length === 126) {
        if (this.buffer.length < 4) break;
        length = this.buffer.readUInt16BE(2);
        offset = 4;
      } else if (length === 127) {
        if (this.buffer.length < 10) break;
        const big = this.buffer.readBigUInt64BE(2);
        if (big > BigInt(MAX_FRAME_BYTES)) {
          messages.push({ opcode: 0x8, error: 'frame-too-large' });
          this.buffer = Buffer.alloc(0);
          break;
        }
        length = Number(big);
        offset = 10;
      }

      const maskOffset = offset;
      if (masked) offset += 4;
      if (this.buffer.length < offset + length) break;

      const payload = Buffer.from(this.buffer.subarray(offset, offset + length));
      if (masked) {
        const mask = this.buffer.subarray(maskOffset, maskOffset + 4);
        for (let i = 0; i < payload.length; i += 1) payload[i] ^= mask[i % 4];
      }
      this.buffer = this.buffer.subarray(offset + length);

      if (opcode === 0x8) {
        messages.push({ opcode: 0x8 });
        break;
      }
      if (opcode === 0x9) {
        messages.push({ opcode: 0x9, payload });
        continue;
      }
      if (opcode === 0x1 || opcode === 0x2) {
        messages.push({ opcode, payload });
      }
    }

    if (this.buffer.length > MAX_FRAME_BYTES * 4) this.buffer = Buffer.alloc(0);
    return messages;
  }
}

/* ------------------------------- connection ------------------------------- */

class Connection {
  constructor(socket, { roomId, participantId, role }) {
    this.socket = socket;
    this.roomId = roomId;
    this.participantId = participantId;
    this.role = role;
    this.alive = true;
    this.closed = false;
    this.peerId = crypto.randomUUID().slice(0, 8);
  }

  send(payload) {
    if (this.closed || this.socket.destroyed) return;
    const data = encodeFrame(JSON.stringify(payload));
    this.socket.write(data);
  }

  sendRaw(buffer) {
    if (this.closed || this.socket.destroyed) return;
    this.socket.write(buffer);
  }

  close(code = 1000, reason = '') {
    if (this.closed) return;
    this.closed = true;
    try {
      const reasonBuf = Buffer.from(reason, 'utf8');
      const payload = Buffer.alloc(2 + reasonBuf.length);
      payload.writeUInt16BE(code, 0);
      reasonBuf.copy(payload, 2);
      const header = Buffer.alloc(2);
      header[0] = 0x88;
      header[1] = payload.length;
      this.socket.write(Buffer.concat([header, payload]));
    } catch {
      /* socket already gone */
    }
    try {
      this.socket.end();
    } catch {
      /* ignore */
    }
  }
}

/* --------------------------------- hub --------------------------------- */

class SignalingHub {
  constructor() {
    /** participantId -> Set<Connection> */
    this.byParticipant = new Map();
    this.heartbeat = setInterval(() => this.sweep(), HEARTBEAT_MS);
    this.heartbeat.unref?.();
  }

  sweep() {
    for (const [, set] of this.byParticipant) {
      for (const connection of set) {
        if (!connection.alive) {
          this.detach(connection);
          connection.close(1001, 'heartbeat timeout');
          continue;
        }
        connection.alive = false;
        try {
          connection.sendRaw(Buffer.from([0x89, 0x00])); // WebSocket ping
        } catch {
          this.detach(connection);
        }
      }
    }
  }

  attach(connection) {
    if (!this.byParticipant.has(connection.participantId)) this.byParticipant.set(connection.participantId, new Set());
    this.byParticipant.get(connection.participantId).add(connection);
    roomService.attach(connection.roomId, connection);
  }

  detach(connection) {
    const set = this.byParticipant.get(connection.participantId);
    if (set) {
      set.delete(connection);
      if (!set.size) this.byParticipant.delete(connection.participantId);
    }
    roomService.detach(connection.roomId, connection);
  }

  /** Relay to every other socket of the same participant (multi-tab). */
  sendToParticipant(participantId, payload) {
    const set = this.byParticipant.get(participantId);
    if (!set) return 0;
    let sent = 0;
    for (const connection of set) {
      connection.send(payload);
      sent += 1;
    }
    return sent;
  }

  peers(roomId, excludeParticipantId = null) {
    const set = roomService.connections.get(roomId);
    if (!set) return [];
    return [...set]
      .filter((c) => c.participantId !== excludeParticipantId)
      .map((c) => ({ participantId: c.participantId, peerId: c.peerId, role: c.role }));
  }
}

export const hub = new SignalingHub();

/* -------------------------------- upgrade -------------------------------- */

/**
 * Handle an HTTP upgrade. Authentication is a signed, room-scoped token in the
 * query string — never a session cookie, so a leaked URL cannot be replayed
 * against a different room.
 */
export function handleUpgrade(req, socket, head) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname !== '/ws') {
    socket.destroy();
    return;
  }

  const key = req.headers['sec-websocket-key'];
  if (!key) {
    socket.destroy();
    return;
  }

  const token = url.searchParams.get('token') || '';
  const verification = verifyToken(token);
  if (!verification.ok) {
    rejectUpgrade(socket, `Unauthorized (${verification.error})`, 401);
    return;
  }
  if (verification.claims.kind === 'meeting' && !verification.claims.rid) {
    rejectUpgrade(socket, 'Token is not room-scoped', 403);
    return;
  }

  const roomId = verification.claims.rid;
  let room;
  try {
    room = roomService.get(roomId);
  } catch {
    rejectUpgrade(socket, 'Room not found', 404);
    return;
  }

  const participant = room.participants.find((p) => p.id === verification.claims.sub);
  if (!participant || !['joined', 'waiting'].includes(participant.state)) {
    rejectUpgrade(socket, 'Participant is not admitted to this room', 403);
    return;
  }

  const accept = crypto.createHash('sha1').update(key + GUID).digest('base64');
  socket.write(
    [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${accept}`
    ].join('\r\n') + '\r\n\r\n'
  );

  const connection = new Connection(socket, {
    roomId: room.id,
    participantId: participant.id,
    role: participant.role
  });

  const decoder = new FrameDecoder();
  const waiting = participant.state === 'waiting';

  if (waiting) {
    connection.send({ t: 'waiting-state', message: 'You are in the waiting room. The host will admit you shortly.' });
  } else {
    hub.attach(connection);
    participant.connectionCount = (participant.connectionCount || 0) + 1;

    connection.send({
      t: 'welcome',
      you: roomService.publicParticipant(participant),
      peerId: connection.peerId,
      media: { mode: 'mesh', maxMeshPeers: 8, note: 'Signaling only. Media travels peer-to-peer.' },
      room: participant.isHost || ['host', 'moderator'].includes(participant.role)
        ? roomService.staffView(room)
        : roomService.publicView(room)
    });

    roomService.broadcast(room.id, {
      t: 'presence',
      participants: room.participants.filter((p) => p.state === 'joined').map((p) => roomService.publicParticipant(p)),
      peers: hub.peers(room.id)
    });
  }

  if (head?.length) handleChunk(head);

  function handleChunk(chunk) {
    for (const frame of decoder.push(chunk)) {
      if (frame.opcode === 0x8) {
        cleanup('client-close');
        return;
      }
      if (frame.opcode === 0x9) {
        connection.sendRaw(Buffer.from([0x8a, frame.payload?.length || 0, ...(frame.payload || [])]));
        continue;
      }
      if (frame.error === 'frame-too-large') {
        connection.send({ t: 'error', error: 'Message too large' });
        continue;
      }
      if (frame.opcode !== 0x1) continue;
      let message;
      try {
        message = JSON.parse(frame.payload.toString('utf8'));
      } catch {
        connection.send({ t: 'error', error: 'Malformed JSON' });
        continue;
      }
      connection.alive = true;
      try {
        route(connection, message);
      } catch (err) {
        connection.send({ t: 'error', error: err.message, status: err.status || 400, capability: err.capability || null });
      }
    }
  }

  socket.on('data', handleChunk);

  socket.on('error', () => cleanup('socket-error'));

  socket.on('close', () => cleanup('socket-close'));

  socket.on('end', () => cleanup('socket-end'));

  let cleaned = false;
  function cleanup(reason) {
    if (cleaned) return;
    cleaned = true;
    hub.detach(connection);
    connection.closed = true;
    if (!waiting) {
      const fresh = room.participants.find((p) => p.id === participant.id);
      if (fresh) fresh.connectionCount = Math.max(0, (fresh.connectionCount || 1) - 1);
      roomService.broadcast(room.id, {
        t: 'presence',
        participants: room.participants.filter((p) => p.state === 'joined').map((p) => roomService.publicParticipant(p)),
        peers: hub.peers(room.id),
        left: participant.id,
        reason
      });
    }
  }
}

function rejectUpgrade(socket, message, status = 400) {
  try {
    socket.write(
      `HTTP/1.1 ${status} ${message}\r\nContent-Type: text/plain\r\nConnection: close\r\n\r\n${message}`
    );
  } catch {
    /* ignore */
  }
  socket.destroy();
}

/* ------------------------------- routing ------------------------------- */

function route(connection, message) {
  const { roomId, participantId } = connection;
  const type = message?.t;

  switch (type) {
    /* ---------------------------- media state ---------------------------- */
    case 'media': {
      const media = roomService.setMedia(roomId, participantId, message.media || {});
      connection.send({ t: 'media-ack', media });
      return;
    }

    /* ---------------------------- WebRTC relay --------------------------- */
    case 'signal': {
      // { t:'signal', to:'<peerId>', signal:{ kind:'offer'|'answer'|'candidate', ... } }
      const target = message.to;
      if (!target) throw new Error('signal requires a target peer');
      let delivered = 0;
      const set = roomService.connections.get(roomId);
      if (set) {
        for (const peer of set) {
          if (peer.peerId !== target) continue;
          peer.send({
            t: 'signal',
            from: connection.peerId,
            fromParticipant: participantId,
            signal: message.signal
          });
          delivered += 1;
        }
      }
      if (!delivered) connection.send({ t: 'signal-miss', to: target });
      return;
    }

    case 'peers': {
      connection.send({ t: 'peers', peers: hub.peers(roomId, participantId) });
      return;
    }

    /* -------------------------------- chat ------------------------------- */
    case 'chat': {
      roomService.addChat(roomId, participantId, {
        text: message.text,
        kind: message.kind || 'message',
        attachments: message.attachments || []
      });
      return;
    }

    /* ------------------------------ reactions ---------------------------- */
    case 'reaction': {
      roomService.broadcast(roomId, {
        t: 'reaction',
        participantId,
        emoji: String(message.emoji || '👍').slice(0, 8),
        at: new Date().toISOString()
      });
      return;
    }

    /* -------------------------------- mod -------------------------------- */
    case 'moderate': {
      const target = roomService.get(roomId).participants.find((p) => p.id === participantId);
      if (!target) throw new Error('Participant not found');
      roomService.moderate(roomId, message.participantId, message.action, {
        actorRole: target.role,
        actor: target.name,
        value: message.value
      });
      return;
    }

    case 'role': {
      const target = roomService.get(roomId).participants.find((p) => p.id === participantId);
      roomService.setRole(roomId, message.participantId, message.role, {
        actorRole: target?.role || 'audience',
        actor: target?.name || 'participant'
      });
      return;
    }

    case 'waiting-admit': {
      const target = roomService.get(roomId).participants.find((p) => p.id === participantId);
      roomService.admit(roomId, message.waitingId, {
        actorRole: target?.role || 'audience',
        actor: target?.name || 'participant',
        admit: message.admit !== false
      });
      return;
    }

    /* ------------------------------- polls ------------------------------- */
    case 'poll-vote': {
      roomService.vote(roomId, message.pollId, participantId, message.optionId);
      return;
    }

    /* -------------------------------- Q&A -------------------------------- */
    case 'qna-ask': {
      roomService.askQuestion(roomId, participantId, message.question);
      return;
    }

    case 'qna-upvote': {
      roomService.upvoteQuestion(roomId, message.questionId, participantId);
      return;
    }

    /* ------------------------------ layout ------------------------------- */
    case 'layout': {
      const target = roomService.get(roomId).participants.find((p) => p.id === participantId);
      if (!['host', 'cohost', 'moderator', 'speaker'].includes(target?.role)) {
        throw Object.assign(new Error('Only hosts and speakers can change the layout.'), { status: 403 });
      }
      roomService.setLayout(roomId, message.layout, { actor: target.name });
      return;
    }

    /* ---------------------------- whiteboard ----------------------------- */
    case 'whiteboard': {
      roomService.whiteboard(roomId, {
        strokes: message.strokes,
        notes: message.notes,
        actor: participantId
      });
      return;
    }

    case 'ping': {
      connection.send({ t: 'pong', at: new Date().toISOString() });
      return;
    }

    default:
      connection.send({ t: 'error', error: `Unknown message type “${type}”` });
  }
}
