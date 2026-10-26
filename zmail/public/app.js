/**
 * ZMail client — unified inbox UI
 */

const state = {
  accounts: [],
  accountFilter: 'all',
  view: 'inbox',
  tab: 'all',
  search: '',
  messages: [],
  selected: null,
  counts: {},
  triage: null
};

const AVATAR_COLORS = [
  '#2f6bff', '#7a5af8', '#12b76a', '#f79009',
  '#f04438', '#0f6cbd', '#3693f3', '#6001d2'
];

const PROVIDER_ICONS = {
  gmail: 'fa-brands fa-google',
  outlook: 'fa-brands fa-microsoft',
  yahoo: 'fa-brands fa-yahoo',
  icloud: 'fa-brands fa-apple',
  imap: 'fa-solid fa-server'
};

/* ============================================================
   Boot
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  refreshAll();
});

async function refreshAll() {
  await Promise.all([loadAccounts(), loadCounts(), loadMessages()]);
}

/* ============================================================
   API
   ============================================================ */

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

/* ============================================================
   Data loading
   ============================================================ */

async function loadAccounts() {
  state.accounts = await api('/api/accounts');

  const list = document.getElementById('accountList');
  list.innerHTML = '';

  state.accounts.forEach(acc => {
    const btn = document.createElement('button');
    btn.className = `account-row ${state.accountFilter === acc.id ? 'active' : ''}`;
    btn.innerHTML = `
      <span class="account-icon ${acc.provider}">
        <i class="${PROVIDER_ICONS[acc.provider] || PROVIDER_ICONS.imap}"></i>
      </span>
      <span class="account-meta">
        <strong>${escapeHtml(acc.name)}</strong>
        <span>${escapeHtml(acc.email)}</span>
      </span>
    `;
    btn.onclick = () => {
      state.accountFilter = state.accountFilter === acc.id ? 'all' : acc.id;
      loadAccounts();
      loadMessages();
    };
    list.appendChild(btn);
  });

  const sel = document.getElementById('composeAccount');
  sel.innerHTML = '';
  state.accounts.forEach(acc => {
    const opt = document.createElement('option');
    opt.value = acc.id;
    opt.textContent = `${acc.name} <${acc.email}>`;
    sel.appendChild(opt);
  });
}

async function loadCounts() {
  state.counts = await api('/api/counts');
  const c = state.counts;
  document.getElementById('countInbox').textContent = c.unread || 0;
  document.getElementById('countSecure').textContent = c.secure || 0;
  document.getElementById('countDrafts').textContent = c.drafts || 0;

  // Important + AI counts derive from the triage buckets
  try {
    const triage = await api('/api/ai/agent-mode');
    state.triage = triage;
    document.getElementById('countImportant').textContent =
      triage.summaryMetrics.importantCount + triage.summaryMetrics.needsMeCount;
    document.getElementById('countAI').textContent = triage.summaryMetrics.aiCanHandleCount;
  } catch {
    document.getElementById('countImportant').textContent = 0;
    document.getElementById('countAI').textContent = 0;
  }
}

async function loadMessages() {
  const params = new URLSearchParams();

  if (state.accountFilter !== 'all') params.set('accountId', state.accountFilter);
  if (state.search) params.set('search', state.search);

  if (state.view === 'secure') {
    params.set('category', 'secure');
  } else if (state.view === 'sent') {
    params.set('folder', 'sent');
  } else if (state.view === 'drafts') {
    params.set('folder', 'drafts');
  } else {
    params.set('folder', 'inbox');
  }

  let messages = await api(`/api/messages?${params.toString()}`);

  if (state.view === 'important') {
    messages = messages.filter(m => m.priority === 'high' || m.flagged);
  } else if (state.view === 'ai') {
    messages = messages.filter(m => !m.isSecureSession && !m.isSuspicious);
  }

  if (state.tab === 'unread') {
    messages = messages.filter(m => !m.read);
  } else if (state.tab === 'focused') {
    messages = messages.filter(m => m.category === 'work' || m.priority === 'high');
  } else if (state.tab === 'mentions') {
    messages = messages.filter(m => (m.body || '').toLowerCase().includes('alex'));
  }

  state.messages = messages;
  renderList();
}

/* ============================================================
   List rendering
   ============================================================ */

function renderList() {
  const list = document.getElementById('emailList');
  list.innerHTML = '';

  if (state.messages.length === 0) {
    list.innerHTML = `
      <div class="reader-empty" style="height:auto;padding:48px 20px;">
        <i class="fa-regular fa-folder-open"></i>
        <p>No messages here.</p>
      </div>
    `;
    return;
  }

  state.messages.forEach(msg => {
    const el = document.createElement('div');
    el.className = `mail ${msg.read ? '' : 'unread'} ${state.selected?.id === msg.id ? 'active' : ''}`;

    const name = msg.from.name || msg.from.email;
    const color = avatarColor(name);

    el.innerHTML = `
      <div class="mail-avatar" style="background:${color}">
        ${escapeHtml(name[0].toUpperCase())}
        ${msg.read ? '' : '<span class="dot"></span>'}
      </div>
      <div class="mail-body">
        <div class="mail-row1">
          <span class="mail-from">${escapeHtml(name)}</span>
          <span class="mail-time">${formatTime(msg.date)}</span>
        </div>
        <div class="mail-subject">${escapeHtml(msg.subject)}</div>
        <div class="mail-tags">${tagHtml(msg)}</div>
      </div>
    `;

    el.onclick = () => selectMessage(msg);
    list.appendChild(el);
  });
}

function tagHtml(msg) {
  const tags = [];

  if (msg.isSecureSession) {
    tags.push('<span class="pill secure"><i class="fa-solid fa-lock"></i> Secure</span>');
  }
  if (msg.isSuspicious) {
    tags.push('<span class="pill important"><i class="fa-solid fa-triangle-exclamation"></i> Suspicious</span>');
  }
  if (msg.priority === 'high' && !msg.isSecureSession) {
    tags.push('<span class="pill important"><i class="fa-solid fa-circle-exclamation"></i> Important</span>');
  }
  if (msg.category === 'finance') {
    tags.push('<span class="pill action"><i class="fa-solid fa-file-invoice-dollar"></i> Action</span>');
  }
  if (msg.category === 'work' && msg.priority !== 'high') {
    tags.push('<span class="pill summary"><i class="fa-solid fa-wand-magic-sparkles"></i> Summary</span>');
  }
  if (msg.category === 'personal') {
    tags.push('<span class="pill low"><i class="fa-solid fa-arrow-down"></i> Low Priority</span>');
  }

  return tags.join('');
}

/* ============================================================
   Reader
   ============================================================ */

async function selectMessage(msg) {
  state.selected = msg;
  renderList();

  if (!msg.read) {
    msg.read = true;
    api(`/api/messages/${msg.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ read: true })
    }).then(loadCounts);
  }

  renderReader(msg);
}

function renderReader(msg) {
  const reader = document.getElementById('reader');
  reader.classList.add('open');

  const name = msg.from.name || msg.from.email;
  const color = avatarColor(name);

  reader.innerHTML = `
    <div class="reader-inner">
      <div class="reader-top">
        <button class="tool-btn" id="btnBack" title="Back">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <div class="reader-tools">
          <button class="tool-btn" id="btnStar" title="Star">
            <i class="${msg.flagged ? 'fa-solid' : 'fa-regular'} fa-star"
               style="${msg.flagged ? 'color:var(--amber)' : ''}"></i>
          </button>
          <button class="tool-btn" id="btnArchive" title="Archive">
            <i class="fa-solid fa-box-archive"></i>
          </button>
          <button class="tool-btn" id="btnDelete" title="Delete">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>

      <div class="reader-title-row">
        <h1 class="reader-title">${escapeHtml(msg.subject)}</h1>
        <div class="mail-tags">${tagHtml(msg)}</div>
      </div>

      <div class="sender">
        <div class="sender-avatar" style="background:${color}">
          ${escapeHtml(name[0].toUpperCase())}
        </div>
        <div class="sender-meta">
          <strong>${escapeHtml(name)}</strong>
          <span>${escapeHtml(msg.from.email)} &nbsp;·&nbsp; to ${escapeHtml(
            msg.to.map(t => t.email || t).join(', ')
          )}</span>
        </div>
        <span class="sender-time">${formatFull(msg.date)}</span>
      </div>

      <div id="aiSlot"></div>

      ${msg.isSecureSession ? secureBannerHtml() : `
        <div class="reader-body">${escapeHtml(msg.body)}</div>
        ${attachmentsHtml(msg)}
      `}

      <div class="reader-actions">
        <button class="btn-primary" id="btnDraftReply">
          <i class="fa-solid fa-wand-magic-sparkles"></i> Draft Reply
        </button>
        <button class="btn-outline" id="btnReply">
          <i class="fa-solid fa-reply"></i> Reply
        </button>
        <button class="btn-outline" id="btnAskAI">
          <i class="fa-regular fa-comment-dots"></i> Ask AI
        </button>
        <span class="spacer"></span>
      </div>
    </div>
  `;

  bindReaderEvents(msg);
  loadAiSummary(msg);
}

function secureBannerHtml() {
  return `
    <div class="secure-card">
      <div class="secure-card-head">
        <i class="fa-solid fa-shield-halved"></i> ZMail Secure Session
      </div>
      <p>
        This message is end-to-end encrypted. Intermediate mail servers and general
        AI models cannot read it without your explicit authorization.
      </p>
      <button class="btn-secure" id="btnOpenSecure">
        <i class="fa-solid fa-lock-open"></i> Authenticate &amp; Open
      </button>
    </div>
  `;
}

function attachmentsHtml(msg) {
  if (!msg.attachments || msg.attachments.length === 0) return '';

  const cards = msg.attachments.map(a => {
    const kind = fileKind(a.name);
    return `
      <div class="attach">
        <div class="attach-icon ${kind.cls}"><i class="${kind.icon}"></i></div>
        <div class="attach-meta">
          <strong>${escapeHtml(a.name)}</strong>
          <span>${escapeHtml(a.size || '')}</span>
        </div>
      </div>
    `;
  }).join('');

  return `<div class="attachments">${cards}</div>`;
}

function fileKind(name = '') {
  const ext = name.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext)) return { cls: '', icon: 'fa-solid fa-file-pdf' };
  if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return { cls: 'doc', icon: 'fa-solid fa-file-word' };
  if (['xls', 'xlsx', 'csv'].includes(ext)) return { cls: 'sheet', icon: 'fa-solid fa-file-excel' };
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return { cls: 'img', icon: 'fa-solid fa-file-image' };
  return { cls: 'doc', icon: 'fa-solid fa-file' };
}

function bindReaderEvents(msg) {
  document.getElementById('btnBack').onclick = closeReader;

  document.getElementById('btnStar').onclick = async () => {
    msg.flagged = !msg.flagged;
    await api(`/api/messages/${msg.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ flagged: msg.flagged })
    });
    renderReader(msg);
    loadCounts();
  };

  document.getElementById('btnArchive').onclick = async () => {
    await api(`/api/messages/${msg.id}/archive`, { method: 'POST' });
    closeReader();
    await refreshAll();
  };

  document.getElementById('btnDelete').onclick = async () => {
    await api(`/api/messages/${msg.id}`, { method: 'DELETE' });
    closeReader();
    await refreshAll();
  };

  document.getElementById('btnReply').onclick = () => openReply(msg);
  document.getElementById('btnDraftReply').onclick = () => draftReply(msg);
  document.getElementById('btnAskAI').onclick = () => askAi(msg);

  const secureBtn = document.getElementById('btnOpenSecure');
  if (secureBtn) {
    secureBtn.onclick = () => openSecureModal(msg.secureSessionId);
  }
}

function closeReader() {
  document.getElementById('reader').classList.remove('open');
  state.selected = null;
  renderList();
}

/* ============================================================
   AI summary
   ============================================================ */

async function loadAiSummary(msg) {
  const slot = document.getElementById('aiSlot');
  if (!slot) return;

  try {
    const res = await api('/api/ai/summarize', {
      method: 'POST',
      body: JSON.stringify({ messageId: msg.id })
    });

    if (res.blocked) {
      slot.innerHTML = `
        <div class="ai-card">
          <div class="ai-card-head"><i class="fa-solid fa-wand-magic-sparkles"></i> AI Summary</div>
          <div class="ai-blocked">
            <i class="fa-solid fa-lock"></i>
            <span>${escapeHtml(res.reason)}</span>
          </div>
        </div>
      `;
      return;
    }

    const bullets = [];
    if (res.summary) bullets.push(res.summary);
    (res.keyPoints || []).forEach(p => bullets.push(p));
    (res.deadlines || []).forEach(d => bullets.push(`Deadline: ${d}`));
    (res.actionItems || []).forEach(a => bullets.push(`Action: ${a}`));

    slot.innerHTML = `
      <div class="ai-card">
        <div class="ai-card-head"><i class="fa-solid fa-wand-magic-sparkles"></i> AI Summary</div>
        <ul class="ai-list">
          ${bullets.slice(0, 5).map(b => `<li>${escapeHtml(b)}</li>`).join('')}
        </ul>
      </div>
    `;
  } catch {
    slot.innerHTML = '';
  }
}

/* ============================================================
   Compose
   ============================================================ */

function openCompose(init = {}) {
  document.getElementById('composeTo').value = init.to || '';
  document.getElementById('composeSubject').value = init.subject || '';
  document.getElementById('composeBody').value = init.body || '';
  document.getElementById('composeSecure').checked = !!init.secure;
  document.getElementById('composeModal').hidden = false;
}

function openReply(msg) {
  openCompose({
    to: msg.from.email,
    subject: msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`,
    secure: !!msg.isSecureSession
  });
}

async function draftReply(msg) {
  try {
    const res = await api('/api/ai/smart-replies', {
      method: 'POST',
      body: JSON.stringify({ messageId: msg.id })
    });
    openCompose({
      to: msg.from.email,
      subject: msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`,
      body: res.replies?.[0] || '',
      secure: !!msg.isSecureSession
    });
  } catch {
    openReply(msg);
  }
}

async function askAi(msg) {
  const q = prompt('Ask ZMail AI about this email:');
  if (!q) return;
  try {
    const res = await api('/api/ai/query', {
      method: 'POST',
      body: JSON.stringify({ query: q })
    });
    alert(`ZMail AI\n\n${res.message}`);
  } catch (e) {
    alert(`AI unavailable: ${e.message}`);
  }
}

/* ============================================================
   Secure session modal
   ============================================================ */

async function openSecureModal(sessionId) {
  const modal = document.getElementById('secureModal');
  const body = document.getElementById('secureBody');
  modal.hidden = false;
  body.innerHTML = `<div class="agent-loading"><i class="fa-solid fa-circle-notch fa-spin"></i><p>Authenticating secure key...</p></div>`;

  try {
    const data = await api(`/api/secure/session/${sessionId}`);

    body.innerHTML = `
      <div class="sec-meta">
        <div class="sec-id">
          <span>Session</span>
          <strong>${escapeHtml(data.id)}</strong>
        </div>
        <span class="sec-cipher">ECDH P-256 · AES-256-GCM</span>
      </div>

      <div class="sec-ai">
        <div class="sec-ai-copy">
          <strong><i class="fa-solid fa-robot"></i> AI Boundary Control</strong>
          <span>Allow AI to process this decrypted content? Explicit grant required.</span>
        </div>
        <button class="btn-outline ${data.aiAccessAllowed ? 'is-on' : ''}" id="btnToggleAi">
          ${data.aiAccessAllowed ? '<i class="fa-solid fa-check"></i> Granted' : 'Grant Access'}
        </button>
      </div>

      <div class="sec-items">
        ${data.items.map(item => `
          <div class="sec-item">
            <div class="sec-item-head">
              <strong>${escapeHtml(item.sender)}</strong>
              <span>${new Date(item.timestamp || item.receivedAt).toLocaleTimeString()}</span>
            </div>
            <div class="sec-item-subject">${escapeHtml(item.subject || '')}</div>
            <div class="sec-item-body">${escapeHtml(item.body || '')}</div>
            ${item.attachments?.length ? `
              <div class="sec-item-file">
                <i class="fa-solid fa-file-shield"></i>
                ${escapeHtml(item.attachments.map(a => a.name).join(', '))}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <div class="sec-reply">
        <label for="secReply"><i class="fa-solid fa-lock"></i> Encrypted Reply</label>
        <textarea id="secReply" placeholder="Type confidential response..."></textarea>
        <button class="btn-secure" id="btnSendSecure">
          <i class="fa-solid fa-shield-halved"></i> Send Encrypted Reply
        </button>
      </div>
    `;

    document.getElementById('btnToggleAi').onclick = async () => {
      await api(`/api/secure/session/${sessionId}/ai-access`, {
        method: 'POST',
        body: JSON.stringify({ authorized: !data.aiAccessAllowed })
      });
      openSecureModal(sessionId);
    };

    document.getElementById('btnSendSecure').onclick = async () => {
      const val = document.getElementById('secReply').value.trim();
      if (!val) return;
      await api(`/api/secure/session/${sessionId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ body: val })
      });
      openSecureModal(sessionId);
    };
  } catch (err) {
    body.innerHTML = `<div class="ai-blocked"><i class="fa-solid fa-triangle-exclamation"></i><span>${escapeHtml(err.message)}</span></div>`;
  }
}

/* ============================================================
   AI Agent Mode
   ============================================================ */

async function openAgentModal() {
  const modal = document.getElementById('agentModal');
  const body = document.getElementById('agentBody');
  modal.hidden = false;
  body.innerHTML = `<div class="agent-loading"><i class="fa-solid fa-circle-notch fa-spin"></i><p>Analyzing inbox and preparing actions...</p></div>`;

  const triage = await api('/api/ai/agent-mode');
  state.triage = triage;
  const { buckets, summaryMetrics } = triage;

  body.innerHTML = `
    <div class="agent-metrics">
      <div class="metric red"><b>${summaryMetrics.needsMeCount}</b><span>Needs Me</span></div>
      <div class="metric violet"><b>${summaryMetrics.aiCanHandleCount}</b><span>AI Can Handle</span></div>
      <div class="metric amber"><b>${summaryMetrics.waitingCount}</b><span>Waiting</span></div>
      <div class="metric blue"><b>${summaryMetrics.importantCount}</b><span>Priority</span></div>
    </div>

    <div class="agent-title violet"><i class="fa-solid fa-robot"></i> Proposed Actions</div>
    <div class="agent-list">
      ${buckets.aiCanHandle.map((act, i) => `
        <label class="agent-action">
          <input type="checkbox" class="agent-check" data-idx="${i}" checked>
          <div class="agent-action-body">
            <div class="agent-action-head">
              <strong>${escapeHtml(act.subject)}</strong>
              <span>${escapeHtml(act.from)}</span>
            </div>
            <div class="agent-action-desc">${escapeHtml(act.description)}</div>
            ${act.proposedDraft ? `<pre class="agent-draft">${escapeHtml(act.proposedDraft)}</pre>` : ''}
          </div>
        </label>
      `).join('')}
    </div>

    <div class="agent-title red"><i class="fa-solid fa-user-lock"></i> Requires Your Decision</div>
    <div class="agent-list">
      ${buckets.needsMe.map(item => `
        <div class="agent-needs">
          <strong>${escapeHtml(item.subject)}</strong>
          <span>${escapeHtml(item.reason)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

async function runAgentActions() {
  if (!state.triage) return;

  const checks = [...document.querySelectorAll('.agent-check:checked')];
  const actions = checks.map(cb => {
    const item = state.triage.buckets.aiCanHandle[Number(cb.dataset.idx)];
    return {
      type: item.proposedAction.type,
      messageId: item.proposedAction.messageId,
      draft: item.proposedDraft
    };
  });

  if (actions.length === 0) {
    alert('No actions selected.');
    return;
  }

  await api('/api/ai/execute-actions', {
    method: 'POST',
    body: JSON.stringify({ actions })
  });

  document.getElementById('agentModal').hidden = true;
  alert(`Executed ${actions.length} AI action(s).`);
  await refreshAll();
}

/* ============================================================
   Events
   ============================================================ */

function bindEvents() {
  // Sidebar views
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.view = btn.dataset.view;
      state.search = '';
      document.getElementById('searchInput').value = '';
      loadMessages();
    };
  });

  // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.tab = tab.dataset.tab;
      loadMessages();
    };
  });

  // Search
  const search = document.getElementById('searchInput');
  search.addEventListener('input', e => {
    const v = e.target.value.trim();
    if (v === '' && state.search !== '') {
      state.search = '';
      loadMessages();
    }
  });
  search.addEventListener('keydown', async e => {
    if (e.key !== 'Enter') return;
    const q = search.value.trim();
    state.search = q;

    const looksLikeQuestion = /^(find|how|what|when|who|show|clean|summar)/i.test(q);
    if (looksLikeQuestion) {
      try {
        const res = await api('/api/ai/query', {
          method: 'POST',
          body: JSON.stringify({ query: q })
        });
        alert(`ZMail AI\n\n${res.message}`);
        if (res.data) {
          state.messages = res.data;
          renderList();
        }
        return;
      } catch {
        /* fall through to plain search */
      }
    }
    loadMessages();
  });

  document.getElementById('btnRefresh').onclick = refreshAll;
  document.getElementById('btnAgentMode').onclick = openAgentModal;

  // Compose
  document.getElementById('btnComposeMobile').onclick = () => openCompose();
  document.getElementById('btnCloseCompose').onclick = () => {
    document.getElementById('composeModal').hidden = true;
  };
  document.getElementById('btnCancelCompose').onclick = () => {
    document.getElementById('composeModal').hidden = true;
  };

  document.querySelectorAll('.chip-btn').forEach(btn => {
    btn.onclick = async () => {
      const text = document.getElementById('composeBody').value;
      if (!text.trim()) return;
      const res = await api('/api/ai/transform', {
        method: 'POST',
        body: JSON.stringify({ text, tone: btn.dataset.tone })
      });
      document.getElementById('composeBody').value = res.output;
    };
  });

  document.getElementById('btnSendEmail').onclick = async () => {
    const accountId = document.getElementById('composeAccount').value;
    const to = document.getElementById('composeTo').value.trim();
    const subject = document.getElementById('composeSubject').value.trim();
    const body = document.getElementById('composeBody').value.trim();
    const isSecure = document.getElementById('composeSecure').checked;

    if (!to || !subject) {
      alert('Recipient and subject are required.');
      return;
    }

    await api('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ accountId, to, subject, body, isSecure })
    });

    document.getElementById('composeModal').hidden = true;
    await refreshAll();
  };

  // Agent modal
  document.getElementById('btnCloseAgent').onclick = () => {
    document.getElementById('agentModal').hidden = true;
  };
  document.getElementById('btnCloseAgentFoot').onclick = () => {
    document.getElementById('agentModal').hidden = true;
  };
  document.getElementById('btnRunAgent').onclick = runAgentActions;

  // Secure modal
  document.getElementById('btnCloseSecure').onclick = () => {
    document.getElementById('secureModal').hidden = true;
  };

  // Connect account
  document.getElementById('btnConnectAccount').onclick = () => {
    document.getElementById('connectModal').hidden = false;
  };
  document.getElementById('btnCloseConnect').onclick = () => {
    document.getElementById('connectModal').hidden = true;
  };
  document.getElementById('btnCancelConnect').onclick = () => {
    document.getElementById('connectModal').hidden = true;
  };
  document.getElementById('btnSaveConnect').onclick = async () => {
    const provider = document.getElementById('connProvider').value;
    const name = document.getElementById('connName').value.trim();
    const email = document.getElementById('connEmail').value.trim();

    if (!email) {
      alert('Email address is required.');
      return;
    }

    await api('/api/accounts', {
      method: 'POST',
      body: JSON.stringify({ provider, name, email })
    });

    document.getElementById('connectModal').hidden = true;
    await loadAccounts();
  };

  // Mobile nav
  document.querySelectorAll('.mobile-nav-item').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.mobile-nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.mobile;
      if (target === 'inbox') {
        state.view = 'inbox';
        loadMessages();
      } else if (target === 'secure') {
        state.view = 'secure';
        loadMessages();
      } else if (target === 'search') {
        document.getElementById('searchInput').focus();
      } else if (target === 'settings') {
        document.getElementById('connectModal').hidden = false;
      }
    };
  });

  // Escape closes modals / reader
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    ['composeModal', 'agentModal', 'secureModal', 'connectModal'].forEach(id => {
      document.getElementById(id).hidden = true;
    });
    closeReader();
  });
}

/* ============================================================
   Helpers
   ============================================================ */

function avatarColor(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatFull(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
