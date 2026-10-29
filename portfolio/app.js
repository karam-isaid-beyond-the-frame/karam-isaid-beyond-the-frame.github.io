(() => {
  'use strict';
  const cfg = window.PORTFOLIO;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  if (!cfg) { console.error('data.js must be loaded before app.js'); return; }
  // Keep public contact links synced with homepage config.js.
  if (window.KARAM_SITE) {
    if (window.KARAM_SITE.email) cfg.email = window.KARAM_SITE.email;
    if (window.KARAM_SITE.linkedin) cfg.linkedin = window.KARAM_SITE.linkedin;
  }

  // The two sites can be published independently: link back only when configured.
  $$('[data-home-link]').forEach(link=>{
    const homepage = window.KARAM_SITE?.homepage || '';
    if(homepage) {
      link.href=homepage;
      if(/^https?:\/\//i.test(homepage)){link.target='_blank';link.rel='noopener noreferrer';}
    } else link.hidden=true;
  });

  const copy = {
    en: {
      navWork:'Work',navExpertise:'Expertise',navInsights:'Data Lab',navAbout:'About',navContact:"Let's connect",
      heroName:'Karam Isaid',heroEyebrow:'INDEPENDENT CREATIVE PORTFOLIO · 2026',heroIntro:"Hi, I'm Karam Isaid.",heroTitle1:'Ideas into',heroTitle2:'digital impact.',
      heroBody:'I connect digital marketing strategy with powerful visuals — from SEO and landing pages to AI imagery, video editing and measurable campaigns.',
      exploreWork:'Explore my work',exploreData:'View data lab',downloadPortfolio:'Download PDF',heroFoot1:'STRATEGY × DESIGN × TECHNOLOGY',scrollToExplore:'SCROLL TO EXPLORE',artInsights:'CREATIVE INTELLIGENCE',
      workKicker:'SELECTED WORK',workTitle:'Projects that tell a story',workIntro:'Creative execution meets intentional strategy. Choose a category to explore.',workArchive:'PROJECT ARCHIVE',
      projectNotice:'Only published, approved projects are shown here.',
      expertiseKicker:'WHAT I DO',expertiseTitle:'Where creative meets analytical',expertiseIntro:'One connected approach, from research to results.',
      skill1Title:'Digital Marketing',skill1Body:'Audience research, campaign direction, content planning and performance thinking.',
      skill2Title:'SEO & E-commerce',skill2Body:'SEO foundations, landing-page copy, conversion journeys, UTM and reporting.',
      skill3Title:'AI Images & Design',skill3Body:'Art direction, promotional banners, product visuals and AI-assisted imagery.',
      skill4Title:'Video & Editing',skill4Body:'Short-form video, AI storytelling, social edits and campaign-ready motion assets.',
      insightsKicker:'ANALYTICS & PERFORMANCE',insightsTitle:'Proof through data',insightsIntro:'Published campaign figures shared with permission.',
      dashboardName:'Campaign Performance Lab',dashboardSub:'Interactive marketing insights',uploadCsv:'Load CSV',resetDemo:'Reset to published data',chartTitle:'Campaign trend',
      overviewTitle:'YOUR REPORTING SPACE',overviewBody:'Highlight the numbers that matter: spend, sales, clicks, conversion rate and ROAS.',
      asideMetric1:'Tracking',asideMetric2:'Channel',asideMetric3:'Output',
      asideNote:'Imported CSV values stay in this browser and are not published.',csvExample:'↓ Download CSV template',
      aboutKicker:'BEHIND THE WORK',aboutTitle1:'Curious by nature.',aboutTitle2:'Creative by choice.',aboutSide:'A LITTLE ABOUT ME',viewContact:"Let's talk about your project ↗",
      contactKicker:'CONTACT',contactTitle1:'Have a project',contactTitle2:'in mind?',contactBody:'Great work starts with a conversation. Reach out to connect, collaborate or talk ideas.',
      contactLinkedIn:'Connect on LinkedIn',contactEmail:'Email me',footerRights:'— MADE WITH STRATEGY & CURIOSITY',backTop:'BACK TO TOP',
      all:'All projects',marketing:'Marketing',seo:'Web & SEO',ai:'AI visuals',video:'Video',design:'Design',
      viewCase:'View case study',mock:'CONCEPT COVER',photo:'REAL PROJECT IMAGE',videoPill:'VIDEO',challenge:'THE CHALLENGE',solution:'WHAT I DID',deliverable:'DELIVERABLES / RESULTS',
      demoBadge:'DEMO DATA — NOT ACTUAL RESULTS',customBadge:'LOCALLY IMPORTED CSV',publishedBadge:'CONFIGURED DATASET',
      demoStatus:'Illustrative metrics only. No real client data included.',customStatus:'CSV analyzed in this browser only — it is not uploaded or published.',publishedStatus:'Published dataset. Figures shared with permission.',
      metricSpend:'Total ad spend',metricRevenue:'Revenue',metricRoas:'ROAS',metricCtr:'Click-through rate',
      metricCvr:'Conversion rate',metricClicks:'Clicks',metricConversions:'Conversions',metricImpressions:'Impressions',
      metricSubtitle1:'Campaign investment',metricSubtitle2:'Attributed to campaign',metricSubtitle3:'Revenue / spend',metricSubtitle4:'Clicks / impressions',
      revenue:'Revenue',spend:'Spend',roas:'ROAS',ctr:'CTR',chartOf:'over time',
      invalidCsv:'Please upload a CSV with month/date, spend, revenue, impressions, clicks and conversions columns.',emptyCsv:'The CSV must contain at least two valid data rows.',csvError:'Could not read the CSV file.',resetDone:'Published data restored.',loadedDone:'CSV loaded locally. Your public site has not changed.',noProjects:'No projects in this category yet.',
      downloadCV:'Download my CV ↗',privacyNote:'Use client-approved or anonymized data before publishing.',
    },
    ar: {
      navWork:'أعمالي',navExpertise:'مهاراتي',navInsights:'التحليلات',navAbout:'من أنا',navContact:'تواصل معي',
      heroName:'كرم اسعيد',heroEyebrow:'معرض أعمال شخصي · 2026',heroIntro:'أهلاً، أنا كرم رائد اسعيد.',heroTitle1:'من الفكرة',heroTitle2:'إلى تأثير رقمي.',
      heroBody:'بربط استراتيجية التسويق الرقمي مع الإبداع البصري — من SEO وصفحات الهبوط إلى صور الذكاء الاصطناعي، مونتاج الفيديو وتحليل الحملات.',
      exploreWork:'اكتشف أعمالي',exploreData:'استكشف التحليلات',downloadPortfolio:'حمّل PDF',heroFoot1:'استراتيجية × تصميم × تكنولوجيا',scrollToExplore:'اسحب لتكتشف المزيد',artInsights:'التسويق × الإبداع',
      workKicker:'مختارات من الأعمال',workTitle:'كل مشروع إله قصة',workIntro:'تنفيذ إبداعي مبني على تفكير تسويقي واضح. اختر مجالاً لتستكشف المشاريع.',workArchive:'أرشيف المشاريع',
      projectNotice:'تظهر هنا الأعمال المنشورة والمصرّح بعرضها فقط.',
      expertiseKicker:'مجالات عملي',expertiseTitle:'لما الإبداع يلتقي بالتحليل',expertiseIntro:'نهج مترابط يبدأ بالبحث وينتهي بالنتائج.',
      skill1Title:'التسويق الرقمي',skill1Body:'دراسة الجمهور، تخطيط الحملات، استراتيجية المحتوى والتفكير المبني على الأداء.',
      skill2Title:'SEO والتجارة الإلكترونية',skill2Body:'أساسيات تحسين محركات البحث، صفحات الهبوط، رحلة التحويل، UTM والتقارير.',
      skill3Title:'صور AI والتصميم',skill3Body:'التوجيه الفني، البانرات الترويجية، صور المنتجات والتصميم بمساعدة الذكاء الاصطناعي.',
      skill4Title:'الفيديو والمونتاج',skill4Body:'فيديوهات قصيرة، سرد بصري باستخدام AI، مونتاج ريلز ومحتوى فيديو للحملات.',
      insightsKicker:'التحليلات وقياس الأداء',insightsTitle:'الأرقام بتحكي القصة',insightsIntro:'لوحة تحليل بيانات تفاعلية. ابدأ ببيانات تجريبية، أو ارفع ملف CSV معتمد.',
      dashboardName:'لوحة أداء الحملات',dashboardSub:'تحليل تسويقي تفاعلي',uploadCsv:'ارفع CSV',resetDemo:'استعادة البيانات المنشورة',chartTitle:'اتجاه أداء الحملة',
      overviewTitle:'مساحتك للتقارير',overviewBody:'سلّط الضوء على الأهم: الإنفاق، المبيعات، النقرات، معدّل التحويل والعائد الإعلاني.',
      asideMetric1:'التتبّع',asideMetric2:'المنصّات',asideMetric3:'المخرجات',
      asideNote:'ملف CSV ينفتح داخل متصفحك فقط. لنشر الأرقام على موقعك لازم تعدّل campaignData في ملف data.js.',csvExample:'↓ حمّل قالب CSV',
      aboutKicker:'خلف الكواليس',aboutTitle1:'فضولي بطبيعتي.',aboutTitle2:'ومبدع باختياري.',aboutSide:'نبذة عني',viewContact:'خلينا نحكي بمشروعك ↗',
      contactKicker:'تواصل',contactTitle1:'عندك فكرة',contactTitle2:'أو مشروع؟',contactBody:'أحلى المشاريع بتبدأ بمحادثة. تواصل معي لنحكي عن فكرة جديدة أو تعاون.',
      contactLinkedIn:'تواصل عبر LinkedIn',contactEmail:'راسلني عبر الإيميل',footerRights:'— صُنع بشغف وتفكير إبداعي',backTop:'العودة للأعلى',
      all:'كل المشاريع',marketing:'تسويق',seo:'مواقع وSEO',ai:'صور AI',video:'فيديو',design:'تصميم',
      viewCase:'تفاصيل المشروع',mock:'غلاف توضيحي',photo:'صورة المشروع',videoPill:'فيديو',challenge:'التحدّي',solution:'شو عملت',deliverable:'المخرجات / النتائج',
      demoBadge:'بيانات تجريبية — ليست نتائج حقيقية',customBadge:'بيانات CSV محليّة',publishedBadge:'بيانات مضافة للموقع',
      demoStatus:'الأرقام توضيحية فقط، وما فيها أي بيانات عملاء حقيقية.',customStatus:'تم تحليل CSV في متصفحك فقط — ما انرفع ولا اننشر.',publishedStatus:'البيانات موجودة في data.js. انشر الأرقام المصرّح بمشاركتها فقط.',
      metricSpend:'إجمالي الإنفاق الإعلاني',metricRevenue:'الإيرادات',metricRoas:'العائد على الإنفاق ROAS',metricCtr:'معدل النقر CTR',
      metricCvr:'معدل التحويل',metricClicks:'النقرات',metricConversions:'التحويلات',metricImpressions:'مرات الظهور',
      metricSubtitle1:'ميزانية الحملات',metricSubtitle2:'إيرادات الحملة',metricSubtitle3:'الإيرادات ÷ الإنفاق',metricSubtitle4:'النقرات ÷ الظهور',
      revenue:'الإيرادات',spend:'الإنفاق',roas:'ROAS',ctr:'CTR',chartOf:'عبر الوقت',
      invalidCsv:'ارفع ملف CSV فيه أعمدة month أو date و spend و revenue و impressions و clicks و conversions.',emptyCsv:'ملف CSV لازم يحتوي على صفين صحيحين على الأقل.',csvError:'تعذر قراءة ملف CSV.',resetDone:'رجعنا للبيانات التجريبية.',loadedDone:'تم تحميل CSV محلياً. بيانات موقعك المنشور ما تغيرت.',noProjects:'لا توجد مشاريع بهذا القسم حالياً.',
      downloadCV:'حمّل سيرتي الذاتية ↗',privacyNote:'استخدم بيانات معتمدة أو مجهولة الهوية قبل النشر.'
    }
  };
  const filters = ['all','marketing','seo','ai','video','design'];
  const chartMetrics = ['revenue','spend','roas','ctr'];
  const artWords = {
    univera:['UNI','VERA'], smoke:['HOME OF','THE SMOKE'],hala:['HALA','CAFE'],film:['MOTION','STUDIO'],seo:['GROWTH','SYSTEMS'],campaign:['CREATE','TO CONVERT']
  };
  Object.assign(copy.en,{heroSecondary:'Let’s connect',contactInstagram:'Instagram'});Object.assign(copy.ar,{heroSecondary:'لنتواصل',contactInstagram:'إنستغرام'});
  let lang = 'en', selectedFilter = 'all', selectedChartMetric = 'revenue';
  let campaignRows = cfg.campaignData.map(r => ({...r}));
  let sourceType = cfg.campaignDemo ? 'demo' : 'published';
  let openProjectId = null;
  let toastTimeout = null;
  try { const stored = localStorage.getItem('karamPortfolioLang'); if (stored === 'ar') lang = 'ar'; } catch (_) {}
  const t = key => copy[lang][key] || key;
  const byLang = obj => typeof obj === 'string' ? obj : (obj?.[lang] || obj?.en || '');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  
  const safePath=path=>window.KARAM_CMS_CORE.url(path);
  const currentPhoto = p => safePath(p.cover) || safePath(window.KARAM_FALLBACK_PROJECT_IMAGE);

  function applyLanguage() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    $('#langSwitch').textContent = lang === 'ar' ? 'English' : 'عربي';
    $$('[data-i18n]').forEach(el => { const translation = copy[lang][el.dataset.i18n]; if (translation) el.textContent = translation; });

    $('#aboutBody').textContent = byLang(cfg.about);
    $('#aboutLocation').textContent = byLang(cfg.location);
    $('#locationLabel').textContent = byLang(cfg.location);
    $('#copyrightYear').textContent = new Date().getFullYear();
    document.title = lang === 'ar' ? `البورتفوليو — ${byLang(cfg.name)} | ما وراء الإطار` : `Portfolio — ${byLang(cfg.name)} | Beyond the Frame`;
    $('#linkedInLink').href = safePath(cfg.linkedin) || 'https://www.linkedin.com/';
    const email = $('#emailLink');
    if (cfg.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cfg.email)) { email.hidden = false; email.href = 'mailto:' + encodeURIComponent(cfg.email); }
    else { email.hidden = true; }
    const resume = $('#resumeLink');
    if (cfg.resume && safePath(cfg.resume)) { resume.href = safePath(cfg.resume); resume.textContent = t('downloadCV'); resume.setAttribute('download', ''); }
    else { resume.href = '#contact'; resume.textContent = t('viewContact'); resume.removeAttribute('download'); }
    window.dispatchEvent(new CustomEvent('karam:language',{detail:{language:lang}}));
    renderFilters(); renderProjects(); updateDashboard();
    const insights=document.querySelector('#insights');if(insights){const show=campaignRows.length>0&&!cfg.campaignDemo;insights.hidden=!show;insights.style.display=show?'':'none';document.querySelectorAll('a[href="#insights"]').forEach(a=>a.hidden=!show);}
    const target=new URLSearchParams(location.hash.replace(/^#/,'')); const p=target.get('project');if(p&&!$('#projectModal').open&&cfg.projects.some(x=>x.id===p))showModal(p);
    if ($('#projectModal').open && openProjectId) renderModal(cfg.projects.find(p => p.id === openProjectId));
  }
  function renderFilters() {
    $('#projectFilters').innerHTML = filters.filter(f=>f==='all'||cfg.projects.some(p=>p.category===f)).map(filter => `<button class="filter-btn${selectedFilter === filter ? ' active' : ''}" data-filter="${filter}" type="button" aria-pressed="${selectedFilter === filter}">${esc(t(filter))}</button>`).join('');
  }
  function artHTML(p, large = false) {
    const photo = currentPhoto(p), label = photo ? t('photo') : (p.video ? t('videoPill') : t('mock'));
    if(photo&&window.KARAM_CMS_CORE.brandMark(photo))return `<div class="project-brand-cover"><img src="${esc(photo)}" alt="${esc(byLang(p.title))}" loading="${large?'eager':'lazy'}"></div>`;
    // Full project artwork often contains typography. Preserve the complete image.
    if(photo&&large)return `<figure class="project-original-media"><img src="${esc(photo)}" alt="${esc(byLang(p.title))}" decoding="async"></figure>`;
    const title = [byLang(p.title), ''];
    const style = photo ? ` style="background-image:url('${esc(photo)}')"` : '';
    return `<div class="project-art ${esc(p.accent)}${photo ? ' has-photo' : ''}${large ? ' modal-photo' : ''}"${style}><div class="visual-top"><span class="visual-pill">${esc(label)}</span><span class="art-symbol">✳</span></div>${photo ? '' : `<div class="visual-shape"></div><div class="visual-wordmark">${esc(title[0])}<br>${esc(title[1])}<small>STRATEGY × CREATIVE</small></div>`}</div>`;
  }
  function renderProjects() {
    const selected = cfg.projects.filter(p => selectedFilter === 'all' || p.category === selectedFilter);
    if (!selected.length) { $('#projectsGrid').innerHTML = `<p>${esc(t('noProjects'))}</p>`; return; }
    $('#projectsGrid').innerHTML = selected.map(p => `<article class="project-card${p.featured && selectedFilter === 'all' ? ' featured' : ''}">
      <a class="project-image-link" href="#project=${encodeURIComponent(p.id)}" aria-label="${esc(byLang(p.title))}">${artHTML(p)}</a>
      <div class="project-info"><div class="project-overline"><span>${esc((p.project_kind==='personal'?(lang==='ar'?'مشروع شخصي · ':'Personal · '):p.project_kind==='concept'?(lang==='ar'?'تجربة إبداعية · ':'Concept · '):'')+byLang(p.type))}</span><span>${esc(p.year)}</span></div>
      <h3>${esc(byLang(p.title))}</h3><p>${esc(byLang(p.short))}</p>
      <div class="project-footer"><div class="project-tags">${p.tags.slice(0,2).map(tag=>`<span class="project-tag">${esc(tag)}</span>`).join('')}</div><button class="project-open" data-open-project="${esc(p.id)}" aria-label="${esc(t('viewCase') + ': ' + byLang(p.title))}">${esc(t('viewCase'))}<span>↗</span></button></div>
      </div></article>`).join('');
  }
  function renderModal(p) {
    if (!p) return;
    const video = safePath(p.video);
    const media = video ? `${artHTML(p,true)}<video class="modal-video" src="${esc(video)}" controls playsinline preload="metadata">Your browser does not support embedded video.</video>` : artHTML(p,true);
    const comparisons=[[lang==='ar'?'قبل':'Before',p.before],[lang==='ar'?'بعد':'After',p.after]].filter(([label,url])=>safePath(url));
    const compareHTML=comparisons.length?'<div class="ki-project-gallery ki-comparisons">'+comparisons.map(([label,url])=>'<figure><img loading="lazy" alt="'+esc(label)+'" src="'+esc(url)+'"><figcaption>'+esc(label)+'</figcaption></figure>').join('')+'</div>':'';
    stopProjectMedia();
    projectMedia=[...new Set(Array.isArray(p.gallery)?p.gallery:[])].map(window.KARAM_CMS_CORE.media).filter(Boolean).slice(0,250);projectMediaFilter='all';projectMediaLimit=9;
    $('#modalContent').innerHTML = `${media}<div class="modal-body"><div class="modal-meta">${esc(byLang(p.type).toUpperCase())} / ${esc(p.year)}</div><h2>${esc(byLang(p.title))}</h2><p class="modal-description">${esc(byLang(p.short))}</p>
      <div class="modal-rows">${[['challenge',p.challenge],['solution',p.solution]].filter(([,value])=>byLang(value)).map(([label,value])=>'<div><h3>'+esc(t(label))+'</h3><p>'+esc(byLang(value))+'</p></div>').join('')}</div>
      ${byLang(p.results)?'<div class="modal-result"><h3>'+esc(t('deliverable'))+'</h3><p>'+esc(byLang(p.results))+'</p></div>':''}</div>${compareHTML}<section id="projectArchive" class="project-archive" aria-label="${lang==='ar'?'أرشيف المشروع':'Project archive'}"></section>`;
    renderProjectArchive(p);
  }
  let projectMedia=[],projectMediaFilter='all',projectMediaLimit=9,instagramScriptPromise;
  function stopProjectMedia(){
    document.querySelectorAll('#projectModal video').forEach(v=>v.pause());
    document.querySelectorAll('#projectModal [data-embed-slot]').forEach(slot=>slot.replaceChildren());
  }
  function renderProjectArchive(p=cfg.projects.find(p=>p.id===openProjectId)){
    const host=$('#projectArchive');if(!host||!p)return;stopProjectMedia();
    if(!projectMedia.length){host.hidden=true;return;}host.hidden=false;
    const ar=lang==='ar',filtered=projectMedia.map((item,index)=>({...item,index})).filter(item=>projectMediaFilter==='all'||(item.kind||item.type)===projectMediaFilter),shown=filtered.slice(0,projectMediaLimit);
    const tabs=[['all',ar?'الكل':'All'],['image',ar?'صور ومنشورات':'Images & posts'],['video',ar?'فيديو وريلز':'Videos & reels']];
    host.innerHTML=`<div class="project-archive-heading"><h3>${ar?'داخل المشروع':'Inside the project'}</h3><p>${ar?'الأعمال والقصص البصرية الخاصة بهذا المشروع.':'The work and visual stories behind this project.'}</p></div><div class="project-archive-filters" role="group" aria-label="${ar?'نوع المحتوى':'Content type'}">${tabs.map(([key,text])=>`<button type="button" data-archive-filter="${key}" aria-pressed="${projectMediaFilter===key}">${text}</button>`).join('')}</div><div class="ki-project-gallery project-media-grid">${shown.map(item=>{
      const title=esc(byLang(p.title)+' — '+(item.index+1));
      if(item.type==='video')return `<figure class="project-media-item"><video controls playsinline preload="none" src="${esc(item.url)}" aria-label="${title}"></video></figure>`;
      if(item.type==='image')return `<figure class="project-media-item"><img loading="lazy" src="${esc(item.url)}" alt="${title}"></figure>`;
      return `<article class="project-media-item project-social-item"><div class="project-social-label">Instagram ${item.kind==='video'?'Reel':'Post'}</div><div data-embed-slot="${item.index}"></div><button type="button" data-instagram-load="${item.index}">${ar?'عرض منشور إنستغرام':'Load Instagram post'}</button><p class="project-social-note">${ar?'يُحمّل المحتوى من إنستغرام عند الضغط.':'Content loads from Instagram when you choose.'}</p><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${ar?'افتح الأصل على إنستغرام':'Open original on Instagram'}</a><p role="status" data-embed-message="${item.index}"></p></article>`;
    }).join('')}</div><p class="project-archive-count" role="status">${ar?'المعروض':'Showing'} ${shown.length} / ${filtered.length}</p>${shown.length<filtered.length?`<button type="button" class="project-archive-more" data-archive-more>${ar?'عرض المزيد':'Show more'}</button>`:''}`;
  }
  async function loadInstagramPost(index){
    const item=projectMedia[index];if(item?.type!=='instagram')return;
    const slot=document.querySelector(`[data-embed-slot="${index}"]`),button=document.querySelector(`[data-instagram-load="${index}"]`);if(!slot||!button)return;
    stopProjectMedia();button.disabled=true;
    const block=document.createElement('blockquote');block.className='instagram-media';block.dataset.instgrmPermalink=item.url;block.dataset.instgrmVersion='14';
    const link=document.createElement('a');link.href=item.url;link.textContent=lang==='ar'?'عرض المنشور الأصلي':'View original post';block.append(link);slot.append(block);
    try{
      if(!window.instgrm){
        if(!instagramScriptPromise)instagramScriptPromise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://www.instagram.com/embed.js';script.async=true;script.onload=resolve;script.onerror=()=>{instagramScriptPromise=null;script.remove();reject(Error('Instagram unavailable'));};document.head.append(script);});
        await instagramScriptPromise;
      }
      window.instgrm?.Embeds?.process();
    }catch{document.querySelector(`[data-embed-message="${index}"]`).textContent=lang==='ar'?'تعذّر تحميل التضمين. رابط المنشور الأصلي متاح.':'The embed could not load. The original post link is available.';}
    finally{button.disabled=false;}
  }
  function showModal(id) { const p = cfg.projects.find(item => item.id === id); if (!p) return; openProjectId = id; renderModal(p);if(!$('#projectModal').open)$('#projectModal').showModal();const target=new URL(location.href);target.hash='project='+encodeURIComponent(id);history.replaceState(null,'',target); }
  function toast(message) { const el=$('#toast'); el.textContent=message; el.classList.add('show'); if (toastTimeout) clearTimeout(toastTimeout); toastTimeout=setTimeout(() => el.classList.remove('show'),3500); }
  function total(key) { return campaignRows.reduce((a,r)=>a+(Number(r[key])||0),0); }
  function ratio(top,bottom) { return bottom > 0 ? top/bottom : null; }
  function fmtNumber(v, decimals=0) { if(v===null || !Number.isFinite(v)) return '—'; return new Intl.NumberFormat(lang==='ar'?'ar-JO':'en-US',{maximumFractionDigits:decimals,minimumFractionDigits:decimals}).format(v); }
  function fmtMoney(v) { if(v===null) return '—'; return '$'+fmtNumber(v); } // Change $ if your metrics use a different currency.
  function formatMetric(key, value) {
    if(value === null || !Number.isFinite(value)) return '—';
    if(['spend','revenue'].includes(key)) return fmtMoney(value);
    if(key === 'roas') return fmtNumber(value,2)+'×';
    if(['ctr','cvr'].includes(key)) return fmtNumber(value*100,2)+'%';
    return fmtNumber(value);
  }
  function campaignTotals() { const spend=total('spend'),revenue=total('revenue'),impressions=total('impressions'),clicks=total('clicks'),conversions=total('conversions'); return {spend,revenue,impressions,clicks,conversions,roas:ratio(revenue,spend),ctr:ratio(clicks,impressions),cvr:ratio(conversions,clicks)}; }
  function metricFromRow(row,key) {
    if(key==='roas') return ratio(row.revenue,row.spend);
    if(key==='ctr') return ratio(row.clicks,row.impressions);
    if(key==='cvr') return ratio(row.conversions,row.clicks);
    return Number(row[key])||0;
  }
  function updateDashboard() {
    const state = sourceType === 'demo' ? 'demo' : sourceType === 'custom' ? 'custom' : 'published';
    $('#dataBadge').textContent = t(state+'Badge');
    $('#dataStatus').textContent = t(state+'Status');
    const sums=campaignTotals();
    const kpis = [
      ['metricSpend','spend','metricSubtitle1'], ['metricRevenue','revenue','metricSubtitle2'],
      ['metricRoas','roas','metricSubtitle3'], ['metricCtr','ctr','metricSubtitle4']
    ];
    $('#kpiGrid').innerHTML = kpis.map(([label,key,sub])=>`<div class="kpi-card"><div class="kpi-caption">${esc(t(label))}</div><div class="kpi-number">${esc(formatMetric(key,sums[key]))}</div><div class="kpi-sub">${esc(t(sub))}</div></div>`).join('');
    $('#chartOptions').innerHTML=chartMetrics.map(key=>`<button class="chart-option${selectedChartMetric===key?' active':''}" data-chart="${key}" aria-pressed="${selectedChartMetric===key}">${esc(t(key))}</button>`).join('');
    $('#chartMetricName').textContent = t(selectedChartMetric) + ' ' + t('chartOf');
    drawChart(); renderDataTable();
  }
  function drawChart(){
    const svg=$('#campaignChart');
    if(!campaignRows.length){svg.replaceChildren();$('#chartLabels').replaceChildren();return;}
    const values=campaignRows.map(r=>metricFromRow(r,selectedChartMetric) ?? 0);
    const max=Math.max(1,...values)*1.17, left=58, right=620, top=24, bottom=210;
    const points=values.map((v,i)=>[left+i*(right-left)/Math.max(values.length-1,1),bottom-(v/max)*(bottom-top)]);
    const line=points.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const area=line+` L${points[points.length-1][0].toFixed(1)},${bottom} L${left},${bottom} Z`;
    let grid='';
    for(let n=0;n<4;n++){
      const y=bottom-n*(bottom-top)/3;
      const raw=max*n/3;
      let value=selectedChartMetric==='roas'?fmtNumber(raw,1)+'x':selectedChartMetric==='ctr'?fmtNumber(raw*100,1)+'%':selectedChartMetric==='revenue'||selectedChartMetric==='spend'?'$'+fmtNumber(raw):fmtNumber(raw);
      grid+=`<line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="#37515d" stroke-dasharray="3 6" stroke-width=".7" opacity=".9"/><text x="${left-13}" y="${y+4}" text-anchor="end" fill="#8aa1ad" font-size="11" font-family="Arial,sans-serif">${esc(value)}</text>`;
    }
    svg.innerHTML=`<defs><linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#9befd6" stop-opacity=".27"/><stop offset="1" stop-color="#9befd6" stop-opacity="0"/></linearGradient></defs>${grid}<path d="${area}" fill="url(#chartGradient)"/><path d="${line}" fill="none" stroke="#9befd6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${points.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="4.2" fill="#aef9e0" stroke="#10242b" stroke-width="2"/>`).join('')}`;
    $('#chartLabels').innerHTML=campaignRows.map(r=>`<span>${esc(r.month)}</span>`).join('');
  }
  function renderDataTable(){
    const el=$('#dataTable'); if(!el) return;
    const columns=[['month','Period'],['spend',t('spend')],['revenue',t('revenue')],['impressions',t('metricImpressions')],['clicks',t('metricClicks')],['conversions',t('metricConversions')]];
    el.innerHTML=`<table><thead><tr>${columns.map(([key,label])=>`<th>${esc(label)}</th>`).join('')}</tr></thead><tbody>${campaignRows.map(row=>`<tr>${columns.map(([key])=>`<td>${esc(key==='month'?row.month:formatMetric(key,row[key]))}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  function parseCSV(text){
    // Simple CSV parser supporting commas, newlines and quoted fields (including escaped quotes).
    const rows=[]; let row=[],field='',quoted=false;
    const input=text.replace(/^\uFEFF/,'');
    for(let i=0;i<input.length;i++){
      const ch=input[i];
      if(ch==='"') { if(quoted && input[i+1]==='"'){field+='"';i++;}else quoted=!quoted; }
      else if(ch===','&&!quoted){row.push(field.trim());field='';}
      else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r' && input[i+1]==='\n')i++;row.push(field.trim());field='';if(row.some(Boolean))rows.push(row);row=[];}
      else field+=ch;
    }
    row.push(field.trim());if(row.some(Boolean))rows.push(row);
    if(rows.length<3) throw new Error(t('emptyCsv'));
    const headers=rows.shift().map(h=>h.toLowerCase().trim());
    let periodIndex=headers.indexOf('month');if(periodIndex<0)periodIndex=headers.indexOf('date');
    const fields=['spend','revenue','impressions','clicks','conversions'];
    if(periodIndex<0||fields.some(k=>!headers.includes(k)))throw new Error(t('invalidCsv'));
    const output=rows.map(cells=>{
      const result={month:cells[periodIndex]||'—'};
      fields.forEach(key=>{
        const val=(cells[headers.indexOf(key)]||'0').replace(/[\s,$]/g,'');
        result[key]=Number(val);
      });
      return result;
    }).filter(row=>fields.every(key=>Number.isFinite(row[key])&&row[key]>=0));
    if(output.length<2) throw new Error(t('emptyCsv'));
    return output.slice(0,24);
  }
  function bindEvents(){
    $('#langSwitch').addEventListener('click',()=>{lang=lang==='en'?'ar':'en';try{localStorage.setItem('karamPortfolioLang',lang);}catch(_){}applyLanguage();});
    $('#menuButton').addEventListener('click',()=>{const expanded=$('#menuButton').getAttribute('aria-expanded')==='true';$('#menuButton').setAttribute('aria-expanded',String(!expanded));$('#mobileNav').classList.toggle('open',!expanded);});
    $$('#mobileNav a').forEach(a=>a.addEventListener('click',()=>{$('#mobileNav').classList.remove('open');$('#menuButton').setAttribute('aria-expanded','false');}));
    $('#projectFilters').addEventListener('click',event=>{const btn=event.target.closest('[data-filter]');if(!btn)return;selectedFilter=btn.dataset.filter;renderFilters();renderProjects();});
    $('#projectsGrid').addEventListener('click',event=>{const btn=event.target.closest('[data-open-project]');if(btn)showModal(btn.dataset.openProject);});
    $('#closeModal').addEventListener('click',()=>$('#projectModal').close());
    $('#projectModal').addEventListener('click',event=>{if(event.target===$('#projectModal'))$('#projectModal').close();});
    $('#projectModal').addEventListener('close',()=>{stopProjectMedia();const target=new URL(location.href),params=new URLSearchParams(target.hash.slice(1));if(params.has('project')){params.delete('project');target.hash=params.toString();history.replaceState(null,'',target);}openProjectId=null;});
    $('#modalContent').addEventListener('click',event=>{
      const button=event.target.closest('button');if(!button)return;
      if(button.dataset.archiveFilter){projectMediaFilter=button.dataset.archiveFilter;projectMediaLimit=9;renderProjectArchive();}
      if(button.hasAttribute('data-archive-more')){projectMediaLimit+=9;renderProjectArchive();}
      if(button.hasAttribute('data-instagram-load'))loadInstagramPost(Number(button.dataset.instagramLoad));
    });
    $('#projectModal').addEventListener('play',event=>{if(event.target.tagName==='VIDEO')document.querySelectorAll('#projectModal video').forEach(v=>{if(v!==event.target)v.pause();});},true);
    $('#chartOptions').addEventListener('click',event=>{const btn=event.target.closest('[data-chart]');if(!btn)return;selectedChartMetric=btn.dataset.chart;updateDashboard();});
    $('#resetData').addEventListener('click',()=>{campaignRows=cfg.campaignData.map(r=>({...r}));sourceType=cfg.campaignDemo?'demo':'published';$('#csvUpload').value='';updateDashboard();toast(t('resetDone'));});
    $('#csvUpload').addEventListener('change',async event=>{
      const file=event.target.files?.[0];if(!file)return;
      try{if(file.size>1000000)throw new Error('CSV file is too large (max 1 MB).');const content=await file.text();const parsed=parseCSV(content);campaignRows=parsed;sourceType='custom';updateDashboard();toast(t('loadedDone'));}
      catch(error){toast(error?.message||t('csvError'));}
    });
    window.addEventListener('scroll',()=>$('#top').classList.toggle('scrolled',window.scrollY>20),{passive:true});
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}})},{threshold:.08}) : null;
    $$('.reveal').forEach(el=>observer?observer.observe(el):el.classList.add('visible'));
    // Avoid scroll-linked animation on touch devices; all visuals remain functional without it.
    if(window.matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches){
      let last=0;document.addEventListener('pointermove',e=>{if(Date.now()-last<50)return;last=Date.now();const el=$('.cursor-glow');el.style.left=(e.clientX-150)+'px';el.style.top=(e.clientY-150)+'px';},{passive:true});
    }
  }
  window.addEventListener('hashchange',()=>{const id=new URLSearchParams(location.hash.replace(/^#/,'')).get('project');if(id&&cfg.projects.some(p=>p.id===id))showModal(id);});
  // Translation overrides for every portfolio section from the cloud editor.
  window.addEventListener('karam:sections',event=>{
    if(event.detail.page!=='portfolio')return;
    for(const section of event.detail.sections){
      for(const code of ['en','ar']){
        for(const [key,value] of Object.entries(section.content?.[code]||{})){
          if(typeof value==='string'&&value.trim())copy[code][key]=value;
        }
      }
    }
    applyLanguage();
  });
  window.addEventListener('karam:cms',event=>{
    const {services}=event.detail;
    if(true){
      const grid=$('.expertise-grid');
      grid.replaceChildren(...services.map((svc,i)=>{
        const article=document.createElement('article');article.className='expertise-card reveal visible';
        const no=document.createElement('span');no.className='expertise-number';no.textContent=String(i+1).padStart(2,'0')+' / CREATIVE';
        const icon=document.createElement('div');icon.className='expertise-icon';icon.textContent=svc.icon||'✳';
        const title=document.createElement('h3');title.dataset.i18n='skill'+(i+1)+'Title';
        const desc=document.createElement('p');desc.dataset.i18n='skill'+(i+1)+'Body';
        const tag=document.createElement('span');tag.className='expertise-tag';tag.textContent='STRATEGY · QUALITY · DELIVERY';
        article.append(no,icon,title,desc,tag);return article;
      }));
    }
    services.forEach((s,i)=>{
      const n=i+1;
      copy.en['skill'+n+'Title']=s.title_en;
      copy.ar['skill'+n+'Title']=s.title_ar||s.title_en;
      copy.en['skill'+n+'Body']=s.description_en;
      copy.ar['skill'+n+'Body']=s.description_ar||s.description_en;
    });
    campaignRows=cfg.campaignData.map(r=>({...r}));
    sourceType=cfg.campaignDemo?'demo':'published';
    applyLanguage();
  });
  document.addEventListener('DOMContentLoaded',()=>{bindEvents();applyLanguage();});
})();
