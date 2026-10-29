/* V4.2 portfolio gallery: same real CMS records as homepage, no demonstration entries. */
(()=>{'use strict';
const $=s=>document.querySelector(s);
const safe=s=>!!window.KARAM_CMS_CORE.url(s);
let projects=[];let portfolioPortrait='';let featuredCopy={};
function draw(){
 const root=$('#kiPortfolioCarousel'),track=$('#kiPortfolioCarouselTrack');if(!root||!track)return;
 const featured=projects.filter(p=>p.featured);
 const ids=featuredCopy.options?.project_ids||[];const items=(ids.length?ids.map(id=>projects.find(p=>p.id===id)).filter(Boolean):featured).slice(0,12);
 root.hidden=!items.length;
 track.replaceChildren(...items.map((p,i)=>{
   const a=document.createElement('a');a.className='ki-showcase-card';a.href='#project='+encodeURIComponent(p.id);
   const pic=document.createElement('div');pic.className='ki-card-photo';
   const image=[p.cover,p.after,p.before].find(safe);
   if(image){const img=document.createElement('img');img.loading='lazy';img.src=image;img.alt=p.title?.en||'Project image';pic.append(img);}
   else{pic.classList.add('ki-photo-fallback');const s=document.createElement('strong');s.textContent='K / '+String(i+1).padStart(2,'0');pic.append(s);}
   const meta=document.createElement('div');meta.className='ki-card-meta';
   const l=document.documentElement.lang==='ar'?'ar':'en';
   const type=document.createElement('span');type.textContent=(p.project_kind==='concept'?(l==='ar'?'تجربة إبداعية · ':'CONCEPT · '):p.project_kind==='personal'?(l==='ar'?'مشروع شخصي · ':'PERSONAL · '):'')+(p.type?.[l]||p.type?.en||p.category);
   const title=document.createElement('strong');title.textContent=p.title?.[l]||p.title?.en||'Untitled';
   const arrow=document.createElement('span');arrow.textContent='↗';
   meta.append(type,title,arrow);a.append(pic,meta);return a;
 }));
 window.KARAM_ICONS?.carousels();
}
function updateFeaturedCopy(){const l=document.documentElement.lang==='ar'?'ar':'en';const content=featuredCopy[l]||{};for(const [k,v] of Object.entries(content)){const target=document.querySelector('[data-portfolio-carousel="'+k+'"]');if(target&&typeof v==='string'&&v.trim())target.textContent=v;}}
function media(settings){const photo=portfolioPortrait||settings?.photo||window.KARAM_SITE?.photo||'../assets/brand/karam-portfolio-portrait.webp';
 const art=$('#kiPortfolioHeroArt'),img=$('#kiPortfolioHeroPortrait');if(!img||!art)return;
 if(safe(photo)){img.src=photo==='../assets/brand/karam-portfolio-portrait.webp'?photo:window.KARAM_CMS_CORE.url(photo);img.hidden=false;art.classList.add('ki-has-portrait');art.classList.toggle('is-default-portrait',photo==='../assets/brand/karam-portfolio-portrait.webp');}
 else{img.hidden=true;art.classList.remove('ki-has-portrait');}
}
window.addEventListener('karam:sections',e=>{if(e.detail.page!=='portfolio')return;const hero=(e.detail.sections||[]).find(s=>s.section_key==='hero'&&s.status==='published');portfolioPortrait=hero?.content?.media?.hero_portrait||'';media(window.KARAM_CMS_DATA?.settings||{});const row=(e.detail.sections||[]).find(s=>s.section_key==='featured-carousel'&&s.status==='published');if(!row)return;featuredCopy=row.content||{};updateFeaturedCopy();});
window.addEventListener('karam:cms',e=>{projects=e.detail.projects||[];media(e.detail.settings);draw();});
$('#portfolioCarouselPrev')?.addEventListener('click',()=>$('#kiPortfolioCarouselTrack')?.scrollBy({left:document.dir==='rtl'?320:-320,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
$('#portfolioCarouselNext')?.addEventListener('click',()=>$('#kiPortfolioCarouselTrack')?.scrollBy({left:document.dir==='rtl'?-320:320,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
$('#langSwitch')?.addEventListener('click',()=>setTimeout(()=>{draw();updateFeaturedCopy();},0));
document.addEventListener('DOMContentLoaded',()=>{media({});draw();});
})();
