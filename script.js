/* ══════════════════════════════════════════════════════════════
   HawkEye AI — script.js
   All Features: Three.js 3D · Page Loader · Claude API ·
   Streaming · Auto-Translate · Compare Mode · History ·
   Voice I/O · File · Magnetic Buttons · Reveal Animations
   ══════════════════════════════════════════════════════════════ */
"use strict";

/* ── CONFIG ───────────────────────────────────────────────────── */
const API_URL = "https://api.anthropic.com/v1/messages";
const API_KEY = ""; // Replace with your API key.
const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 2048;
const HISTORY_KEY = "hawkeyeai_history";
const THEME_KEY = "hawkeyeai_theme";
const LEGACY_HISTORY_KEY = "linguaai_v2_history"; // old key — read once so saved history isn't lost
const LEGACY_THEME_KEY = "linguaai_v2_theme";
const HISTORY_PREVIEW_COUNT = 3; // recent items shown before "View All"

/* ── LANGUAGES ────────────────────────────────────────────────── */
const LANGUAGES = [
  { code: "af", name: "Afrikaans", flag: "🇿🇦" }, { code: "sq", name: "Albanian", flag: "🇦🇱" },
  { code: "am", name: "Amharic", flag: "🇪🇹" }, { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hy", name: "Armenian", flag: "🇦🇲" }, { code: "az", name: "Azerbaijani", flag: "🇦🇿" },
  { code: "bn", name: "Bengali", flag: "🇧🇩" }, { code: "bs", name: "Bosnian", flag: "🇧🇦" },
  { code: "bg", name: "Bulgarian", flag: "🇧🇬" }, { code: "ca", name: "Catalan", flag: "🏴" },
  { code: "zh", name: "Chinese (Simplified)", flag: "🇨🇳" }, { code: "zt", name: "Chinese (Traditional)", flag: "🇹🇼" },
  { code: "hr", name: "Croatian", flag: "🇭🇷" }, { code: "cs", name: "Czech", flag: "🇨🇿" },
  { code: "da", name: "Danish", flag: "🇩🇰" }, { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "en", name: "English", flag: "🇬🇧" }, { code: "eo", name: "Esperanto", flag: "🌍" },
  { code: "et", name: "Estonian", flag: "🇪🇪" }, { code: "fi", name: "Finnish", flag: "🇫🇮" },
  { code: "fr", name: "French", flag: "🇫🇷" }, { code: "gl", name: "Galician", flag: "🏴" },
  { code: "ka", name: "Georgian", flag: "🇬🇪" }, { code: "de", name: "German", flag: "🇩🇪" },
  { code: "el", name: "Greek", flag: "🇬🇷" }, { code: "gu", name: "Gujarati", flag: "🇮🇳" },
  { code: "ht", name: "Haitian Creole", flag: "🇭🇹" }, { code: "ha", name: "Hausa", flag: "🇳🇬" },
  { code: "he", name: "Hebrew", flag: "🇮🇱" }, { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "hu", name: "Hungarian", flag: "🇭🇺" }, { code: "is", name: "Icelandic", flag: "🇮🇸" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" }, { code: "ga", name: "Irish", flag: "🇮🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" }, { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "kn", name: "Kannada", flag: "🇮🇳" }, { code: "kk", name: "Kazakh", flag: "🇰🇿" },
  { code: "km", name: "Khmer", flag: "🇰🇭" }, { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "ku", name: "Kurdish", flag: "🏳️" }, { code: "lo", name: "Lao", flag: "🇱🇦" },
  { code: "la", name: "Latin", flag: "🏛️" }, { code: "lv", name: "Latvian", flag: "🇱🇻" },
  { code: "lt", name: "Lithuanian", flag: "🇱🇹" }, { code: "mk", name: "Macedonian", flag: "🇲🇰" },
  { code: "ms", name: "Malay", flag: "🇲🇾" }, { code: "ml", name: "Malayalam", flag: "🇮🇳" },
  { code: "mt", name: "Maltese", flag: "🇲🇹" }, { code: "mi", name: "Maori", flag: "🇳🇿" },
  { code: "mr", name: "Marathi", flag: "🇮🇳" }, { code: "mn", name: "Mongolian", flag: "🇲🇳" },
  { code: "my", name: "Myanmar", flag: "🇲🇲" }, { code: "ne", name: "Nepali", flag: "🇳🇵" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" }, { code: "ps", name: "Pashto", flag: "🇦🇫" },
  { code: "fa", name: "Persian", flag: "🇮🇷" }, { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "pt", name: "Portuguese (Brazil)", flag: "🇧🇷" }, { code: "pa", name: "Punjabi", flag: "🇮🇳" },
  { code: "ro", name: "Romanian", flag: "🇷🇴" }, { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "sm", name: "Samoan", flag: "🇼🇸" }, { code: "sr", name: "Serbian", flag: "🇷🇸" },
  { code: "si", name: "Sinhala", flag: "🇱🇰" }, { code: "sk", name: "Slovak", flag: "🇸🇰" },
  { code: "sl", name: "Slovenian", flag: "🇸🇮" }, { code: "so", name: "Somali", flag: "🇸🇴" },
  { code: "es", name: "Spanish", flag: "🇪🇸" }, { code: "sw", name: "Swahili", flag: "🇰🇪" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" }, { code: "tg", name: "Tajik", flag: "🇹🇯" },
  { code: "ta", name: "Tamil", flag: "🇮🇳" }, { code: "te", name: "Telugu", flag: "🇮🇳" },
  { code: "th", name: "Thai", flag: "🇹🇭" }, { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "tk", name: "Turkmen", flag: "🇹🇲" }, { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" }, { code: "uz", name: "Uzbek", flag: "🇺🇿" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" }, { code: "cy", name: "Welsh", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  { code: "xh", name: "Xhosa", flag: "🇿🇦" }, { code: "yi", name: "Yiddish", flag: "🕍" },
  { code: "yo", name: "Yoruba", flag: "🇳🇬" }, { code: "zu", name: "Zulu", flag: "🇿🇦" }
];

/* ── LOCALES (speech input + text-to-speech) ───────────────────── */
const LOCALE = {
  af: "af-ZA", sq: "sq-AL", am: "am-ET", ar: "ar-SA", hy: "hy-AM", az: "az-AZ", bn: "bn-BD", bs: "bs-BA",
  bg: "bg-BG", ca: "ca-ES", zh: "zh-CN", zt: "zh-TW", hr: "hr-HR", cs: "cs-CZ", da: "da-DK", nl: "nl-NL",
  en: "en-US", eo: "eo", et: "et-EE", fi: "fi-FI", fr: "fr-FR", gl: "gl-ES", ka: "ka-GE", de: "de-DE",
  el: "el-GR", gu: "gu-IN", ht: "ht-HT", ha: "ha-NG", he: "he-IL", hi: "hi-IN", hu: "hu-HU", is: "is-IS",
  id: "id-ID", ga: "ga-IE", it: "it-IT", ja: "ja-JP", kn: "kn-IN", kk: "kk-KZ", km: "km-KH", ko: "ko-KR",
  ku: "ku", lo: "lo-LA", la: "la", lv: "lv-LV", lt: "lt-LT", mk: "mk-MK", ms: "ms-MY", ml: "ml-IN",
  mt: "mt-MT", mi: "mi-NZ", mr: "mr-IN", mn: "mn-MN", my: "my-MM", ne: "ne-NP", no: "nb-NO", ps: "ps-AF",
  fa: "fa-IR", pl: "pl-PL", pt: "pt-BR", pa: "pa-IN", ro: "ro-RO", ru: "ru-RU", sm: "sm-WS", sr: "sr-RS",
  si: "si-LK", sk: "sk-SK", sl: "sl-SI", so: "so-SO", es: "es-ES", sw: "sw-KE", sv: "sv-SE", tg: "tg-TJ",
  ta: "ta-IN", te: "te-IN", th: "th-TH", tr: "tr-TR", tk: "tk-TM", uk: "uk-UA", ur: "ur-PK", uz: "uz-UZ",
  vi: "vi-VN", cy: "cy-GB", xh: "xh-ZA", yi: "yi", yo: "yo-NG", zu: "zu-ZA"
};

/* ── LANGUAGE NOTES (used for Grammar / Cultural tabs when no AI key) ── */
const LANG_NOTES = {
  es: { grammar: "Spanish nouns have grammatical gender, and adjectives agree with them in gender and number. Subject pronouns are often dropped because the verb ending already shows the subject.", culture: "Spanish distinguishes informal “tú” from formal “usted”. The plural “vosotros” is used mainly in Spain; Latin America uses “ustedes”." },
  fr: { grammar: "French nouns are masculine or feminine, adjectives agree with them and usually follow the noun. Negation wraps the verb (ne … pas).", culture: "French uses informal “tu” and formal “vous”. With strangers, “vous” is the safe choice." },
  de: { grammar: "German has three genders and four cases, puts the verb at the end of subordinate clauses, and capitalises every noun.", culture: "German distinguishes informal “du” from formal “Sie”. Use “Sie” until you are invited to use “du”." },
  it: { grammar: "Italian nouns are masculine or feminine and adjectives agree with them. Subject pronouns are usually dropped.", culture: "Italian uses informal “tu” and formal “Lei”. Formal address is common in business and with elders." },
  pt: { grammar: "Portuguese nouns have gender and adjectives agree with them. Subject pronouns are often dropped because verbs are conjugated for person.", culture: "Brazilian Portuguese commonly uses “você”, while European Portuguese keeps a stronger tu/você distinction. Vocabulary and spelling differ between the two." },
  ru: { grammar: "Russian has six cases, three genders, no articles and flexible word order. The verb “to be” is normally omitted in the present tense.", culture: "Russian uses informal “ты” and formal “вы”. Use “вы” with strangers and in formal settings." },
  ja: { grammar: "Japanese uses subject–object–verb order, marks roles with particles (は, が, を, に) and has no articles or grammatical gender.", culture: "Japanese has politeness levels (keigo). The です/ます forms are the safe default in polite situations." },
  zh: { grammar: "Chinese does not conjugate verbs; time and aspect are shown with particles and time words, and measure words are needed between numbers and nouns.", culture: "Chinese is written without spaces between words. Simplified characters are used in mainland China and Singapore, and 您 is the formal “you”." },
  zt: { grammar: "Chinese does not conjugate verbs; time and aspect are shown with particles and time words, and measure words are needed between numbers and nouns.", culture: "Traditional characters are used in Taiwan, Hong Kong and Macau. 您 is the formal “you”, and some vocabulary differs from mainland usage." },
  ko: { grammar: "Korean uses subject–object–verb order, attaches particles to nouns and has no articles or grammatical gender.", culture: "Korean has speech levels: the -요 and -습니다 endings are polite, while 반말 is for close friends and younger people." },
  ar: { grammar: "Arabic is written right to left, nouns are masculine or feminine, and verbs change by person, gender and number. Short vowels are usually not written.", culture: "Modern Standard Arabic is used in writing and formal speech, while spoken dialects differ a lot by region." },
  hi: { grammar: "Hindi uses subject–object–verb order, has masculine and feminine nouns, and uses postpositions (placed after the noun) instead of prepositions.", culture: "Hindi has three levels of “you”: तू (intimate), तुम (informal) and आप (respectful). आप is the safe default." },
  ur: { grammar: "Urdu is written right to left, uses subject–object–verb order and has masculine and feminine nouns.", culture: "Urdu has three forms of “you” (تو، تم، آپ). آپ is the respectful default." },
  tr: { grammar: "Turkish is agglutinative: suffixes are added to word stems, vowel harmony shapes them, and the order is subject–object–verb. It has no grammatical gender.", culture: "Turkish uses informal “sen” and formal “siz”. “Siz” is the safe choice with strangers." },
  nl: { grammar: "Dutch has two genders (common and neuter) and puts the verb at the end of subordinate clauses.", culture: "Dutch has informal “je/jij” and formal “u”. “Je” is common in everyday speech, “u” in formal settings." },
  pl: { grammar: "Polish has seven cases and three genders, no articles, and flexible word order.", culture: "Polish uses “ty” informally and “Pan/Pani” to address people formally." },
  sv: { grammar: "Swedish has two genders (common and neuter), attaches the definite article to the noun (hus → huset), and verbs do not change by person.", culture: "Swedish uses “du” with almost everyone; the formal “ni” is rarely needed today." },
  id: { grammar: "Indonesian has no verb conjugation, tenses or grammatical gender; time words and affixes carry the meaning.", culture: "Indonesian shows politeness with titles such as “Bapak” and “Ibu”, and “Anda” as a formal “you”." },
  vi: { grammar: "Vietnamese is tonal and does not conjugate verbs or inflect nouns; word order and particles carry the meaning.", culture: "Vietnamese chooses pronouns by age and relationship, so “you” has many forms." },
  th: { grammar: "Thai is tonal, written without spaces between words, and does not conjugate verbs; classifiers are used when counting.", culture: "Thai adds the polite particles “ครับ” (male speakers) and “ค่ะ” (female speakers) to show politeness." },
  fa: { grammar: "Persian is written right to left, has no grammatical gender and uses subject–object–verb order.", culture: "Persian has formal and informal “you” (شما and تو), and a courtesy practice called taarof shapes polite conversation." },
  bn: { grammar: "Bengali uses subject–object–verb order, has no grammatical gender, and verbs change with person and level of respect.", culture: "Bengali has three levels of “you” (তুই, তুমি, আপনি). আপনি is the respectful form." },
  he: { grammar: "Hebrew is written right to left, nouns and verbs are masculine or feminine, and short vowels are usually omitted.", culture: "Hebrew has no tu/vous-style formal “you”, and everyday speech is fairly informal and direct." },
  el: { grammar: "Greek has three genders and four cases, and verbs change by person, tense and mood.", culture: "Greek uses informal “εσύ” and formal “εσείς” for “you”." }
};

/* ── STATE ────────────────────────────────────────────────────── */
const S = {
  theme: localStorage.getItem(THEME_KEY) || localStorage.getItem(LEGACY_THEME_KEY) || "dark",
  history: [],
  isTranslating: false,
  isRecording: false,
  recognition: null,
  currentTranslation: "",
  activeMode: "text",
  activeExtrasTab: "alternatives",
  lastParsed: null,
  lastSource: "",
  lastSrcCode: "",
  currentTargetCode: "",
  historyExpanded: false,
  speaking: false,
  speakToken: 0,
  autoTranslateTimer: null,
  mouse: { x: 0, y: 0 },
};

/* ── DOM ──────────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const els = {
  body: document.body,
  canvas: $("threeCanvas"),
  loader: $("pageLoader"),
  loaderFill: $("loaderFill"),
  loaderText: $("loaderText"),
  navbar: $("navbar"),
  hamburger: $("hamburger"),
  mobileMenu: $("mobileMenu"),
  themeToggle: $("themeToggle"),
  themeIcon: $("themeIcon"),
  sourceLang: $("sourceLang"),
  targetLang: $("targetLang"),
  swapBtn: $("swapBtn"),
  sourceText: $("sourceText"),
  charCount: $("charCount"),
  translateBtn: $("translateBtn"),
  outputArea: $("outputArea"),
  outputMeta: $("outputMeta"),
  ratingWrap: $("ratingWrap"),
  detectedLang: $("detectedLang"),
  copyBtn: $("copyBtn"),
  speakBtn: $("speakBtn"),
  speedSelect: $("speedSelect"),
  downloadBtn: $("downloadBtn"),
  shareBtn: $("shareBtn"),
  pasteBtn: $("pasteBtn"),
  micBtn: $("micBtn"),
  clearBtn: $("clearBtn"),
  toneSelect: $("toneSelect"),
  autoTranslate: $("autoTranslate"),
  extrasPanel: $("extrasPanel"),
  extrasContent: $("extrasContent"),
  comparePanel: $("comparePanel"),
  compareGrid: $("compareGrid"),
  voiceOverlay: $("voiceOverlay"),
  voiceLabel: $("voiceLabel"),
  voiceInterim: $("voiceInterim"),
  voiceStopBtn: $("voiceStopBtn"),
  fileOverlay: $("fileOverlay"),
  fileDropZone: $("fileDropZone"),
  fileInput: $("fileInput"),
  closeFileOverlay: $("closeFileOverlay"),
  historySearch: $("historySearch"),
  historyFilterLang: $("historyFilterLang"),
  exportHistoryBtn: $("exportHistoryBtn"),
  clearHistoryBtn: $("clearHistoryBtn"),
  historyList: $("historyList"),
  historyMoreWrap: $("historyMoreWrap"),
  historyViewAllBtn: $("historyViewAllBtn"),
  toastContainer: $("toastContainer"),
  scrollTop: $("scrollTop"),
};

/* ══════════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════════ */
function init() {
  runLoader();
  applyTheme(S.theme);
  populateSelects();
  loadData();
  bindEvents();
  initThreeJS();
  initMagneticButtons();
  initRevealObserver();
  initCounterAnimation();
  initTypingEffect();
}

/* ══════════════════════════════════════════════════════════════
   PAGE LOADER
   ══════════════════════════════════════════════════════════════ */
const loaderSteps = [
  [0, "Initializing AI Engine…"],
  [20, "Loading language models…"],
  [45, "Connecting to translation engine…"],
  [70, "Preparing 3D environment…"],
  [90, "Almost ready…"],
  [100, "Welcome to HawkEye AI!"],
];

function runLoader() {
  let i = 0;
  function step() {
    if (i >= loaderSteps.length) {
      setTimeout(() => { els.loader.classList.add("hidden"); }, 400);
      return;
    }
    const [pct, msg] = loaderSteps[i++];
    els.loaderFill.style.width = pct + "%";
    els.loaderText.textContent = msg;
    setTimeout(step, i === loaderSteps.length ? 300 : 350 + Math.random() * 200);
  }
  step();
}

/* ══════════════════════════════════════════════════════════════
   THREE.JS 3D BACKGROUND
   ══════════════════════════════════════════════════════════════ */
function initThreeJS() {
  if (!window.THREE) return;
  const T = THREE;
  const canvas = els.canvas;
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 50);

  // Particle field
  const geo = new T.BufferGeometry();
  const COUNT = 1800;
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 180;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 180;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    const t = Math.random();
    col[i * 3] = 0.48 + t * 0.02;
    col[i * 3 + 1] = 0.22 + t * 0.5;
    col[i * 3 + 2] = 0.93 - t * 0.1;
  }
  geo.setAttribute("position", new T.BufferAttribute(pos, 3));
  geo.setAttribute("color", new T.BufferAttribute(col, 3));
  const mat = new T.PointsMaterial({ size: 0.55, vertexColors: true, transparent: true, opacity: 0.7 });
  const particles = new T.Points(geo, mat);
  scene.add(particles);

  // Floating torus rings
  const rings = [];
  const torusMat = new T.MeshBasicMaterial({ color: 0x7C3AED, wireframe: true, transparent: true, opacity: 0.12 });
  [28, 40, 55].forEach((r, i) => {
    const tGeo = new T.TorusGeometry(r, 0.25, 8, 80);
    const mesh = new T.Mesh(tGeo, torusMat.clone());
    mesh.rotation.x = Math.PI / (3 + i);
    mesh.rotation.y = (i * Math.PI) / 4;
    scene.add(mesh);
    rings.push(mesh);
  });

  // Icosahedron
  const icoGeo = new T.IcosahedronGeometry(8, 1);
  const icoMat = new T.MeshBasicMaterial({ color: 0x06B6D4, wireframe: true, transparent: true, opacity: 0.08 });
  const ico = new T.Mesh(icoGeo, icoMat);
  ico.position.set(30, -10, -10);
  scene.add(ico);

  // Mouse parallax
  let targetX = 0, targetY = 0;
  document.addEventListener("mousemove", e => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  let frame = 0;
  (function animate() {
    requestAnimationFrame(animate);
    frame += 0.004;
    particles.rotation.y = frame * 0.06;
    particles.rotation.x = frame * 0.02;
    rings.forEach((r, i) => {
      r.rotation.z += 0.002 * (i + 1) * 0.5;
      r.rotation.x += 0.001 * (i + 1) * 0.3;
    });
    ico.rotation.y += 0.003;
    ico.rotation.x += 0.002;
    camera.position.x += (targetX * 4 - camera.position.x) * 0.03;
    camera.position.y += (-targetY * 3 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  })();
}

/* ══════════════════════════════════════════════════════════════
   MAGNETIC BUTTONS
   ══════════════════════════════════════════════════════════════ */
function initMagneticButtons() {
  document.querySelectorAll(".magnetic").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });
    btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
  });
}

/* ══════════════════════════════════════════════════════════════
   TYPING EFFECT (Hero Title)
   ══════════════════════════════════════════════════════════════ */
function initTypingEffect() {
  const el = $("typingText");
  if (!el) return;
  const words = ["Language Barrier", "Communication Gap", "Cultural Divide", "Translation Limit"];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? 55 : 90);
  }
  type();
}

/* ══════════════════════════════════════════════════════════════
   COUNTER ANIMATION
   ══════════════════════════════════════════════════════════════ */
function initCounterAnimation() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target);
      let cur = 0;
      const step = target / 70;
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.floor(cur);
        if (cur >= target) clearInterval(t);
      }, 18);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".stat-num").forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════════════════════
   REVEAL ON SCROLL
   ══════════════════════════════════════════════════════════════ */
function initRevealObserver() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = parseInt(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add("visible"), delay);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal-up,.reveal-left,.reveal-right,.reveal-card").forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════════════════════
   THEME
   ══════════════════════════════════════════════════════════════ */
function applyTheme(theme) {
  S.theme = theme;
  els.body.dataset.theme = theme;
  if (els.themeIcon) els.themeIcon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
  localStorage.setItem(THEME_KEY, theme);
}

/* ══════════════════════════════════════════════════════════════
   SELECTS
   ══════════════════════════════════════════════════════════════ */
function populateSelects() {
  const src = els.sourceLang, tgt = els.targetLang, hist = els.historyFilterLang;
  src.innerHTML = '<option value="auto">🔍 Auto Detect</option>';
  tgt.innerHTML = "";
  hist.innerHTML = '<option value="">All Languages</option>';
  LANGUAGES.forEach(l => {
    src.appendChild(new Option(`${l.flag} ${l.name}`, l.code));
    tgt.appendChild(new Option(`${l.flag} ${l.name}`, l.code));
    hist.appendChild(new Option(`${l.flag} ${l.name}`, l.code));
  });
  src.value = "auto";
  tgt.value = "es";
}

/* ══════════════════════════════════════════════════════════════
   EVENTS
   ══════════════════════════════════════════════════════════════ */
function bindEvents() {
  // Navbar & theme
  window.addEventListener("scroll", onScroll);
  els.hamburger.addEventListener("click", toggleMenu);
  document.querySelectorAll(".mobile-link").forEach(l => l.addEventListener("click", closeMenu));
  if (els.themeToggle) els.themeToggle.addEventListener("click", () => applyTheme(S.theme === "dark" ? "light" : "dark"));

  // Translator
  els.translateBtn.addEventListener("click", handleTranslate);
  els.sourceText.addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleTranslate(); });
  els.sourceText.addEventListener("input", () => { updateCharCount(); handleAutoTranslate(); });
  els.swapBtn.addEventListener("click", swapLanguages);

  // Panel buttons
  els.pasteBtn.addEventListener("click", pasteClipboard);
  els.micBtn.addEventListener("click", toggleVoice);
  els.clearBtn.addEventListener("click", clearSource);
  els.copyBtn.addEventListener("click", copyTranslation);
  els.speakBtn.addEventListener("click", speakTranslation);
  els.speedSelect.addEventListener("change", onSpeedChange);
  if ("speechSynthesis" in window) { window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = () => { }; } // pre-load voices
  els.downloadBtn.addEventListener("click", downloadTranslation);
  els.shareBtn.addEventListener("click", shareTranslation);

  // Rating
  document.querySelectorAll(".rate-btn").forEach(b => b.addEventListener("click", () => rateTranslation(b.dataset.val, b)));

  // Mode tabs
  document.querySelectorAll(".mode-tab").forEach(t => t.addEventListener("click", () => switchMode(t.dataset.mode, t)));

  // Extras tabs (+ clickable alternatives / listen button inside the panel)
  document.querySelectorAll(".extras-tab").forEach(t => t.addEventListener("click", () => switchExtrasTab(t.dataset.tab, t)));
  els.extrasContent.addEventListener("click", e => {
    const alt = e.target.closest("[data-alt]");
    if (alt) { window.useAlt(alt.dataset.alt); return; }
    if (e.target.closest("[data-action='speak']")) speakTranslation();
  });

  // Voice
  els.voiceStopBtn.addEventListener("click", stopVoice);

  // File
  els.closeFileOverlay.addEventListener("click", () => { els.fileOverlay.style.display = "none"; resetModeToText(); });
  els.fileDropZone.addEventListener("click", () => els.fileInput.click());
  els.fileInput.addEventListener("change", e => { if (e.target.files[0]) readFile(e.target.files[0]); });
  els.fileDropZone.addEventListener("dragover", e => { e.preventDefault(); els.fileDropZone.classList.add("drag-over"); });
  els.fileDropZone.addEventListener("dragleave", () => els.fileDropZone.classList.remove("drag-over"));
  els.fileDropZone.addEventListener("drop", e => { e.preventDefault(); els.fileDropZone.classList.remove("drag-over"); if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); });

  // History
  els.historySearch.addEventListener("input", renderHistory);
  els.historyFilterLang.addEventListener("change", renderHistory);
  els.historyViewAllBtn.addEventListener("click", toggleHistoryExpanded);
  els.exportHistoryBtn.addEventListener("click", exportHistoryCSV);
  els.clearHistoryBtn.addEventListener("click", clearHistory);

  // Scroll top
  els.scrollTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Keyboard
  document.addEventListener("keydown", globalKeyHandler);
}

/* ══════════════════════════════════════════════════════════════
   NAVBAR
   ══════════════════════════════════════════════════════════════ */
function onScroll() {
  els.navbar.classList.toggle("scrolled", window.scrollY > 50);
  els.scrollTop.classList.toggle("visible", window.scrollY > 400);
}
function toggleMenu() { els.hamburger.classList.toggle("open"); els.mobileMenu.classList.toggle("open"); }
function closeMenu() { els.hamburger.classList.remove("open"); els.mobileMenu.classList.remove("open"); }

/* ══════════════════════════════════════════════════════════════
   TRANSLATE  (Claude API)
   ══════════════════════════════════════════════════════════════ */
async function handleTranslate() {
  const text = els.sourceText.value.trim();
  if (!text) { toast("Please enter some text.", "error"); return; }
  if (S.isTranslating) return;

  const tgtCode = els.targetLang.value;
  const tgtLang = LANGUAGES.find(l => l.code === tgtCode)?.name || tgtCode;
  const srcCode = els.sourceLang.value;
  const srcLang = srcCode === "auto" ? "auto-detect" : (LANGUAGES.find(l => l.code === srcCode)?.name || srcCode);
  const tone = els.toneSelect.value;
  const isCompare = S.activeMode === "compare";

  S.isTranslating = true;
  setLoadingUI(true);
  resetOutput();
  S.currentTargetCode = tgtCode; // remembered so Listen / Pronunciation use the language that was translated

  // Compare mode — 3 tone variations side by side
  if (isCompare) {
    await runCompareMode(text, srcLang, tgtLang);
    return;
  }

  const outputEl = createOutputEl();

  try {
    const parsed = await translateText(text, srcLang, tgtLang, tone);
    await streamText(outputEl, parsed.translation);
    S.currentTranslation = parsed.translation;
    S.lastParsed = parsed;
    S.lastSource = text;
    S.lastSrcCode = srcCode !== "auto" ? srcCode : (parsed.detected_code || "");

    els.detectedLang.textContent = (srcCode === "auto" && parsed.detected_language) ? `Detected: ${parsed.detected_language}` : "";

    const wc = parsed.translation.split(/\s+/).filter(Boolean).length;
    const shownTone = parsed.tone_applied || tone;
    els.outputMeta.textContent = `${wc} word${wc !== 1 ? "s" : ""} · ${shownTone} · ${tgtLang}`;
    els.ratingWrap.style.display = "flex";
    enableOutputBtns(true);

    els.extrasPanel.style.display = "block";
    renderExtras(parsed, S.activeExtrasTab);

    saveHistory({ original: text, translation: parsed.translation, sourceLang: srcLang, targetLang: tgtLang, targetCode: tgtCode, tone: shownTone, timestamp: Date.now() });
    toast("Translation complete!", "success");
    if (parsed.notice) setTimeout(() => toast(parsed.notice, "info"), 700);
  } catch (err) {
    outputEl.innerHTML = `<span style="color:#ef4444">⚠ ${esc(err.message)}</span>`;
    toast(err.message.includes("API key") ? "Invalid API key. Update script.js." : `Error: ${esc(err.message)}`, "error");
  } finally {
    S.isTranslating = false;
    setLoadingUI(false);
  }
}

/* Compare Mode */
async function runCompareMode(text, srcLang, tgtLang) {
  const tones = ["formal", "casual", "neutral"];
  els.compareGrid.innerHTML = tones.map(t => `
    <div class="compare-card" id="cc-${t}">
      <div class="compare-card-label">${t}</div>
      <div class="compare-card-text" style="color:var(--text-muted)"><i class="fas fa-spinner fa-spin"></i> Translating…</div>
    </div>`).join("");

  try {
    const results = await Promise.allSettled(tones.map(t => translateText(text, srcLang, tgtLang, t)));
    results.forEach((r, i) => {
      const card = $(`cc-${tones[i]}`);
      const el = card.querySelector(".compare-card-text");
      el.style.color = "";
      if (r.status === "fulfilled") {
        el.textContent = r.value.translation;
        card.dataset.ready = "1";
        if (r.value.notice) {
          const n = document.createElement("div");
          n.className = "compare-note";
          n.textContent = r.value.notice;
          card.appendChild(n);
        }
        card.addEventListener("click", () => {
          showOutput(r.value.translation);
          S.lastParsed = null;
          els.extrasPanel.style.display = "none";
          els.outputMeta.textContent = `${tones[i]} · ${LANGUAGES.find(l => l.code === S.currentTargetCode)?.name || ""}`;
          toast(`${cap(tones[i])} version is now in the output panel.`, "info");
        });
      } else {
        el.textContent = "Error: " + (r.reason?.message || "translation failed");
      }
    });
    els.outputArea.innerHTML = `<div class="output-placeholder"><div class="placeholder-orb"><i class="fas fa-code-branch"></i></div><p>Pick a version below</p><small>Click a card to use it here</small></div>`;
    toast("Comparison complete! Click a card to use it.", "success");
  } finally {
    S.isTranslating = false;
    setLoadingUI(false);
  }
}

function buildPrompt(text, srcLang, tgtLang, tone) {
  return `You are an expert linguist. Translate the text below accurately.

Source language: ${srcLang}
Target language: ${tgtLang}
Tone: ${tone} (formal=professional, casual=friendly, literary=poetic, technical=precise, neutral=standard, humorous=light-hearted)

Text:
"""
${text}
"""

Reply ONLY with this exact JSON (no markdown):
{
  "translation": "translated text",
  "detected_language": "source language name if auto-detected, else null",
  "alternatives": ["alt 1","alt 2","alt 3"],
  "word_breakdown": [{"original":"word","translated":"translation","pos":"noun/verb/adj/etc"}],
  "pronunciation": "romanization or phonetic guide if target is non-Latin script, else null",
  "cultural_context": "1-2 sentences on idioms, cultural notes, or regional nuance",
  "grammar_notes": "1-2 sentences on key grammar differences between source and target language"
}`;
}

/* One entry point for both engines — always resolves to
   { translation, detected_language, alternatives, ... }            */
async function translateText(text, srcLang, tgtLang, tone) {
  if (USE_FREE_API) return freeTranslate(text, srcLang, tgtLang, tone);
  const data = await callAPI(buildPrompt(text, srcLang, tgtLang, tone));
  const full = data.content?.[0]?.text || "";
  let parsed = null;
  try { const m = full.match(/\{[\s\S]*\}/); parsed = m ? JSON.parse(m[0]) : null; } catch { parsed = null; }
  return parsed?.translation ? parsed : { translation: full };
}

async function callAPI(prompt) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, messages: [{ role: "user", content: prompt }] })
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error?.message || `HTTP ${res.status}`);
  }
  return res.json();
}

/* ── FREE MODE (no API key needed) ───────────────────────────────
   If API_KEY is empty, translation uses the free MyMemory API.
   Extras that work without AI: alternatives (MyMemory matches),
   word-by-word breakdown, romanization (Cyrillic / Greek), formal &
   casual tone for English text, and general language notes.
   Idiom/slang understanding and the literary / technical / humorous
   tones need an LLM — add an API_KEY above to enable them.          */
const USE_FREE_API = !API_KEY;
const FREE_CACHE = new Map();
const MM_CODE = { zh: "zh-CN", zt: "zh-TW" };
const mmCode = code => MM_CODE[code] || code;
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

function langToCode(name) {
  const l = LANGUAGES.find(x => x.name === name);
  return l ? mmCode(l.code) : "en";
}

function splitChunks(text, max = 450) {
  const parts = text.split(/(?<=[.!?।。！？])\s*/).filter(Boolean);
  const chunks = []; let cur = "";
  for (let p of parts) {
    while (p.length > max) { if (cur) { chunks.push(cur); cur = ""; } chunks.push(p.slice(0, max)); p = p.slice(max); }
    if (cur && cur.length + 1 + p.length > max) { chunks.push(cur); cur = p; }
    else cur = cur ? cur + " " + p : p;
  }
  if (cur) chunks.push(cur);
  return chunks;
}

function decodeEntities(str) {
  const t = document.createElement("textarea");
  t.innerHTML = str;
  return t.value;
}

async function mmFetch(q, from, to) {
  const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${from}|${to}`);
  if (!res.ok) throw new Error(`Translation service error (HTTP ${res.status})`);
  const j = await res.json();
  if (j.responseStatus && Number(j.responseStatus) !== 200) throw new Error(j.responseDetails || "Translation failed");
  if (/^MYMEMORY WARNING/i.test(j.responseData?.translatedText || "")) throw new Error("Daily free translation limit reached. Please try again later.");
  return j;
}

function mmAlternatives(matches, main) {
  const norm = x => String(x).toLowerCase().replace(/[\s.!?¡¿,]+/g, " ").trim();
  const seen = new Set([norm(main)]);
  return (matches || [])
    .slice().sort((a, b) => (Number(b.match) || 0) - (Number(a.match) || 0))
    .map(m => decodeEntities(m.translation || ""))
    .filter(t => { const k = norm(t); if (!k || seen.has(k)) return false; seen.add(k); return true; })
    .slice(0, 3);
}

async function mmTranslateText(text, from, to) {
  const lines = text.split("\n");
  const nonBlank = lines.filter(l => l.trim()).length;
  const outLines = []; let detected = null, alts = [];
  for (const line of lines) {
    if (!line.trim()) { outLines.push(""); continue; }
    const chunks = splitChunks(line);
    const outChunks = [];
    for (const chunk of chunks) {
      const j = await mmFetch(chunk, from, to);
      const t = decodeEntities(j.responseData.translatedText);
      outChunks.push(t);
      if (j.responseData.detectedLanguage) detected = j.responseData.detectedLanguage;
      if (nonBlank === 1 && chunks.length === 1) alts = mmAlternatives(j.matches, t);
    }
    outLines.push(outChunks.join(" "));
  }
  const detCode = detected ? String(detected).split("-")[0].toLowerCase() : null;
  const detName = detCode && LANGUAGES.find(l => l.code === detCode)?.name;
  return { translation: outLines.join("\n"), detected_language: detName || detected || null, detected_code: detCode, alternatives: alts };
}

async function freeTranslate(text, srcLang, tgtLang, tone) {
  const from = srcLang === "auto-detect" ? "Autodetect" : langToCode(srcLang);
  const to = langToCode(tgtLang);
  const english = from === "en" || (from === "Autodetect" && looksEnglish(text));
  const toned = applyTone(text, tone, english);

  const key = `${from}|${to}|${toned.text}`;
  if (!FREE_CACHE.has(key)) {
    const p = mmTranslateText(toned.text, from, to);
    FREE_CACHE.set(key, p);
    p.catch(() => FREE_CACHE.delete(key));
  }
  const base = await FREE_CACHE.get(key);
  return { ...base, tone_applied: toned.tone, notice: toned.note || null };
}

/* ── Tone (free mode): rule-based, English source only ── */
function looksEnglish(t) {
  return /^[\x00-\x7F\u2018\u2019\u201C\u201D\u2014]+$/.test(t) &&
    /\b(the|is|are|you|i|to|and|of|what|how|where|please|thank|hello|my|this|it|for|in)\b/i.test(t);
}
const keepCase = (orig, repl) => (orig[0] !== orig[0].toLowerCase() ? repl.charAt(0).toUpperCase() + repl.slice(1) : repl);
const subAll = (text, pairs) => pairs.reduce((t, [re, r]) => t.replace(re, m => keepCase(m, r)), text);

function toFormal(text) {
  let t = text.replace(/[\u2018\u2019]/g, "'");
  t = t.replace(/\bcan't\b/gi, "cannot").replace(/\bwon't\b/gi, "will not").replace(/\bshan't\b/gi, "shall not")
    .replace(/\bain't\b/gi, "is not").replace(/\blet's\b/gi, "let us")
    .replace(/\b(\w+)n't (it|he|she|we|you|they|I)\b/gi, "$1 $2 not")
    .replace(/\b(\w+)n't\b/gi, "$1 not").replace(/\b(\w+)'m\b/gi, "$1 am").replace(/\b(\w+)'re\b/gi, "$1 are")
    .replace(/\b(\w+)'ve\b/gi, "$1 have").replace(/\b(\w+)'ll\b/gi, "$1 will").replace(/\b(\w+)'d\b/gi, "$1 would")
    .replace(/\b(it|that|what|there|here|where|who|how)'s\b/gi, "$1 is");
  return subAll(t, [
    [/\bhey\b/gi, "hello"], [/\bhi\b/gi, "hello"], [/\b(yeah|yep|yup)\b/gi, "yes"], [/\bnope\b/gi, "no"],
    [/\bthanks\b/gi, "thank you"], [/\bgonna\b/gi, "going to"], [/\bwanna\b/gi, "want to"], [/\bgotta\b/gi, "have to"],
    [/\bkinda\b/gi, "somewhat"], [/\b(okay|ok)\b/gi, "all right"], [/\bguys\b/gi, "everyone"], [/\basap\b/gi, "as soon as possible"]
  ]);
}

function toCasual(text) {
  return text.replace(/[\u2018\u2019]/g, "'")
    .replace(/\b(do|does|did|is|are|was|were|have|has|had|would|could|should) not\b/gi, (m, v) => keepCase(m, v.toLowerCase() + "n't"))
    .replace(/\bwill not\b/gi, m => keepCase(m, "won't"))
    .replace(/\bcannot\b/gi, m => keepCase(m, "can't"))
    .replace(/\bI am\b/g, "I'm").replace(/\bI have\b/g, "I've").replace(/\bI will\b/g, "I'll")
    .replace(/\b(you|we|they) are\b/gi, (m, w) => keepCase(m, w.toLowerCase() + "'re"))
    .replace(/\b(it|that) is\b/gi, (m, w) => keepCase(m, w.toLowerCase() + "'s"))
    .replace(/\blet us\b/gi, m => keepCase(m, "let's"))
    .replace(/\bthank you very much\b/gi, m => keepCase(m, "thanks a lot"))
    .replace(/\bthank you\b/gi, m => keepCase(m, "thanks"))
    .replace(/\bhello\b/gi, m => keepCase(m, "hi"));
}

function applyTone(text, tone, english) {
  if (tone === "neutral") return { text, tone };
  if ((tone === "formal" || tone === "casual") && english) return { text: tone === "formal" ? toFormal(text) : toCasual(text), tone };
  const why = (tone === "formal" || tone === "casual")
    ? `${cap(tone)} tone is applied to English source text only in free mode.`
    : `${cap(tone)} tone needs AI mode (add an API key in script.js).`;
  return { text, tone: "neutral", note: `${why} Translated in a neutral tone.` };
}

/* Streaming Text Effect */
async function streamText(el, text) {
  el.textContent = "";
  const cursor = document.createElement("span");
  cursor.className = "streaming-cursor";
  el.appendChild(cursor);
  const words = text.split(" ");
  let i = 0;
  while (i < words.length) {
    const batch = Math.ceil(Math.random() * 3) + 1;
    const slice = words.slice(i, i + batch).join(" ");
    if (slice) el.insertBefore(document.createTextNode(slice + " "), cursor);
    i += batch;
    await new Promise(r => setTimeout(r, 20 + Math.random() * 35));
  }
  cursor.remove();
}

function showOutput(text) {
  const el = createOutputEl();
  el.textContent = text;
  S.currentTranslation = text;
  enableOutputBtns(true);
}

function createOutputEl() {
  els.outputArea.innerHTML = '<div class="output-text"></div>';
  return els.outputArea.querySelector(".output-text");
}

function resetOutput() {
  if (S.speaking) stopSpeaking();
  els.outputArea.innerHTML = `<div class="output-placeholder"><div class="placeholder-orb"><i class="fas fa-language"></i></div><p>Translating…</p></div>`;
  els.outputMeta.textContent = "";
  els.ratingWrap.style.display = "none";
  els.extrasPanel.style.display = "none";
  els.detectedLang.textContent = "";
  enableOutputBtns(false);
  document.querySelectorAll(".rate-btn").forEach(b => b.classList.remove("active"));
}

function setLoadingUI(on) {
  els.translateBtn.classList.toggle("loading", on);
  els.translateBtn.disabled = on;
}

function enableOutputBtns(on) {
  [els.copyBtn, els.speakBtn, els.downloadBtn, els.shareBtn].forEach(b => {
    if (on) b.removeAttribute("disabled"); else b.setAttribute("disabled", "");
  });
}

/* ══════════════════════════════════════════════════════════════
   AUTO-TRANSLATE
   ══════════════════════════════════════════════════════════════ */
function handleAutoTranslate() {
  if (!els.autoTranslate.checked) return;
  clearTimeout(S.autoTranslateTimer);
  if (!els.sourceText.value.trim()) return;
  S.autoTranslateTimer = setTimeout(handleTranslate, 1000);
}

/* ══════════════════════════════════════════════════════════════
   EXTRAS PANEL
   ══════════════════════════════════════════════════════════════ */
function switchExtrasTab(tab, el) {
  document.querySelectorAll(".extras-tab").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
  S.activeExtrasTab = tab;
  if (S.lastParsed) renderExtras(S.lastParsed, tab);
}

/* Romanization (free mode): Cyrillic & Greek only — other scripts need AI mode */
const CYR_MAP = { а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya", і: "i", ї: "yi", є: "ye", ґ: "g", ј: "j", љ: "lj", њ: "nj", ћ: "c", ђ: "dj", џ: "dz", ѓ: "gj", ќ: "kj", ѕ: "dz" };
const GREEK_MAP = { α: "a", β: "v", γ: "g", δ: "d", ε: "e", ζ: "z", η: "i", θ: "th", ι: "i", κ: "k", λ: "l", μ: "m", ν: "n", ξ: "x", ο: "o", π: "p", ρ: "r", σ: "s", ς: "s", τ: "t", υ: "y", φ: "f", χ: "ch", ψ: "ps", ω: "o" };
const NON_LATIN = /[^\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]/u;

function mapChars(text, map) {
  return [...text].map(ch => {
    const lo = ch.toLowerCase();
    if (!(lo in map)) return ch;
    const r = map[lo];
    return ch !== lo ? r.charAt(0).toUpperCase() + r.slice(1) : r;
  }).join("");
}

function romanize(text, code) {
  if (["ru", "uk", "bg", "sr", "mk"].includes(code) && /\p{Script=Cyrillic}/u.test(text)) {
    const over = code === "uk" ? { г: "h", и: "y" } : code === "bg" ? { ъ: "a", щ: "sht" } : {};
    return mapChars(text, { ...CYR_MAP, ...over });
  }
  if (code === "el" && /\p{Script=Greek}/u.test(text)) return mapChars(text.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), GREEK_MAP);
  return null;
}

/* Word-by-word breakdown (free mode) — loaded on demand to save quota */
async function loadBreakdown(parsed) {
  if (parsed._wbLoading) return;
  parsed._wbLoading = true;
  const words = [...new Set((S.lastSource || "").split(/\s+/)
    .map(w => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")).filter(Boolean))].slice(0, 12);
  const from = S.lastSrcCode ? mmCode(S.lastSrcCode) : "Autodetect";
  const to = mmCode(S.currentTargetCode || els.targetLang.value);
  const rows = [];
  for (let i = 0; i < words.length; i += 4) {
    const res = await Promise.all(words.slice(i, i + 4).map(async w => {
      const key = `wb|${from}|${to}|${w.toLowerCase()}`;
      if (!FREE_CACHE.has(key)) FREE_CACHE.set(key, mmFetch(w, from, to).then(j => decodeEntities(j.responseData.translatedText)));
      try { return { original: w, translated: await FREE_CACHE.get(key) }; }
      catch { FREE_CACHE.delete(key); return { original: w, translated: "—" }; }
    }));
    rows.push(...res);
  }
  parsed.word_breakdown = rows.some(r => r.translated !== "—") ? rows : [];
  parsed._wbLoading = false;
  if (S.lastParsed === parsed && S.activeExtrasTab === "breakdown") renderExtras(parsed, "breakdown");
}

function renderExtras(parsed, tab) {
  const tgtCode = S.currentTargetCode || els.targetLang.value;
  const tgtName = LANGUAGES.find(l => l.code === tgtCode)?.name || tgtCode;
  const notes = LANG_NOTES[tgtCode];
  const box = (color, label, body, mono) => `<div style="padding:1rem 1.2rem;background:${color}0F;border-left:3px solid ${color};border-radius:var(--radius-sm)"><small style="color:${color};font-size:.7rem;display:block;margin-bottom:.35rem;font-family:var(--font-mono)">${label}</small>${mono ? `<span style="font-family:var(--font-mono);font-size:.98rem">${esc(body)}</span>` : esc(body)}</div>`;
  const aiHint = `<p class="extras-note">Notes specific to this exact text (idioms, slang, regional nuance) need AI mode — add an API key in script.js.</p>`;
  const listenBtn = `<div class="extras-action"><button class="btn-ghost small" data-action="speak"><i class="fas fa-volume-up"></i> Listen</button></div>`;
  let html = "";

  if (tab === "alternatives") {
    const alts = parsed.alternatives || [];
    html = alts.length
      ? alts.map((a, i) => `<div class="alt-item" data-alt="${esc(a)}"><span class="alt-num">${i + 1}.</span><span>${esc(a)}</span></div>`).join("")
      + `<p class="extras-note">Click an alternative to use it.</p>`
      : `<p>No alternative phrasings were found for this text. Short phrases and sentences usually have more.</p>`;
  } else if (tab === "breakdown") {
    const wb = parsed.word_breakdown;
    if (!wb && USE_FREE_API) {
      html = `<p><i class="fas fa-spinner fa-spin"></i> Translating word by word…</p>`;
      loadBreakdown(parsed);
    } else if (wb && wb.length) {
      const hasPos = wb.some(w => w.pos);
      const grid = hasPos ? "" : "grid-template-columns:1fr 1fr;";
      html = `<div class="word-row" style="${grid}font-size:.72rem;font-weight:700;color:var(--text-muted)"><span>ORIGINAL</span><span>TRANSLATED</span>${hasPos ? "<span>POS</span>" : ""}</div>`
        + wb.map(w => `<div class="word-row" style="${grid}"><span class="word-original">${esc(w.original)}</span><span class="word-translated">${esc(w.translated)}</span>${hasPos ? `<span class="word-pos">${esc(w.pos || "—")}</span>` : ""}</div>`).join("");
      if (!hasPos) html += `<p class="extras-note">Single-word translations, first ${wb.length} unique words. Part-of-speech tags need AI mode.</p>`;
    } else {
      html = "<p>Word breakdown isn't available right now. Please try again in a moment.</p>";
    }
  } else if (tab === "pronunciation") {
    const rom = parsed.pronunciation ? null : romanize(S.currentTranslation, tgtCode);
    if (parsed.pronunciation) html = box("#7C3AED", "PHONETIC GUIDE", parsed.pronunciation, true) + listenBtn;
    else if (rom) html = box("#7C3AED", "ROMANIZATION (APPROXIMATE)", rom, true) + listenBtn;
    else if (!NON_LATIN.test(S.currentTranslation)) html = `<p>${esc(tgtName)} is written in the Latin alphabet here, so it reads as written. Press Listen to hear it.</p>` + listenBtn;
    else html = `<p>A romanized guide for ${esc(tgtName)} needs AI mode (add an API key in script.js). You can still hear it spoken.</p>` + listenBtn;
  } else if (tab === "context") {
    if (parsed.cultural_context) html = box("#7C3AED", "CULTURAL NOTE", parsed.cultural_context);
    else if (notes) html = box("#7C3AED", `ABOUT ${tgtName.toUpperCase()}`, notes.culture) + aiHint;
    else html = `<p>No cultural notes are available for ${esc(tgtName)} yet.</p>` + aiHint;
  } else if (tab === "grammar") {
    if (parsed.grammar_notes) html = box("#06B6D4", "GRAMMAR NOTES", parsed.grammar_notes);
    else if (notes) html = box("#06B6D4", `${tgtName.toUpperCase()} GRAMMAR`, notes.grammar) + aiHint;
    else html = `<p>No grammar notes are available for ${esc(tgtName)} yet.</p>` + aiHint;
  }
  els.extrasContent.innerHTML = html;
}

window.useAlt = function (text) {
  const el = els.outputArea.querySelector(".output-text");
  if (el) el.textContent = text;
  S.currentTranslation = text;
  if (S.lastParsed) renderExtras(S.lastParsed, S.activeExtrasTab);
  toast("Alternative applied!", "info");
};

/* ══════════════════════════════════════════════════════════════
   MODES
   ══════════════════════════════════════════════════════════════ */
function switchMode(mode, tab) {
  document.querySelectorAll(".mode-tab").forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
  S.activeMode = mode;
  els.comparePanel.style.display = mode === "compare" ? "block" : "none";
  if (mode === "voice") { els.voiceOverlay.style.display = "flex"; startVoice(); }
  else if (mode === "file") { els.fileOverlay.style.display = "flex"; }
}

function resetModeToText() {
  document.querySelectorAll(".mode-tab").forEach(t => t.classList.remove("active"));
  document.querySelector('.mode-tab[data-mode="text"]').classList.add("active");
  S.activeMode = "text";
}

/* ══════════════════════════════════════════════════════════════
   PANEL ACTIONS
   ══════════════════════════════════════════════════════════════ */
function updateCharCount() { els.charCount.textContent = els.sourceText.value.length; }

/* Sets the source box from code (paste / voice / file) and lets Auto-Translate react */
function setSource(text, append = false) {
  const full = (append ? els.sourceText.value + text : text);
  if (full.length > 5000) toast("Text trimmed to 5000 characters.", "info");
  els.sourceText.value = full.slice(0, 5000);
  updateCharCount();
  handleAutoTranslate();
}

function swapLanguages() {
  const sc = els.sourceLang.value;
  if (sc === "auto") { toast("Can't swap Auto Detect.", "error"); return; }
  const tc = els.targetLang.value;
  els.sourceLang.value = tc;
  els.targetLang.value = sc;
  if (S.currentTranslation) { els.sourceText.value = S.currentTranslation; updateCharCount(); }
  toast("Languages swapped!", "info");
}

async function pasteClipboard() {
  try { const t = await navigator.clipboard.readText(); setSource(t); toast("Pasted!", "success"); }
  catch { toast("Clipboard access denied.", "error"); }
}

function clearSource() {
  if (S.speaking) stopSpeaking();
  els.sourceText.value = ""; updateCharCount();
  els.outputArea.innerHTML = `<div class="output-placeholder"><div class="placeholder-orb"><i class="fas fa-language"></i></div><p>Translation appears here</p><small>Press Ctrl+Enter or click Translate</small></div>`;
  els.outputMeta.textContent = ""; els.ratingWrap.style.display = "none";
  els.extrasPanel.style.display = "none"; els.comparePanel.style.display = "none";
  els.detectedLang.textContent = ""; S.currentTranslation = ""; enableOutputBtns(false);
}

async function copyTranslation() {
  if (!S.currentTranslation) return;
  try { await navigator.clipboard.writeText(S.currentTranslation); toast("Copied!", "success"); }
  catch { toast("Copy failed.", "error"); }
}

/* ── Listen (text-to-speech) ─────────────────────────────────── */
function pickVoice(locale) {
  const voices = window.speechSynthesis.getVoices();
  const want = locale.toLowerCase();
  const base = want.split("-")[0];
  const exact = voices.filter(v => v.lang.replace("_", "-").toLowerCase() === want);
  const pool = exact.length ? exact : voices.filter(v => v.lang.toLowerCase().split(/[-_]/)[0] === base);
  // Prefer on-device voices: online voices (e.g. Chrome's "Google …") often ignore the speed setting
  return pool.find(v => v.localService) || pool[0] || null;
}

function splitForSpeech(text, max = 160) {
  const sentences = text.match(/[^.!?。！？\n]+[.!?。！？]*/g) || [text];
  const parts = []; let cur = "";
  for (const raw of sentences) {
    const t = raw.trim();
    if (!t) continue;
    if (cur && (cur + " " + t).length > max) { parts.push(cur); cur = t; }
    else cur = cur ? cur + " " + t : t;
  }
  if (cur) parts.push(cur);
  // very long unbroken pieces: slice so the browser doesn't cut the audio off
  return parts.flatMap(p => {
    if (p.length <= max * 2) return [p];
    const out = []; for (let i = 0; i < p.length; i += max) out.push(p.slice(i, i + max));
    return out;
  });
}

function setSpeakIcon(on) {
  els.speakBtn.innerHTML = on ? '<i class="fas fa-stop"></i>' : '<i class="fas fa-volume-up"></i>';
  els.speakBtn.title = on ? "Stop" : "Listen";
}

function finishSpeaking() { S.speaking = false; setSpeakIcon(false); }

function stopSpeaking() {
  S.speakToken++;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  finishSpeaking();
}

function startSpeaking() {
  const synth = window.speechSynthesis;
  const token = ++S.speakToken;
  synth.cancel();

  const code = S.currentTargetCode || els.targetLang.value;
  const locale = LOCALE[code] || "en-US";
  const voice = pickVoice(locale);
  const rate = parseFloat(els.speedSelect.value) || 0.9;
  const parts = splitForSpeech(S.currentTranslation);

  if (!voice && synth.getVoices().length && !locale.startsWith("en")) {
    toast("No voice for this language is installed on your device — audio may sound off.", "info");
  }

  S.speaking = true;
  setSpeakIcon(true);
  setTimeout(() => { // tiny delay: Chrome can drop speak() called right after cancel()
    if (token !== S.speakToken) return;
    parts.forEach((part, i) => {
      const u = new SpeechSynthesisUtterance(part);
      u.lang = voice?.lang || locale;
      if (voice) u.voice = voice;
      u.rate = rate;
      u.onend = () => { if (token === S.speakToken && i === parts.length - 1) finishSpeaking(); };
      u.onerror = e => {
        if (token !== S.speakToken || e.error === "canceled" || e.error === "interrupted") return;
        finishSpeaking();
        toast("Couldn't play audio for this text.", "error");
      };
      synth.speak(u);
    });
  }, 60);
}

function speakTranslation() {
  if (!S.currentTranslation) return;
  if (!("speechSynthesis" in window)) { toast("Text-to-speech isn't supported in this browser.", "error"); return; }
  if (S.speaking) { stopSpeaking(); return; } // second click = stop
  startSpeaking();
}

/* Changing the speed while audio is playing restarts it at the new speed */
function onSpeedChange() {
  const label = els.speedSelect.options[els.speedSelect.selectedIndex].text.replace(/^\S+\s/, "");
  if (S.speaking && S.currentTranslation) { startSpeaking(); toast(`Speed: ${label}`, "info"); }
  else toast(`Listening speed set to ${label}.`, "info");
}

function downloadTranslation() {
  if (!S.currentTranslation) return;
  const nameOf = c => LANGUAGES.find(l => l.code === c)?.name || c;
  const srcName = els.sourceLang.value === "auto" ? (S.lastParsed?.detected_language || "Auto-detected") : nameOf(els.sourceLang.value);
  const content = `HawkEye AI Translation\n${"─".repeat(40)}\nSource (${srcName}):\n${els.sourceText.value}\n\nTranslation (${nameOf(S.currentTargetCode || els.targetLang.value)}):\n${S.currentTranslation}`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
  a.download = "hawkeye_ai_translation.txt"; a.click();
  toast("Downloaded!", "success");
}

async function shareTranslation() {
  if (!S.currentTranslation) return;
  if (navigator.share) { try { await navigator.share({ title: "HawkEye AI Translation", text: S.currentTranslation }); } catch { } }
  else copyTranslation();
}

function rateTranslation(val, btn) {
  document.querySelectorAll(".rate-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  toast(val === "1" ? "Thanks for the positive rating! 🙏" : "Thanks for the feedback — we'll improve!", val === "1" ? "success" : "info");
}

/* ══════════════════════════════════════════════════════════════
   VOICE
   ══════════════════════════════════════════════════════════════ */
function toggleVoice() { S.isRecording ? stopVoice() : (() => { els.voiceOverlay.style.display = "flex"; startVoice(); })(); }

function startVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { toast("Voice input isn't supported in this browser (try Chrome or Edge).", "error"); els.voiceOverlay.style.display = "none"; resetModeToText(); return; }
  const code = els.sourceLang.value;
  const locale = code === "auto" ? "en-US" : (LOCALE[code] || "en-US");
  const langName = LANGUAGES.find(l => l.code === code)?.name;

  S.recognition = new SR();
  S.recognition.continuous = true;
  S.recognition.interimResults = true;
  S.recognition.lang = locale;
  S.recognition.onstart = () => {
    S.isRecording = true;
    els.micBtn.classList.add("recording");
    els.voiceLabel.textContent = code === "auto" ? "Listening… (English — choose a Source language to change)" : `Listening… (${langName})`;
  };
  S.recognition.onresult = e => {
    let interim = "", final = "";
    for (let i = e.resultIndex; i < e.results.length; i++) { (e.results[i].isFinal ? (final += e.results[i][0].transcript) : (interim += e.results[i][0].transcript)); }
    if (final) setSource(final.trim() + " ", true);
    els.voiceInterim.textContent = interim;
  };
  S.recognition.onerror = e => {
    const msg = {
      "not-allowed": "Microphone access was blocked. Allow it in your browser settings.",
      "service-not-allowed": "Microphone access was blocked. Allow it in your browser settings.",
      "no-speech": "I didn't hear anything — try again.",
      "audio-capture": "No microphone was found.",
      "language-not-supported": "Voice input doesn't support this language in your browser."
    }[e.error];
    if (e.error !== "aborted") toast(msg || "Voice input stopped.", "error");
    stopVoice();
  };
  S.recognition.onend = () => stopVoice();
  try { S.recognition.start(); } catch { stopVoice(); }
}

function stopVoice() {
  if (S.recognition) { try { S.recognition.stop(); } catch { } S.recognition = null; }
  S.isRecording = false;
  els.micBtn.classList.remove("recording");
  els.voiceOverlay.style.display = "none";
  els.voiceInterim.textContent = "";
  resetModeToText();
}

/* ══════════════════════════════════════════════════════════════
   FILE UPLOAD
   ══════════════════════════════════════════════════════════════ */
function readFile(file) {
  if (!file.name.match(/\.(txt|md)$/i)) { toast("Only .txt and .md files.", "error"); return; }
  if (file.size > 51200) { toast("File too large (max 50KB).", "error"); return; }
  const reader = new FileReader();
  reader.onload = e => {
    setSource(e.target.result);
    els.fileOverlay.style.display = "none";
    resetModeToText();
    toast(`Loaded: ${file.name}`, "success");
  };
  reader.readAsText(file);
}

/* ══════════════════════════════════════════════════════════════
   HISTORY
   ══════════════════════════════════════════════════════════════ */
function saveHistory(item) {
  S.history.unshift(item);
  if (S.history.length > 200) S.history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(S.history));
  renderHistory();
}

function loadData() {
  try { S.history = JSON.parse(localStorage.getItem(HISTORY_KEY) || localStorage.getItem(LEGACY_HISTORY_KEY) || "[]"); } catch { S.history = []; }
  renderHistory();
}

function toggleHistoryExpanded() {
  S.historyExpanded = !S.historyExpanded;
  renderHistory();
  if (!S.historyExpanded) $("history").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderHistory() {
  const q = els.historySearch.value.toLowerCase();
  const lf = els.historyFilterLang.value;
  const items = S.history.filter(h =>
    (!q || h.original.toLowerCase().includes(q) || h.translation.toLowerCase().includes(q)) &&
    (!lf || h.targetCode === lf)
  );
  if (!items.length) {
    els.historyList.classList.remove("expanded");
    els.historyMoreWrap.style.display = "none";
    els.historyList.innerHTML = `<div class="empty-state"><i class="fas fa-clock"></i><p>${S.history.length ? "No results." : "Translation history will appear here."}</p></div>`;
    return;
  }

  // Only the most recent few are shown; the rest sit behind "View All"
  const canExpand = items.length > HISTORY_PREVIEW_COUNT;
  const shown = (S.historyExpanded && canExpand) ? items : items.slice(0, HISTORY_PREVIEW_COUNT);
  els.historyList.classList.toggle("expanded", S.historyExpanded && canExpand);
  els.historyMoreWrap.style.display = canExpand ? "flex" : "none";
  els.historyViewAllBtn.innerHTML = S.historyExpanded
    ? '<i class="fas fa-chevron-up"></i> Show Less'
    : `<i class="fas fa-list"></i> View All (${items.length})`;

  els.historyList.innerHTML = shown.map(item => `
    <div class="history-item">
      <div><div class="history-text">${esc(trunc(item.original, 110))}</div><div style="font-size:.7rem;color:var(--text-muted);font-family:var(--font-mono);margin-top:.2rem">${esc(item.sourceLang)}</div></div>
      <div><div class="history-translation">${esc(trunc(item.translation, 110))}</div><div style="font-size:.7rem;color:var(--text-muted);font-family:var(--font-mono);margin-top:.2rem">${esc(item.targetLang)}</div></div>
      <div class="history-actions">
        <div class="history-meta">${fmtDate(item.timestamp)}<br/>${esc(item.tone || "neutral")}</div>
        <button class="history-btn" onclick="window.reuseHistory(${S.history.indexOf(item)})"><i class="fas fa-redo"></i> Reuse</button>
        <button class="history-btn delete" onclick="window.deleteHistory(${S.history.indexOf(item)})"><i class="fas fa-trash"></i></button>
      </div>
    </div>`).join("");
}

window.reuseHistory = idx => {
  const item = S.history[idx]; if (!item) return;
  els.sourceText.value = item.original; updateCharCount();
  if (item.targetCode) els.targetLang.value = item.targetCode;
  document.querySelector("#translator").scrollIntoView({ behavior: "smooth" });
  toast("Loaded to editor.", "info");
};

window.deleteHistory = idx => {
  S.history.splice(idx, 1);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(S.history));
  renderHistory();
};

function clearHistory() {
  if (!S.history.length) { toast("History is empty.", "info"); return; }
  if (!confirm("Clear all history?")) return;
  S.history = []; localStorage.removeItem(HISTORY_KEY);
  renderHistory(); toast("History cleared.", "success");
}

function exportHistoryCSV() {
  if (!S.history.length) { toast("Nothing to export.", "error"); return; }
  const csv = ["Date,Source,Target,Original,Translation,Tone",
    ...S.history.map(h => [fmtDate(h.timestamp), h.sourceLang, h.targetLang, csvQ(h.original), csvQ(h.translation), h.tone || "neutral"].join(","))
  ].join("\n");
  dlFile(csv, "hawkeye_ai_history.csv", "text/csv");
  toast("History exported!", "success");
}

/* ══════════════════════════════════════════════════════════════
   KEYBOARD SHORTCUTS
   ══════════════════════════════════════════════════════════════ */
function globalKeyHandler(e) {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "T") { e.preventDefault(); els.sourceText.focus(); }
  if (e.key === "Escape") {
    els.voiceOverlay.style.display = "none";
    els.fileOverlay.style.display = "none";
    if (S.isRecording) stopVoice();
    if (S.speaking) stopSpeaking();
  }
}

/* ══════════════════════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════════════════════ */
const iMap = { success: "fa-check-circle", error: "fa-exclamation-circle", info: "fa-info-circle" };
function toast(msg, type = "info") {
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<i class="fas ${iMap[type] || iMap.info}"></i> ${msg}`;
  els.toastContainer.appendChild(el);
  setTimeout(() => { el.classList.add("exit"); el.addEventListener("animationend", () => el.remove()); }, 3500);
}

/* ══════════════════════════════════════════════════════════════
   UTILITIES
   ══════════════════════════════════════════════════════════════ */
function esc(s = "") { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
function trunc(s, n) { return s.length > n ? s.slice(0, n) + "…" : s; }
function fmtDate(ts) { return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); }
function csvQ(s) { return `"${String(s).replace(/"/g, '""')}"`; }
function dlFile(content, name, mime) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = name; a.click();
}

/* ══════════════════════════════════════════════════════════════
   START
   ══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", init);

/* ══════════════════════════════════════════════════════════════
   QUICK PHRASES — one-click common phrases
   ══════════════════════════════════════════════════════════════ */
(function quickPhrases() {
  const wrap = document.getElementById("quickPhrases");
  if (!wrap) return;
  wrap.querySelectorAll(".qp-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      els.sourceText.value = chip.dataset.text;
      els.sourceText.dispatchEvent(new Event("input"));
      handleTranslate();
    });
  });
})();
