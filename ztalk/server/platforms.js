/**
 * ZTalk — channel catalog (was: ZenChat).
 *
 * ZTalk is a *unified shell*. It does not pretend to be the official client of
 * each messenger: every platform below declares honestly how it can be reached
 * (`mode`) so the UI never over-promises.
 *
 *   mode: 'official-api'  — a documented provider API/Business API exists.
 *   mode: 'bridge'        — needs a local/self-hosted bridge (e.g. Matrix, Beeper).
 *   mode: 'webhook'       — inbound webhooks are documented; outbound is limited.
 *   mode: 'demo'          — seeded sandbox data only. Not a live connection.
 *
 * Nothing here stores third-party credentials. `secretHint` documents *which*
 * environment variable an operator would set on their own deployment.
 */

export const PLATFORMS = {
  whatsapp: {
    id: 'whatsapp',
    label: 'WhatsApp',
    short: 'WA',
    color: '#25D366',
    tint: '#e8fbf0',
    glyph: 'phone',
    family: 'personal',
    mode: 'official-api',
    api: 'WhatsApp Cloud API (Meta)',
    secretHint: 'WHATSAPP_CLOUD_TOKEN',
    supports: ['text', 'media', 'voice', 'reactions', 'groups', 'templates'],
    note: 'Personal WhatsApp has no open API. Business messaging runs on the Cloud API with per-template approval.'
  },
  wechat: {
    id: 'wechat',
    label: 'WeChat',
    short: 'WC',
    color: '#07C160',
    tint: '#e8fbf1',
    glyph: 'messages',
    family: 'personal',
    mode: 'official-api',
    api: 'WeChat Official Account / Enterprise WeChat',
    secretHint: 'WECHAT_APP_TOKEN',
    supports: ['text', 'media', 'official-account', 'miniprogram'],
    note: 'Consumer WeChat is closed. Official Accounts and WeCom offer documented APIs.'
  },
  telegram: {
    id: 'telegram',
    label: 'Telegram',
    short: 'TG',
    color: '#2AABEE',
    tint: '#e9f6fe',
    glyph: 'send',
    family: 'personal',
    mode: 'official-api',
    api: 'Telegram Bot API / MTProto',
    secretHint: 'TELEGRAM_BOT_TOKEN',
    supports: ['text', 'media', 'voice', 'stickers', 'topics', 'bots', 'channels'],
    note: 'The most open platform here — bots, channels and MTProto clients are all first-class.'
  },
  line: {
    id: 'line',
    label: 'LINE',
    short: 'LN',
    color: '#06C755',
    tint: '#e9fbf0',
    glyph: 'chat',
    family: 'personal',
    mode: 'official-api',
    api: 'LINE Messaging API',
    secretHint: 'LINE_CHANNEL_TOKEN',
    supports: ['text', 'media', 'stickers', 'rich-menu', 'groups'],
    note: 'Messaging API covers 1:1 and group chats. Sticker sets need a separate lookup.'
  },
  kakaotalk: {
    id: 'kakaotalk',
    label: 'KakaoTalk',
    short: 'KK',
    color: '#FEE500',
    tint: '#fffbdc',
    glyph: 'chat',
    family: 'personal',
    mode: 'official-api',
    api: 'Kakao Talk Channel / AlimTalk',
    secretHint: 'KAKAO_REST_KEY',
    supports: ['text', 'alimtalk', 'channel', 'friends'],
    note: 'AlimTalk covers business notifications. Ordinary friend chat is not exposed.'
  },
  zalo: {
    id: 'zalo',
    label: 'Zalo',
    short: 'ZL',
    color: '#0068FF',
    tint: '#e8f0ff',
    glyph: 'messages',
    family: 'personal',
    mode: 'official-api',
    api: 'Zalo Official Account API',
    secretHint: 'ZALO_OA_TOKEN',
    supports: ['text', 'media', 'oa', 'broadcast'],
    note: 'Official Account API is documented; personal accounts are not.'
  },
  messenger: {
    id: 'messenger',
    label: 'Messenger',
    short: 'MS',
    color: '#0084FF',
    tint: '#e8f2ff',
    glyph: 'bubbles',
    family: 'personal',
    mode: 'official-api',
    api: 'Meta Messenger Platform',
    secretHint: 'MESSENGER_PAGE_TOKEN',
    supports: ['text', 'media', 'quick-replies', 'pages', 'handover'],
    note: 'Page-scoped. 24-hour messaging window applies unless a message tag is used.'
  },
  instagram: {
    id: 'instagram',
    label: 'Instagram',
    short: 'IG',
    color: '#E1306C',
    tint: '#fdeaf3',
    glyph: 'camera',
    family: 'personal',
    mode: 'official-api',
    api: 'Instagram Messaging API (via Meta)',
    secretHint: 'IG_PAGE_TOKEN',
    supports: ['text', 'media', 'dms', 'story-replies'],
    note: 'Business/Creator accounts only, through the Meta Graph API.'
  },
  signal: {
    id: 'signal',
    label: 'Signal',
    short: 'SG',
    color: '#3A76F0',
    tint: '#eaefff',
    glyph: 'shield',
    family: 'personal',
    mode: 'bridge',
    api: 'signal-cli / libsignal bridge',
    secretHint: 'SIGNAL_CLI_URL',
    supports: ['text', 'media', 'groups', 'e2ee'],
    note: 'No official business API. Requires a self-hosted bridge you operate. End-to-end encryption is preserved only inside that bridge.'
  },
  teams: {
    id: 'teams',
    label: 'Microsoft Teams',
    short: 'TM',
    color: '#5059C9',
    tint: '#eceefc',
    glyph: 'grid',
    family: 'work',
    mode: 'official-api',
    api: 'Microsoft Graph (Teams channelMessage)',
    secretHint: 'GRAPH_TENANT_TOKEN',
    supports: ['text', 'channels', 'meetings', 'adaptive-cards', 'files'],
    note: 'Graph covers channels and meetings. Personal chat needs delegated scopes.'
  },
  slack: {
    id: 'slack',
    label: 'Slack',
    short: 'SL',
    color: '#611F69',
    tint: '#f5ecf7',
    glyph: 'hash',
    family: 'work',
    mode: 'official-api',
    api: 'Slack Web API + Events',
    secretHint: 'SLACK_BOT_TOKEN',
    supports: ['text', 'threads', 'files', 'reactions', 'huddles', 'canvas'],
    note: 'Threads, reactions and files map cleanly. Huddles have no send API.'
  },
  discord: {
    id: 'discord',
    label: 'Discord',
    short: 'DC',
    color: '#5865F2',
    tint: '#eceefc',
    glyph: 'gamepad',
    family: 'work',
    mode: 'official-api',
    api: 'Discord Gateway + REST',
    secretHint: 'DISCORD_BOT_TOKEN',
    supports: ['text', 'threads', 'files', 'voice', 'forums', 'reactions'],
    note: 'Bots can read and post in guilds. DMs need explicit intent approval.'
  },
  wecom: {
    id: 'wecom',
    label: 'WeCom',
    short: 'WE',
    color: '#2F7DF6',
    tint: '#e9f1ff',
    glyph: 'building',
    family: 'work',
    mode: 'official-api',
    api: 'WeCom (Enterprise WeChat) API',
    secretHint: 'WECOM_CORP_SECRET',
    supports: ['text', 'apps', 'groups', 'approval', 'directory'],
    note: 'Enterprise messaging with an approval workflow — a natural ZTalk fit.'
  },
  dingtalk: {
    id: 'dingtalk',
    label: 'DingTalk',
    short: 'DT',
    color: '#1272F5',
    tint: '#e8f1ff',
    glyph: 'bell',
    family: 'work',
    mode: 'official-api',
    api: 'DingTalk Open Platform',
    secretHint: 'DINGTALK_APP_SECRET',
    supports: ['text', 'groups', 'work-notification', 'approval', 'robots'],
    note: 'Robot webhooks are the quickest path; full app needs corp credentials.'
  }
};

export const PLATFORM_KEYS = Object.keys(PLATFORMS);

export function platformMeta(key) {
  const p = PLATFORMS[key];
  if (!p) return { id: key, label: key || 'Unknown', short: '??', color: '#94a3b8', tint: '#f1f5f9', glyph: 'chat', family: 'personal', mode: 'demo', supports: [] };
  return p;
}

/** Which platforms can be driven two-way from a server deployment today. */
export function twoWayPlatforms() {
  return PLATFORM_KEYS.filter((k) => PLATFORMS[k].mode === 'official-api');
}

export function platformsByFamily(family) {
  return PLATFORM_KEYS.filter((k) => PLATFORMS[family] !== false && (!family || PLATFORMS[k].family === family));
}

/** The marketing "More" tray shown in the design (top-right of the header). */
export const HEADER_TRAY = [
  'whatsapp', 'wechat', 'telegram', 'line', 'kakaotalk', 'zalo',
  'messenger', 'instagram', 'signal', 'teams', 'slack', 'discord', 'wecom', 'dingtalk'
];

export const TONES = [
  { key: 'professional', label: 'Professional', blurb: 'Clear, courteous, business-ready.' },
  { key: 'short', label: 'Short', blurb: 'Two sentences, no filler.' },
  { key: 'friendly', label: 'Friendly', blurb: 'Warm, human, a little informal.' },
  { key: 'direct', label: 'Direct', blurb: 'Bottom line first, no cushioning.' }
];

export const TRANSLATION_TARGETS = [
  { key: 'en', label: 'English', badge: 'EN' },
  { key: 'zh', label: '中文', badge: '中' },
  { key: 'ja', label: '日本語', badge: '日' },
  { key: 'ko', label: '한국어', badge: '한' },
  { key: 'ms', label: 'Bahasa Melayu', badge: 'MS' },
  { key: 'vi', label: 'Tiếng Việt', badge: 'VI' },
  { key: 'bn', label: 'বাংলা', badge: 'বাং' },
  { key: 'ur', label: 'اردو', badge: 'اردو' },
  { key: 'ar', label: 'العربية', badge: 'ع' }
];

/** Every detection kind ZTalk's AI can surface, with its icon + accent. */
export const DETECTION_KINDS = {
  meeting: {
    key: 'meeting',
    label: 'Event Detected',
    icon: 'calendar',
    accent: 'blue',
    action: 'Create ZenMeet',
    secondary: 'Add to ZenCalendar'
  },
  task: {
    key: 'task',
    label: 'Task Detected',
    icon: 'check',
    accent: 'green',
    action: 'Add to Tasks',
    secondary: 'Assign owner'
  },
  payment: {
    key: 'payment',
    label: 'Payment Detected',
    icon: 'card',
    accent: 'amber',
    action: 'Add to Ledger',
    secondary: 'Draft reminder'
  },
  followup: {
    key: 'followup',
    label: 'Follow-up Needed',
    icon: 'reply',
    accent: 'violet',
    action: 'Draft reply',
    secondary: 'Snooze'
  },
  deadline: {
    key: 'deadline',
    label: 'Deadline Detected',
    icon: 'clock',
    accent: 'rose',
    action: 'Add to ZenCalendar',
    secondary: 'Notify owner'
  },
  decision: {
    key: 'decision',
    label: 'Decision Recorded',
    icon: 'gavel',
    accent: 'violet',
    action: 'Save to minutes',
    secondary: 'Share summary'
  }
};
