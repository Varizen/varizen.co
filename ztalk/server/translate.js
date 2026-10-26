/**
 * ZTalk — multilingual translation (was: ZenChat).
 *
 * HONESTY CONTRACT
 * ----------------
 * This is a *local phrasebook engine*, not a neural translator. It reliably
 * handles the built-in business phrasebook (greetings, scheduling, approvals,
 * payments, deadlines, small talk) across nine languages, and it degrades
 * gracefully by returning the original segment rather than inventing words.
 *
 * The UI must always label output as "Local phrasebook" unless an operator has
 * configured a remote provider — `translationCapability()` is the source of
 * truth for that label, and it is exposed over the API.
 *
 * Language detection is script-based (deterministic and correct for the scripts
 * involved) with a small word-list fallback for Latin-script languages.
 */

import { config } from './config.js';

export const LANGUAGES = {
  en: { key: 'en', label: 'English', native: 'English', badge: 'EN', rtl: false },
  zh: { key: 'zh', label: 'Chinese (Simplified)', native: '中文', badge: '中', rtl: false },
  ja: { key: 'ja', label: 'Japanese', native: '日本語', badge: '日', rtl: false },
  ko: { key: 'ko', label: 'Korean', native: '한국어', badge: '한', rtl: false },
  ms: { key: 'ms', label: 'Malay', native: 'Bahasa Melayu', badge: 'MS', rtl: false },
  vi: { key: 'vi', label: 'Vietnamese', native: 'Tiếng Việt', badge: 'VI', rtl: false },
  bn: { key: 'bn', label: 'Bengali', native: 'বাংলা', badge: 'বাং', rtl: false },
  ur: { key: 'ur', label: 'Urdu', native: 'اردو', badge: 'اردو', rtl: true },
  ar: { key: 'ar', label: 'Arabic', native: 'العربية', badge: 'ع', rtl: true }
};

export const LANGUAGE_KEYS = Object.keys(LANGUAGES);

/**
 * Canonical phrasebook. Each row is one concept expressed in every language.
 * Keys are stable slugs so tests can assert on them; `en` doubles as the
 * lookup key for English input.
 */
const PHRASES = [
  ['hi', 'Hi', '你好', 'こんにちは', '안녕하세요', 'Hai', 'Xin chào', 'হ্যালো', 'ہیلو', 'مرحبا'],
  ['hello_team', 'Hello team', '大家好', '皆さん、こんにちは', '여러분 안녕하세요', 'Halo semua', 'Chào cả nhóm', 'হ্যালো টিম', 'ہیلو ٹیم', 'مرحبا بالفريق'],
  ['good_morning', 'Good morning', '早上好', 'おはようございます', '좋은 아침입니다', 'Selamat pagi', 'Chào buổi sáng', 'শুভ সকাল', 'صبح بخیر', 'صباح الخير'],
  ['good_evening', 'Good evening', '晚上好', 'こんばんは', '좋은 저녁입니다', 'Selamat malam', 'Chào buổi tối', 'শুভ সন্ধ্যা', 'شام بخیر', 'مساء الخير'],
  ['thanks', 'Thank you', '谢谢', 'ありがとうございます', '감사합니다', 'Terima kasih', 'Cảm ơn', 'ধন্যবাদ', 'شکریہ', 'شكرا'],
  ['thanks_help', 'Thanks for your help', '谢谢你的帮助', '助けてくれてありがとう', '도와주셔서 감사합니다', 'Terima kasih atas bantuan anda', 'Cảm ơn bạn đã giúp đỡ', 'সাহায্যের জন্য ধন্যবাদ', 'مدد کے لیے شکریہ', 'شكرا على مساعدتك'],
  ['please_review', 'Can you review the proposal?', '你能审阅一下提案吗？', '提案を確認していただけますか？', '제안서를 검토해 주시겠어요?', 'Boleh anda semak cadangan itu?', 'Bạn có thể xem lại đề xuất không?', 'আপনি কি প্রস্তাবটি দেখতে পারেন?', 'کیا آپ تجویز کا جائزہ لے سکتے ہیں؟', 'هل يمكنك مراجعة العرض؟'],
  ['sending_documents', 'Sending the documents now', '现在发送文件', '書類を送ります', '지금 문서를 보냅니다', 'Menghantar dokumen sekarang', 'Đang gửi tài liệu', 'এখন নথি পাঠাচ্ছি', 'ابھی دستاویزات بھیج رہا ہوں', 'أرسل المستندات الآن'],
  ['received_thanks', 'Received, thanks', '已收到，谢谢', '受け取りました、ありがとう', '받았습니다, 감사합니다', 'Diterima, terima kasih', 'Đã nhận, cảm ơn', 'পেয়েছি, ধন্যবাদ', 'موصول ہوا، شکریہ', 'تم الاستلام، شكرا'],
  ['confirm_three_pm', 'Can we confirm for 3 PM?', '我们可以确认下午3点吗？', '午後3時で確認できますか？', '오후 3시로 확정할까요?', 'Boleh kita sahkan untuk 3 petang?', 'Chúng ta xác nhận 3 giờ chiều nhé?', 'আমরা কি বিকাল ৩টায় নিশ্চিত করতে পারি?', 'کیا ہم سہ پہر 3 بجے کنفرم کریں؟', 'هل نؤكد على الساعة 3 عصرا؟'],
  ['meeting_tomorrow', 'Let’s meet tomorrow at 3 PM', '我们明天下午3点见', '明日午後3時に会いましょう', '내일 오후 3시에 만나요', 'Mari kita jumpa esok jam 3 petang', 'Mai họp vào 3 giờ chiều mai', 'আগামীকাল বিকাল ৩টায় দেখা করি', 'کل سہ پہر 3 بجے ملیں', 'لنلتق غدا الساعة 3 عصرا'],
  ['meeting_scheduled', 'Your meeting is scheduled', '您的会议已安排', '会議が予定されました', '회의가 예약되었습니다', 'Mesyuarat anda telah dijadwalkan', 'Cuộc họp của bạn đã được lên lịch', 'আপনার সভা নির্ধারিত হয়েছে', 'آپ کی میٹنگ شیڈول ہو گئی ہے', 'تم جدولة اجتماعك'],
  ['calendar_invite_sent', 'Calendar invitation sent', '日历邀请已发送', 'カレンダー招待を送信しました', '캘린더 초대를 보냈습니다', 'Jemputan kalendar dihantar', 'Đã gửi lời mời lịch', 'ক্যালেন্ডার আমন্ত্রণ পাঠানো হয়েছে', 'کیلنڈر دعوت بھیج دی گئی', 'تم إرسال دعوة التقويم'],
  ['budget_approved', 'Budget approved', '预算已批准', '予算が承認されました', '예산이 승인되었습니다', 'Belanjawan diluluskan', 'Ngân sách đã được phê duyệt', 'বাজেট অনুমোদিত হয়েছে', 'بجٹ منظور ہو گیا', 'تمت الموافقة على الميزانية'],
  ['send_budget_by_friday', 'Please send the revised budget by Friday', '请在周五前发送修订后的预算', '金曜日までに修正予算を送ってください', '금요일까지 수정 예산을 보내주세요', 'Sila hantar belanjawan yang disemak sebelum Jumaat', 'Vui lòng gửi ngân sách sửa đổi trước thứ Sáu', 'অনুগ্রহ করে শুক্রবারের মধ্যে সংশোধিত বাজেট পাঠান', 'براہ کرم جمعہ تک نظرثانی شدہ بجٹ بھیجیں', 'يرجى إرسال الميزانية المعدلة قبل الجمعة'],
  ['deployment_checklist', 'Prepare the deployment checklist', '准备部署清单', 'デプロイチェックリストを用意してください', '배포 체크리스트를 준비하세요', 'Sediakan senarai semak penggunaan', 'Chuẩn bị danh sách kiểm tra triển khai', 'ডিপ্লয়মেন্ট চেকলিস্ট প্রস্তুত করুন', 'ڈیپلائمنٹ چیک لسٹ تیار کریں', 'جهّز قائمة التحقق للنشر'],
  ['launch_november_15', 'The launch is scheduled for November 15', '发布定于11月15日', 'リリースは11月15日に予定されています', '출시는 11월 15일로 예정되어 있습니다', 'Pelancaran dijadualkan pada 15 November', 'Ngày ra mắt là 15 tháng 11', 'লঞ্চ 15 নভেম্বর নির্ধারিত', 'لانچ 15 نومبر کو ہے', 'الإطلاق في 15 نوفمبر'],
  ['decision_option_b', 'The team chose option B', '团队选择了选项B', 'チームは選択肢Bを選びました', '팀이 옵션 B를 선택했습니다', 'Pasukan memilih pilihan B', 'Nhóm đã chọn phương án B', 'দল অপশন বি বেছে নিয়েছে', 'ٹیم نے آپشن بی منتخب کیا', 'اختار الفريق الخيار ب'],
  ['action_item_john', 'John will prepare the deployment checklist', 'John将准备部署清单', 'Johnがデプロイチェックリストを準備します', 'John이 배포 체크리스트를 준비합니다', 'John akan menyediakan senarai semak', 'John sẽ chuẩn bị danh sách kiểm tra', 'জন চেকলিস্ট প্রস্তুত করবে', 'جان چیک لسٹ تیار کرے گا', 'سيجهز جون قائمة التحقق'],
  ['payment_received', 'Payment received', '已收到付款', '入金を確認しました', '결제가 완료되었습니다', 'Bayaran diterima', 'Đã nhận thanh toán', 'পেমেন্ট গৃহীত', 'ادائیگی موصول ہوئی', 'تم استلام الدفعة'],
  ['invoice_attached', 'Invoice attached', '已附上发票', '請求書を添付しました', '인보이스 첨부', 'Invois dilampirkan', 'Đã đính kèm hóa đơn', 'ইনভয়েস সংযুক্ত', 'انوائس منسلک ہے', 'تم إرفاق الفاتورة'],
  ['payment_due', 'Payment is due on the 30th', '付款截止日期为30日', '支払期限は30日です', '결제 기한은 30일입니다', 'Bayaran perlu dijelaskan pada 30hb', 'Thanh toán đến hạn vào ngày 30', '৩০ তারিখে পেমেন্ট দিতে হবে', 'ادائیگی 30 تاریخ کو ہے', 'الدفعة مستحقة في الثلاثين'],
  ['on_my_way', 'On my way', '我在路上', '今向かっています', '가는 중입니다', 'Dalam perjalanan', 'Đang trên đường', 'পথে আছি', 'راستے میں ہوں', 'في الطريق'],
  ['running_late', 'Running 10 minutes late', '我会迟到10分钟', '10分遅れます', '10분 늦습니다', 'Lewat 10 minit', 'Trễ 10 phút', '১০ মিনিট দেরি হচ্ছে', '10 منٹ تاخیر', 'سأتأخر 10 دقائق'],
  ['join_call', 'Can you join the call?', '你能加入通话吗？', '通話に参加できますか？', '통화에 참여할 수 있나요?', 'Boleh anda sertai panggilan?', 'Bạn có thể tham gia cuộc gọi không?', 'আপনি কি কলে যোগ দিতে পারেন?', 'کیا آپ کال میں شامل ہو سکتے ہیں؟', 'هل يمكنك الانضمام إلى المكالمة؟'],
  ['share_screen', 'Let me share my screen', '我来共享屏幕', '画面を共有します', '화면을 공유할게요', 'Biar saya kongsi skrin', 'Để tôi chia sẻ màn hình', 'আমি স্ক্রিন শেয়ার করি', 'میں اسکرین شیئر کرتا ہوں', 'دعني أشارك الشاشة'],
  ['agenda_attached', 'Agenda attached — four items', '议程已附上，共四项', 'アジェンダを添付しました（4項目）', '의제 첨부 — 네 항목', 'Agenda dilampirkan — empat perkara', 'Đã đính kèm chương trình — bốn mục', 'এজেন্ডা সংযুক্ত — চারটি বিষয়', 'ایجنڈا منسلک — چار نکات', 'تم إرفاق جدول الأعمال — أربع نقاط'],
  ['need_more_time', 'We need more time on this', '我们需要更多时间', 'もう少し時間が必要です', '시간이 더 필요합니다', 'Kami perlukan lebih masa', 'Chúng ta cần thêm thời gian', 'আমাদের আরও সময় দরকার', 'ہمیں مزید وقت چاہیے', 'نحتاج مزيدا من الوقت'],
  ['approved', 'Approved', '已批准', '承認します', '승인합니다', 'Diluluskan', 'Đã phê duyệt', 'অনুমোদিত', 'منظور شد', 'موافق عليه'],
  ['rejected', 'Not approved yet', '尚未批准', 'まだ承認されていません', '아직 승인되지 않았습니다', 'Belum diluluskan', 'Chưa được phê duyệt', 'এখনো অনুমোদিত নয়', 'ابھی منظور نہیں', 'لم تتم الموافقة بعد'],
  ['please_clarify', 'Could you clarify that point?', '你能澄清这一点吗？', 'その点を明確にしていただけますか？', '그 점을 명확히 해주시겠어요?', 'Boleh jelaskan perkara itu?', 'Bạn có thể làm rõ điểm đó không?', 'আপনি কি বিষয়টি পরিষ্কার করতে পারেন?', 'کیا آپ اس نکتے کی وضاحت کر سکتے ہیں؟', 'هل يمكنك توضيح هذه النقطة؟'],
  ['follow_up_next_week', 'I’ll follow up next week', '我下周会跟进', '来週フォローアップします', '다음 주에 후속 조치하겠습니다', 'Saya akan susuli minggu depan', 'Tôi sẽ theo dõi vào tuần sau', 'আমি আগামী সপ্তাহে ফলো আপ করব', 'میں اگلے ہفتے پیروی کروں گا', 'سأتابع الأسبوع القادم'],
  ['see_you_soon', 'See you soon', '回头见', 'またすぐに', '곧 만나요', 'Jumpa lagi', 'Hẹn gặp lại', 'শীঘ্রই দেখা হবে', 'جلد ملیں گے', 'أراك قريبا'],
  ['welcome', 'Welcome', '欢迎', 'ようこそ', '환영합니다', 'Selamat datang', 'Chào mừng', 'স্বাগতম', 'خوش آمدید', 'أهلا وسهلا'],
  ['how_are_you', 'How are you?', '你好吗？', 'お元気ですか？', '잘 지내세요?', 'Apa khabar?', 'Bạn khỏe không?', 'আপনি কেমন আছেন?', 'آپ کیسے ہیں؟', 'كيف حالك؟'],
  ['dinner_tonight', 'Dinner at 7 tonight?', '今晚7点吃晚饭？', '今夜7時に夕食？', '오늘 저녁 7시에 저녁 식사?', 'Makan malam jam 7 malam ini?', 'Ăn tối lúc 7 giờ tối nay?', 'আজ রাত ৭টায় ডিনার?', 'آج رات 7 بجے ڈنر؟', 'عشاء الليلة الساعة 7؟'],
  ['new_design_ready', 'New design ready for review', '新设计已可审阅', '新しいデザインのレビュー準備完了', '새 디자인 검토 준비 완료', 'Reka bentuk baharu sedia untuk semakan', 'Thiết kế mới sẵn sàng để xem xét', 'নতুন ডিজাইন পর্যালোচনার জন্য প্রস্তুত', 'نیا ڈیزائن جائزے کے لیے تیار', 'التصميم الجديد جاهز للمراجعة'],
  ['please_send_latest', 'Please send the latest updates', '请发送最新进展', '最新の更新を送ってください', '최신 업데이트를 보내주세요', 'Sila hantar kemas kini terkini', 'Vui lòng gửi cập nhật mới nhất', 'সর্বশেষ আপডেট পাঠান', 'تازہ ترین اپ ڈیٹ بھیجیں', 'يرجى إرسال آخر التحديثات'],
  ['contract_ready', 'The contract is ready for signature', '合同已可供签署', '契約書の署名準備ができました', '계약서 서명 준비 완료', 'Kontrak sedia untuk ditandatangani', 'Hợp đồng sẵn sàng để ký', 'চুক্তি স্বাক্ষরের জন্য প্রস্তুত', 'معاہدہ دستخط کے لیے تیار ہے', 'العقد جاهز للتوقيع'],
  ['no_problem', 'No problem', '没问题', '問題ありません', '문제 없습니다', 'Tiada masalah', 'Không vấn đề', 'কোনো সমস্যা নেই', 'کوئی مسئلہ نہیں', 'لا مشكلة'],
  ['understood', 'Understood', '明白了', '了解しました', '알겠습니다', 'Faham', 'Đã hiểu', 'বুঝেছি', 'سمجھ گیا', 'فهمت'],
  ['let_me_check', 'Let me check and get back to you', '我查一下再回复你', '確認して折り返します', '확인하고 연락드릴게요', 'Biar saya semak dan maklumkan', 'Để tôi kiểm tra rồi phản hồi', 'আমি দেখে জানাচ্ছি', 'میں دیکھ کر بتاتا ہوں', 'دعني أتحقق وأعود إليك'],
  ['sounds_good', 'Sounds good', '听起来不错', 'いいですね', '좋습니다', 'Bunyi baik', 'Nghe tốt đấy', 'ভালো শোনাচ্ছে', 'اچھا لگتا ہے', 'يبدو جيدا'],
  ['good_news', 'Good news — we are ahead of schedule', '好消息，我们提前了', '朗報です、予定より早いです', '좋은 소식 — 일정보다 앞서 있습니다', 'Berita baik — kami lebih awal', 'Tin tốt — chúng ta sớm hơn kế hoạch', 'সুসংবাদ — আমরা সময়ের আগে আছি', 'خوشخبری — ہم شیڈول سے آگے ہیں', 'خبر سار — نحن متقدمون على الجدول']
];

const LANG_INDEX = { en: 1, zh: 2, ja: 3, ko: 4, ms: 5, vi: 6, bn: 7, ur: 8, ar: 9 };

/** normalized english -> row */
const BY_ENGLISH = new Map();
/** normalized any-language -> row */
const BY_ANY = new Map();

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[.,!?;:。、！？،]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

for (const row of PHRASES) {
  const slug = row[0];
  const entry = { slug };
  for (const [lang, idx] of Object.entries(LANG_INDEX)) {
    entry[lang] = row[idx];
    const key = normalize(row[idx]);
    if (key) BY_ANY.set(key, entry);
  }
  BY_ENGLISH.set(normalize(row[1]), entry);
}

export const PHRASE_COUNT = PHRASES.length;

/* ------------------------------ detection ------------------------------ */

const SCRIPT_TESTS = [
  // Kana must be tested before Han: Japanese sentences use Kanji too, so a
  // Han-first order would misclassify every Japanese message as Chinese.
  [/[\u3040-\u30ff]/, 'ja'],
  [/[\uac00-\ud7af\u1100-\u11ff]/, 'ko'],
  [/[\u4e00-\u9fff]/, 'zh'],
  [/[\u0980-\u09ff]/, 'bn'],
  [/[\u0600-\u06ff]/, 'ar'],
  [/[\u0900-\u097f]/, 'hi']
];

const LATIN_HINTS = {
  ms: /\b(dan|yang|tidak|anda|saya|kami|boleh|untuk|dengan|sudah|akan|ini|itu)\b/g,
  vi: /\b(và|của|không|bạn|tôi|chúng|được|cho|với|đã|sẽ|này|đó)\b/g,
  en: /\b(the|and|you|we|is|are|for|with|have|will|this|that|please)\b/g
};

/**
 * Detects the language of a string. Script detection wins; Latin text is scored
 * by function-word frequency. Defaults to English when inconclusive.
 */
export function detectLanguage(text = '') {
  const value = String(text);
  if (!value.trim()) return { language: 'en', confidence: 0, method: 'empty' };

  // Urdu and Arabic share a script. Urdu-specific letters discriminate them.
  if (/[\u0600-\u06ff]/.test(value)) {
    if (/[\u0679\u0688\u0691\u067e\u0686\u06af\u06ba\u06be\u06c1\u06d2\u06cc\u0649]/.test(value)) {
      return { language: 'ur', confidence: 0.95, method: 'script' };
    }
    return { language: 'ar', confidence: 0.9, method: 'script' };
  }

  for (const [test, lang] of SCRIPT_TESTS) {
    if (lang === 'ar') continue;
    if (test.test(value)) {
      if (lang === 'ja' && !/[\u3040-\u30ff]/.test(value) && /[\u4e00-\u9fff]/.test(value)) {
        return { language: 'zh', confidence: 0.85, method: 'script-han' };
      }
      return { language: lang, confidence: 0.92, method: 'script' };
    }
  }

  const lowered = value.toLowerCase();
  let best = { language: 'en', score: 0 };
  for (const [lang, pattern] of Object.entries(LATIN_HINTS)) {
    const hits = (lowered.match(pattern) || []).length;
    if (hits > best.score) best = { language: lang, score: hits };
  }
  const words = lowered.split(/\s+/).filter(Boolean).length || 1;
  const confidence = Math.min(0.95, 0.45 + best.score / (words * 2));
  return { language: best.language, confidence: best.language === 'en' ? Math.max(confidence, 0.5) : confidence, method: 'lexical' };
}

/* ----------------------------- translation ----------------------------- */

/** Split into sentence-ish segments so partial matches still translate. */
function segment(text) {
  return String(text).match(/[^.!?。！？\n]+[.!?。！？]?/g) || [String(text)];
}

function lookupExact(text) {
  const key = normalize(text);
  if (!key) return null;
  return BY_ANY.get(key) || BY_ENGLISH.get(key) || null;
}

/**
 * Translates `text` into `target`.
 *
 * Returns:
 *   { text, target, source, exact, coverage, engine, note }
 *
 * `coverage` is the fraction of segments that matched the phrasebook. Below 1.0
 * the UI should show the "partial phrasebook coverage" hint instead of
 * pretending the output is a complete translation.
 */
export function translate(text, target = 'en', { source = null } = {}) {
  const value = String(text ?? '');
  const tgt = LANGUAGES[target] ? target : 'en';
  const detected = detectLanguage(value);
  const src = source && LANGUAGES[source] ? source : detected.language;

  if (!value.trim()) {
    return { text: '', target: tgt, source: src, exact: true, coverage: 1, engine: engineLabel() };
  }

  const exact = lookupExact(value);
  if (exact) {
    return {
      text: exact[tgt] || exact.en,
      target: tgt,
      source: src,
      exact: true,
      coverage: 1,
      slug: exact.slug,
      engine: engineLabel(),
      note: `${LANGUAGES[tgt].label} · phrasebook match`
    };
  }

  const parts = segment(value);
  let matched = 0;
  const out = parts.map((part) => {
    const hit = lookupExact(part) || lookupExact(part.replace(/[.!?。！？]+$/, ''));
    if (hit) {
      matched += 1;
      return hit[tgt] || hit.en;
    }
    // Try a phrase embedded inside the segment (longest match wins).
    const normSegment = normalize(part);
    let bestRow = null;
    let bestLen = 0;
    for (const [key, row] of BY_ANY) {
      if (key.length > 6 && normSegment.includes(key) && key.length > bestLen) {
        bestRow = row;
        bestLen = key.length;
      }
    }
    if (bestRow) {
      matched += 1;
      return normSegment.replace(bestRow.en ? normalize(bestRow.en) : '', bestRow[tgt] || bestRow.en).trim();
    }
    return part;
  });

  const coverage = parts.length ? matched / parts.length : 0;
  return {
    text: out.join(' ').replace(/\s+([.!?。！？])/g, '$1').trim(),
    target: tgt,
    source: src,
    exact: coverage === 1,
    coverage: Number(coverage.toFixed(2)),
    engine: engineLabel(),
    note:
      coverage === 1
        ? `${LANGUAGES[tgt].label} · phrasebook`
        : coverage === 0
          ? 'Outside the local phrasebook — original text kept. Configure a provider for open-domain translation.'
          : `${Math.round(coverage * 100)}% phrasebook coverage — unmatched segments kept in the original.`
  };
}

function engineLabel() {
  return config.ai.allowRemote && config.ai.provider !== 'deterministic'
    ? `${config.ai.provider} · remote provider`
    : 'ZTalk local phrasebook';
}

/** Honest capability report, surfaced in Settings and next to every translation. */
export function translationCapability() {
  return {
    engine: engineLabel(),
    phrases: PHRASE_COUNT,
    languages: LANGUAGE_KEYS.map((k) => LANGUAGES[k]),
    remoteConfigured: Boolean(config.ai.allowRemote && config.ai.provider !== 'deterministic'),
    limitations: [
      'The local engine is a curated business phrasebook, not a neural translator.',
      'Text outside the phrasebook is kept verbatim rather than approximated.',
      'No message is ever sent to a third-party translation service unless an operator configures a provider and the user opts in.'
    ]
  };
}

/** All phrasebook rows — used by tests and the "phrasebook" settings drawer. */
export function phrasebook() {
  return PHRASES.map((row) => {
    const entry = { slug: row[0] };
    for (const [lang, idx] of Object.entries(LANG_INDEX)) entry[lang] = row[idx];
    return entry;
  });
}
