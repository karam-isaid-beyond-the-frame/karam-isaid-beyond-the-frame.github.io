/* Karam V4.3: Progressive enhancement; preserves existing CMS event flow. */
(() => {'use strict';
 // Placeholder labels are explicit; published project cards come exclusively from the CMS.
 // Let users reach actual projects even when the carousel has no items yet.
 const navLinks=document.querySelectorAll('a[href="#ki-featured-carousel"]');
 const redirectToWork = () => {
   for(const link of navLinks){
     if(document.getElementById('ki-featured-carousel')?.hidden){link.href='portfolio/index.html#work';}
     else link.href='#ki-featured-carousel';
   }
 };
 window.addEventListener('karam:cms',redirectToWork);
 document.addEventListener('DOMContentLoaded',redirectToWork);
})();
