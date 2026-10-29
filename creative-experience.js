/* Shared editorial experience. Local comparison files never leave this browser. */
(() => {
 'use strict';
 const page=window.PORTFOLIO?'portfolio':'website',core=window.KARAM_CMS_CORE;
 const lab=document.getElementById('creative-lab'),stage=document.getElementById('compareStage');
 const before=document.getElementById('beforeImg'),after=document.getElementById('afterImg'),range=document.getElementById('compareRange');
 if(!lab||!stage||!before||!after||!range)return;
 let local=false,urls={},published={before:'',after:''};
 const copy={
  en:{reelStatus:'Soon',navReel:'Showreel',navLab:'AI Lab',labTitle:'A different possibility.',labIntro:'Explore the space between an original image and a new creative direction.',labNote:'AI Lab',labSubheading:'The idea is only the beginning.',labCopy:'Compare published transformations, or bring two images of your own. Move the divider to look closer. This tool compares images; it does not generate AI edits.',beforeLabel:'Before',afterLabel:'After',compareRangeLabel:'Comparison divider position',uploadBefore:'Choose before image',uploadAfter:'Choose after image',labPrivacy:'Your selected files stay in this browser. They are never uploaded or saved to the website.',emptyBefore:'The original.',emptyBeforeHint:'Choose a before image',emptyAfter:'The possibility.',emptyAfterHint:'Choose an after image',resetLab:'Restore published comparison',publishedSource:'Published visual comparison',localSource:'Your private comparison',emptySource:'Try it with your own images',invalidImage:'Choose a JPG, PNG, WebP or AVIF smaller than 12 MB.',loadError:'This image could not be opened. Please choose another file.'},
  ar:{reelStatus:'قريبًا',navReel:'شو ريل',navLab:'مختبر AI',labTitle:'احتمال بصري مختلف.',labIntro:'استكشف المسافة بين الصورة الأصلية واتجاه إبداعي جديد.',labNote:'مختبر AI',labSubheading:'الفكرة هي البداية.',labCopy:'قارن التحولات المنشورة، أو اختر صورتين من جهازك واسحب الفاصل لتشوف الفرق. هذه أداة مقارنة صور، ولا تولّد تعديلات بالذكاء الاصطناعي.',beforeLabel:'قبل',afterLabel:'بعد',compareRangeLabel:'موضع فاصل المقارنة',uploadBefore:'اختر صورة قبل',uploadAfter:'اختر صورة بعد',labPrivacy:'الصور التي تختارها تبقى في متصفحك. لا تُرفع ولا تُحفظ على الموقع.',emptyBefore:'الصورة الأصلية.',emptyBeforeHint:'اختر صورة قبل',emptyAfter:'الاحتمال الجديد.',emptyAfterHint:'اختر صورة بعد',resetLab:'استعادة المقارنة المنشورة',publishedSource:'مقارنة بصرية منشورة',localSource:'مقارنتك الخاصة',emptySource:'جرّب بصور من جهازك',invalidImage:'اختر JPG أو PNG أو WebP أو AVIF أصغر من 12 ميغابايت.',loadError:'تعذّر فتح الصورة. اختر ملفًا آخر.'}
 };
 const language=()=>document.documentElement.lang==='ar'?'ar':'en';
 const section=()=>window.KARAM_CMS_SECTIONS?.find(s=>s.page===page&&s.section_key==='creative-lab');
 function loaded(img){return !!img.getAttribute('src')&&img.complete&&img.naturalWidth>0;}
 function ready(){
  const b=loaded(before),a=loaded(after);stage.classList.toggle('has-before',b);stage.classList.toggle('has-after',a);stage.classList.toggle('is-ready',b&&a);
  before.hidden=!b;after.hidden=!a;range.disabled=!(b&&a);range.setAttribute('aria-label',copy[language()].compareRangeLabel);document.getElementById('uploadBefore').setAttribute('aria-label',copy[language()].uploadBefore);document.getElementById('uploadAfter').setAttribute('aria-label',copy[language()].uploadAfter);
  stage.style.setProperty('--position',range.value+'%');
 }
 function render(){
  const l=language(),custom=section()?.content?.[l]||{},nav=window.KARAM_CMS_SECTIONS?.find(s=>s.section_key==='navigation')?.content?.[l]||{};
  document.querySelectorAll('[data-experience]').forEach(el=>{const key=el.dataset.experience,value=(key.startsWith('nav')?nav[key]:custom[key])||copy[l][key];if(value)el.textContent=value;});
  const aboutPhoto=document.querySelector('.experience-about-photo');
  if(aboutPhoto){const about=window.KARAM_CMS_SECTIONS?.find(s=>s.section_key==='about'),src=core.url(about?.content?.media?.about_image)||'assets/karam-editorial-portrait.webp';if(aboutPhoto.getAttribute('src')!==src)aboutPhoto.src=src;aboutPhoto.alt=l==='ar'?'كرم اسعيد':'Karam Isaid';}
  const media=section()?.content?.media||{},data=window.KARAM_CMS_DATA||{},ids=section()?.content?.options?.project_ids||[];
  const projects=ids.length?ids.map(id=>data.projects?.find(p=>p.id===id)).filter(Boolean):data.projects||[];
  const pair=projects.find(p=>p.before&&p.after);
  published={before:core.url(media.before_url||data.settings?.before_url||pair?.before),after:core.url(media.after_url||data.settings?.after_url||pair?.after)};
  // Default pair: the owner's plain original photo and the campaign poster made from it (same frame).
  if(!published.before&&!published.after)published={before:core.url('assets/brand/lab/karam-plain-before.webp'),after:core.url('assets/brand/lab/karam-poster-after.webp')};
  if(!local){for(const [key,img]of [['before',before],['after',after]]){const src=published[key];if(src&&img.getAttribute('src')!==src)img.src=src;else if(!src)img.removeAttribute('src');}}
  const status=lab.querySelector('[data-lab-source]');status.textContent=copy[l][local?'localSource':published.before&&published.after?'publishedSource':'emptySource'];
  lab.querySelector('[data-lab-reset]').hidden=!local;
  before.alt=l==='ar'?'الصورة الأصلية للمقارنة':'Original image for comparison';after.alt=l==='ar'?'الصورة المعدلة للمقارنة':'Edited image for comparison';
  ready();
 }
 for(const img of [before,after]){img.addEventListener('load',ready);img.addEventListener('error',()=>{ready();lab.querySelector('[data-lab-source]').textContent=copy[language()].loadError;});}
 for(const [id,img,key]of [['uploadBefore',before,'before'],['uploadAfter',after,'after']])document.getElementById(id).addEventListener('change',event=>{
  const file=event.target.files?.[0];if(!file)return;
  if(!/^image\/(jpeg|png|webp|avif)$/.test(file.type)||file.size>12*1024*1024){lab.querySelector('[data-lab-source]').textContent=copy[language()].invalidImage;event.target.value='';return;}
  local=true;lab.dataset.localPreview='true';if(urls[key])URL.revokeObjectURL(urls[key]);urls[key]=URL.createObjectURL(file);img.src=urls[key];render();
 });
 lab.querySelector('[data-lab-reset]').addEventListener('click',()=>{local=false;delete lab.dataset.localPreview;for(const url of Object.values(urls))URL.revokeObjectURL(url);urls={};for(const input of lab.querySelectorAll('input[type=file]'))input.value='';range.value='50';render();});
 range.addEventListener('input',ready);
 const drag=event=>{if(range.disabled)return;const rect=stage.getBoundingClientRect();range.value=String(Math.round(Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100))));ready();};
 stage.addEventListener('pointerdown',event=>{if(range.disabled||event.button!==0)return;stage.setPointerCapture(event.pointerId);drag(event);});
 stage.addEventListener('pointermove',event=>{if(stage.hasPointerCapture(event.pointerId))drag(event);});
 for(const event of ['karam:cms','karam:sections','karam:language'])window.addEventListener(event,()=>queueMicrotask(render));
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 if(!motion.matches&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('experience-in');observer.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('.v2-section-heading,.ki-section-top,.about-grid,.section-heading').forEach(el=>{el.classList.add('experience-reveal');observer.observe(el);});motion.addEventListener('change',event=>{if(event.matches){observer.disconnect();document.querySelectorAll('.experience-reveal').forEach(el=>el.classList.add('experience-in'));}});}
 render();
})();
