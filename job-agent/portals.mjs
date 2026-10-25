export const portals=[
 {id:'pracuj',name:'Pracuj.pl',home:'https://www.pracuj.pl/',search:'https://www.pracuj.pl/praca/automatyk;kw/warszawa;wp',account:'https://login.pracuj.pl/',jobPath:/^\/praca\/[^/]+,oferta,\d+/,mode:'public'},
 {id:'rocketjobs',name:'RocketJobs',home:'https://rocketjobs.pl/',search:'https://rocketjobs.pl/oferty-pracy/wszystkie-lokalizacje/inzynieria/automatyka',account:'https://rocketjobs.pl/',jobPath:/^\/oferta-pracy\/[^/]+/,mode:'public'},
 {id:'linkedin',name:'LinkedIn',home:'https://www.linkedin.com/',search:'https://www.linkedin.com/jobs/',account:'https://www.linkedin.com/',jobPath:/^\/jobs\/view\/\d+/,mode:'session'},
 {id:'nofluffjobs',name:'No Fluff Jobs',home:'https://nofluffjobs.com/pl',search:'https://nofluffjobs.com/pl/automation',account:'https://nofluffjobs.com/pl/profile',jobPath:/^\/pl\/job\/[^/]+/,mode:'public'},
 {id:'aplikuj',name:'Aplikuj.pl',home:'https://www.aplikuj.pl/',search:'https://www.aplikuj.pl/praca/warszawa',account:'https://www.aplikuj.pl/kandydat/rejestracja',jobPath:/^\/oferta\/\d+\//,mode:'public'},
 {id:'jooble',name:'Jooble',home:'https://pl.jooble.org/',search:'https://pl.jooble.org/',account:'https://pl.jooble.org/auth/login/email',jobPath:/^\/jdp\//,mode:'api-key'}
];
export const accountStates={unknown:'Nie sprawdzono',password:'Ustaw hasło i dokończ rejestrację',verification:'Potwierdź adres e-mail',ready:'Sesja zalogowana — potwierdzona ręcznie',login:'Zaloguj się',blocked:'Wymaga działania na portalu'};
export const publicSources=portals.filter(p=>p.mode==='public').map(p=>({type:'portal',portal:p.id}));
export function portalFor(url){try{const u=new URL(url);return portals.find(p=>new URL(p.home).hostname.replace(/^www\./,'')===u.hostname.replace(/^www\./,''));}catch{return null;}}
export function cleanText(html=''){return String(html).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();}
export function jobLinks(html,base,portal){
 const links=new Set();
 for(const match of html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi)){
  try{const url=new URL(match[1].replaceAll('&amp;','&'),base);if(url.protocol==='https:'&&portalFor(url.href)?.id===portal.id&&portal.jobPath.test(url.pathname)){url.search='';url.hash='';links.add(url.href);}}catch{}
 }
 return [...links];
}
export function jobPostings(html){
 const found=[];
 function walk(value){if(!value||typeof value!=='object')return;if(Array.isArray(value))return value.forEach(walk);if([value['@type']].flat().includes('JobPosting'))found.push(value);if(value['@graph'])walk(value['@graph']);if(value.itemListElement)for(const item of value.itemListElement)walk(item.item||item);}
 for(const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(!/application\/ld\+json/i.test(script[1]))continue;try{walk(JSON.parse(script[2]));}catch{}}
 return found;
}
export function fromPosting(posting,url){
 const locations=[posting.jobLocation].flat().filter(Boolean),location=locations[0];
 const value=posting.baseSalary?.value,coordinate=x=>x===undefined||x===null||x===''?undefined:Number(x);
 // FULL_TIME does not prove an employment contract or gross pay; retain unknowns.
 const salary=value?{min:value.minValue??null,max:value.maxValue??value.value??null,currency:posting.baseSalary.currency,period:/^month$/i.test(value.unitText)?'month':String(value.unitText||''),basis:'unknown',contract:'unknown'}:null;
 return {url,title:posting.title,company:posting.hiringOrganization?.name,description:cleanText([posting.description,posting.qualifications,posting.responsibilities,...(Array.isArray(posting.skills)?posting.skills.map(s=>s.value||s):[posting.skills])].filter(Boolean).join(' ')),location:locations.map(l=>l.address?.addressLocality||l.name).filter(Boolean).join(' / '),latitude:locations.length===1?coordinate(location?.geo?.latitude):undefined,longitude:locations.length===1?coordinate(location?.geo?.longitude):undefined,salary,validThrough:posting.validThrough||null,datePosted:posting.datePosted||null};
}
async function htmlAt(url,fetcher){const response=await fetcher(url,{redirect:'error',signal:AbortSignal.timeout(20000),headers:{Accept:'text/html','User-Agent':'PortfolioJobAgent/1.0 (personal job search)'}});if(!response.ok)throw Error(`Odczyt HTTP ${response.status}. Otwórz portal w przeglądarce.`);const html=await response.text();if(/<title>\s*(Just a moment|Access denied)/i.test(html))throw Error('Portal wymaga weryfikacji w przeglądarce');return html;}
export async function collectPortal(id,normalize,fetcher=fetch){
 const portal=portals.find(p=>p.id===id);if(!portal||portal.mode!=='public')throw Error('Ten portal wymaga aktywnej sesji lub integracji API');
 const html=await htmlAt(portal.search,fetcher),links=jobLinks(html,portal.search,portal),jobs=[],failures=[];
 for(const posting of jobPostings(html)){if(posting.url&&portalFor(posting.url)?.id===id)jobs.push(normalize(fromPosting(posting,posting.url),portal.name));}
 // Bounded, sequential requests avoid overloading a portal; report the coverage explicitly.
 for(const url of links.slice(0,30)){
  if(jobs.some(j=>j.url===url))continue;
  try{const detail=await htmlAt(url,fetcher),postings=jobPostings(detail);if(!postings.length){failures.push({url,error:'Brak danych JobPosting'});continue;}jobs.push(normalize(fromPosting(postings[0],url),portal.name));}catch(e){failures.push({url,error:e.message});}
 }
 if(!links.length&&!jobs.length)throw Error('Nie znaleziono rozpoznawalnych ofert — układ portalu wymaga aktualizacji adaptera');
 return {jobs,coverage:`Pierwsza strona wyników; odczytano do 30 szczegółów z ${links.length} znalezionych odnośników.`,failures};
}
