/* Published CMS videos, loaded only after an explicit play action. No autoplay. */
(() => {
 'use strict';
 const root=document.getElementById('video-reels');if(!root)return;
 const core=window.KARAM_CMS_CORE,track=root.querySelector('.reels-track'),windowEl=root.querySelector('.reels-window'),toolbar=root.querySelector('.reels-toolbar'),empty=root.querySelector('.reels-empty'),feedback=root.querySelector('.reels-feedback'),hint=root.querySelector('.reels-hint');
 const prev=root.querySelector('.reels-prev'),next=root.querySelector('.reels-next'),count=root.querySelector('.reels-count');
 const page=window.PORTFOLIO?'portfolio':'website';
 const copy={
  en:{reelsNav:'Reels',reelsKicker:'Motion / Selected reels',reelsTitle:'Made to be watched.',reelsIntro:'Short films, visual stories and creative motion. Choose a reel and press play.',reelsEmptyTitle:'A space for motion.',reelsEmptyBody:'Published video projects will appear here. Every reel opens with its own cover and playback controls.',reelsEmptyCta:'Discuss a video project',reelsHint:'Swipe or drag to explore. Videos play when you choose.',previous:'Previous reel',next:'Next reel',play:'Play video: ',case:'View project',region:'Video reels',count:(i,n)=>`Reel ${i} of ${n}`,error:'This video could not play. Try again or view its project.'},
  ar:{reelsNav:'ريلز',reelsKicker:'حركة / ريلز مختارة',reelsTitle:'قصص تستحق المشاهدة.',reelsIntro:'فيديوهات قصيرة، قصص بصرية وحركة إبداعية. اختر الريل واضغط تشغيل.',reelsEmptyTitle:'مساحة للحركة.',reelsEmptyBody:'تظهر هنا مشاريع الفيديو المنشورة، ولكل ريل غلافه وأدوات تشغيله.',reelsEmptyCta:'ناقش مشروع فيديو',reelsHint:'اسحب لاستكشاف الريلز. يبدأ الفيديو عندما تختار تشغيله.',previous:'الريل السابق',next:'الريل التالي',play:'تشغيل فيديو: ',case:'عرض المشروع',region:'ريل الفيديوهات',count:(i,n)=>`الريل ${i} من ${n}`,error:'تعذّر تشغيل الفيديو. جرّب مجددًا أو افتح صفحة المشروع.'}
 };
 let items=[],cards=[],active=0,signature='',scrollTarget=null,scrollTimer,frame,drag=null,suppressClick=false;
 const language=()=>document.documentElement.lang==='ar'?'ar':'en';
 const section=()=>window.KARAM_CMS_SECTIONS?.find(s=>s.page===page&&s.section_key==='video-reels');
 const playable=url=>core.url(url)&&/\.(mp4|webm|m4v|ogv)(?:[?#]|$)/i.test(url);
 const title=p=>p.title?.[language()]||p.title?.en||'';
 function stopCard(card){card.video.pause();card.video.hidden=true;card.poster.hidden=false;card.play.hidden=false;card.el.removeAttribute('aria-busy');}
 function stopAll(){cards.forEach(stopCard);}
 function setActive(index){
  if(!cards.length)return;active=Math.max(0,Math.min(cards.length-1,index));
  cards.forEach((card,i)=>{card.el.classList.toggle('is-active',i===active);if(i!==active)stopCard(card);});
  count.textContent=copy[language()].count(active+1,cards.length);prev.disabled=active===0;next.disabled=active===cards.length-1;
 }
 function nearest(){
  if(!cards.length||root.hidden)return;
  const mid=track.getBoundingClientRect().left+track.clientWidth/2;let best=0,distance=Infinity;
  cards.forEach((card,i)=>{const box=card.el.getBoundingClientRect(),d=Math.abs(box.left+box.width/2-mid);if(d<distance){distance=d;best=i;}});
  if(scrollTarget!==null&&best!==scrollTarget)return;
  if(best!==active)setActive(best);
 }
 function go(index,instant=false){
  if(!cards.length)return;setActive(index);scrollTarget=active;clearTimeout(scrollTimer);
  const box=cards[active].el.getBoundingClientRect(),rect=track.getBoundingClientRect();
  track.scrollBy({left:box.left+box.width/2-(rect.left+track.clientWidth/2),behavior:instant||matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  scrollTimer=setTimeout(()=>{scrollTarget=null;nearest();},650);
 }
 function playCard(index){
  const card=cards[index];if(!card)return;feedback.textContent='';go(index);
  card.el.setAttribute('aria-busy','true');card.poster.hidden=true;card.play.hidden=true;card.video.hidden=false;
  if(card.video.getAttribute('src')!==items[index].video||card.video.error){card.video.src=items[index].video;card.video.load();}
  const promise=card.video.play();
  if(promise)promise.catch(error=>{if(index===active&&error.name!=='AbortError'){card.el.removeAttribute('aria-busy');stopCard(card);feedback.textContent=copy[language()].error;}});
 }
 function makeCard(project,index){
  const el=document.createElement('article');el.className='reels-card';el.dataset.project=project.id;
  const media=document.createElement('div');media.className='reels-media';
  const cover=core.url(project.cover||project.after||project.before),poster=cover?document.createElement('img'):document.createElement('div');
  poster.className='reels-poster';if(cover){poster.src=cover;poster.alt='';poster.loading='lazy';poster.width=360;poster.height=640;}else{poster.classList.add('reels-poster-empty');if(window.KARAM_ICONS)poster.append(window.KARAM_ICONS.create('video'));}
  const video=document.createElement('video');video.preload='none';video.playsInline=true;video.controls=true;video.hidden=true;if(cover)video.poster=cover;
  const play=document.createElement('button');play.className='reels-watch';play.type='button';
  const mark=document.createElement('span');mark.className='reels-play-icon';if(window.KARAM_ICONS)mark.append(window.KARAM_ICONS.create('play'));else mark.textContent='▶';play.append(mark);
  play.addEventListener('click',()=>playCard(index));
  video.addEventListener('canplay',()=>el.removeAttribute('aria-busy'));
  video.addEventListener('error',()=>{el.removeAttribute('aria-busy');if(index===active){stopCard(card);feedback.textContent=copy[language()].error;}});
  video.addEventListener('play',()=>{if(index!==active)setActive(index);});
  const caption=document.createElement('div');caption.className='reels-caption';
  const heading=document.createElement('h3'),kind=document.createElement('p'),link=document.createElement('a');
  // Stay in this portfolio document so private draft previews retain their data.
  link.href=page==='portfolio'?'#project='+encodeURIComponent(project.id):new URL('portfolio/index.html#project='+encodeURIComponent(project.id),core.rootURL).href;
  caption.append(heading,kind,link);media.append(poster,video,play);el.append(media,caption);
  const card={el,video,poster,play,heading,kind,link};return card;
 }
 function render(){
  const l=language(),dict=copy[l],row=section(),data=window.KARAM_CMS_DATA||{},selected=row?.content?.options?.project_ids||[];
  if(feedback.textContent)feedback.textContent=dict.error;
  root.querySelectorAll('[data-reels-copy]').forEach(el=>{const key=el.dataset.reelsCopy;el.textContent=row?.content?.[l]?.[key]||dict[key]||'';});
  const nav=window.KARAM_CMS_SECTIONS?.find(s=>s.section_key==='navigation')?.content?.[l]?.navReels;
  document.querySelectorAll('[data-reels-nav]').forEach(el=>el.textContent=nav||dict.reelsNav);
  prev.setAttribute('aria-label',dict.previous);next.setAttribute('aria-label',dict.next);track.setAttribute('aria-label',dict.region);
  const available=(data.projects||[]).filter(p=>playable(p.video)&&(!selected.length||selected.includes(p.id))).slice(0,24);
  const nextSignature=JSON.stringify(available.map(p=>[p.id,p.video,p.cover,p.after,p.before]));
  if(nextSignature!==signature){
   const oldId=items[active]?.id;stopAll();items=available;signature=nextSignature;cards=items.map(makeCard);track.replaceChildren(...cards.map(c=>c.el));
   active=Math.max(0,oldId?items.findIndex(p=>p.id===oldId):items.length>1?1:0);
   if(cards.length)requestAnimationFrame(()=>go(active,true));
   feedback.textContent='';
  }else items=available;
  cards.forEach((card,i)=>{const p=items[i],kind=l==='ar'?({client:'عمل عميل',personal:'عمل شخصي',concept:'تجربة إبداعية'}[p.project_kind]):({client:'Client work',personal:'Personal work',concept:'Concept'}[p.project_kind]),type=p.type?.[l]||p.type?.en||'';card.heading.textContent=title(p);card.kind.textContent=[kind,type].filter(Boolean).join(' · ');card.play.setAttribute('aria-label',dict.play+title(p));card.video.setAttribute('aria-label',dict.play+title(p));card.link.textContent=dict.case;});
  windowEl.hidden=!cards.length;toolbar.hidden=cards.length<2;empty.hidden=!!cards.length;hint.hidden=!cards.length;
  if(row?.visible===false)stopAll();if(cards.length)setActive(active);
 }
 prev.addEventListener('click',()=>go(active-1));next.addEventListener('click',()=>go(active+1));
 track.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(()=>{frame=0;nearest();});},{passive:true});
 track.addEventListener('scrollend',()=>{scrollTarget=null;nearest();});
 track.addEventListener('keydown',event=>{
  if(event.target!==track||!['Home','End','ArrowLeft','ArrowRight'].includes(event.key)||!cards.length)return;event.preventDefault();
  const rtl=document.documentElement.dir==='rtl',delta=event.key==='ArrowRight'?(rtl?-1:1):(rtl?1:-1);go(event.key==='Home'?0:event.key==='End'?cards.length-1:active+delta);
 });
 track.addEventListener('pointerdown',event=>{scrollTarget=null;clearTimeout(scrollTimer);if(event.pointerType==='mouse'&&event.button===0&&!event.target.closest('video,a'))drag={x:event.clientX,scroll:track.scrollLeft,id:event.pointerId,moved:false};});
 track.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;const delta=event.clientX-drag.x;if(Math.abs(delta)>6||drag.moved){if(!drag.moved)track.setPointerCapture(event.pointerId);drag.moved=true;track.classList.add('is-dragging');event.preventDefault();track.scrollLeft=drag.scroll-delta;}});
 const endDrag=event=>{if(!drag)return;const moved=drag.moved;drag=null;track.classList.remove('is-dragging');if(track.hasPointerCapture(event.pointerId))track.releasePointerCapture(event.pointerId);if(moved){suppressClick=true;nearest();go(active);setTimeout(()=>suppressClick=false,0);}};
 track.addEventListener('pointerup',endDrag);track.addEventListener('pointercancel',endDrag);
 track.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopPropagation();}},{capture:true});
 track.addEventListener('dragstart',event=>event.preventDefault());
 track.addEventListener('wheel',()=>{scrollTarget=null;clearTimeout(scrollTimer);},{passive:true});
 if('ResizeObserver'in window)new ResizeObserver(()=>{if(cards.length)go(active,true);}).observe(track);
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stopAll();},{threshold:0}).observe(root);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAll();});
 for(const event of ['karam:cms','karam:sections','karam:language'])window.addEventListener(event,()=>queueMicrotask(render));
 render();
})();
