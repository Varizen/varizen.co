// MCP client: JSON-RPC 2.0 over stdio. Tool discovery + execution with a permission gate.
const { spawn } = require('child_process');

class Server {
  constructor(cfg) {
    this.cfg = cfg; // { id, name, command, args, env, enabled }
    this.proc = null;
    this.nextId = 1;
    this.pending = new Map();
    this.tools = [];
    this.buf = '';
  }

  start() {
    if (this.proc) return;
    this.proc = spawn(this.cfg.command, this.cfg.args || [], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, ...(this.cfg.env || {}) },
      shell: process.platform === 'win32'
    });
    this.proc.stdout.on('data', (d) => this.onData(d));
    this.proc.stderr.on('data', () => {});
    this.proc.on('exit', () => { this.proc = null; this.tools = []; });
    this.proc.on('error', () => { this.proc = null; });
  }

  onData(d) {
    this.buf += d.toString();
    let i;
    while ((i = this.buf.indexOf('\n')) >= 0) {
      const line = this.buf.slice(0, i).trim();
      this.buf = this.buf.slice(i + 1);
      if (!line) continue;
      let msg;
      try { msg = JSON.parse(line); } catch { continue; }
      const p = msg.id != null && this.pending.get(msg.id);
      if (!p) continue;
      this.pending.delete(msg.id);
      if (msg.error) {
        p.reject(new Error(msg.error.message || 'MCP error'));
      } else {
        p.resolve(msg.result);
      }
    }
  }

  write(obj) {
    this.start();
    if (!this.proc) throw new Error(`MCP server "${this.cfg.name}" is not running`);
    this.proc.stdin.write(JSON.stringify(obj) + '\n');
  }

  request(method, params) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      try { this.write({ jsonrpc: '2.0', id, method, params }); }
      catch (e) { this.pending.delete(id); return reject(e); }
      setTimeout(() => {
        if (this.pending.delete(id)) reject(new Error(`MCP timeout: ${method}`));
      }, 30000);
    });
  }

  async init() {
    await this.request('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'AiBrowser', version: '0.1.0' }
    });
    this.write({ jsonrpc: '2.0', method: 'notifications/initialized' });
    const res = await this.request('tools/list', {});
    this.tools = res.tools || [];
    return this.tools;
  }

  call(name, args) { return this.request('tools/call', { name, arguments: args || {} }); }
  stop() { try { this.proc?.kill(); } catch {} this.proc = null; this.tools = []; }
}

const servers = new Map(); // id -> Server

function get(cfg) {
  let s = servers.get(cfg.id);
  if (!s) { s = new Server(cfg); servers.set(cfg.id, s); }
  return s;
}

async function discover(cfg) {
  const s = get(cfg);
  const tools = await s.init();
  return tools.map((t) => ({ server: cfg.id, name: t.name, description: t.description, schema: t.inputSchema }));
}

async function callTool(cfg, name, args) {
  const s = get(cfg);
  if (!s.tools.length) await s.init();
  const res = await s.call(name, args);
  const text = (res.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
  return { text, isError: !!res.isError };
}

function stopAll() { for (const s of servers.values()) s.stop(); servers.clear(); }

module.exports = { discover, callTool, stopAll };
