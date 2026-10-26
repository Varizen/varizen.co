# ZMail — Universal AI Email Application

ZMail (formerly **ZenBox**) is a super-light, universal AI email client with a dedicated **AI Agent Mode** and **ZMail Secure Sessions** (end-to-end encrypted private email sessions).

All components are contained strictly inside the `zmail/` directory without polluting or altering external workspace modules.

---

## 🌟 Key Features

### 1. Unified Mailbox Engine (`server/mailEngine.js`)
- Connects **Gmail, Outlook, Yahoo, iCloud, and custom IMAP/SMTP** accounts.
- Preserves native email storage at original providers (zero centralized vendor lock-in).
- Unified Inbox view with multi-identity sending, searching, archiving, starring, and drafts.

### 2. AI Mailbox Automation & Copilot (`server/aiEngine.js`)
- **AI Agent Mode ("Take care of my emails")**:
  - Automatically analyzes the inbox into 4 buckets:
    - **Needs Me**: Decisions requiring user sign-off or authorization.
    - **AI Can Handle**: Routine replies, scheduling suggestions, spam quarantine.
    - **Waiting**: Follow-up conversations awaiting third-party response.
    - **Important**: Milestone sign-offs and critical communications.
- **Smart Summaries & Extractions**: Automatically surfaces deadlines, financial amounts, and commitments.
- **AI Copilot**: Rewrites drafts, adjusts tones (Concise, Formal, Friendly), generates quick reply pills.
- **Natural Language Command Assistant**: Answers conversational requests (e.g., *"Find everything related to the SAMC project"*, *"How much do I owe in invoices?"*).

### 3. ZMail Secure Sessions (`server/crypto.js` & `server/secureVault.js`)
- End-to-end encrypted sessions based on **NIST P-256 ECDH** key derivation and **AES-256-GCM** authenticated ciphering.
- Decrypted messages are kept strictly **in-memory** only with ephemeral expiration.
- **AI Security Boundary**: External AI services are blocked from accessing decrypted secure session content by default unless explicitly granted by the user.
- Encrypted envelopes are never rendered as raw ciphertext in the reading pane, and smart replies are suppressed for secure threads.

### 4. Sleek Interface (`public/`)
- Thin, high-density design system: 50px header, hairline borders, 6px radii, tabular numerals.
- Near-black cool-cast surfaces with desaturated accents (blue / violet / green / amber / rose).
- Three-pane desktop layout that collapses to a two-pane mobile layout with a slide-in reading pane.
- Zero external CSS frameworks — one hand-written stylesheet with design tokens.

---

## 🚀 Running ZMail

**No `npm install` required** — the server uses only Node.js built-in modules.

### Run Tests
```bash
npm test
# Or directly:
node --test tests/zenbox.test.js
```

### Start Server
```bash
node server/index.js
```
Then visit `http://localhost:4200` to interact with the web client.

---

## 📁 Directory Structure
```
zmail/
├── package.json
├── README.md
├── prompt1.txt
├── server/
│   ├── crypto.js          # Audited cryptographic primitives (P-256 ECDH, AES-256-GCM)
│   ├── secureVault.js     # Ephemeral in-memory vault with AI boundary controls
│   ├── mailEngine.js      # Multi-account unified mailbox orchestrator
│   ├── aiEngine.js        # AI triage agent, copilot, tone transformer
│   └── index.js           # Express API and static server
├── public/
│   ├── index.html         # Application shell & modal markup
│   ├── style.css          # Design tokens, thin UI system, responsive layout
│   └── app.js             # Client-side reactivity, AI triggers, secure viewer
└── tests/
    └── zenbox.test.js     # Automated unit & integration test suite (legacy name kept)
```

---

## 🎨 Design Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--bg-base` | `#08090c` | App background |
| `--bg-panel` | `#0b0d11` | Header, sidebar |
| `--bg-raised` | `#101318` | Cards, selected rows |
| `--line` | `rgba(255,255,255,.055)` | Hairline borders |
| `--accent` | `#5b8cff` | Primary actions |
| `--violet` | `#a78bfa` | AI surfaces |
| `--green` | `#34d399` | Secure sessions |
| `--amber` | `#fbbf24` | Deadlines |
| `--rose` | `#fb7185` | Destructive / needs-me |

Metrics: header `50px`, sidebar `208px`, list `344px`, radii `4/6/8/12px`.
