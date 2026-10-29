(() => {
'use strict';
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const ADMIN_BRAND_KEY='karam-isaid-admin-logo';
function setAdminLogoStyle(style,save=true){
 const chosen=style==='editorial'?'editorial':'classic';
 document.body.dataset.adminLogo=chosen;
 if(save){try{localStorage.setItem(ADMIN_BRAND_KEY,chosen);}catch(_){}}
 document.querySelectorAll('[data-admin-logo-choice]').forEach(el=>{
  const selected=el.dataset.adminLogoChoice===chosen;
  el.classList.toggle('is-selected',selected);
  el.setAttribute('aria-pressed',String(selected));
 });
}
try{setAdminLogoStyle(localStorage.getItem(ADMIN_BRAND_KEY)||'classic',false);}catch(_){setAdminLogoStyle('classic',false);}

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const conf=window.KARAM_SUPABASE||{};
const siteCfg=window.KARAM_SITE||{};
const configured=/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(conf.url||'') && window.KARAM_CMS_CORE.publicKey(conf.anonKey);
const adminLink=v=>/^(https?:\/\/|\/)/i.test(v)?v:'../'+v.replace(/^(\.\/|\.\.\/)+/,'');
if(siteCfg.portfolio) $('#portfolioNav').href=adminLink(siteCfg.portfolio);
if(siteCfg.homepage) $('.top-actions a:first-child').href=adminLink(siteCfg.homepage);
let db=null,activeView='overview',state={projects:[],services:[],settings:null,settingsDraft:null,inquiries:[],media:[],sections:[],contentDrafts:[]};
let editorType='',editorId=null,activePickerField=null,searchText='',filterValue='all';
let toastTimer;
let layoutDraft=null,sectionEditorDef=null;
const SECTION_DEFS=window.KARAM_SECTION_DEFS||[];
const toast=(message)=>{const e=$('#toast');e.textContent=message;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),4300);};
const qs=(obj)=>new URLSearchParams(obj).toString();
const status=s=>`<span class="status ${esc(s)}">${s==='published'?'● LIVE':s==='new'?'● NEW':'○ '+esc(s.toUpperCase())}</span>`;
const fmtDate=d=>d?new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'—';
const pageHeading=(kicker,title,subtitle,actions='')=>`<div class="view-heading"><div><span class="eyebrow">${kicker}</span><h1>${title}</h1><p>${subtitle}</p></div>${actions?`<div class="view-header-actions">${actions}</div>`:''}</div>`;
const newBtn=(type,label)=>`<button class="btn primary" data-create="${type}">+ ${label} <span>↗</span></button>`;
async function dbLoad(table,order='created_at',asc=false){const {data,error}=await db.from(table).select('*').order(order,{ascending:asc});if(error)throw error;return data||[];}
async function refresh(withMedia=false){
 const [projects,services,settings,inquiries]=await Promise.all([
  dbLoad('cms_projects','position',true),dbLoad('cms_services','position',true),
  db.from('cms_settings').select('*').eq('id','main').maybeSingle().then(({data,error})=>{if(error)throw error;return data;}),
  dbLoad('cms_inquiries')
 ]);
 state={...state,projects,services,settings,inquiries};
 const globalDraft=await db.from('cms_settings_drafts').select('*').eq('id','main').maybeSingle();
 state.settingsDraft=globalDraft.error?null:globalDraft.data;
 const revisions=await db.from('cms_content_drafts').select('*');state.contentDrafts=revisions.error?[]:(revisions.data||[]);state.contentDraftsError=revisions.error?.message||'';
 if(withMedia) await loadMedia();
 // Backwards-compatible: dashboard login works even before migration is run.
 const sectionsResult=await db.from('cms_page_sections').select('*');
 state.sections=sectionsResult.error?[]:(sectionsResult.data||[]);
 state.sectionsError=sectionsResult.error?.message||'';
 $('#projectCount').textContent=projects.length;
 $('#inquiryCount').textContent=inquiries.filter(i=>i.status==='new').length||'';
}
async function loadMedia(){
 const {data,error}=await db.storage.from('karam-media').list('uploads',{limit:200,sortBy:{column:'created_at',order:'desc'}});
 if(error)throw error;
 state.media=(data||[]).filter(x=>x.name && !x.name.startsWith('.')).map(f=>{
  const path='uploads/'+f.name;
  return {...f,path,url:db.storage.from('karam-media').getPublicUrl(path).data.publicUrl};
 });
}
function changeView(view){
 activeView=view;$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
 $('#breadcrumb').textContent='STUDIO / '+view.replace(/\b\w/g,c=>c.toUpperCase());
 $('#nav').closest('.sidebar').classList.remove('open');
 render();
}
function render(){
 const views={overview:renderOverview,brandAssets:renderBrandAssets,projects:renderProjects,services:renderServices,media:renderMedia,settings:renderSettings,inquiries:renderInquiries,appearance:renderAppearance,sections:()=>renderSectionList('website'),portfolioSections:()=>renderSectionList('portfolio')};
 $('#view').innerHTML=(views[activeView]||renderOverview)();
 if(activeView==='appearance')setAdminLogoStyle(document.body.dataset.adminLogo||'classic',false);
}

const BRAND_PROJECTS=[
 {slug:'beyond-the-frame',title_en:'Beyond the Frame',title_ar:'ما وراء الإطار',type_en:'Personal brand film',type_ar:'فيلم للهوية الشخصية',category:'video',project_kind:'personal',position:1,featured:true,summary_en:'A personal brand film introducing Karam Isaid’s marketing and AI creative work.',summary_ar:'فيلم للهوية الشخصية يقدّم أعمال كرم اسعيد في التسويق والإبداع بالذكاء الاصطناعي.',tags:'Personal brand, Film, AI',cover_url:'/assets/brand/posters/beyond-the-frame.jpg',video_url:'/assets/brand/reels/beyond-the-frame.mp4'},
 {slug:'seo-behind-the-result',title_en:'SEO — Behind the Result',title_ar:'SEO — خلف النتيجة',type_en:'Personal educational reel',type_ar:'ريل تعليمي شخصي',category:'seo',project_kind:'personal',position:2,featured:false,summary_en:'An illustrative personal reel exploring website titles, content and links in search visibility.',summary_ar:'ريل تعليمي شخصي يشرح بصورة توضيحية دور عناوين الموقع والمحتوى والروابط في الظهور بالبحث.',tags:'SEO, Educational, AI',cover_url:'/assets/brand/posters/seo-behind-the-result.jpg',video_url:'/assets/brand/reels/seo-behind-the-result.mp4'},
 {slug:'adams-clay',title_en:'Adams Clay',title_ar:'آدمز كلاي',type_en:'Own brand / Product visuals',type_ar:'علامتي الخاصة / صور المنتجات',category:'design',project_kind:'personal',year:'2026',position:3,featured:true,summary_en:'Product-focused visual content for Adams Clay, my own brand of clay water carafes.',summary_ar:'محتوى بصري للمنتجات لآدمز كلاي، علامتي الخاصة لقوارير الماء الفخارية.',solution_en:'A product visual published on the Adams Clay Instagram account.',solution_ar:'تصميم منتج منشور على حساب آدمز كلاي في إنستغرام.',tags:'Own brand, Product visuals, Social content',cover_url:'/assets/instagram/adams-clay/product-visual.jpg'},
 {slug:'social-seo-field-notes',title_en:'Social SEO — Field Notes',title_ar:'اسمي على جوجل — ملاحظات SEO',type_en:'Personal branding / Educational carousel',type_ar:'هوية شخصية / كاروسيل تعليمي',category:'seo',project_kind:'personal',year:'2026',position:4,featured:false,summary_en:'An eight-slide personal carousel documenting what appeared when I searched for my own name, and the role of clear naming, consistent identity and descriptive content.',summary_ar:'كاروسيل شخصي من ثماني شرائح يوثّق ما ظهر عند البحث عن اسمي، مع ملاحظات حول وضوح الاسم واتساق الهوية ووصف المحتوى.',solution_en:'A personal observation shared on Instagram. The effect of each individual change has not been measured; this is not a quantified SEO case study.',solution_ar:'ملاحظة شخصية منشورة على إنستغرام. لم يُقَس أثر كل تعديل منفردًا؛ ولا يُقدَّم هذا العمل كدراسة نتائج SEO رقمية.',tags:'SEO, Personal branding, Carousel',cover_url:'/assets/instagram/social-seo/slide-01.jpg',gallery_urls:Array.from({length:7},(_,i)=>'/assets/instagram/social-seo/slide-'+String(i+2).padStart(2,'0')+'.jpg')}
];
function renderBrandAssets(){
 return `<div class="panel"><div class="panel-top"><div><h2>Original brand & reels</h2><p>Selected from your source bundle and reviewed public Instagram posts. Media remains static site files. Nothing here is automatically published or uploaded to cloud storage.</p></div></div><div class="brand-asset-grid">${BRAND_PROJECTS.map(p=>`<article class="brand-asset-card">${p.video_url?`<video controls preload="none" playsinline poster="${esc(p.cover_url)}" src="${esc(p.video_url)}" aria-label="${esc(p.title_en)}"></video>`:`<img class="brand-asset-cover" src="${esc(p.cover_url)}" alt="${esc(p.title_en)}" loading="lazy">`}<h3>${esc(p.title_en)}</h3><p>${esc(p.summary_en)}</p><p>Personal work · Review, then save as a private draft.</p><button class="btn secondary" data-brand-project="${p.slug}">Use in project editor</button></article>`).join('')}</div><p>After publishing a project, select it in Website Sections → Video Reels and Portfolio Sections → Video Reels. Drafts are available in Preview draft only.</p><p>Original transparent wordmark and monogram are installed on the public pages. Change their paths through Global Settings → Original brand. Font licenses are included with the assets.</p></div>`;
}
function openBrandProject(slug){
 const item=BRAND_PROJECTS.find(p=>p.slug===slug);if(!item)return;
 const existing=state.projects.find(p=>p.slug===slug);
 openEditor('project',existing?.id);
 if(existing){toast('Opened existing project; your saved content was preserved.');return;}
 const form=$('#editorForm');
 for(const [key,value] of Object.entries(item)){const field=form.elements.namedItem(key);if(!field)continue;if(field.type==='checkbox')field.checked=value;else field.value=Array.isArray(value)?value.join('\n'):value;}
 $('#editorMessage').textContent='Prepared from your supplied or reviewed original media. Review the text, then Save private draft. No content has been saved yet.';
}

function renderOverview(){
 const live=state.projects.filter(x=>x.status==='published').length;
 const fresh=state.inquiries.filter(x=>x.status==='new').length;
 const recent=state.projects.slice(0,4).map(p=>`<tr><td><strong>${esc(p.title_en)}</strong><small>${esc(p.category)}</small></td><td>${status(p.status)}</td><td>${fmtDate(p.updated_at)}</td><td><button class="action-btn" data-edit="project" data-id="${esc(p.id)}">Edit ↗</button></td></tr>`).join('');
 return pageHeading('YOUR CREATIVE COMMAND CENTER','Good to have you back<span class="wine">.</span>','Manage your website and portfolio from one place.',newBtn('project','New project')+' <button class="btn secondary" data-health="1">Check CMS connection ↗</button>')+
 `<div class="stat-grid"><div class="stat-card"><span class="eyebrow">TOTAL PROJECTS</span><strong>${state.projects.length}</strong><small>Your portfolio archive</small></div><div class="stat-card"><span class="eyebrow">LIVE PROJECTS</span><strong>${live}</strong><small>Visible to your visitors</small></div><div class="stat-card"><span class="eyebrow">ACTIVE SERVICES</span><strong>${state.services.filter(x=>x.status==='published').length}</strong><small>What you offer</small></div><div class="stat-card"><span class="eyebrow">NEW INQUIRIES</span><strong>${fresh}</strong><small>Potential client requests</small></div></div>
 <div class="panel"><div class="panel-top"><h2>Recently added projects</h2><button class="action-btn" data-go="projects">View all ↗</button></div>${recent?`<div class="table-wrap"><table><thead><tr><th>PROJECT</th><th>STATUS</th><th>UPDATED</th><th></th></tr></thead><tbody>${recent}</tbody></table></div>`:'<div class="empty">No projects yet. Add your first project to start building your public portfolio.</div>'}</div>
 <div class="panel" id="healthReport" hidden role="status" aria-live="polite"></div><div class="guide-grid"><div class="guide-card"><span class="guide-icon">✳</span><b>01 — Create</b><p>Add bilingual project details, marketing case studies, services and media.</p></div><div class="guide-card"><span class="guide-icon">◌</span><b>02 — Save as draft</b><p>Keep unfinished work in your private workspace, away from public visitors.</p></div><div class="guide-card"><span class="guide-icon">↗</span><b>03 — Publish live</b><p>When ready, press Publish. Both sites read approved content from the same database.</p></div></div>`;
}
function renderProjects(){
 let rows=state.projects.filter(p=>(filterValue==='all'||filterValue===p.status)&&(p.title_en+' '+p.title_ar+' '+p.category).toLowerCase().includes(searchText.toLowerCase()));
 return pageHeading('PORTFOLIO LIBRARY','Your projects<span class="wine">.</span>','Build compelling case studies for marketing, design, AI and video.',newBtn('project','Add new project'))+
 `<div class="searchbar"><input id="searchProjects" placeholder="Search projects..." value="${esc(searchText)}" aria-label="Search projects"><div class="tabs"><button data-filter="all" class="${filterValue==='all'?'active':''}">All (${state.projects.length})</button><button data-filter="published" class="${filterValue==='published'?'active':''}">Published</button><button data-filter="draft" class="${filterValue==='draft'?'active':''}">Drafts</button></div></div>
 <div class="table-wrap"><table><thead><tr><th>PROJECT</th><th>CATEGORY</th><th>STATUS</th><th>ORDER</th><th>ACTIONS</th></tr></thead><tbody>${rows.map(p=>`<tr><td><div style="display:flex;gap:12px;align-items:center"><div class="thumb">${p.cover_url?`<img src="${esc(p.cover_url)}" alt="">`:'KI'}</div><div><strong>${esc(p.title_en||'Untitled')}</strong><small>${esc(p.slug)} · ${esc(p.year)}</small></div></div></td><td>${esc(p.category)}</td><td>${status(p.status)}</td><td>${p.position}</td><td><div class="row-actions"><button class="action-btn" data-edit="project" data-id="${esc(p.id)}">Edit</button><button class="action-btn danger" data-delete="project" data-id="${esc(p.id)}">Delete</button></div></td></tr>`).join('')}</tbody></table>${!rows.length?'<div class="empty"><h3>No projects found</h3>Start with Add new project.</div>':''}</div>`;
}
function renderServices(){
 return pageHeading('YOUR EXPERTISE','What you offer<span class="wine">.</span>','Describe each service and control which ones appear publicly.',newBtn('service','Add service'))+
 `<div class="table-wrap"><table><thead><tr><th>SERVICE</th><th>ARABIC TITLE</th><th>STATUS</th><th>ORDER</th><th>ACTIONS</th></tr></thead><tbody>${state.services.map(s=>`<tr><td><strong>${esc(s.title_en)}</strong><small>${esc(s.description_en).slice(0,80)} · ${esc(s.pricing_type==='quote'?'Custom quote':((s.currency||'USD')+' '+(s.price_amount??'')))}</small></td><td>${esc(s.title_ar)}</td><td>${status(s.status)}</td><td>${s.position}</td><td><div class="row-actions"><button class="action-btn" data-edit="service" data-id="${esc(s.id)}">Edit</button><button class="action-btn danger" data-delete="service" data-id="${esc(s.id)}">Delete</button></div></td></tr>`).join('')}</tbody></table>${!state.services.length?'<div class="empty">Add services and publish them to update your website.</div>':''}</div>`;
}
const isVideo=f=>/\.(mp4|webm)$/i.test(f.name),isPdf=f=>/\.pdf$/i.test(f.name);
function mediaCards(picker=false){return state.media.map(f=>`<article class="media-card"><div class="media-thumb">${isVideo(f)?`<video src="${esc(f.url)}" muted playsinline preload="metadata"></video>`:isPdf(f)?'<span style="font-size:40px">▤</span>':`<img src="${esc(f.url)}" loading="lazy" alt="">`}</div><div class="media-info"><strong title="${esc(f.name)}">${esc(f.name)}</strong><small>${f.metadata?.size?Math.round(f.metadata.size/1024)+' KB':'Uploaded asset'}</small><div class="row-actions">${picker?`<button class="action-btn" data-pick="${esc(f.path)}">Select</button>`:`<button class="action-btn" data-copy="${esc(f.path)}">Copy URL</button><button class="action-btn danger" data-remove-media="${esc(f.path)}">Delete</button>`}</div></div></article>`).join('');}
function renderMedia(){
 return pageHeading('VISUAL ASSETS','Media library<span class="wine">.</span>','Upload images, promotional videos, PDF or before/after designs.')+
 `<label class="upload-box"><span style="color:var(--wine);font-size:40px">↑</span><strong>Click to upload media</strong><small>JPG, PNG, WebP, AVIF, GIF, MP4, WebM or PDF · 45 MB max per file</small><input type="file" id="mediaUpload" accept="image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm,application/pdf" multiple></label><div class="panel"><div class="panel-top"><h2>Your uploaded assets (${state.media.length})</h2><button class="action-btn" data-refresh-media>Refresh ↻</button></div><div class="media-grid">${mediaCards()||'<div class="empty">No media yet. Upload your first image above.</div>'}</div></div>`;
}
const SETTINGS_FIELDS=[
 ['section','ORIGINAL BRAND'],['brand_wordmark','Header wordmark image (transparent original)','media'],['brand_mark','Footer monogram image (transparent original)','media'],
 ['section','SEO / SEARCH'],['site_url','Canonical deployed site URL (HTTPS)','url'],['seo_title_en','SEO title — English','text'],['seo_title_ar','SEO title — Arabic','text'],['seo_description_en','SEO description — English','textarea'],['seo_description_ar','SEO description — Arabic','textarea'],['section','PUBLIC IDENTITY'],['hero_intro_en','Hero introduction — English','textarea'],['hero_intro_ar','Hero introduction — Arabic','textarea'],
 ['about_en','About me — English','textarea'],['about_ar','About me — Arabic','textarea'],
 ['location_en','Location — English (optional, real only)','text'],['location_ar','Location — Arabic (optional)','text'],['section','CONTACT LINKS'],['email','Your Gmail / public email','email'],['instagram','Instagram URL','url'],['linkedin','LinkedIn URL','url'],
 ['section','INSTAGRAM LIVE FEED (OPTIONAL)'],['instagram_feed_url','Instagram JSON feed URL from behold.so (e.g. https://feeds.behold.so/…). Leave empty to hide the section.','url'],['section','DOWNLOADS / DOCUMENTS'],['portfolio_pdf','Current portfolio PDF (optional)','media'],['cv_url','Your current CV / resume PDF (optional)','media'],
 ['section','SHOWREEL & IMAGES'],['photo','Your profile photo URL','media'],['showreel_video','Showreel video URL','media'],['showreel_poster','Showreel poster URL','media'],
 ['before_url','Before comparison image URL','media'],['after_url','After comparison image URL','media']
];
function renderSettings(){
 const content=state.settingsDraft?.content||state.settings?.content||{};
 const csvText=Array.isArray(content.campaign_data)&&content.campaign_data.length?
   'month,spend,revenue,impressions,clicks,conversions\n'+content.campaign_data.map(r=>[r.month,r.spend,r.revenue,r.impressions,r.clicks,r.conversions].join(',')).join('\n') : '';
 return pageHeading('BRAND CONTENT','Your digital identity<span class="wine">.</span>','Edit your main website and portfolio content in both languages.')+
 `<div class="panel"><div class="panel-top"><div><h2>Global content</h2><p>Saved changes become public only after you select Publish updates.</p></div>${status(state.settings?.published?'published':'draft')}</div><form id="settingsForm"><div class="settings-form">${SETTINGS_FIELDS.map(([key,label,type])=>key==='section'?`<div class="section-label">${label}</div>`:`<label class="${type==='textarea'?'full':''}">${label}${type==='textarea'?`<textarea name="${key}" rows="3">${esc(content[key]||'')}</textarea>`:type==='media'?`<div class="media-field"><input name="${key}" value="${esc(content[key]||'')}" placeholder="Upload or choose a file"><button type="button" data-media-pick="${key}">Browse</button>${/pdf|cv_url/.test(key)?`<label class="pdf-upload-btn">Upload PDF<input type="file" accept="application/pdf" data-pdf-upload="${key}" hidden></label>`:''}</div>${/pdf|cv_url/.test(key)&&content[key]?`<small class="pdf-current"><a href="${esc(content[key])}" target="_blank" rel="noopener">Open current PDF ↗</a></small>`:''}`:`<input name="${key}" type="${type||'text'}" value="${esc(content[key]||'')}" placeholder="Optional">`}</label>`).join('')}</div><div class="section-label" style="margin:26px 0 14px">MARKETING ANALYTICS / CSV</div><p class="settings-note">Optional: paste approved monthly performance data. These figures appear on the public portfolio dashboard only after publishing. Do not share client-confidential metrics.</p><label>Campaign data CSV (month,spend,revenue,impressions,clicks,conversions)<textarea name="campaign_csv" rows="6" placeholder="month,spend,revenue,impressions,clicks,conversions\nJan,900,2250,55000,2200,79">${esc(csvText)}</textarea></label><label style="flex-direction:row;align-items:center;margin-top:13px"><input name="campaign_demo" type="checkbox" ${content.campaign_demo!==false?'checked':''}> Label figures as DEMO (uncheck only when values are real and approved)</label><div class="settings-actions"><button type="button" class="btn secondary" data-save-settings="draft">Save as draft</button><button type="button" class="btn secondary" data-preview-page="website">Preview draft</button><button type="submit" class="btn primary">Publish updates ↗</button></div><p class="message" id="settingsMessage" role="status"></p></form></div>`;
}
function renderInquiries(){
 return pageHeading('CLIENT COMMUNICATION','Project inquiries<span class="wine">.</span>','Secure inbox for requests submitted through your contact form. Replies are handled in your email app.')+
 `<div class="panel"><div class="panel-top"><h2>Received requests (${state.inquiries.length})</h2><span class="muted">Public form requires spam protection before promotion to a large audience.</span></div><div class="table-wrap"><table><thead><tr><th>CLIENT</th><th>REQUEST</th><th>BRIEF</th><th>STATUS</th><th>DATE</th></tr></thead><tbody>${state.inquiries.map(i=>`<tr><td><strong>${esc(i.name)}</strong><small><a href="mailto:${encodeURIComponent(i.email)}">${esc(i.email)}</a></small></td><td><strong>${esc(i.service)}</strong><small>${esc(i.budget)} · ${esc(i.timeline)}</small></td><td><div class="inquiry-body">${esc(i.message)}</div></td><td><select data-inquiry-status="${esc(i.id)}"><option value="new" ${i.status==='new'?'selected':''}>New</option><option value="reviewing" ${i.status==='reviewing'?'selected':''}>Reviewing</option><option value="closed" ${i.status==='closed'?'selected':''}>Closed</option></select></td><td class="nowrap">${fmtDate(i.created_at)}</td></tr>`).join('')}</tbody></table>${!state.inquiries.length?'<div class="empty">No incoming inquiries yet. Your public contact form will store them here once Supabase is connected.</div>':''}</div></div>`;
}
const PROJECT_FIELDS=[
 ['slug','URL-friendly ID','text','full'],['category','Category','select'],['project_kind','Project classification','projectkind'],['year','Year','text'],['position','Display order','number'],['featured','Featured project','checkbox'],
 ['title_en','Project title — English','text','full'],['title_ar','Project title — Arabic','text','full'],
 ['type_en','Project type — English','text'],['type_ar','Project type — Arabic','text'],
 ['summary_en','Short summary — English','textarea','full'],['summary_ar','Short summary — Arabic','textarea','full'],
 ['section','CASE STUDY'],['challenge_en','Challenge — English','textarea','full'],['challenge_ar','Challenge — Arabic','textarea','full'],
 ['solution_en','Solution — English','textarea','full'],['solution_ar','Solution — Arabic','textarea','full'],
 ['results_en','Results — English (approved / verified only)','textarea','full'],['results_ar','Results — Arabic','textarea','full'],
 ['tags','Tags, comma separated','text','full'],['section','PROJECT MEDIA'],
 ['cover_url','Cover image URL','media','full'],['video_url','Video URL (MP4/WebM)','media','full'],
 ['before_url','Before image URL','media','full'],['after_url','After image URL','media','full'],
 ['gallery_urls','Project archive — images, MP4/WebM and Instagram post/reel URLs','gallery','full']
];
const SERVICE_FIELDS=[['title_en','Service name — English','text','full'],['title_ar','Service name — Arabic','text','full'],['description_en','Description — English','textarea','full'],['description_ar','Description — Arabic','textarea','full'],['image_url','Service image (optional)','media','full'],['icon','Service icon','icon'],['position','Display order','number'], ['pricing_type','Pricing format','pricing'],['price_amount','Starting / fixed price','number'],['currency','Currency (USD, JOD, KWD...)','text'],['deliverables_en','What is included — English','textarea','full'],['deliverables_ar','What is included — Arabic','textarea','full']];
function fieldHTML(spec,data){
 const [key,label,type='text',width]=spec;
 if(key==='section')return `<div class="section-label">${label}</div>`;
 const value=data[key]??(key==='position'?0:key==='currency'?'USD':key==='pricing_type'?'quote':'');const full=width==='full'?'full':'';
 if(type==='checkbox')return `<label class="${full}" style="flex-direction:row;align-items:center;margin-top:17px"><input type="checkbox" name="${key}" ${value?'checked':''}> ${label}</label>`;
 if(type==='icon'){const icons=[['','Automatic from service name'],['marketing','Megaphone / Marketing'],['design','Palette / Visual design'],['ai','Sparkles / AI'],['video','Camera / Video'],['seo','Search / SEO'],['web','Browser / Websites'],['strategy','Target / Strategy']];if(value&&!icons.some(([id])=>id===value))icons.push([value,'Existing symbol (automatic public icon)']);return `<label class="${full}">${label}<select name="${key}">${icons.map(([id,text])=>`<option value="${esc(id)}" ${value===id?'selected':''}>${esc(text)}</option>`).join('')}</select></label>`;}
 if(type==='textarea')return `<label class="${full}">${label}<textarea name="${key}" rows="${key==='gallery_urls'?6:3}">${esc(Array.isArray(value)?value.join('\n'):value)}</textarea></label>`;
 if(type==='gallery')return `<label class="${full}">${label}<div class="media-field"><textarea name="${key}" rows="8" placeholder="One image, video or Instagram post/reel URL per line. Up to 250 items.">${esc(Array.isArray(value)?value.join('\n'):value)}</textarea><button type="button" data-media-pick="${key}">Add media</button></div><small>Use the original brand logo as the cover to give a brand its own identity. Upload a file named logo, wordmark or monogram to preserve its proportions.</small></label>`;
 if(type==='media')return `<label class="${full}">${label}<div class="media-field"><input name="${key}" value="${esc(value)}" placeholder="Upload or choose from Media Library"><button type="button" data-media-pick="${key}">Browse</button></div></label>`;
 if(type==='projectkind')return `<label class="${full}">${label}<select name="${key}"><option value="client" ${value==='client'?'selected':''}>Client work (permission to share)</option><option value="personal" ${value==='personal'?'selected':''}>Personal / Own business</option><option value="concept" ${value==='concept'?'selected':''}>Concept / Experimental work</option></select></label>`;
 if(type==='pricing')return `<label class="${full}">${label}<select name="${key}"><option value="quote" ${value==='quote'?'selected':''}>Custom quote / Contact</option><option value="starting_at" ${value==='starting_at'?'selected':''}>Starting from</option><option value="fixed" ${value==='fixed'?'selected':''}>Fixed price</option></select></label>`;
 if(type==='select')return `<label class="${full}">${label}<select name="${key}">${['design','marketing','seo','ai','video'].map(t=>`<option value="${t}" ${value===t?'selected':''}>${t.toUpperCase()}</option>`).join('')}</select></label>`;
 return `<label class="${full}">${label}<input name="${key}" type="${type}" ${type==='number'?'min="0" max="100000000" step="'+(key==='price_amount'?'0.01':'1')+'"':''} value="${esc(value)}" ${key==='slug'?'pattern="[a-z0-9-]{2,100}" title="Only a-z 0-9 and hyphens"':''}></label>`;
}
function openEditor(type,id){
 editorType=type;editorId=id||null;
 const live=type==='project'?state.projects.find(p=>p.id===id):state.services.find(s=>s.id===id);
 const revision=state.contentDrafts.find(d=>d.entity_type===type&&d.entity_id===id);
 const data=revision?{...live,...revision.content}:live;
 $('#editorKicker').textContent=type.toUpperCase()+' EDITOR';
 $('#editorHeading').textContent=(id?'Edit ':'New ')+(type==='project'?'project':'service');
 const fields=type==='project'?PROJECT_FIELDS:SERVICE_FIELDS;
 $('#editorFields').innerHTML='<div class="fields">'+fields.map(f=>fieldHTML(f,data||{})).join('')+'</div>';
 $('#editorMessage').textContent='';
 $('#saveDraft').textContent='Save private draft';
 const unpublish=$('#unpublishContent');unpublish.hidden=live?.status!=='published';
 $('#editorDialog').showModal();
}
function gather(form,fields){
 const obj={};for(const [key] of fields){if(key==='section')continue;const el=form.elements.namedItem(key);if(!el)continue;obj[key]=el.type==='checkbox'?el.checked:el.type==='number'?(el.value.trim()===''?null:Number(el.value)):el.value.trim();}
 return obj;
}
async function saveEditor(publish){
 const form=$('#editorForm');const obj=gather(form,editorType==='project'?PROJECT_FIELDS:SERVICE_FIELDS);
 if(editorType==='project'){
  obj.project_kind=['client','personal','concept'].includes(obj.project_kind)?obj.project_kind:'concept';
  obj.slug=obj.slug.toLowerCase().replace(/[^a-z0-9-]/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
  if(obj.slug.length<2||!obj.title_en){$('#editorMessage').textContent='English title and valid project ID are required.';return;}
  obj.tags=obj.tags.split(',').map(t=>t.trim()).filter(Boolean).slice(0,10);
  obj.gallery_urls=[...new Set(String(obj.gallery_urls||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean))];
  if(obj.gallery_urls.length>250){$('#editorMessage').textContent='A project supports up to 250 media items. Split larger archives into another project.';return;}
  if(obj.gallery_urls.some(v=>!window.KARAM_CMS_CORE.url(v))){$('#editorMessage').textContent='Gallery URLs must be HTTPS or local asset paths.';return;}
  if(publish&&!obj.cover_url&&!obj.after_url){$('#editorMessage').textContent='Add a real project cover image (or After image) before publishing.';return;}
 }else{if(!obj.title_en){$('#editorMessage').textContent='English service name is required.';return;} if(!Number.isFinite(obj.price_amount)||obj.price_amount<0)obj.price_amount=null; if(obj.pricing_type==='quote')obj.price_amount=null; obj.currency=String(obj.currency||'USD').toUpperCase();if(!/^[A-Z]{3}$/.test(obj.currency)){$('#editorMessage').textContent='Use a three-letter currency code, such as USD or JOD.';return;}if(publish&&obj.pricing_type!=='quote'&&obj.price_amount==null){$('#editorMessage').textContent='Enter a valid price for fixed or starting prices.';return;}}
 for(const key of ['cover_url','video_url','before_url','after_url','image_url']){if(obj[key]&&!window.KARAM_CMS_CORE.url(obj[key])){$('#editorMessage').textContent='Media must use HTTPS or local asset paths.';return;}}
 obj.position=Number(obj.position)||0;
 obj.status=publish?'published':'draft';obj.updated_at=new Date().toISOString();
 if(editorType==='project'&&publish)obj.published_at=new Date().toISOString();
 if(editorId)obj.id=editorId;
 const table=editorType==='project'?'cms_projects':'cms_services';
 const btn=publish?$('#savePublish'):$('#saveDraft');btn.disabled=true;
 try {
 const live=(editorType==='project'?state.projects:state.services).find(r=>r.id===editorId);
 if(!publish&&live?.status==='published'){
   if(state.contentDraftsError)throw new Error('Private revisions require supabase/upgrade_v4_6_content_drafts.sql. The live record has not been changed.');
   const {error}=await db.from('cms_content_drafts').upsert({entity_type:editorType,entity_id:editorId,content:obj,updated_at:obj.updated_at},{onConflict:'entity_type,entity_id'});if(error)throw error;
 }else{const {error}=await db.from(table).upsert(obj,{onConflict:'id'});if(error)throw error;
   if(publish&&editorId&&!state.contentDraftsError){const cleanup=await db.from('cms_content_drafts').delete().eq('entity_type',editorType).eq('entity_id',editorId);if(cleanup.error)toast('Published, but the old revision could not be cleared.');}
 }
 $('#editorDialog').close();await refresh();changeView(editorType==='project'?'projects':'services');toast(publish?'Published. Your public sites will show it on reload.':'Draft saved privately.');}
 catch(error){$('#editorMessage').textContent=error.message||'Could not save.';}
 finally{btn.disabled=false;}
}
async function deleteRow(type,id){
 const table=type==='project'?'cms_projects':'cms_services';
 if(!confirm('Delete this '+type+' permanently? This cannot be undone.'))return;
 const {error}=await db.from(table).delete().eq('id',id);if(error){toast(error.message);return;}
 await refresh();render();toast('Deleted.');
}
async function saveSettings(publish){
 const form=$('#settingsForm'),content={...(state.settingsDraft?.content||state.settings?.content||{})};
 for(const [key] of SETTINGS_FIELDS){if(key==='section')continue;content[key]=form.elements.namedItem(key).value.trim();}
 const csv=form.elements.namedItem('campaign_csv').value.trim();
 content.campaign_demo=form.elements.namedItem('campaign_demo').checked;
 if(csv){
   const rows=csv.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
   const header=rows.shift().split(',').map(x=>x.trim().toLowerCase());
   const expected=['month','spend','revenue','impressions','clicks','conversions'];
   if(header.join(',')!==expected.join(',')){toast('CSV column header must be: '+expected.join(','));return;}
   const numeric=expected.slice(1);
   const parsed=rows.map(line=>{
     const cells=line.split(',').map(x=>x.trim());
     if(cells.length!==6)throw Error('CSV row must have 6 columns.');
     const row={month:cells[0]};
     numeric.forEach((k,i)=>{row[k]=Number(cells[i+1]);if(!Number.isFinite(row[k])||row[k]<0)throw Error('Invalid value in '+k);});
     if(!row.month)throw Error('Month is required.');
     return row;
   });
   if(parsed.length>24) {toast('Maximum 24 CSV rows.');return;}
   content.campaign_data=parsed;
 }else content.campaign_data=[];
 if(publish&&content.campaign_data.length&&!content.campaign_demo&&!confirm('I confirm these are real, verified figures and that I have permission to publish them.'))return;
 const table=publish?'cms_settings':'cms_settings_drafts';
 const record=publish?{id:'main',content,published:true,updated_at:new Date().toISOString()}:{id:'main',content,updated_at:new Date().toISOString()};
 const {error}=await db.from(table).upsert(record,{onConflict:'id'});
 if(error){$('#settingsMessage').textContent=error.message;return;}
 if(publish)await db.from('cms_settings_drafts').delete().eq('id','main');
 await refresh();render();toast(publish?'Website content published.':'Saved as private draft; live content remains unchanged.');
}
async function checkCMSConnection(){
 const report=$('#healthReport');if(!report)return;
 report.hidden=false;report.innerHTML='<h2>CMS connection check</h2><p>Testing database and media permissions…</p>';
 const tests=[['Projects',()=>db.from('cms_projects').select('id',{count:'exact',head:true})],
 ['Services & pricing',()=>db.from('cms_services').select('id,pricing_type,price_amount',{count:'exact',head:true})],
 ['Project gallery & classification',()=>db.from('cms_projects').select('id,gallery_urls,project_kind',{count:'exact',head:true})],
 ['Service images',()=>db.from('cms_services').select('id,image_url',{count:'exact',head:true})],
 ['Website / Portfolio sections',()=>db.from('cms_page_sections').select('id',{count:'exact',head:true})],
 ['Global settings',()=>db.from('cms_settings').select('id',{count:'exact',head:true})],
 ['Media storage',()=>db.storage.from('karam-media').list('uploads',{limit:1})]];
 const results=await Promise.all(tests.map(async ([name,fn])=>{try{const r=await fn();return {name,error:r.error?.message||''};}catch(e){return{name,error:e.message||String(e)};}}));
 report.innerHTML='<h2>CMS connection check</h2>'+results.map(r=>'<p>'+ (r.error?'✗ ':'✓ ')+esc(r.name)+(r.error?' — '+esc(r.error):' — OK')+'</p>').join('')+'<p class="settings-note">All checks must pass before publishing. The checks do not write or modify any data.</p>';
}
async function uploadMedia(files){
 const allowed=['image/jpeg','image/png','image/webp','image/avif','image/gif','video/mp4','video/webm','application/pdf'];
 let success=0;
 for(const file of files){
  if(!allowed.includes(file.type)){toast('Unsupported file: '+file.name);continue;}
  if(file.size>45*1024*1024){toast('File larger than 45MB: '+file.name);continue;}
  const ext={ 'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif','image/gif':'gif','video/mp4':'mp4','video/webm':'webm','application/pdf':'pdf'}[file.type];
  const path='uploads/'+crypto.randomUUID()+'.'+ext;
  const {error}=await db.storage.from('karam-media').upload(path,file,{contentType:file.type,upsert:false,cacheControl:'3600'});
  if(error){toast('Upload failed: '+error.message);}else success++;
 }
 if(success){await loadMedia();render();toast(success+' file(s) uploaded.');}
}
// Upload a PDF straight into a settings field (portfolio PDF / CV) without leaving the form.
async function uploadPdfInto(field,file){
 if(!file)return;
 if(file.type!=='application/pdf'){toast('Choose a PDF file.');return;}
 if(file.size>45*1024*1024){toast('PDF larger than 45MB.');return;}
 const path='uploads/'+(field==='cv_url'?'cv-':'portfolio-')+crypto.randomUUID()+'.pdf';
 toast('Uploading PDF…');
 const {error}=await db.storage.from('karam-media').upload(path,file,{contentType:'application/pdf',upsert:false,cacheControl:'3600'});
 if(error){toast('Upload failed: '+error.message);return;}
 const url=db.storage.from('karam-media').getPublicUrl(path).data.publicUrl;
 const input=$('#settingsForm')?.elements.namedItem(field);if(input)input.value=url;
 toast('PDF uploaded. Select “Publish updates” to make it live on the portfolio.');
}
async function removeMedia(path){
 if(!confirm('Delete this asset permanently? Any project using its URL may show a broken image.'))return;
 const {error}=await db.storage.from('karam-media').remove([path]);if(error){toast(error.message);return;}
 await loadMedia();render();toast('Asset deleted.');
}
async function pickMedia(field){
 activePickerField=field;
 try{await loadMedia();$('#pickerGrid').innerHTML=mediaCards(true)||'<div class="empty">Upload assets under Media Library first.</div>';$('#mediaDialog').showModal();}
 catch(err){toast(err.message);}
}


// Color palette editor; settings are published independently of content drafts.
const APPEARANCE_PRESETS={
 'karam-signature':{background:'#101012',surface:'#19191D',text:'#F4EEE6',accent:'#8B2945'},
 'cinematic-burgundy':{background:'#090A10',surface:'#12131C',text:'#F5F3F5',accent:'#E13A61'},
 'adams-clay':{background:'#17110E',surface:'#241A15',text:'#F4EEE6',accent:'#C47A4E'},
 'midnight-blue':{background:'#0A0F1A',surface:'#131B2C',text:'#EEF2F8',accent:'#4A8FD0'},
 'ivory-burgundy':{background:'#FAF7F2',surface:'#FFFFFF',text:'#2C1C23',accent:'#78263E'},
 'white-burgundy':{background:'#FFFFFF',surface:'#F8F0F2',text:'#25181E',accent:'#861A3C'},
 'dark-creative':{background:'#090F16',surface:'#111B24',text:'#EEF4F6',accent:'#A9F1D7'},
 'minimal-luxury':{background:'#F6F3ED',surface:'#FFFFFF',text:'#171B24',accent:'#BE8F65'},
 'creative-studio':{background:'#101020',surface:'#27235B',text:'#F5F0FF',accent:'#A689FF'}
};
const PRESET_NAMES={'karam-signature':['Karam signature','توقيع كرم'],'cinematic-burgundy':['Cinematic rose','وردي سينمائي'],'adams-clay':['Adams Clay','آدمز كلاي'],'midnight-blue':['Midnight blue','أزرق ليلي'],'ivory-burgundy':['Ivory burgundy','عاجي برغندي'],'white-burgundy':['White burgundy','أبيض برغندي'],'dark-creative':['Dark mint','نعناعي داكن'],'minimal-luxury':['Minimal luxury','بيج فاخر'],'creative-studio':['Violet studio','استوديو بنفسجي']};
const DEFAULT_VISITOR_PALETTES=['karam-signature','cinematic-burgundy','adams-clay','midnight-blue','ivory-burgundy'];
function renderAppearance(){
 const existing=state.sections.find(s=>s.page==='website'&&s.section_key==='appearance'&&s.status==='published')?.content||{};
 const colors={...APPEARANCE_PRESETS['karam-signature'],...(existing.colors||{})};
 const fx={liquid:true,glow:true,scroll:true,squares:true,...(existing.effects||{})};
 const visitor={enabled:true,...(existing.visitor||{})};
 const allowed=Array.isArray(visitor.palettes)?visitor.palettes.map(p=>p.id):DEFAULT_VISITOR_PALETTES;
 const labels={background:'Background / الخلفية',surface:'Cards & surfaces / البطاقات',text:'Main text / النصوص',accent:'Primary accent / اللون الأساسي'};
 const options=Object.entries(APPEARANCE_PRESETS).map(([name,colors])=>`<button type="button" class="appearance-preset" data-theme-preset="${esc(name)}"><span class="appearance-swatches">${Object.values(colors).map(c=>`<i style="background:${c}"></i>`).join('')}</span><b>${esc(PRESET_NAMES[name]?.[0]||name)}</b></button>`).join('');
 const visitorChoices=Object.entries(APPEARANCE_PRESETS).map(([name,c])=>`<label class="toggle-label"><input type="checkbox" name="visitor_palette" value="${esc(name)}" ${allowed.includes(name)?'checked':''}> <span class="appearance-swatches" style="display:inline-flex">${Object.values(c).map(v=>`<i style="background:${v}"></i>`).join('')}</span> ${esc(PRESET_NAMES[name]?.[0]||name)}</label>`).join('');
 return pageHeading('VISUAL IDENTITY','Appearance & Colors<span class="wine">.</span>','Publish a shared palette for your website and portfolio, choose effects, and decide which colour themes visitors can switch to.')+
 `<div class="panel"><h2>Choose a ready-made palette</h2><div class="appearance-presets">${options}</div><form id="appearanceForm"><div class="settings-form">${Object.entries(colors).map(([key,val])=>`<label class="appearance-color-row">${labels[key]}<div class="appearance-color-input"><input type="color" data-appearance-color="1" name="${key}" value="${esc(val)}"><output>${esc(val)}</output></div></label>`).join('')}<label>Website font<select name="font">${['Manrope','DM Sans','Tajawal'].map(f=>`<option ${existing.font===f?'selected':''}>${f}</option>`).join('')}</select></label><label>Corner roundness (0–28 px)<input type="number" name="radius" min="0" max="28" value="${Number.isInteger(existing.radius)?existing.radius:14}"></label></div>
 <div class="section-label" style="margin:26px 0 12px">EFFECTS / المؤثرات</div>
 <label class="toggle-label"><input type="checkbox" name="fx_liquid" ${fx.liquid!==false?'checked':''}> Liquid moving background behind the hero / خلفية سائلة متحركة</label>
 <label class="toggle-label"><input type="checkbox" name="fx_glow" ${fx.glow!==false?'checked':''}> Soft light that follows the mouse / ضوء يتبع الماوس</label>
 <label class="toggle-label"><input type="checkbox" name="fx_scroll" ${fx.scroll!==false?'checked':''}> Scroll animations on every section / حركة مع السكرول لكل الأقسام</label>
 <label class="toggle-label"><input type="checkbox" name="fx_squares" ${fx.squares!==false?'checked':''}> Square reveal on the portfolio photo / مربعات على صورة البورتفوليو</label>
 <div class="section-label" style="margin:26px 0 12px">VISITOR COLOUR SWITCHER / ألوان الزوار</div>
 <label class="toggle-label"><input type="checkbox" name="visitor_enabled" ${visitor.enabled!==false?'checked':''}> Let visitors switch the colour theme (saved only in their own browser) / اسمح للزوار بتغيير الألوان</label>
 <p class="settings-note">Themes visitors can choose. Your published palette above is always the default and is listed first.</p><div class="visitor-palettes">${visitorChoices}</div>
 <div class="settings-actions"><button class="btn primary" type="submit">Publish appearance to both sites ↗</button></div><p class="message" id="appearanceMessage" role="status"></p></form></div><div class="panel" id="adminIdentityPanel"><h2>Admin logo & header identity</h2><p class="settings-note">Your name <strong>Karam Isaid</strong> is now visible at the top of every Admin page. Choose the icon style you prefer.</p><div class="brand-choices"><button type="button" class="brand-choice" data-admin-logo-choice="classic" aria-pressed="false"><span class="brand-choice-mark">K.</span><span class="brand-choice-label"><strong>Classic K.</strong><small>Original minimal personal signature</small></span></button><button type="button" class="brand-choice" data-admin-logo-choice="editorial" aria-pressed="false"><span class="brand-choice-mark"><img src="../assets/karam-ki-mark.svg" alt=""></span><span class="brand-choice-label"><strong>Editorial KI</strong><small>New monogram, burgundy & ivory</small></span></button></div><p class="admin-brand-note">This choice is saved in your browser for the private Admin interface only. It does not automatically replace your public website logo.</p></div><p class="settings-note">Changes go live once published. Your original site files and personal preview settings remain intact.</p>`;
}
function applyThemePreset(name){
 const palette=APPEARANCE_PRESETS[name];if(!palette)return;
 for(const [key,color] of Object.entries(palette)){
  const inp=$(`#appearanceForm [name="${key}"]`);if(inp){inp.value=color;inp.closest('.appearance-color-row').querySelector('output').textContent=color;}
 }
}
async function saveAppearance(){
 const form=$('#appearanceForm'),f=form.elements;
 const colors={};for(const k of ['background','surface','text','accent'])colors[k]=f.namedItem(k).value.toUpperCase();
 const picked=[...form.querySelectorAll('[name="visitor_palette"]:checked')].map(el=>el.value).filter(id=>APPEARANCE_PRESETS[id]);
 const appearance={theme:'custom',colors,font:f.namedItem('font').value,radius:Math.max(0,Math.min(28,Number(f.namedItem('radius').value)||0)),
  effects:{liquid:f.namedItem('fx_liquid').checked,glow:f.namedItem('fx_glow').checked,scroll:f.namedItem('fx_scroll').checked,squares:f.namedItem('fx_squares').checked},
  visitor:{enabled:f.namedItem('visitor_enabled').checked,palettes:picked.map(id=>({id,name:{en:PRESET_NAMES[id]?.[0]||id,ar:PRESET_NAMES[id]?.[1]||id},colors:APPEARANCE_PRESETS[id]}))}};
 const rows=['website','portfolio'].map(page=>({page,section_key:'appearance',status:'published',position:0,visible:true,content:appearance,updated_at:new Date().toISOString()}));
 const {error}=await db.from('cms_page_sections').upsert(rows,{onConflict:'page,section_key,status'});
 if(error){$('#appearanceMessage').textContent=error.message;return;}
 await refresh();render();toast('Published appearance to both sites. Refresh public pages to see it.');
}

// === WEBSITE & PORTFOLIO SECTIONS MANAGER (v4) ===
const defByKey=key=>SECTION_DEFS.find(d=>d.page+':'+d.key===key);
const rowsFor=(page)=>SECTION_DEFS.filter(d=>d.page===page);
const sectionRecord=(def,stage)=>state.sections.find(r=>r.page===def.page&&r.section_key===def.key&&r.status===stage);
function makeLayout(page){
 const defs=rowsFor(page);
 return defs.map(def=>({key:def.key,def,visible:sectionRecord(def,'published')?.visible??true,
   position:sectionRecord(def,'published')?.position??def.position})).sort((a,b)=>a.position-b.position);
}
function renderSectionList(page){
 if(!layoutDraft||layoutDraft.page!==page){layoutDraft=makeLayout(page);layoutDraft.page=page;}
 const warning=state.sectionsError?`<div class="setup-alert">Database update needed: run <code>supabase/upgrade_v4_sections.sql</code> in your Supabase SQL Editor first. ${esc(state.sectionsError)}</div>`:'';
 const content=layoutDraft.map((item,i)=>{
  const def=item.def,pub=sectionRecord(def,'published'),draft=sectionRecord(def,'draft');
  return `<article class="section-admin-item"><div class="section-order">${String(i+1).padStart(2,'0')}</div>
  <div class="section-admin-info"><b>${esc(def.label)}</b><small>${esc(def.description)} · ${def.keys.length} editable texts · EN + AR</small><span>${pub?'● PUBLISHED':'○ ORIGINAL DEFAULT'} ${draft?' · DRAFT SAVED':''}</span></div>
  <label class="section-visibility"><input type="checkbox" data-layout-visible="${esc(def.key)}" ${item.visible?'checked':''}> <span>Visible</span></label>
  <div class="section-admin-actions"><button type="button" class="action-btn" data-layout-move="${esc(def.key)}" data-direction="-1" ${i===0||['navigation','footer'].includes(item.key)?'disabled':''} aria-label="Move up">↑</button><button type="button" class="action-btn" data-layout-move="${esc(def.key)}" data-direction="1" ${i===layoutDraft.length-1||['navigation','footer'].includes(item.key)?'disabled':''} aria-label="Move down">↓</button>
  <button type="button" class="btn primary section-edit-button" data-section-edit="${esc(def.page+':'+def.key)}">Edit details ↗</button></div></article>`;
 }).join('');
 return pageHeading(page==='website'?'WEBSITE DESIGN & CONTENT':'PORTFOLIO DESIGN & CONTENT',page==='website'?'Website Sections<span class="wine">.</span>':'Portfolio Sections<span class="wine">.</span>','Show, hide, reorder, and edit every section in Arabic and English. Changes are not public until published.',`<a class="btn secondary" href="${page==='website'?'../index.html':'../portfolio/index.html'}" target="_blank" rel="noopener">Open public page ↗</a>`)+warning+`
 <div class="panel"><div class="panel-top"><div><h2>Section layout & visibility</h2><p>Toggle visibility and use ↑ ↓ to reorder the main sections (header and footer stay fixed). Click Publish layout to make this arrangement live for visitors.</p></div><span class="status published">${layoutDraft.filter(x=>x.visible).length} VISIBLE</span></div>
 <div class="section-admin-list">${content}</div><div class="settings-actions"><button type="button" class="btn primary" data-layout-publish="1" ${state.sectionsError?'disabled':''}>Publish layout & visibility ↗</button><button type="button" class="btn secondary" data-layout-preview="1">Preview layout</button><button type="button" class="btn secondary" data-layout-reset="1">Restore original layout (preview)</button></div></div>
 <div class="guide-grid"><div class="guide-card"><span class="guide-icon">✎</span><b>Text & CTA editor</b><p>Click Edit details for headlines, descriptions, buttons, labels and bilingual content.</p></div><div class="guide-card"><span class="guide-icon">▣</span><b>Media & imagery</b><p>Use the asset picker and Media Library to replace photos, showreels and before/after visuals.</p></div><div class="guide-card"><span class="guide-icon">◈</span><b>Projects & data</b><p>Use Projects for case studies, Media for uploads, and Global Settings for analytics and social URLs.</p></div></div>`;
}
function moveLayout(key,direction){
 if(!layoutDraft)return;
 const i=layoutDraft.findIndex(x=>x.key===key),j=i+direction;
 if(['navigation','footer'].includes(key)||['navigation','footer'].includes(layoutDraft[j]?.key))return;
 if(i<0||j<0||j>=layoutDraft.length)return;
 [layoutDraft[i],layoutDraft[j]]=[layoutDraft[j],layoutDraft[i]];
 render();
}
function resetSectionLayout(){if(!layoutDraft)return;const page=layoutDraft.page;layoutDraft=rowsFor(page).map(def=>({key:def.key,def,visible:true,position:def.position}));layoutDraft.page=page;toast('Restored original ordering and visibility in preview. Publish to apply.');render();}
async function publishSectionLayout(){
 if(!layoutDraft||state.sectionsError)return;
 const page=layoutDraft.page,items=layoutDraft.map((item,index)=>{
  const pub=sectionRecord(item.def,'published');
  return {page,section_key:item.key,status:'published',position:index,visible:item.visible,content:pub?.content||{},updated_at:new Date().toISOString()};
 });
 if(!confirm('Publish this page layout and visibility to all visitors? Hidden sections can be restored later.'))return;
 const {error}=await db.from('cms_page_sections').upsert(items,{onConflict:'page,section_key,status'});
 if(error){toast('Could not publish layout: '+error.message);return;}
 await refresh();layoutDraft=makeLayout(page);layoutDraft.page=page;render();toast('Section visibility and order published. Reload the public page to verify.');
}
function openSectionEditor(key){
 const def=defByKey(key);if(!def)return;
 sectionEditorDef=def;
 const data=sectionRecord(def,'draft')||sectionRecord(def,'published'),content=data?.content||{};
 const groups=['en','ar'].map(code=>`<fieldset class="locale-fields"><legend>${code==='en'?'English content':'المحتوى العربي'}</legend><div class="fields">${def.keys.map(k=>{
  const value=content[code]?.[k]||'',placeholder=(def.defaults[k]||'').slice(0,140);
  const label=k.replace(/([a-z])([A-Z0-9])/g,'$1 $2').replace(/([0-9])([a-z])/g,'$1 $2');
  const multiline=placeholder.length>85||/intro|body|description|note|copy|text|summary/i.test(k);
  return `<label class="full">${esc(label)}${multiline?`<textarea data-locale="${code}" name="${code}_${k}" rows="2" placeholder="${esc(code==='ar'?'Leave blank to keep original Arabic':placeholder)}">${esc(value)}</textarea>`:`<input data-locale="${code}" name="${code}_${k}" value="${esc(value)}" placeholder="${esc(code==='ar'?'Leave blank to keep original Arabic':placeholder)}">`}</label>`;
 }).join('')}</div></fieldset>`).join('');
 const mediaFields=def.media.length?`<fieldset class="locale-fields"><legend>Section Images & Video</legend><div class="fields">${def.media.map(m=>`<label class="full">${esc(m.label)}<div class="media-field"><input name="media_${m.key}" value="${esc(content.media?.[m.key]||'')}" placeholder="https://... or choose from Media Library"><button type="button" data-media-pick="media_${m.key}">Browse</button></div></label>`).join('')}</div></fieldset>`:'';
 $('#sectionEditorTitle').textContent=def.label+' / '+(def.page==='website'?'Website':'Portfolio');
 $('#sectionEditorFields').innerHTML=`<div class="section-editor-help">Changes to this section do not affect other sections. Empty fields keep the original built-in text. <a href="${def.page==='website'?'../index.html':'../portfolio/index.html'}" target="_blank" rel="noopener">View page ↗</a></div><div class="fields"><label>Position<input name="position" type="number" min="0" max="100" value="${data?.position??def.position}"></label><label class="toggle-label"><input type="checkbox" name="visible" ${data?.visible!==false?'checked':''}> Show this section publicly</label></div>`+groups+mediaFields+sectionExtraFields(def,content);
 $('#sectionEditorMessage').textContent='';$('#sectionEditorDialog').showModal();
}
async function saveSectionEditor(publish){
 const def=sectionEditorDef;if(!def)return;
 const form=$('#sectionEditorForm');const previous=sectionRecord(def,'draft')||sectionRecord(def,'published');const content={...(previous?.content||{}),en:{...(previous?.content?.en||{})},ar:{...(previous?.content?.ar||{})},media:{...(previous?.content?.media||{})},links:{...(previous?.content?.links||{})},options:{...(previous?.content?.options||{})}};
 for(const lang of ['en','ar'])for(const key of def.keys){
   const val=form.elements.namedItem(lang+'_'+key)?.value?.trim()||'';
   if(val)content[lang][key]=val;else delete content[lang][key];
 }
 for(const m of def.media){const v=form.elements.namedItem('media_'+m.key)?.value?.trim()||'';
  if(v && !window.KARAM_CMS_CORE.url(v)){$('#sectionEditorMessage').textContent='Media URLs must use HTTPS or a local assets/ path.';return;}
  if(v)content.media[m.key]=v;else delete content.media[m.key];
 }
 for(const link of def.links||[]){const v=form.elements.namedItem('link_'+link.key)?.value.trim()||'';if(v&&!window.KARAM_CMS_CORE.url(v,{link:true})){$('#sectionEditorMessage').textContent='Use HTTPS or a local #section destination.';return;}if(v)content.links[link.key]=v;else delete content.links[link.key];}
 if(def.projectSelection)content.options.project_ids=[...form.querySelectorAll('[name="selected_project"]:checked')].map(el=>el.value);
 if(def.autoplayOption)content.options.autoplay=!!form.elements.namedItem('opt_autoplay')?.checked;
 const status=publish?'published':'draft';
 const input={page:def.page,section_key:def.key,status,position:Number(form.elements.namedItem('position').value)||0,visible:form.elements.namedItem('visible').checked,content,updated_at:new Date().toISOString()};
 const btn=publish?$('#sectionPublish'):$('#sectionSaveDraft');btn.disabled=true;
 try{const {error}=await db.from('cms_page_sections').upsert(input,{onConflict:'page,section_key,status'});if(error)throw error;
  if(publish){const {error:delError}=await db.from('cms_page_sections').delete().eq('page',def.page).eq('section_key',def.key).eq('status','draft');if(delError)console.warn(delError);}
  await refresh();layoutDraft=makeLayout(def.page);layoutDraft.page=def.page;
  $('#sectionEditorDialog').close();changeView(def.page==='website'?'sections':'portfolioSections');toast(publish?'Section published successfully.':'Private section draft saved.');
 }catch(error){$('#sectionEditorMessage').textContent=error.message||'Unable to save.';}finally{btn.disabled=false;}
}

async function restoreSession(){
 if(!configured||!window.supabase){$('#setupWarning').hidden=false;$('#loginSubmit').disabled=true;return;}
 db=window.supabase.createClient(conf.url,conf.anonKey,{auth:{persistSession:true,autoRefreshToken:true}});
 const {data:{user},error}=await db.auth.getUser();if(!error&&user)await authorize(user);
}
async function authorize(user){
 const {data,error}=await db.from('cms_admins').select('user_id').eq('user_id',user.id).maybeSingle();
 if(error||!data){await db.auth.signOut();$('#loginError').textContent='This account is not an approved CMS admin. Add its User UUID in cms_admins using Supabase SQL Editor.';return;}
 try {await refresh(true);$('#loginLayout').hidden=true;$('#adminShell').hidden=false;changeView('overview');}
 catch(error){$('#loginError').textContent='CMS connection failed: '+(error.message||'check your SQL setup');}
}
$('#loginForm').addEventListener('submit',async e=>{
 e.preventDefault();if(!db)return;
 const btn=$('#loginSubmit');btn.disabled=true;$('#loginError').textContent='';
 try{const {data,error}=await db.auth.signInWithPassword({email:$('#loginEmail').value.trim(),password:$('#loginPassword').value});if(error)throw error;await authorize(data.user);}
 catch(error){$('#loginError').textContent=error.message||'Sign in failed.';}
 finally{btn.disabled=false;}
});
$('#logout').addEventListener('click',async()=>{await db.auth.signOut();$('#adminShell').hidden=true;$('#loginLayout').hidden=false;$('#loginPassword').value='';});
$('#nav').addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b){searchText='';filterValue='all';changeView(b.dataset.view);}});
$('#menuButton').addEventListener('click',()=>$('.sidebar').classList.toggle('open'));
$('#view').addEventListener('click',async e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.previewPage)previewPage(b.dataset.previewPage);
 if(b.dataset.go)changeView(b.dataset.go);
 if(b.dataset.health)await checkCMSConnection();
 if(b.dataset.brandProject)openBrandProject(b.dataset.brandProject);
 if(b.dataset.create)openEditor(b.dataset.create,null);
 if(b.dataset.edit)openEditor(b.dataset.edit,b.dataset.id);
 if(b.dataset.delete)await deleteRow(b.dataset.delete,b.dataset.id);
 if(b.dataset.filter){filterValue=b.dataset.filter;render();}
 if(b.hasAttribute('data-refresh-media')){await loadMedia();render();toast('Media library refreshed.');}
 if(b.dataset.copy){const item=state.media.find(f=>f.path===b.dataset.copy);if(item){await navigator.clipboard.writeText(item.url);toast('Public URL copied.');}}
 if(b.dataset.removeMedia)await removeMedia(b.dataset.removeMedia);
 if(b.dataset.saveSettings){try{await saveSettings(false);}catch(err){toast(err.message);}}
 if(b.dataset.mediaPick)await pickMedia(b.dataset.mediaPick);
 if(b.dataset.sectionEdit)openSectionEditor(b.dataset.sectionEdit);
 if(b.dataset.layoutMove)moveLayout(b.dataset.layoutMove,Number(b.dataset.direction));
 if(b.dataset.layoutPreview)previewPage(layoutDraft?.page||'website');
 if(b.dataset.layoutReset)resetSectionLayout();
 if(b.dataset.layoutPublish)await publishSectionLayout();
 if(b.dataset.themePreset)applyThemePreset(b.dataset.themePreset);
 if(b.dataset.adminLogoChoice){setAdminLogoStyle(b.dataset.adminLogoChoice);toast('Admin identity updated — saved on this browser.');}
});
$('#view').addEventListener('input',e=>{if(e.target.id==='searchProjects'){const value=e.target.value;searchText=value;const start=e.target.selectionStart;render();const field=$('#searchProjects');field?.focus();field?.setSelectionRange(start,start);}});
$('#view').addEventListener('change',async e=>{
 if(e.target.id==='mediaUpload'){await uploadMedia([...e.target.files]);}
 if(e.target.dataset?.pdfUpload){await uploadPdfInto(e.target.dataset.pdfUpload,e.target.files[0]);e.target.value='';}
 if(e.target.matches('[data-appearance-color]'))e.target.closest('.appearance-color-row')?.querySelector('output')?.replaceChildren(document.createTextNode(e.target.value.toUpperCase()));
 if(e.target.dataset.layoutVisible && layoutDraft) {const item=layoutDraft.find(x=>x.key===e.target.dataset.layoutVisible);if(item)item.visible=e.target.checked;}
 if(e.target.dataset.inquiryStatus){const {error}=await db.from('cms_inquiries').update({status:e.target.value}).eq('id',e.target.dataset.inquiryStatus);if(error)toast(error.message);else{await refresh();render();toast('Inquiry updated.');}}
});
$('#view').addEventListener('submit',async e=>{if(e.target.id==='settingsForm'){e.preventDefault();try{await saveSettings(true);}catch(err){toast(err.message);}}
 if(e.target.id==='appearanceForm'){e.preventDefault();await saveAppearance();}});
$('#editorForm').addEventListener('submit',async e=>{e.preventDefault();await saveEditor(true);});
$('#saveDraft').addEventListener('click',()=>saveEditor(false));
$('#editorFields').addEventListener('click',e=>{const b=e.target.closest('[data-media-pick]');if(b)pickMedia(b.dataset.mediaPick);});
$('#sectionEditorForm').addEventListener('submit',async e=>{e.preventDefault();await saveSectionEditor(true);});
$('#sectionSaveDraft').addEventListener('click',()=>saveSectionEditor(false));
$('#closeSectionEditor').addEventListener('click',()=>$('#sectionEditorDialog').close());
$('#sectionEditorFields').addEventListener('click',e=>{const b=e.target.closest('[data-media-pick]');if(b)pickMedia(b.dataset.mediaPick);});
$('#closeEditor').addEventListener('click',()=>$('#editorDialog').close());
$('#closeMediaPicker').addEventListener('click',()=>$('#mediaDialog').close());
$('#pickerGrid').addEventListener('click',e=>{
 const b=e.target.closest('[data-pick]');if(!b)return;
 const f=state.media.find(x=>x.path===b.dataset.pick);if(!f)return;
 const target=$('#sectionEditorDialog').open?$('#sectionEditorForm').elements.namedItem(activePickerField):$('#editorDialog').open?$('#editorForm').elements.namedItem(activePickerField):$('#settingsForm')?.elements.namedItem(activePickerField);
 if(target){target.value=activePickerField==='gallery_urls' ? [target.value.trim(),f.url].filter(Boolean).join('\n') : f.url;target.dispatchEvent(new Event('input',{bubbles:true}));}
 $('#mediaDialog').close();toast('Asset linked. Save to publish it.');
});
function sectionExtraFields(def,content){
 const links=(def.links||[]).map(link=>`<label class="full">${esc(link.label)}<input name="link_${esc(link.key)}" value="${esc(content.links?.[link.key]||'')}" placeholder="https://... or #contact"></label>`).join('');
 const selected=content.options?.project_ids||[];
 const selectable=state.projects.filter(p=>p.status==='published'&&(!def.videoSelection||/\.(mp4|webm|m4v|ogv)(?:[?#]|$)/i.test(p.video_url||'')));
 const choices=def.projectSelection?`<fieldset class="locale-fields"><legend>Project selection</legend><p>${def.videoSelection?'Choose published projects with a direct MP4, WebM, M4V or OGV video. Leave empty to include all published videos.':'Choose published projects. Leave empty for featured projects (showcase) or available video/comparison projects.'} Their display order follows Projects → Display order.</p>${selectable.map(p=>`<label class="toggle-label"><input name="selected_project" type="checkbox" value="${esc(p.slug)}" ${selected.includes(p.slug)?'checked':''}> ${esc(p.title_en)}</label>`).join('')||'<p>Publish a real project'+(def.videoSelection?' with a video':'')+' first.</p>'}</fieldset>`:'';
 const auto=def.autoplayOption?`<fieldset class="locale-fields"><legend>Playback</legend><label class="toggle-label"><input type="checkbox" name="opt_autoplay" ${content.options?.autoplay!==false?'checked':''}> Auto-play the reel on screen (muted, stops when the visitor scrolls away)</label></fieldset>`:'';
 return (links?'<fieldset class="locale-fields"><legend>Button destinations</legend><div class="fields">'+links+'</div></fieldset>':'')+choices+auto;
}
function currentSectionDraft(){
 const def=sectionEditorDef,form=$('#sectionEditorForm');if(!def)return null;
 const old=sectionRecord(def,'draft')||sectionRecord(def,'published');
 const content={...(old?.content||{}),en:{...(old?.content?.en||{})},ar:{...(old?.content?.ar||{})},media:{...(old?.content?.media||{})},links:{...(old?.content?.links||{})},options:{...(old?.content?.options||{})}};
 for(const lang of ['en','ar'])for(const key of def.keys){const value=form.elements.namedItem(lang+'_'+key)?.value.trim();if(value)content[lang][key]=value;}
 for(const m of def.media){const value=form.elements.namedItem('media_'+m.key)?.value.trim();if(value)content.media[m.key]=value;}
 for(const link of def.links||[]){const value=form.elements.namedItem('link_'+link.key)?.value.trim();if(value)content.links[link.key]=value;}
 if(def.projectSelection)content.options.project_ids=[...form.querySelectorAll('[name="selected_project"]:checked')].map(el=>el.value);
 if(def.autoplayOption)content.options.autoplay=!!form.elements.namedItem('opt_autoplay')?.checked;
 return {page:def.page,section_key:def.key,status:'published',position:Number(form.elements.namedItem('position').value)||0,visible:form.elements.namedItem('visible').checked,content};
}
function previewPage(page){
 if(!db){toast('Sign in before previewing private content.');return;}
 const projects=state.projects.map(p=>({...p})),services=state.services.map(s=>({...s}));
 for(const d of state.contentDrafts){const list=d.entity_type==='project'?projects:services;const index=list.findIndex(x=>x.id===d.entity_id);if(index>=0)list[index]={...list[index],...d.content};}
 for(const row of [...projects,...services])row.status='published';
 if($('#editorDialog').open){
   const obj=gather($('#editorForm'),editorType==='project'?PROJECT_FIELDS:SERVICE_FIELDS);
   if(editorType==='project'){obj.tags=String(obj.tags||'').split(',').map(x=>x.trim()).filter(Boolean);obj.gallery_urls=String(obj.gallery_urls||'').split(/\r?\n/).filter(Boolean);}
   obj.id=editorId||'preview';obj.slug=obj.slug||'private-preview';obj.status='published';
   const list=editorType==='project'?projects:services,index=list.findIndex(x=>x.id===editorId);if(index>=0)list[index]=obj;else list.push(obj);
 }
 const sectionMap=new Map();
 for(const row of state.sections.filter(r=>r.status==='published'))sectionMap.set(row.page+':'+row.section_key,{...row});
 for(const row of state.sections.filter(r=>r.status==='draft'))sectionMap.set(row.page+':'+row.section_key,{...row,status:'published'});
 if($('#sectionEditorDialog').open){const row=currentSectionDraft();if(row)sectionMap.set(row.page+':'+row.section_key,row);}
 if(layoutDraft&&layoutDraft.page===page&&!$('#sectionEditorDialog').open){layoutDraft.forEach((item,index)=>{const key=page+':'+item.key;const old=sectionMap.get(key);sectionMap.set(key,{...old,page,section_key:item.key,status:'published',position:index,visible:item.visible,content:old?.content||{}});});}
 const settings={...(state.settingsDraft?.content||state.settings?.content||{})};
 if($('#settingsForm'))for(const [key]of SETTINGS_FIELDS){if(key!=='section')settings[key]=$('#settingsForm').elements.namedItem(key).value.trim();}
 projects.sort((a,b)=>(a.position||0)-(b.position||0));services.sort((a,b)=>(a.position||0)-(b.position||0));
 const content={projects,services,sections:[...sectionMap.values()],settings};
 const target=page==='portfolio'?'../portfolio/index.html':'../index.html';
 const popup=window.open(target+'?cms-preview=1','_blank');if(!popup){toast('Allow this site to open the private preview tab.');return;}
 const receive=event=>{if(event.origin===location.origin&&event.source===popup&&event.data?.type==='karam:preview-ready'){popup.postMessage({type:'karam:preview-data',content},location.origin);window.removeEventListener('message',receive);}};
 window.addEventListener('message',receive);setTimeout(()=>window.removeEventListener('message',receive),30000);
}
$('#sectionPreview').addEventListener('click',()=>previewPage(sectionEditorDef?.page||'website'));
$('#contentPreview').addEventListener('click',()=>previewPage(editorType==='project'?'portfolio':'website'));
$('#unpublishContent').addEventListener('click',async()=>{
 if(!editorId||!confirm('Unpublish this record? It will be removed from public views. Your private revision is retained.'))return;
 const table=editorType==='project'?'cms_projects':'cms_services';
 const {error}=await db.from(table).update({status:'draft',updated_at:new Date().toISOString()}).eq('id',editorId);
 if(error){toast(error.message);return;}$('#editorDialog').close();await refresh();render();toast('Unpublished.');
});

restoreSession();
})();
