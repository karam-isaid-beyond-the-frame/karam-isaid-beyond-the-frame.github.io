/* V5 "Creative Studio" layer.
   Adds visual modules around the existing CMS-driven homepage without changing how content is stored:
   - a toolkit band (tools Karam confirmed he uses; edit the list in config.js → tools)
   - live mini-visuals inside the three "What I do" cards + a wide video-editing card
   - an Adams Clay brand board built from the published Adams Clay project record
   - a blurred backdrop behind the showreel player
   Every module is self-contained: no pinned sections and no scroll-linked effects between sections. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lang = () => document.documentElement.lang === 'ar' ? 'ar' : 'en';
  const base = new URL('.', document.currentScript?.src || location.href);
  const asset = p => new URL(p, base).href;
  const core = () => window.KARAM_CMS_CORE;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const DEFAULT_TOOLS = {
    marketing: ['Meta Ads Manager', 'Google Analytics 4', 'Google Ads', 'Search Console'],
    design: ['Canva'],
    ai: ['ChatGPT', 'Claude', 'Gemini', 'Grok', 'Qwen', 'Runway', 'Kling', 'Veo', 'Omni 1.1'],
    video: ['CapCut']
  };
  const tools = () => {
    const t = window.KARAM_SITE?.tools;
    return t && typeof t === 'object' ? { ...DEFAULT_TOOLS, ...t } : DEFAULT_TOOLS;
  };
  const ICON = {
    marketing: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>',
    design: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M3 15l5-5 4 4 3-3 6 6"/></svg>',
    ai: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>',
    video: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="5" width="15" height="14" rx="3"/><path d="M17 10l5-3v10l-5-3"/></svg>'
  };
  const chip = (k, n) => `<span class="v5-chip" data-k="${k}">${ICON[k]}${esc(n)}</span>`;

  const T = {
    en: {
      toolsLabel: 'Tools I use', reach: 'Reach', engage: 'Engagement', action: 'Action',
      serpTitle: 'Karam Isaid — Digital Creative', serpDesc: 'Digital marketing, visual design and AI video. Portfolio, showreel and case studies.',
      prompt: 'PROMPT', note: 'Illustrative prompt', gen: 'Generate',
      prompts: ['Cinematic portrait at golden hour, city rooftop, warm film grain, 9:16', 'Friendly 3D character explaining SEO at a desk, soft studio light', 'Editorial poster, burgundy backdrop, flying web pages, bold serif title'],
      vEye: 'Video & motion', vTitle: 'Short-form editing that keeps people watching.', vText: 'Reels and short films cut for the feed, with AI-generated shots where they help the story.',
      clayEye: 'My own brand', clayCta: 'Open the archive', clayItems: 'items', palette: 'Brand palette', paletteText: 'Clay, glaze blue, sand, black and sage, taken from the product shots.', quoteNote: 'The line on the Adams Clay logo', product: 'Product imagery', post: 'Social post', ways: 'Colourways'
    },
    ar: {
      toolsLabel: 'الأدوات اللي بستخدمها', reach: 'الوصول', engage: 'التفاعل', action: 'الإجراء',
      serpTitle: 'Karam Isaid — Digital Creative', serpDesc: 'Digital marketing, visual design and AI video. Portfolio, showreel and case studies.',
      prompt: 'برومبت', note: 'برومبت توضيحي', gen: 'توليد',
      prompts: ['بورتريه سينمائي وقت الغروب على سطح بالمدينة، حبيبات فيلم دافئة، 9:16', 'شخصية ثلاثية الأبعاد ودودة تشرح SEO على مكتب، إضاءة ستوديو ناعمة', 'بوستر تحريري بخلفية برغندية وصفحات ويب طايرة وعنوان سيريف عريض'],
      vEye: 'المونتاج والفيديو', vTitle: 'مونتاج قصير يخلي الناس تكمل المشاهدة.', vText: 'ريلز وأفلام قصيرة مقصوصة للسوشال، مع لقطات بالذكاء الاصطناعي لما تخدم القصة.',
      clayEye: 'علامتي الخاصة', clayCta: 'افتح الأرشيف', clayItems: 'عنصر', palette: 'ألوان العلامة', paletteText: 'فخار، أزرق، رملي، أسود وأخضر، مأخوذة من صور المنتج.', quoteNote: 'العبارة الموجودة على شعار آدمز كلاي', product: 'صور المنتج', post: 'منشور سوشال', ways: 'الألوان'
    }
  };
  const t = k => T[lang()][k] ?? T.en[k];

  /* ---------- 1. toolkit band ---------- */
  function toolkit() {
    const hero = $('section.hero');
    if (!hero) return;
    let band = $('#v5Toolkit');
    if (!band) {
      band = document.createElement('section');
      band.id = 'v5Toolkit'; band.className = 'v5-toolkit';
      hero.after(band);
    }
    band.setAttribute('aria-label', t('toolsLabel'));
    const all = Object.entries(tools()).flatMap(([k, list]) => (Array.isArray(list) ? list : []).map(n => chip(k, n)));
    const half = Math.ceil(all.length / 2), a = all.slice(0, half).join(''), b = all.slice(half).join('');
    const names = Object.values(tools()).flat().filter(n => typeof n === 'string');
    band.innerHTML = `<h2 class="v5-sr">${esc(t('toolsLabel'))}</h2><ul class="v5-sr">${names.map(n => `<li>${esc(n)}</li>`).join('')}</ul><div class="v5-mq" aria-hidden="true">${reduce ? a + b : a + a + a + a}</div>${reduce ? '' : `<div class="v5-mq v5-rev" aria-hidden="true">${b}${b}${b}${b}</div>`}`;
  }

  /* ---------- 2. "What I do" visuals ---------- */
  let promptTimer = 0, promptIndex = 0;
  function vizMarketing() {
    return `<div class="v5-viz" aria-hidden="true"><div class="v5-funnel">
      <div class="v5-fbar"><span>${esc(t('reach'))}</span><i></i><i></i><i></i></div>
      <div class="v5-fbar"><span>${esc(t('engage'))}</span><i></i><i></i></div>
      <div class="v5-fbar"><span>${esc(t('action'))}</span><i></i></div></div>
      <div class="v5-serp" dir="ltr"><span class="u">karam-isaid-portfolio.vercel.app</span><span class="t">${esc(t('serpTitle'))}</span><span class="d">${esc(t('serpDesc'))}</span></div></div>`;
  }
  function vizAI() {
    const imgs = ['assets/brand/posters/beyond-the-frame.jpg', 'assets/instagram/personal/DfANPCvOdeS.jpg', 'assets/brand/posters/seo-behind-the-result.jpg']
      .map(p => `<img src="${asset(p)}" alt="" loading="lazy">`).join('');
    return `<div class="v5-viz" aria-hidden="true"><div class="v5-ai"><div class="v5-prompt">
      <span class="lbl">${ICON.ai}${esc(t('prompt'))}</span><p class="txt"></p>
      <div class="gen"><span>${esc(t('note'))}</span><b>${esc(t('gen'))}</b></div></div>
      <div class="v5-out">${imgs}<span class="scan"></span></div></div></div>`;
  }
  function typePrompt() {
    clearTimeout(promptTimer);
    const box = $('#expertise .v5-prompt .txt'), out = $('#expertise .v5-out');
    if (!box || !out) return;
    const list = t('prompts'), s = list[promptIndex % list.length], imgs = $$('img', out);
    imgs.forEach(i => i.classList.remove('on'));
    if (reduce) { box.textContent = s; imgs[promptIndex % imgs.length]?.classList.add('on'); return; }
    let k = 0; box.textContent = ''; out.classList.remove('scanning');
    const step = () => {
      box.textContent = s.slice(0, ++k);
      if (k < s.length) { promptTimer = setTimeout(step, 32); return; }
      out.classList.add('scanning');
      promptTimer = setTimeout(() => {
        out.classList.remove('scanning'); imgs[promptIndex % imgs.length]?.classList.add('on');
        promptTimer = setTimeout(() => { promptIndex++; typePrompt(); }, 3200);
      }, 1300);
    };
    step();
  }
  function vizVideo() {
    const frames = ['assets/brand/posters/beyond-the-frame-frame.jpg', 'assets/brand/posters/beyond-the-frame.jpg', 'assets/instagram/personal/De6-0GtjrKh.jpg', 'assets/brand/posters/seo-behind-the-result.jpg', 'assets/instagram/personal/DfANPCvOdeS.jpg']
      .map(p => `<img src="${asset(p)}" alt="" loading="lazy">`).join('');
    return `<div class="v5-viz v5-tl" aria-hidden="true">
      <div class="top"><span>9:16 · 0:23</span><span class="v5-tc">00:00:00</span></div>
      <div class="tracks"><div class="track text"><span style="flex:2"></span><span style="flex:1"></span><span style="flex:3"></span></div>
        <div class="track clips">${frames}</div><div class="track audio"></div><span class="head"></span></div></div>`;
  }
  const kindOf = (title, i) => {
    const s = (title || '').toLowerCase();
    if (/video|motion|reel|فيديو|مونتاج|موشن/.test(s)) return 'video';
    if (/visual|design|ai|تصميم|صور|بصري/.test(s)) return 'ai';
    if (/market|seo|growth|تسويق/.test(s)) return 'marketing';
    return ['marketing', 'ai', 'video'][i] || 'marketing';
  };
  function expertise() {
    const cards = $$('#expertise .specialty-card');
    if (!cards.length) return;
    const tl = tools(), videoGen = ['Runway', 'Kling', 'Veo', 'Omni 1.1'];
    const viz = { marketing: vizMarketing, ai: vizAI, video: vizVideo };
    const chipsFor = {
      marketing: () => (tl.marketing || []).map(n => chip('marketing', n)),
      ai: () => [...(tl.design || []).map(n => chip('design', n)), ...(tl.ai || []).filter(n => !videoGen.includes(n)).map(n => chip('ai', n))],
      video: () => [...(tl.video || []).map(n => chip('video', n)), ...(tl.ai || []).filter(n => videoGen.includes(n)).map(n => chip('ai', n))]
    };
    const used = new Set();
    cards.slice(0, 3).forEach((card, i) => {
      let k = kindOf($('h3', card)?.textContent, i);
      if (used.has(k)) k = ['marketing', 'ai', 'video'].find(x => !used.has(x)) || k;
      used.add(k);
      card.classList.add('v5-card'); card.dataset.v5 = k;
      $('.v5-viz', card)?.remove();
      card.insertAdjacentHTML('afterbegin', viz[k]());
      let chips = $('.v5-chips', card);
      if (!chips) { chips = document.createElement('div'); chips.className = 'v5-chips'; card.append(chips); }
      chips.innerHTML = chipsFor[k]().join('');
    });
    typePrompt();
  }
  let tcStart = performance.now();
  function tickTimecode(now) {
    const el = $('#expertise .v5-tc');
    if (el) { const s = ((now - tcStart) / 1000) % 9 * (23 / 9); el.textContent = '00:00:' + String(Math.floor(s)).padStart(2, '0'); }
    if (!reduce) requestAnimationFrame(tickTimecode);
  }

  /* ---------- 3. Adams Clay brand board (from the published project) ---------- */
  function clay() {
    const data = window.KARAM_CMS_DATA;
    const anchor = $('#ki-featured-carousel') || $('#featured');
    let sec = $('#v5Clay');
    const p = data?.projects?.find(x => x.id === 'adams-clay');
    if (!p || !anchor) { sec?.remove(); return; }
    const images = (p.gallery || []).map(u => core()?.media(u)).filter(m => m && m.type === 'image').map(m => m.url);
    if (images.length < 3) { sec?.remove(); return; }
    const pick = name => images.find(u => u.includes(name));
    const big = pick('product-visual') || images[0];
    const rest = images.filter(u => u !== big);
    const l = lang(), title = p.title[l] || p.title.en, short = p.short[l] || p.short.en;
    const logo = p.cover && core()?.brandMark(p.cover) ? p.cover : '';
    const portfolio = new URL('portfolio/#project=adams-clay', base).href;
    if (!sec) { sec = document.createElement('section'); sec.id = 'v5Clay'; sec.className = 'v5-clay'; anchor.after(sec); }
    sec.setAttribute('aria-labelledby', 'v5ClayTitle');
    sec.innerHTML = `<div class="shell">
      <div class="v5-clay-head">
        <div class="v5-clay-title">${logo ? `<img src="${esc(logo)}" alt="Adams Clay logo">` : ''}<div><p class="v5-eye">${esc(t('clayEye'))}</p><h2 id="v5ClayTitle">${esc(title)}</h2></div></div>
        <p class="v5-clay-lead">${esc(short)}</p>
        <a class="v5-btn" href="${esc(portfolio)}">${esc(t('clayCta'))} · ${p.gallery.length} ${esc(t('clayItems'))} ↗</a>
      </div>
      <div class="v5-clay-grid">
        <figure class="v5-tile big"><img src="${esc(big)}" alt="${esc(title)}" loading="lazy"><figcaption class="v5-tag">${esc(t('product'))}</figcaption></figure>
        <div class="v5-tile v5-pal"><div class="row"><span style="background:#C47A4E"></span><span style="background:#2F6FA8"></span><span style="background:#E8E1D4"></span><span style="background:#1C1C1E"></span><span style="background:#6F8C7C"></span></div><div><h3>${esc(t('palette'))}</h3><p>${esc(t('paletteText'))}</p></div></div>
        ${rest[0] ? `<figure class="v5-tile"><img src="${esc(rest[0])}" alt="" loading="lazy"><figcaption class="v5-tag">${esc(t('ways'))}</figcaption></figure>` : ''}
        ${rest[1] ? `<figure class="v5-tile"><img src="${esc(rest[1])}" alt="" loading="lazy"><figcaption class="v5-tag">${esc(t('post'))}</figcaption></figure>` : ''}
        <div class="v5-tile v5-quote"><p dir="ltr">“Where art<br>meets earth.”</p><span>${esc(t('quoteNote'))}</span></div>
      </div></div>`;
  }

  /* ---------- 4. showreel backdrop ---------- */
  function reelBackdrop() {
    const frame = $('#showreel .reel-frame'), video = $('#reelVideo');
    if (!frame || !video) return;
    let bg = $('.v5-reel-bg', frame);
    const poster = video.getAttribute('poster');
    if (!poster || video.hidden) { bg?.remove(); frame.classList.remove('v5-has-bg'); return; }
    if (!bg) { bg = document.createElement('img'); bg.className = 'v5-reel-bg'; bg.alt = ''; bg.setAttribute('aria-hidden', 'true'); frame.prepend(bg); }
    if (bg.getAttribute('src') !== poster) bg.src = poster;
    frame.classList.add('v5-has-bg');
  }

  function render() { toolkit(); expertise(); $('#v5Clay')?.remove(); reelBackdrop(); } /* V6 replaces the clay board with the 3D section */
  let queued = false;
  const schedule = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; render(); }); };
  for (const ev of ['karam:cms', 'karam:sections', 'karam:language']) window.addEventListener(ev, schedule);
  const start = () => {
    render();
    if (!reduce) requestAnimationFrame(tickTimecode);
    const video = $('#reelVideo');
    if (video) new MutationObserver(reelBackdrop).observe(video, { attributes: true, attributeFilter: ['poster', 'hidden', 'src'] });
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start, { once: true }) : start();
})();
