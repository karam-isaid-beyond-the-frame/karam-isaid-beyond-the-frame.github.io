/* Final UI integration: all service cards, empty/error states, and metadata share CMS values. */
(() => {
 'use strict';
 const page=window.PORTFOLIO?'portfolio':'website',core=window.KARAM_CMS_CORE;
 const lang=()=>document.documentElement.lang==='ar'?'ar':'en';
 const local=s=>lang()==='ar'?(s.title_ar||s.title_en):s.title_en;
 const append=(parent,tag,className,value)=>{const el=document.createElement(tag);el.className=className;el.textContent=value||'';parent.append(el);return el;};
 function render(){
   const data=window.KARAM_CMS_DATA;if(!data)return;
   const ar=lang()==='ar',grid=document.querySelector(page==='website'?'.specialties':'.expertise-grid');
   if(page==='website')for(const kind of ['email','instagram','linkedin']){
     const link=document.querySelector('[data-social="'+kind+'"]');if(!link)continue;
     const value=window.KARAM_SITE?.[kind]||'';
     const destination=kind==='email'?(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)?'mailto:'+value:''):core.url(value,{link:true});
     link.hidden=!destination;if(destination){link.href=destination;link.classList.remove('unconfigured');}else link.removeAttribute('href');
   }
   if(grid){
     grid.replaceChildren();
     for(const service of data.services){
       const card=document.createElement('article');card.className=page==='website'?'specialty-card reveal show':'expertise-card reveal visible';
       if(window.KARAM_ICONS){const icon=append(card,'div','service-icon');icon.append(window.KARAM_ICONS.create(window.KARAM_ICONS.serviceName(service.icon,service.title_en||service.title_ar)));}
       const cover=core.url(service.image_url);if(cover){const image=document.createElement('img');image.src=cover;image.alt=local(service);image.loading='lazy';image.className='cms-service-image';card.append(image);}
       append(card,'h3','',local(service));
       append(card,'p','',ar?(service.description_ar||service.description_en):service.description_en);
       append(card,'strong','cms-service-price',core.price(service,lang()));
       const scope=ar?(service.deliverables_ar||service.deliverables_en):service.deliverables_en;
       if(scope)append(card,'p','cms-service-scope',scope);
       const link=append(card,'a','text-cta',ar?'ناقش هذه الخدمة ↗':'Discuss this service ↗');link.href=page==='website'?'#project-brief':'../index.html#project-brief';
       link.addEventListener('click',()=>{const field=document.getElementById('inquiryMessage');if(field&&!field.value)field.value=(ar?'أرغب بمعرفة تفاصيل: ':'I would like to discuss: ')+local(service);});
       grid.append(card);
     }
     if(!data.services.length)append(grid,'p','cms-empty',data.errors.services?(ar?'الخدمات غير متاحة حاليًا. تواصل معي مباشرة.':'Services are temporarily unavailable. Please contact me directly.'):(ar?'لنحدد الخدمة المناسبة لمشروعك.':'Let’s find the right scope for your project.'));
   }
   const status=document.getElementById('cmsContentStatus')||(()=>{const el=document.createElement('p');el.id='cmsContentStatus';el.className='cms-content-status';el.setAttribute('role','status');document.querySelector(page==='website'?'#ki-featured-carousel':'#work')?.append(el);return el;})();
   status.hidden=!data.errors.projects;
   status.textContent=data.errors.projects?(ar?'تعذّر تحميل مجموعة الأعمال. يرجى المحاولة لاحقًا.':'The project collection could not load. Please try again later.'):'';
   if(data.errors.projects){const empty=document.querySelector('#kiCarouselEmpty,#projectsGrid');if(empty&&!data.projects.length)empty.hidden=true;}
   if(page==='website'){
     const noWork=document.getElementById('kiNoWork');if(noWork)noWork.textContent=ar?'تصفّح الأعمال المميزة أعلاه أو استكشف البورتفوليو الكامل.':'Explore the featured collection above or browse the full portfolio.';
     for(const [selector,en,arabic]of [['#kiPrev','Previous project','المشروع السابق'],['#kiNext','Next project','المشروع التالي'],['#kiCarouselTrack','Featured projects','أعمال مميزة'],['#compareRange','Reveal after image percentage','نسبة إظهار الصورة النهائية']])document.querySelector(selector)?.setAttribute('aria-label',ar?arabic:en);
     const hint=document.getElementById('kiCarouselHint');if(hint)hint.textContent=ar?'اسحب لاستكشاف الأعمال ↔':'Swipe to explore ↔';
     const label=document.querySelector('.hero-intro strong');if(label)label.textContent=ar?'— تسويق وإبداع':'— Digital creative';
     const image=document.getElementById('creativeHeroPortrait');if(image)image.alt=ar?'كرم اسعيد — تسويق وإبداع':'Karam Isaid — digital marketing and creative';
     const media=window.KARAM_CMS_SECTIONS?.find(s=>s.section_key==='showreel')?.content?.media||{};
     const video=document.getElementById('reelVideo'),poster=core.url(media.showreel_poster||data.settings.showreel_poster);
     if(video&&poster)video.poster=poster;
   }
   if(page==='portfolio'){
     const instagram=document.getElementById('instagramLink'),url=core.url(data.settings.instagram??window.KARAM_SITE?.instagram);
     if(instagram){instagram.hidden=!url;if(url){instagram.href=url;instagram.target='_blank';instagram.rel='noopener noreferrer';}}
     const pdf=document.getElementById('portfolioPdfLink'),file=core.url(data.settings.portfolio_pdf);if(pdf){pdf.hidden=!file;if(file)pdf.href=file;}
   }
   const settings=data.settings,title=settings['seo_title_'+lang()],description=settings['seo_description_'+lang()]||(ar?'كرم اسعيد — تسويق رقمي وإنتاج بصري وفيديو. استكشف الأعمال وتواصل لمناقشة مشروعك.':'Karam Isaid — digital marketing, visual design and video. Explore published work and discuss your project.');
   if(title)document.title=title;
   for(const [selector,value]of [['meta[name="description"]',description],['meta[property="og:description"]',description],['meta[property="og:title"]',title]])if(value)document.querySelector(selector)?.setAttribute('content',value);
   const canonical=core.url(settings.site_url);if(canonical){const url=new URL(page==='portfolio'?'portfolio/':'',canonical.endsWith('/')?canonical:canonical+'/');let link=document.querySelector('link[rel="canonical"]');if(!link){link=document.createElement('link');link.rel='canonical';document.head.append(link);}link.href=url.href;}
   if(new URLSearchParams(location.search).get('cms-preview')==='1'){let robots=document.querySelector('meta[name=robots]');if(!robots){robots=document.createElement('meta');robots.name='robots';document.head.append(robots);}robots.content='noindex,nofollow';}
   document.documentElement.dataset.cmsStatus=data.status;
 }
 const schedule=()=>queueMicrotask(render);
 for(const event of ['karam:cms','karam:sections','karam:language'])window.addEventListener(event,schedule);
 document.addEventListener('DOMContentLoaded',render);
})();
