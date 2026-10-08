/* ══════════════════════════════════════════════════════════════
   LinguaAI — script.js (fixed)
   Features: Demo Translation, Voice I/O, History, File Upload,
   Animations, Dark/Light Theme, Streaming, Extras Panels
   ══════════════════════════════════════════════════════════════ */

"use strict";

/* ── CONFIG ───────────────────────────────────────────────────── */
const DEMO_MODE = true; // Prototype demo mode
const STORAGE_KEY = "linguaai_history";
const THEME_KEY = "linguaai_theme";

// If a phrase exists in your local dictionary/datasets, use it before calling the API
const PREFER_LOCAL_PHRASES = true;

// Extra datasets (see datasets/en-hi.json format). Add file names here, e.g.
// const DATASET_FILES = ["datasets/en-hi.json", "datasets/en-pa.json"];
const DATASET_FILES = [];

/* ── LANGUAGES LIST ───────────────────────────────────────────── */
const LANGUAGES = [
  { code: "af", name: "Afrikaans", flag: "🇿🇦" },
  { code: "sq", name: "Albanian", flag: "🇦🇱" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hy", name: "Armenian", flag: "🇦🇲" },
  { code: "az", name: "Azerbaijani", flag: "🇦🇿" },
  { code: "eu", name: "Basque", flag: "🏴" },
  { code: "be", name: "Belarusian", flag: "🇧🇾" },
  { code: "bn", name: "Bengali", flag: "🇧🇩" },
  { code: "bs", name: "Bosnian", flag: "🇧🇦" },
  { code: "bg", name: "Bulgarian", flag: "🇧🇬" },
  { code: "ca", name: "Catalan", flag: "🏴" },
  { code: "zh", name: "Chinese (Simplified)", flag: "🇨🇳" },
  { code: "zt", name: "Chinese (Traditional)", flag: "🇹🇼" },
  { code: "hr", name: "Croatian", flag: "🇭🇷" },
  { code: "cs", name: "Czech", flag: "🇨🇿" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "eo", name: "Esperanto", flag: "🌍" },
  { code: "et", name: "Estonian", flag: "🇪🇪" },
  { code: "fi", name: "Finnish", flag: "🇫🇮" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "gl", name: "Galician", flag: "🏴" },
  { code: "ka", name: "Georgian", flag: "🇬🇪" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "el", name: "Greek", flag: "🇬🇷" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳" },
  { code: "ht", name: "Haitian Creole", flag: "🇭🇹" },
  { code: "ha", name: "Hausa", flag: "🇳🇬" },
  { code: "he", name: "Hebrew", flag: "🇮🇱" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "hu", name: "Hungarian", flag: "🇭🇺" },
  { code: "is", name: "Icelandic", flag: "🇮🇸" },
  { code: "ig", name: "Igbo", flag: "🇳🇬" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "ga", name: "Irish", flag: "🇮🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "kn", name: "Kannada", flag: "🇮🇳" },
  { code: "kk", name: "Kazakh", flag: "🇰🇿" },
  { code: "km", name: "Khmer", flag: "🇰🇭" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "ku", name: "Kurdish", flag: "🏳️" },
  { code: "ky", name: "Kyrgyz", flag: "🇰🇬" },
  { code: "lo", name: "Lao", flag: "🇱🇦" },
  { code: "la", name: "Latin", flag: "🏛️" },
  { code: "lv", name: "Latvian", flag: "🇱🇻" },
  { code: "lt", name: "Lithuanian", flag: "🇱🇹" },
  { code: "lb", name: "Luxembourgish", flag: "🇱🇺" },
  { code: "mk", name: "Macedonian", flag: "🇲🇰" },
  { code: "mg", name: "Malagasy", flag: "🇲🇬" },
  { code: "ms", name: "Malay", flag: "🇲🇾" },
  { code: "ml", name: "Malayalam", flag: "🇮🇳" },
  { code: "mt", name: "Maltese", flag: "🇲🇹" },
  { code: "mi", name: "Maori", flag: "🇳🇿" },
  { code: "mr", name: "Marathi", flag: "🇮🇳" },
  { code: "mn", name: "Mongolian", flag: "🇲🇳" },
  { code: "my", name: "Myanmar (Burmese)", flag: "🇲🇲" },
  { code: "ne", name: "Nepali", flag: "🇳🇵" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "ny", name: "Nyanja (Chichewa)", flag: "🇲🇼" },
  { code: "or", name: "Odia (Oriya)", flag: "🇮🇳" },
  { code: "ps", name: "Pashto", flag: "🇦🇫" },
  { code: "fa", name: "Persian", flag: "🇮🇷" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "pt", name: "Portuguese (Brazil)", flag: "🇧🇷" },
  { code: "pa", name: "Punjabi", flag: "🇮🇳" },
  { code: "ro", name: "Romanian", flag: "🇷🇴" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "sm", name: "Samoan", flag: "🇼🇸" },
  { code: "gd", name: "Scots Gaelic", flag: "🏴" },
  { code: "sr", name: "Serbian", flag: "🇷🇸" },
  { code: "st", name: "Sesotho", flag: "🇱🇸" },
  { code: "sn", name: "Shona", flag: "🇿🇼" },
  { code: "sd", name: "Sindhi", flag: "🇵🇰" },
  { code: "si", name: "Sinhala (Sinhalese)", flag: "🇱🇰" },
  { code: "sk", name: "Slovak", flag: "🇸🇰" },
  { code: "sl", name: "Slovenian", flag: "🇸🇮" },
  { code: "so", name: "Somali", flag: "🇸🇴" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "su", name: "Sundanese", flag: "🇮🇩" },
  { code: "sw", name: "Swahili", flag: "🇰🇪" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "tg", name: "Tajik", flag: "🇹🇯" },
  { code: "ta", name: "Tamil", flag: "🇮🇳" },
  { code: "tt", name: "Tatar", flag: "🇷🇺" },
  { code: "te", name: "Telugu", flag: "🇮🇳" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "tk", name: "Turkmen", flag: "🇹🇲" },
  { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" },
  { code: "ug", name: "Uyghur", flag: "🇨🇳" },
  { code: "uz", name: "Uzbek", flag: "🇺🇿" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "cy", name: "Welsh", flag: "🏴" },
  { code: "xh", name: "Xhosa", flag: "🇿🇦" },
  { code: "yi", name: "Yiddish", flag: "🕍" },
  { code: "yo", name: "Yoruba", flag: "🇳🇬" },
  { code: "zu", name: "Zulu", flag: "🇿🇦" }
];

/* ── STATE ────────────────────────────────────────────────────── */
const state = {
  currentTranslation: "",
  currentSourceLang: "auto",
  currentTargetLang: "es",
  isTranslating: false,
  isRecording: false,
  recognition: null,
  voiceCaptured: false,
  voiceError: null,
  voiceSkipTranslate: false,
  history: [],
  activeMode: "text",
  activeExtrasTab: "alternatives",
  theme: localStorage.getItem(THEME_KEY) || "dark"
};

/* ── DOM REFS ─────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);

const els = {
  body: document.body,
  navbar: $("navbar"),
  themeToggle: $("themeToggle"),
  themeIcon: $("themeIcon"),
  hamburger: $("hamburger"),
  mobileMenu: $("mobileMenu"),
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
  downloadBtn: $("downloadBtn"),
  shareBtn: $("shareBtn"),
  pasteBtn: $("pasteBtn"),
  micBtn: $("micBtn"),
  clearBtn: $("clearBtn"),
  toneSelect: $("toneSelect"),
  extrasPanel: $("extrasPanel"),
  extrasContent: $("extrasContent"),
  voiceOverlay: $("voiceOverlay"),
  voiceLabel: $("voiceLabel"),
  voiceInterim: $("voiceInterim"),
  voiceStopBtn: $("voiceStopBtn"),
  fileOverlay: $("fileOverlay"),
  fileDropZone: $("fileDropZone"),
  fileInput: $("fileInput"),
  closeFileOverlay: $("closeFileOverlay"),
  historyList: $("historyList"),
  historySearch: $("historySearch"),
  historyFilterLang: $("historyFilterLang"),
  exportHistoryBtn: $("exportHistoryBtn"),
  clearHistoryBtn: $("clearHistoryBtn"),
  toastContainer: $("toastContainer"),
  scrollTop: $("scrollTop")
};

/* ══════════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════════ */
function init() {
  populateLanguageSelects();
  loadHistory();
  applyTheme(state.theme);
  bindEvents();
  animateCounters();
  observeFeatureCards();
  initBackgroundParticles();
  initSpeechVoices();
  loadDatasets();
}

function populateLanguageSelects() {
  const autoOpt = document.createElement("option");
  autoOpt.value = "auto";
  autoOpt.textContent = "🔍 Auto Detect";
  els.sourceLang.appendChild(autoOpt);

  LANGUAGES.forEach(lang => {
    els.sourceLang.appendChild(new Option(`${lang.flag} ${lang.name}`, lang.code));
    els.targetLang.appendChild(new Option(`${lang.flag} ${lang.name}`, lang.code));
    els.historyFilterLang.appendChild(new Option(`${lang.flag} ${lang.name}`, lang.code));
  });

  els.sourceLang.value = "auto";
  els.targetLang.value = "es";
}

/* ══════════════════════════════════════════════════════════════
   EVENTS
   ══════════════════════════════════════════════════════════════ */
function bindEvents() {
  // Navbar
  window.addEventListener("scroll", onScroll);
  els.hamburger.addEventListener("click", toggleMobileMenu);
  document.querySelectorAll(".mobile-link").forEach(l => l.addEventListener("click", closeMobileMenu));
  els.themeToggle.addEventListener("click", toggleTheme);

  // Translate
  els.translateBtn.addEventListener("click", handleTranslate);
  els.sourceText.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleTranslate();
  });
  els.sourceText.addEventListener("input", updateCharCount);

  // Lang controls
  els.swapBtn.addEventListener("click", swapLanguages);

  // Panel buttons
  els.pasteBtn.addEventListener("click", pasteFromClipboard);
  els.micBtn.addEventListener("click", toggleVoiceInput);
  els.clearBtn.addEventListener("click", clearSource);
  els.copyBtn.addEventListener("click", copyTranslation);
  els.speakBtn.addEventListener("click", speakTranslation);
  els.downloadBtn.addEventListener("click", downloadTranslation);
  els.shareBtn.addEventListener("click", shareTranslation);

  // Rating
  document.querySelectorAll(".rate-btn").forEach(btn => {
    btn.addEventListener("click", () => rateTranslation(btn.dataset.val, btn));
  });

  // Mode tabs
  document.querySelectorAll(".mode-tab").forEach(tab => {
    tab.addEventListener("click", () => switchMode(tab.dataset.mode, tab));
  });

  // Extras tabs
  document.querySelectorAll(".extras-tab").forEach(tab => {
    tab.addEventListener("click", () => switchExtrasTab(tab.dataset.tab, tab));
  });

  // Voice overlay
  els.voiceStopBtn.addEventListener("click", () => requestStopVoice(false));

  // File overlay
  els.closeFileOverlay.addEventListener("click", () => { els.fileOverlay.style.display = "none"; });
  els.fileDropZone.addEventListener("click", () => els.fileInput.click());
  els.fileInput.addEventListener("change", handleFileInput);
  els.fileDropZone.addEventListener("dragover", e => { e.preventDefault(); els.fileDropZone.classList.add("drag-over"); });
  els.fileDropZone.addEventListener("dragleave", () => els.fileDropZone.classList.remove("drag-over"));
  els.fileDropZone.addEventListener("drop", handleFileDrop);

  // History
  els.historySearch.addEventListener("input", renderHistory);
  els.historyFilterLang.addEventListener("change", renderHistory);
  els.exportHistoryBtn.addEventListener("click", exportHistoryCSV);
  els.clearHistoryBtn.addEventListener("click", clearHistory);

  // Scroll top
  els.scrollTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ══════════════════════════════════════════════════════════════
   THEME
   ══════════════════════════════════════════════════════════════ */
function applyTheme(theme) {
  state.theme = theme;
  els.body.dataset.theme = theme;
  els.themeIcon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  applyTheme(state.theme === "dark" ? "light" : "dark");
}

/* ══════════════════════════════════════════════════════════════
   NAVBAR
   ══════════════════════════════════════════════════════════════ */
function onScroll() {
  els.navbar.classList.toggle("scrolled", window.scrollY > 50);
  els.scrollTop.classList.toggle("visible", window.scrollY > 400);
}

function toggleMobileMenu() {
  const open = els.hamburger.classList.toggle("open");
  els.mobileMenu.classList.toggle("open", open);
}

function closeMobileMenu() {
  els.hamburger.classList.remove("open");
  els.mobileMenu.classList.remove("open");
}

/* ══════════════════════════════════════════════════════════════
   MODES
   ══════════════════════════════════════════════════════════════ */
function switchMode(mode, tab) {
  document.querySelectorAll(".mode-tab").forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
  state.activeMode = mode;

  if (mode === "voice") {
    els.voiceOverlay.style.display = "flex";
    startVoiceInput();
  } else if (mode === "file") {
    els.fileOverlay.style.display = "flex";
  }
}

/* ══════════════════════════════════════════════════════════════
   LANGUAGE DETECTION (was missing — caused a ReferenceError)
   ══════════════════════════════════════════════════════════════ */
function detectLanguage(text) {
  // Non-Latin scripts (kana is checked before CJK so Japanese isn't read as Chinese)
  const scripts = [
    [/[\u0A00-\u0A7F]/, "pa"], [/[\u0900-\u097F]/, "hi"], [/[\u0980-\u09FF]/, "bn"],
    [/[\u0A80-\u0AFF]/, "gu"], [/[\u0B80-\u0BFF]/, "ta"], [/[\u0C00-\u0C7F]/, "te"],
    [/[\u0C80-\u0CFF]/, "kn"], [/[\u0D00-\u0D7F]/, "ml"], [/[\u0600-\u06FF]/, "ar"],
    [/[\u0400-\u04FF]/, "ru"], [/[\u3040-\u30FF]/, "ja"], [/[\uAC00-\uD7AF]/, "ko"],
    [/[\u4E00-\u9FFF]/, "zh"], [/[\u0E00-\u0E7F]/, "th"], [/[\u0370-\u03FF]/, "el"],
    [/[\u0590-\u05FF]/, "he"]
  ];

  let code = "en";
  const hit = scripts.find(([re]) => re.test(text));

  if (hit) {
    code = hit[1];
  } else {
    // Latin scripts: score by common words
    const stop = {
      en: ["the", "is", "are", "you", "and", "hello", "hi", "hii", "how", "my", "this", "what"],
      es: ["el", "la", "es", "que", "hola", "cómo", "como", "estás", "gracias", "por"],
      fr: ["le", "la", "est", "bonjour", "merci", "je", "vous", "comment", "les", "des"],
      de: ["der", "die", "das", "ist", "und", "ich", "nicht", "hallo", "danke", "wie"],
      it: ["il", "che", "ciao", "grazie", "sono", "come", "per", "non", "buongiorno"],
      pt: ["o", "que", "olá", "obrigado", "você", "não", "uma", "com", "para"]
    };
    const words = text.toLowerCase().split(/[\s.,!?]+/).filter(Boolean);
    let best = 0;
    for (const [c, list] of Object.entries(stop)) {
      const score = words.filter(w => list.includes(w)).length;
      if (score > best) { best = score; code = c; }
    }
  }

  const name = LANGUAGES.find(l => l.code === code)?.name || "English";
  return { code, name };
}

/* ══════════════════════════════════════════════════════════════
   TRANSLATE (demo mode)
   ══════════════════════════════════════════════════════════════ */
async function handleTranslate() {
  const text = els.sourceText.value.trim();

  if (!text) {
    showToast("Please enter some text to translate.", "error");
    return;
  }

  if (state.isTranslating) return;

  const targetLangCode = els.targetLang.value;
  const targetLang = LANGUAGES.find(l => l.code === targetLangCode)?.name || targetLangCode;

  let sourceLangCode = els.sourceLang.value;
  let detected = null;

  // Auto detection
  if (sourceLangCode === "auto") {
    detected = detectLanguage(text);
    sourceLangCode = detected.code;
    els.detectedLang.textContent = `Detected: ${detected.name}`;
  } else {
    els.detectedLang.textContent = "";
  }

  const sourceLang = LANGUAGES.find(l => l.code === sourceLangCode)?.name || sourceLangCode;
  const tone = els.toneSelect.value;

  state.isTranslating = true;
  state.currentTranslation = "";

  setTranslatingUI(true);
  showOutputPlaceholder(false);

  // Create output container
  els.outputArea.innerHTML = '<div class="output-text"></div>';
  const outputText = els.outputArea.querySelector(".output-text");

  try {
    const parsed = await translateText(text, sourceLangCode, targetLangCode, tone, detected !== null);

    if (!parsed || typeof parsed.translation !== "string") {
      throw new Error("Translation result is empty.");
    }

    await streamText(outputText, parsed.translation);
    state.currentTranslation = parsed.translation;

    // Word count
    const wc = parsed.translation.trim().split(/\s+/).filter(Boolean).length;
    els.outputMeta.textContent = `${wc} word${wc !== 1 ? "s" : ""} · ${tone} tone · ${parsed.source || "Demo"}`;

    // Enable buttons
    els.ratingWrap.style.display = "flex";
    [els.copyBtn, els.speakBtn, els.downloadBtn, els.shareBtn].forEach(button => {
      if (button) button.removeAttribute("disabled");
    });

    // Extras
    els.extrasPanel.style.display = "block";
    renderExtras(parsed, state.activeExtrasTab);

    // History
    saveToHistory({
      original: text,
      translation: parsed.translation,
      sourceLang: sourceLang,
      targetLang: targetLang,
      targetCode: targetLangCode,
      tone: tone,
      timestamp: Date.now()
    });

    showToast("Translation complete!", "success");
  } catch (err) {
    console.error("Translation error:", err);

    outputText.innerHTML =
      `<span style="color:#EF4444">⚠ Error: ${escapeHtml(err.message)}</span>`;

    showToast(`Error: ${err.message}`, "error");
  } finally {
    state.isTranslating = false;
    setTranslatingUI(false);
  }
}

/* ══════════════════════════════════════════════════════════════
   TRANSLATION ENGINE: live API (MyMemory) with offline fallback
   ══════════════════════════════════════════════════════════════ */
const API_ENABLED = true; // set to false to force offline demo dictionary only

function splitForApi(text, max = 450) {
  const sentences = text.split(/(?<=[.!?।\n])\s+/);
  const chunks = [];
  let cur = "";
  const push = () => { if (cur.trim()) chunks.push(cur.trim()); cur = ""; };
  for (const sent of sentences) {
    if (sent.length > max) {
      push();
      let piece = "";
      for (const w of sent.split(/\s+/)) {
        if ((piece + " " + w).length > max) { chunks.push(piece.trim()); piece = ""; }
        piece += " " + w;
      }
      if (piece.trim()) chunks.push(piece.trim());
    } else if ((cur + " " + sent).length > max) {
      push();
      cur = sent;
    } else {
      cur += (cur ? " " : "") + sent;
    }
  }
  push();
  return chunks;
}

async function fetchMyMemory(chunk, src, tgt) {
  const fix = c => ({ zh: "zh-CN", zt: "zh-TW", auto: "Autodetect" }[c] || c);
  const url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(chunk) +
    "&langpair=" + encodeURIComponent(fix(src) + "|" + fix(tgt));

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error("Translation service unavailable.");
    const data = await res.json();
    if (Number(data.responseStatus) !== 200) throw new Error(String(data.responseDetails || "API error"));
    const out = data.responseData && data.responseData.translatedText;
    if (!out || /MYMEMORY WARNING/i.test(out)) throw new Error("Free API limit reached.");
    return { out, matches: data.matches || [] };
  } finally {
    clearTimeout(timer);
  }
}

async function getApiTranslation(text, src, tgt, tone, userChoseAuto) {
  const chunks = splitForApi(text);
  const results = [];
  for (const c of chunks) {
    results.push(await fetchMyMemory(c, userChoseAuto ? "auto" : src, tgt));
  }
  const translation = results.map(r => r.out).join(" ");

  // Alternatives (only meaningful for a single chunk)
  let alternatives = [translation];
  if (results.length === 1) {
    const seen = new Set([translation.trim().toLowerCase()]);
    for (const m of results[0].matches) {
      const t = (m.translation || "").trim();
      if (t && !seen.has(t.toLowerCase())) {
        seen.add(t.toLowerCase());
        alternatives.push(t);
      }
      if (alternatives.length >= 4) break;
    }
  }

  // Reuse the demo dictionary for the word breakdown tab
  const demo = getDemoTranslation(text, src, tgt, tone);
  return {
    ...demo,
    translation,
    alternatives,
    pronunciation: translation,
    cultural_context: "Translated using the MyMemory translation API.",
    source: "Live API"
  };
}

async function translateText(text, src, tgt, tone, userChoseAuto) {
  if (src === tgt) {
    return { ...getDemoTranslation(text, src, tgt, tone), translation: text, alternatives: [text], source: "Same language" };
  }

  // Curated local phrases/datasets first
  if (PREFER_LOCAL_PHRASES && lookupPhrase(text, tgt)) {
    const local = getDemoTranslation(text, src, tgt, tone);
    local.source = "Local dataset";
    return local;
  }

  if (API_ENABLED && navigator.onLine) {
    try {
      return await getApiTranslation(text, src, tgt, tone, userChoseAuto);
    } catch (err) {
      console.warn("API failed, using offline dictionary:", err);
      showToast("Live translation unavailable — using offline dictionary.", "info");
    }
  }

  const demo = getDemoTranslation(text, src, tgt, tone);
  demo.source = "Offline demo";
  return demo;
}

/* Builds the result object the UI expects (fields match renderExtras) */
function buildDemoResult(text, translation, sourceLang, dict, note) {
  const detected =
    sourceLang === "auto"
      ? detectLanguage(text).name
      : (LANGUAGES.find(l => l.code === sourceLang)?.name || sourceLang);

  const word_breakdown = text.split(/\s+/).filter(Boolean).map(word => {
    const clean = word.toLowerCase().replace(/[.,!?]/g, "");
    return { original: word, translated: (dict && dict[clean]) || word, pos: "—" };
  });

  return {
    translation,
    detected_language: detected,
    alternatives: [translation],
    word_breakdown,
    pronunciation: translation,
    cultural_context: note
  };
}

const BUILTIN_PHRASES = {
    hi: {
      "hello": "नमस्ते",
      "hi": "नमस्ते",
      "hii": "नमस्ते",
      "hey": "अरे",
      "hello mam": "नमस्ते मैम",
      "hii mam": "हाय मैम",
      "hello sir": "नमस्ते सर",
      "hii sir": "हाय सर",
      "how are you": "आप कैसे हैं?",
      "hii mam how are you": "हाय मैम, आप कैसी हैं?",
      "hello mam how are you": "नमस्ते मैम, आप कैसी हैं?",
      "hello sir how are you": "नमस्ते सर, आप कैसे हैं?",
      "i am fine": "मैं ठीक हूँ",
      "i am good": "मैं अच्छा हूँ",
      "what are you doing": "आप क्या कर रहे हैं?",
      "where are you going": "आप कहाँ जा रहे हैं?",
      "what is your name": "आपका नाम क्या है?",
      "my name is": "मेरा नाम है",
      "nice to meet you": "आपसे मिलकर अच्छा लगा",
      "thank you": "धन्यवाद",
      "thank you very much": "आपका बहुत धन्यवाद",
      "thanks": "धन्यवाद",
      "you are welcome": "आपका स्वागत है",
      "good morning": "सुप्रभात",
      "good afternoon": "शुभ दोपहर",
      "good evening": "शुभ संध्या",
      "good night": "शुभ रात्रि",
      "see you later": "बाद में मिलते हैं",
      "see you tomorrow": "कल मिलते हैं",
      "take care": "अपना ख्याल रखना",
      "please help me": "कृपया मेरी मदद करें",
      "can you help me": "क्या आप मेरी मदद कर सकते हैं?",
      "please explain this": "कृपया इसे समझाइए",
      "i understand": "मैं समझ गया हूँ",
      "i do not understand": "मैं समझ नहीं पा रहा हूँ",
      "i have a question": "मेरा एक सवाल है",
      "what is this": "यह क्या है?",
      "where is it": "यह कहाँ है?",
      "why are you late": "आप देर से क्यों आए?",
      "i am coming": "मैं आ रहा हूँ",
      "i am going": "मैं जा रहा हूँ",
      "wait for me": "मेरा इंतज़ार करो",
      "come here": "यहाँ आओ",
      "let us go": "चलो चलते हैं",
      "i like this": "मुझे यह पसंद है",
      "i love this": "मुझे यह बहुत पसंद है",
      "this is very good": "यह बहुत अच्छा है",
      "this is amazing": "यह अद्भुत है",
      "what happened": "क्या हुआ?",
      "everything is fine": "सब कुछ ठीक है",
      "do not worry": "चिंता मत करो",
      "have a nice day": "आपका दिन शुभ हो",
      "i am ready": "मैं तैयार हूँ",
      "are you ready": "क्या आप तैयार हैं?",
      "let us start": "चलो शुरू करते हैं",
      "this is my project": "यह मेरा प्रोजेक्ट है",
      "this is my college project": "यह मेरा कॉलेज प्रोजेक्ट है",
      "welcome to my project": "मेरे प्रोजेक्ट में आपका स्वागत है",
      "this is a language translator": "यह एक भाषा अनुवादक है",
      "this project uses artificial intelligence": "यह प्रोजेक्ट आर्टिफिशियल इंटेलिजेंस का उपयोग करता है",
      "thank you for your time": "आपके समय के लिए धन्यवाद"
    },

    es: {
      "hello": "Hola",
      "hi": "Hola",
      "hii": "Hola",
      "hey": "Oye",
      "how are you": "¿Cómo estás?",
      "hii mam how are you": "Hola señora, ¿cómo está?",
      "hello sir how are you": "Hola señor, ¿cómo está?",
      "i am fine": "Estoy bien",
      "i am good": "Estoy bien",
      "what are you doing": "¿Qué estás haciendo?",
      "where are you going": "¿Adónde vas?",
      "what is your name": "¿Cómo te llamas?",
      "nice to meet you": "Mucho gusto",
      "thank you": "Gracias",
      "thank you very much": "Muchas gracias",
      "you are welcome": "De nada",
      "good morning": "Buenos días",
      "good afternoon": "Buenas tardes",
      "good evening": "Buenas tardes",
      "good night": "Buenas noches",
      "see you later": "Hasta luego",
      "see you tomorrow": "Hasta mañana",
      "take care": "Cuídate",
      "please help me": "Por favor, ayúdame",
      "can you help me": "¿Puedes ayudarme?",
      "i understand": "Entiendo",
      "i do not understand": "No entiendo",
      "what is this": "¿Qué es esto?",
      "where is it": "¿Dónde está?",
      "i am coming": "Estoy llegando",
      "i am going": "Me voy",
      "wait for me": "Espérame",
      "come here": "Ven aquí",
      "let us go": "Vamos",
      "i like this": "Me gusta esto",
      "this is very good": "Esto es muy bueno",
      "what happened": "¿Qué pasó?",
      "everything is fine": "Todo está bien",
      "do not worry": "No te preocupes",
      "have a nice day": "Que tengas un buen día",
      "i am ready": "Estoy listo",
      "are you ready": "¿Estás listo?",
      "let us start": "Empecemos",
      "this is my project": "Este es mi proyecto",
      "this is my college project": "Este es mi proyecto universitario",
      "welcome to my project": "Bienvenido a mi proyecto",
      "this is a language translator": "Este es un traductor de idiomas",
      "thank you for your time": "Gracias por tu tiempo"
    },

    fr: {
      "hello": "Bonjour",
      "hi": "Salut",
      "hii": "Salut",
      "hey": "Salut",
      "how are you": "Comment allez-vous ?",
      "hii mam how are you": "Bonjour madame, comment allez-vous ?",
      "hello sir how are you": "Bonjour monsieur, comment allez-vous ?",
      "i am fine": "Je vais bien",
      "i am good": "Je vais bien",
      "what are you doing": "Qu'est-ce que vous faites ?",
      "where are you going": "Où allez-vous ?",
      "what is your name": "Comment vous appelez-vous ?",
      "nice to meet you": "Ravi de vous rencontrer",
      "thank you": "Merci",
      "thank you very much": "Merci beaucoup",
      "you are welcome": "De rien",
      "good morning": "Bonjour",
      "good afternoon": "Bon après-midi",
      "good evening": "Bonsoir",
      "good night": "Bonne nuit",
      "see you later": "À plus tard",
      "see you tomorrow": "À demain",
      "take care": "Prenez soin de vous",
      "please help me": "Aidez-moi s'il vous plaît",
      "can you help me": "Pouvez-vous m'aider ?",
      "i understand": "Je comprends",
      "i do not understand": "Je ne comprends pas",
      "what is this": "Qu'est-ce que c'est ?",
      "where is it": "Où est-ce ?",
      "i am coming": "J'arrive",
      "i am going": "Je pars",
      "wait for me": "Attendez-moi",
      "come here": "Venez ici",
      "let us go": "Allons-y",
      "i like this": "J'aime ça",
      "this is very good": "C'est très bien",
      "what happened": "Que s'est-il passé ?",
      "everything is fine": "Tout va bien",
      "do not worry": "Ne vous inquiétez pas",
      "have a nice day": "Bonne journée",
      "i am ready": "Je suis prêt",
      "are you ready": "Êtes-vous prêt ?",
      "let us start": "Commençons",
      "this is my project": "C'est mon projet",
      "this is my college project": "C'est mon projet universitaire",
      "welcome to my project": "Bienvenue dans mon projet",
      "this is a language translator": "C'est un traducteur de langues",
      "thank you for your time": "Merci pour votre temps"
    },

    de: {
      "hello": "Hallo",
      "hi": "Hallo",
      "hii": "Hallo",
      "hey": "Hallo",
      "how are you": "Wie geht es Ihnen?",
      "hii mam how are you": "Hallo Frau, wie geht es Ihnen?",
      "hello sir how are you": "Hallo Herr, wie geht es Ihnen?",
      "i am fine": "Mir geht es gut",
      "i am good": "Mir geht es gut",
      "what are you doing": "Was machen Sie?",
      "where are you going": "Wohin gehen Sie?",
      "what is your name": "Wie heißen Sie?",
      "nice to meet you": "Schön, Sie kennenzulernen",
      "thank you": "Danke",
      "thank you very much": "Vielen Dank",
      "you are welcome": "Gern geschehen",
      "good morning": "Guten Morgen",
      "good afternoon": "Guten Tag",
      "good evening": "Guten Abend",
      "good night": "Gute Nacht",
      "see you later": "Bis später",
      "see you tomorrow": "Bis morgen",
      "take care": "Pass auf dich auf",
      "please help me": "Bitte helfen Sie mir",
      "can you help me": "Können Sie mir helfen?",
      "i understand": "Ich verstehe",
      "i do not understand": "Ich verstehe nicht",
      "what is this": "Was ist das?",
      "where is it": "Wo ist es?",
      "i am coming": "Ich komme",
      "i am going": "Ich gehe",
      "wait for me": "Warte auf mich",
      "come here": "Komm hierher",
      "let us go": "Gehen wir",
      "i like this": "Das gefällt mir",
      "this is very good": "Das ist sehr gut",
      "what happened": "Was ist passiert?",
      "everything is fine": "Alles ist in Ordnung",
      "do not worry": "Keine Sorge",
      "have a nice day": "Einen schönen Tag",
      "i am ready": "Ich bin bereit",
      "are you ready": "Sind Sie bereit?",
      "let us start": "Fangen wir an",
      "this is my project": "Das ist mein Projekt",
      "this is my college project": "Das ist mein Hochschulprojekt",
      "welcome to my project": "Willkommen bei meinem Projekt",
      "this is a language translator": "Dies ist ein Sprachübersetzer",
      "thank you for your time": "Vielen Dank für Ihre Zeit"
    },

    pa: {
      "hello": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
      "hi": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
      "hii": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
      "how are you": "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
      "hii mam how are you": "ਹਾਇ ਮੈਮ, ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
      "hello sir how are you": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਸਰ, ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
      "i am fine": "ਮੈਂ ਠੀਕ ਹਾਂ",
      "i am good": "ਮੈਂ ਠੀਕ ਹਾਂ",
      "what are you doing": "ਤੁਸੀਂ ਕੀ ਕਰ ਰਹੇ ਹੋ?",
      "where are you going": "ਤੁਸੀਂ ਕਿੱਥੇ ਜਾ ਰਹੇ ਹੋ?",
      "what is your name": "ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
      "nice to meet you": "ਤੁਹਾਨੂੰ ਮਿਲ ਕੇ ਚੰਗਾ ਲੱਗਿਆ",
      "thank you": "ਧੰਨਵਾਦ",
      "thank you very much": "ਤੁਹਾਡਾ ਬਹੁਤ ਧੰਨਵਾਦ",
      "you are welcome": "ਜੀ ਆਇਆਂ ਨੂੰ",
      "good morning": "ਸ਼ੁਭ ਸਵੇਰ",
      "good evening": "ਸ਼ੁਭ ਸ਼ਾਮ",
      "good night": "ਸ਼ੁਭ ਰਾਤ",
      "see you later": "ਬਾਅਦ ਵਿੱਚ ਮਿਲਦੇ ਹਾਂ",
      "see you tomorrow": "ਕੱਲ੍ਹ ਮਿਲਦੇ ਹਾਂ",
      "take care": "ਆਪਣਾ ਧਿਆਨ ਰੱਖੋ",
      "please help me": "ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਮਦਦ ਕਰੋ",
      "can you help me": "ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
      "i understand": "ਮੈਂ ਸਮਝ ਗਿਆ ਹਾਂ",
      "i do not understand": "ਮੈਂ ਸਮਝ ਨਹੀਂ ਰਿਹਾ",
      "what is this": "ਇਹ ਕੀ ਹੈ?",
      "where is it": "ਇਹ ਕਿੱਥੇ ਹੈ?",
      "i am coming": "ਮੈਂ ਆ ਰਿਹਾ ਹਾਂ",
      "i am going": "ਮੈਂ ਜਾ ਰਿਹਾ ਹਾਂ",
      "wait for me": "ਮੇਰਾ ਇੰਤਜ਼ਾਰ ਕਰੋ",
      "come here": "ਇੱਥੇ ਆਓ",
      "let us go": "ਚੱਲੋ ਚੱਲੀਏ",
      "i like this": "ਮੈਨੂੰ ਇਹ ਪਸੰਦ ਹੈ",
      "this is very good": "ਇਹ ਬਹੁਤ ਵਧੀਆ ਹੈ",
      "what happened": "ਕੀ ਹੋਇਆ?",
      "everything is fine": "ਸਭ ਕੁਝ ਠੀਕ ਹੈ",
      "do not worry": "ਚਿੰਤਾ ਨਾ ਕਰੋ",
      "have a nice day": "ਤੁਹਾਡਾ ਦਿਨ ਚੰਗਾ ਰਹੇ",
      "i am ready": "ਮੈਂ ਤਿਆਰ ਹਾਂ",
      "are you ready": "ਕੀ ਤੁਸੀਂ ਤਿਆਰ ਹੋ?",
      "let us start": "ਚੱਲੋ ਸ਼ੁਰੂ ਕਰੀਏ",
      "this is my project": "ਇਹ ਮੇਰਾ ਪ੍ਰੋਜੈਕਟ ਹੈ",
      "this is my college project": "ਇਹ ਮੇਰਾ ਕਾਲਜ ਪ੍ਰੋਜੈਕਟ ਹੈ",
      "welcome to my project": "ਮੇਰੇ ਪ੍ਰੋਜੈਕਟ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ",
      "this is a language translator": "ਇਹ ਇੱਕ ਭਾਸ਼ਾ ਅਨੁਵਾਦਕ ਹੈ",
      "thank you for your time": "ਤੁਹਾਡੇ ਸਮੇਂ ਲਈ ਧੰਨਵਾਦ"
    }
  };


const BUILTIN_WORDS = {
    hi: {
      hello: "नमस्ते", hi: "नमस्ते", mam: "मैम", sir: "सर", friend: "दोस्त",
      good: "अच्छा", bad: "बुरा", morning: "सुबह", evening: "शाम", night: "रात",
      today: "आज", tomorrow: "कल", please: "कृपया", thank: "धन्यवाद", thanks: "धन्यवाद",
      project: "प्रोजेक्ट", college: "कॉलेज", language: "भाषा", translator: "अनुवादक",
      computer: "कंप्यूटर", help: "मदद", home: "घर", school: "स्कूल",
      student: "छात्र", teacher: "शिक्षक",
      how: "कैसे", are: "हैं", you: "आप", what: "क्या", is: "है", your: "आपका", name: "नाम", i: "मैं", am: "हूँ", fine: "ठीक", where: "कहाँ", why: "क्यों", this: "यह", my: "मेरा"
    },
    es: {
      hello: "hola", hi: "hola", friend: "amigo", good: "bueno", bad: "malo",
      morning: "mañana", evening: "tarde", night: "noche", today: "hoy", tomorrow: "mañana",
      please: "por favor", thank: "gracias", thanks: "gracias", project: "proyecto",
      college: "universidad", language: "idioma", translator: "traductor",
      computer: "computadora", help: "ayuda", home: "casa", school: "escuela",
      student: "estudiante", teacher: "profesor",
      how: "cómo", are: "estás", you: "tú", what: "qué", is: "es", your: "tu", name: "nombre", i: "yo", am: "soy", fine: "bien", where: "dónde", why: "por qué", this: "esto", my: "mi"
    },
    fr: {
      hello: "bonjour", hi: "salut", friend: "ami", good: "bon", bad: "mauvais",
      morning: "matin", evening: "soir", night: "nuit", today: "aujourd'hui", tomorrow: "demain",
      please: "s'il vous plaît", thank: "merci", thanks: "merci", project: "projet",
      college: "université", language: "langue", translator: "traducteur",
      computer: "ordinateur", help: "aide", home: "maison", school: "école",
      student: "étudiant", teacher: "professeur",
      how: "comment", are: "êtes", you: "vous", what: "quoi", is: "est", your: "votre", name: "nom", i: "je", am: "suis", fine: "bien", where: "où", why: "pourquoi", this: "ceci", my: "mon"
    },
    de: {
      hello: "hallo", hi: "hallo", friend: "Freund", good: "gut", bad: "schlecht",
      morning: "Morgen", evening: "Abend", night: "Nacht", today: "heute", tomorrow: "morgen",
      please: "bitte", thank: "danke", thanks: "danke", project: "Projekt",
      college: "Hochschule", language: "Sprache", translator: "Übersetzer",
      computer: "Computer", help: "Hilfe", home: "Haus", school: "Schule",
      student: "Student", teacher: "Lehrer",
      how: "wie", are: "sind", you: "Sie", what: "was", is: "ist", your: "Ihr", name: "Name", i: "ich", am: "bin", fine: "gut", where: "wo", why: "warum", this: "das", my: "mein"
    },
    pa: {
      hello: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", hi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", friend: "ਦੋਸਤ", good: "ਵਧੀਆ", bad: "ਮਾੜਾ",
      morning: "ਸਵੇਰ", evening: "ਸ਼ਾਮ", night: "ਰਾਤ", today: "ਅੱਜ", tomorrow: "ਕੱਲ੍ਹ",
      please: "ਕਿਰਪਾ ਕਰਕੇ", thank: "ਧੰਨਵਾਦ", thanks: "ਧੰਨਵਾਦ", project: "ਪ੍ਰੋਜੈਕਟ",
      college: "ਕਾਲਜ", language: "ਭਾਸ਼ਾ", translator: "ਅਨੁਵਾਦਕ", computer: "ਕੰਪਿਊਟਰ",
      help: "ਮਦਦ", home: "ਘਰ", school: "ਸਕੂਲ", student: "ਵਿਦਿਆਰਥੀ", teacher: "ਅਧਿਆਪਕ",
      how: "ਕਿਵੇਂ", are: "ਹੋ", you: "ਤੁਸੀਂ", what: "ਕੀ", is: "ਹੈ", your: "ਤੁਹਾਡਾ", name: "ਨਾਮ", i: "ਮੈਂ", am: "ਹਾਂ", fine: "ਠੀਕ", where: "ਕਿੱਥੇ", why: "ਕਿਉਂ", this: "ਇਹ", my: "ਮੇਰਾ"
    }
  };



/* ══════════════════════════════════════════════════════════════
   LOCAL DICTIONARIES (built-in + optional datasets)
   ══════════════════════════════════════════════════════════════ */
// Null-prototype objects so inputs like "constructor" can never hit Object.prototype
const PHRASES = {};
const WORDS = {};
for (const t of Object.keys(BUILTIN_PHRASES)) PHRASES[t] = Object.assign(Object.create(null), BUILTIN_PHRASES[t]);
for (const t of Object.keys(BUILTIN_WORDS)) WORDS[t] = Object.assign(Object.create(null), BUILTIN_WORDS[t]);

function normalizePhraseKey(text) {
  return String(text).trim().toLowerCase().replace(/\s+/g, " ").replace(/[!?.,।]+$/g, "");
}

function lookupPhrase(text, target) {
  const dict = PHRASES[target];
  if (!dict) return null;
  const input = normalizePhraseKey(text);
  const candidates = [input];
  if (/^hi\s/.test(input)) candidates.push(input.replace(/^hi\s/, "hii "), input.replace(/^hi\s/, "hello "));
  if (/^hii\s/.test(input)) candidates.push(input.replace(/^hii\s/, "hi "), input.replace(/^hii\s/, "hello "));
  const key = candidates.find(c => c in dict);
  return key ? dict[key] : null;
}

/* Loads extra English→X datasets from JSON files:
   { "target": "hi", "phrases": { "good morning": "सुप्रभात" }, "words": { "apple": "सेब" } } */
async function loadDatasets() {
  let added = 0;
  for (const file of DATASET_FILES) {
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const t = data.target;
      if (!t) throw new Error('missing "target"');

      if (data.phrases) {
        const d = PHRASES[t] || (PHRASES[t] = Object.create(null));
        for (const k in data.phrases) {
          const key = normalizePhraseKey(k);
          if (!(key in d)) { d[key] = data.phrases[k]; added++; }
        }
      }
      if (data.words) {
        const d = WORDS[t] || (WORDS[t] = Object.create(null));
        for (const k in data.words) {
          const key = k.trim().toLowerCase();
          if (!(key in d)) { d[key] = data.words[k]; added++; }
        }
      }
    } catch (err) {
      console.warn("Could not load dataset " + file + ":", err);
      showToast("Could not load " + file, "error");
    }
  }
  if (added > 0) showToast("Loaded " + added.toLocaleString() + " extra dictionary entries.", "success");
}

function getDemoTranslation(text, sourceLang, targetLang, tone) {
  const target = targetLang === "auto" ? "en" : targetLang;
  const dict = WORDS[target] || null;
  const demoNote = "Translation generated using LinguaAI prototype demo mode.";

  // 1. Exact phrase match (built-in + datasets)
  const exact = lookupPhrase(text, target);
  if (exact) {
    return buildDemoResult(text, exact, sourceLang, dict, demoNote);
  }

  // 2. Word-by-word fallback
  if (dict) {
    let matched = 0;
    const translated = text
      .split(/\s+/)
      .map(word => {
        const hit = dict[word.toLowerCase().replace(/[.,!?]/g, "")];
        if (hit) matched++;
        return hit || word;
      })
      .join(" ");

    if (matched > 0) {
      return buildDemoResult(text, translated, sourceLang, dict, demoNote);
    }
  }

  // 3. Nothing found
  return buildDemoResult(
    text,
    text,
    sourceLang,
    dict,
    "This sentence is not currently included in the prototype dictionary."
  );
}

/* Kept for when you connect a real AI API later */
function buildTranslationPrompt(text, sourceLang, targetLang, tone) {
  return `You are an expert linguist and translator. Translate the following text accurately.

Source language: ${sourceLang}
Target language: ${targetLang}
Tone/Register: ${tone}
Text to translate:
"""
${text}
"""

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "translation": "the translated text here",
  "detected_language": "name of detected source language (if auto-detect was used, otherwise null)",
  "alternatives": ["alternative translation 1", "alternative translation 2", "alternative translation 3"],
  "word_breakdown": [
    {"original": "word1", "translated": "translation1", "pos": "noun"},
    {"original": "word2", "translated": "translation2", "pos": "verb"}
  ],
  "pronunciation": "phonetic pronunciation guide or romanization of the translated text if applicable",
  "cultural_context": "brief note about any cultural nuances or idiomatic expressions in the translation (1-2 sentences)"
}

Ensure the JSON is complete and valid. Adapt the tone appropriately: formal=professional/respectful, casual=friendly/everyday, literary=poetic/expressive, technical=precise/domain-specific, neutral=standard.`;
}

/* Simulate streaming effect for output */
async function streamText(el, text) {
  el.textContent = "";
  const cursor = document.createElement("span");
  cursor.className = "streaming-cursor";
  el.appendChild(cursor);

  const words = text.split(" ");
  let i = 0;
  const chunk = () => new Promise(resolve => {
    const batch = Math.ceil(Math.random() * 3) + 1;
    const slice = words.slice(i, i + batch).join(" ");
    if (slice) {
      el.insertBefore(document.createTextNode(slice + " "), cursor);
      i += batch;
    }
    setTimeout(resolve, 25 + Math.random() * 30);
  });

  while (i < words.length) { await chunk(); }
  cursor.remove();
}

function setTranslatingUI(loading) {
  els.translateBtn.classList.toggle("loading", loading);
  els.translateBtn.disabled = loading;
  if (!loading) {
    document.querySelectorAll(".rate-btn").forEach(b => b.classList.remove("active"));
  }
}

function showOutputPlaceholder(show) {
  if (show) {
    els.outputArea.innerHTML = `
      <div class="output-placeholder">
        <div class="placeholder-icon"><i class="fas fa-language"></i></div>
        <p>Translation will appear here</p>
      </div>`;
    els.outputMeta.textContent = "";
    els.ratingWrap.style.display = "none";
    [els.copyBtn, els.speakBtn, els.downloadBtn, els.shareBtn].forEach(b => b.setAttribute("disabled", ""));
  }
}

/* ══════════════════════════════════════════════════════════════
   EXTRAS PANEL
   ══════════════════════════════════════════════════════════════ */
function switchExtrasTab(tab, el) {
  document.querySelectorAll(".extras-tab").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
  state.activeExtrasTab = tab;
  if (window._lastParsed) renderExtras(window._lastParsed, tab);
}

function renderExtras(parsed, tab) {
  window._lastParsed = parsed;
  let html = "";

  if (tab === "alternatives") {
    const alts = parsed.alternatives || [];
    if (alts.length === 0) {
      html = "<p>No alternatives available.</p>";
    } else {
      html = alts.map((alt, i) => `
        <div class="alt-item" data-alt="${escapeHtml(alt)}">
          <span class="alt-num">${i + 1}.</span>
          <span>${escapeHtml(alt)}</span>
        </div>`).join("");
    }
  } else if (tab === "breakdown") {
    const wb = parsed.word_breakdown || [];
    if (wb.length === 0) {
      html = "<p>Word breakdown not available.</p>";
    } else {
      html = `<div style="border-bottom:1px solid var(--border);padding-bottom:0.5rem;margin-bottom:0.5rem;font-size:0.75rem;font-weight:600;color:var(--text-muted);display:grid;grid-template-columns:1fr 1fr auto;gap:1rem">
        <span>ORIGINAL</span><span>TRANSLATED</span><span>PART OF SPEECH</span>
      </div>` + wb.map(w => `
        <div class="word-row">
          <span class="word-original">${escapeHtml(w.original)}</span>
          <span class="word-translated">${escapeHtml(w.translated)}</span>
          <span class="word-pos">${escapeHtml(w.pos || "—")}</span>
        </div>`).join("");
    }
  } else if (tab === "pronunciation") {
    const pron = parsed.pronunciation;
    if (pron) {
      html = `<div style="font-family:var(--font-mono);font-size:1rem;background:var(--bg-input);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
        <small style="color:var(--text-muted);font-size:0.72rem;display:block;margin-bottom:0.4rem">PHONETIC GUIDE</small>
        ${escapeHtml(pron)}
      </div>`;
    } else {
      html = "<p>Pronunciation guide not available for this language pair.</p>";
    }
  } else if (tab === "context") {
    const ctx = parsed.cultural_context;
    if (ctx) {
      html = `<div style="padding:1rem;background:rgba(124,58,237,0.06);border:1px solid rgba(124,58,237,0.15);border-radius:var(--radius-sm);border-left:3px solid var(--accent-purple)">
        <small style="color:var(--accent-purple);font-size:0.72rem;display:block;margin-bottom:0.4rem;font-family:var(--font-mono)">CULTURAL NOTE</small>
        ${escapeHtml(ctx)}
      </div>`;
    } else {
      html = "<p>No cultural context notes for this translation.</p>";
    }
  }

  els.extrasContent.innerHTML = html;

  // Safe click handlers (avoids breaking on apostrophes in inline onclick)
  els.extrasContent.querySelectorAll(".alt-item").forEach(item =>
    item.addEventListener("click", () => window.useAlternative(item.dataset.alt))
  );
}

window.useAlternative = function (text) {
  const outputEl = els.outputArea.querySelector(".output-text");
  if (outputEl) outputEl.textContent = text;
  state.currentTranslation = text;
  showToast("Alternative applied!", "info");
};

/* ══════════════════════════════════════════════════════════════
   PANEL ACTIONS
   ══════════════════════════════════════════════════════════════ */
function updateCharCount() {
  els.charCount.textContent = els.sourceText.value.length;
}

function swapLanguages() {
  const srcCode = els.sourceLang.value;
  if (srcCode === "auto") {
    showToast("Auto Detect can't be used as target.", "error");
    return;
  }

  const tgtCode = els.targetLang.value;
  const translation = state.currentTranslation;

  els.sourceLang.value = tgtCode;
  els.targetLang.value = srcCode;

  if (translation) {
    els.sourceText.value = translation;
    updateCharCount();
    showOutputPlaceholder(true);
    state.currentTranslation = "";
  }

  els.swapBtn.style.transform = "rotate(360deg)";
  setTimeout(() => { els.swapBtn.style.transform = ""; }, 300);
  showToast("Languages swapped!", "info");
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    els.sourceText.value = text;
    updateCharCount();
    showToast("Pasted from clipboard!", "success");
  } catch {
    showToast("Clipboard access denied.", "error");
  }
}

function clearSource() {
  els.sourceText.value = "";
  updateCharCount();
  showOutputPlaceholder(true);
  state.currentTranslation = "";
  els.extrasPanel.style.display = "none";
  els.detectedLang.textContent = "";
}

async function copyTranslation() {
  if (!state.currentTranslation) return;
  try {
    await navigator.clipboard.writeText(state.currentTranslation);
    showToast("Translation copied!", "success");
  } catch {
    showToast("Could not copy.", "error");
  }
}

const SPEECH_LOCALES = {
  af: "af-ZA", sq: "sq-AL", ar: "ar-SA", hy: "hy-AM", az: "az-AZ", eu: "eu-ES", be: "be-BY",
  bn: "bn-IN", bs: "bs-BA", bg: "bg-BG", ca: "ca-ES", zh: "zh-CN", zt: "zh-TW", hr: "hr-HR",
  cs: "cs-CZ", da: "da-DK", nl: "nl-NL", en: "en-US", et: "et-EE", fi: "fi-FI", fr: "fr-FR",
  gl: "gl-ES", ka: "ka-GE", de: "de-DE", el: "el-GR", gu: "gu-IN", he: "he-IL", hi: "hi-IN",
  hu: "hu-HU", is: "is-IS", id: "id-ID", ga: "ga-IE", it: "it-IT", ja: "ja-JP", kn: "kn-IN",
  kk: "kk-KZ", km: "km-KH", ko: "ko-KR", lv: "lv-LV", lt: "lt-LT", mk: "mk-MK", ms: "ms-MY",
  ml: "ml-IN", mt: "mt-MT", mr: "mr-IN", mn: "mn-MN", ne: "ne-NP", no: "nb-NO", fa: "fa-IR",
  pl: "pl-PL", pt: "pt-BR", pa: "pa-IN", ro: "ro-RO", ru: "ru-RU", sr: "sr-RS", sk: "sk-SK",
  sl: "sl-SI", so: "so-SO", es: "es-ES", su: "su-ID", sw: "sw-KE", sv: "sv-SE", ta: "ta-IN",
  te: "te-IN", th: "th-TH", tr: "tr-TR", uk: "uk-UA", ur: "ur-PK", uz: "uz-UZ", vi: "vi-VN",
  cy: "cy-GB", zu: "zu-ZA", xh: "xh-ZA"
};

function getSpeechLocale(langCode) {
  return SPEECH_LOCALES[langCode] || langCode;
}

/* Voices load asynchronously in browsers, so cache them and wait when needed */
let cachedVoices = [];
let ttsToken = 0;
let ttsAudio = null;

function initSpeechVoices() {
  if (!("speechSynthesis" in window)) return;
  const load = () => { cachedVoices = window.speechSynthesis.getVoices(); };
  load();
  window.speechSynthesis.addEventListener("voiceschanged", load);
}

function waitForVoices(timeout = 1500) {
  return new Promise(resolve => {
    if (cachedVoices.length) return resolve(cachedVoices);
    const started = Date.now();
    const timer = setInterval(() => {
      cachedVoices = window.speechSynthesis.getVoices();
      if (cachedVoices.length || Date.now() - started > timeout) {
        clearInterval(timer);
        resolve(cachedVoices);
      }
    }, 100);
  });
}

function getBestSpeechVoice(langCode) {
  const locale = getSpeechLocale(langCode).toLowerCase();
  const lang = locale.split("-")[0];
  const norm = v => v.lang.toLowerCase().replace("_", "-");
  return (
    cachedVoices.find(v => norm(v) === locale) ||
    cachedVoices.find(v => norm(v).split("-")[0] === lang) ||
    null
  );
}

function stopSpeaking() {
  ttsToken++;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (ttsAudio) { ttsAudio.pause(); ttsAudio = null; }
}

function speakWithBrowserVoice(text, voice, token) {
  // Long utterances get cut off in some browsers, so speak in chunks
  splitForApi(text, 180).forEach(part => {
    const u = new SpeechSynthesisUtterance(part);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = 0.9;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  });
}

/* Fallback when the device has no installed voice for the language.
   Uses Google Translate's unofficial TTS endpoint, which may change or be rate-limited. */
function speakWithOnlineTts(text, code, token) {
  const tl = ({ zh: "zh-CN", zt: "zh-TW", he: "iw" })[code] || code;
  const parts = splitForApi(text, 180);
  return new Promise(resolve => {
    let i = 0;
    let started = false;
    const next = () => {
      if (token !== ttsToken || i >= parts.length) {
        if (!started) resolve(false);
        return;
      }
      const url = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=" +
        encodeURIComponent(tl) + "&q=" + encodeURIComponent(parts[i++]);
      const audio = new Audio(url);
      ttsAudio = audio;
      audio.onended = next;
      audio.onerror = () => {
        if (!started) resolve(false);
        else showToast("Online voice stopped.", "error");
      };
      audio.play()
        .then(() => { if (!started) { started = true; resolve(true); } })
        .catch(() => { if (!started) resolve(false); });
    };
    next();
  });
}

async function speakTranslation() {
  if (!state.currentTranslation) return;

  const text = state.currentTranslation;
  const code = els.targetLang.value;
  const langName = LANGUAGES.find(l => l.code === code)?.name || code;

  stopSpeaking();
  const token = ++ttsToken;

  // 1. Installed voice on this device
  if ("speechSynthesis" in window) {
    await waitForVoices();
    if (token !== ttsToken) return;
    const voice = getBestSpeechVoice(code);
    if (voice) {
      speakWithBrowserVoice(text, voice, token);
      showToast("Speaking in " + voice.name + "…", "info");
      return;
    }
  }

  // 2. Online fallback
  const ok = await speakWithOnlineTts(text, code, token);
  if (token !== ttsToken) return;
  if (ok) {
    showToast("Speaking " + langName + " (online voice)…", "info");
  } else {
    showToast("No " + langName + " voice found. Install a " + langName + " voice in your system settings, or try Chrome/Edge.", "error");
  }
}

function downloadTranslation() {
  if (!state.currentTranslation) return;
  const langName = LANGUAGES.find(l => l.code === els.targetLang.value)?.name || els.targetLang.value;
  const content = `LinguaAI Translation\n${"=".repeat(40)}\nSource: ${els.sourceText.value}\n\nTranslation (${langName}):\n${state.currentTranslation}`;
  const blob = new Blob(["\uFEFF" + content], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "translation.txt";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  showToast("Downloaded translation.txt", "success");
}

async function shareTranslation() {
  if (!state.currentTranslation) return;
  const shareData = { title: "LinguaAI Translation", text: state.currentTranslation };
  if (navigator.share) {
    try { await navigator.share(shareData); } catch { /* user cancelled */ }
  } else {
    copyTranslation();
  }
}

function rateTranslation(val, btn) {
  document.querySelectorAll(".rate-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  showToast(
    val === "1" ? "Thanks for the positive rating!" : "We'll improve! Thanks for the feedback.",
    val === "1" ? "success" : "info"
  );
}

/* ══════════════════════════════════════════════════════════════
   VOICE INPUT
   ══════════════════════════════════════════════════════════════ */
function toggleVoiceInput() {
  if (state.isRecording || state.recognition) {
    requestStopVoice(false);
  } else {
    els.voiceOverlay.style.display = "flex";
    startVoiceInput();
  }
}

function startVoiceInput() {
  if (state.recognition) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast("Voice input isn't supported in this browser. Use Chrome or Edge.", "error");
    els.voiceOverlay.style.display = "none";
    document.querySelectorAll(".mode-tab")[0].click();
    return;
  }

  const rec = new SpeechRecognition();
  rec.continuous = true;
  rec.interimResults = true;
  rec.maxAlternatives = 1;
  rec.lang = getSpeechLocale(els.sourceLang.value === "auto" ? "en" : els.sourceLang.value);

  state.recognition = rec;
  state.voiceCaptured = false;
  state.voiceError = null;
  state.voiceSkipTranslate = false;
  els.voiceLabel.textContent = "Starting microphone…";

  rec.onstart = () => {
    state.isRecording = true;
    els.micBtn.classList.add("recording");
    els.voiceLabel.textContent = "Listening…";
  };

  rec.onresult = e => {
    let interim = "";
    let final = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) final += e.results[i][0].transcript;
      else interim += e.results[i][0].transcript;
    }
    if (final.trim()) {
      const cur = els.sourceText.value;
      els.sourceText.value = cur + (cur && !/\s$/.test(cur) ? " " : "") + final.trim() + " ";
      state.voiceCaptured = true;
      updateCharCount();
    }
    els.voiceInterim.textContent = interim;
  };

  rec.onerror = e => {
    if (e.error === "aborted") return;
    state.voiceError = e.error;
    const messages = {
      "no-speech": "No speech heard. Check your microphone and try again.",
      "audio-capture": "No microphone found.",
      "not-allowed": "Microphone is blocked. Click the lock icon in the address bar and allow the microphone.",
      "service-not-allowed": "Microphone is blocked. Click the lock icon in the address bar and allow the microphone.",
      "network": "Speech recognition needs an online speech service. Brave blocks it, so open the app in Chrome or Edge.",
      "language-not-supported": "Voice input isn't available for this language."
    };
    showToast(messages[e.error] || "Voice error: " + e.error, "error");
  };

  rec.onend = () => finishVoice();

  try {
    rec.start();
  } catch (err) {
    state.voiceError = "start-failed";
    showToast("Could not start the microphone.", "error");
    finishVoice();
  }
}

/* Ask the recogniser to stop; finishVoice() runs from onend once final text arrives */
function requestStopVoice(skipTranslate = false) {
  state.voiceSkipTranslate = skipTranslate;
  const rec = state.recognition;
  if (!rec) { finishVoice(); return; }
  els.voiceLabel.textContent = "Processing…";
  try { rec.stop(); } catch { finishVoice(); return; }
  setTimeout(() => { if (state.recognition === rec) finishVoice(); }, 2000); // safety net
}

function finishVoice() {
  const shouldTranslate = state.voiceCaptured && !state.voiceError && !state.voiceSkipTranslate;

  if (state.recognition) {
    const rec = state.recognition;
    state.recognition = null;
    rec.onstart = rec.onresult = rec.onerror = rec.onend = null;
  }

  state.isRecording = false;
  state.voiceCaptured = false;
  state.voiceError = null;
  state.voiceSkipTranslate = false;

  els.micBtn.classList.remove("recording");
  els.voiceOverlay.style.display = "none";
  els.voiceInterim.textContent = "";
  document.querySelectorAll(".mode-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".mode-tab")[0].classList.add("active");
  state.activeMode = "text";

  // Translate automatically after speaking
  if (shouldTranslate && els.sourceText.value.trim()) handleTranslate();
}

/* ══════════════════════════════════════════════════════════════
   FILE INPUT
   ══════════════════════════════════════════════════════════════ */
function handleFileInput(e) {
  const file = e.target.files[0];
  if (file) readFile(file);
  e.target.value = ""; // allow re-selecting the same file
}

function handleFileDrop(e) {
  e.preventDefault();
  els.fileDropZone.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (file) readFile(file);
}

function readFile(file) {
  if (!file.name.match(/\.(txt|md)$/i)) {
    showToast("Only .txt and .md files are supported.", "error");
    return;
  }
  if (file.size > 50000) {
    showToast("File too large. Max 50KB.", "error");
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    els.sourceText.value = e.target.result;
    updateCharCount();
    els.fileOverlay.style.display = "none";
    document.querySelectorAll(".mode-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".mode-tab")[0].classList.add("active");
    showToast(`File loaded: ${file.name}`, "success");
  };
  reader.readAsText(file);
}

/* ══════════════════════════════════════════════════════════════
   HISTORY
   ══════════════════════════════════════════════════════════════ */
function saveToHistory(item) {
  state.history.unshift(item);
  if (state.history.length > 100) state.history.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history));
  renderHistory();
}

function loadHistory() {
  try {
    state.history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    state.history = [];
  }
  renderHistory();
}

function renderHistory() {
  const query = els.historySearch.value.toLowerCase();
  const filter = els.historyFilterLang.value;

  const filtered = state.history.filter(item => {
    const matchQuery =
      !query ||
      item.original.toLowerCase().includes(query) ||
      item.translation.toLowerCase().includes(query);
    const matchFilter = !filter || item.targetCode === filter;
    return matchQuery && matchFilter;
  });

  if (filtered.length === 0) {
    els.historyList.innerHTML = `
      <div class="empty-history">
        <i class="fas fa-clock"></i>
        <p>${state.history.length === 0 ? "Your translation history will appear here." : "No results match your search."}</p>
      </div>`;
    return;
  }

  els.historyList.innerHTML = filtered.map(item => {
    const idx = state.history.indexOf(item);
    return `
    <div class="history-item">
      <div>
        <div class="history-text">${escapeHtml(truncate(item.original, 120))}</div>
        <div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.25rem;font-family:var(--font-mono)">${escapeHtml(item.sourceLang)}</div>
      </div>
      <div>
        <div class="history-translation">${escapeHtml(truncate(item.translation, 120))}</div>
        <div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.25rem;font-family:var(--font-mono)">${escapeHtml(item.targetLang)}</div>
      </div>
      <div class="history-actions">
        <div class="history-meta">${formatDate(item.timestamp)}<br/>${escapeHtml(item.tone || "neutral")}</div>
        <button class="history-btn" onclick="reuseHistory(${idx})"><i class="fas fa-redo"></i> Reuse</button>
        <button class="history-btn delete" onclick="deleteHistory(${idx})"><i class="fas fa-trash"></i></button>
      </div>
    </div>`;
  }).join("");
}

window.reuseHistory = function (idx) {
  const item = state.history[idx];
  if (!item) return;
  els.sourceText.value = item.original;
  updateCharCount();
  if (item.targetCode) els.targetLang.value = item.targetCode;
  document.querySelector("#translator").scrollIntoView({ behavior: "smooth" });
  showToast("Translation loaded into editor.", "info");
};

window.deleteHistory = function (idx) {
  state.history.splice(idx, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history));
  renderHistory();
  showToast("Entry deleted.", "info");
};

function clearHistory() {
  if (state.history.length === 0) { showToast("History is already empty.", "info"); return; }
  if (!confirm("Clear all translation history?")) return;
  state.history = [];
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
  showToast("History cleared.", "success");
}

function exportHistoryCSV() {
  if (state.history.length === 0) { showToast("Nothing to export.", "error"); return; }
  const header = "Date,Source Language,Target Language,Original,Translation,Tone";
  const rows = state.history.map(item =>
    [
      csvEscape(formatDate(item.timestamp)),
      csvEscape(item.sourceLang),
      csvEscape(item.targetLang),
      csvEscape(item.original),
      csvEscape(item.translation),
      csvEscape(item.tone || "neutral")
    ].join(",")
  );
  const csv = [header, ...rows].join("\n");
  // BOM so Excel reads Hindi/Punjabi etc. as UTF-8
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "linguaai_history.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  showToast("History exported as CSV!", "success");
}

/* ══════════════════════════════════════════════════════════════
   ANIMATIONS
   ══════════════════════════════════════════════════════════════ */
function animateCounters() {
  document.querySelectorAll(".stat-num").forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    if (isNaN(target)) return;
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      counter.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 20);
  });
}

function observeFeatureCards() {
  const cards = document.querySelectorAll(".feature-card");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0, 10);
        setTimeout(() => entry.target.classList.add("visible"), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(card => observer.observe(card));
}

function initBackgroundParticles() {
  const canvas = $("bgCanvas");
  if (!canvas) return;

  for (let n = 0; n < 30; n++) {
    const d = document.createElement("div");
    d.style.cssText = `
      position:absolute;
      width:${2 + Math.random() * 3}px;
      height:${2 + Math.random() * 3}px;
      background:rgba(124,58,237,${0.1 + Math.random() * 0.2});
      border-radius:50%;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      animation: floatDot ${6 + Math.random() * 8}s ease-in-out ${Math.random() * 5}s infinite alternate;
    `;
    canvas.appendChild(d);
  }

  const style = document.createElement("style");
  style.textContent = `
    @keyframes floatDot {
      from { transform: translate(0, 0); opacity: 0.3; }
      to   { transform: translate(${Math.random() > 0.5 ? "" : "-"}${20 + Math.random() * 40}px, ${Math.random() > 0.5 ? "" : "-"}${20 + Math.random() * 40}px); opacity: 0.8; }
    }
  `;
  document.head.appendChild(style);
}

/* ══════════════════════════════════════════════════════════════
   TOAST NOTIFICATIONS
   ══════════════════════════════════════════════════════════════ */
const iconMap = {
  success: "fa-check-circle",
  error: "fa-exclamation-circle",
  info: "fa-info-circle"
};

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${iconMap[type] || iconMap.info}"></i> ${escapeHtml(message)}`;
  els.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("exit");
    toast.addEventListener("animationend", () => toast.remove());
    setTimeout(() => toast.remove(), 600); // fallback if no animation fires
  }, 3500);
}

/* ══════════════════════════════════════════════════════════════
   UTILITIES
   ══════════════════════════════════════════════════════════════ */
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + "…" : str;
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

function csvEscape(str) {
  return `"${String(str).replace(/"/g, '""')}"`;
}

/* ══════════════════════════════════════════════════════════════
   KEYBOARD SHORTCUTS
   ══════════════════════════════════════════════════════════════ */
document.addEventListener("keydown", e => {
  // Ctrl/Cmd + Shift + T: focus translator
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "t") {
    e.preventDefault();
    els.sourceText.focus();
  }
  // Escape: close overlays
  if (e.key === "Escape") {
    els.voiceOverlay.style.display = "none";
    els.fileOverlay.style.display = "none";
    if (state.isRecording || state.recognition) requestStopVoice(true);
    stopSpeaking();
  }
});

/* ══════════════════════════════════════════════════════════════
   START
   ══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", init);