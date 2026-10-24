// Single-user local settings. API key encrypted with OS credential store (DPAPI on Windows).
const { app, safeStorage } = require('electron');
const fs = require('fs');
const path = require('path');

const defaults = {
  searchUrl: 'https://duckduckgo.com/?q=',
  sleepMinutes: 10,
  shield: true,
  httpsFirst: true,
  ai: {
    enabled: true,
    useLocal: false,                                  // default: free gateway
    gatewayUrl: 'https://varizen.co',
    gatewayTokenEnc: '',                              // short-lived install token, never a provider key
    endpoint: 'http://localhost:11434/v1',
    model: 'llama3.2',
    apiKeyEnc: ''
  },
  mcp: [],          // [{ id, name, command, args, env, enabled }]
  mcpAllowed: [],   // ["serverId:toolName"] approved by the user
  shieldAllow: []   // hostnames the user exempted from tracker blocking
};

let data = null;
const file = () => path.join(app.getPath('userData'), 'settings.json');

function load() {
  if (data) return data;
  try { data = { ...defaults, ...JSON.parse(fs.readFileSync(file(), 'utf8')) }; }
  catch { data = structuredClone(defaults); }
  data.ai = { ...defaults.ai, ...data.ai };
  for (const k of ['mcp', 'mcpAllowed', 'shieldAllow']) if (!Array.isArray(data[k])) data[k] = [];
  return data;
}

function save() { fs.writeFileSync(file(), JSON.stringify(data, null, 2)); }

function get(key) { return load()[key]; }

const enc = (s) => (safeStorage.isEncryptionAvailable() ? safeStorage.encryptString(s).toString('base64') : '');
const dec = (s) => (s ? safeStorage.decryptString(Buffer.from(s, 'base64')) : '');

function setAI({ endpoint, model, apiKey, enabled, useLocal, gatewayUrl, gatewayToken }) {
  const ai = load().ai;
  if (endpoint !== undefined) ai.endpoint = endpoint.replace(/\/+$/, '');
  if (model !== undefined) ai.model = model;
  if (enabled !== undefined) ai.enabled = !!enabled;
  if (useLocal !== undefined) ai.useLocal = !!useLocal;
  if (gatewayUrl !== undefined) ai.gatewayUrl = gatewayUrl.replace(/\/+$/, '');
  if (apiKey) ai.apiKeyEnc = enc(apiKey);
  if (gatewayToken) ai.gatewayTokenEnc = enc(gatewayToken);
  save();
}

function apiKey() { return dec(load().ai.apiKeyEnc); }
function gatewayToken() { return dec(load().ai.gatewayTokenEnc); }

// Safe view for the UI — never returns a secret.
function publicAI() {
  const { endpoint, model, enabled, useLocal, gatewayUrl, apiKeyEnc, gatewayTokenEnc } = load().ai;
  return {
    endpoint, model, enabled, useLocal, gatewayUrl,
    hasKey: !!apiKeyEnc,
    hasGatewayToken: !!gatewayTokenEnc
  };
}

function reset() { data = structuredClone(defaults); save(); }

module.exports = { load, save, get, setAI, apiKey, gatewayToken, publicAI, reset };
