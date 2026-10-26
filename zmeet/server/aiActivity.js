/**
 * ZMeet — AI Activity log (prompt §38).
 * (was: ZenMeet)
 *
 * Every consequential AI action is inspectable: what it did, for which room,
 * under which capability, and whether a human approved it. The log is
 * append-only and capped.
 */

import { store } from './store.js';
import { id, nowIso } from './util.js';

const MAX = 500;

export const ACTIVITY_KINDS = {
  agenda: 'Agenda',
  availability: 'Availability',
  room: 'Meeting',
  prepare: 'Preparation',
  summary: 'Summary',
  actions: 'Action items',
  minutes: 'Minutes',
  followup: 'Follow-up',
  calendar: 'Calendar',
  recording: 'Recording',
  stream: 'Live',
  permission: 'Permission',
  search: 'Memory'
};

export function logActivity({ roomId = null, kind = 'summary', title, detail = '', capability = null, approved = null, meta = null }) {
  const entry = {
    id: id('act'),
    roomId,
    kind,
    kindLabel: ACTIVITY_KINDS[kind] || kind,
    title,
    detail,
    capability,
    approved,
    meta,
    at: nowIso()
  };
  store.state.aiActivity = [entry, ...(store.state.aiActivity || [])].slice(0, MAX);
  store.persist();
  return entry;
}

export function listActivity({ roomId = null, kind = null, limit = 80 } = {}) {
  let items = store.state.aiActivity || [];
  if (roomId) items = items.filter((a) => a.roomId === roomId);
  if (kind) items = items.filter((a) => a.kind === kind);
  return items.slice(0, limit);
}

export function clearActivity({ roomId = null, actor = 'host' } = {}) {
  store.state.aiActivity = roomId ? (store.state.aiActivity || []).filter((a) => a.roomId !== roomId) : [];
  store.persist();
  store.log('AI_ACTIVITY_CLEARED', roomId ? `AI activity cleared for ${roomId}.` : 'AI activity cleared.', { actor });
  return { cleared: true };
}

export function activitySummary() {
  const items = store.state.aiActivity || [];
  const byKind = {};
  for (const item of items) byKind[item.kindLabel] = (byKind[item.kindLabel] || 0) + 1;
  return { total: items.length, byKind, latest: items.slice(0, 8) };
}
