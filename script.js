/* ══════════════════════════════════════════════════════════════
   LinguaAI v2 — script.js
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
const HISTORY_KEY = "linguaai_v2_history";
const THEME_KEY = "linguaai_v2_theme";

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

/* ── STATE ────────────────────────────────────────────────────── */
const S = {
  theme: localStorage.getItem(THEME_KEY) || "dark",
  history: [],
  isTranslating: false,
  isRecording: false,
  recognition: null,
  currentTranslation: "",
  activeMode: "text",
  activeExtrasTab: "alternatives",
  lastParsed: null,
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
  [45, "Connecting to Claude API…"],
  [70, "Preparing 3D environment…"],
  [90, "Almost ready…"],
  [100, "Welcome to LinguaAI!"],
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
  els.themeIcon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
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
  els.themeToggle.addEventListener("click", () => applyTheme(S.theme === "dark" ? "light" : "dark"));

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
  els.downloadBtn.addEventListener("click", downloadTranslation);
  els.shareBtn.addEventListener("click", shareTranslation);

  // Rating
  document.querySelectorAll(".rate-btn").forEach(b => b.addEventListener("click", () => rateTranslation(b.dataset.val, b)));

  // Mode tabs
  document.querySelectorAll(".mode-tab").forEach(t => t.addEventListener("click", () => switchMode(t.dataset.mode, t)));

  // Extras tabs
  document.querySelectorAll(".extras-tab").forEach(t => t.addEventListener("click", () => switchExtrasTab(t.dataset.tab, t)));

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

  // Compare mode — runs 3 API calls in parallel
  if (isCompare) {
    await runCompareMode(text, srcLang, tgtLang, tgtCode, tone);
    return;
  }

  const outputEl = createOutputEl();

  try {
    const prompt = buildPrompt(text, srcLang, tgtLang, tone);
    const data = await callAPI(prompt);
    const full = data.content?.[0]?.text || "";
    let parsed;
    try { const m = full.match(/\{[\s\S]*\}/); parsed = m ? JSON.parse(m[0]) : null; } catch { parsed = null; }

    if (parsed?.translation) {
      await streamText(outputEl, parsed.translation);
      S.currentTranslation = parsed.translation;
      S.lastParsed = parsed;

      if (parsed.detected_language && srcCode === "auto") {
        els.detectedLang.textContent = `Detected: ${parsed.detected_language}`;
      } else {
        els.detectedLang.textContent = "";
      }

      const wc = parsed.translation.split(/\s+/).length;
      els.outputMeta.textContent = `${wc} word${wc !== 1 ? "s" : ""} · ${tone} · ${tgtLang}`;
      els.ratingWrap.style.display = "flex";
      enableOutputBtns(true);

      if (parsed.alternatives || parsed.word_breakdown || parsed.pronunciation || parsed.cultural_context || parsed.grammar_notes) {
        els.extrasPanel.style.display = "block";
        renderExtras(parsed, S.activeExtrasTab);
      }

      saveHistory({ original: text, translation: parsed.translation, sourceLang: srcLang, targetLang: tgtLang, targetCode: tgtCode, tone, timestamp: Date.now() });
      toast("Translation complete!", "success");
    } else {
      await streamText(outputEl, full);
      S.currentTranslation = full;
      enableOutputBtns(true);
    }
  } catch (err) {
    outputEl.innerHTML = `<span style="color:#ef4444">⚠ ${err.message}</span>`;
    toast(err.message.includes("API key") ? "Invalid API key. Update script.js." : `Error: ${err.message}`, "error");
  } finally {
    S.isTranslating = false;
    setLoadingUI(false);
  }
}

/* Compare Mode */
async function runCompareMode(text, srcLang, tgtLang, tgtCode, baseTone) {
  const tones = ["formal", "casual", "neutral"];
  els.compareGrid.innerHTML = tones.map(t => `
    <div class="compare-card" id="cc-${t}">
      <div class="compare-card-label">${t}</div>
      <div class="compare-card-text" style="color:var(--text-muted)"><i class="fas fa-spinner fa-spin"></i> Translating…</div>
    </div>`).join("");

  const promises = tones.map(tone =>
    callAPI(buildPrompt(text, srcLang, tgtLang, tone))
      .then(d => {
        const full = d.content?.[0]?.text || "";
        try { const m = full.match(/\{[\s\S]*\}/); return m ? JSON.parse(m[0]).translation || full : full; } catch { return full; }
      })
      .catch(() => "Translation error")
  );

  const results = await Promise.allSettled(promises);
  results.forEach((r, i) => {
    const el = $(`cc-${tones[i]}`).querySelector(".compare-card-text");
    el.style.color = "";
    el.textContent = r.status === "fulfilled" ? r.value : "Error";
  });

  document.querySelectorAll(".compare-card").forEach(card => {
    card.addEventListener("click", () => {
      const text = card.querySelector(".compare-card-text").textContent;
      S.currentTranslation = text;
      els.sourceText.dispatchEvent(new Event("input")); // recount chars
      toast("Variation selected! Switch to Text mode to see it.", "info");
    });
  });

  S.isTranslating = false;
  setLoadingUI(false);
  toast("Comparison complete!", "success");
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

/* ── FREE MODE (no API key needed) ───────────────────────────────
   If API_KEY is empty, translation uses the free MyMemory API.
   It returns data in the same shape as Claude, so the rest of the
   app works unchanged. (Alternatives / grammar notes need Claude.)  */
const USE_FREE_API = !API_KEY;
const FREE_CACHE = new Map();
const MM_CODE = { zh: "zh-CN", zt: "zh-TW" };

function langToCode(name) {
  const l = LANGUAGES.find(x => x.name === name);
  return l ? (MM_CODE[l.code] || l.code) : "en";
}

function splitChunks(text, max = 450) {
  const parts = text.split(/(?<=[.!?।。\n])\s*/).filter(Boolean);
  const chunks = []; let cur = "";
  for (let p of parts) {
    while (p.length > max) { chunks.push(p.slice(0, max)); p = p.slice(max); }
    if ((cur + p).length > max) { chunks.push(cur); cur = p; } else cur += p;
  }
  if (cur) chunks.push(cur);
  return chunks;
}

async function freeTranslate(prompt) {
  const src = (prompt.match(/Source language: (.+)/) || [])[1]?.trim();
  const tgt = (prompt.match(/Target language: (.+)/) || [])[1]?.trim();
  const text = (prompt.match(/"""\n([\s\S]*?)\n"""/) || [])[1] || "";
  const from = src === "auto-detect" ? "Autodetect" : langToCode(src);
  const to = langToCode(tgt);

  const key = `${from}|${to}|${text}`;
  if (FREE_CACHE.has(key)) return FREE_CACHE.get(key);

  let out = [], detected = null;
  for (const chunk of splitChunks(text)) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${from}|${to}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Translation service error (HTTP ${res.status})`);
    const j = await res.json();
    if (j.responseStatus && Number(j.responseStatus) !== 200) throw new Error(j.responseDetails || "Translation failed");
    out.push(j.responseData.translatedText);
    if (j.responseData.detectedLanguage) detected = j.responseData.detectedLanguage;
  }
  const detName = detected && LANGUAGES.find(l => l.code === detected.split("-")[0])?.name;
  const result = { content: [{ text: JSON.stringify({
    translation: out.join(" "),
    detected_language: detName || detected || null
  }) }] };
  FREE_CACHE.set(key, result);
  return result;
}

async function callAPI(prompt) {
  if (USE_FREE_API) return freeTranslate(prompt);
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

function createOutputEl() {
  els.outputArea.innerHTML = '<div class="output-text"></div>';
  return els.outputArea.querySelector(".output-text");
}

function resetOutput() {
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

function renderExtras(parsed, tab) {
  let html = "";
  if (tab === "alternatives") {
    const alts = parsed.alternatives || [];
    html = alts.length
      ? alts.map((a, i) => `<div class="alt-item" onclick="window.useAlt('${esc(a)}')"><span class="alt-num">${i + 1}.</span><span>${esc(a)}</span></div>`).join("")
      : "<p>No alternatives available.</p>";
  } else if (tab === "breakdown") {
    const wb = parsed.word_breakdown || [];
    html = wb.length
      ? `<div class="word-row" style="font-size:.72rem;font-weight:700;color:var(--text-muted)"><span>ORIGINAL</span><span>TRANSLATED</span><span>POS</span></div>`
      + wb.map(w => `<div class="word-row"><span class="word-original">${esc(w.original)}</span><span class="word-translated">${esc(w.translated)}</span><span class="word-pos">${esc(w.pos || "—")}</span></div>`).join("")
      : "<p>Word breakdown not available.</p>";
  } else if (tab === "pronunciation") {
    html = parsed.pronunciation
      ? `<div style="font-family:var(--font-mono);font-size:.98rem;background:var(--bg-input);padding:1rem 1.2rem;border-radius:var(--radius-sm);border:1px solid var(--border)"><small style="color:var(--text-muted);font-size:.7rem;display:block;margin-bottom:.4rem">PHONETIC GUIDE</small>${esc(parsed.pronunciation)}</div>`
      : "<p>No pronunciation guide for this language pair.</p>";
  } else if (tab === "context") {
    html = parsed.cultural_context
      ? `<div style="padding:1rem 1.2rem;background:rgba(124,58,237,.06);border-left:3px solid var(--accent-purple);border-radius:var(--radius-sm)"><small style="color:var(--accent-purple);font-size:.7rem;display:block;margin-bottom:.35rem;font-family:var(--font-mono)">CULTURAL NOTE</small>${esc(parsed.cultural_context)}</div>`
      : "<p>No cultural context for this translation.</p>";
  } else if (tab === "grammar") {
    html = parsed.grammar_notes
      ? `<div style="padding:1rem 1.2rem;background:rgba(6,182,212,.06);border-left:3px solid var(--accent-cyan);border-radius:var(--radius-sm)"><small style="color:var(--accent-cyan);font-size:.7rem;display:block;margin-bottom:.35rem;font-family:var(--font-mono)">GRAMMAR NOTES</small>${esc(parsed.grammar_notes)}</div>`
      : "<p>No grammar notes for this translation.</p>";
  }
  els.extrasContent.innerHTML = html;
}

window.useAlt = function (text) {
  const el = els.outputArea.querySelector(".output-text");
  if (el) el.textContent = text;
  S.currentTranslation = text;
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
  try { const t = await navigator.clipboard.readText(); els.sourceText.value = t; updateCharCount(); toast("Pasted!", "success"); }
  catch { toast("Clipboard access denied.", "error"); }
}

function clearSource() {
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

function speakTranslation() {
  if (!S.currentTranslation) return;
  if (!("speechSynthesis" in window)) { toast("TTS not supported.", "error"); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(S.currentTranslation);
  const map = { es: "es-ES", fr: "fr-FR", de: "de-DE", it: "it-IT", pt: "pt-BR", ru: "ru-RU", ja: "ja-JP", zh: "zh-CN", ko: "ko-KR", ar: "ar-SA", hi: "hi-IN", ur: "ur-PK", pa: "pa-IN", tr: "tr-TR", nl: "nl-NL", pl: "pl-PL", sv: "sv-SE" };
  u.lang = map[els.targetLang.value] || "en-US";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
  toast("Speaking…", "info");
}

function downloadTranslation() {
  if (!S.currentTranslation) return;
  const content = `LinguaAI Translation\n${"─".repeat(40)}\nSource (${els.sourceLang.value}):\n${els.sourceText.value}\n\nTranslation (${LANGUAGES.find(l => l.code === els.targetLang.value)?.name || els.targetLang.value}):\n${S.currentTranslation}`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
  a.download = "linguaai_translation.txt"; a.click();
  toast("Downloaded!", "success");
}

async function shareTranslation() {
  if (!S.currentTranslation) return;
  if (navigator.share) { try { await navigator.share({ title: "LinguaAI Translation", text: S.currentTranslation }); } catch { } }
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
  if (!SR) { toast("Voice not supported in this browser.", "error"); els.voiceOverlay.style.display = "none"; resetModeToText(); return; }
  S.recognition = new SR();
  S.recognition.continuous = true;
  S.recognition.interimResults = true;
  S.recognition.lang = els.sourceLang.value !== "auto" ? els.sourceLang.value + "-" + els.sourceLang.value.toUpperCase() : "en-US";
  S.recognition.onstart = () => { S.isRecording = true; els.micBtn.classList.add("recording"); els.voiceLabel.textContent = "Listening…"; };
  S.recognition.onresult = e => {
    let interim = "", final = "";
    for (let i = e.resultIndex; i < e.results.length; i++) { (e.results[i].isFinal ? (final += e.results[i][0].transcript) : (interim += e.results[i][0].transcript)); }
    if (final) { els.sourceText.value += final + " "; updateCharCount(); }
    els.voiceInterim.textContent = interim;
  };
  S.recognition.onerror = () => stopVoice();
  S.recognition.onend = () => stopVoice();
  S.recognition.start();
}

function stopVoice() {
  if (S.recognition) { S.recognition.stop(); S.recognition = null; }
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
    els.sourceText.value = e.target.result;
    updateCharCount();
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
  try { S.history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { S.history = []; }
  renderHistory();
}

function renderHistory() {
  const q = els.historySearch.value.toLowerCase();
  const lf = els.historyFilterLang.value;
  const items = S.history.filter(h =>
    (!q || h.original.toLowerCase().includes(q) || h.translation.toLowerCase().includes(q)) &&
    (!lf || h.targetCode === lf)
  );
  if (!items.length) {
    els.historyList.innerHTML = `<div class="empty-state"><i class="fas fa-clock"></i><p>${S.history.length ? "No results." : "Translation history will appear here."}</p></div>`;
    return;
  }
  els.historyList.innerHTML = items.map(item => `
    <div class="history-item">
      <div><div class="history-text">${esc(trunc(item.original, 110))}</div><div style="font-size:.7rem;color:var(--text-muted);font-family:var(--font-mono);margin-top:.2rem">${item.sourceLang}</div></div>
      <div><div class="history-translation">${esc(trunc(item.translation, 110))}</div><div style="font-size:.7rem;color:var(--text-muted);font-family:var(--font-mono);margin-top:.2rem">${item.targetLang}</div></div>
      <div class="history-actions">
        <div class="history-meta">${fmtDate(item.timestamp)}<br/>${item.tone || "neutral"}</div>
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
  dlFile(csv, "linguaai_history.csv", "text/csv");
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
