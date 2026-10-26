/**
 * ZMeet — AI provider abstraction (prompt §36).
 * (was: ZenMeet)
 *
 * Providers are pluggable and none is required. The default provider is fully
 * deterministic and local: it derives structure from the room's own state
 * (agenda, chat, transcript, polls, files). Nothing is invented and nothing is
 * sent to a third party unless an organization explicitly configures a remote
 * provider *and* sets `allowRemote`.
 *
 *   AIProvider
 *    ├── DeterministicProvider  (default, local, no network)
 *    ├── OpenAIProvider         (remote, opt-in)
 *    ├── AnthropicProvider      (remote, opt-in)
 *    ├── GeminiProvider         (remote, opt-in)
 *    ├── LocalModelProvider     (self-hosted endpoint, opt-in)
 *    └── EnterpriseProvider     (org-controlled endpoint, opt-in)
 */

import { config } from './config.js';
import { store } from './store.js';
import { truncate } from './util.js';

export const AI_PROVIDERS = {
  deterministic: {
    id: 'deterministic',
    label: 'Local deterministic engine',
    remote: false,
    models: ['rule-based'],
    blurb: 'Runs entirely inside ZMeet. No content leaves the process.'
  },
  openai: {
    id: 'openai',
    label: 'OpenAI',
    remote: true,
    models: ['gpt-4.1-mini', 'gpt-4.1'],
    blurb: 'Requires an organization API key and explicit remote AI consent.'
  },
  anthropic: {
    id: 'anthropic',
    label: 'Anthropic',
    remote: true,
    models: ['claude-sonnet-4', 'claude-haiku-3.5'],
    blurb: 'Requires an organization API key and explicit remote AI consent.'
  },
  gemini: {
    id: 'gemini',
    label: 'Google Gemini',
    remote: true,
    models: ['gemini-2.5-flash', 'gemini-2.5-pro'],
    blurb: 'Requires an organization API key and explicit remote AI consent.'
  },
  local: {
    id: 'local',
    label: 'Local model',
    remote: false,
    models: ['llama-local', 'mistral-local'],
    blurb: 'Self-hosted inference endpoint inside your own network.'
  },
  enterprise: {
    id: 'enterprise',
    label: 'Enterprise model',
    remote: true,
    models: ['org-private'],
    blurb: 'Points at an organization-controlled inference gateway.'
  }
};

export function getAIProvider() {
  const state = store.state.aiProvider || {};
  return {
    kind: state.kind || config.ai.provider,
    model: state.model || config.ai.model,
    allowRemote: Boolean(state.allowRemote),
    note: state.note || AI_PROVIDERS[state.kind || config.ai.provider]?.blurb || ''
  };
}

export function setAIProvider({ kind, model, allowRemote }, { actor = 'host' } = {}) {
  const provider = AI_PROVIDERS[kind];
  if (!provider) throw Object.assign(new Error(`Unknown AI provider “${kind}”`), { status: 400 });
  if (provider.remote && !allowRemote) {
    throw Object.assign(
      new Error(
        `${provider.label} is a remote provider. Enabling it requires explicit consent (allowRemote: true) and an organization API key.`
      ),
      { status: 403, needsConsent: true }
    );
  }
  store.state.aiProvider = {
    kind,
    model: model || provider.models[0],
    allowRemote: Boolean(allowRemote),
    note: provider.blurb,
    updatedAt: new Date().toISOString(),
    updatedBy: actor
  };
  store.persist();
  store.log('AI_PROVIDER_CHANGED', `AI provider set to ${provider.label} (${store.state.aiProvider.model}).`, { actor });
  return getAIProvider();
}

/**
 * A provider adapter. The deterministic one is complete; remote adapters
 * implement the same contract and are only constructed when configured.
 */
class DeterministicProvider {
  constructor() {
    this.kind = 'deterministic';
    this.model = 'rule-based';
    this.remote = false;
  }

  /** Structured extraction is local — derived from the room's own words. */
  async complete({ task }) {
    return { ok: true, provider: this.kind, task, text: null, note: 'Deterministic provider: structured output only.' };
  }
}

class RemoteProvider {
  constructor({ kind, model, endpoint, apiKey }) {
    this.kind = kind;
    this.model = model;
    this.endpoint = endpoint;
    this.apiKey = apiKey;
    this.remote = true;
  }

  /**
   * Remote completion. Deliberately minimal: the caller has already checked
   * room-level AI permission, and the payload is scoped to a single task.
   */
  async complete({ task, prompt, maxTokens = 700 }) {
    if (!this.endpoint) {
      return { ok: false, provider: this.kind, error: 'No endpoint configured for this provider.' };
    }
    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {})
        },
        body: JSON.stringify({ model: this.model, task, prompt, max_tokens: maxTokens }),
        signal: AbortSignal.timeout(20_000)
      });
      if (!res.ok) return { ok: false, provider: this.kind, error: `Provider responded ${res.status}` };
      const body = await res.json().catch(() => ({}));
      return { ok: true, provider: this.kind, text: body.text || body.output || body.content || '' };
    } catch (err) {
      return { ok: false, provider: this.kind, error: err.message };
    }
  }
}

export function createProvider(overrides = {}) {
  const current = { ...getAIProvider(), ...overrides };
  if (current.kind === 'deterministic') return new DeterministicProvider();
  const meta = AI_PROVIDERS[current.kind];
  if (!meta) throw Object.assign(new Error('Unknown AI provider'), { status: 400 });
  if (meta.remote && !current.allowRemote) {
    return new DeterministicProvider();
  }
  return new RemoteProvider({
    kind: current.kind,
    model: current.model,
    endpoint: config.ai.endpoint,
    apiKey: config.ai.providerKey
  });
}

/** Provider readiness for the Settings screen. */
export function providerStatus() {
  const current = getAIProvider();
  const meta = AI_PROVIDERS[current.kind];
  return {
    current,
    providers: Object.values(AI_PROVIDERS),
    ready: current.kind === 'deterministic' ? true : Boolean(config.ai.endpoint),
    disclosure:
      meta.remote && !current.allowRemote
        ? 'Remote provider selected but remote AI is not consented. ZMeet will fall back to the local engine.'
        : meta.blurb,
    fallbackActive: meta.remote && !current.allowRemote
  };
}

export function scopedPayload(room, text) {
  return truncate(text, 2000) + (room ? `\n[room ${room.id}]` : '');
}
