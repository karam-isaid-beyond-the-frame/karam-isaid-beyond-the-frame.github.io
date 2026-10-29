/* Karam V4.2: visual media, real CMS-powered work carousel and pricing.
   Public data is read-only. Nothing is written to Supabase from this file. */
(() => {
 'use strict';
 const $ = (s) => document.querySelector(s);
 const safe=v=>!!window.KARAM_CMS_CORE.url(v);
 const lang = () => document.documentElement.lang === 'ar' ? 'ar' : 'en';
 const playable = (v) => safe(v) && /\.(mp4|webm)(\?.*)?$/i.test(v);
 const titleOf = p => p?.title?.[lang()] || p?.title?.en || '';
 const typeOf = p => p?.type?.[lang()] || p?.type?.en || p.category || '';
 const descOf = p => p?.short?.[lang()] || p?.short?.en || '';
 let projectData = [];
 let serviceData = [];
 let sectionMap = {};
 let globalSettings = {};
 const linkTo = p => 'portfolio/index.html#project='+encodeURIComponent(p.id);
 const hero = $('#creativeHeroStage');
 function applyHero() {
   if(!hero)return;
   const m = sectionMap.hero?.content?.media || {};
   const portrait = [m.photo, globalSettings.photo,window.KARAM_SITE?.photo,'assets/karam-editorial-portrait.webp'].find(safe);
   const backdrop = [m.hero_backdrop,m.hero_secondary].find(safe);
   const videoSrc = m.hero_video;
   const img = $('#creativeHeroPortrait');
   img.onerror=()=>{img.onerror=null;img.src='assets/karam-editorial-portrait.webp';};
   const fallback = $('#creativeHeroFallback');
   if(portrait){img.src=window.KARAM_CMS_CORE.url(portrait);img.hidden=false;fallback.hidden=true;hero.classList.add('has-portrait');hero.classList.toggle('is-default-portrait',portrait==='assets/karam-editorial-portrait.webp');}
   else {img.removeAttribute('src');img.hidden=true;fallback.hidden=false;hero.classList.remove('has-portrait');}
   if(backdrop){hero.style.backgroundImage='linear-gradient(0deg, rgba(7,11,17,.35), rgba(7,11,17,.05)), url('+JSON.stringify(backdrop)+')';}
   else hero.style.backgroundImage='';
   if(backdrop)hero.style.setProperty('--reference-hero-backdrop','url('+JSON.stringify(window.KARAM_CMS_CORE.url(backdrop))+')');else hero.style.removeProperty('--reference-hero-backdrop');
   const vid = $('#creativeHeroVideo');
   if(!matchMedia('(prefers-reduced-motion: reduce)').matches && safe(videoSrc) && /\.(mp4|webm)(\?|$)/i.test(videoSrc)) {
     vid.src=videoSrc;vid.hidden=false;vid.play().catch(()=>{});
   } else {vid.pause();vid.removeAttribute('src');vid.hidden=true;}
 }
 function cardFor(p,i,featured=false) {
   const a=document.createElement('a'); a.className=featured?'ki-showcase-card':'ki-work-tile'; a.href=linkTo(p);
   a.setAttribute('aria-label',`${titleOf(p)} — View project`);
   const cover=[p.cover,p.after,p.before].find(safe);
   const photo=document.createElement('div');photo.className='ki-card-photo';
   if(window.KARAM_CMS_CORE.brandMark(cover))photo.classList.add('is-brand-mark');
   if(cover){const img=document.createElement('img');img.src=cover;img.loading=i===0?'eager':'lazy';img.alt=titleOf(p);photo.append(img);}
   else {photo.classList.add('ki-photo-fallback');const t=document.createElement('strong');t.textContent='K / '+String(i+1).padStart(2,'0');photo.append(t);}
   const meta=document.createElement('div');meta.className='ki-card-meta';
   const small=document.createElement('span');small.textContent=(p.project_kind==='concept'?(lang()==='ar'?'تجربة إبداعية · ':'CONCEPT · '):p.project_kind==='personal'?(lang()==='ar'?'مشروع شخصي · ':'PERSONAL · '):'')+typeOf(p);
   const heading=document.createElement('strong');heading.textContent=titleOf(p);
   const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
   meta.append(small,heading,arrow);
   a.append(photo,meta);
   if(safe(p.video)){const tag=document.createElement('span');tag.className='ki-video-chip';tag.textContent=lang()==='ar'?'فيديو':'Video';if(window.KARAM_ICONS)tag.prepend(window.KARAM_ICONS.create('play'));photo.append(tag);}
   return a;
 }
 function renderProjects(){
   const ids=sectionMap['featured-carousel']?.content?.options?.project_ids||[];
   const featured=ids.length?ids.map(id=>projectData.find(p=>p.id===id)).filter(Boolean):projectData.filter(p=>p.featured);
   const carouselProjects=featured.filter(p=>p && p.id).slice(0,12);
   const section=$('#ki-featured-carousel'),track=$('#kiCarouselTrack');
   if(section&&track){
     const enabled=sectionMap['featured-carousel']?.visible!==false;
     section.hidden=!enabled;
     section.style.display=enabled?'':'none';
     track.replaceChildren(...carouselProjects.map((p,i)=>cardFor(p,i,true)));
     window.KARAM_ICONS?.carousels();
     const empty=$('#kiCarouselEmpty'),hint=$('#kiCarouselHint');
     if(empty){empty.hidden=carouselProjects.length>0;empty.lang=lang();
       const title=empty.querySelector('h3'),body=empty.querySelector('p'),label=empty.querySelector('span'),link=empty.querySelector('a');
       if(title)title.textContent=lang()==='ar'?'أعمال حقيقية، قريباً.':'Real work. Coming into focus.';
       if(body)body.textContent=lang()==='ar'?'تظهر المشاريع هنا بعد نشرها من لوحة التحكم.':'Projects will appear here once they are published in the portfolio.';
       if(label)label.textContent=lang()==='ar'?'تجهيز مجموعة الأعمال':'CURATING THE COLLECTION';
       if(link)link.textContent=lang()==='ar'?'زيارة البورتفوليو ↗':'Visit the portfolio ↗';
     }
     if(hint)hint.hidden=!carouselProjects.length;
     const layout=$('#kiCarouselLayout');if(layout)layout.hidden=!carouselProjects.length;
   }
   const selected=$('#kiSelectedProjects'),empty=$('#kiNoWork');
   if(selected){const chosen=projectData.filter(p=>!featured.some(f=>f.id===p.id)).slice(0,6);selected.replaceChildren(...chosen.map((p,i)=>cardFor(p,i)));if(empty)empty.hidden=chosen.length>0;}
 }
 function fmtPrice(s){return window.KARAM_CMS_CORE.price(s,lang());}
 function renderPrices(){
   const section=$('#ki-pricing'),grid=$('#kiPricingGrid');if(!section||!grid)return;
   section.hidden=!serviceData.length||sectionMap.pricing?.visible===false;
   grid.replaceChildren(...serviceData.map((s,i)=>{
     const box=document.createElement('article');box.className='ki-price-card';
     if(window.KARAM_ICONS){const icon=document.createElement('div');icon.className='service-icon';icon.append(window.KARAM_ICONS.create(window.KARAM_ICONS.serviceName(s.icon,s.title_en||s.title_ar)));box.append(icon);}
     if(s.image_url&&safe(s.image_url)){const img=document.createElement('img');img.className='ki-service-cover';img.src=s.image_url;img.loading='lazy';img.alt=lang()==='ar'?(s.title_ar||s.title_en):s.title_en;box.append(img);}
     const n=document.createElement('span');n.className='ki-price-no';n.textContent=String(i+1).padStart(2,'0')+' / SERVICE';
     const title=document.createElement('h3');title.textContent=lang()==='ar'?(s.title_ar||s.title_en):s.title_en;
     const desc=document.createElement('p');desc.textContent=lang()==='ar'?(s.description_ar||s.description_en):s.description_en;
     const amount=document.createElement('strong');amount.className='ki-price-amount';amount.textContent=fmtPrice(s);
     const included=lang()==='ar'?(s.deliverables_ar||s.deliverables_en):s.deliverables_en;
     const details=document.createElement('small');details.textContent=included||'';
     const link=document.createElement('a');link.href='#project-brief';link.textContent=lang()==='ar'?'اطلب عرض سعر ↗':'Request this service ↗';
     link.addEventListener('click',()=>{const select=$('#inquiryService');if(select)select.value='Other / Not sure yet';const msg=$('#inquiryMessage');if(msg&&!msg.value.trim())msg.value=(lang()==='ar'?'أرغب بمعرفة تفاصيل خدمة: ':'I would like to discuss: ')+(lang()==='ar'?(s.title_ar||s.title_en):s.title_en);});
     box.append(n,title,desc,amount,details,link);return box;
   }));
 }
 function controlPlaceholders(){
   // The section exists even without a published video, but it explicitly says 'coming soon'.
   // Only verified published video URLs may be played; nothing is presented as client work by default.
   const showreel=$('#showreel'),reelVideo=$('#reelVideo'),concept=$('#reelConcept'),overlay=$('#reelOverlay'),clips=$('#kiReelClips');
   const sm=sectionMap.showreel?.content?.media||{};
   const video=[sm.showreel_video,globalSettings.showreel_video,window.KARAM_SITE?.showreelVideo].find(playable);
   const poster=[sm.showreel_poster,globalSettings.showreel_poster,window.KARAM_SITE?.showreelPoster].find(safe);
   const ids=sectionMap.showreel?.content?.options?.project_ids||[];
   const clipsData=(ids.length?ids.map(id=>projectData.find(p=>p.id===id)).filter(Boolean):projectData).filter(p=>playable(p.video)).slice(0,4);
   if(showreel){
      const enabled=sectionMap.showreel?.visible!==false;
      showreel.hidden=!enabled;showreel.style.display=enabled?'':'none';
      const primary=video||clipsData[0]?.video||'';
      const useSource=(src,img)=>{
        if(!reelVideo||!playable(src))return;
        if(reelVideo.getAttribute('src')!==src){reelVideo.pause();reelVideo.setAttribute('src',src);reelVideo.load();}
        reelVideo.controls=true;reelVideo.hidden=false;
        if(safe(img))reelVideo.poster=img;else reelVideo.removeAttribute('poster');
        if(concept)concept.hidden=true;if(overlay)overlay.hidden=true;
      };
      if(primary)useSource(primary,video?poster:clipsData[0]?.cover);
      else if(reelVideo){reelVideo.pause();reelVideo.removeAttribute('src');reelVideo.removeAttribute('poster');reelVideo.load();reelVideo.hidden=true;
        if(concept){concept.hidden=false;concept.style.backgroundImage=safe(poster)?'linear-gradient(0deg,rgba(10,8,14,.75),rgba(10,8,14,.3)),url('+JSON.stringify(poster)+')':'';}
        if(overlay)overlay.hidden=false;
      }
      if(clips){
        clips.replaceChildren();clips.hidden=!clipsData.length;
        for(const p of clipsData){
          const button=document.createElement('button');button.type='button';button.className='ki-reel-clip';
          button.setAttribute('aria-label',(lang()==='ar'?'شغّل فيديو ':'Play video: ')+titleOf(p));
          const cover=[p.cover,p.after,p.before].find(safe);
          if(cover){const img=document.createElement('img');img.src=cover;img.alt='';img.loading='lazy';button.append(img);}
          const meta=document.createElement('span');meta.className='ki-reel-clip-title';meta.textContent=titleOf(p)||'Video work';button.append(meta);
          const play=document.createElement('span');play.className='ki-reel-clip-play';play.textContent='▶';play.setAttribute('aria-hidden','true');button.append(play);
          if(p.video===primary)button.classList.add('is-active');
          button.addEventListener('click',()=>{
            useSource(p.video,cover);reelVideo.play().catch(()=>{});
            clips.querySelectorAll('.ki-reel-clip').forEach(c=>c.classList.toggle('is-active',c===button));
          });
          clips.append(button);
        }
      }
   }
   const lab=$('#creative-lab'),lm=sectionMap['creative-lab']?.content?.media||{};
   const labIds=sectionMap['creative-lab']?.content?.options?.project_ids||[];const pair=(labIds.length?labIds.map(id=>projectData.find(p=>p.id===id)).filter(Boolean):projectData).find(p=>p.before&&p.after);
   const before=[lm.before_url,globalSettings.before_url,pair?.before].find(safe),after=[lm.after_url,globalSettings.after_url,pair?.after].find(safe);
   if(!lab?.dataset.localPreview){if(before)$('#beforeImg').src=window.KARAM_CMS_CORE.url(before);if(after)$('#afterImg').src=window.KARAM_CMS_CORE.url(after);}
   if(lab){const allowed=sectionMap['creative-lab']?.visible!==false;lab.hidden=!allowed;lab.style.display=allowed?'':'none';}
 }
 function updateCopy(){
   const l=lang();
   const carousel=sectionMap['featured-carousel']?.content?.[l]||{};
   const pricing=sectionMap.pricing?.content?.[l]||{};
   const translations={
     carouselKicker:l==='ar'?'02 / أعمال مختارة':'02 / FEATURED WORK',carouselTitle:l==='ar'?'الأعمال بتحكي.':'The work speaks.',carouselIntro:l==='ar'?'مشاريع وتجارب بصرية وإبداعات مختارة.':'Selected projects, visual experiments and creative work.',carouselCta:l==='ar'?'استكشف الأعمال':'Explore all work',
     pricingKicker:l==='ar'?'الخدمات / الأسعار':'SERVICES / PRICING',pricingTitle:l==='ar'?'حلول إبداعية بأسعار واضحة.':'Creative solutions. Clear starting points.',pricingIntro:l==='ar'?'التكلفة النهائية حسب تفاصيل المشروع ومتطلباته.':'Scope and deliverables determine the final quote.',pricingCta:l==='ar'?'اطلب عرض سعر':'Request a quote'
   };
   for(const [id,values] of [['ki-featured-carousel',{...Object.fromEntries(Object.entries(translations).filter(([k])=>k.startsWith('carousel'))),...carousel}],['ki-pricing',{...Object.fromEntries(Object.entries(translations).filter(([k])=>k.startsWith('pricing'))),...pricing}]]){
     const root=$('#'+id);if(!root)continue;
     for(const [key,value] of Object.entries(values)){
       if(typeof value!=='string'||!value.trim())continue;
       const target=root.querySelector('[data-ki-copy="'+key+'"]');if(target)target.textContent=value;
     }
   }
 }
 function update(){applyHero();renderProjects();renderPrices();controlPlaceholders();updateCopy();
   const motion=$('#heroMotionToggle'),video=$('#creativeHeroVideo');if(motion){motion.hidden=video.hidden;motion.textContent=lang()==='ar'?(video.paused?'تشغيل الحركة':'إيقاف الحركة'):(video.paused?'Play motion':'Pause motion');}
 }
 $('#heroMotionToggle')?.addEventListener('click',()=>{const v=$('#creativeHeroVideo');if(v.paused)v.play().catch(()=>{});else v.pause();const b=$('#heroMotionToggle');b.textContent=lang()==='ar'?(v.paused?'تشغيل الحركة':'إيقاف الحركة'):(v.paused?'Play motion':'Pause motion');});
 $('#kiPrev')?.addEventListener('click',()=>$('#kiCarouselTrack').scrollBy({left: document.dir==='rtl'?300:-300,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
 $('#kiNext')?.addEventListener('click',()=>$('#kiCarouselTrack').scrollBy({left: document.dir==='rtl'?-300:300,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
 window.addEventListener('karam:cms',e=>{
   projectData=Array.isArray(e.detail.projects)?e.detail.projects:[];
   serviceData=Array.isArray(e.detail.services)?e.detail.services:[];
   globalSettings=e.detail.settings||{};
   update();
 });
 window.addEventListener('karam:sections',e=>{
   if(e.detail.page!=='website')return;
   sectionMap=Object.fromEntries((e.detail.sections||[]).map(s=>[s.section_key,s]));
   update();
 });
 // Buttons not controlled by the CMS must display their existing destination.
 document.addEventListener('DOMContentLoaded',()=>{
   document.querySelector('#langSwitch')?.addEventListener('click',()=>{setTimeout(()=>{renderProjects();renderPrices();updateCopy();},0);});
   update();
 });
})();

