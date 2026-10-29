/* Shared public/admin validation; Supabase RLS is the access boundary. */
(() => {
  'use strict';
  const rootURL = new URL('.', document.querySelector('script[src$="cms-core.js"]')?.src || location.href);
  const text = value => typeof value === 'string' ? value.trim() : '';
  function url(value, { link = false } = {}) {
    const v = text(value);
    if (!v || /[\s<>"'\\\x00-\x1f]/.test(v) || v.startsWith('//')) return '';
    if (link && /^(#[\w-]+|mailto:[^\s@]+@[^\s@]+\.[^\s@]+|tel:\+?[\d()-]+)$/.test(v)) return v;
    try { const p = new URL(v, rootURL); return (p.protocol === 'https:' || p.origin === location.origin) && !p.username && !p.password ? p.href : ''; } catch { return ''; }
  }
  function media(value){
    const safe=url(value);if(!safe)return null;
    const parsed=new URL(safe),match=/^\/(?:[A-Za-z0-9._]+\/)?(p|reel)\/([A-Za-z0-9_-]+)\/?$/.exec(parsed.pathname);
    if(['instagram.com','www.instagram.com'].includes(parsed.hostname)&&match)return {type:'instagram',kind:match[1]==='reel'?'video':'image',url:'https://www.instagram.com/'+match[1]+'/'+match[2]+'/'};
    return {type:/\.(mp4|webm|m4v|ogv)$/i.test(parsed.pathname)?'video':'image',url:safe};
  }
  function brandMark(value){try{return /(?:^|\/|[-_])(logo|wordmark|monogram)(?:[-_.]|$)/i.test(new URL(url(value)).pathname);}catch{return false;}}
  function project(p) {
    const bi = key => ({en:text(p[key+'_en']),ar:text(p[key+'_ar'])||text(p[key+'_en'])});
    return {id:text(p.slug),recordId:p.id,category:text(p.category),featured:p.featured===true,project_kind:['client','personal','concept'].includes(p.project_kind)?p.project_kind:'concept',position:Number(p.position)||0,year:text(p.year),accent:'plum',title:bi('title'),type:bi('type'),short:bi('summary'),challenge:bi('challenge'),solution:bi('solution'),results:bi('results'),cover:url(p.cover_url),video:url(p.video_url),before:url(p.before_url),after:url(p.after_url),gallery:Array.isArray(p.gallery_urls)?p.gallery_urls.map(v=>url(v)).filter(Boolean):[],tags:Array.isArray(p.tags)?p.tags.filter(v=>typeof v==='string'):[]};
  }
  function price(s,lang='en') {
    const amount=Number(s.price_amount);
    if(s.pricing_type==='quote'||s.price_amount==null||!Number.isFinite(amount)||amount<0)return lang==='ar'?'حسب نطاق المشروع':'Custom quote';
    let formatted;try{formatted=new Intl.NumberFormat(lang==='ar'?'ar':'en',{style:'currency',currency:/^[A-Z]{3}$/.test(s.currency)?s.currency:'USD',maximumFractionDigits:amount%1?2:0}).format(amount);}catch{formatted=amount.toLocaleString(lang)+' '+text(s.currency);}
    return (s.pricing_type==='starting_at'?(lang==='ar'?'ابتداءً من ':'From '):'')+formatted;
  }
  function publicKey(value){
    if(typeof value!=='string')return false;
    if(/^sb_publishable_[A-Za-z0-9_-]+$/.test(value))return true;
    try{return JSON.parse(atob(value.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).role==='anon';}catch{return false;}
  }
  window.KARAM_CMS_CORE={url,media,brandMark,project,price,publicKey,rootURL:rootURL.href};
})();
