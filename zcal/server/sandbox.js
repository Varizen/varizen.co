/**
 * ZCal — Scheduling Sandbox (prompt §7, §8, §10). (was: ZenCalendar)
 *
 * The sandbox is an isolated execution environment. A proposal is a diff against
 * the real calendar that is computed *without* touching any provider. Only an
 * explicit `apply` call (permission `Act`) writes through to the owning provider.
 *
 * Capability model — every capability is permission-controlled:
 *   read:availability, read:events, propose, modify, cancel,
 *   create:invitation, send:invitation, send:communication
 */

import crypto from 'crypto';
import { store } from './store.js';
import { calendarService } from './calendarService.js';
import { addDays, addMinutes, dateKey, durationMinutes, overlaps, startOfDay } from './util.js';

export const CAPABILITIES = {
  'read:availability': 'Read availability',
  'read:events': 'Read events',
  propose: 'Create proposal',
  modify: 'Modify event',
  cancel: 'Cancel event',
  'create:invitation': 'Create invitation',
  'send:invitation': 'Send invitation',
  'send:communication': 'Send scheduling communication'
};

export const PERMISSION_LEVELS = {
  read: ['read:availability', 'read:events'],
  suggest: ['read:availability', 'read:events', 'propose'],
  prepare: ['read:availability', 'read:events', 'propose', 'modify', 'cancel', 'create:invitation'],
  act: ['read:availability', 'read:events', 'propose', 'modify', 'cancel', 'create:invitation', 'send:invitation'],
  communicate: Object.keys(CAPABILITIES)
};

/** Actions that always require an explicit user grant. */
export const SENSITIVE_CAPABILITIES = new Set(['send:invitation', 'send:communication', 'cancel']);

function nowIso() {
  return new Date().toISOString();
}

class Sandbox {
  constructor() {
    if (!store.state.permissionGrants) store.state.permissionGrants = [];
  }

  /* --------------------------- permissions --------------------------- */

  grants() {
    return store.state.permissionGrants;
  }

  hasCapability(capability) {
    const grant = store.state.permissionGrants.find((g) => g.capability === capability);
    return Boolean(grant?.granted);
  }

  /** True when every capability of a permission level has been granted. */
  hasLevel(level) {
    const caps = PERMISSION_LEVELS[level];
    if (!caps) return false;
    return caps.every((c) => this.hasCapability(c));
  }

  requireLevel(level) {
    if (this.hasLevel(level)) return true;
    const err = Object.assign(
      new Error(`Permission required: the “${level}” level. Grant it explicitly before this action.`),
      { status: 403, needsPermission: true, level }
    );
    throw err;
  }

  /** Grant a whole permission level, or a single capability. */
  grant(levelOrCapability, { level = null, actor = 'user', scope = 'all', expiresInMinutes = null } = {}) {
    const caps = PERMISSION_LEVELS[levelOrCapability] || (CAPABILITIES[levelOrCapability] ? [levelOrCapability] : null);
    if (!caps) throw Object.assign(new Error(`Unknown capability or level “${levelOrCapability}”`), { status: 400 });

    for (const capability of caps) {
      const existing = store.state.permissionGrants.find((g) => g.capability === capability && g.scope === scope);
      const grant = {
        id: existing?.id || `grant_${crypto.randomUUID()}`,
        capability,
        scope,
        granted: true,
        level: level || levelOrCapability,
        grantedAt: existing?.grantedAt || nowIso(),
        grantedBy: actor,
        expiresAt: expiresInMinutes ? new Date(Date.now() + expiresInMinutes * 60000).toISOString() : null
      };
      if (existing) Object.assign(existing, grant);
      else store.state.permissionGrants.push(grant);
    }
    store.persist();
    calendarService.log(
      'PERMISSION_GRANTED',
      `Granted ${caps.length} capability(ies): ${caps.join(', ')}`,
      { actor }
    );
    return store.state.permissionGrants;
  }

  revoke(capability, { actor = 'user' } = {}) {
    store.state.permissionGrants = store.state.permissionGrants.filter((g) => g.capability !== capability);
    store.persist();
    calendarService.log('PERMISSION_REVOKED', `Revoked ${capability}`, { actor });
    return store.state.permissionGrants;
  }

  require(capability) {
    if (!this.hasCapability(capability)) {
      const err = Object.assign(
        new Error(`Permission required: ${CAPABILITIES[capability] || capability}. Grant it explicitly before this action.`),
        { status: 403, capability, needsPermission: true }
      );
      throw err;
    }
    return true;
  }

  /* --------------------------- proposals --------------------------- */

  list({ status = null } = {}) {
    const list = store.state.proposals || [];
    return status ? list.filter((p) => p.status === status) : list;
  }

  get(id) {
    const p = (store.state.proposals || []).find((x) => x.id === id);
    if (!p) throw Object.assign(new Error('Proposal not found'), { status: 404 });
    return p;
  }

  /**
   * Register a proposal produced by the planner.
   * Operations are diffs; nothing is written until apply().
   */
  create({ intent, operations = [], rationale = '', simulation = false, requestedBy = 'ai', timeZone }) {
    const proposal = {
      id: `prop_${crypto.randomUUID()}`,
      intent: intent || 'Schedule change',
      rationale,
      operations: operations.map((op, idx) => ({ ...op, opId: op.opId || `op_${idx + 1}` })),
      status: 'pending',
      simulation: Boolean(simulation),
      requestedBy,
      createdAt: nowIso(),
      preview: null,
      timeZone: timeZone || store.state.settings.timeZone
    };
    proposal.preview = this.preview(proposal);
    store.state.proposals = [proposal, ...(store.state.proposals || []).slice(0, 49)];
    store.persist();
    calendarService.log(
      simulation ? 'SANDBOX_SIMULATION_CREATED' : 'SANDBOX_PROPOSAL_CREATED',
      `${simulation ? 'Simulated' : 'Prepared'} “${proposal.intent}” with ${proposal.operations.length} operation(s). Real calendars untouched.`,
      { actor: requestedBy, proposalId: proposal.id }
    );
    return proposal;
  }

  /**
   * Render a before/after day or week preview entirely in memory.
   * This is what the UI shows: real calendar on the left, proposed on the right.
   */
  preview(proposal) {
    const tz = proposal.timeZone || store.state.settings.timeZone;
    const ops = proposal.operations || [];
    const baseStarts = ops.map((o) => o.targetStart || o.start).filter(Boolean).sort();
    const anchor = baseStarts[0] ? new Date(baseStarts[0]) : new Date();
    const start = startOfDay(anchor, tz);
    const end = addDays(start, ops.some((o) => dateKey(o.end || o.start, tz) !== dateKey(anchor, tz)) ? 7 : 1, tz);

    const { events: current } = calendarService.getTimeline({
      start: start.toISOString(),
      end: end.toISOString(),
      timeZone: tz
    });

    const simulated = simulateOperations(current, ops, tz);
    const newConflicts = calendarService.detectConflicts(simulated.after);
    const touchedIds = new Set(ops.map((o) => o.eventId).filter(Boolean));
    return {
      window: { start: start.toISOString(), end: end.toISOString(), timeZone: tz },
      before: simulated.before,
      after: simulated.after,
      unchanged: simulated.before.filter((e) => !touchedIds.has(e.id)),
      added: simulated.after.filter((e) => e.isProposed && !simulated.before.some((b) => b.id === e.id)),
      moved: simulated.moved,
      removed: simulated.removed,
      conflictsIntroduced: newConflicts.filter(
        (c) => touchedIds.has(c.a.id) || touchedIds.has(c.b.id)
      ),
      stats: {
        operations: ops.length,
        moved: simulated.moved.length,
        added: simulated.after.filter((e) => e.isProposed).length,
        removed: simulated.removed.length,
        conflictsIntroduced: newConflicts.length
      }
    };
  }

  /**
   * Apply a proposal to the real providers.
   * Requires `Act`. Each operation is routed to the calendar that owns the event.
   */
  async apply(proposalId, { actor = 'user', opIds = null, dryRun = false } = {}) {
    this.requireLevel('act');
    const proposal = this.get(proposalId);
    if (proposal.status === 'applied') {
      throw Object.assign(new Error('Proposal already applied'), { status: 409 });
    }
    if (proposal.status === 'discarded') {
      throw Object.assign(new Error('Proposal was discarded'), { status: 409 });
    }

    const selected = opIds ? proposal.operations.filter((o) => opIds.includes(o.opId)) : proposal.operations;
    if (!selected.length) throw Object.assign(new Error('No operations selected'), { status: 400 });

    if (dryRun) {
      return { dryRun: true, wouldApply: selected, proposal };
    }

    const results = [];
    for (const op of selected) {
      try {
        if (op.type === 'create') {
          if (op.invitees?.length || op.sendInvitation) this.require('create:invitation');
          const created = await calendarService.createEvent(
            {
              calendarId: op.calendarId,
              title: op.title,
              description: op.description || (op.reason ? `Scheduled by ZCal: ${op.reason}` : ''),
              location: op.location || '',
              start: op.start,
              end: op.end,
              timeZone: op.timeZone || proposal.timeZone,
              attendees: op.invitees || [],
              availability: op.availability || 'busy',
              conference: op.conference || null
            },
            { actor }
          );
          results.push({ opId: op.opId, type: 'create', ok: true, eventId: created.id, title: created.title });
        } else if (op.type === 'move' || op.type === 'update') {
          this.require('modify');
          const patch = {
            start: op.targetStart || op.start,
            end: op.targetEnd || op.end
          };
          if (op.title) patch.title = op.title;
          if (op.description !== undefined) patch.description = op.description;
          if (op.availability) patch.availability = op.availability;
          if (op.invitees) patch.attendees = op.invitees;
          const updated = await calendarService.updateEvent(op.eventId, patch, { actor });
          results.push({ opId: op.opId, type: op.type, ok: true, eventId: updated.id, title: updated.title });
        } else if (op.type === 'delete') {
          this.require('cancel');
          await calendarService.deleteEvent(op.eventId, { actor });
          results.push({ opId: op.opId, type: 'delete', ok: true, eventId: op.eventId, title: op.title });
        } else if (op.type === 'invite') {
          this.require('send:invitation');
          results.push({ opId: op.opId, type: 'invite', ok: true, queued: true, to: op.invitees?.map((i) => i.email) });
        } else if (op.type === 'message') {
          this.require('send:communication');
          results.push({ opId: op.opId, type: 'message', ok: true, queued: true, to: op.to });
        }
      } catch (err) {
        results.push({ opId: op.opId, type: op.type, ok: false, error: err.message });
      }
    }

    proposal.status = results.every((r) => r.ok) ? 'applied' : 'partially-applied';
    proposal.appliedAt = nowIso();
    proposal.appliedBy = actor;
    proposal.results = results;
    store.persist();
    calendarService.log(
      'SANDBOX_APPLIED',
      `Applied “${proposal.intent}”: ${results.filter((r) => r.ok).length}/${results.length} operation(s) written to native providers.`,
      { actor, proposalId: proposal.id }
    );
    return { proposal, results };
  }

  discard(proposalId, { actor = 'user' } = {}) {
    const proposal = this.get(proposalId);
    proposal.status = 'discarded';
    proposal.discardedAt = nowIso();
    store.persist();
    calendarService.log('SANDBOX_DISCARDED', `Discarded “${proposal.intent}”. Real calendars untouched.`, {
      actor,
      proposalId: proposal.id
    });
    return proposal;
  }

  /** Recompute a proposal after the user edits its operations (Modify). */
  modify(proposalId, patch = {}, { actor = 'user' } = {}) {
    const proposal = this.get(proposalId);
    if (patch.intent) proposal.intent = patch.intent;
    if (patch.rationale) proposal.rationale = patch.rationale;
    if (Array.isArray(patch.operations)) {
      proposal.operations = patch.operations.map((op, idx) => ({
        ...op,
        opId: op.opId || `op_${idx + 1}`
      }));
    }
    if (patch.removeOpIds) {
      proposal.operations = proposal.operations.filter((o) => !patch.removeOpIds.includes(o.opId));
    }
    proposal.status = 'pending';
    proposal.preview = this.preview(proposal);
    store.persist();
    calendarService.log('SANDBOX_MODIFIED', `Modified “${proposal.intent}” (${proposal.operations.length} operations).`, {
      actor,
      proposalId: proposal.id
    });
    return proposal;
  }

  /** Simulation mode (prompt §8) — never writes, returns consequences. */
  simulate({ operations = [], intent = 'Simulation', timeZone } = {}) {
    const proposal = this.create({
      intent,
      operations,
      rationale: 'Simulation only — nothing will be written to any calendar.',
      simulation: true,
      requestedBy: 'user',
      timeZone
    });
    return {
      proposal,
      consequences: describeConsequences(proposal.preview)
    };
  }

  /** Apply a whole group of pending proposals in one approval (prompt §5). */
  async applyGroup(proposalIds, { actor = 'user' } = {}) {
    const out = [];
    for (const id of proposalIds) {
      try {
        out.push(await this.apply(id, { actor }));
      } catch (err) {
        out.push({ proposalId: id, error: err.message });
      }
    }
    return out;
  }
}

/* ------------------------------------------------------------------ *
 * Pure simulation helpers (no side effects)
 * ------------------------------------------------------------------ */

export function simulateOperations(currentEvents, operations, tz) {
  const before = currentEvents.map((e) => ({ ...e }));
  let after = currentEvents.map((e) => ({ ...e }));
  const moved = [];
  const removed = [];

  for (const op of operations) {
    if (op.type === 'move' || op.type === 'update') {
      const target = after.find((e) => e.id === op.eventId || e.remoteId === op.eventId);
      if (!target) continue;
      const newStart = op.targetStart || op.start || target.start;
      const newEnd = op.targetEnd || op.end || addMinutes(newStart, durationMinutes(target));
      moved.push({
        id: target.id,
        title: target.title,
        from: { start: target.start, end: target.end },
        to: { start: newStart, end: newEnd }
      });
      after = after.map((e) =>
        e.id === target.id ? { ...e, start: newStart, end: newEnd, isProposed: true, proposalNote: op.reason || 'Moved by AI' } : e
      );
    } else if (op.type === 'create') {
      after.push({
        id: `proposed_${op.opId}`,
        remoteId: `proposed_${op.opId}`,
        title: op.title || 'New event',
        start: op.start,
        end: op.end,
        timeZone: op.timeZone || tz,
        availability: op.availability || 'busy',
        calendarId: op.calendarId || 'cal_varizen',
        calendarName: 'Proposed',
        calendarColor: '#7A5AF8',
        attendees: op.invitees || [],
        isProposed: true,
        proposalNote: op.reason || 'Proposed by AI',
        durationMinutes: Math.round((new Date(op.end) - new Date(op.start)) / 60000)
      });
    } else if (op.type === 'delete') {
      const target = after.find((e) => e.id === op.eventId || e.remoteId === op.eventId);
      if (target) {
        removed.push({ id: target.id, title: target.title, start: target.start, end: target.end });
        after = after.filter((e) => e.id !== target.id);
      }
    }
  }

  after.sort((a, b) => new Date(a.start) - new Date(b.start));
  return { before, after, moved, removed };
}

export function describeConsequences(preview) {
  const lines = [];
  if (preview.stats.moved) lines.push(`${preview.stats.moved} event(s) would move.`);
  if (preview.stats.added) lines.push(`${preview.stats.added} new block(s) would be added.`);
  if (preview.stats.removed) lines.push(`${preview.stats.removed} event(s) would be removed.`);
  if (preview.conflictsIntroduced.length) {
    lines.push(
      `${preview.conflictsIntroduced.length} new conflict(s): ${preview.conflictsIntroduced
        .map((c) => `${c.a.title} ↔ ${c.b.title}`)
        .join(', ')}.`
    );
  } else {
    lines.push('No new conflicts introduced.');
  }
  return { lines, conflictFree: preview.conflictsIntroduced.length === 0 };
}

export const sandbox = new Sandbox();
