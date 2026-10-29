/* A small local SVG system. CMS values select known names, never arbitrary markup. */
(() => {
 'use strict';
 const paths={
  marketing:'M3 10v4h4l10 5V5L7 10H3Zm4 4 2 7h3l-2-6M20 9v6',
  design:'M12 3a9 9 0 1 0 0 18h1a2.5 2.5 0 0 0 1.5-4.5 1.5 1.5 0 0 1 1-2.5H18a4 4 0 0 0 4-4c0-4-5-7-10-7ZM7 9h.01M10 6h.01M15 6h.01M18 9h.01',
  ai:'m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3ZM20 2v4M18 4h4',
  video:'M4 6h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm13 4 5-3v10l-5-3',
  seo:'M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM6 12l3-4 3 2 3-4',
  web:'M3 4h18v16H3V4Zm0 5h18M7 6.5h.01M10 6.5h.01M8 13l-2 2 2 2M16 13l2 2-2 2M13 12l-2 6',
  strategy:'M12 3v18M3 12h18M18 6l3-3M3 21l3-3M20 12a8 8 0 1 1-8-8M15 12a3 3 0 1 1-3-3',
  idea:'M9 18h6M9 21h6M8 14a7 7 0 1 1 8 0l-1 2H9l-1-2ZM12 1v1M2 10H1M23 10h-1M4 3l1 1M20 3l-1 1',
  pen:'m4 16-1 5 5-1L21 7l-4-4L4 16Zm10-10 4 4M4 16l4 4',
  rocket:'M14 5c2-2 5-2 7-2 0 3 0 6-2 8l-7 7-6-6 8-7ZM7 11H3l-1 5 5-1M13 18l-1 5 5-1v-5M3 21l3-3M16 7h.01',
  mail:'M3 5h18v14H3V5Zm0 1 9 7 9-7',
  instagram:'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17.5 6.5h.01',
  linkedin:'M4 9v12M4 4v.01M9 21V9h4v2c1-3 7-3 7 3v7M13 11v10',
  play:'m9 5 11 7-11 7V5Z',
  arrow:'M4 12h16m-6-6 6 6-6 6',
  image:'M3 3h18v18H3V3Zm0 13 6-6 5 5 3-3 4 4M16 7h.01',
  layers:'m12 3 10 6-10 6L2 9l10-6ZM2 14l10 6 10-6',
  compare:'M12 3v18M8 5H3v14h5M16 5h5v14h-5M9 9l-3 3 3 3M15 9l3 3-3 3',
  check:'m5 12 4 4L20 5'
 };
 function create(name,className='interface-icon'){
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  for(const [k,v]of Object.entries({viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.65','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true',focusable:'false',class:className}))svg.setAttribute(k,v);
  const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',paths[name]||paths.ai);svg.append(path);return svg;
 }
 function serviceName(value,title=''){
  if(paths[value]&&['marketing','design','ai','video','seo','web','strategy'].includes(value))return value;
  const text=title.toLowerCase();return /video|motion|فيديو|مونتاج/.test(text)?'video':/ai|ذكاء/.test(text)?'ai':/seo|search/.test(text)?'seo':/marketing|تسويق/.test(text)?'marketing':/web|landing|متجر/.test(text)?'web':'design';
 }
 const bound=new WeakSet();
 function carousels(){
  for(const track of document.querySelectorAll('.ki-carousel-track')){
   const update=()=>{const center=track.getBoundingClientRect().left+track.clientWidth/2;let nearest=null,distance=Infinity;for(const card of track.children){const r=card.getBoundingClientRect(),d=Math.abs(r.left+r.width/2-center);if(d<distance){distance=d;nearest=card;}}for(const card of track.children)card.classList.toggle('is-spotlight',card===nearest);if(track.dataset.kiReady&&nearest)track.dataset.kiIndex=[...track.children].indexOf(nearest);};
   if(!bound.has(track)){
    let frame;track.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(()=>{frame=0;update();});},{passive:true});
    track.addEventListener('keydown',event=>{
     if(event.target!==track||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
     const cards=[...track.children];if(!cards.length)return;event.preventDefault();
     const rtl=document.documentElement.dir==='rtl',current=Math.max(0,cards.findIndex(c=>c.classList.contains('is-spotlight')));
     const index=event.key==='Home'?0:event.key==='End'?cards.length-1:Math.max(0,Math.min(cards.length-1,current+(event.key==='ArrowRight'?(rtl?-1:1):(rtl?1:-1))));
     track.dataset.kiIndex=index;
     const box=cards[index].getBoundingClientRect(),rect=track.getBoundingClientRect();track.scrollBy({left:box.left+box.width/2-(rect.left+rect.width/2),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    });
    bound.add(track);new ResizeObserver(update).observe(track);
   }
   // After a CMS/language render keep the visitor's chosen card (first render: the second item); never move page scroll.
   requestAnimationFrame(()=>{if(track.children.length>1){const kept=Number.parseInt(track.dataset.kiIndex,10),at=Number.isInteger(kept)?Math.min(kept,track.children.length-1):1;const rect=track.getBoundingClientRect(),card=track.children[at].getBoundingClientRect();track.scrollBy({left:card.left+card.width/2-(rect.left+rect.width/2),behavior:'instant'});}update();track.dataset.kiReady='1';});
  }
 }
 window.KARAM_ICONS={create,serviceName,carousels};
 function decorate(){
  const languageButton=document.getElementById('langSwitch');
  if(languageButton){const current=document.documentElement.lang==='ar'?'ar':'en';languageButton.replaceChildren(...['en','ar'].map(code=>{const label=document.createElement('span');label.className='language-choice'+(code===current?' is-current':'');label.lang=code;label.setAttribute('aria-hidden','true');label.textContent=code.toUpperCase();return label;}));}
  const name=document.querySelector('.hero-signature');
  if(name){const text=name.textContent.trim(),words=text.split(/\s+/);if(words.length>1){const last=document.createElement('span');last.className='signature-accent';last.textContent=words.pop();name.replaceChildren(document.createTextNode(words.join(' ')+' '),last);}}
  document.querySelectorAll('[data-interface-icon]').forEach(el=>{if(!el.querySelector('svg'))el.replaceChildren(create(el.dataset.interfaceIcon));});
  for(const [selector,name]of [['[data-social="instagram"] .social-icon','instagram'],['[data-social="linkedin"] .social-icon','linkedin'],['[data-social="email"] .social-icon','mail'],['[data-social="portfolio"] .social-icon','layers']])document.querySelector(selector)?.replaceChildren(create(name));
  document.querySelectorAll('.reel-bottomline b').forEach(el=>el.replaceChildren(create('ai')));
  document.querySelectorAll('.lab-upload').forEach(el=>{if(!el.querySelector('svg'))el.prepend(create('image'));});
  for(const [id,key]of [['instagramLink','instagram'],['linkedInLink','linkedin'],['emailLink','mail']]){const link=document.getElementById(id);if(link&&!link.querySelector('svg'))link.prepend(create(key));}
 }
 document.addEventListener('DOMContentLoaded',decorate);
 for(const event of ['karam:cms','karam:sections','karam:language'])window.addEventListener(event,()=>queueMicrotask(decorate));
})();
