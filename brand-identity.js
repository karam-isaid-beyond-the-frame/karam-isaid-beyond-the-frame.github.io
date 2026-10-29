/* Original supplied identity; published global settings can replace either image. */
(() => {
 'use strict';
 function apply(){
  const core=window.KARAM_CMS_CORE,settings=window.KARAM_CMS_DATA?.settings||{};
  if(!core)return;
  for(const [selector,key,fallback,kind] of [
   ['.identity,.nav .brand,.navbar .brand,a.brand','brand_wordmark','assets/brand/wordmark-white.png','wordmark'],
   ['.footer-mark,.footer-logo','brand_mark','assets/brand/monogram-white.png','monogram']
  ]){
   const src=core.url(settings[key])||core.url(fallback);
   document.querySelectorAll(selector).forEach(link=>{
    let img=link.querySelector('.original-brand-image');
    if(!img){img=document.createElement('img');img.className='original-brand-image '+kind;img.alt='Karam Isaid';img.decoding='async';link.replaceChildren(img);}
    if(img.src!==src)img.src=src;
   });
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
 for(const event of ['karam:cms','karam:language','karam:sections'])window.addEventListener(event,()=>queueMicrotask(apply));
})();
