/**
 * ZCal — demo dataset. (was: ZenCalendar)
 *
 * Mirrors the reference design exactly: week of Mon 14 – Fri 18 April 2025 with
 * six connected accounts (Google, Outlook, iCloud, Varizen, Personal, Work).
 *
 * This is sample data for a local/demo account only. In production each provider
 * adapter feeds real native events; nothing here is duplicated into providers.
 */

const TZ = 'Asia/Karachi';

/**
 * Demo events are anchored to the *current* week so the calendar always looks
 * alive. Day 0 = Monday of this week (the design's Monday column).
 */
function mondayOfThisWeek() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short'
  }).formatToParts(now);
  const get = (t) => parts.find((p) => p.type === t).value;
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const shift = (weekday + 6) % 7; // Monday-first offset
  const utcMidnight = Date.UTC(Number(get('year')), Number(get('month')) - 1, Number(get('day')) - shift);
  // Midnight in Asia/Karachi (UTC+5) == 19:00 UTC the previous day.
  return utcMidnight - 5 * 60 * 60 * 1000;
}

const WEEK_BASE_MS = mondayOfThisWeek();

/** ISO instant for `hour:minute` on day-offset `day` (0 = Monday) of this week. */
function at(day, hour, minute = 0) {
  return new Date(WEEK_BASE_MS + day * 86400000 + (hour * 60 + minute) * 60000).toISOString();
}

export const demoAccounts = [
  {
    id: 'acc_google',
    provider: 'google',
    label: 'Google Calendar',
    email: 'tahseen@gmail.com',
    identityId: 'id_personal',
    color: '#4285F4',
    status: 'connected',
    timeZone: TZ,
    tokens: { accessToken: 'demo-token', expiresAt: null, refreshCipher: null, scope: 'calendar.events calendar.readonly' },
    lastSyncAt: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'acc_microsoft',
    provider: 'microsoft',
    label: 'Microsoft 365',
    email: 'tahseen@outlook.com',
    identityId: 'id_business',
    color: '#0F6CBD',
    status: 'connected',
    timeZone: TZ,
    tokens: { accessToken: 'demo-token', expiresAt: null, refreshCipher: null, scope: 'Calendars.ReadWrite' },
    lastSyncAt: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'acc_icloud',
    provider: 'apple',
    label: 'iCloud',
    email: 'tahseen@icloud.com',
    identityId: 'id_personal',
    color: '#5B8DEF',
    status: 'connected',
    timeZone: TZ,
    serverUrl: 'https://caldav.icloud.com',
    username: 'tahseen',
    secretCipher: 'demo',
    lastSyncAt: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'acc_varizen',
    provider: 'caldav',
    label: 'Varizen',
    email: 'tahseen@varizen.co',
    identityId: 'id_varizen',
    color: '#12B76A',
    status: 'connected',
    timeZone: TZ,
    serverUrl: 'https://caldav.varizen.co',
    username: 'tahseen',
    secretCipher: 'demo',
    lastSyncAt: null,
    createdAt: new Date().toISOString()
  }
];

export const demoIdentities = [
  { id: 'id_personal', label: 'Personal', email: 'tahseen@gmail.com', color: '#7A5AF8' },
  { id: 'id_business', label: 'Business', email: 'tahseen@outlook.com', color: '#0F6CBD' },
  { id: 'id_varizen', label: 'Varizen', email: 'tahseen@varizen.co', color: '#12B76A' }
];

export const demoCalendars = [
  { id: 'cal_google_work', accountId: 'acc_google', provider: 'google', name: 'Work Calendar', color: '#7A5AF8', primary: true, readOnly: false, visible: true, timeZone: TZ },
  { id: 'cal_google_personal', accountId: 'acc_google', provider: 'google', name: 'Personal Calendar', color: '#2F6BFF', primary: false, readOnly: false, visible: true, timeZone: TZ },
  { id: 'cal_ms_365', accountId: 'acc_microsoft', provider: 'microsoft', name: 'Microsoft 365', color: '#0F6CBD', primary: true, readOnly: false, visible: true, timeZone: TZ },
  { id: 'cal_icloud', accountId: 'acc_icloud', provider: 'apple', name: 'iCloud', color: '#5B8DEF', primary: true, readOnly: false, visible: true, timeZone: TZ },
  { id: 'cal_varizen', accountId: 'acc_varizen', provider: 'caldav', name: 'Varizen Calendar', color: '#12B76A', primary: true, readOnly: false, visible: true, timeZone: TZ }
];

const c = (id) => demoCalendars.find((x) => x.id === id);

function ev(partial) {
  const cal = c(partial.calendarId);
  return {
    description: '',
    location: '',
    attendees: [],
    recurrence: [],
    recurrenceLabel: null,
    availability: 'busy',
    status: 'confirmed',
    reminders: [{ minutesBefore: 10, type: 'popup' }],
    attachments: [],
    conference: null,
    organizer: null,
    ...partial,
    id: `${cal.accountId}:${cal.id}:${partial.remoteId}`,
    remoteId: partial.remoteId,
    iCalUID: `${partial.remoteId}@zcal.local`,
    provider: cal.provider,
    accountId: cal.accountId,
    calendarId: cal.id,
    calendarName: cal.name,
    calendarColor: cal.color,
    timeZone: partial.timeZone || TZ,
    allDay: Boolean(partial.allDay),
    updatedAt: new Date().toISOString(),
    native: { kind: cal.provider }
  };
}

export const demoEvents = [
  ev({
    remoteId: 'evt_standup',
    calendarId: 'cal_google_work',
    title: 'Team Standup',
    start: at(0, 9, 0),
    end: at(0, 9, 30),
    location: 'Zoom',
    conference: { url: 'https://zoom.us/j/standup', label: 'Zoom' },
    description: 'Daily sync with the platform team.',
    organizer: { email: 'tahseen@gmail.com', name: 'Tahseen' },
    attendees: [
      { email: 'tahseen@gmail.com', name: 'Tahseen', status: 'accepted', organizer: true, self: true },
      { email: 'sarah.k@varizen.co', name: 'Sarah K.', status: 'accepted' },
      { email: 'john@varizen.co', name: 'John', status: 'accepted' }
    ],
    recurrence: ['RRULE:FREQ=WEEKLY;BYDAY=MO'],
    recurrenceLabel: 'Every Monday'
  }),
  ev({
    remoteId: 'evt_client',
    calendarId: 'cal_google_work',
    title: 'Client Meeting',
    start: at(0, 10, 0),
    end: at(0, 11, 0),
    location: 'Google Meet',
    conference: { url: 'https://meet.google.com/client', label: 'Google Meet' },
    description: 'Quarterly review with the Halden Group.',
    organizer: { email: 'tahseen@gmail.com', name: 'Tahseen' },
    attendees: [
      { email: 'tahseen@gmail.com', name: 'Tahseen', status: 'accepted', organizer: true, self: true },
      { email: 'john@varizen.co', name: 'John', status: 'accepted' }
    ]
  }),
  ev({
    remoteId: 'evt_product_review',
    calendarId: 'cal_ms_365',
    title: 'Product Review',
    start: at(0, 11, 30),
    end: at(0, 12, 30),
    location: 'Room 4B',
    description: 'ZCal sandbox walkthrough.',
    organizer: { email: 'tahseen@outlook.com', name: 'Tahseen' },
    attendees: [
      { email: 'tahseen@outlook.com', name: 'Tahseen', status: 'accepted', organizer: true, self: true },
      { email: 'finance@varizen.co', name: 'Finance Team', status: 'needs-action' }
    ]
  }),
  ev({
    remoteId: 'evt_lunch',
    calendarId: 'cal_google_personal',
    title: 'Lunch',
    start: at(0, 12, 30),
    end: at(0, 13, 30),
    availability: 'free',
    description: 'Lunch with the design team.'
  }),
  ev({
    remoteId: 'evt_marketing',
    calendarId: 'cal_varizen',
    title: 'Marketing Sync',
    start: at(0, 14, 0),
    end: at(0, 15, 0),
    location: 'Varizen HQ',
    description: 'Campaign launch sequencing.',
    organizer: { email: 'tahseen@varizen.co', name: 'Tahseen' },
    attendees: [
      { email: 'tahseen@varizen.co', name: 'Tahseen', status: 'accepted', organizer: true, self: true },
      { email: 'sarah.k@varizen.co', name: 'Sarah K.', status: 'accepted' }
    ]
  }),
  ev({
    remoteId: 'evt_kickoff',
    calendarId: 'cal_varizen',
    title: 'ZMeet: Project Kickoff',
    start: at(0, 15, 30),
    end: at(0, 16, 30),
    location: 'ZMeet',
    conference: { url: 'https://zcal.local/meet/kickoff', label: 'ZMeet' },
    description: 'Kickoff for the ZMeet scheduling integration.',
    organizer: { email: 'tahseen@varizen.co', name: 'Tahseen' },
    attendees: [
      { email: 'tahseen@varizen.co', name: 'Tahseen', status: 'accepted', organizer: true, self: true },
      { email: 'john@varizen.co', name: 'John', status: 'needs-action' },
      { email: 'sarah.k@varizen.co', name: 'Sarah K.', status: 'tentative' }
    ]
  }),
  ev({
    remoteId: 'evt_deepwork',
    calendarId: 'cal_google_work',
    title: 'Deep Work',
    start: at(2, 9, 0),
    end: at(2, 12, 0),
    description: 'Protected focus block — no meetings.',
    availability: 'free',
    organizer: { email: 'tahseen@gmail.com', name: 'Tahseen' },
    attendees: [{ email: 'tahseen@gmail.com', name: 'Tahseen', status: 'accepted', organizer: true, self: true }]
  }),
  ev({
    remoteId: 'evt_john',
    calendarId: 'cal_icloud',
    title: 'Meeting with John',
    start: at(3, 13, 0),
    end: at(3, 13, 45),
    location: 'Phone',
    description: 'Scheduling follow-up.'
  }),
  ev({
    remoteId: 'evt_design_review',
    calendarId: 'cal_google_work',
    title: 'Design Review',
    start: at(3, 14, 0),
    end: at(3, 15, 0),
    location: 'Figma',
    description: 'Review the new sandbox panel layouts.',
    organizer: { email: 'tahseen@gmail.com', name: 'Tahseen' },
    attendees: [
      { email: 'tahseen@gmail.com', name: 'Tahseen', status: 'accepted', organizer: true, self: true },
      { email: 'sarah.k@varizen.co', name: 'Sarah K.', status: 'accepted' }
    ]
  }),
  ev({
    remoteId: 'evt_investor',
    calendarId: 'cal_ms_365',
    title: 'Investor Call',
    start: at(3, 16, 0),
    end: at(3, 17, 0),
    location: 'Teams',
    conference: { url: 'https://teams.microsoft.com/l/investor', label: 'Teams' },
    description: 'Series A update with Halden Capital.',
    organizer: { email: 'tahseen@outlook.com', name: 'Tahseen' },
    attendees: [
      { email: 'tahseen@outlook.com', name: 'Tahseen', status: 'accepted', organizer: true, self: true },
      { email: 'investors@halden.capital', name: 'Halden Capital', status: 'accepted' }
    ]
  }),
  // A deliberate conflict for the agent + sandbox demo (Tuesday 15:30 overlap)
  ev({
    remoteId: 'evt_budget_review',
    calendarId: 'cal_ms_365',
    title: 'Budget Review',
    start: at(1, 15, 0),
    end: at(1, 16, 0),
    location: 'Teams',
    description: 'Q2 cost review with finance.',
    organizer: { email: 'tahseen@outlook.com', name: 'Tahseen' },
    attendees: [
      { email: 'tahseen@outlook.com', name: 'Tahseen', status: 'accepted', organizer: true, self: true },
      { email: 'finance@varizen.co', name: 'Finance Team', status: 'accepted' }
    ]
  }),
  ev({
    remoteId: 'evt_finance',
    calendarId: 'cal_google_work',
    title: 'Finance Meeting',
    start: at(1, 15, 30),
    end: at(1, 16, 15),
    description: 'Budget review for Q2.',
    organizer: { email: 'tahseen@gmail.com', name: 'Tahseen' },
    attendees: [
      { email: 'tahseen@gmail.com', name: 'Tahseen', status: 'accepted', organizer: true, self: true },
      { email: 'finance@varizen.co', name: 'Finance Team', status: 'needs-action' }
    ]
  })
];

export const demoTasks = [
  { id: 'task_1', title: 'Prepare board deck', due: at(3, 17, 0), done: false, eventId: 'evt_kickoff', minutes: 30 },
  { id: 'task_2', title: 'Send ZMeet invite', due: at(1, 12, 0), done: false, eventId: 'evt_kickoff', minutes: 10 },
  { id: 'task_3', title: 'Reply to John about timing', due: at(1, 9, 0), done: true, eventId: 'evt_john', minutes: 5 }
];
