/**
 * ZTalk — shared helpers (was: ZenChat).
 *
 * Deliberately tiny: no date library, no id library beyond node:crypto.
 * Every helper is pure so it can be unit tested without a server.
 */

import crypto from 'crypto';
import { config } from './config.js';

/** Short, collision-resistant, URL-safe identifier with a typed prefix. */
export function id(prefix = 'id', bytes = 8) {
  return `${prefix}_${crypto.randomBytes(bytes).toString('base64url')}`;
}

export function nowIso() {
  return new Date().toISOString();
}

export function truncate(value, max = 240) {
  const text = String(value ?? '').trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

/** Deterministic, dependency-free string hash — used for stable avatar tints. */
export function hashString(value) {
  let h = 2166136261;
  const text = String(value ?? '');
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pick(list, seed) {
  if (!Array.isArray(list) || list.length === 0) return undefined;
  return list[hashString(seed) % list.length];
}

/** Initials for an avatar chip: "Sarah Chen" -> "SC", "Sarah" -> "SA". */
export function initials(name = '') {
  const words = String(name)
    .replace(/[^\p{L}\p{N} ]+/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return '??';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

/** Tint key so the client can render a stable colour per contact. */
export function tintOf(seed) {
  return hashString(seed) % 8;
}

/** Parse an `@mention`, `#hashtag`, `/command` or a bare name from text. */
export function extractMentions(text = '') {
  const out = new Set();
  for (const match of String(text).matchAll(/(?:^|\s)@([\p{L}\p{N}._-]{2,40})/gu)) {
    out.add(match[1]);
  }
  return [...out];
}

export function extractHashtags(text = '') {
  const out = new Set();
  for (const match of String(text).matchAll(/(?:^|\s)#([\p{L}\p{N}_-]{2,40})/gu)) {
    out.add(match[1].toLowerCase());
  }
  return [...out];
}

/** Money-ish and date-ish signals used by the AI extractors. */
export function extractMoney(text = '') {
  const pattern = /(?:USD|EUR|GBP|MYR|PKR|AED|INR|SGD|\$|€|£|RM)\s?[\d,.]+(?:\s?(?:k|m|bn|million|thousand))?/gi;
  return [...new Set((String(text).match(pattern) || []).map((s) => s.trim()))];
}

/**
 * Lightweight relative/day/time parser. Returns an ISO instant or null.
 * Handles: "tomorrow 3PM", "today 14:00", "Friday 10:30am", "Mon 9am",
 * "2026-11-15 14:00" and bare "3PM" (assumed next occurrence).
 */
export function parseWhen(text = '', { base = new Date(), timeZone = config.timeZone } = {}) {
  const raw = String(text).toLowerCase();
  const timeMatch = raw.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
  const isoMatch = raw.match(/(\d{4})-(\d{2})-(\d{2})(?:[ t](\d{1,2}):(\d{2}))?/);

  let hour = null;
  let minute = 0;
  if (timeMatch) {
    hour = Number(timeMatch[1]);
    minute = Number(timeMatch[2] || 0);
    const suffix = timeMatch[3];
    if (suffix === 'pm' && hour < 12) hour += 12;
    if (suffix === 'am' && hour === 12) hour = 0;
    if (!suffix && hour <= 7) hour += 12; // "at 3" in a meeting context means afternoon
    if (hour > 23 || minute > 59) return null;
  }

  if (isoMatch) {
    const [, y, mo, d, h, mi] = isoMatch;
    return new Date(
      Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h ?? 0), Number(mi ?? 0))
    ).toISOString();
  }

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const shortDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  let target = null;

  if (/\btomorrow\b/.test(raw)) target = 1;
  else if (/\btoday\b/.test(raw) || /\btonight\b/.test(raw)) target = 0;
  else if (/\bday after tomorrow\b/.test(raw)) target = 2;
  else {
    const idx = days.findIndex((d) => raw.includes(d));
    const sIdx = idx >= 0 ? idx : shortDays.findIndex((d) => new RegExp(`\\b${d}\\b`).test(raw));
    if (sIdx >= 0) {
      const current = base.getDay();
      const delta = (sIdx - current + 7) % 7 || 7;
      target = delta;
    }
  }

  if (target === null && hour === null) return null;

  const day = new Date(base);
  day.setDate(day.getDate() + (target ?? 0));
  if (target === null && hour !== null) {
    // Bare time: if it already passed today, use tomorrow.
    const candidate = new Date(day);
    candidate.setHours(hour, minute, 0, 0);
    if (candidate.getTime() <= base.getTime()) candidate.setDate(candidate.getDate() + 1);
    return candidate.toISOString();
  }

  if (/\btonight\b/.test(raw) && hour === null) hour = 20;
  day.setHours(hour ?? 9, minute, 0, 0);
  if (day.getTime() <= base.getTime() && target === 0) day.setDate(day.getDate() + 1);
  return day.toISOString();
}

export function formatInZone(instant, timeZone = config.timeZone, opts = {}) {
  if (!instant) return '';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: opts.weekday ? 'short' : undefined,
    day: opts.day === false ? undefined : 'numeric',
    month: opts.month === false ? undefined : 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: opts.hour12 ?? true
  }).format(new Date(instant));
}

export function timeOnly(instant, timeZone = config.timeZone) {
  if (!instant) return '';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(new Date(instant));
}

export function relativeLabel(instant, base = new Date()) {
  if (!instant) return '';
  const diff = new Date(instant).getTime() - base.getTime();
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return diff < 0 ? `${mins}m ago` : `in ${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return diff < 0 ? `${hours}h ago` : `in ${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 7) return diff < 0 ? `${days}d ago` : `in ${days}d`;
  const weeks = Math.round(days / 7);
  return diff < 0 ? `${weeks}w ago` : `in ${weeks}w`;
}

/** Human byte size for attachment chips. */
export function formatBytes(bytes = 0) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Escape untrusted text before it touches innerHTML. The client renders user
 * content through textContent wherever possible; this is the safety net for the
 * few templated paths.
 */
export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
