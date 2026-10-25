export const portals=[
 {id:'pracuj',name:'Pracuj.pl',home:'https://www.pracuj.pl/',search:'https://www.pracuj.pl/praca/automatyk;kw/warszawa;wp',account:'https://login.pracuj.pl/',jobPath:/^\/praca\/[^/]+,oferta,\d+/,mode:'public'},
 {id:'rocketjobs',name:'RocketJobs',home:'https://rocketjobs.pl/',search:'https://rocketjobs.pl/oferty-pracy/wszystkie-lokalizacje/inzynieria/automatyka',account:'https://rocketjobs.pl/',jobPath:/^\/oferta-pracy\/[^/]+/,mode:'public'},
 {id:'linkedin',name:'LinkedIn',home:'https://www.linkedin.com/',search:'https://www.linkedin.com/jobs/',account:'https://www.linkedin.com/',jobPath:/^\/jobs\/view\/\d+/,mode:'session'},
 {id:'nofluffjobs',name:'No Fluff Jobs',home:'https://nofluffjobs.com/pl',search:'https://nofluffjobs.com/pl/automation',account:'https://nofluffjobs.com/pl/profile',jobPath:/^\/pl\/job\/[^/]+/,mode:'public'},
 {id:'aplikuj',name:'Aplikuj.pl',home:'https://www.aplikuj.pl/',search:'https://www.aplikuj.pl/praca/warszawa/automatyk',account:'https://www.aplikuj.pl/kandydat/rejestracja',jobPath:/^\/oferta\/\d+\//,mode:'public'},
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
export function nextPage(html,current,portal){
 const root=new URL(portal.search).pathname;
 for(const match of html.matchAll(/<a\b([^>]*)href\s*=\s*["']([^"']+)["']([^>]*)>([\s\S]*?)<\/a>/gi)){
  const attrs=match[1]+' '+match[3],label=cleanText(match[4]);
  if(!/\brel\s*=\s*["'][^"']*\bnext\b/i.test(attrs)&&!/^nast[ęe]pna(?:\s+strona)?$/i.test(label))continue;
  try{const url=new URL(match[2].replaceAll('&amp;','&'),current);if(url.protocol==='https:'&&!url.username&&!url.password&&portalFor(url.href)?.id===portal.id&&!portal.jobPath.test(url.pathname)&&(url.pathname===root||url.pathname.startsWith(root+'/strona-'))){url.hash='';return url.href;}}catch{}
 }
 return null;
}
export function grossEmploymentSalary(html){
 const text=cleanText(html).split(/podobne oferty|similar jobs|polecane oferty/i)[0],matches=new Map();
 // Only an explicit range followed by gross/month/UoP labels proves these conditions.
 const pattern=/([0-9][0-9\s\u00a0\u202f]*(?:[.,][0-9]{1,2})?)\s*[-–]\s*([0-9][0-9\s\u00a0\u202f]*(?:[.,][0-9]{1,2})?)\s*(?:PLN|zł)\s+Brutto\s+miesięcznie\s*[-–]\s*UoP\b/gi;
 for(const match of text.matchAll(pattern)){
  const number=s=>Number(s.replace(/[\s\u00a0\u202f]/g,'').replace(',','.')),min=number(match[1]),max=number(match[2]);
  if(min>0&&max>=min)matches.set(`${min}:${max}`,{min,max,currency:'PLN',period:'month',basis:'gross',contract:'employment',evidence:match[0]});
 }
 return matches.size===1?[...matches.values()][0]:null;
}
export function pageCoordinates(html,url,city){
 if(portalFor(url)?.id!=='rocketjobs'||!city)return null;
 const slug=decodeURIComponent(new URL(url).pathname.split('/').at(-1)),chunks=[];
 // Decode public Next.js JSON data without executing page JavaScript or resolving references.
 for(const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)){
  const match=script[1].match(/^\s*self\.__next_f\.push\((\[[\s\S]*\])\)\s*;?\s*$/);if(!match)continue;
  try{const row=JSON.parse(match[1]);if(row[0]===1&&typeof row[1]==='string')chunks.push(row[1]);}catch{}
 }
 const candidates=new Map();let nodes=0;
 function walk(value){
  if(!value||typeof value!=='object'||++nodes>100000)return;
  if(value.slug===slug&&value.city===city&&Number.isFinite(value.latitude)&&Number.isFinite(value.longitude)&&Math.abs(value.latitude)<=90&&Math.abs(value.longitude)<=180)candidates.set(`${value.latitude}:${value.longitude}`,{latitude:value.latitude,longitude:value.longitude,evidence:`Współrzędne podane przez RocketJobs dla oferty ${slug}, ${city}`,sourceUrl:url});
  for(const child of Object.values(value))if(child&&typeof child==='object')walk(child);
 }
 const bytes=Buffer.from(chunks.join(''),'utf8');let offset=0;
 while(offset<bytes.length){
  const colon=bytes.indexOf(58,offset);if(colon<offset||colon-offset>32)break;
  const id=bytes.subarray(offset,colon).toString('ascii');if(!/^[a-f0-9]*$/.test(id))break;
  offset=colon+1;
  if(bytes[offset]===84){
   const comma=bytes.indexOf(44,offset),hex=comma<0?'':bytes.subarray(offset+1,comma).toString('ascii');
   if(!/^[a-f0-9]+$/.test(hex))break;
   const size=Number.parseInt(hex,16);if(!Number.isSafeInteger(size)||comma+1+size>bytes.length)break;
   offset=comma+1+size;if(bytes[offset]===10)offset++;continue;
  }
  const newline=bytes.indexOf(10,offset),end=newline<0?bytes.length:newline,line=bytes.subarray(offset,end).toString('utf8');offset=end+1;
  if(line.startsWith('{')||line.startsWith('['))try{walk(JSON.parse(line));}catch{}
 }
 return candidates.size===1?[...candidates.values()][0]:null;
}
export function fromPosting(posting,url){
 const locations=[posting.jobLocation].flat().filter(Boolean),location=locations[0];
 const value=posting.baseSalary?.value,coordinate=x=>x===undefined||x===null||x===''?undefined:Number(x);
 // FULL_TIME does not prove an employment contract or gross pay; retain unknowns.
 const salary=value?{min:value.minValue??null,max:value.maxValue??value.value??null,currency:posting.baseSalary.currency,period:/^month$/i.test(value.unitText)?'month':String(value.unitText||''),basis:'unknown',contract:'unknown'}:null;
 return {url,title:posting.title,company:posting.hiringOrganization?.name,description:cleanText([posting.description,posting.qualifications,posting.responsibilities,...(Array.isArray(posting.skills)?posting.skills.map(s=>s.value||s):[posting.skills])].filter(Boolean).join(' ')),location:locations.map(l=>l.address?.addressLocality||l.name).filter(Boolean).join(' / '),latitude:locations.length===1?coordinate(location?.geo?.latitude):undefined,longitude:locations.length===1?coordinate(location?.geo?.longitude):undefined,salary,validThrough:posting.validThrough||null,datePosted:posting.datePosted||null};
}
async function htmlAt(url,fetcher){const response=await fetcher(url,{redirect:'error',signal:AbortSignal.timeout(20000),headers:{Accept:'text/html','User-Agent':'PortfolioJobAgent/1.0 (personal job search)'}});if(!response.ok)throw Error(`Odczyt HTTP ${response.status}. Otwórz portal w przeglądarce.`);const html=await response.text();if(/<title>\s*(Just a moment|Access denied)/i.test(html))throw Error('Portal wymaga weryfikacji w przeglądarce');return html;}
export async function collectPortal(id,normalize,fetcher=fetch,limits={}){
 const portal=portals.find(p=>p.id===id);if(!portal||portal.mode!=='public')throw Error('Ten portal wymaga aktywnej sesji lub integracji API');
 const maxPages=limits.maxPages??10,maxDetails=limits.maxDetails??500;
 if(!Number.isInteger(maxPages)||maxPages<1||maxPages>100||!Number.isInteger(maxDetails)||maxDetails<1||maxDetails>5000)throw Error('Nieprawidłowe limity odczytu');
 const links=new Set(),visited=new Set(),jobs=[],failures=[];let page=portal.search,listingsComplete=true;
 while(page&&!visited.has(page)&&visited.size<maxPages){
  let html;try{html=await htmlAt(page,fetcher);}catch(e){if(!visited.size)throw e;failures.push({url:page,error:e.message});listingsComplete=false;break;}
  visited.add(page);for(const url of jobLinks(html,page,portal))links.add(url);
  for(const posting of jobPostings(html)){if(posting.url&&portalFor(posting.url)?.id===id&&!jobs.some(j=>j.url===posting.url))jobs.push(normalize(fromPosting(posting,posting.url),portal.name));}
  page=nextPage(html,page,portal);
  if(!page&&/pokaż kolejne oferty|załaduj więcej|load more/i.test(cleanText(html)))listingsComplete=false;
 }
 if(page)listingsComplete=false;
 const selected=[...links].slice(0,maxDetails);let detailsRead=0;
 // Sequential requests, explicit limits, no guessed pagination URLs.
 for(const url of selected){
  if(jobs.some(j=>j.url===url))continue;
  try{const detail=await htmlAt(url,fetcher),postings=jobPostings(detail);if(!postings.length){failures.push({url,error:'Brak danych JobPosting'});continue;}const raw=fromPosting(postings[0],url),salary=grossEmploymentSalary(detail),coordinates=pageCoordinates(detail,url,raw.location);if(salary)raw.salary=salary;if(coordinates){raw.latitude=coordinates.latitude;raw.longitude=coordinates.longitude;raw.locationEvidence=coordinates;}jobs.push(normalize(raw,portal.name));detailsRead++;}catch(e){failures.push({url,error:e.message});}
 }
 if(!links.size&&!jobs.length)throw Error('Nie znaleziono rozpoznawalnych ofert — układ portalu wymaga aktualizacji adaptera');
 const truncated=!listingsComplete||links.size>maxDetails;
 return {jobs,coverage:`Odczytano stron: ${visited.size}; szczegółów: ${detailsRead}; znalezionych odnośników: ${links.size}. ${truncated?'Odczyt niepełny — pozostały dalsze strony lub oferty ładowane w przeglądarce.':'Odczytano wszystkie rozpoznane odnośniki na odwiedzonych stronach.'}${failures.length?' Część stron lub szczegółów zakończyła się błędem.':''}`,pagesVisited:visited.size,detailsRead,linksFound:links.size,truncated,failures};
}
