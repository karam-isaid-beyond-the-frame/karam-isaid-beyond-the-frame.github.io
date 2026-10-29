/* V6 layer — added on top of the existing CMS-driven site, never replacing it.
   - Liquid moving background behind the hero + soft light that follows the mouse (Admin → Appearance → Effects)
   - Visitor colour themes (Admin → Appearance → Visitor colour switcher), stored only in the visitor's browser
   - Brief → Result: visitors pick a need, the page answers with matching published projects + services
   - Scroll story "Idea to Frame" and the Adams Clay 3D carafe (both editable in Admin → Website sections)
   - Reels feed: ambient backdrop, side info, wheel-to-flip, muted auto-play on screen (Admin → Video Reels → Playback)
   All copy is editable per language in the Admin; nothing here invents projects, clients or numbers. */
(() => {
  'use strict';
  const page = window.PORTFOLIO ? 'portfolio' : 'website';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const core = () => window.KARAM_CMS_CORE;
  const lang = () => (document.documentElement.lang === 'ar' ? 'ar' : 'en');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const asset = (p) => core()?.url(p) || p;
  const row = (key) => window.KARAM_CMS_SECTIONS?.find((s) => s.section_key === key);
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const data = () => window.KARAM_CMS_DATA || {};
  const playable = (u) => !!u && /\.(mp4|webm|m4v|ogv)(?:[?#]|$)/i.test(u);
  const pick = (o, l) => (o && (o[l] || o.en)) || '';
  const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const rgbVar = (n, fb) => { const v = cssVar(n).split(',').map(Number); return v.length === 3 && v.every((x) => Number.isFinite(x)) ? v : fb; };
  const portfolioHref = (slug) => new URL('portfolio/index.html' + (slug ? '#project=' + encodeURIComponent(slug) : ''), core()?.rootURL || location.href).href;
  const text = (key, T) => { const l = lang(), c = row(key)?.content?.[l] || {}; return (k) => c[k] || T[l][k] || T.en[k] || ''; };

  /* ---------------- appearance (effects + visitor palettes) ---------------- */
  const VISITOR_DEFAULT = [
    { id: 'karam-signature', name: { en: 'Karam signature', ar: 'توقيع كرم' }, colors: { background: '#101012', surface: '#19191D', text: '#F4EEE6', accent: '#8B2945' } },
    { id: 'cinematic-burgundy', name: { en: 'Cinematic rose', ar: 'وردي سينمائي' }, colors: { background: '#090A10', surface: '#12131C', text: '#F5F3F5', accent: '#E13A61' } },
    { id: 'adams-clay', name: { en: 'Adams Clay', ar: 'آدمز كلاي' }, colors: { background: '#17110E', surface: '#241A15', text: '#F4EEE6', accent: '#C47A4E' } },
    { id: 'midnight-blue', name: { en: 'Midnight blue', ar: 'أزرق ليلي' }, colors: { background: '#0A0F1A', surface: '#131B2C', text: '#EEF2F8', accent: '#4A8FD0' } },
    { id: 'ivory-burgundy', name: { en: 'Ivory burgundy', ar: 'عاجي برغندي' }, colors: { background: '#FAF7F2', surface: '#FFFFFF', text: '#2C1C23', accent: '#78263E' } }
  ];
  const appearance = () => row('appearance')?.content || {};
  const effects = () => ({ liquid: true, glow: true, ...(appearance().effects || {}) });
  const visitorCfg = () => {
    const v = appearance().visitor || {};
    const palettes = Array.isArray(v.palettes) ? v.palettes.filter((p) => p && p.colors) : VISITOR_DEFAULT;
    return { enabled: v.enabled !== false, palettes };
  };

  /* ---------------- 1. visitor colour switcher ---------------- */
  const PAL_T = { en: { label: 'Colour theme', title: 'Choose colours', def: 'Original', note: 'Saved on this device only.' }, ar: { label: 'ألوان الموقع', title: 'اختر الألوان', def: 'الأصلي', note: 'يُحفظ على جهازك فقط.' } };
  let palBtn, palPop;
  function swatches(c) { return ['background', 'surface', 'text', 'accent'].map((k) => `<i style="background:${esc(c[k])}"></i>`).join(''); }
  function buildPalette() {
    const anchor = $('#langSwitch');
    if (!anchor || palBtn) return;
    palBtn = document.createElement('button');
    palBtn.type = 'button'; palBtn.className = 'v6-pal-btn'; palBtn.setAttribute('aria-haspopup', 'dialog'); palBtn.setAttribute('aria-expanded', 'false');
    palBtn.innerHTML = '<span class="v6-pal-dots" aria-hidden="true"><i></i><i></i><i></i></span>';
    palPop = document.createElement('div');
    palPop.className = 'v6-pal-pop'; palPop.hidden = true; palPop.setAttribute('role', 'dialog');
    anchor.parentNode.insertBefore(palBtn, anchor);
    document.body.append(palPop);
    const close = () => { palPop.hidden = true; palBtn.setAttribute('aria-expanded', 'false'); };
    palBtn.addEventListener('click', () => {
      const open = palPop.hidden; renderPalette(); palPop.hidden = !open; palBtn.setAttribute('aria-expanded', String(open));
      if (open) { const r = palBtn.getBoundingClientRect(); palPop.style.top = Math.round(r.bottom + 10) + 'px'; const rtl = document.documentElement.dir === 'rtl'; palPop.style.left = rtl ? Math.max(12, Math.round(r.left)) + 'px' : ''; palPop.style.right = rtl ? '' : Math.max(12, Math.round(innerWidth - r.right)) + 'px'; palPop.querySelector('button')?.focus(); }
    });
    document.addEventListener('click', (e) => { if (!palPop.hidden && !palPop.contains(e.target) && !palBtn.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !palPop.hidden) { close(); palBtn.focus(); } });
    palPop.addEventListener('click', (e) => {
      const b = e.target.closest('[data-pal]'); if (!b) return;
      const id = b.dataset.pal; const p = visitorCfg().palettes.find((x) => x.id === id);
      window.KARAM_SET_VISITOR_THEME?.(id === '__owner' ? null : p ? { id: p.id, colors: p.colors } : null);
      renderPalette(); close(); palBtn.focus();
    });
  }
  function renderPalette() {
    if (!palBtn) return;
    const cfg = visitorCfg(), l = lang(), t = PAL_T[l];
    palBtn.hidden = !cfg.enabled; palBtn.setAttribute('aria-label', t.label); palBtn.title = t.label;
    if (!cfg.enabled) { palPop.hidden = true; if (window.KARAM_VISITOR_THEME_ID?.()) window.KARAM_SET_VISITOR_THEME?.(null); return; }
    const current = window.KARAM_VISITOR_THEME_ID?.() || '__owner';
    const owner = appearance().colors || window.KARAM_THEME_CONFIG?.colors || VISITOR_DEFAULT[0].colors;
    const items = [{ id: '__owner', name: { en: t.def, ar: t.def }, colors: owner }, ...cfg.palettes];
    palPop.setAttribute('aria-label', t.title);
    palPop.innerHTML = `<p class="v6-pal-title">${esc(t.title)}</p><div class="v6-pal-list">${items.map((p) => `<button type="button" data-pal="${esc(p.id)}" aria-pressed="${p.id === current}"><span class="v6-pal-sw">${swatches(p.colors)}</span><span>${esc(pick(p.name, l))}</span></button>`).join('')}</div><p class="v6-pal-note">${esc(t.note)}</p>`;
  }

  /* ---------------- 2. soft light that follows the mouse ---------------- */
  let glowEl = null, gx = innerWidth * 0.7, gy = innerHeight * 0.4, glowRaf = 0;
  function setupGlow() {
    const on = effects().glow && finePointer;
    if (!on) { glowEl?.remove(); glowEl = null; return; }
    if (glowEl) return;
    glowEl = document.createElement('div'); glowEl.className = 'v6-glow'; glowEl.setAttribute('aria-hidden', 'true');
    document.body.append(glowEl);
    const paint = () => { glowRaf = 0; if (glowEl) glowEl.style.background = `radial-gradient(520px circle at ${gx}px ${gy}px, rgba(var(--v6-hot-rgb,237,62,107),.16), rgba(var(--v6-accent-rgb,139,41,69),.08) 42%, transparent 66%)`; };
    addEventListener('pointermove', (e) => { gx = e.clientX; gy = e.clientY; if (!glowRaf) glowRaf = requestAnimationFrame(paint); }, { passive: true });
    paint();
  }

  /* ---------------- 3. liquid background behind the hero ---------------- */
  let liquid = null;
  function setupLiquid() {
    const hero = $('main section.hero');
    const on = effects().liquid && hero;
    document.documentElement.classList.toggle('v6-liquid-on', !!on);
    if (!on) { if (liquid) { cancelAnimationFrame(liquid.raf); liquid.wrap.remove(); liquid = null; } return; }
    if (liquid) return;
    const wrap = document.createElement('div'); wrap.className = 'v6-liquid'; wrap.setAttribute('aria-hidden', 'true');
    const cv = document.createElement('canvas'); wrap.append(cv); document.body.prepend(wrap);
    const ctx = cv.getContext('2d');
    liquid = { wrap, cv, raf: 0, visible: true, last: 0, mx: 0.72, my: 0.45 };
    const size = () => {
      const r = hero.getBoundingClientRect(), bottom = Math.round(r.bottom + scrollY);
      wrap.style.height = bottom + 'px';
      const w = innerWidth < 700 ? 110 : 170; cv.width = w; cv.height = Math.max(60, Math.min(240, Math.round(w * bottom / Math.max(1, innerWidth))));
      liquid.img = ctx.createImageData(cv.width, cv.height);
    };
    size();
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(hero);
    addEventListener('resize', size);
    if ('IntersectionObserver' in window) new IntersectionObserver((e) => { liquid && (liquid.visible = e[0].isIntersecting); }, { threshold: 0 }).observe(hero);
    addEventListener('pointermove', (e) => { if (!liquid) return; liquid.mx = e.clientX / innerWidth; liquid.my = (e.clientY + scrollY) / Math.max(1, parseFloat(wrap.style.height) || 1); }, { passive: true });
    const hash = (x, y) => { let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
    const noise = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; };
    const fbm = (x, y) => { let s = 0, amp = 0.5; for (let o = 0; o < 4; o++) { s += amp * noise(x, y); const nx = x * 1.6 - y * 1.2; y = x * 1.2 + y * 1.6; x = nx; amp *= 0.5; } return s; };
    const rtlSide = () => document.documentElement.dir === 'rtl';
    const frame = (ts) => {
      const W = cv.width, H = cv.height, d = liquid.img.data, t = ts * 0.00006;
      const bg = rgbVar('--v6-bg-rgb', [16, 16, 18]), ac = rgbVar('--v6-accent-rgb', [139, 41, 69]), hot = rgbVar('--v6-hot-rgb', [237, 62, 107]);
      const rtl = rtlSide(), mx = liquid.mx, my = liquid.my, aspect = H / W;
      for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) {
        const x = px / W, y = py / H, X = x * 3.2, Y = y * 3.2 * aspect;
        const qx = fbm(X + t * 1.4, Y - t * 0.6), qy = fbm(X + 5.2 - t * 0.9, Y + 1.3 + t * 0.5);
        const r = fbm(X + 3.2 * qx + 1.7 + t * 0.7, Y + 3.2 * qy + 9.2 - t * 0.4);
        const dx = x - mx, dy = (y - my) * aspect, near = Math.exp(-(dx * dx + dy * dy) * 20);
        const sx = rtl ? 1 - x : x, side = clamp((sx - 0.18) / 0.6);
        const v = clamp((r - 0.32) * 2.1) * (0.25 + 0.75 * side) + near * 0.24, w = clamp((r - 0.58) * 3.2) * side + near * 0.1;
        const o = (py * W + px) * 4;
        for (let k = 0; k < 3; k++) d[o + k] = bg[k] + (ac[k] - bg[k]) * Math.min(1, v * 0.95) + (hot[k] - bg[k]) * w * 0.32;
        d[o + 3] = 255;
      }
      ctx.putImageData(liquid.img, 0, 0);
    };
    const loop = (ts) => {
      if (!liquid) return;
      if (liquid.visible && !document.hidden && ts - liquid.last > 45) { liquid.last = ts; frame(ts); }
      if (!reduce) liquid.raf = requestAnimationFrame(loop);
    };
    frame(20000); if (!reduce) liquid.raf = requestAnimationFrame(loop);
    addEventListener('karam:theme', () => liquid && frame(performance.now()));
  }

  /* ---------------- 4. Brief → Result ---------------- */
  const BRIEF_T = {
    en: { briefKicker: 'BRIEF → RESULT', briefTitle: 'What are we', briefTitleEm: 'making?', briefIntro: 'Pick a need. The page answers with my real projects and the service to start with.', briefPrompt: 'I need', need1: 'an ad campaign', need1Keys: 'marketing, campaign, ads, social, content, brand', need2: 'reels for my brand', need2Keys: 'video, reel, film, motion', need3: 'an AI visual identity', need3Keys: 'design, visual, ai, identity, product', need4: 'to be found on Google', need4Keys: 'seo, search, google, web', stepRead: 'Reading your brief', stepMatch: 'Matching it with my projects', stepChoose: 'Choosing where to start', startHere: 'START HERE', closestWork: 'CLOSEST WORK', bestMatch: 'BEST MATCH', sendBrief: 'Send me this brief →', startOver: 'Start over', waiting: 'Waiting for your brief…', send: 'Send this brief', open: 'Open the project ↗', tools: 'Tools' },
    ar: { briefKicker: 'من الفكرة إلى النتيجة', briefTitle: 'شو رح', briefTitleEm: 'نعمل؟', briefIntro: 'اختر احتياجك، والصفحة بتجاوبك بأعمالي الحقيقية والخدمة اللي نبدأ فيها.', briefPrompt: 'بدي', need1: 'حملة إعلانية', need2: 'ريلز لبراندي', need3: 'هوية بصرية بالـ AI', need4: 'أظهر على جوجل', stepRead: 'عم بقرأ طلبك', stepMatch: 'عم بطابقه مع مشاريعي', stepChoose: 'عم بختار من وين نبدأ', startHere: 'ابدأ من هون', closestWork: 'أقرب شغل', bestMatch: 'الأنسب لطلبك', sendBrief: 'ابعتلي هالطلب ←', startOver: 'ابدأ من جديد', waiting: 'بانتظار طلبك…', send: 'إرسال الطلب', open: 'افتح المشروع ↖', tools: 'الأدوات' }
  };
  const toolsFor = (svc) => {
    const tl = window.KARAM_SITE?.tools || {}, s = ((svc?.title_en || '') + ' ' + (svc?.description_en || '')).toLowerCase();
    const vg = ['Runway', 'Kling', 'Veo', 'Omni 1.1'];
    if (/video|motion|reel|edit/.test(s)) return [...(tl.video || []), ...(tl.ai || []).filter((n) => vg.includes(n))];
    if (/visual|design|image|ai\b/.test(s)) return [...(tl.design || []), ...(tl.ai || []).filter((n) => !vg.includes(n))];
    return tl.marketing || [];
  };
  let briefState = { phase: 'idle', need: 0, ti: 0, tc: 0, timers: [], typer: 0 }, briefSig = '';
  function renderBrief() {
    const host = $('[data-v6-brief]'); if (!host) return;
    const t = text('brief-result', BRIEF_T), l = lang();
    const sig = l + JSON.stringify(row('brief-result')?.content || {}) + (data().projects || []).length + (data().services || []).length;
    if (sig === briefSig) return; briefSig = sig;
    const needs = [1, 2, 3, 4].map((i) => ({ label: t('need' + i), keys: (row('brief-result')?.content?.en?.['need' + i + 'Keys'] || BRIEF_T.en['need' + i + 'Keys']).toLowerCase().split(/[,،]/).map((s) => s.trim()).filter(Boolean) })).filter((n) => n.label);
    briefState.needs = needs;
    host.innerHTML = `
      <div class="v6-head"><div><p class="v6-kicker">${esc(t('briefKicker'))}</p><h2 id="v6BriefTitle" class="v6-h2">${esc(t('briefTitle'))} <em>${esc(t('briefTitleEm'))}</em></h2></div><p class="v6-lead">${esc(t('briefIntro'))}</p></div>
      <div class="v6-glass v6-prompt"><span class="v6-prompt-text">${esc(t('briefPrompt'))} <span class="v6-typed" data-typed></span><span class="v6-caret" aria-hidden="true"></span></span>
        <button type="button" class="v6-chip v6-reset" data-brief-reset hidden>${esc(t('startOver'))}</button>
        <button type="button" class="v6-send" data-brief-send aria-label="${esc(t('send'))}"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
      <div class="v6-chips" role="group" aria-label="${esc(t('briefPrompt'))}">${needs.map((n, i) => `<button type="button" class="v6-chip" data-need="${i}" aria-pressed="false">${esc(n.label)}</button>`).join('')}</div>
      <div class="v6-brief-out" aria-live="polite" data-brief-out></div>`;
    host.querySelectorAll('[data-need]').forEach((b) => b.addEventListener('click', () => briefGo(+b.dataset.need)));
    host.querySelector('[data-brief-send]').addEventListener('click', () => briefGo(briefState.phase === 'idle' ? briefState.ti % needs.length : briefState.need));
    host.querySelector('[data-brief-reset]').addEventListener('click', briefReset);
    briefState.phase === 'result' ? briefResult() : briefIdle();
    if (!briefState.typer && !reduce) briefState.typer = setInterval(briefType, 70);
    briefType(true);
  }
  function briefType(force) {
    const host = $('[data-v6-brief]'), el = host?.querySelector('[data-typed]'); if (!el) return;
    const needs = briefState.needs || [];
    if (briefState.phase !== 'idle') { el.textContent = needs[briefState.need]?.label || ''; return; }
    if (reduce) { el.textContent = needs[0]?.label || ''; return; }
    const s = needs[briefState.ti % Math.max(1, needs.length)]?.label || '';
    if (!force) { briefState.tc++; if (briefState.tc > s.length + 24) { briefState.tc = 0; briefState.ti++; } }
    el.textContent = s.slice(0, Math.min(briefState.tc, s.length));
  }
  function briefIdle() {
    const out = $('[data-brief-out]'); if (!out) return;
    const t = text('brief-result', BRIEF_T), l = lang();
    const ps = (data().projects || []).slice(0, 3);
    out.innerHTML = ps.length ? `<div class="v6-wait">${ps.map((p) => `<div class="v6-glass v6-wait-card">${p.cover ? `<img src="${esc(p.cover)}" alt="" loading="lazy">` : ''}<span><b>${esc(pick(p.title, l))}</b><small>${esc(t('waiting'))}</small></span></div>`).join('')}</div>` : '';
  }
  function briefGo(i) {
    const host = $('[data-v6-brief]'); if (!host) return;
    const t = text('brief-result', BRIEF_T);
    briefState.timers.forEach(clearTimeout); briefState.need = i; briefState.phase = 'thinking';
    host.querySelectorAll('[data-need]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.need === i)));
    host.querySelector('[data-brief-reset]').hidden = true; briefType(true);
    const out = $('[data-brief-out]');
    const steps = ['stepRead', 'stepMatch', 'stepChoose'].map((k) => t(k));
    out.innerHTML = `<div class="v6-glass v6-think"><span class="v6-avatar" aria-hidden="true">K.</span><ol>${steps.map((s, n) => `<li data-step="${n}"><span class="v6-step-ico" aria-hidden="true"></span>${esc(s)}</li>`).join('')}</ol></div>`;
    const set = (k) => out.querySelectorAll('[data-step]').forEach((li) => { const n = +li.dataset.step; li.className = n < k ? 'done' : n === k ? 'active' : ''; });
    set(0);
    const gap = reduce ? 0 : 560;
    briefState.timers = [setTimeout(() => set(1), gap), setTimeout(() => set(2), gap * 2), setTimeout(() => set(3), gap * 3), setTimeout(() => { briefState.phase = 'result'; briefResult(); }, gap * 3 + (reduce ? 0 : 360))];
  }
  function briefReset() { briefState.timers.forEach(clearTimeout); briefState.phase = 'idle'; briefState.tc = 0; $$('[data-need]').forEach((b) => b.setAttribute('aria-pressed', 'false')); const r = $('[data-brief-reset]'); if (r) r.hidden = true; briefIdle(); briefType(true); }
  function briefResult() {
    const out = $('[data-brief-out]'); if (!out) return;
    const t = text('brief-result', BRIEF_T), l = lang(), need = briefState.needs?.[briefState.need]; if (!need) return;
    const hits = (s) => need.keys.reduce((n, k) => n + (k && s.includes(k) ? 1 : 0), 0);
    const projects = (data().projects || []).map((p) => ({ p, score: hits([p.category, ...(p.tags || []), p.title?.en, p.type?.en, p.short?.en].join(' ').toLowerCase()) + (p.featured ? 0.1 : 0) })).sort((a, b) => b.score - a.score || a.p.position - b.p.position).map((x) => x.p);
    const services = (data().services || []).map((s) => ({ s, score: hits(((s.title_en || '') + ' ' + (s.description_en || '')).toLowerCase()) })).sort((a, b) => b.score - a.score).map((x) => x.s);
    const svc = services[0], best = projects[0];
    const resetBtn = $('[data-brief-reset]'); if (resetBtn) resetBtn.hidden = false;
    const link = core()?.url(row('brief-result')?.content?.links?.cta_url, { link: true }) || '#project-brief';
    const svcHtml = svc ? `<section class="v6-glass v6-svc v6-in" aria-label="${esc(t('startHere'))}"><span class="v6-label">${esc(t('startHere'))}</span><h3>${esc(l === 'ar' ? svc.title_ar || svc.title_en : svc.title_en)}</h3><p>${esc(l === 'ar' ? svc.description_ar || svc.description_en : svc.description_en)}</p>${toolsFor(svc).length ? `<ul class="v6-tools" aria-label="${esc(t('tools'))}">${toolsFor(svc).map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}<a class="v6-btn-light" href="${esc(link)}" data-brief-cta>${esc(t('sendBrief'))}</a></section>` : '';
    const media = (p) => playable(p.video) && !reduce ? `<video src="${esc(p.video)}" poster="${esc(p.cover || '')}" muted loop playsinline autoplay preload="metadata"></video>` : p.cover ? `<img src="${esc(p.cover)}" alt="${esc(pick(p.title, l))}" loading="lazy">` : '';
    const bestHtml = best ? `<a class="v6-glass v6-best v6-in2" href="${esc(portfolioHref(best.id))}"><span class="v6-best-media">${media(best)}</span><span class="v6-best-copy"><span class="v6-badge">${esc(t('bestMatch'))}</span><b>${esc(pick(best.title, l))}</b><span class="v6-type">${esc(pick(best.type, l))}</span><span class="v6-short">${esc(pick(best.short, l))}</span><span class="v6-open">${esc(t('open'))}</span></span></a>` : '';
    const others = projects.slice(1, 3).map((p) => `<a class="v6-glass v6-other" href="${esc(portfolioHref(p.id))}">${p.cover ? `<img src="${esc(p.cover)}" alt="" loading="lazy">` : ''}<span><b>${esc(pick(p.title, l))}</b><small>${esc(pick(p.type, l))}</small></span></a>`).join('');
    out.innerHTML = `<div class="v6-result">${svcHtml}<div class="v6-work"><span class="v6-label v6-in2">${esc(t('closestWork'))}</span>${bestHtml}<div class="v6-others v6-in3">${others}</div></div></div>`;
    out.querySelector('[data-brief-cta]')?.addEventListener('click', () => {
      const sel = $('#inquiryForm select'); const title = (svc?.title_en || '').toLowerCase();
      if (sel) { const opt = [...sel.options].find((o) => /video|motion/.test(title) ? /video/i.test(o.value + o.text) : /visual|design|ai/.test(title) ? /ai|design/i.test(o.value + o.text) : /market|seo/i.test(o.value + o.text)); if (opt) sel.value = opt.value; }
      const msg = $('#inquiryForm textarea'); if (msg && !msg.value) msg.value = t('briefPrompt') + ' ' + need.label;
    });
  }

  /* ---------------- 5. scroll story ---------------- */
  const STORY_T = {
    en: { storyKicker: 'THE STORY · IDEA TO FRAME', s1Kicker: '01 — the idea', s1Title: 'It starts with one sentence.', s1Text: 'Every project begins as an idea — a feeling a brand wants people to have.', s2Kicker: '02 — the plan', s2Title: 'Then the thinking.', s2Text: 'Audience, message, channel. The marketing plan comes before any pixel.', s3Kicker: '03 — the visual', s3Title: 'Then the visual.', s3Text: 'A plain photo becomes a campaign poster — same moment, a new story.', s4Kicker: '04 — the motion', s4Title: 'Then it moves.', s4Text: 'The story becomes a 9:16 film, edited for the feed.', s5Kicker: '05 — the result', s5Title: 'Then it’s real.', s5Text: 'Published work — real projects, all my own.', storyCta: 'Explore my portfolio →', storyHint: 'SCROLL', idea: 'Idea', toFrame: '→ TO FRAME', brief: 'The brief', audience: 'Audience', message: 'Message', channel: 'Channel', before: 'BEFORE — THE PLAIN PHOTO', after: 'AFTER — THE POSTER', film: 'THE FILM' },
    ar: { storyKicker: 'القصة · من الفكرة لآخر فريم', s1Kicker: '٠١ — الفكرة', s1Title: 'كل شي بيبدأ بجملة.', s1Text: 'كل مشروع بيبدأ بفكرة — إحساس بدّه البراند يوصل للناس.', s2Kicker: '٠٢ — الخطة', s2Title: 'بعدين التفكير.', s2Text: 'الجمهور، الرسالة، القناة. خطة التسويق قبل أي بيكسل.', s3Kicker: '٠٣ — البصري', s3Title: 'بعدين الصورة.', s3Text: 'صورة عادية بتصير بوستر حملة — نفس اللحظة، قصة جديدة.', s4Kicker: '٠٤ — الحركة', s4Title: 'بعدين بتتحرك.', s4Text: 'القصة بتصير فيلم 9:16 معمول للفيد.', s5Kicker: '٠٥ — النتيجة', s5Title: 'وبعدين بتصير حقيقة.', s5Text: 'شغل منشور — مشاريع حقيقية، كلها إلي.', storyCta: 'استكشف البورتفوليو ←', storyHint: 'اسحب', idea: 'فكرة', toFrame: '← لآخر فريم', brief: 'الطلب', audience: 'الجمهور', message: 'الرسالة', channel: 'القناة', before: 'قبل — الصورة العادية', after: 'بعد — البوستر', film: 'الفيلم' }
  };
  let story = null;
  function renderStory() {
    const host = $('[data-v6-story]'); if (!host) return;
    const t = text('story', STORY_T), l = lang(), m = row('story')?.content?.media || {};
    const ps = data().projects || [];
    const vidProject = ps.find((p) => playable(p.video));
    const before = core()?.url(m.story_before) || asset('assets/brand/lab/karam-plain-before.webp');
    const after = core()?.url(m.story_after) || asset('assets/brand/lab/karam-poster-after.webp');
    const video = core()?.url(m.story_video) || vidProject?.video || '';
    const poster = core()?.url(m.story_poster) || vidProject?.cover || after;
    const covers = ps.filter((p) => p.cover).slice(0, 4).map((p) => p.cover);
    const cta = core()?.url(row('story')?.content?.links?.cta_url, { link: true }) || portfolioHref('');
    const sig = l + before + after + video + covers.join() + JSON.stringify(row('story')?.content?.[l] || {});
    if (story && story.sig === sig) return;
    host.innerHTML = `
      <div class="v6-story-top"><p class="v6-kicker" id="v6StoryTitle">${esc(t('storyKicker'))}</p><span class="v6-story-bar" aria-hidden="true"><i data-s-bar></i></span><span class="v6-story-no" data-s-no aria-hidden="true" dir="ltr">01 / 05</span></div>
      <div class="v6-story-copy">${[1, 2, 3, 4, 5].map((i) => `<div class="v6-scene-text" data-s-text="${i - 1}"><span class="v6-scene-k">${esc(t('s' + i + 'Kicker'))}</span><h3>${esc(t('s' + i + 'Title'))}</h3><p>${esc(t('s' + i + 'Text'))}</p>${i === 5 ? `<a class="v6-btn" href="${esc(cta)}">${esc(t('storyCta'))}</a>` : ''}</div>`).join('')}</div>
      <div class="v6-story-vis" aria-hidden="true">
        <div class="v6-s-idea" data-s-idea><span class="v6-s-word">${esc(t('idea'))}<i class="v6-caret"></i></span><small>${esc(t('toFrame'))}</small></div>
        <div class="v6-s-plan" data-s-plan><span class="v6-glass v6-s-core">${esc(t('brief'))}</span><span class="v6-glass v6-s-tag a" data-s-tag="0">${esc(t('audience'))}</span><span class="v6-glass v6-s-tag b" data-s-tag="1">${esc(t('message'))}</span><span class="v6-glass v6-s-tag c" data-s-tag="2">${esc(t('channel'))}</span></div>
        <div class="v6-s-photo" data-s-photo><img src="${esc(before)}" alt="" loading="lazy"><img class="v6-s-after" data-s-after src="${esc(after)}" alt="" loading="lazy"><i class="v6-s-line" data-s-line></i>${video ? `<video data-s-video muted loop playsinline preload="none" poster="${esc(poster)}" data-src="${esc(video)}"></video>` : ''}<span class="v6-s-tag-label" data-s-label></span></div>
        <div class="v6-s-cards" data-s-cards>${covers.map((c, i) => `<img src="${esc(c)}" alt="" loading="lazy" data-s-card="${i}">`).join('')}</div>
      </div>
      <ol class="v6-story-dots" aria-hidden="true">${[0, 1, 2, 3, 4].map((i) => `<li data-s-dot="${i}"></li>`).join('')}</ol>
      <span class="v6-story-hint" data-s-hint aria-hidden="true">${esc(t('storyHint'))} ↓</span>`;
    story = { sig, host, t, labels: [t('before'), t('after'), t('film')] };
    updateStory();
  }
  function updateStory() {
    if (!story) return;
    const sec = $('#story'), track = sec?.querySelector('.v6-story-track'); if (!track) return;
    const host = story.host;
    let P = 4.2;
    if (!reduce) { const r = track.getBoundingClientRect(), total = Math.max(1, r.height - innerHeight); P = clamp(-r.top / total, 0, 0.9999) * 5; }
    const centers = [0.15, 1.5, 2.5, 3.5, 4.85];
    host.querySelectorAll('[data-s-text]').forEach((el) => { const i = +el.dataset.sText, dd = P - centers[i]; const op = reduce ? (i === 4 ? 1 : 0) : clamp(1.4 - Math.abs(dd) * 2.9); el.style.opacity = op; el.style.transform = `translateY(${(-dd * 36).toFixed(1)}px)`; el.style.visibility = op < 0.02 ? 'hidden' : 'visible'; });
    const bar = host.querySelector('[data-s-bar]'); if (bar) bar.style.width = (P / 5 * 100) + '%';
    const scene = Math.min(4, Math.floor(P)); const no = host.querySelector('[data-s-no]'); if (no) no.textContent = '0' + (scene + 1) + ' / 05';
    host.querySelectorAll('[data-s-dot]').forEach((d) => d.classList.toggle('on', +d.dataset.sDot === scene));
    const idea = host.querySelector('[data-s-idea]'); if (idea) { idea.style.opacity = clamp(1.3 - P * 1.6); idea.style.transform = `scale(${1 + P * 0.15})`; }
    const plan = host.querySelector('[data-s-plan]'); if (plan) { plan.style.opacity = clamp(1.4 - Math.abs(P - 1.5) * 2.2); plan.querySelectorAll('[data-s-tag]').forEach((tg, i) => { tg.style.transform = `translateY(${((1 - clamp((P - 0.8 - i * 0.15) / 0.6)) * (i === 2 ? -50 : 50)).toFixed(1)}px)`; }); }
    const photo = host.querySelector('[data-s-photo]');
    if (photo) {
      const op = clamp(Math.min(P - 1.75, 4.25 - P) * 3), a = clamp((P - 2.1) / 0.8), m = clamp((P - 3) / 0.6);
      photo.style.opacity = op; photo.style.setProperty('--m', m.toFixed(3));
      const after = photo.querySelector('[data-s-after]'); if (after) after.style.clipPath = `inset(0 ${((1 - a) * 100).toFixed(1)}% 0 0)`;
      const line = photo.querySelector('[data-s-line]'); if (line) { line.style.left = (a * 100) + '%'; line.style.opacity = a > 0 && a < 1 ? 1 : 0; }
      const v = photo.querySelector('[data-s-video]'), vo = clamp((P - 3.3) / 0.4);
      if (v) { v.style.opacity = vo; if (vo > 0 && op > 0) { if (!v.src && v.dataset.src) v.src = v.dataset.src; if (v.paused && !reduce) v.play().catch(() => {}); } else if (!v.paused) v.pause(); }
      const lab = photo.querySelector('[data-s-label]'); if (lab) lab.textContent = P < 2.5 ? story.labels[0] : P < 3.3 ? story.labels[1] : story.labels[2];
    }
    const c = clamp((P - 4.05) / 0.55), xs = [-1.15, -0.39, 0.39, 1.15], ys = [30, -10, -10, 30], rs = [-12, -4, 4, 12];
    host.querySelectorAll('[data-s-card]').forEach((img) => { const i = +img.dataset.sCard; img.style.opacity = c; img.style.transform = `translate(calc(${(xs[i] * c).toFixed(3)} * var(--v6-card-w)), ${(ys[i] * c + (1 - c) * 60).toFixed(1)}px) rotate(${(rs[i] * c).toFixed(1)}deg)`; });
    const hint = host.querySelector('[data-s-hint]'); if (hint) hint.style.opacity = clamp(1 - P * 3);
  }

  /* ---------------- 6. Adams Clay 3D carafe ---------------- */
  const CLAY_T = {
    en: { clayKicker: 'MY OWN BRAND', clayTagline: 'Where art meets earth.', clayChapter: 'Chapter', c1Title: 'The object', c1Text: 'Visual identity, product imagery and social storytelling for Adams Clay, my own clay-carafe brand.', c2Title: 'The colours', c2Text: 'One shape, many glazes — blue, burgundy, black, beige and green, each with its own post.', c3Title: 'The stories', c3Text: 'Each post gives the carafe a mood — product photos turned into social stories.', c4Title: 'The archive', c4Text: 'Photos, posts and reels collected in one archive on my portfolio.', clayCta: 'Open the archive', clayHint: 'Scroll to turn the carafe', items: 'items', alt: 'A clay carafe turning as you scroll' },
    ar: { clayKicker: 'علامتي الخاصة', clayTagline: 'Where art meets earth.', clayChapter: 'الفصل', c1Title: 'القطعة', c1Text: 'هوية بصرية وصور منتجات وقصص اجتماعية لآدمز كلاي، علامتي الخاصة لقوارير الماء الفخارية.', c2Title: 'الألوان', c2Text: 'شكل واحد وألوان طلاء كثيرة — أزرق، برغندي، أسود، بيج وأخضر، ولكل لون بوست.', c3Title: 'القصص', c3Text: 'كل بوست بيعطي القارورة مزاج — صور منتجات صارت قصص على السوشال.', c4Title: 'الأرشيف', c4Text: 'صور وبوستات وريلز مجمّعة بأرشيف واحد على البورتفوليو.', clayCta: 'افتح الأرشيف', clayHint: 'اسحب لتلف القارورة', items: 'عنصر', alt: 'قارورة فخار بتلف مع السكرول' }
  };
  let clay = null;
  function renderClay() {
    const sec = $('#clay-3d'), host = $('[data-v6-clay]'); if (!sec || !host) return;
    const p = (data().projects || []).find((x) => x.id === 'adams-clay');
    if (!p) { sec.classList.add('v6-empty'); host.innerHTML = ''; clay = null; return; }
    sec.classList.remove('v6-empty');
    const t = text('clay-3d', CLAY_T), l = lang(), m = row('clay-3d')?.content?.media || {};
    const imgs = (p.gallery || []).map((u) => core()?.media(u)).filter((x) => x && x.type === 'image').map((x) => x.url);
    const find = (n) => imgs.find((u) => u.includes(n));
    const chapterImg = [core()?.url(m.chapter1_image) || find('product-visual') || p.cover || imgs[0], core()?.url(m.chapter2_image) || find('Da8gqhAuIQm') || imgs[1], core()?.url(m.chapter3_image) || find('Da50dNdDsZt') || imgs[2], core()?.url(m.chapter4_image) || find('DGbd1wtuPgn') || imgs[3]].map((u, i) => u || imgs[i] || p.cover || '');
    const logo = p.cover && core()?.brandMark(p.cover) ? p.cover : '';
    const archive = core()?.url(row('clay-3d')?.content?.links?.archive_url, { link: true }) || portfolioHref('adams-clay');
    const sig = l + chapterImg.join() + archive + JSON.stringify(row('clay-3d')?.content?.[l] || {}) + pick(p.title, l);
    if (clay && clay.sig === sig) return;
    host.innerHTML = `
      <div class="v6-clay-head">${logo ? `<img src="${esc(logo)}" alt="${esc(pick(p.title, 'en'))} logo">` : ''}<div><p class="v6-kicker">${esc(t('clayKicker'))}</p><h2 id="v6ClayTitle">${esc(pick(p.title, l))}</h2></div><em dir="auto">${esc(t('clayTagline'))}</em></div>
      <div class="v6-clay-copy" aria-live="polite">${[1, 2, 3, 4].map((i) => `<div class="v6-clay-ch" data-c-ch="${i - 1}"><span class="v6-scene-k">${esc(t('clayChapter'))} 0${i}</span><h3>${esc(t('c' + i + 'Title'))}</h3><p>${esc(t('c' + i + 'Text'))}</p>${i === 4 ? `<a class="v6-btn-light" href="${esc(archive)}">${esc(t('clayCta'))} · ${p.gallery.length} ${esc(t('items'))} ↗</a>` : ''}</div>`).join('')}</div>
      <div class="v6-clay-vis"><span class="v6-clay-shadow" aria-hidden="true"></span><canvas data-c-canvas role="img" aria-label="${esc(t('alt'))}"></canvas></div>
      <div class="v6-clay-photos">${chapterImg.map((u, i) => u ? `<img src="${esc(u)}" alt="" loading="lazy" data-c-img="${i}">` : '').join('')}</div>
      <nav class="v6-clay-nav" aria-label="${esc(t('clayChapter'))}">${[1, 2, 3, 4].map((i) => `<button type="button" data-c-go="${i - 1}"><i><b></b></i><span>0${i} · ${esc(t('c' + i + 'Title'))}</span></button>`).join('')}</nav>
      <span class="v6-clay-hint" aria-hidden="true">${esc(t('clayHint'))}</span>`;
    const cv = host.querySelector('[data-c-canvas]'), small = innerWidth < 700;
    cv.width = small ? 220 : 300; cv.height = Math.round(cv.width * 1.6);
    clay = { sig, host, cv, ctx: cv.getContext('2d'), rot: 0, base: 0, ch: 0, glaze: [47, 111, 168], cycle: 0, visible: false, raf: 0 };
    clay.img = clay.ctx.createImageData(cv.width, cv.height);
    host.querySelectorAll('[data-c-go]').forEach((b) => b.addEventListener('click', () => {
      const track = sec.querySelector('.v6-clay-track'), r = track.getBoundingClientRect(), total = r.height - innerHeight, i = +b.dataset.cGo;
      scrollTo({ top: scrollY + r.top + total * ((i + 0.5) / 4), behavior: reduce ? 'auto' : 'smooth' });
      if (reduce) setClayChapter(i);
    }));
    if ('IntersectionObserver' in window) new IntersectionObserver((e) => { if (clay) clay.visible = e[0].isIntersecting; }, { threshold: 0 }).observe(sec);
    setClayChapter(0, true); updateClay(); clayLoop();
  }
  function setClayChapter(i, force) {
    if (!clay || (clay.ch === i && !force)) return; clay.ch = i;
    clay.host.querySelectorAll('[data-c-ch]').forEach((el) => el.classList.toggle('on', +el.dataset.cCh === i));
    clay.host.querySelectorAll('[data-c-img]').forEach((el) => el.classList.toggle('on', +el.dataset.cImg === i));
    clay.host.querySelectorAll('[data-c-go]').forEach((el) => { const n = +el.dataset.cGo; el.classList.toggle('on', n === i); el.classList.toggle('past', n <= i); if (n === i) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current'); });
  }
  function updateClay() {
    if (!clay) return; const sec = $('#clay-3d'), track = sec?.querySelector('.v6-clay-track'); if (!track) return;
    if (reduce) return;
    const r = track.getBoundingClientRect(), p = clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 0.9999);
    setClayChapter(Math.floor(p * 4));
  }
  const clayProf = (t) => { if (t < 0.02 || t > 0.975) return 0; if (t < 0.07) return 0.05; if (t < 0.085) return 0.068; if (t < 0.25) return 0.058 + 0.012 * (t - 0.085) / 0.165; if (t < 0.45) { let s = (t - 0.25) / 0.2; s = s * s * (3 - 2 * s); return 0.07 + 0.198 * s; } if (t < 0.93) return 0.268 + 0.022 * Math.sin(Math.PI * (t - 0.45) / 0.48); return 0.268 - (t - 0.93) * 2.2; };
  function clayDraw() {
    const { cv, ctx, img } = clay, W = cv.width, H = cv.height, d = img.data, cx = W / 2, rot = clay.rot, glaze = clay.glaze, TWO = Math.PI * 2;
    let L = [-0.55, -0.42, 0.72]; const ll = Math.hypot(...L); L = L.map((v) => v / ll);
    let Hh = [L[0], L[1], L[2] + 1]; const hl = Math.hypot(...Hh); Hh = Hh.map((v) => v / hl);
    for (let py = 0; py < H; py++) {
      const t = py / H, r = clayProf(t) * W, row = py * W * 4;
      if (r <= 0) { for (let q = 0; q < W; q++) d[row + q * 4 + 3] = 0; continue; }
      const dr = (clayProf(t + 0.004) - clayProf(t - 0.004)) / 0.008 * W / H;
      for (let px = 0; px < W; px++) {
        const o = row + px * 4, x = px - cx + 0.5, ax = Math.abs(x);
        if (ax > r + 1) { d[o + 3] = 0; continue; }
        const nx = clamp(x / r, -1, 1), nz = Math.sqrt(Math.max(0, 1 - nx * nx)), ny = -dr * 0.9, nl = Math.hypot(nx, ny, nz);
        const Nx = nx / nl, Ny = ny / nl, Nz = nz / nl, diff = Math.max(0, Nx * L[0] + Ny * L[1] + Nz * L[2]);
        let phi = Math.asin(nx) + rot; phi = ((phi % TWO) + TWO) % TWO; if (phi > Math.PI) phi -= TWO;
        const gl = 0.5 + 0.018 * Math.sin(3 * phi + 1.2), nh = Math.max(0, Nx * Hh[0] + Ny * Hh[1] + Nz * Hh[2]);
        let cr, cg, cb, spec, sp;
        if (t < 0.07) { cr = 186; cg = 140; cb = 96; spec = 0.05; sp = 6; }
        else if (t < gl) { cr = glaze[0]; cg = glaze[1]; cb = glaze[2]; spec = 0.75; sp = 46; }
        else {
          cr = 196; cg = 114; cb = 70; spec = 0.12; sp = 9;
          const hs = Math.sin(Math.floor(phi * 70) * 12.9898 + Math.floor(t * 320) * 78.233) * 43758.5453; if (hs - Math.floor(hs) > 0.86) { cr *= 0.8; cg *= 0.78; cb *= 0.76; }
          if (t > 0.63 && t < 0.71 && Math.abs(phi) < 0.26) { const inner = t > 0.645 && t < 0.695 && Math.abs(phi) < 0.2; if (inner) { cr = 236; cg = 232; cb = 224; } else { cr = 47; cg = 111; cb = 168; } spec = 0.2; }
        }
        const lit = (0.3 + 0.78 * diff) * (1 + 0.035 * Math.sin(t * 270)), rim = Math.pow(1 - Nz, 3) * 0.3, s = Math.pow(nh, sp) * spec * 255, a = clamp(r + 0.5 - ax);
        d[o] = Math.min(255, cr * lit + s + rim * 120); d[o + 1] = Math.min(255, cg * lit + s + rim * 60); d[o + 2] = Math.min(255, cb * lit + s + rim * 50); d[o + 3] = a * 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }
  let clayCycleT = 0;
  function clayLoop() {
    if (!clay || clay.raf) return;
    const cycleCols = [[47, 111, 168], [126, 36, 64], [30, 28, 29], [214, 200, 178], [94, 128, 98]];
    const byCh = [[47, 111, 168], null, [30, 28, 29], [126, 36, 64]];
    let last = 0;
    const loop = (ts) => {
      if (!clay) return;
      clay.raf = requestAnimationFrame(loop);
      if (!clay.visible || document.hidden || ts - last < 40) return; last = ts;
      if (!reduce) clay.base += 0.006;
      if (ts - clayCycleT > 1400) { clayCycleT = ts; clay.cycle = (clay.cycle + 1) % 5; }
      const target = clay.ch * Math.PI / 2 + clay.base; clay.rot += (target - clay.rot) * (reduce ? 1 : 0.09);
      const tg = byCh[clay.ch] || cycleCols[clay.cycle]; for (let k = 0; k < 3; k++) clay.glaze[k] += (tg[k] - clay.glaze[k]) * 0.1;
      clayDraw();
    };
    clayDraw(); clay.raf = requestAnimationFrame(loop);
  }

  /* ---------------- 7. reels feed upgrade (keeps video-reels.js engine) ---------------- */
  const REEL_T = { en: { on: 'Sound on', off: 'Sound off', next: 'Up next', open: 'Open project ↗' }, ar: { on: 'الصوت شغّال', off: 'الصوت مسكّر', next: 'التالي', open: 'افتح المشروع ↖' } };
  let feed = null;
  function setupFeed() {
    const sec = $('#video-reels'), track = sec?.querySelector('.reels-track'), win = sec?.querySelector('.reels-window');
    if (!sec || !track || !win || feed) return;
    sec.classList.add('v6-feed');
    const amb = document.createElement('div'); amb.className = 'v6-feed-amb'; amb.setAttribute('aria-hidden', 'true'); amb.innerHTML = '<img alt="">'; sec.prepend(amb);
    const sound = document.createElement('button'); sound.type = 'button'; sound.className = 'v6-chip v6-feed-sound'; sound.setAttribute('aria-pressed', 'false');
    win.after(sound);
    feed = { sec, track, win, amb, sound, soundOn: false, visible: false, userPaused: new WeakSet(), lastActive: null, lock: 0 };
    const labelSound = () => { const t = REEL_T[lang()]; sound.textContent = feed.soundOn ? t.on : t.off; sound.setAttribute('aria-pressed', String(feed.soundOn)); };
    labelSound(); addEventListener('karam:language', labelSound);
    sound.addEventListener('click', () => { feed.soundOn = !feed.soundOn; labelSound(); const v = activeCard()?.querySelector('video'); if (v) v.muted = !feed.soundOn; });
    const activeCard = () => track.querySelector('.reels-card.is-active');
    const autoplayOn = () => row('video-reels')?.content?.options?.autoplay !== false && !reduce;
    const sync = () => {
      const card = activeCard(); if (!card) return;
      const img = card.querySelector('.reels-poster'); const src = img?.currentSrc || img?.src || '';
      const bg = amb.querySelector('img'); if (src && bg.getAttribute('src') !== src) bg.src = src;
      if (card !== feed.lastActive) { feed.lastActive = card; }
      const v = card.querySelector('video');
      if (autoplayOn() && feed.visible && !document.hidden && v && v.paused && !feed.userPaused.has(v)) {
        v.muted = !feed.soundOn; card.querySelector('.reels-watch')?.click();
      }
    };
    new MutationObserver(() => requestAnimationFrame(sync)).observe(track, { subtree: true, attributes: true, attributeFilter: ['class'], childList: true });
    if ('IntersectionObserver' in window) new IntersectionObserver((e) => { feed.visible = e[0].intersectionRatio >= 0.45; if (feed.visible) sync(); }, { threshold: [0, 0.45, 0.8] }).observe(win);
    track.addEventListener('pause', (e) => { const v = e.target; if (v.tagName === 'VIDEO' && !v.hidden && feed.visible && v.closest('.reels-card')?.classList.contains('is-active') && v.currentTime > 0.2) feed.userPaused.add(v); }, true);
    track.addEventListener('play', (e) => { const v = e.target; if (v.tagName === 'VIDEO') { v.muted = !feed.soundOn; feed.userPaused.delete(v); } }, true);
    if (finePointer) win.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX) || Math.abs(e.deltaY) < 12) return;
      const next = sec.querySelector('.reels-next'), prev = sec.querySelector('.reels-prev'), b = e.deltaY > 0 ? next : prev;
      if (!b || b.disabled || b.closest('[hidden]')) return;
      e.preventDefault(); const now = Date.now(); if (now - feed.lock < 650) return; feed.lock = now; b.click();
    }, { passive: false });
    sync();
  }

  /* ---------------- 8. ambient light behind glass sections ---------------- */
  function decorate() {
    ['brief-result', 'expertise', 'ki-featured-carousel', 'about', 'process', 'ki-pricing', 'project-brief', 'contact', 'creative-lab', 'featured', 'work', 'insights'].forEach((id) => {
      const el = document.getElementById(id); if (!el) return;
      el.classList.add('v6-ambient');
      if (!el.querySelector(':scope > .v6-orb')) { const o = document.createElement('span'); o.className = 'v6-orb'; o.setAttribute('aria-hidden', 'true'); el.prepend(o); }
    });
    document.documentElement.classList.add('v6');
  }

  /* ---------------- 9. portfolio photo: cut-out portrait, 3D tiles fly away from the cursor ---------------- */
  let squares = null;
  function setupSquares() {
    const art = $('#kiPortfolioHeroArt'), img = $('#kiPortfolioHeroPortrait');
    const on = art && img && effects().squares !== false && !reduce;
    if (art) art.classList.add('v6-cutout');
    if (!on) { if (squares) { squares.cv.remove(); art?.classList.remove('v6-tiled'); squares = null; } return; }
    if (squares) return;
    const cv = document.createElement('canvas'); cv.className = 'v6-squares'; cv.id = 'v6Squares'; cv.setAttribute('aria-hidden', 'true'); art.append(cv);
    const st = squares = { cv, ctx: cv.getContext('2d'), tiles: [], size: 24, raf: 0, w: 0, h: 0, dpr: 1, box: null, px: -1e4, py: -1e4, inside: false, tx: 0, ty: 0 };
    const ready = () => img.complete && img.naturalWidth > 0;
    const layout = () => {
      const r = art.getBoundingClientRect(); if (!r.width || !ready()) return false;
      st.dpr = Math.min(2, devicePixelRatio || 1); st.w = r.width; st.h = r.height;
      cv.width = Math.round(r.width * st.dpr); cv.height = Math.round(r.height * st.dpr);
      const nw = img.naturalWidth, nh = img.naturalHeight, k = Math.min(r.width / nw, r.height / nh);
      const bw = nw * k, bh = nh * k; st.box = { x: Math.round((r.width - bw) / 2), y: Math.round(r.height - bh), w: bw, h: bh, k };
      st.size = Math.max(16, Math.round(bw / 11));
      /* alpha map so empty (transparent) squares never fly */
      let alpha = null;
      try { const oc = document.createElement('canvas'); oc.width = Math.ceil(bw); oc.height = Math.ceil(bh); const ox = oc.getContext('2d'); ox.drawImage(img, 0, 0, bw, bh); alpha = ox.getImageData(0, 0, oc.width, oc.height).data; } catch (e) { alpha = null; }
      const ow = Math.ceil(bw), oh = Math.ceil(bh), S = st.size, tiles = [];
      for (let y = 0; y < bh; y += S) for (let x = 0; x < bw; x += S) {
        const w = Math.min(S, bw - x), h = Math.min(S, bh - y); let hit = !alpha, sum = 0;
        if (alpha) for (let j = 0; j < 4 && !hit; j++) for (let i = 0; i < 4; i++) { const sx = Math.min(ow - 1, Math.floor(x + (i + .5) * w / 4)), sy = Math.min(oh - 1, Math.floor(y + (j + .5) * h / 4)); const a = alpha[(sy * ow + sx) * 4 + 3]; sum += a; if (a > 140) { hit = true; break; } }
        if (!hit && sum < 600) continue;
        tiles.push({ x: st.box.x + x, y: st.box.y + y, w, h, sx: x / st.box.k, sy: y / st.box.k, sw: w / st.box.k, sh: h / st.box.k, dx: 0, dy: 0, z: 0, r: 0, vx: 0, vy: 0, vz: 0, vr: 0, seed: Math.random() * 2 - 1 });
      }
      st.tiles = tiles; return true;
    };
    const draw = () => {
      st.raf = 0; const { ctx, dpr, box } = st; if (!box) return;
      const hot = rgbVar('--v6-hot-rgb', [237, 62, 107]);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, st.w, st.h);
      ctx.drawImage(img, box.x, box.y, box.w, box.h);
      const R = st.size * 3.2, active = []; let moving = false;
      for (const t of st.tiles) {
        const cx = t.x + t.w / 2, cy = t.y + t.h / 2;
        if (st.inside) {
          const ddx = cx - st.px, ddy = cy - st.py, d = Math.hypot(ddx, ddy);
          if (d < R) { const f = Math.pow(1 - d / R, 1.6), n = d || 1; t.vx += (ddx / n) * f * 3.4 + t.seed * f * 1.2; t.vy += (ddy / n) * f * 3.4 - f * 0.8; t.vz += f * 0.06; t.vr += t.seed * f * 0.05; }
        }
        t.vx += -t.dx * 0.06; t.vy += -t.dy * 0.06; t.vz += -t.z * 0.07; t.vr += -t.r * 0.07;
        t.vx *= 0.84; t.vy *= 0.84; t.vz *= 0.82; t.vr *= 0.84;
        t.dx += t.vx; t.dy += t.vy; t.z += t.vz; t.r += t.vr;
        const e = Math.abs(t.dx) + Math.abs(t.dy) + Math.abs(t.z) * 40 + Math.abs(t.r) * 30;
        if (e > 1.2) { active.push(t); moving = true; } else if (e > 0.05) { moving = true; } else { t.dx = t.dy = t.z = t.r = t.vx = t.vy = t.vz = t.vr = 0; }
      }
      if (active.length) {
        for (const t of active) ctx.clearRect(t.x, t.y, Math.ceil(t.w), Math.ceil(t.h));
        active.sort((a, b) => a.z - b.z);
        for (const t of active) {
          const s = 1 + Math.max(-0.2, t.z), lift = Math.min(1, Math.abs(t.z) * 3 + (Math.abs(t.dx) + Math.abs(t.dy)) / 60);
          ctx.save(); ctx.translate(t.x + t.w / 2 + t.dx, t.y + t.h / 2 + t.dy); ctx.rotate(t.r); ctx.scale(s, s);
          ctx.shadowColor = 'rgba(0,0,0,' + (0.45 * lift).toFixed(3) + ')'; ctx.shadowBlur = 18 * lift; ctx.shadowOffsetY = 10 * lift;
          ctx.drawImage(img, t.sx, t.sy, t.sw, t.sh, -t.w / 2, -t.h / 2, t.w, t.h);
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = 'rgba(' + hot[0] + ',' + hot[1] + ',' + hot[2] + ',' + (0.85 * lift).toFixed(3) + ')'; ctx.lineWidth = 1 / s; ctx.strokeRect(-t.w / 2 + 0.5, -t.h / 2 + 0.5, t.w - 1, t.h - 1);
          ctx.restore();
        }
      }
      /* soft fade at the bottom so the cut-out has no hard edge */
      const fy = box.y + box.h * 0.8, fg = ctx.createLinearGradient(0, fy, 0, box.y + box.h);
      fg.addColorStop(0, 'rgba(0,0,0,0)'); fg.addColorStop(1, 'rgba(0,0,0,1)');
      ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = fg; ctx.fillRect(0, fy, st.w, st.h - fy + 2); ctx.globalCompositeOperation = 'source-over';
      /* whole cut-out tilts gently toward the cursor */
      const gx = st.inside ? (st.px / st.w - 0.5) : 0, gy = st.inside ? (st.py / st.h - 0.5) : 0;
      st.tx += (gx - st.tx) * 0.12; st.ty += (gy - st.ty) * 0.12;
      cv.style.transform = 'perspective(900px) rotateY(' + (st.tx * 9).toFixed(2) + 'deg) rotateX(' + (-st.ty * 7).toFixed(2) + 'deg)';
      if (moving || st.inside || Math.abs(st.tx) + Math.abs(st.ty) > 0.002) st.raf = requestAnimationFrame(draw);
    };
    const kick = () => { if (!st.raf) st.raf = requestAnimationFrame(draw); };
    const boot = () => { if (layout()) { art.classList.add('v6-tiled'); kick(); } };
    if (ready()) boot(); else img.addEventListener('load', boot, { once: true });
    if ('ResizeObserver' in window) new ResizeObserver(() => { if (layout()) kick(); }).observe(art);
    const zone = art.parentElement || art;
    zone.addEventListener('pointermove', (e) => {
      const r = art.getBoundingClientRect(); if (Math.abs(r.width - st.w) > 1 || Math.abs(r.height - st.h) > 1 || !st.box) { if (layout()) art.classList.add('v6-tiled'); }
      st.px = e.clientX - r.left; st.py = e.clientY - r.top;
      st.inside = st.px > -40 && st.py > -40 && st.px < r.width + 40 && st.py < r.height + 40; kick();
    }, { passive: true });
    zone.addEventListener('pointerleave', () => { st.inside = false; kick(); }, { passive: true });
  }

  /* ---------------- 10. portfolio PDF card ---------------- */
  const PDF_T = { en: { kicker: 'PORTFOLIO PDF', title: 'The full portfolio,', em: 'in one file.', text: 'Read it here or download it to keep.', read: 'Read here', download: 'Download PDF', close: 'Close preview', open: 'Open PDF ↗' }, ar: { kicker: 'البورتفوليو PDF', title: 'البورتفوليو كامل،', em: 'بملف واحد.', text: 'اقرأه هون أو نزّله عندك.', read: 'اقرأ هون', download: 'تحميل PDF', close: 'إغلاق المعاينة', open: 'افتح الملف ↖' } };
  let pdfSig = '';
  function renderPdf() {
    const hero = $('main section.hero'); if (!hero) return;
    const file = core()?.url(data().settings?.portfolio_pdf) || core()?.url(window.KARAM_SITE?.portfolioPDF || '');
    let sec = $('#v6-pdf');
    if (!file) { sec?.remove(); pdfSig = ''; return; }
    const l = lang(), t = PDF_T[l], sig = l + file; if (sig === pdfSig && sec) return; pdfSig = sig;
    if (!sec) { sec = document.createElement('section'); sec.id = 'v6-pdf'; sec.className = 'v6-pdf'; sec.setAttribute('aria-labelledby', 'v6PdfTitle'); hero.after(sec); }
    sec.innerHTML = `<div class="container shell"><div class="v6-glass v6-pdf-card"><div class="v6-pdf-copy"><span class="v6-pdf-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26"><path d="M7 3h7l5 5v13H7z M14 3v5h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.5 14h5M9.5 17h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span><div><p class="v6-kicker">${esc(t.kicker)}</p><h2 id="v6PdfTitle" class="v6-h2 v6-pdf-h">${esc(t.title)} <em>${esc(t.em)}</em></h2><p class="v6-lead">${esc(t.text)}</p></div></div>
      <div class="v6-pdf-actions"><button type="button" class="v6-btn" data-pdf-read aria-expanded="false">${esc(t.read)}</button><a class="v6-chip" href="${esc(file)}" download target="_blank" rel="noopener">${esc(t.download)} ↓</a></div>
      <div class="v6-pdf-view" data-pdf-view hidden></div></div></div>`;
    const btn = sec.querySelector('[data-pdf-read]'), view = sec.querySelector('[data-pdf-view]');
    btn.addEventListener('click', () => {
      if (innerWidth < 760) { window.open(file, '_blank', 'noopener'); return; }
      const open = view.hidden; view.hidden = !open; btn.setAttribute('aria-expanded', String(open)); btn.textContent = open ? t.close : t.read;
      if (open && !view.firstChild) view.innerHTML = `<iframe src="${esc(file)}#view=FitH" title="${esc(t.kicker)}" loading="lazy"></iframe><a class="v6-pdf-open" href="${esc(file)}" target="_blank" rel="noopener">${esc(t.open)}</a>`;
    });
  }

  /* ---------------- 11. live Instagram feed (optional, via a behold.so JSON feed) ---------------- */
  const IG_T = { en: { igKicker: 'LIVE FROM INSTAGRAM', igTitle: 'Fresh from', igTitleEm: 'the feed.', igIntro: 'My newest posts appear here automatically.', igCta: 'Follow on Instagram ↗', reel: 'Reel' }, ar: { igKicker: 'مباشر من إنستغرام', igTitle: 'جديد', igTitleEm: 'من الفيد.', igIntro: 'آخر منشوراتي بتظهر هون تلقائيًا.', igCta: 'تابعني على إنستغرام ↖', reel: 'ريل' } };
  let ig = { url: '', items: null, busy: false };
  async function renderIg() {
    const sec = $('#instagram-feed'), host = $('[data-v6-ig]'); if (!sec || !host) return;
    const url = core()?.url(data().settings?.instagram_feed_url);
    if (!url || !/^https:\/\/feeds\.behold\.so\/[A-Za-z0-9_-]+\/?$/.test(url)) { sec.classList.add('v6-empty'); return; }
    if (ig.url !== url && !ig.busy) {
      ig = { url, items: null, busy: true };
      try {
        const res = await fetch(url, { cache: 'no-store' }); const j = await res.json(); const posts = Array.isArray(j) ? j : (j.posts || []);
        const okImg = (u) => typeof u === 'string' && /^https:\/\//.test(u);
        ig.items = posts.filter((p) => typeof p.permalink === 'string' && /^https:\/\/(www\.)?instagram\.com\//.test(p.permalink)).map((p) => ({ link: p.permalink, img: [p.sizes?.medium?.mediaUrl, p.sizes?.small?.mediaUrl, p.thumbnailUrl, p.mediaUrl].find(okImg) || '', video: p.mediaType === 'VIDEO', alt: p.altText || (p.prunedCaption || p.caption || '').slice(0, 100) })).filter((p) => p.img).slice(0, 12);
      } catch { ig.items = []; }
      ig.busy = false;
    }
    if (!ig.items || !ig.items.length) { sec.classList.add('v6-empty'); return; }
    sec.classList.remove('v6-empty'); sec.hidden = false;
    const t = text('instagram-feed', IG_T), l = lang();
    const profile = core()?.url(window.KARAM_SITE?.instagram || '', { link: true }) || ig.items[0].link;
    host.innerHTML = `<div class="v6-head"><div><p class="v6-kicker">${esc(t('igKicker'))}</p><h2 id="v6IgTitle" class="v6-h2">${esc(t('igTitle'))} <em>${esc(t('igTitleEm'))}</em></h2></div><p class="v6-lead">${esc(t('igIntro'))}</p></div>
      <div class="v6-ig-rail">${ig.items.map((p) => `<a class="v6-ig-item" href="${esc(p.link)}" target="_blank" rel="noopener"><img src="${esc(p.img)}" alt="${esc(p.alt)}" loading="lazy">${p.video ? `<span class="v6-ig-badge">▶ ${esc(IG_T[l].reel)}</span>` : ''}</a>`).join('')}</div>
      <a class="v6-chip v6-ig-cta" href="${esc(profile)}" target="_blank" rel="noopener">${esc(t('igCta'))}</a>`;
  }

  /* ---------------- 12. scroll motion for every section + reading progress ---------------- */
  let motionIO = null, progressEl = null;
  const MOTION = [
    ['title', 'main > section:not(.hero):not(#story):not(#clay-3d) h2, #v6-pdf h2'],
    ['text', 'main > section:not(.hero):not(#story):not(#clay-3d) :is(.section-marker,.v2-eyebrow,.ki-kicker,.v6-kicker,.section-kicker,.v6-lead,.section-lead,.connect-kicker,.section-heading > p,.v2-section-heading > p)'],
    ['card', ':is(#expertise .specialty-card, #expertise .expertise-card, .ki-price-card, .social-card, .process-list details, #work .project-card, .v6-wait-card, #about .about-copy, #about .about-right, #project-brief .brief-form, .v6-prompt, .v6-chips, .v6-pdf-card, .v6-ig-item, #v5Toolkit, #featured article)'],
    ['img', ':is(.experience-about-photo, #creative-lab .lab-stage, #creative-lab .compare-stage, #showreel .reel-frame)']
  ];
  function setupMotion() {
    const on = effects().scroll !== false && !reduce && 'IntersectionObserver' in window;
    document.documentElement.classList.toggle('v6-motion', on);
    if (!progressEl) { progressEl = document.createElement('div'); progressEl.className = 'v6-progress'; progressEl.setAttribute('aria-hidden', 'true'); document.body.append(progressEl); }
    progressEl.hidden = !on;
    if (!on) return;
    if (!motionIO) motionIO = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return; const el = e.target; motionIO.unobserve(el); el.classList.add('v6-in');
      const delay = (parseFloat(el.style.getPropertyValue('--i')) || 0) * 90 + 1300;
      setTimeout(() => el.classList.remove('v6-rv', 'v6-in', 'v6-rv-title', 'v6-rv-text', 'v6-rv-card', 'v6-rv-img'), delay);
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    for (const [type, sel] of MOTION) {
      let list = []; try { list = $$(sel); } catch { continue; }
      list.forEach((el) => {
        if (el.dataset.v6m) return; el.dataset.v6m = '1';
        const r = el.getBoundingClientRect(); if (r.bottom < 0) return; // already scrolled past: leave as is
        const sibs = el.parentElement ? [...el.parentElement.children].filter((c) => c.dataset.v6m) : [el];
        el.style.setProperty('--i', String(Math.min(6, sibs.indexOf(el))));
        el.classList.add('v6-rv', 'v6-rv-' + type); motionIO.observe(el);
      });
    }
  }
  function updateParallax() {
    if (progressEl && !progressEl.hidden) { const h = document.documentElement.scrollHeight - innerHeight; progressEl.style.transform = `scaleX(${h > 0 ? clamp(scrollY / h) : 0})`; }
    if (reduce || effects().scroll === false) return;
    $$('.v6-orb').forEach((o) => { const r = o.parentElement.getBoundingClientRect(); if (r.bottom < -200 || r.top > innerHeight + 200) return; o.style.translate = `0 ${(r.top * -0.14).toFixed(1)}px`; });
  }

  /* ---------------- wiring ---------------- */
  let scrollRaf = 0;
  const onScroll = () => { if (scrollRaf) return; scrollRaf = requestAnimationFrame(() => { scrollRaf = 0; updateStory(); updateClay(); updateParallax(); }); };
  function renderAll() {
    try { buildPalette(); renderPalette(); } catch (e) { console.warn('v6 palette', e); }
    try { setupGlow(); } catch (e) { console.warn('v6 glow', e); }
    try { setupLiquid(); } catch (e) { console.warn('v6 liquid', e); }
    if (page === 'website') {
      try { renderBrief(); } catch (e) { console.warn('v6 brief', e); }
      try { renderStory(); } catch (e) { console.warn('v6 story', e); }
      try { renderClay(); } catch (e) { console.warn('v6 clay', e); }
      try { setupFeed(); } catch (e) { console.warn('v6 feed', e); }
      renderIg().catch((e) => console.warn('v6 instagram', e));
    } else {
      try { setupSquares(); } catch (e) { console.warn('v6 squares', e); }
      try { renderPdf(); } catch (e) { console.warn('v6 pdf', e); }
    }
    decorate();
    try { setupMotion(); } catch (e) { console.warn('v6 motion', e); }
    updateParallax();
  }
  let queued = false;
  const schedule = () => { if (queued) return; queued = true; setTimeout(() => { queued = false; renderAll(); }, 0); };
  for (const ev of ['karam:cms', 'karam:sections', 'karam:language', 'karam:theme']) addEventListener(ev, schedule);
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', renderAll, { once: true }) : renderAll();
})();
