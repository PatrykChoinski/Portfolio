import {site} from './data.mjs';

export function measurementEnabled(config,location){
 try{return /^G-[A-Z0-9]+$/.test(config.measurementId)&&[config.url,...(config.additionalUrls||[])].some(url=>{const target=new URL(url);return target.origin===location.origin&&location.pathname.startsWith(target.pathname);});}catch{return false;}
}
export function safeCampaign(search){
 const params=new URLSearchParams(search),result={};
 for(const [key,target]of [['utm_source','campaign_source'],['utm_medium','campaign_medium'],['utm_campaign','campaign_name']]){const value=params.get(key);if(value&&/^[\p{L}\p{N}_ .-]{1,100}$/u.test(value))result[target]=value;}
 return result;
}
export function initAnalytics(config=site){
 const enabled=measurementEnabled(config,location),key='portfolio-analytics-consent-v1';
 let consent='unknown',started=false;
 const seen=new Set();
 try{consent=localStorage.getItem(key)||'unknown';}catch{}
 const emit=(name,params={})=>{if(enabled&&started&&consent==='granted')window.gtag('event',name,params);};
 function clearCookies(){for(const cookie of document.cookie.split(';')){const name=cookie.split('=')[0].trim();if(!/^_ga(?:_|$)/.test(name))continue;for(const path of ['/',new URL(config.url).pathname])for(const domain of ['',`; Domain=${location.hostname}`,`; Domain=.${location.hostname}`])document.cookie=`${name}=; Max-Age=0; Path=${path}${domain}; SameSite=Lax`;}}
 if(enabled){window[`ga-disable-${config.measurementId}`]=consent!=='granted';window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});}
 function start(){
  if(!enabled||consent!=='granted'||started)return;
  started=true;window[`ga-disable-${config.measurementId}`]=false;
  window.gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('js',new Date());
  let referrer='';try{referrer=new URL(document.referrer).origin+'/';}catch{}
  window.gtag('config',config.measurementId,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:config.url,page_referrer:referrer,...safeCampaign(location.search)});
  const script=document.createElement('script');script.id='google-analytics-tag';script.async=true;script.src=`https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`;document.head.append(script);
  emit('page_view',{page_title:document.title,page_location:config.url});
  document.querySelectorAll('main>section[id]').forEach(section=>{const r=section.getBoundingClientRect();if(r.top<innerHeight*.7&&r.bottom>innerHeight*.3){seen.add(section.id);emit('section_view',{section_id:section.id});}});
  import('../public/vendor/web-vitals.js').then(({onCLS,onLCP,onINP,onFCP,onTTFB})=>{const report=m=>emit('web_vital',{metric_name:m.name,metric_value:m.value,metric_rating:m.rating,metric_id:m.id,non_interaction:true});[onCLS,onLCP,onINP,onFCP,onTTFB].forEach(on=>on(report));}).catch(()=>{});
 }
 const panel=document.createElement('section');panel.className='consent-panel';panel.hidden=true;panel.setAttribute('aria-label','Ustawienia statystyk');
 panel.innerHTML='<h2>Statystyki odwiedzin</h2><p>Za Twoją zgodą korzystam z Google Analytics, aby sprawdzać popularność portfolio i poprawiać jego działanie. Możesz odmówić lub zmienić decyzję w stopce.</p><a href="./prywatnosc.html">Informacje o prywatności</a><div><button type="button" data-consent="granted">Zgadzam się na statystyki</button><button type="button" data-consent="denied">Bez statystyk</button></div>';
 document.body.append(panel);
 const preferences=document.querySelector('[data-analytics-settings]');
 preferences?.addEventListener('click',()=>{if(!enabled){preferences.nextElementSibling.textContent='Statystyki odwiedzin nie są jeszcze włączone.';return;}panel.hidden=false;panel.querySelector('button').focus();});
 panel.addEventListener('click',e=>{const button=e.target.closest('[data-consent]');if(!button)return;consent=button.dataset.consent;try{localStorage.setItem(key,consent);}catch{}panel.hidden=true;if(consent==='granted')start();else if(enabled){window[`ga-disable-${config.measurementId}`]=true;window.gtag('consent','update',{analytics_storage:'denied'});clearCookies();if(started)location.reload();}});
 if(enabled){if(consent==='granted')start();else if(consent==='unknown')panel.hidden=false;else clearCookies();}
 document.addEventListener('click',e=>{
  const anchor=e.target.closest('a');
  if(anchor){const href=anchor.getAttribute('href')||'';if(href.startsWith('mailto:')||href.startsWith('tel:'))emit('contact_click',{contact_method:href.startsWith('mailto:')?'email':'phone'});else if(/\.pdf(?:$|[?#])/.test(href))emit('cv_download',{file_type:'pdf'});else if(href.includes('/cv/index.html'))emit('cv_preview');else if(/^https?:/.test(href)){const url=new URL(href);if(url.origin!==location.origin)emit('outbound_click',{link_domain:url.hostname,link_kind:anchor.closest('#pipeline-demo')?'actions':'external'});}}
  const project=e.target.closest('[data-project]');if(project)emit('project_open',{project_id:project.dataset.project});
  const category=e.target.closest('[data-category]');if(category)emit('project_filter',{category:category.dataset.category});
  if(e.target.closest('#load-simulator'))emit('demo_start',{demo_name:'simulator'});
  if(e.target.closest('#pipeline-play'))emit('demo_start',{demo_name:'pipeline'});
  if(e.target.closest('#scada-demo button'))emit('scada_interaction',{control:'button'});
 });
 let searched=false;document.querySelector('#search')?.addEventListener('input',()=>{if(!searched&&document.querySelector('#search').value.trim()){emit('project_search');if(consent==='granted')searched=true;}});
 let played=false;document.querySelector('.demo-video')?.addEventListener('play',()=>{if(!played){emit('video_start',{video_name:'machine_simulation'});if(consent==='granted')played=true;}});
 document.querySelector('#scada-demo')?.addEventListener('change',()=>emit('scada_interaction',{control:'signal_or_cycle'}));
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting&&!seen.has(entry.target.id)&&consent==='granted'){seen.add(entry.target.id);emit('section_view',{section_id:entry.target.id});}},{threshold:0,rootMargin:'-30% 0px -30% 0px'});
 document.querySelectorAll('main>section[id]').forEach(section=>observer.observe(section));
 const depths=new Set();document.addEventListener('scroll',()=>{if(consent!=='granted')return;const percent=Math.min(100,Math.round((scrollY+innerHeight)/document.documentElement.scrollHeight*100));for(const depth of [25,50,75,90])if(percent>=depth&&!depths.has(depth)){depths.add(depth);emit('scroll_depth',{percent_scrolled:depth});}},{passive:true});
}
