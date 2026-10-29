(() => {
  'use strict';
  const cfg = window.KARAM_SITE || {};
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const translations = {
    en: {
      navHome:'Home',navAbout:'About me',navExpertise:'Services',navProjects:'My work',navContact:'Contact',navPortfolio:'Portfolio',
      heroName:'Karam Isaid',heroRole:'Digital Creative',heroSkill1:'Digital marketing',heroSkill2:'Visual design',heroSkill3:'AI video',eyebrow:'WELCOME TO MY DIGITAL SPACE',greeting:"HI, I'M KARAM ISAID",heroLine1:'Creative',heroLine2:'Thinking.',heroLine3:'Real Impact.',
      heroSubline:'DIGITAL MARKETING • VISUAL DESIGN • AI VIDEO',heroNote:'REAL WORK.',heroIntro:'I blend digital marketing with thoughtful design and AI-powered storytelling to transform ideas into experiences worth remembering.',
      viewWork:'Explore my portfolio',reachOut:"Let's connect",scroll:'SCROLL TO DISCOVER',aboutMarker:'01 / ABOUT ME',
      aboutHeadline:'I create with purpose.',aboutLead:'A digital marketer with a creative eye and a hands-on mindset.',
      aboutBody:'I work across e-commerce, landing pages, SEO, AI visuals and video editing. I care about the thinking behind every design as much as the final result — building digital work that looks polished and communicates clearly.',
      fullStory:'Discover my work',servicesMarker:'02 / WHAT I DO',servicesLine1:'Different skills.',servicesLine2:'One creative vision.',
      servicesBody:'From the first idea to the final visual and the numbers behind it.',
      skill1:'Digital Marketing',skill1p:'Campaign strategy, SEO, landing pages, performance thinking and e-commerce journeys.',
      skill2:'AI Visuals & Design',skill2p:'Creative direction, polished product imagery, storefront banners and visual concepts.',
      skill3:'Video & Motion',skill3p:'Short-form editing, social reels, AI-generated video concepts and branded motion.',
      workMarker:'03 / SELECTED WORK',featuredTitle:'Selected projects.',featuredBody:'A deeper look into my projects, creative experiments and marketing process.',
      browseAll:'Browse full portfolio',showcaseBody:'E-commerce · AI creative · Marketing · Analytics',openPortfolio:'OPEN PORTFOLIO',
      mini1:'Creative projects',mini2:'Marketing analytics',mini3:'Download portfolio PDF',
      contactMarker:"04 / LET'S CONNECT",contactOver:'CONNECT · COLLABORATE · CREATE',contactLine1:'HAVE AN IDEA?',contactLine2:"LET'S TALK.",
      contactText:'Find my work, follow my creative journey, or drop me an email. Great projects start with a conversation.',
      instaSub:'Designs · Reels · Creative life',emailSub:'For collaboration & inquiries',linkedinSub:'Professional updates & experience',portfolioSub:'All projects & case studies',
      contactNote:'Instagram and Gmail links will become active once you add your details to config.js.',
      copyright:'MADE WITH INTENTION.',backTop:'BACK TO TOP',
      navLab:'Creative Lab',navHire:'Hire me',caseCta:'Explore case studies',case1:'Landing-page structure, clearer product journeys, SEO-ready content and creative storytelling.',case2:'Product visuals, food-first creative direction and a more consistent storefront look.',case3:'Banner concepts and visual assets shaped around a recognizable restaurant identity.',
      reelEyebrow:'01 / SHOWREEL',reelTitle:'Stories in motion.',reelSummary:'A collection of motion, ideas and visual stories — from concept to screen.',reelBadge:'SHOWREEL COMING SOON',reelCta:'View my work',
      labEyebrow:'04 / CREATIVE EXPERIMENTS',labTitle:'See the transformation.',labIntro:'Move the slider to compare a raw concept with refined creative direction. Try your own images instantly.',labNote:'INTERACTIVE DEMO · NOT A CLIENT PROJECT',labSubheading:'From ordinary to extraordinary.',labCopy:'This is a sample visual study. Replace both images with approved work to show exactly what changed.',beforeLabel:'BEFORE',afterLabel:'AFTER',compareRangeLabel:'Reveal after-design percentage',labStep1:'Original asset',labStep2:'Creative direction',labStep3:'Final output',uploadBefore:'Upload BEFORE',uploadAfter:'Upload AFTER',labPrivacy:'Preview only: uploaded files stay on your device and are not saved to the website.',
      processEyebrow:'06 / MY APPROACH',processTitle:'Built on a clear process.',processText:'No guesswork. Just a thoughtful flow from first conversation to final delivery.',process1:'Understand the goal',process1p:'Audience, context, priorities and what success looks like.',process2:'Design the solution',process2p:'Concepts, copy, visuals and smart iterations.',process3:'Polish every detail',process3p:'Feedback, quality checks and responsive delivery.',process4:'Ready for the real world',process4p:'Organized files, clear handoff and next-step guidance.',
      briefEyebrow:'07 / WORK TOGETHER',briefTitle:'Have a project in mind?',briefDescription:"Tell me a little about your idea. I'll help shape the next step.",briefNote:'This form prepares an email draft; it does not submit your information to a server.',fieldName:'YOUR NAME',fieldContact:'YOUR EMAIL',fieldService:'WHAT CAN I HELP WITH?',serviceChoose:'Choose a service',serviceMarketing:'Digital marketing / SEO',serviceAI:'AI creative / Design',serviceVideo:'Video editing / Motion',serviceLanding:'Landing page / E-commerce',serviceOther:'Other / Not sure yet',fieldBudget:'APPROX. BUDGET (OPTIONAL)',budgetChoose:'Choose a range',fieldTimeline:'IDEAL TIMELINE',timelineFlexible:'Flexible',timelineWeek:'Within 1 week',timelineMonth:'2–4 weeks',timelineLater:'1+ months',fieldMessage:'TELL ME ABOUT THE PROJECT',briefSubmit:'Prepare project email',briefFootnote:'No account or signup needed.',formMissing:'Please fill in your name, valid email and project details.',formMailto:'Your email app has been opened with a project draft. Please press Send there.',formCopied:'Your project brief has been copied. Add your email in config.js to receive requests directly.',formCopyFail:'Add your email in config.js or copy this summary manually:',portfolioMissing:'Add your public portfolio URL in config.js after deploying the portfolio separately.',
      instaMissing:'Add your Instagram URL in config.js to activate this link.',emailMissing:'Add your Gmail address in config.js to activate this link.'
    },
    ar: {
      navHome:'الرئيسية',
      navAbout:'من أنا',navExpertise:'ماذا أقدم',navProjects:'أعمالي',navContact:'تواصل معي',navPortfolio:'البورتفوليو',
      heroName:'كرم اسعيد',heroRole:'تسويق وإبداع رقمي',heroSkill1:'التسويق الرقمي',heroSkill2:'التصميم البصري',heroSkill3:'فيديو بالذكاء الاصطناعي',eyebrow:'أهلاً بك في مساحتي الرقمية',greeting:'مرحباً، أنا',heroLine1:'أفكار',heroLine2:'إبداعية.',heroLine3:'أثر حقيقي.',
      heroSubline:'تسويق رقمي • تصميم بصري • فيديو بالذكاء الاصطناعي',heroNote:'أعمال حقيقية.',heroIntro:'أجمع بين التسويق الرقمي والتصميم الإبداعي وصناعة المحتوى بالذكاء الاصطناعي حتى أحوّل الأفكار إلى تجارب رقمية تترك أثراً.',
      viewWork:'استكشف أعمالي',reachOut:'خلّينا نتواصل',scroll:'اكتشف المزيد',aboutMarker:'01 / من أنا',
      aboutHeadline:'الإبداع عندي إله هدف.',aboutLead:'مسوّق رقمي بعين إبداعية وبحب أحوّل الأفكار لشغل فعلي.',
      aboutBody:'أشتغل على المتاجر الإلكترونية وصفحات الهبوط والـSEO، وتصميم صور بالذكاء الاصطناعي ومونتاج الفيديوهات. بالنسبة إلي الفكرة التسويقية وراء التصميم مهمة بقدر جمال النتيجة النهائية.',
      fullStory:'اكتشف أعمالي',servicesMarker:'02 / مجالات عملي',servicesLine1:'مهارات متنوعة.',servicesLine2:'رؤية إبداعية واحدة.',
      servicesBody:'من الفكرة الأولى لآخر لمسة تصميم وتحليل النتائج.',
      skill1:'التسويق الرقمي',skill1p:'التخطيط للحملات، تحسين محركات البحث SEO، صفحات الهبوط، وتحسين تجربة المتاجر وتحليل الأداء.',
      skill2:'صور AI والتصميم',skill2p:'إخراج إبداعي، تصاميم المنتجات والبانرات الإعلانية، وتطوير الأفكار المرئية باستخدام الذكاء الاصطناعي.',
      skill3:'المونتاج والفيديو',skill3p:'مونتاج الريلز والمحتوى القصير، أفكار فيديوهات AI، ومقاطع ترويجية للعلامات التجارية.',
      workMarker:'03 / مختارات من أعمالي',featuredTitle:'مشاريع مختارة.',featuredBody:'استكشف المشاريع، التجارب الإبداعية، والطريقة اللي بشتغل فيها في التسويق والتصميم.',
      browseAll:'تصفح البورتفوليو كامل',showcaseBody:'متاجر إلكترونية · صور AI · تسويق · تحليل بيانات',openPortfolio:'افتح البورتفوليو',
      mini1:'المشاريع الإبداعية',mini2:'تحليلات التسويق',mini3:'تحميل البورتفوليو PDF',
      contactMarker:'04 / تواصل معي',contactOver:'تواصل · تعاون · إبداع',contactLine1:'عندك فكرة؟',contactLine2:'خلّينا نحكي.',
      contactText:'شوف شغلي، تابع رحلتي الإبداعية، أو ابعثلي إيميل. المشاريع الحلوة بتبدأ بحوار.',
      instaSub:'تصاميم · ريلز · محتوى',emailSub:'للتعاون والاستفسارات',linkedinSub:'خبراتي وتحديثاتي المهنية',portfolioSub:'المشاريع ودراسات الحالة',
      contactNote:'روابط Instagram وGmail بتصير فعّالة بمجرد إضافة بياناتك في ملف config.js.',
      copyright:'صُنع بعناية وإبداع.',backTop:'العودة للأعلى',
      navLab:'مختبر الإبداع',navHire:'اطلب خدمة',caseCta:'استكشف دراسات الحالة',case1:'هيكلة صفحات الهبوط ورحلة المنتجات والمحتوى المتوافق مع SEO.',case2:'صور المنتجات والإخراج البصري الذي يبرز الأطعمة داخل المتجر.',case3:'بانرات وأصول تصميم متناسقة مع هوية المطعم.',
      reelEyebrow:'01 / شو ريل',reelTitle:'حكايات تتحرك.',reelSummary:'لقطات مختارة من الفيديو والتصميم والإنتاج الإبداعي — من الفكرة إلى الشاشة.',reelBadge:'فيديو الأعمال قيد التجهيز',reelCta:'شاهد أعمالي',
      labEyebrow:'04 / تجارب إبداعية',labTitle:'شوف الفرق بنفسك.',labIntro:'اسحب المؤشر لتقارن بين الفكرة الأولية والإخراج النهائي، وجرب ترفع صورك بشكل فوري.',labNote:'نموذج تفاعلي توضيحي — ليس مشروع عميل',labSubheading:'من البسيط للاستثنائي.',labCopy:'هاي دراسة بصرية تجريبية. استبدل الصورتين بأعمالك المعتمدة حتى يشوف العميل التطور الحقيقي.',beforeLabel:'قبل',afterLabel:'بعد',compareRangeLabel:'نسبة إظهار التصميم الجديد',labStep1:'الصورة الأصلية',labStep2:'التوجيه الإبداعي',labStep3:'التصميم النهائي',uploadBefore:'ارفع صورة قبل',uploadAfter:'ارفع صورة بعد',labPrivacy:'المعاينة فقط: الصور بتضل على جهازك وما بتنرفع على الموقع أو بتنحفظ.',
      processEyebrow:'06 / طريقة العمل',processTitle:'كل مشروع بخطة واضحة.',processText:'من أول تواصل لآخر تسليم، بخطوات منظمة وهدف واضح.',process1:'نفهم الهدف',process1p:'الجمهور والسياق والأولويات وكيف رح نقيس النجاح.',process2:'نصمم الحل',process2p:'أفكار ومحتوى وتصاميم وتعديلات ذكية.',process3:'نهتم بالتفاصيل',process3p:'مراجعة الجودة والملاحظات والتوافق مع مختلف الأجهزة.',process4:'نسلّم الشغل',process4p:'ملفات منظمة وخطوات واضحة للاستفادة منها.',
      briefEyebrow:'07 / اشتغل معي',briefTitle:'عندك مشروع ببالك؟',briefDescription:'احكيلي شوي عن فكرتك وبنقدر نحدد الخطوة الجاية.',briefNote:'النموذج بجهز رسالة إيميل، لكنه لا يرسل معلوماتك تلقائياً لأي سيرفر.',fieldName:'اسمك',fieldContact:'إيميلك',fieldService:'شو الخدمة اللي بدك إياها؟',serviceChoose:'اختر الخدمة',serviceMarketing:'تسويق رقمي / SEO',serviceAI:'تصميم / صور AI',serviceVideo:'مونتاج / موشن',serviceLanding:'صفحات هبوط / متاجر',serviceOther:'خدمة ثانية / لسه مش محدد',fieldBudget:'الميزانية التقريبية (اختياري)',budgetChoose:'اختر نطاق',fieldTimeline:'الوقت المناسب',timelineFlexible:'مرن',timelineWeek:'خلال أسبوع',timelineMonth:'2–4 أسابيع',timelineLater:'شهر أو أكثر',fieldMessage:'وصف المشروع',briefSubmit:'جهز رسالة المشروع',briefFootnote:'بدون تسجيل حساب.',formMissing:'رجاءً عبّئ اسمك وإيميل صحيح ووصف المشروع.',formMailto:'فتحنا تطبيق الإيميل برسالة جاهزة. اضغط إرسال من التطبيق.',formCopied:'تم نسخ تفاصيل المشروع. أضف بريدك في config.js حتى تصلك الطلبات مباشرة.',formCopyFail:'أضف بريدك في config.js أو انسخ التفاصيل التالية يدوياً:',portfolioMissing:'أضف رابط البورتفوليو المنشور في config.js بعد نشره بشكل مستقل.',
      instaMissing:'أضف رابط حساب Instagram في ملف config.js حتى يتفعّل الزر.',emailMissing:'أضف عنوان Gmail في ملف config.js حتى يتفعّل الزر.'
    }
  };
  Object.assign(translations.en,{navHome:'Home',navPricing:'Pricing',navTalk:"Let's talk",noWork:'Explore my portfolio',labNote:'Before / After',labIntro:'Compare original and final visuals from published work.',labCopy:'The thinking and craft behind the transformation.'});
  Object.assign(translations.ar,{navHome:'الرئيسية',navPricing:'الأسعار',navTalk:'لنحكي عن مشروعك',noWork:'استكشف البورتفوليو',labNote:'قبل / بعد',labIntro:'قارن الصور الأصلية والنهائية من أعمال منشورة.',labCopy:'الفكرة والحرفة وراء التحوّل.'});
  let language = 'en';
  let sectionOverrides=[];
  let toastTimer;
  const alertUser = (message) => {
    const toast = $('#toast'); if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4700);
  };
  function setLanguage(next) {
    language = next;
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    $$('[data-t]').forEach(el => {const str = translations[next][el.dataset.t]; if(str) el.textContent = str;});
    $('#langSwitch').textContent = next === 'ar' ? 'English' : 'عربي';
    $('#langSwitch').setAttribute('aria-label', next === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    $$('[data-placeholder-en]').forEach(el=>{el.placeholder=el.dataset[next==='ar'?'placeholderAr':'placeholderEn']||'';});
    $$('[data-t]').forEach(el=>{const str=translations[next][el.dataset.t];if(str)el.textContent=str;});
    const connected=window.KARAM_CMS_PUBLIC?.enabled;
    const submit=$('#inquiryForm button[type="submit"] [data-t]');
    if(submit)submit.textContent=connected?(next==='ar'?'إرسال طلب المشروع':'Send project inquiry'):translations[next].briefSubmit;
    const note=$('[data-t="briefNote"]');if(note)note.textContent=connected?(next==='ar'?'يُرسل الطلب إلى صندوق الاستفسارات الخاص.':'Your inquiry is sent to the private project inbox.'):translations[next].briefNote;
    window.dispatchEvent(new CustomEvent('karam:language',{detail:{language:next}}));
    document.title = next === 'ar' ? 'كرم اسعيد — ما وراء الإطار' : 'Karam Isaid — Beyond the Frame';
  }
  function setLink(el, url) {
    el.href = url;
    if (/^https?:\/\//i.test(url)) {el.target = '_blank';el.rel = 'noopener noreferrer';}
  }
  $$('[data-site-portfolio]').forEach(el => {
    const hash = (el.getAttribute('href') || '').split('#')[1];
    if (cfg.portfolio) setLink(el, cfg.portfolio + (hash ? '#' + hash : ''));
    else { el.href = '#featured'; el.addEventListener('click',e=>{e.preventDefault();alertUser(translations[language].portfolioMissing);}); }
  });
  $$('[data-site-pdf]').forEach(el => setLink(el, cfg.portfolioPDF || 'portfolio/assets/Karam-Portfolio-Scrollable.pdf'));
  const linkedin = cfg.linkedin && /^https:\/\/(www\.)?linkedin\.com\//i.test(cfg.linkedin) ? cfg.linkedin : '';
  const instagram = cfg.instagram && /^https:\/\/(www\.)?instagram\.com\//i.test(cfg.instagram) ? cfg.instagram : '';
  const email = String(cfg.email || '').trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  $$('[data-social]').forEach(el => {
    const type = el.dataset.social;
    if (type === 'linkedin' && linkedin) setLink(el, linkedin);
    if (type === 'instagram') {
      if (instagram) setLink(el, instagram);
      else {el.classList.add('unconfigured');el.addEventListener('click', ev => {if(!el.classList.contains('unconfigured'))return;ev.preventDefault();alertUser(translations[language].instaMissing);});}
    }
    if (type === 'email') {
      if (validEmail) setLink(el, 'mailto:' + email + '?subject=' + encodeURIComponent('Hello Karam — Collaboration inquiry'));
      else {el.classList.add('unconfigured');el.addEventListener('click', ev => {if(!el.classList.contains('unconfigured'))return;ev.preventDefault();alertUser(translations[language].emailMissing);});}
    }
  });
  if (instagram && validEmail) $('[data-t="contactNote"]').hidden = true;
  if (cfg.photo && typeof cfg.photo === 'string' && !cfg.photo.startsWith('http')) {
    const img = $('#personalPhotoImg');
    img.addEventListener('load', () => { $('#personalPhoto').hidden = false; });
    img.src = cfg.photo;
  }
  $('#langSwitch').addEventListener('click', () => setLanguage(language === 'en' ? 'ar' : 'en'));
  const menuToggle = $('#menuToggle');
  const mobileNav = $('#mobileNav');
  const closeMenu = () => {mobileNav.hidden = true; menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label',language==='ar'?'فتح القائمة':'Open menu');};
  menuToggle.addEventListener('click', () => {mobileNav.hidden = !mobileNav.hidden;menuToggle.setAttribute('aria-expanded', String(!mobileNav.hidden));menuToggle.setAttribute('aria-label',language==='ar'?(mobileNav.hidden?'فتح القائمة':'إغلاق القائمة'):(mobileNav.hidden?'Open menu':'Close menu'));});
  $$('#mobileNav a').forEach(el => el.addEventListener('click',closeMenu));
  document.addEventListener('keydown', ev => {if (ev.key === 'Escape') closeMenu();});
  $('#year').textContent = String(new Date().getFullYear());
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => entries.forEach(e => {if(e.isIntersecting) {e.target.classList.add('show'); obs.unobserve(e.target);}}), {threshold:0.08, rootMargin:'0px 0px -25px 0px'});
    $$('.reveal').forEach(el => obs.observe(el));
  } else {$$('.reveal').forEach(el => el.classList.add('show'));}

  // Custom showreel: the cinematic CSS concept never pretends to be a real uploaded video.
  if (cfg.showreelVideo && /^(https:\/\/|assets\/)[^?#]+\.(mp4|webm)(\?.*)?$/i.test(cfg.showreelVideo)) {
    const video=$('#reelVideo'); video.src=cfg.showreelVideo;
    if (cfg.showreelPoster && /^(https:\/\/|assets\/)/i.test(cfg.showreelPoster)) video.poster=cfg.showreelPoster;
    video.hidden=false; $('#reelConcept').hidden=true; $('#reelOverlay').hidden=true;
  }
  $('#inquiryForm').addEventListener('input',event=>event.target.removeAttribute('aria-invalid'));
  // Connected CMS inbox, with email draft fallback when unconfigured.
  $('#inquiryForm').addEventListener('submit',async ev=>{
    ev.preventDefault();
    const v=id=>$(id).value.trim();
    const name=v('#inquiryName'),clientEmail=v('#inquiryEmail'),message=v('#inquiryMessage');
    const feedback=$('#briefFeedback');
    if(!ev.target.checkValidity()){const first=ev.target.querySelector(':invalid');if(first){first.setAttribute('aria-invalid','true');first.setAttribute('aria-describedby','briefFeedback');first.focus();}feedback.textContent=translations[language].formMissing;return;}
    if(name.length<2||name.length>80||!/^\S+@\S+\.\S+$/.test(clientEmail)||clientEmail.length>160||message.length<10||message.length>2000||!v('#inquiryService')){feedback.textContent=translations[language].formMissing;return;}
    const fields=[['Name',name],['Client email',clientEmail],['Service',v('#inquiryService')||'Not specified'],['Budget',v('#inquiryBudget')],['Timeline',v('#inquiryTimeline')],['Project brief',message]];
    const summary=fields.map(([label,value])=>label+': '+value).join('\n\n');
    if(new URLSearchParams(location.search).get('cms-preview')==='1'){feedback.textContent=language==='ar'?'الإرسال معطّل في معاينة المسودة.':'Submissions are disabled in draft preview.';return;}
    if(window.KARAM_CMS_PUBLIC?.enabled){
      if(document.querySelector('#inquiryTrap')?.value){feedback.textContent='Thank you.';return;}
      const button=ev.target.querySelector('button[type="submit"]');if(button.disabled)return;button.disabled=true;
      try{
        await window.KARAM_CMS_PUBLIC.submitInquiry({name,email:clientEmail,service:v('#inquiryService'),budget:v('#inquiryBudget'),timeline:v('#inquiryTimeline'),message});
        feedback.textContent=language==='ar'?'تم إرسال طلبك بنجاح. رح أتواصل معك عبر الإيميل.':'Your inquiry has been sent successfully. I will follow up by email.';
        ev.target.reset();
      }catch(error){feedback.textContent=language==='ar'?'تعذّر إرسال الطلب حالياً. جرّب مراسلتي على الإيميل.':'Could not send the inquiry right now. Please contact me by email.';}finally{button.disabled=false;}
      return;
    }
    const liveEmail=String(cfg.email||'').trim();
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(liveEmail)){
      const uri='mailto:'+liveEmail+'?subject='+encodeURIComponent('New freelance project inquiry — '+name)+'&body='+encodeURIComponent(summary);
      window.location.href=uri;
      feedback.textContent=translations[language].formMailto;
    }else{
      try{await navigator.clipboard.writeText(summary);feedback.textContent=translations[language].formCopied;}
      catch{feedback.textContent=translations[language].formCopyFail+'\n'+summary;}
    }
  });

  // Detailed per-section translations from the Content Manager.
  function applySectionOverrides(){
    sectionOverrides.forEach(section=>{

      for(const code of ['en','ar']){
        const texts=section.content?.[code]||{};
        for(const [key,value] of Object.entries(texts)){
          if(typeof value==='string'&&value.trim())translations[code][key]=value;
        }
      }
    });
    setLanguage(language);
  }
  window.addEventListener('karam:sections',event=>{if(event.detail.page!=='website')return;sectionOverrides=event.detail.sections;applySectionOverrides();});
  window.addEventListener('karam:cms',event=>{
    const {settings,services,projects}=event.detail;
    if(settings.hero_intro_en) translations.en.heroIntro=settings.hero_intro_en;
    if(settings.hero_intro_ar) translations.ar.heroIntro=settings.hero_intro_ar;
    if(settings.about_en) translations.en.aboutBody=settings.about_en;
    if(settings.about_ar) translations.ar.aboutBody=settings.about_ar;
    if(true){
      const grid=$('.specialties');
      grid.replaceChildren(...services.map((item,index)=>{
        const article=document.createElement('article');article.className='specialty-card reveal show';
        const top=document.createElement('div');top.className='specialty-top';
        const number=document.createElement('span');number.textContent=String(index+1).padStart(2,'0');
        const icon=document.createElement('span');icon.textContent=item.icon||'✳';icon.style.fontSize='46px';
        top.append(number,icon);
        const title=document.createElement('h3');title.dataset.t='skill'+(index+1);
        const desc=document.createElement('p');desc.dataset.t='skill'+(index+1)+'p';
        const foot=document.createElement('div');foot.className='specialty-bottom';foot.textContent='CREATIVE / MARKETING / DELIVERY ↗';
        article.append(top,title,desc,foot);return article;
      }));
    }
    services.forEach((item,index)=>{
      const n=index+1;
      translations.en['skill'+n]=item.title_en;
      translations.ar['skill'+n]=item.title_ar||item.title_en;
      translations.en['skill'+n+'p']=item.description_en;
      translations.ar['skill'+n+'p']=item.description_ar||item.description_en;
    });
    projects.slice(0,3).forEach((item,index)=>{
      const card=$$('.mini-case')[index];if(!card)return;
      card.querySelector('strong').textContent=item.title.en;
      translations.en['case'+(index+1)]=item.short.en;
      translations.ar['case'+(index+1)]=item.short.ar;
      const projectLink=card.querySelector('a');if(projectLink)projectLink.href=(cfg.portfolio||'portfolio/index.html')+'#work';
    });
    const src=/^(https:\/\/|assets\/)/i;
    if(settings.photo&&src.test(settings.photo)){$('#personalPhotoImg').src=settings.photo;$('#personalPhoto').hidden=false;}
    if(settings.showreel_video&&/^https:\/\/|^assets\//i.test(settings.showreel_video)){
      const video=$('#reelVideo');video.src=settings.showreel_video;
      if(settings.showreel_poster)video.poster=settings.showreel_poster;
      video.hidden=false;$('#reelConcept').hidden=true;$('#reelOverlay').hidden=true;
    }
    if(settings.before_url&&src.test(settings.before_url))$('#beforeImg').src=settings.before_url;
    if(settings.after_url&&src.test(settings.after_url))$('#afterImg').src=settings.after_url;
    if(settings.email){const emailEl=$('[data-social="email"]');if(emailEl){emailEl.href='mailto:'+settings.email;emailEl.classList.remove('unconfigured');}}
    if(settings.instagram){const el=$('[data-social="instagram"]');if(el){el.href=settings.instagram;el.target='_blank';el.rel='noopener noreferrer';el.classList.remove('unconfigured');}}
    if(settings.linkedin){const el=$('[data-social="linkedin"]');if(el)el.href=settings.linkedin;}
    if(settings.portfolio_pdf&&/^(https:\/\/|assets\/|portfolio\/)/i.test(settings.portfolio_pdf))$$('[data-site-pdf]').forEach(el=>setLink(el,settings.portfolio_pdf));
    if(settings.email&&settings.instagram){const note=$('[data-t="contactNote"]');if(note)note.hidden=true;}
    if(!services.length){const p=document.createElement('p');p.dataset.t='emptyServices';p.textContent=language==='ar'?'لنناقش نطاق مشروعك.':'Let’s discuss the scope of your project.';$('.specialties').append(p);translations.en.emptyServices='Let’s discuss the scope of your project.';translations.ar.emptyServices='لنناقش نطاق مشروعك.';}
    setLanguage(language);
    if(sectionOverrides.length)applySectionOverrides();
  });
  setLanguage('en');
})();
