/**
 * ZTalk — AI provider abstraction (was: ZenChat).
 *
 * The product must never be locked to one vendor (and must never silently ship
 * content to one). Three tiers:
 *
 *   deterministic — local, rule-based. Default. Zero network egress.
 *   remote        — operator-configured OpenAI-compatible endpoint. Opt-in only.
 *   disabled      — AI fully off; all AI routes return a clear refusal.
 *
 * `config.ai.allowRemote` AND a non-deterministic provider must BOTH be set for
 * the remote tier to activate. A provider name alone is not enough.
 */

import { config } from './config.js';

export const AI_PROVIDERS = {
  deterministic: {
    kind: 'deterministic',
    label: 'ZTalk Local',
    model: 'zenchat-rules-v1',
    blurb: 'On-device rules and phrasebook. No network, no vendor, no data egress.',
    requiresKey: false
  },
  openai: {
    kind: 'openai',
    label: 'OpenAI',
    model: 'gpt-4.1-mini',
    blurb: 'OpenAI-compatible chat completions. Requires an operator key.',
    requiresKey: true
  },
  anthropic: {
    kind: 'anthropic',
    label: 'Anthropic',
    model: 'claude-sonnet-4',
    blurb: 'Anthropic Messages API. Requires an operator key.',
    requiresKey: true
  },
  gemini: {
    kind: 'gemini',
    label: 'Google Gemini',
    model: 'gemini-2.5-flash',
    blurb: 'Google Generative Language API. Requires an operator key.',
    requiresKey: true
  },
  ollama: {
    kind: 'ollama',
    label: 'Local model (Ollama)',
    model: 'llama3.1',
    blurb: 'Points at a local Ollama server. No data leaves the machine.',
    requiresKey: false
  }
};

export const AI_MODES = {
  off: {
    key: 'off',
    label: 'AI Off',
    blurb: 'No summarising, no suggestions, no translation. Everything is manual.'
  },
  assist: {
    key: 'assist',
    label: 'AI Assistant',
    blurb: 'Reads the open conversation to summarise and suggest replies. Never sends.'
  },
  translate: {
    key: 'translate',
    label: 'Translation Only',
    blurb: 'Translates visible text. Does not summarise or propose actions.'
  },
  full: {
    key: 'full',
    label: 'AI Full Access',
    blurb: 'Summaries, replies, detections and drafting. Still requires your approval to send.'
  }
};

let active = {
  kind: config.ai.provider,
  model: config.ai.model,
  allowRemote: config.ai.allowRemote ? Boolean(config.ai.apiKey || config.ai.provider === 'ollama') : false,
  changedAt: new Date().toISOString(),
  changedBy: 'config'
};

export function getAIProvider() {
  const meta = AI_PROVIDERS[active.kind] || AI_PROVIDERS.deterministic;
  return {
    ...active,
    label: meta.label,
    blurb: meta.blurb,
    requiresKey: meta.requiresKey,
    effective: active.kind === 'deterministic' || !active.allowRemote ? 'deterministic' : active.kind
  };
}

export function providerStatus() {
  const current = getAIProvider();
  return {
    providers: Object.values(AI_PROVIDERS),
    modes: Object.values(AI_MODES),
    active: current,
    remoteReady: Boolean(current.allowRemote && current.kind !== 'deterministic'),
    note:
      current.effective === 'deterministic'
        ? 'Running the local deterministic engine. Nothing leaves this machine.'
        : `Remote provider "${current.label}" is enabled by an operator. Content leaves this machine when AI runs.`
  };
}

export function setAIProvider({ kind, model, allowRemote }, { actor = 'operator' } = {}) {
  const meta = AI_PROVIDERS[kind];
  if (!meta) {
    throw Object.assign(new Error(`Unknown AI provider "${kind}".`), { status: 400 });
  }
  if (meta.requiresKey && !config.ai.apiKey) {
    throw Object.assign(
      new Error(`${meta.label} needs ZENCHAT_AI_KEY set on the server. It is not stored by ZTalk.`),
      { status: 409, needsKey: true }
    );
  }
  if (kind !== 'deterministic' && !allowRemote) {
    throw Object.assign(
      new Error('Remote providers require an explicit allowRemote=true. This is a privacy boundary, not a bug.'),
      { status: 409, needsConsent: true }
    );
  }
  active = {
    kind,
    model: model || meta.model,
    allowRemote: Boolean(allowRemote),
    changedAt: new Date().toISOString(),
    changedBy: actor
  };
  return getAIProvider();
}

/**
 * Single call site for every AI invocation. The deterministic tier always
 * answers locally; the remote tier is only reached when an operator enabled it.
 */
export async function aiComplete({ system, prompt, maxTokens = 700 }) {
  const current = getAIProvider();
  if (current.effective === 'deterministic') {
    return { ok: true, provider: 'deterministic', text: null, note: 'Handled by the local rules engine.' };
  }
  if (!config.ai.endpoint && current.effective !== 'ollama') {
    return { ok: false, provider: current.effective, error: 'No ZENCHAT_AI_ENDPOINT configured.' };
  }
  const endpoint = config.ai.endpoint || 'http://127.0.0.1:11434/api/chat';
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.ai.apiKey ? { Authorization: `Bearer ${config.ai.apiKey}` } : {})
      },
      body: JSON.stringify({
        model: current.model,
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt }
        ]
      }),
      signal: AbortSignal.timeout(12_000)
    });
    if (!res.ok) {
      return { ok: false, provider: current.effective, error: `Provider responded ${res.status}` };
    }
    const body = await res.json().catch(() => ({}));
    const text =
      body?.choices?.[0]?.message?.content ||
      body?.content?.[0]?.text ||
      body?.candidates?.[0]?.content?.parts?.[0]?.text ||
      body?.message?.content ||
      null;
    return { ok: Boolean(text), provider: current.effective, text };
  } catch (err) {
    return { ok: false, provider: current.effective, error: err.message || 'Provider unreachable' };
  }
}

/** Throws a consistently-shaped error when the AI mode forbids a capability. */
export function requireAIMode(mode, capability) {
  const modeMeta = AI_MODES[mode || 'assist'] || AI_MODES.assist;
  const allowed = {
    off: [],
    translate: ['translate'],
    assist: ['summarize', 'suggest', 'translate', 'detect'],
    full: ['summarize', 'suggest', 'translate', 'detect', 'draft', 'act']
  }[modeMeta.key];
  if (!allowed.includes(capability)) {
    throw Object.assign(
      new Error(`AI mode "${modeMeta.label}" does not permit ${capability}.`),
      { status: 403, aiMode: modeMeta.key, capability }
    );
  }
  return modeMeta;
}
