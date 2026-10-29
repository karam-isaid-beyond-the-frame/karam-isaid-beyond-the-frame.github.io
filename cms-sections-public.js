/* Enforce presentation after CMS renderers and language changes. */
(() => {
 'use strict';
 const page=window.PORTFOLIO?'portfolio':'website',core=window.KARAM_CMS_CORE;
 let sections=[],preview=false;
 const aliases={'featured-carousel':page==='website'?'ki-featured-carousel':'kiPortfolioCarousel',pricing:'ki-pricing'};
 const order=page==='website'?["navigation", "hero", "brief-result", "story", "featured-carousel", "expertise", "video-reels", "instagram-feed", "clay-3d", "showreel", "featured", "creative-lab", "about", "process", "pricing", "project-brief", "contact", "footer"]:["navigation", "hero", "featured-carousel", "work", "video-reels", "creative-lab", "expertise", "insights", "about", "contact", "footer"];
 const element=key=>key==='navigation'?document.querySelector('header.site-header'):key==='footer'?document.querySelector('footer'):key==='hero'?document.querySelector('main section.hero'):document.getElementById(aliases[key]||key);
 function present(){
   const main=document.querySelector('main');if(!main)return;
   const lookup=new Map(sections.map(row=>[row.section_key,row]));
   if(lookup.get('appearance')?.content?.colors)window.KARAM_SET_THEME_FROM_CMS?.(lookup.get('appearance').content);
   const data=window.KARAM_CMS_DATA;
   for(const key of order){
     const el=element(key),row=lookup.get(key);if(!el)continue;
     let visible=row?.visible!==false;
     if(key==='pricing')visible&&=!!data?.services.length;
     if(page==='website'&&key==='featured'){const ids=lookup.get('featured-carousel')?.content?.options?.project_ids||[];visible&&=!!data?.projects.some(p=>ids.length?!ids.includes(p.id):!p.featured);}
     if(page==='portfolio'&&key==='featured-carousel')visible&&=!!data?.projects.some(p=>p.featured);
     if(key==='insights')visible&&=!!window.PORTFOLIO?.campaignData?.length&&!window.PORTFOLIO.campaignDemo;
     el.hidden=!visible;el.style.display=visible?'':'none';
   }
   const arranged=order.filter(key=>!['navigation','hero','footer'].includes(key)).map((key,i)=>({key,el:element(key),position:lookup.get(key)?.position??i+2})).filter(x=>x.el).sort((a,b)=>a.position-b.position);
   let next=null;for(const {el}of [...arranged].reverse()){if(el.nextElementSibling!==next)main.insertBefore(el,next);next=el;}
   document.querySelectorAll('header a[href^="#"],nav a[href^="#"]').forEach(link=>{
     const id=link.getAttribute('href').slice(1),key=Object.keys(aliases).find(k=>aliases[k]===id)||id;
     const target=element(key);if(target)link.hidden=target.hidden;
   });
   const hero=lookup.get('hero'),m=hero?.content?.media||{};
   if(page==='website'){
     for(const [key,selector]of [['primary_url','.hero-buttons a:first-child'],['secondary_url','.hero-buttons a:last-child']]){
       const destination=core.url(hero?.content?.links?.[key],{link:true}),link=document.querySelector(selector);if(link&&destination)link.href=destination;
     }
   }else{
     for(const [key,selector]of [['primary_url','.hero-cta-row a:first-child'],['secondary_url','.hero-cta-row a:nth-child(2)']]){
       const destination=core.url(hero?.content?.links?.[key],{link:true}),link=document.querySelector(selector);if(link&&destination)link.href=destination;
     }
     const art=element('hero')?.querySelector('.hero-art');if(art&&core.url(m.hero_image))art.style.backgroundImage='url('+JSON.stringify(core.url(m.hero_image))+')';
     const about=lookup.get('about')?.content?.media?.about_image;
     if(core.url(about)){let img=document.querySelector('.cms-about-photo');if(!img){img=document.createElement('img');img.className='cms-about-photo';img.alt='Karam Isaid';element('about')?.append(img);}img.src=core.url(about);}
   }
   const strip=main.querySelector('.divider-strip,.marquee-border');if(strip)strip.hidden=element('hero')?.hidden||false;
 }
 function apply(rows){
   sections=rows.filter(row=>row.page===page&&row.status==='published');window.KARAM_CMS_SECTIONS=sections;
   if(page==='portfolio')window.KARAM_FALLBACK_PROJECT_IMAGE=core.url(sections.find(s=>s.section_key==='work')?.content?.media?.project_fallback_image);
   window.dispatchEvent(new CustomEvent('karam:sections',{detail:{page,sections}}));present();
 }
 window.KARAM_APPLY_SECTIONS=rows=>{preview=true;apply(rows);};
 for(const event of ['karam:cms','karam:sections','karam:language'])window.addEventListener(event,()=>queueMicrotask(present));
 document.addEventListener('DOMContentLoaded',async()=>{
   present();if(!window.KARAM_CMS_PUBLIC?.enabled)return;
   try{const rows=await window.KARAM_CMS_PUBLIC.read('cms_page_sections','select=*&page=eq.'+page+'&status=eq.published&order=position.asc');if(!preview)apply(rows);}catch{window.KARAM_CMS_SECTIONS_ERROR=true;}
 });
})();
