/* Karam Theme Studio: no account, backend, cookies or external dependencies. */
(() => {
  'use strict';
  const PRESETS = {
    'ivory-burgundy': {en:'Ivory × Burgundy', ar:'أوف وايت × برغندي', background:'#FAF7F2',surface:'#FFFFFF',text:'#2C1C23',accent:'#78263E'},
    'white-burgundy': {en:'White × Burgundy', ar:'أبيض × برغندي', background:'#FFFFFF',surface:'#F8F0F2',text:'#25181E',accent:'#861A3C'},
    'dark-creative': {en:'Dark Creative',ar:'إبداعي داكن',background:'#090F16',surface:'#111B24',text:'#EEF4F6',accent:'#A9F1D7'},
    'minimal-luxury': {en:'Minimal Luxury',ar:'بيج فاخر',background:'#F6F3ED',surface:'#FFFFFF',text:'#171B24',accent:'#BE8F65'},
    'cinematic-burgundy':{en:'Cinematic Burgundy',ar:'سينمائي برغندي',background:'#090A10',surface:'#12131C',text:'#F5F3F5',accent:'#E13A61'},
    'creative-studio': {en:'Creative Studio',ar:'استوديو بنفسجي',background:'#101020',surface:'#27235B',text:'#F5F0FF',accent:'#A689FF'}
  };
  const KEY='karam-theme-studio-v1';
  const cfg=window.KARAM_THEME_CONFIG||{};
  const FALLBACK={theme:'ivory-burgundy',colors:{background:'#FAF7F2',surface:'#FFFFFF',text:'#2C1C23',accent:'#78263E'},font:'Manrope',radius:14};
  const isHex = x => typeof x === 'string' && /^#[0-9A-Fa-f]{6}$/.test(x);
  const isFont = x => ['Manrope','DM Sans','Tajawal'].includes(x);
  const boundRadius = x => Math.min(28,Math.max(0,parseInt(x,10)||0));
  function normalise(x) {
    if (!x||typeof x!=='object') return {...FALLBACK,colors:{...FALLBACK.colors}};
    const theme=Object.prototype.hasOwnProperty.call(PRESETS,x.theme)?x.theme:'custom';
    const base=PRESETS[theme]||PRESETS['ivory-burgundy'];
    const colors={};
    for(const k of ['background','surface','text','accent']) colors[k]=isHex(x.colors?.[k])?x.colors[k].toUpperCase():base[k];
    return {theme,colors,font:isFont(x.font)?x.font:'Manrope',radius:boundRadius(x.radius??14)};
  }
  const initial=normalise({...FALLBACK,...cfg,colors:{...FALLBACK.colors,...(cfg.colors||{})}});
  let settings=initial;
  try {const saved=JSON.parse(localStorage.getItem(KEY)||'null'); if(saved)settings=normalise(saved);} catch {}
  // V6: a visitor may pick one of the palettes the owner allows. Stored only in this browser.
  const VKEY='karam-visitor-palette-v1';
  const visitorChoice=()=>{try{const v=JSON.parse(localStorage.getItem(VKEY)||'null');return v&&v.colors&&['background','surface','text','accent'].every(k=>isHex(v.colors[k]))?v:null;}catch{return null;}};
  let ownerSettings=null;
  {const v=visitorChoice();if(v)settings=normalise({...settings,theme:'custom',colors:v.colors});}
  const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
  const mix=(a,b,t)=>'#'+rgb(a).map((x,i)=>Math.round(x*(1-t)+rgb(b)[i]*t).toString(16).padStart(2,'0')).join('');
  const rgba=(hex,alpha)=>`rgba(${rgb(hex).join(',')},${alpha})`;
  const luminance=hex=>rgb(hex).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((v,n,i)=>v+n*[.2126,.7152,.0722][i],0);
  const contrast=hex=>luminance(hex)>.31?'#14221d':'#ffffff';
  function hot(hex,light){
    if(hex.toUpperCase()==='#8B2945')return '#ED3E6B';
    let [r,g,b]=rgb(hex).map(v=>v/255);const max=Math.max(r,g,b),min=Math.min(r,g,b);let h=0,sat=0,l=(max+min)/2;const d=max-min;
    if(d){sat=d/(1-Math.abs(2*l-1));h=max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4;h*=60;if(h<0)h+=360;}
    if(light){l=Math.min(l,.42);}else{l=Math.max(l,.6);sat=Math.min(1,sat*1.2+.08);}
    const C=(1-Math.abs(2*l-1))*sat,X=C*(1-Math.abs((h/60)%2-1)),m=l-C/2;
    const [a,b2,c2]=h<60?[C,X,0]:h<120?[X,C,0]:h<180?[0,C,X]:h<240?[0,X,C]:h<300?[X,0,C]:[C,0,X];
    return '#'+[a,b2,c2].map(v=>Math.round((v+m)*255).toString(16).padStart(2,'0')).join('');
  }
  function apply() {
    const c=settings.colors;
    const light=luminance(c.background)>.42;
    const root=document.documentElement;
    root.dataset.theme=settings.theme;
    root.dataset.themeMode=light?'light':'dark';
    root.style.colorScheme=light?'light':'dark';
    const values={
      '--bg':c.background,'--bg2':mix(c.background,c.surface,.43),
      '--panel':c.surface,'--panel2':mix(c.surface,c.accent,.08),
      '--text':c.text,'--muted':mix(c.text,c.background,.36),
      '--subtle':mix(c.text,c.background,.51),'--mint':c.accent,
      '--mintdark':mix(c.accent,light?'#14010c':'#ffffff',.19),
      '--blue':c.accent,'--line':rgba(c.accent,light?.19:.27),
      '--theme-contrast':contrast(c.accent),
      '--theme-accent-soft':mix(c.surface,c.accent,light?.11:.18),
      '--theme-nav':rgba(c.background,.92),
      '--theme-grad':mix(c.background,c.accent,light?.11:.19),
      '--theme-card':c.surface,
      '--theme-poster-deep':mix(c.accent,'#100f20',.78),
      '--theme-poster-bright':mix(c.accent,'#ffffff',.14),
      '--theme-font':`"${settings.font}"`,
      '--theme-radius':settings.radius+'px',
      '--theme-shadow':rgba('#16101b',light?.14:.47),
      '--v6-hot':hot(c.accent,light),'--v6-accent-rgb':rgb(c.accent).join(','),'--v6-bg-rgb':rgb(c.background).join(','),
      '--v6-surface-rgb':rgb(c.surface).join(','),'--v6-text-rgb':rgb(c.text).join(','),'--v6-hot-rgb':rgb(hot(c.accent,light)).join(',')
    };
    for(const [key,val] of Object.entries(values))root.style.setProperty(key,val);
    const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=c.background;
  }
  apply();
  // Public CMS override: a published palette for both website and portfolio.
  window.KARAM_SET_THEME_FROM_CMS = (next) => {
    if(!next || typeof next!=='object')return;
    ownerSettings=normalise(next);
    const v=visitorChoice();
    settings=v?normalise({...next,theme:'custom',colors:v.colors}):ownerSettings;
    apply();window.dispatchEvent(new CustomEvent('karam:theme'));
  };
  // Visitor palette: pass {id,colors} to use it, or null to return to the owner's published palette.
  window.KARAM_SET_VISITOR_THEME = (choice) => {
    try{if(choice&&choice.colors)localStorage.setItem(VKEY,JSON.stringify({id:choice.id||'custom',colors:choice.colors}));else localStorage.removeItem(VKEY);}catch{}
    const base=ownerSettings||initial;
    settings=choice&&choice.colors?normalise({...base,theme:'custom',colors:choice.colors}):base;
    apply();window.dispatchEvent(new CustomEvent('karam:theme'));
  };
  window.KARAM_VISITOR_THEME_ID=()=>visitorChoice()?.id||null;
  function save(){try{localStorage.setItem(KEY,JSON.stringify(settings));return true;}catch{return false;}}
  const i18n={
    en:{launcher:'Design Studio',title:'Personalize your website',subtitle:'Choose a look. Fine-tune every detail.',themes:'COLOR THEMES',custom:'CUSTOM COLORS',bg:'Background',surface:'Cards / surface',ink:'Text',accent:'Accent',font:'Website font',radius:'Corner roundness',save:'Save preview',download:'Download publish file',reset:'Reset default',saved:'Saved on this browser',note:'Your changes are preview-only until you download theme-config.js, replace the old file and redeploy the website.',close:'Close studio',customName:'Custom theme',done:'Settings saved in this browser. Download the file to publish them for everyone.',error:'Browser storage is disabled. Your preview still works.'},
    ar:{launcher:'تخصيص التصميم',title:'استوديو تصميم موقعك',subtitle:'اختار الألوان وعدّل كل التفاصيل مباشرة.',themes:'الثيمات الجاهزة',custom:'تعديل الألوان',bg:'لون الخلفية',surface:'لون البطاقات',ink:'لون النص',accent:'اللون الأساسي',font:'خط الموقع',radius:'استدارة الزوايا',save:'حفظ المعاينة',download:'تنزيل ملف النشر',reset:'استعادة الافتراضي',saved:'محفوظ على هذا المتصفح',note:'التغييرات تظهر على جهازك فقط. حتى يشوفها كل الناس: نزّل theme-config.js واستبدله بالملف القديم ثم أعد نشر الموقع.',close:'إغلاق اللوحة',customName:'ألوان مخصصة',done:'تم حفظ المعاينة. نزّل الملف لنشر الألوان عند جميع الزوار.',error:'المتصفح منع الحفظ، لكن المعاينة تشتغل.'}
  };
  function build(){
    const el=document.createElement('div');el.className='karam-studio-mount';
    el.innerHTML=`
      <button type="button" class="ks-launcher" id="ksLauncher" aria-controls="ksPanel" aria-expanded="false" title="Design Studio"><span aria-hidden="true">✦</span><span data-ks="launcher">Design Studio</span></button>
      <div class="ks-dim" id="ksDim" hidden></div>
      <section class="ks-panel" id="ksPanel" role="dialog" aria-modal="true" aria-labelledby="ksTitle" aria-hidden="true" hidden>
        <header class="ks-header"><div><span class="ks-eyebrow">KARAM ISAID / STUDIO</span><h2 id="ksTitle" data-ks="title">Personalize your website</h2><p data-ks="subtitle">Choose a look. Fine-tune every detail.</p></div><button class="ks-close" id="ksClose" type="button" aria-label="Close studio">×</button></header>
        <div class="ks-body"><h3 data-ks="themes">COLOR THEMES</h3><div class="ks-theme-grid" id="ksThemes"></div>
        <h3 data-ks="custom">CUSTOM COLORS</h3><div class="ks-color-grid">
        <label class="ks-color-field"><span data-ks="bg">Background</span><div class="ks-color-control"><input type="color" data-color="background"><output data-val="background"></output></div></label>
        <label class="ks-color-field"><span data-ks="surface">Cards / surface</span><div class="ks-color-control"><input type="color" data-color="surface"><output data-val="surface"></output></div></label>
        <label class="ks-color-field"><span data-ks="ink">Text</span><div class="ks-color-control"><input type="color" data-color="text"><output data-val="text"></output></div></label>
        <label class="ks-color-field"><span data-ks="accent">Accent</span><div class="ks-color-control"><input type="color" data-color="accent"><output data-val="accent"></output></div></label>
        </div><div class="ks-controls"><label><span data-ks="font">Website font</span><select id="ksFont"><option value="Manrope">Manrope</option><option value="DM Sans">DM Sans</option><option value="Tajawal">Tajawal (عربي)</option></select></label>
        <label><span data-ks="radius">Corner roundness</span><input id="ksRadius" type="range" min="0" max="28" step="2"><output id="ksRadiusValue">14px</output></label></div>
        <p class="ks-help" data-ks="note"></p><div class="ks-message" id="ksMessage" role="status" aria-live="polite"></div></div>
        <div class="ks-actions"><button class="ks-action-save" id="ksSave" type="button" data-ks="save">Save preview</button><button class="ks-action-download" id="ksDownload" type="button"><span aria-hidden="true">↓</span> <span data-ks="download">Download publish file</span></button><button class="ks-reset" id="ksReset" type="button" data-ks="reset">Reset default</button></div>
      </section>`;
    document.body.append(el);
    const $=q=>el.querySelector(q),$$=q=>el.querySelectorAll(q);
    const themes=$('#ksThemes');
    Object.entries(PRESETS).forEach(([id,preset])=>{
      const button=document.createElement('button');button.type='button';button.className='ks-theme';button.dataset.preset=id;button.setAttribute('aria-pressed','false');
      button.innerHTML=`<span class="ks-theme-swatches"><i style="background:${preset.background}"></i><i style="background:${preset.surface}"></i><i style="background:${preset.text}"></i><i style="background:${preset.accent}"></i></span><span class="ks-theme-label"></span><span class="ks-theme-check" aria-hidden="true">✓</span>`;
      button.addEventListener('click',()=>{settings={...settings,theme:id,colors:{background:preset.background,surface:preset.surface,text:preset.text,accent:preset.accent}};sync();apply();save();});
      themes.appendChild(button);
    });
    function translate(){const lang=document.documentElement.lang==='ar'?'ar':'en';const dict=i18n[lang];el.dir=lang==='ar'?'rtl':'ltr';$('#ksPanel').dir=el.dir;
      $$('[data-ks]').forEach(n=>{n.textContent=dict[n.dataset.ks]||'';});
      $$('#ksThemes .ks-theme').forEach(b=>{b.querySelector('.ks-theme-label').textContent=PRESETS[b.dataset.preset][lang];});
      $('#ksClose').setAttribute('aria-label',dict.close);
    }
    function sync(){
      $$('#ksThemes .ks-theme').forEach(b=>{const active=b.dataset.preset===settings.theme;b.classList.toggle('chosen',active);b.setAttribute('aria-pressed',String(active));});
      for(const [key,value] of Object.entries(settings.colors)){const input=$(`[data-color="${key}"]`);input.value=value;el.querySelector(`[data-val="${key}"]`).textContent=value.toUpperCase();}
      $('#ksFont').value=settings.font;$('#ksRadius').value=settings.radius;$('#ksRadiusValue').textContent=settings.radius+'px';
    }
    function open(){translate();$('#ksPanel').hidden=false;$('#ksDim').hidden=false;requestAnimationFrame(()=>$('#ksPanel').classList.add('visible'));$('#ksPanel').setAttribute('aria-hidden','false');$('#ksLauncher').setAttribute('aria-expanded','true');document.body.classList.add('ks-open');$('#ksClose').focus();}
    function close(){$('#ksPanel').classList.remove('visible');$('#ksPanel').hidden=true;$('#ksDim').hidden=true;$('#ksPanel').setAttribute('aria-hidden','true');$('#ksLauncher').setAttribute('aria-expanded','false');document.body.classList.remove('ks-open');$('#ksLauncher').focus();}
    $('#ksLauncher').addEventListener('click',open);$('#ksClose').addEventListener('click',close);$('#ksDim').addEventListener('click',close);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#ksPanel').hidden)close();if(e.key==='Tab'&&!$('#ksPanel').hidden){const nodes=[...$('#ksPanel').querySelectorAll('button,input,select')].filter(n=>!n.disabled);const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
    $$('[data-color]').forEach(input=>input.addEventListener('input',()=>{settings.colors[input.dataset.color]=input.value.toUpperCase();settings.theme='custom';sync();apply();save();}));
    $('#ksFont').addEventListener('change',e=>{settings.font=e.target.value;apply();save();});
    $('#ksRadius').addEventListener('input',e=>{settings.radius=boundRadius(e.target.value);$('#ksRadiusValue').textContent=settings.radius+'px';apply();save();});
    const message=key=>{const lang=document.documentElement.lang==='ar'?'ar':'en';$('#ksMessage').textContent=i18n[lang][key];};
    $('#ksSave').addEventListener('click',()=>message(save()?'done':'error'));
    $('#ksReset').addEventListener('click',()=>{settings=normalise(cfg&&Object.keys(cfg).length?cfg:FALLBACK);try{localStorage.removeItem(KEY);}catch{}sync();apply();$('#ksMessage').textContent='';});
    $('#ksDownload').addEventListener('click',()=>{
      const out={theme:settings.theme,colors:settings.colors,font:settings.font,radius:settings.radius};
      const contents='/* Karam Isaid: replace the existing theme-config.js with this file, then redeploy. */\nwindow.KARAM_THEME_CONFIG = '+JSON.stringify(out,null,2)+';\n';
      const blob=new Blob([contents],{type:'text/javascript;charset=utf-8'}),url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='theme-config.js';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),6000);message('done');
    });
    const observer=new MutationObserver(translate);observer.observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
    translate();sync();
  }
  // Keep editor UI out of regular visitor views. ?studio=1 is a preview switch, NOT authentication.
  const showStudio = location.protocol === 'file:' || new URLSearchParams(location.search).get('studio') === '1';
  if(showStudio){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
  }
  window.KARAM_THEME_STUDIO={getSettings:()=>JSON.parse(JSON.stringify(settings)),presets:PRESETS};
})();
