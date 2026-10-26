/**
 * ZMeet — meeting room client.
 *
 * Real WebRTC mesh for small rooms:
 *   getUserMedia → RTCPeerConnection per peer → offer/answer/ICE via the
 *   signaling socket. Media never touches the server.
 *
 * All authorisation decisions live on the server. This file hides controls the
 * participant cannot use, but never *grants* anything — a tampered client gets
 * a 403 from the room service.
 */

const params = new URLSearchParams(window.location.search);
const roomCode = window.location.pathname.split('/').filter(Boolean).pop();

const state = {
  roomId: null,
  room: null,
  me: null,
  peers: new Map(),          // participantId -> { pc, stream, peerId }
  peerIdToParticipant: new Map(),
  streams: new Map(),        // participantId -> MediaStream
  localStream: null,
  screenStream: null,
  ws: null,
  token: null,
  wsUrl: null,
  media: { mic: true, camera: true, screen: false },
  activeRail: 'chat',
  aiMessages: [],
  summary: null,
  joinedAt: null,
  timerHandle: null,
  reconnectAttempts: 0,
  widget: { presenting: null, board: false }
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ============================================================
   Helpers
   ============================================================ */

function icon(name) {
  return `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

function esc(text = '') {
  return String(text).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[ch]);
}

function initials(name = '') {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

function fmtTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function clock(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function toast(message, kind = 'success') {
  const stack = $('#toasts');
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.innerHTML = `${icon(kind === 'error' ? 'alert' : 'check')}<span>${esc(message)}</span>`;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .25s, transform .25s';
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => el.remove(), 260);
  }, 3600);
}

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await fetch(path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function showError(err) {
  toast(err.message || 'Something went wrong', 'error');
}

/* ============================================================
   Boot
   ============================================================ */

document.addEventListener('DOMContentLoaded', boot);

async function boot() {
  bindChrome();
  showOverlay('Connecting', 'Preparing your meeting sandbox…', true);

  try {
    await ensureMedia(false);
  } catch {
    /* permission denied — join anyway, media off */
  }

  try {
    const guestName = params.get('name') || '';
    const join = await api(`/api/rooms/${roomCode}/join`, {
      method: 'POST',
      // Arriving with a name means the guest flow. Without this flag a guest who
      // happens to be on the host machine would be handed host powers.
      body: JSON.stringify({ name: guestName, guest: Boolean(guestName) })
    });

    state.token = join.token;
    state.roomId = join.roomMeta.id;
    state.room = join.room;
    state.me = join.participant;
    state.wsUrl = join.wsUrl;

    if (join.waiting) {
      renderWaiting(join.message);
      connectSocket();
      return;
    }

    await enterRoom();
  } catch (err) {
    if (err.data?.needsName) {
      renderNamePrompt();
      return;
    }
    if (err.data?.requiresAuth) {
      showOverlay(
        'Sign-in required',
        'The host set this room to require a signed-in identity before entry.',
        false,
        [{ label: 'Back to dashboard', action: () => (window.location.href = '/') }]
      );
      return;
    }
    showOverlay('Cannot join', err.message, false, [
      { label: 'Back to dashboard', action: () => (window.location.href = '/') }
    ]);
  }
}

function renderNamePrompt() {
  const meta = document.title;
  showOverlay(
    'Join the meeting',
    `Enter the name other participants will see.`,
    false,
    [],
    `<form id="nameForm" style="display:flex;gap:8px;margin-top:14px;width:100%;max-width:320px">
      <input id="joinName" type="text" placeholder="Your name" autocomplete="name" maxlength="60"
        style="flex:1;height:36px;padding:0 12px;border-radius:10px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#fff;outline:none" />
      <button type="submit" class="btn primary">Join</button>
    </form>`
  );
  setTimeout(() => {
    const form = $('#nameForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = $('#joinName').value.trim();
      if (!name) return;
      history.replaceState(null, meta, `/r/${roomCode}?name=${encodeURIComponent(name)}`);
      await boot();
    });
    $('#joinName').focus();
  }, 40);
}

async function enterRoom() {
  renderChrome();
  startTimer();
  connectSocket();
  await renderTiles();
  hideOverlay();
  startLocalPreview();
}

/* ============================================================
   Media
   ============================================================ */

async function ensureMedia(withVideo = true) {
  const constraints = {
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    video: withVideo ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' } : false
  };
  if (state.localStream) {
    return state.localStream;
  }
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  state.localStream = stream;
  state.media.mic = stream.getAudioTracks().length > 0;
  state.media.camera = stream.getVideoTracks().length > 0;
  trackLocalStream(stream);
  return stream;
}

function trackLocalStream(stream) {
  state.streams.set(state.me?.id || 'local', stream);
}

async function startLocalPreview() {
  await renderTiles();
  await broadcastMedia();
}

async function toggleMic() {
  const stream = state.localStream;
  if (!stream) {
    try {
      await ensureMedia(false);
    } catch {
      toast('Microphone permission denied', 'error');
      return;
    }
  }
  const track = state.localStream.getAudioTracks()[0];
  if (!track) {
    toast('No microphone found', 'warn');
    return;
  }
  track.enabled = !track.enabled;
  state.media.mic = track.enabled;
  renderChrome();
  await broadcastMedia();
}

async function toggleCamera() {
  const stream = state.localStream;
  if (!stream || !stream.getVideoTracks().length) {
    if (state.localStream) {
      try {
        const fresh = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        const track = fresh.getVideoTracks()[0];
        state.localStream.addTrack(track);
        state.media.camera = true;
        replaceOutboundTrack(track, 'video');
      } catch {
        toast('Camera permission denied', 'error');
        return;
      }
    } else {
      try {
        await ensureMedia(true);
        state.media.camera = true;
      } catch {
        toast('Camera permission denied', 'error');
        return;
      }
    }
  } else {
    const track = state.localStream.getVideoTracks()[0];
    track.enabled = !track.enabled;
    state.media.camera = track.enabled;
  }
  renderChrome();
  await renderTiles();
  await broadcastMedia();
}

/**
 * Screen sharing is always explicit (prompt §28) — the browser's own picker is
 * the consent surface, and the UI shows a persistent sharing indicator.
 */
async function toggleScreen() {
  if (state.media.screen) {
    stopScreenShare();
    return;
  }
  if (!navigator.mediaDevices?.getDisplayMedia) {
    toast('Screen sharing is not supported in this browser', 'warn');
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: { ideal: 15, max: 30 } },
      audio: false
    });
    state.screenStream = stream;
    state.media.screen = true;
    const track = stream.getVideoTracks()[0];
    track.addEventListener('ended', stopScreenShare);
    for (const [, peer] of state.peers) {
      const sender = peer.pc.getSenders().find((s) => s.track?.kind === 'video');
      if (sender) await sender.replaceTrack(track);
    }
    await broadcastMedia();
    renderChrome();
    await renderTiles();
    toast('You are sharing your screen');
  } catch (err) {
    if (err.name !== 'NotAllowedError') toast('Screen share failed', 'error');
  }
}

function stopScreenShare() {
  if (state.screenStream) {
    for (const track of state.screenStream.getTracks()) track.stop();
  }
  state.screenStream = null;
  state.media.screen = false;
  const cameraTrack = state.localStream?.getVideoTracks()[0] || null;
  for (const [, peer] of state.peers) {
    const sender = peer.pc.getSenders().find((s) => s.track?.kind === 'video');
    if (sender) sender.replaceTrack(cameraTrack).catch(() => {});
  }
  broadcastMedia();
  renderChrome();
  renderTiles();
}

async function replaceOutboundTrack(track) {
  for (const [, peer] of state.peers) {
    const sender = peer.pc.getSenders().find((s) => s.track?.kind === track.kind);
    if (sender) await sender.replaceTrack(track).catch(() => {});
    else peer.pc.addTrack(track, state.localStream);
  }
}

async function broadcastMedia() {
  if (!state.ws || state.ws.readyState !== WebSocket.OPEN) return;
  send({ t: 'media', media: { mic: state.media.mic, camera: state.media.camera, screen: state.media.screen } });
}

/* ============================================================
   WebRTC mesh
   ============================================================ */

function createPeer(participantId, peerId, initiator) {
  if (state.peers.has(participantId)) {
    const existing = state.peers.get(participantId);
    if (existing.pc.connectionState !== 'failed' && existing.pc.connectionState !== 'closed') return existing;
    existing.pc.close();
    state.peers.delete(participantId);
  }

  const pc = new RTCPeerConnection({
    iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }],
    iceCandidatePoolSize: 4
  });

  const entry = { pc, peerId, participantId, stream: new MediaStream() };
  state.peers.set(participantId, entry);
  state.peerIdToParticipant.set(peerId, participantId);

  const outbound = state.screenStream && state.media.screen ? state.screenStream : state.localStream;
  if (outbound) {
    for (const track of outbound.getTracks()) pc.addTrack(track, outbound);
  }

  pc.addEventListener('track', (event) => {
    const [stream] = event.streams;
    if (stream) {
      state.streams.set(participantId, stream);
      const tile = document.getElementById(`tile-${participantId}`);
      if (tile) mountVideo(tile, stream, participantId);
    }
  });

  pc.addEventListener('icecandidate', (event) => {
    if (!event.candidate) return;
    send({ t: 'signal', to: peerId, signal: { kind: 'candidate', candidate: event.candidate.toJSON() } });
  });

  pc.addEventListener('connectionstatechange', () => {
    if (['failed', 'closed'].includes(pc.connectionState)) {
      state.streams.delete(participantId);
      renderTiles();
    }
    if (pc.connectionState === 'connected') {
      const tile = document.getElementById(`tile-${participantId}`);
      tile?.classList.add('connected');
    }
  });

  if (initiator) {
    pc.addEventListener('negotiationneeded', async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        send({ t: 'signal', to: peerId, signal: { kind: 'offer', sdp: pc.localDescription } });
      } catch {
        /* peer may have gone */
      }
    });
  }

  return entry;
}

async function handleSignal(message) {
  const { from, signal, fromParticipant } = message;
  if (!signal) return;
  const participantId = fromParticipant || state.peerIdToParticipant.get(from) || from;
  const initiator = signal.kind === 'offer';
  const entry = createPeer(participantId, from, initiator);

  try {
    if (signal.kind === 'offer') {
      await entry.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      const answer = await entry.pc.createAnswer();
      await entry.pc.setLocalDescription(answer);
      send({ t: 'signal', to: from, signal: { kind: 'answer', sdp: entry.pc.localDescription } });
    } else if (signal.kind === 'answer') {
      if (entry.pc.signalingState === 'have-local-offer') {
        await entry.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      }
    } else if (signal.kind === 'candidate') {
      await entry.pc.addIceCandidate(new RTCIceCandidate(signal.candidate)).catch(() => {});
    }
  } catch {
    /* a renegotiation race is not fatal — the next event fixes it */
  }
}

/* ============================================================
   Signaling socket
   ============================================================ */

function connectSocket() {
  if (!state.wsUrl) return;
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const url = `${proto}//${window.location.host}${state.wsUrl}`;
  const ws = new WebSocket(url);
  state.ws = ws;

  ws.addEventListener('open', () => {
    state.reconnectAttempts = 0;
  });

  ws.addEventListener('message', (event) => {
    let msg;
    try {
      msg = JSON.parse(event.data);
    } catch {
      return;
    }
    handleServerMessage(msg);
  });

  ws.addEventListener('close', () => {
    if (state.me && !document.hidden) {
      state.reconnectAttempts += 1;
      if (state.reconnectAttempts <= 6) {
        setTimeout(connectSocket, Math.min(8000, 500 * 2 ** state.reconnectAttempts));
      } else {
        toast('Connection lost. Reload to rejoin.', 'error');
      }
    }
  });
}

function send(payload) {
  if (state.ws && state.ws.readyState === WebSocket.OPEN) {
    state.ws.send(JSON.stringify(payload));
  }
}

function handleServerMessage(msg) {
  switch (msg.t) {
    case 'welcome': {
      state.me = msg.you;
      state.room = msg.room;
      state.joinedAt = state.room.startedAt || new Date().toISOString();
      renderChrome();
      renderTiles();
      renderPeople();
      renderChat();
      renderAi();
      hideOverlay();
      // Introduce ourselves to everyone already here.
      send({ t: 'peers' });
      break;
    }

    case 'peers': {
      for (const peer of msg.peers || []) {
        if (peer.participantId === state.me?.id) continue;
        createPeer(peer.participantId, peer.peerId, true);
      }
      break;
    }

    case 'presence': {
      if (msg.participants) {
        state.room.participants = msg.participants;
        if (msg.left && state.peers.has(msg.left)) {
          const entry = state.peers.get(msg.left);
          entry.pc.close();
          state.peers.delete(msg.left);
          state.streams.delete(msg.left);
        }
        renderTiles();
        renderPeople();
      }
      break;
    }

    case 'signal': {
      handleSignal(msg);
      break;
    }

    case 'media': {
      const list = state.room.participants || [];
      const idx = list.findIndex((p) => p.id === msg.participantId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...msg.media };
        renderTiles();
        renderPeople();
      }
      break;
    }

    case 'media-ack': {
      if (state.me) state.me = { ...state.me, ...msg.media };
      break;
    }

    case 'chat': {
      state.room.chat = [...(state.room.chat || []), msg.message];
      renderChat();
      if (state.activeRail !== 'chat' && msg.message.participantId !== state.me?.id) {
        toast(`${msg.message.author}: ${msg.message.text.slice(0, 60)}`);
      }
      break;
    }

    case 'reaction': {
      floatReaction(msg.emoji);
      break;
    }

    case 'waiting': {
      if (!state.room) state.room = {};
      state.room.waitingCount = msg.count;
      if (msg.count > 0 && isStaff()) {
        toast(`${msg.count} ${msg.count === 1 ? 'person' : 'people'} waiting`, 'warn');
        renderPeople();
      }
      if (msg.resolved && msg.resolved.admitted && state.me?.state === 'waiting') {
        window.location.reload();
      }
      break;
    }

    case 'waiting-state': {
      renderWaiting(msg.message);
      break;
    }

    case 'role': {
      if (state.me && msg.participant?.id === state.me.id) {
        state.me = { ...state.me, ...msg.participant };
        renderChrome();
        renderTiles();
      }
      const list = state.room?.participants || [];
      const idx = list.findIndex((p) => p.id === msg.participant?.id);
      if (idx !== -1 && msg.participant) list[idx] = msg.participant;
      renderPeople();
      break;
    }

    case 'moderated': {
      const list = state.room?.participants || [];
      const idx = list.findIndex((p) => p.id === msg.participant?.id);
      if (idx !== -1) list[idx] = { ...list[idx], ...msg.participant };
      if (state.me && msg.participant?.id === state.me.id) {
        state.me = { ...state.me, ...msg.participant };
        if (msg.participant.forceMuted && state.localStream) {
          const track = state.localStream.getAudioTracks()[0];
          if (track) track.enabled = false;
          state.media.mic = false;
          toast('The host muted your microphone', 'warn');
        }
        if (msg.action === 'remove') {
          showOverlay('Removed from the meeting', 'The host removed you from this room.', false, [
            { label: 'Back to dashboard', action: () => (window.location.href = '/') }
          ]);
        }
      }
      renderChrome();
      renderTiles();
      renderPeople();
      break;
    }

    case 'polls':
    case 'qna':
    case 'files':
    case 'whiteboard':
    case 'scenes':
    case 'streaming':
    case 'recording': {
      Object.assign(state.room, msg);
      renderMore();
      if (msg.t === 'scenes') renderChrome();
      if (msg.recordings || msg.recording) renderChrome();
      break;
    }

    case 'layout': {
      state.room.layout = msg.layout;
      renderTiles();
      break;
    }

    case 'ai': {
      if (msg.mode) {
        state.room.aiMode = msg.mode;
        state.room.aiModeLabel = msg.label;
        renderAi();
      }
      break;
    }

    case 'studio': {
      Object.assign(state.room, msg);
      if (msg.lowerThird) renderLowerThird();
      if (msg.countdown) renderCountdown();
      break;
    }

    case 'room': {
      if (msg.event === 'participant-joined' && msg.participant) {
        const list = state.room.participants || [];
        if (!list.find((p) => p.id === msg.participant.id)) list.push(msg.participant);
        if (msg.participant.id !== state.me?.id) {
          send({ t: 'peers' });
        }
        renderTiles();
        renderPeople();
      }
      if (msg.event === 'participant-left') {
        const list = state.room.participants || [];
        state.room.participants = list.filter((p) => p.id !== msg.participantId);
        if (state.peers.has(msg.participantId)) {
          state.peers.get(msg.participantId).pc.close();
          state.peers.delete(msg.participantId);
          state.streams.delete(msg.participantId);
        }
        renderTiles();
        renderPeople();
      }
      if (msg.event === 'ended') {
        showOverlay('Meeting ended', 'The host ended this meeting. Your notes and minutes are being prepared.', false, [
          { label: 'View report', action: () => (window.location.href = '/') }
        ]);
      }
      break;
    }

    case 'error': {
      toast(msg.error || 'Server rejected the action', 'error');
      break;
    }

    default:
      break;
  }
}

/* ============================================================
   Rendering
   ============================================================ */

function isStaff() {
  return ['host', 'moderator', 'cohost'].includes(state.me?.role);
}

function can(capability) {
  return (state.me?.capabilities || []).includes(capability);
}

function participants() {
  return state.room?.participants || [];
}

function remoteParticipants() {
  return participants().filter((p) => p.id !== state.me?.id);
}

async function renderTiles() {
  const grid = $('#tileGrid');
  const layout = state.room?.layout || 'gallery';
  const presenting = (state.room?.files || []).find((f) => f.presented);

  grid.className = `tile-grid ${layout}`;

  if (state.widget.board) {
    grid.innerHTML = renderBoard();
    bindBoard();
    return;
  }

  if ((layout === 'presentation' || presenting) && layout !== 'studio') {
    grid.innerHTML = renderPresentation(presenting);
    return;
  }

  if (layout === 'speaker') {
    const all = participants();
    const primary = all[0];
    const rest = all.slice(1);
    grid.innerHTML = `${renderTile(primary, true)}<div class="tile-strip">${rest.map((p) => renderTile(p)).join('')}</div>`;
    mountAllVideos();
    return;
  }

  if (layout === 'interview') {
    const all = participants().slice(0, 2);
    grid.innerHTML = all.map((p) => renderTile(p)).join('') || renderTile(state.me);
    mountAllVideos();
    return;
  }

  if (layout === 'studio') {
    const scenes = state.room?.scenes || [];
    const active = scenes.find((s) => s.active);
    const slots = active?.slots || [{ kind: 'host' }, { kind: 'guest' }, { kind: 'screen' }, { kind: 'slides' }, { kind: 'video' }, { kind: 'presentation' }];
    grid.innerHTML = slots
      .slice(0, 6)
      .map((slot) => {
        const label = { host: 'Host', guest: 'Guest', screen: 'Screen', slides: 'Slides', video: 'Video clip', presentation: 'Presentation', image: 'Image' }[slot.kind] || slot.kind;
        return `<div class="tile">
          <div class="tile-avatar"><div class="disc face-${slot.kind === 'host' ? 0 : 1}">${icon('present')}</div></div>
          <span class="tile-label">${icon('present')}${esc(label)}</span>
        </div>`;
      })
      .join('');
    return;
  }

  const all = [state.me, ...remoteParticipants()].filter(Boolean);
  grid.innerHTML = all.map((p) => renderTile(p)).join('');
  mountAllVideos();
}

function renderTile(person, primary = false) {
  if (!person) return '';
  const isMe = person.id === state.me?.id;
  const stream = isMe ? (state.screenStream && state.media.screen ? state.screenStream : state.localStream) : state.streams.get(person.id);
  const showVideo = isMe ? state.media.camera || state.media.screen : person.camera || person.screen;
  const speaking = person.speaking;

  return `
    <div class="tile ${primary ? 'primary' : ''} ${person.screen ? 'screen' : ''} ${isMe ? 'mirror' : ''} ${speaking ? 'speaking' : ''}" id="tile-${person.id}" data-participant="${person.id}">
      ${showVideo && stream ? '' : `
        <div class="tile-avatar">
          <div class="disc face-${person.colorIndex ?? 0}">${esc(initials(person.name))}</div>
        </div>`}
      <div class="tile-badges">
        ${person.isHost ? `<span class="tile-badge host">${icon('shield')}Host</span>` : ''}
        ${person.handRaised ? `<span class="tile-badge hand">${icon('hand')}Hand</span>` : ''}
        ${person.screen ? `<span class="tile-badge">${icon('screen')}Sharing</span>` : ''}
      </div>
      <span class="tile-label">
        ${person.mic ? `<span class="mic-on">${icon('mic')}</span>` : `<span class="mic-off">${icon('mic-off')}</span>`}
        ${esc(person.name)}${isMe ? ' (you)' : ''}
      </span>
    </div>`;
}

function mountVideo(tileEl, stream, participantId) {
  let video = tileEl.querySelector('video');
  if (!video) {
    video = document.createElement('video');
    video.autoplay = true;
    video.playsInline = true;
    video.muted = participantId === state.me?.id;
    tileEl.prepend(video);
  }
  if (video.srcObject !== stream) {
    video.srcObject = stream;
    video.play().catch(() => {});
  }
}

function mountAllVideos() {
  for (const [participantId, stream] of state.streams) {
    const tile = document.getElementById(`tile-${participantId}`);
    if (tile && stream) mountVideo(tile, stream, participantId);
  }
}

function renderPresentation(presenting) {
  const all = participants();
  return `
    <div class="present-surface">
      <div class="present-main">
        ${presenting
          ? `<div class="present-tag">${icon('present')}${esc(presenting.addedBy)} is presenting</div>
             <div class="doc-icon">${icon('files')}</div>
             <h3>${esc(presenting.name)}</h3>
             <p>${presenting.policy?.viewOnly ? 'View only — download blocked by the host.' : 'Shared from organizer storage. ZMeet keeps the reference, not the file.'}</p>`
          : `<div class="present-tag">${icon('screen')}Presentation</div>
             <div class="doc-icon">${icon('screen')}</div>
             <h3>Waiting for the presenter</h3>
             <p>The host or a speaker can share a screen, a slide deck or a file into this surface.</p>`}
      </div>
      <div class="present-strip">
        ${all.slice(0, 4).map((p) => renderTile(p)).join('')}
      </div>
    </div>`;
}

function renderBoard() {
  const notes = (state.room?.whiteboard?.notes || [])
    .map(
      (n) => `<div class="sticky ${n.color || 'amber'}" style="left:${n.x || 30}px;top:${n.y || 30}px">
        ${esc(n.text)}<span class="who">${esc(n.author || '')}</span>
      </div>`
    )
    .join('');

  return `
    <div class="board">
      <canvas id="boardCanvas"></canvas>
      <div class="board-notes">${notes}</div>
      <div class="board-tools">
        <button class="active" data-tool="pen" title="Pen">✎</button>
        <button data-tool="eraser" title="Eraser">◻</button>
        <button data-tool="clear" title="Clear">${icon('trash')}</button>
        <button data-tool="close" title="Close board">${icon('close')}</button>
      </div>
    </div>`;
}

function bindBoard() {
  const canvas = $('#boardCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#2f6bff';
    ctx.lineWidth = 2.5;
  };
  resize();
  window.addEventListener('resize', resize, { once: true });

  let drawing = false;
  const strokes = [];

  canvas.addEventListener('pointerdown', (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    strokes.push({ x: e.offsetX, y: e.offsetY });
  });
  canvas.addEventListener('pointerup', () => {
    drawing = false;
    if (strokes.length) {
      api(`/api/rooms/${state.roomId}/whiteboard`, {
        method: 'POST',
        body: JSON.stringify({ strokes, notes: state.room?.whiteboard?.notes || [] })
      }).catch(() => {});
      strokes.length = 0;
    }
  });

  $$('.board-tools button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tool = btn.dataset.tool;
      if (tool === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        api(`/api/rooms/${state.roomId}/whiteboard`, {
          method: 'POST',
          body: JSON.stringify({ strokes: [], notes: state.room?.whiteboard?.notes || [] })
        }).catch(() => {});
        return;
      }
      if (tool === 'close') {
        state.widget.board = false;
        renderTiles();
        return;
      }
      $$('.board-tools button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      ctx.strokeStyle = tool === 'eraser' ? '#fbfcfd' : '#2f6bff';
      ctx.lineWidth = tool === 'eraser' ? 18 : 2.5;
    });
  });
}

/* ------------------------------ chrome ------------------------------ */

function renderChrome() {
  $('#roomTitle').textContent = state.room?.title || 'Meeting';
  $('#secureBadge').hidden = !state.room?.secure;

  const recPill = $('#recPill');
  const recording = state.room?.recording?.enabled;
  recPill.classList.toggle('idle', !recording);
  recPill.querySelector('span').textContent = recording ? 'REC' : 'REC';

  const micBtn = $('#btnMic');
  micBtn.classList.toggle('off', !state.media.mic);
  micBtn.querySelector('svg').innerHTML = `<use href="#i-${state.media.mic ? 'mic' : 'mic-off'}"/>`;
  micBtn.querySelector('span').textContent = state.media.mic ? 'Mute' : 'Unmute';
  micBtn.disabled = !can('mic:self') && !state.me?.isHost;

  const camBtn = $('#btnCamera');
  camBtn.classList.toggle('off', !state.media.camera);
  camBtn.querySelector('svg').innerHTML = `<use href="#i-${state.media.camera ? 'camera' : 'camera-off'}"/>`;
  camBtn.disabled = !can('camera:self') && !state.me?.isHost;

  const shareBtn = $('#btnShare');
  shareBtn.classList.toggle('share-live', state.media.screen);
  shareBtn.classList.toggle('active', state.media.screen);
  shareBtn.querySelector('svg').innerHTML = `<use href="#i-${state.media.screen ? 'screen-off' : 'screen'}"/>`;
  shareBtn.querySelector('span').textContent = state.media.screen ? 'Stop' : 'Share';
  shareBtn.disabled = !can('screen:share') && !state.me?.isHost;

  const recBtn = $('#btnRecord');
  recBtn.classList.toggle('rec-on', recording);
  recBtn.disabled = !can(recording ? 'record:stop' : 'record:start');

  const aiBtn = $('#btnAi');
  aiBtn.classList.toggle('active', state.activeRail === 'ai');

  $('#peopleBadge').textContent = participants().length;
  renderLowerThird();
  renderCountdown();
}

function renderLowerThird() {
  const lt = state.room?.lowerThird;
  const el = $('#lowerThird');
  if (!lt || !lt.enabled || !lt.name) {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  $('#ltName').textContent = lt.name;
  $('#ltTitle').textContent = lt.title || '';
}

function renderCountdown() {
  const cd = state.room?.countdown;
  const el = $('#countdownChip');
  if (!cd || !cd.running) {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  const elapsed = cd.startedAt ? Math.floor((Date.now() - new Date(cd.startedAt).getTime()) / 1000) : 0;
  const remaining = Math.max(0, cd.seconds - elapsed);
  $('#countdownText').textContent = `${cd.label} · ${clock(remaining * 1000)}`;
}

/* ------------------------------- rail ------------------------------- */

function selectRail(name) {
  state.activeRail = name;
  $$('.rail-tab').forEach((t) => t.classList.toggle('active', t.dataset.rail === name));
  $$('.rail-panel').forEach((p) => {
    p.hidden = p.dataset.panel !== name;
  });
  $('#room').classList.add('rail-open');
  if (window.innerWidth > 900) $('#room').classList.remove('rail-hidden');
  renderChrome();
}

function renderChat() {
  const list = $('#chatList');
  const messages = state.room?.chat || [];
  if (!messages.length) {
    list.innerHTML = `<div class="rail-empty">No messages yet. Say hello — or ask the AI for a summary.</div>`;
    return;
  }
  list.innerHTML = messages
    .map(
      (m) => `<div class="chat-row">
        <div class="chat-face face-${(m.author || '').length % 8}">${esc(initials(m.author))}</div>
        <div class="chat-main">
          <div class="chat-head">
            <span class="chat-author">${esc(m.author)}</span>
            <span class="chat-time">${fmtTime(m.at)}</span>
            ${m.role ? `<span class="chat-role">${esc(m.role)}</span>` : ''}
          </div>
          <div class="chat-text">${esc(m.text)}</div>
        </div>
      </div>`
    )
    .join('');
  list.scrollTop = list.scrollHeight;
}

function renderPeople() {
  const list = $('#peopleList');
  const all = participants();
  const waiting = state.room?.waitingCount || 0;

  const rows = all
    .map(
      (p) => `<div class="participant-row" data-participant="${p.id}">
        <div class="participant-face face-${p.colorIndex ?? 0}">
          ${esc(initials(p.name))}
          ${p.id === state.me?.id ? '<span class="ring"></span>' : ''}
        </div>
        <div class="participant-body">
          <div class="participant-name">${esc(p.name)}${p.id === state.me?.id ? ' (you)' : ''}</div>
          <div class="participant-role">${esc(p.roleLabel || p.role)}${p.handRaised ? ' · hand raised' : ''}</div>
        </div>
        <div class="participant-icons">
          <span class="${p.mic ? '' : 'muted'}">${icon(p.mic ? 'mic' : 'mic-off')}</span>
          ${p.camera ? icon('camera') : icon('camera-off')}
          ${isStaff() && p.id !== state.me?.id ? `<button class="participant-more" data-moderate="${p.id}" title="Moderate">${icon('more')}</button>` : ''}
        </div>
      </div>`
    )
    .join('');

  const waitingBlock = waiting && isStaff()
    ? `<div class="rail-section-title">Waiting room <span class="count">${waiting}</span><span class="spacer"></span>
         <button class="btn sm primary" id="btnAdmitAll">Admit all</button></div>
       <div class="rail-empty" id="waitingEntries">Loading…</div>`
    : '';

  list.innerHTML = `
    <div class="rail-section-title">In the room <span class="count">${all.length}</span></div>
    ${rows}
    ${waitingBlock}`;

  $$('#peopleList [data-moderate]').forEach((btn) => {
    btn.addEventListener('click', () => openModerateMenu(btn.dataset.moderate));
  });

  if (waiting && isStaff()) {
    loadWaitingEntries();
    $('#btnAdmitAll')?.addEventListener('click', async () => {
      try {
        await api(`/api/rooms/${state.roomId}/waiting/admit-all`, { method: 'POST', body: '{}' });
        toast('Everyone admitted');
        await refreshRoom();
      } catch (err) {
        showError(err);
      }
    });
  }
}

async function loadWaitingEntries() {
  try {
    const res = await api(`/api/rooms/${state.roomId}/waiting`);
    const el = $('#waitingEntries');
    if (!el) return;
    if (!res.entries.length) {
      el.textContent = 'Nobody is waiting.';
      return;
    }
    el.outerHTML = `<div class="rows" style="border:none;box-shadow:none">
      ${res.entries
        .map(
          (w) => `<div class="ai-item info" style="align-items:center">
            <div class="text" style="flex:1"><b>${esc(w.name)}</b><br><span style="font-size:11px;color:var(--stage-ink-3)">${esc(w.email || 'guest')}</span></div>
            <button class="btn sm approve" data-admit="${w.id}">Admit</button>
            <button class="btn sm dangerish" data-reject="${w.id}">Reject</button>
          </div>`
        )
        .join('')}
    </div>`;
    $$('[data-admit]').forEach((b) =>
      b.addEventListener('click', () => resolveWaiting(b.dataset.admit, true))
    );
    $$('[data-reject]').forEach((b) =>
      b.addEventListener('click', () => resolveWaiting(b.dataset.reject, false))
    );
  } catch {
    const el = $('#waitingEntries');
    if (el) el.textContent = 'Waiting room is only visible to hosts.';
  }
}

async function resolveWaiting(waitingId, admit) {
  try {
    await api(`/api/rooms/${state.roomId}/waiting/${waitingId}`, {
      method: 'POST',
      body: JSON.stringify({ admit })
    });
    toast(admit ? 'Admitted' : 'Rejected', admit ? 'success' : 'warn');
    await refreshRoom();
  } catch (err) {
    showError(err);
  }
}

function openModerateMenu(participantId) {
  const person = participants().find((p) => p.id === participantId);
  if (!person) return;
  showOverlay(
    person.name,
    `${person.roleLabel || person.role} · participant controls`,
    false,
    [
      { label: person.mic ? 'Mute' : 'Unmute', action: () => moderate(participantId, person.mic ? 'mute' : 'unmute') },
      { label: person.camera ? 'Turn camera off' : 'Allow camera', action: () => moderate(participantId, 'camera', !person.camera) },
      { label: 'Promote role', action: () => moderate(participantId, 'promote') },
      { label: 'Demote role', action: () => moderate(participantId, 'demote') },
      { label: 'Move to waiting room', action: () => moderate(participantId, 'waiting') },
      { label: 'Remove from meeting', action: () => moderate(participantId, 'remove') },
      { label: 'Cancel', action: hideOverlay }
    ]
  );
}

async function moderate(participantId, action, value) {
  try {
    await api(`/api/rooms/${state.roomId}/moderate`, {
      method: 'POST',
      body: JSON.stringify({ participantId, action, value })
    });
    hideOverlay();
    toast(`${action} applied`);
    await refreshRoom();
  } catch (err) {
    showError(err);
  }
}

/* -------------------------------- AI -------------------------------- */

function renderAi() {
  const list = $('#aiList');
  const room = state.room || {};
  const minutes = room.minutes;
  const decisions = room.decisions || [];
  const actions = room.actions || [];
  const open = room.openQuestions || [];
  const aiLabel = room.aiModeLabel || 'AI Assistant';

  list.innerHTML = `
    <div class="ai-hero">
      <div class="ai-hero-head">${icon('spark')}${esc(aiLabel)}</div>
      <p>${
        room.aiMode === 'off'
          ? 'AI access is off for this room. Nothing is read, transcribed or summarized.'
          : state.summary?.summary || 'Meeting summary in progress. Decisions and action items are detected as you talk.'
      }</p>
    </div>

    <div class="ai-list">
      <div class="ai-item ok">${icon('check')}<div class="text"><b>${esc(aiLabel)}</b> · ${room.aiCapabilities?.length || 0} capabilities granted</div></div>
      ${
        room.aiMode === 'off'
          ? ''
          : `<div class="ai-item info">${icon('notes')}<div class="text"><b>${decisions.length}</b> decision${decisions.length === 1 ? '' : 's'} detected · <b>${actions.length}</b> action item${actions.length === 1 ? '' : 's'}</div></div>
             <div class="ai-item ${open.length ? 'warn' : 'ok'}">${icon('qna')}<div class="text"><b>${open.length}</b> open question${open.length === 1 ? '' : 's'}</div></div>
             <div class="ai-item info">${icon('check')}<div class="text">${minutes ? `Minutes ${minutes.status} — ready to review` : 'Will share notes after the call'}</div></div>`
      }
    </div>

    ${actions.length ? `
    <div class="rail-section-title">Action items</div>
    <div class="ai-list">
      ${actions
        .slice(0, 6)
        .map(
          (a) => `<div class="ai-item ${a.approved ? 'ok' : 'warn'}">
            ${icon(a.approved ? 'check' : 'clock')}
            <div class="text" style="flex:1"><b>${esc(a.owner || 'Unassigned')}</b> → ${esc(a.task)}${a.deadline ? `<br><span style="font-size:11px;color:var(--stage-ink-3)">by ${esc(a.deadline)}</span>` : ''}</div>
            ${isStaff() && !a.approved ? `<button class="btn sm approve" data-approve="${a.id}">Approve</button>` : ''}
          </div>`
        )
        .join('')}
    </div>` : ''}

    ${decisions.length ? `
    <div class="rail-section-title">Decisions</div>
    <div class="ai-list">
      ${decisions
        .slice(0, 5)
        .map(
          (d) => `<div class="ai-item ok">${icon('check')}<div class="text">${esc(d.text)}</div></div>`
        )
        .join('')}
    </div>` : open.length ? `
    <div class="rail-section-title">Open questions</div>
    <div class="ai-list">
      ${open.slice(0, 5).map((q) => `<div class="ai-item warn">${icon('qna')}<div class="text">${esc(q.text)}</div></div>`).join('')}
    </div>` : ''}

    ${state.aiMessages.length ? `
    <div class="rail-section-title">Agent answers</div>
    <div class="ai-list">
      ${state.aiMessages
        .slice(-4)
        .map((m) => `<div class="chat-ai"><div class="chat-ai-head">${icon('spark')}ZMeet AI</div><div class="chat-text">${esc(m.text)}</div></div>`)
        .join('')}
    </div>` : ''}

    <div class="rail-section-title">Ask</div>
    <div class="ai-prompt">
      ${['Summarize what we decided', 'What is unresolved?', 'Give me the last 5 minutes', 'Draft a follow-up email', 'Turn the whiteboard into a plan']
        .map((q) => `<button data-prompt="${esc(q)}">${esc(q)}</button>`)
        .join('')}
    </div>`;

  $$('#aiList [data-prompt]').forEach((btn) => {
    btn.addEventListener('click', () => askAi(btn.dataset.prompt));
  });
  $$('#aiList [data-approve]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await api(`/api/rooms/${state.roomId}/ai/actions/${btn.dataset.approve}`, {
          method: 'POST',
          body: JSON.stringify({ approved: true })
        });
        toast('Action approved');
        await refreshRoom();
      } catch (err) {
        showError(err);
      }
    });
  });
}

async function askAi(query) {
  try {
    const res = await api(`/api/rooms/${state.roomId}/ai/command`, {
      method: 'POST',
      body: JSON.stringify({ query })
    });
    state.aiMessages.push({ text: res.answer, at: new Date().toISOString() });
    if (res.data?.summary) state.summary = res.data;
    renderAi();
    selectRail('ai');
  } catch (err) {
    if (err.data?.needsPermission) {
      toast('The AI boundary does not allow this. Ask the host to widen it.', 'warn');
    } else {
      showError(err);
    }
  }
}

/* ------------------------------- more ------------------------------- */

function renderMore() {
  const list = $('#moreList');
  if (!list) return;
  const room = state.room || {};
  const files = room.files || [];
  const polls = room.polls || [];
  const scenes = room.scenes || [];

  list.innerHTML = `
    <div class="rail-section-title">Meeting</div>
    <div class="ai-list">
      <button class="ai-item info" data-tool="board" style="cursor:pointer">
        ${icon('board')}<div class="text"><b>Whiteboard</b><br><span style="font-size:11px;color:var(--stage-ink-3)">Shared drawing surface · AI can read it with permission</span></div>
      </button>
      <button class="ai-item info" data-tool="layout" style="cursor:pointer">
        ${icon('grid')}<div class="text"><b>Layout</b><br><span style="font-size:11px;color:var(--stage-ink-3)">Currently ${esc(room.layout || 'gallery')}</span></div>
      </button>
      <button class="ai-item info" data-tool="files" style="cursor:pointer">
        ${icon('files')}<div class="text"><b>Files</b><br><span style="font-size:11px;color:var(--stage-ink-3)">${files.length} in this sandbox</span></div>
      </button>
      <button class="ai-item info" data-tool="polls" style="cursor:pointer">
        ${icon('poll')}<div class="text"><b>Polls &amp; Q&amp;A</b><br><span style="font-size:11px;color:var(--stage-ink-3)">${polls.length} poll${polls.length === 1 ? '' : 's'}</span></div>
      </button>
      <button class="ai-item info" data-tool="minutes" style="cursor:pointer">
        ${icon('notes')}<div class="text"><b>Minutes &amp; report</b><br><span style="font-size:11px;color:var(--stage-ink-3)">AI draft · you approve</span></div>
      </button>
      ${scenes.length ? `<button class="ai-item info" data-tool="scenes" style="cursor:pointer">
        ${icon('broadcast')}<div class="text"><b>Live studio</b><br><span style="font-size:11px;color:var(--stage-ink-3)">${scenes.length} scenes · ${room.streaming?.active ? 'streaming' : 'ready'}</span></div>
      </button>` : ''}
      <button class="ai-item info" data-tool="storage" style="cursor:pointer">
        ${icon('storage')}<div class="text"><b>Storage</b><br><span style="font-size:11px;color:var(--stage-ink-3)">${esc(room.storage?.location || 'your workspace')}</span></div>
      </button>
    </div>

    ${isStaff() ? `
    <div class="rail-section-title">AI boundary</div>
    <div class="ai-list">
      ${['off', 'observe', 'assistant', 'notetaker', 'full']
        .map(
          (mode) => `<button class="ai-item ${room.aiMode === mode ? 'ok' : 'info'}" data-aimode="${mode}" style="cursor:pointer;text-align:left">
            ${icon(room.aiMode === mode ? 'check' : 'shield')}
            <div class="text"><b>${{ off: 'AI OFF', observe: 'AI Observe', assistant: 'AI Assistant', notetaker: 'AI Note-taker', full: 'AI Full Access' }[mode]}</b>
            ${room.aiMode === mode ? ' · active' : ''}</div>
          </button>`
        )
        .join('')}
    </div>` : ''}
  `;

  $$('#moreList [data-tool]').forEach((btn) => {
    btn.addEventListener('click', () => openTool(btn.dataset.tool));
  });
  $$('#moreList [data-aimode]').forEach((btn) => {
    btn.addEventListener('click', () => setAiMode(btn.dataset.aimode));
  });
}

async function setAiMode(mode) {
  try {
    const res = await api(`/api/rooms/${state.roomId}/ai/mode`, {
      method: 'POST',
      body: JSON.stringify({ mode })
    });
    state.room.aiMode = res.mode;
    state.room.aiModeLabel = res.label;
    state.room.aiCapabilities = res.capabilities;
    toast(`AI boundary: ${res.label}`);
    renderMore();
    renderAi();
  } catch (err) {
    showError(err);
  }
}

function openTool(tool) {
  if (tool === 'board') {
    state.widget.board = true;
    renderTiles();
    return;
  }
  if (tool === 'layout') {
    showOverlay('Layout', 'Choose how the room is arranged.', false, [
      { label: 'Gallery', action: () => setLayout('gallery') },
      { label: 'Speaker', action: () => setLayout('speaker') },
      { label: 'Presentation', action: () => setLayout('presentation') },
      { label: 'Interview', action: () => setLayout('interview') },
      { label: 'Studio', action: () => setLayout('studio') },
      { label: 'Cancel', action: hideOverlay }
    ]);
    return;
  }
  if (tool === 'files') return openFiles();
  if (tool === 'polls') return openPolls();
  if (tool === 'minutes') return openMinutes();
  if (tool === 'scenes') return openScenes();
  if (tool === 'storage') return openStorage();
  return undefined;
}

async function setLayout(layout) {
  try {
    await api(`/api/rooms/${state.roomId}/layout`, { method: 'POST', body: JSON.stringify({ layout }) });
    state.room.layout = layout;
    hideOverlay();
    renderTiles();
  } catch (err) {
    showError(err);
  }
}

function openFiles() {
  const files = state.room?.files || [];
  showOverlay(
    'Meeting files',
    'Every file is a pointer into your own storage, with a four-switch policy.',
    false,
    [{ label: 'Close', action: hideOverlay }],
    files.length
      ? `<div class="ai-list" style="width:100%;max-width:420px;margin-top:14px">
          ${files
            .map(
              (f) => `<div class="ai-item info" style="align-items:center">
                ${icon('files')}
                <div class="text" style="flex:1"><b>${esc(f.name)}</b><br><span style="font-size:11px;color:var(--stage-ink-3)">${f.policy?.viewOnly ? 'view only · ' : ''}${f.policy?.downloadAllowed ? 'download' : 'no download'}${f.policy?.aiAccess ? ' · AI can read' : ''}</span></div>
                ${can('file:present') ? `<button class="btn sm" data-present="${f.id}">Present</button>` : ''}
              </div>`
            )
            .join('')}
        </div>`
      : `<p style="margin-top:14px">No files yet. The host can add references to decks, PDFs and sheets.</p>`
  );
  $$('[data-present]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await api(`/api/rooms/${state.roomId}/files/${btn.dataset.present}/present`, {
          method: 'POST',
          body: '{}'
        });
        hideOverlay();
        toast('Presenting');
        await refreshRoom();
      } catch (err) {
        showError(err);
      }
    });
  });
}

function openPolls() {
  const polls = state.room?.polls || [];
  const qna = state.room?.qna || [];
  showOverlay(
    'Polls & Q&A',
    'Vote, ask, and let the AI summarize the result.',
    false,
    [{ label: 'Close', action: hideOverlay }],
    `<div class="ai-list" style="width:100%;max-width:440px;margin-top:14px">
      ${polls
        .map(
          (p) => `<div class="ai-item info" style="flex-direction:column;align-items:stretch;gap:6px">
            <div class="text"><b>${esc(p.question)}</b> ${p.status === 'closed' ? '· closed' : ''}</div>
            ${p.options
              .map(
                (o) => `<button class="btn sm" data-vote="${p.id}:${o.id}" ${p.status === 'closed' ? 'disabled' : ''} style="justify-content:space-between">
                  <span>${esc(o.label)}</span><span class="chip">${o.votes.length}</span>
                </button>`
              )
              .join('')}
            ${p.result ? `<div style="font-size:11.5px;color:var(--stage-ink-2)">${esc(p.result.summary)}</div>` : ''}
            ${isStaff() && p.status === 'open' ? `<button class="btn sm primary" data-close-poll="${p.id}">Close poll</button>` : ''}
            ${isStaff() && p.status === 'closed' ? `<button class="btn sm approve" data-poll-decision="${p.id}">Make it a decision</button>` : ''}
          </div>`
        )
        .join('') || '<p>No polls yet.</p>'}
      ${qna.length ? qna.map((q) => `<div class="ai-item warn">${icon('qna')}<div class="text">${esc(q.question)}</div></div>`).join('') : ''}
      ${isStaff() ? `<button class="btn sm" id="btnNewPoll">${icon('poll')}New poll</button>` : ''}
    </div>`
  );

  $$('[data-vote]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const [pollId, optionId] = btn.dataset.vote.split(':');
      try {
        await api(`/api/rooms/${state.roomId}/polls/${pollId}/vote`, {
          method: 'POST',
          body: JSON.stringify({ optionId, participantId: state.me?.id })
        });
        await refreshRoom();
        openPolls();
      } catch (err) {
        showError(err);
      }
    });
  });

  $$('[data-close-poll]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await api(`/api/rooms/${state.roomId}/polls/${btn.dataset.closePoll}/close`, { method: 'POST', body: '{}' });
        await refreshRoom();
        openPolls();
      } catch (err) {
        showError(err);
      }
    });
  });

  $$('[data-poll-decision]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await api(`/api/rooms/${state.roomId}/polls/${btn.dataset.pollDecision}/decision`, { method: 'POST', body: '{}' });
        toast('Recorded as a decision');
        await refreshRoom();
      } catch (err) {
        showError(err);
      }
    });
  });

  $('#btnNewPoll')?.addEventListener('click', createPoll);
}

async function createPoll() {
  const question = window.prompt('Poll question');
  if (!question) return;
  const optionsRaw = window.prompt('Options, separated by commas', 'Yes, No');
  if (!optionsRaw) return;
  try {
    await api(`/api/rooms/${state.roomId}/polls`, {
      method: 'POST',
      body: JSON.stringify({ question, options: optionsRaw.split(',').map((o) => o.trim()) })
    });
    await refreshRoom();
    openPolls();
  } catch (err) {
    showError(err);
  }
}

async function openMinutes() {
  try {
    const minutes = await api(`/api/rooms/${state.roomId}/minutes`);
    showOverlay(
      'Minutes',
      `Status: ${minutes.status} · generated by ${minutes.generatedBy}`,
      false,
      [
        ...(isStaff() ? [{ label: minutes.status === 'approved' ? 'Approved' : 'Approve', action: () => approveMinutes() }] : []),
        { label: 'Close', action: hideOverlay }
      ],
      `<div class="ai-list" style="width:100%;max-width:460px;margin-top:14px;max-height:300px;overflow:auto">
        <div class="ai-item info">${icon('notes')}<div class="text">${esc(minutes.summary)}</div></div>
        ${minutes.decisions.map((d) => `<div class="ai-item ok">${icon('check')}<div class="text">${esc(d.text)}</div></div>`).join('')}
        ${minutes.actions.map((a) => `<div class="ai-item warn">${icon('clock')}<div class="text"><b>${esc(a.owner)}</b> → ${esc(a.task)}</div></div>`).join('')}
        ${minutes.openQuestions.map((q) => `<div class="ai-item warn">${icon('qna')}<div class="text">${esc(q.text)}</div></div>`).join('')}
      </div>`
    );
  } catch (err) {
    showError(err);
  }
}

async function approveMinutes() {
  try {
    await api(`/api/rooms/${state.roomId}/minutes/approve`, { method: 'POST', body: '{}' });
    hideOverlay();
    toast('Minutes approved — ready to send');
  } catch (err) {
    showError(err);
  }
}

async function openScenes() {
  try {
    const studio = await api(`/api/rooms/${state.roomId}/studio`);
    showOverlay(
      'Live studio',
      `${studio.scenes.length} scenes · ${studio.streaming?.active ? 'streaming' : 'not streaming'}`,
      false,
      [{ label: 'Close', action: hideOverlay }],
      `<div class="scene-grid" style="width:100%;max-width:420px;margin-top:14px">
        ${studio.scenes
          .map(
            (s) => `<button class="scene-btn ${s.active ? 'active' : ''}" data-scene="${s.id}">
              <strong>${esc(s.name)}</strong><span>${esc(s.layout)} · ${s.slots.length} source${s.slots.length === 1 ? '' : 's'}</span>
            </button>`
          )
          .join('')}
      </div>`
    );
    $$('[data-scene]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          await api(`/api/rooms/${state.roomId}/scenes/${btn.dataset.scene}/switch`, { method: 'POST', body: '{}' });
          hideOverlay();
          toast('Scene switched');
          await refreshRoom();
        } catch (err) {
          showError(err);
        }
      });
    });
  } catch (err) {
    showError(err);
  }
}

function openStorage() {
  const s = state.room?.storage || {};
  showOverlay(
    'Storage',
    s.location || 'Your workspace',
    false,
    [{ label: 'Close', action: hideOverlay }],
    `<div class="ai-list" style="width:100%;max-width:400px;margin-top:14px">
      <div class="ai-item info">${icon('storage')}<div class="text"><b>Policy</b><br>${esc(s.policy || 'organization')} · retention ${s.retentionDays || 90} days</div></div>
      <div class="ai-item info">${icon('shield')}<div class="text">ZMeet stores references only. Recordings, transcripts and files stay in your storage — never duplicated here.</div></div>
    </div>`
  );
}

/* ------------------------------ overlays ------------------------------ */

function showOverlay(title, message, spinner = false, actions = [], extraHtml = '') {
  const overlay = $('#overlay');
  const inner = $('#overlayInner');
  inner.innerHTML = `
    ${spinner ? '<div class="overlay-spinner"></div>' : ''}
    <h2>${esc(title)}</h2>
    <p>${esc(message)}</p>
    ${extraHtml}
    ${actions.length ? `<div class="overlay-actions">${actions.map((a, i) => `<button class="btn ${i === 0 ? 'primary' : ''}" data-overlay-action="${i}">${esc(a.label)}</button>`).join('')}</div>` : ''}`;
  overlay.hidden = false;
  $$('[data-overlay-action]').forEach((btn) => {
    btn.addEventListener('click', () => actions[Number(btn.dataset.overlayAction)].action());
  });
}

function hideOverlay() {
  $('#overlay').hidden = true;
}

function renderWaiting(message) {
  showOverlay(
    'Waiting room',
    message || 'The host will admit you shortly. Keep this tab open.',
    false,
    [],
    `<div class="overlay-spinner" style="margin-top:16px"></div>`
  );
}

function floatReaction(emoji) {
  const el = document.createElement('div');
  el.textContent = emoji;
  el.style.cssText = `position:fixed;bottom:110px;left:${40 + Math.random() * 60}%;font-size:30px;z-index:80;pointer-events:none;transition:transform 1.6s ease-out,opacity 1.6s ease-out`;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.transform = 'translateY(-180px)';
    el.style.opacity = '0';
  });
  setTimeout(() => el.remove(), 1700);
}

/* ============================================================
   Actions
   ============================================================ */

async function refreshRoom() {
  try {
    const room = await api(`/api/rooms/${state.roomId}`);
    state.room = { ...state.room, ...room };
    renderChrome();
    renderTiles();
    renderPeople();
    renderAi();
    renderMore();
  } catch {
    /* keep the last good state */
  }
}

function startTimer() {
  if (state.timerHandle) clearInterval(state.timerHandle);
  const startedAt = state.room?.startedAt || new Date().toISOString();
  state.timerHandle = setInterval(() => {
    const elapsed = Date.now() - new Date(startedAt).getTime();
    $('#timerValue').textContent = clock(elapsed);
    renderCountdown();
  }, 1000);
  $('#timerValue').textContent = clock(Date.now() - new Date(startedAt).getTime());
}

async function toggleRecord() {
  const recording = state.room?.recording?.enabled;
  try {
    const res = await api(`/api/rooms/${state.roomId}/record`, {
      method: 'POST',
      body: JSON.stringify({ start: !recording })
    });
    state.room.recording = res.recording;
    state.room.recordings = res.recordings;
    renderChrome();
    toast(recording ? 'Recording stopped — stored in your workspace' : 'Recording started — everyone can see this');
  } catch (err) {
    showError(err);
  }
}

function leaveMeeting() {
  showOverlay(
    'Leave the meeting?',
    'The meeting continues for everyone else. Your notes will be ready when it ends.',
    false,
    [
      { label: 'Leave', action: async () => {
        try {
          await api(`/api/rooms/${state.roomId}/leave`, {
            method: 'POST',
            body: JSON.stringify({ participantId: state.me?.id })
          });
        } catch {
          /* leaving is best-effort */
        }
        teardown();
        window.location.href = '/';
      } },
      { label: 'Stay', action: hideOverlay }
    ]
  );
}

function teardown() {
  if (state.localStream) for (const t of state.localStream.getTracks()) t.stop();
  if (state.screenStream) for (const t of state.screenStream.getTracks()) t.stop();
  for (const [, peer] of state.peers) peer.pc.close();
  state.peers.clear();
  if (state.ws) state.ws.close();
  if (state.timerHandle) clearInterval(state.timerHandle);
}

/* ============================================================
   Chrome bindings
   ============================================================ */

function bindChrome() {
  $('#btnMic').addEventListener('click', toggleMic);
  $('#btnCamera').addEventListener('click', toggleCamera);
  $('#btnShare').addEventListener('click', toggleScreen);
  $('#btnChat').addEventListener('click', () => selectRail('chat'));
  $('#btnPeople').addEventListener('click', () => selectRail('people'));
  $('#btnAi').addEventListener('click', () => selectRail('ai'));
  $('#btnRecord').addEventListener('click', toggleRecord);
  $('#btnMore').addEventListener('click', () => {
    selectRail('more');
    renderMore();
  });
  $('#btnLeave').addEventListener('click', leaveMeeting);

  $('#btnToggleRail').addEventListener('click', () => {
    $('#room').classList.toggle('rail-hidden');
  });
  $('#btnRailClose').addEventListener('click', () => {
    $('#room').classList.remove('rail-open');
    $('#room').classList.add('rail-hidden');
  });
  $('#btnRoomSettings').addEventListener('click', () => {
    selectRail('more');
    renderMore();
  });

  $$('.rail-tab').forEach((tab) => {
    tab.addEventListener('click', () => selectRail(tab.dataset.rail));
  });

  $('#chatForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#chatInput');
    const text = input.value.trim();
    if (!text) return;
    send({ t: 'chat', text });
    input.value = '';
  });

  $('#aiForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#aiInput');
    const query = input.value.trim();
    if (!query) return;
    input.value = '';
    askAi(query);
  });

  $('#btnCloseMore').addEventListener('click', () => ($('#moreModal').hidden = true));

  $('#btnChatAttach').addEventListener('click', () => {
    toast('Attach a file reference from the dashboard file sandbox', 'warn');
  });

  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    if (e.key === 'm') toggleMic();
    if (e.key === 'v') toggleCamera();
    if (e.key === 'c') selectRail('chat');
    if (e.key === 'p') selectRail('people');
    if (e.key === 'a') selectRail('ai');
    if (e.key === 'Escape') hideOverlay();
  });

  window.addEventListener('beforeunload', () => {
    if (state.ws) state.ws.close();
  });
}

/* expose a couple of helpers for debugging without leaking secrets */
window.ZMeetRoom = {
  get state() {
    return { roomId: state.roomId, role: state.me?.role, peers: state.peers.size };
  }
};
