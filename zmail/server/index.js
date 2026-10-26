/**
 * ZMail Server - Zero-Dependency Native Node.js HTTP Server & Static Client
 * (was: ZenBox Server)
 * Runs 100% self-contained with built-in http, url, fs, path modules.
 * No external npm install required.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mailEngine } from './mailEngine.js';
import { ZMailAIEngine } from './aiEngine.js';
import { secureVault } from './secureVault.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

/**
 * Security posture (aligned with the Z-suite §17 requirements).
 *  - Strict CSP on every HTML document (no inline scripts, no frame embedding)
 *  - Same-origin CORS (local-first app; the AiBrowser host uses native
 *    WebContentsView, not cross-origin iframes, so a permissive ACAO is
 *    unnecessary and unsafe)
 *  - Security headers on every response
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "object-src 'none'"
].join('; ');

const SECURITY_HEADERS = {
  'Content-Security-Policy': CSP,
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=(), payment=()'
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'http://127.0.0.1:4200 http://localhost:4200',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Vary': 'Origin'
};

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    ...CORS_HEADERS,
    ...SECURITY_HEADERS,
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(data));
}

export function createServer() {
  const aiEngine = new ZMailAIEngine(mailEngine);

  const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    if (method === 'OPTIONS') {
      res.writeHead(204, CORS_HEADERS);
      return res.end();
    }

    // --- API ROUTES ---

    // 1. Accounts
    if (pathname === '/api/accounts' && method === 'GET') {
      return sendJson(res, 200, mailEngine.getAccounts());
    }
    if (pathname === '/api/accounts' && method === 'POST') {
      const body = await readBody(req);
      const acc = mailEngine.connectAccount(body);
      return sendJson(res, 201, acc);
    }

    // 2. Messages
    if (pathname === '/api/messages' && method === 'GET') {
      const accountId = parsedUrl.searchParams.get('accountId');
      const folder = parsedUrl.searchParams.get('folder');
      const search = parsedUrl.searchParams.get('search');
      const category = parsedUrl.searchParams.get('category');
      const messages = mailEngine.getMessages({ accountId, folder, search, category });
      return sendJson(res, 200, messages);
    }

    if (pathname === '/api/messages' && method === 'POST') {
      const body = await readBody(req);
      const result = mailEngine.sendMessage(body);
      return sendJson(res, 201, result);
    }

    if (pathname.startsWith('/api/messages/') && pathname.endsWith('/archive') && method === 'POST') {
      const id = pathname.split('/')[3];
      const ok = mailEngine.archiveMessage(id);
      return sendJson(res, 200, { success: ok });
    }

    if (pathname.startsWith('/api/messages/') && pathname.endsWith('/spam') && method === 'POST') {
      const id = pathname.split('/')[3];
      const ok = mailEngine.markAsSpam(id);
      return sendJson(res, 200, { success: ok });
    }

    if (pathname.startsWith('/api/messages/') && method === 'GET') {
      const id = pathname.split('/')[3];
      const msg = mailEngine.getMessageById(id);
      if (!msg) return sendJson(res, 404, { error: 'Message not found' });
      return sendJson(res, 200, msg);
    }

    if (pathname.startsWith('/api/messages/') && method === 'PATCH') {
      const id = pathname.split('/')[3];
      const body = await readBody(req);
      const updated = mailEngine.updateMessage(id, body);
      if (!updated) return sendJson(res, 404, { error: 'Message not found' });
      return sendJson(res, 200, updated);
    }

    if (pathname.startsWith('/api/messages/') && method === 'DELETE') {
      const id = pathname.split('/')[3];
      const ok = mailEngine.deleteMessage(id);
      return sendJson(res, 200, { success: ok });
    }

    if (pathname === '/api/counts' && method === 'GET') {
      return sendJson(res, 200, mailEngine.getFolderCounts());
    }

    // 3. AI Endpoints
    if (pathname === '/api/ai/summarize' && method === 'POST') {
      const body = await readBody(req);
      try {
        const result = await aiEngine.summarizeEmail(body.messageId, body.authorizedForSecure);
        return sendJson(res, 200, result);
      } catch (err) {
        return sendJson(res, 400, { error: err.message });
      }
    }

    if (pathname === '/api/ai/agent-mode' && method === 'GET') {
      const triage = await aiEngine.runAIAgentMode();
      return sendJson(res, 200, triage);
    }

    if (pathname === '/api/ai/execute-actions' && method === 'POST') {
      const body = await readBody(req);
      const results = await aiEngine.executeAIActions(body.actions || []);
      return sendJson(res, 200, { success: true, results });
    }

    if (pathname === '/api/ai/smart-replies' && method === 'POST') {
      const body = await readBody(req);
      const replies = aiEngine.generateSmartReplies(body.messageId);
      return sendJson(res, 200, { replies });
    }

    if (pathname === '/api/ai/transform' && method === 'POST') {
      const body = await readBody(req);
      const output = aiEngine.transformDraft(body);
      return sendJson(res, 200, { output });
    }

    if (pathname === '/api/ai/query' && method === 'POST') {
      const body = await readBody(req);
      const resp = aiEngine.processNaturalLanguageQuery(body.query || '');
      return sendJson(res, 200, resp);
    }

    // 4. Secure Session Endpoints
    if (pathname.startsWith('/api/secure/session/') && pathname.endsWith('/ai-access') && method === 'POST') {
      const parts = pathname.split('/');
      const id = parts[4];
      const body = await readBody(req);
      try {
        if (body.authorized) {
          secureVault.grantAIAccess(id, true);
          return sendJson(res, 200, { success: true, aiAccessAllowed: true });
        } else {
          secureVault.revokeAIAccess(id);
          return sendJson(res, 200, { success: true, aiAccessAllowed: false });
        }
      } catch (err) {
        return sendJson(res, 403, { error: err.message });
      }
    }

    if (pathname.startsWith('/api/secure/session/') && pathname.endsWith('/reply') && method === 'POST') {
      const parts = pathname.split('/');
      const id = parts[4];
      const body = await readBody(req);
      try {
        const session = secureVault.addDecryptedItem(id, {
          sender: body.senderEmail || 'user@zmail.local',
          subject: `Re: Secure Session ${id}`,
          body: body.body
        });
        return sendJson(res, 200, { success: true, session });
      } catch (err) {
        return sendJson(res, 400, { error: err.message });
      }
    }

    if (pathname.startsWith('/api/secure/session/') && method === 'GET') {
      const id = pathname.split('/')[4];
      const session = secureVault.sessions.get(id);
      if (!session) return sendJson(res, 404, { error: 'Secure Session not found or expired' });
      return sendJson(res, 200, {
        id: session.id,
        sender: session.sender,
        recipient: session.recipient,
        expiresAt: session.expiresAt,
        aiAccessAllowed: session.aiAccessAllowed,
        items: session.decryptedItems,
        auditLog: session.auditLog
      });
    }

    // Static Assets
    let reqPath = pathname === '/' ? '/index.html' : pathname;
    let filePath = path.join(PUBLIC_DIR, reqPath);
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
        return res.end('404 Not Found');
      }

      const ext = path.extname(filePath);
      const mime = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': mime,
        'Cache-Control': 'no-cache, must-revalidate',
        ...(ext === '.html' ? SECURITY_HEADERS : { 'X-Content-Type-Options': 'nosniff' })
      });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  return server;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PORT = process.env.PORT || 4200;
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`🚀 ZMail Universal AI Email Server running at http://localhost:${PORT}`);
  });
}
