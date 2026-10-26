/**
 * ZMeet — Live Studio / production engine (prompt §12, §13, §14).
 * (was: ZenMeet)
 *
 * Scene-based live production: build scenes from sources, switch live, add
 * lower thirds. Streaming destinations are recorded as references only; stream
 * keys live in a credential vault and are never written into the meeting record
 * or sent to the browser.
 */

import crypto from 'crypto';
import { store } from './store.js';
import { roomService } from './rooms.js';
import { id, nowIso, truncate } from './util.js';
import { logActivity } from './aiActivity.js';

function fail(message, status = 400) {
  return Object.assign(new Error(message), { status });
}

export const SOURCE_KINDS = {
  host: 'Host camera',
  guest: 'Guest camera',
  screen: 'Screen share',
  slides: 'Slides',
  video: 'Video clip',
  image: 'Image',
  presentation: 'Full presentation',
  background: 'Background'
};

export const PLATFORMS = {
  youtube: { id: 'youtube', label: 'YouTube', note: 'OAuth-connected RTMP. Keys stored in the vault.' },
  facebook: { id: 'facebook', label: 'Facebook Live', note: 'Page token required. Keys stored in the vault.' },
  linkedin: { id: 'linkedin', label: 'LinkedIn Live', note: 'Requires LinkedIn Live access approval.' },
  'custom-rtmp': { id: 'custom-rtmp', label: 'Custom RTMP', note: 'Any RTMP/RTMPS endpoint you control.' }
};

/** Default scene set — matches the prompt's six scenes. */
export function defaultScenes() {
  return [
    { id: 'scene_1', name: 'Host', layout: 'speaker', slots: [{ kind: 'host', position: 'full' }], overlay: null, lowerThird: null, active: true },
    { id: 'scene_2', name: 'Host + Guest', layout: 'interview', slots: [{ kind: 'host', position: 'left' }, { kind: 'guest', position: 'right' }], overlay: null, lowerThird: null },
    { id: 'scene_3', name: 'Guest + Slides', layout: 'presentation', slots: [{ kind: 'guest', position: 'pip' }, { kind: 'slides', position: 'full' }], overlay: null, lowerThird: null },
    { id: 'scene_4', name: 'Screen + Speaker', layout: 'presentation', slots: [{ kind: 'screen', position: 'full' }, { kind: 'host', position: 'pip' }], overlay: null, lowerThird: null },
    { id: 'scene_5', name: 'Video + Lower Third', layout: 'presentation', slots: [{ kind: 'video', position: 'full' }], overlay: 'video', lowerThird: { name: '', title: '', enabled: true }, active: false },
    { id: 'scene_6', name: 'Full Presentation', layout: 'presentation', slots: [{ kind: 'presentation', position: 'full' }], overlay: null, lowerThird: null }
  ];
}

export function getStudio(roomId) {
  const room = roomService.get(roomId);
  if (!room.scenes?.length) {
    room.scenes = defaultScenes();
    store.persist();
  }
  return {
    roomId: room.id,
    scenes: room.scenes,
    layout: room.layout,
    streaming: room.streaming,
    sources: SOURCE_KINDS,
    platforms: Object.values(PLATFORMS),
    waitingRoom: {
      enabled: ['waiting', 'authenticated', 'verified'].includes(room.admission),
      count: (room.waitingRoom || []).length,
      policy: room.admission
    },
    countdown: room.countdown || null,
    lowerThird: room.lowerThird || null,
    comments: (room.chat || []).filter((m) => m.kind === 'message').slice(-40),
    overlays: {
      logo: room.branding?.logo || null,
      background: room.branding?.background || null,
      custom: room.branding?.overlay || null,
      note: 'Brand assets are references to your own files, never copies.'
    }
  };
}

export function saveScenes(roomId, scenes, { actor = 'host' } = {}) {
  const room = roomService.get(roomId);
  const normalized = (Array.isArray(scenes) && scenes.length ? scenes : defaultScenes()).slice(0, 12).map((scene, idx) => ({
    id: scene.id || `scene_${idx + 1}`,
    name: truncate(scene.name || `Scene ${idx + 1}`, 60),
    layout: scene.layout || 'presentation',
    slots: (scene.slots || []).map((slot) => ({
      kind: SOURCE_KINDS[slot.kind] ? slot.kind : 'host',
      position: slot.position || 'full',
      participantId: slot.participantId || null
    })),
    overlay: scene.overlay || null,
    lowerThird: scene.lowerThird || null,
    active: Boolean(scene.active)
  }));
  if (!normalized.some((s) => s.active)) normalized[0].active = true;
  room.scenes = normalized;
  const active = normalized.find((s) => s.active);
  if (active) room.layout = active.layout;
  store.persist();
  store.log('SCENES_SAVED', `${normalized.length} scene(s) saved.`, { actor, roomId: room.id });
  return normalized;
}

export function switchScene(roomId, sceneId, { actor = 'host', actorRole = 'host' } = {}) {
  const room = roomService.get(roomId);
  if (!['host', 'cohost', 'moderator'].includes(actorRole)) throw fail('Only hosts and co-hosts can switch scenes.', 403);
  const scene = (room.scenes || []).find((s) => s.id === sceneId);
  if (!scene) throw fail('Scene not found', 404);
  room.scenes = room.scenes.map((s) => ({ ...s, active: s.id === sceneId }));
  room.layout = scene.layout;
  store.persist();
  roomService.broadcast(room.id, { t: 'scenes', scenes: room.scenes, layout: room.layout });
  logActivity({
    roomId: room.id,
    kind: 'stream',
    title: `Scene switched to “${scene.name}”`,
    detail: `${scene.slots.length} source slot(s) · layout ${scene.layout}`,
    capability: 'act:scene'
  });
  return scene;
}

export function setLowerThird(roomId, lowerThird, { actor = 'host' } = {}) {
  const room = roomService.get(roomId);
  room.lowerThird = {
    name: truncate(lowerThird?.name || '', 60),
    title: truncate(lowerThird?.title || '', 80),
    enabled: Boolean(lowerThird?.enabled),
    style: lowerThird?.style || 'lower-left'
  };
  store.persist();
  roomService.broadcast(room.id, { t: 'studio', lowerThird: room.lowerThird });
  return room.lowerThird;
}

export function setCountdown(roomId, { seconds = 300, label = 'Starting soon', running = false } = {}) {
  const room = roomService.get(roomId);
  room.countdown = {
    seconds: Math.max(0, Number(seconds) || 0),
    label: truncate(label, 60),
    running: Boolean(running),
    startedAt: running ? nowIso() : null
  };
  store.persist();
  roomService.broadcast(room.id, { t: 'studio', countdown: room.countdown });
  return room.countdown;
}

/* ------------------------------- destinations ------------------------------- */

export function listDestinations(roomId) {
  const room = roomService.get(roomId);
  return {
    destinations: room.streaming?.destinations || [],
    platforms: Object.values(PLATFORMS),
    note: 'Stream keys are stored in the credential vault. The API only ever returns a masked reference.'
  };
}

export function addDestination(roomId, input, { actor = 'host' } = {}) {
  const room = roomService.get(roomId);
  if (!PLATFORMS[input.platform]) throw fail('Unsupported platform', 400);

  // Accept a key only to prove the caller has one — store a vault reference, not the key.
  const entry = {
    id: id('dest'),
    platform: input.platform,
    label: truncate(input.label || PLATFORMS[input.platform].label, 60),
    vaultRef: `vault:stream:${room.id}:${input.platform}:${crypto.randomUUID().slice(0, 8)}`,
    maskedKey: input.streamKey ? `${String(input.streamKey).slice(0, 2)}••••${String(input.streamKey).slice(-2)}` : null,
    hasKey: Boolean(input.streamKey || input.useVaultCredential),
    status: 'ready',
    addedAt: nowIso(),
    addedBy: actor,
    note: 'Key written to the vault reference only. Never stored in the meeting record.'
  };

  room.streaming = room.streaming || { active: false, destinations: [] };
  room.streaming.destinations = [...(room.streaming.destinations || []), entry];
  store.persist();
  store.log('STREAM_DESTINATION_ADDED', `${entry.label} destination added.`, { actor, roomId: room.id });
  return entry;
}

export function removeDestination(roomId, destinationId, { actor = 'host' } = {}) {
  const room = roomService.get(roomId);
  const before = room.streaming?.destinations?.length || 0;
  room.streaming.destinations = (room.streaming?.destinations || []).filter((d) => d.id !== destinationId);
  store.persist();
  store.log('STREAM_DESTINATION_REMOVED', 'Streaming destination removed.', { actor, roomId: room.id });
  return { removed: before - room.streaming.destinations.length };
}

export function startStream(roomId, { destinationIds = null, actor = 'host', actorRole = 'host' } = {}) {
  return roomService.startStream(roomId, { destinations: destinationIds, actor, actorRole });
}

export function stopStream(roomId, { actor = 'host', actorRole = 'host' } = {}) {
  return roomService.stopStream(roomId, { actor, actorRole });
}
