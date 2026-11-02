import {advertising} from './data.mjs';

export function adsEnabled(config, location){
 return config.enabled && config.consentMessagePublished && location.origin===config.origin && /^ca-pub-\d{16}$/.test(config.publisherId) && config.slots.length===2 && config.slots.every(slot=>/^\d+$/.test(slot.id)&&['left','right'].includes(slot.side));
}

export function initAds(config=advertising){
 const preview=['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).get('ads-preview')==='1';
 const live=adsEnabled(config,location);
 if((!preview&&!live)||document.querySelector('.ad-rail'))return;
 for(const slot of config.slots){
  const rail=document.createElement('aside');rail.className=`ad-rail ad-rail-${slot.side}`;rail.setAttribute('aria-label',config.label);
  const label=document.createElement('span');label.textContent=config.label;rail.append(label);
  if(preview){const box=document.createElement('div');box.className='ad-preview';box.textContent='160 × 600';rail.append(box);}
  else{const ad=document.createElement('ins');ad.className='adsbygoogle';ad.style.cssText='display:inline-block;width:160px;height:600px';ad.dataset.adClient=config.publisherId;ad.dataset.adSlot=slot.id;rail.append(ad);}
  document.body.append(rail);
 }
 if(preview)return;
 const settings=document.createElement('button');settings.type='button';settings.textContent='Ustawienia reklam';settings.hidden=true;
 settings.addEventListener('click',()=>window.googlefc.callbackQueue.push({CONSENT_API_READY:()=>window.googlefc.showRevocationMessage()}));
 document.querySelector('footer')?.append(settings);
 window.googlefc=window.googlefc||{};window.googlefc.callbackQueue=window.googlefc.callbackQueue||[];
 window.googlefc.callbackQueue.push({CONSENT_API_READY:()=>{settings.hidden=false;}});
 // Request each unit once, only when desktop space exists. Never auto-refresh ads.
 const desktop=matchMedia('(min-width: 1720px)');let requested=false;
 const start=()=>{
  if(!desktop.matches||requested)return;requested=true;
  const script=document.createElement('script');script.async=true;script.crossOrigin='anonymous';script.src=`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.publisherId}`;
  script.addEventListener('load',()=>{for(const ad of document.querySelectorAll('.ad-rail ins')){try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch{ad.closest('.ad-rail').hidden=true;}}});
  script.addEventListener('error',()=>document.querySelectorAll('.ad-rail').forEach(rail=>rail.hidden=true));document.head.append(script);
 };
 desktop.addEventListener('change',start);start();
}
