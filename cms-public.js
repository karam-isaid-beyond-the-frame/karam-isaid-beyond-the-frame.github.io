/* Public reads are explicitly filtered; Supabase RLS controls database access. */
(() => {
  'use strict';
  const conf=window.KARAM_SUPABASE||{},core=window.KARAM_CMS_CORE;
  const enabled=/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(conf.url||'')&&core.publicKey(conf.anonKey)&&!/YOUR_|PASTE_/i.test(conf.url+conf.anonKey);
  const base=(conf.url||'').replace(/\/$/,'')+'/rest/v1/';
  const headers={apikey:conf.anonKey||'',Accept:'application/json'};
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  let previewReceived=false;
  async function read(resource,query) {
    for(let attempt=0;attempt<2;attempt++){
      try{
        const response=await fetch(base+resource+'?'+query,{headers,cache:'no-store',signal:AbortSignal.timeout(15000)});
        if(!response.ok){const error=new Error(resource+' HTTP '+response.status);error.retryable=response.status>=500;throw error;}
        const data=await response.json();if(!Array.isArray(data))throw new Error('Invalid CMS response');return data;
      }catch(error){
        const transient=error.retryable||['TypeError','TimeoutError','AbortError'].includes(error.name);
        if(attempt===1||!transient)throw error;
        await new Promise(resolve=>setTimeout(resolve,250));
      }
    }
  }
  function apply({projects=[],services=[],settings={},errors={},status='ready'}) {
    const mapped=projects.filter(p=>p.status==='published').map(core.project).filter(p=>p.id);
    const publishedServices=services.filter(s=>s.status==='published');
    if(window.PORTFOLIO) {
      const cfg=window.PORTFOLIO;cfg.projects=mapped;
      for(const key of ['email','instagram','linkedin'])if(settings[key]!==undefined)cfg[key]=settings[key];
      if(settings.about_en!==undefined||settings.about_ar!==undefined)cfg.about={en:settings.about_en||'',ar:settings.about_ar||settings.about_en||''};
      cfg.resume=core.url(settings.cv_url);
      cfg.location={en:settings.location_en||'',ar:settings.location_ar||settings.location_en||''};
      cfg.campaignData=Array.isArray(settings.campaign_data)&&settings.campaign_demo===false?settings.campaign_data:[];
      cfg.campaignDemo=settings.campaign_demo!==false;
    }
    if(window.KARAM_SITE)for(const [key,source]of Object.entries({email:'email',instagram:'instagram',linkedin:'linkedin',photo:'photo',showreelVideo:'showreel_video',showreelPoster:'showreel_poster'}))
      if(settings[source]!==undefined)window.KARAM_SITE[key]=settings[source];
    const detail={projects:mapped,services:publishedServices,settings,errors,status};
    window.KARAM_CMS_DATA=detail;window.dispatchEvent(new CustomEvent('karam:cms',{detail}));
  }
  async function submitInquiry(payload) {
    if(!enabled)throw new Error('CMS is not connected.');
    if(new URLSearchParams(location.search).get('cms-preview')==='1')throw new Error('Submissions are disabled in preview.');
    const response=await fetch(base+'cms_inquiries',{method:'POST',headers:{...headers,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({name:payload.name,email:payload.email,service:payload.service,budget:payload.budget||'',timeline:payload.timeline||'',message:payload.message}),signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw new Error('Inquiry HTTP '+response.status);
  }
  window.KARAM_CMS_PUBLIC={enabled,submitInquiry,read};
  ready(async()=>{
    if(!enabled){apply({status:'unconfigured'});return;}
    const resources=[['projects','cms_projects','select=*&status=eq.published&order=position.asc,created_at.desc'],['services','cms_services','select=*&status=eq.published&order=position.asc'],['settings','cms_settings','select=*&id=eq.main&published=eq.true&limit=1']];
    const results=await Promise.allSettled(resources.map(([,table,query])=>read(table,query)));
    const content={errors:{}};
    results.forEach((result,i)=>{const name=resources[i][0];if(result.status==='fulfilled')content[name]=name==='settings'?result.value[0]?.content||{}:result.value;else content.errors[name]=result.reason.message;});
    content.status=Object.keys(content.errors).length?'error':'ready';
    if(content.status==='error')console.warn('[Karam CMS] Published content request failed',JSON.stringify(content.errors));
    if(!previewReceived)apply(content);
  });
  // Same-origin admin opener sends content only: no auth tokens or publicly persisted drafts.
  if(new URLSearchParams(location.search).get('cms-preview')==='1'&&window.opener){
    window.addEventListener('message',event=>{
      if(event.origin!==location.origin||event.source!==window.opener||event.data?.type!=='karam:preview-data')return;
      const data=event.data.content;if(!data||!Array.isArray(data.projects)||!Array.isArray(data.services)||!Array.isArray(data.sections))return;
      previewReceived=true;ready(()=>{
        apply({...data,status:'preview'});window.KARAM_APPLY_SECTIONS?.(data.sections);document.documentElement.dataset.cmsPreview='true';
        let notice=document.getElementById('cmsPreviewNotice');if(!notice){notice=document.createElement('p');notice.id='cmsPreviewNotice';notice.setAttribute('role','status');document.body.prepend(notice);}
        notice.textContent='Private draft preview — unpublished changes. Form submission disabled.';
      });
    });
    ready(()=>window.opener.postMessage({type:'karam:preview-ready'},location.origin));
  }
})();
