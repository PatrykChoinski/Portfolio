import {createHash} from 'node:crypto';
import {skills, profile, experience} from '../src/data.mjs';
import {collectPortal,publicSources} from './portals.mjs';
export const defaults={minimumSalary:15000,radiusKm:100,latitude:52.2297,longitude:21.0122,autoApply:false,intervalMinutes:60,sources:publicSources};
export const candidate={...profile,experience,skills:skills.flatMap(s=>s.items)};
const terms=['plc','hmi','scada','motion','automaty','application engineer','serwonap','structured text','modbus','ethercat'];
export function distance(lat,lon,c=defaults){
 if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)return null;
 const r=x=>x*Math.PI/180,a=Math.sin(r(lat-c.latitude)/2)**2+Math.cos(r(c.latitude))*Math.cos(r(lat))*Math.sin(r(lon-c.longitude)/2)**2;
 return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
export function normalize(raw,source){
 const url=new URL(raw.url);if(url.protocol!=='https:')throw Error('Oferta wymaga adresu HTTPS');
 url.hash='';for(const key of [...url.searchParams.keys()])if(/^(utm_|fbclid|gclid)/.test(key))url.searchParams.delete(key);
 const title=String(raw.title||'').slice(0,300);if(!title)throw Error('Brak stanowiska');
 return {id:createHash('sha256').update(url.href).digest('hex').slice(0,24),url:url.href,title,company:String(raw.company||'Nie podano'),description:String(raw.description||'').slice(0,50000),location:String(raw.location||''),latitude:raw.latitude,longitude:raw.longitude,locationEvidence:raw.locationEvidence||null,salary:raw.salary||null,source,greenhouse:raw.greenhouse||null,validThrough:raw.validThrough||null,datePosted:raw.datePosted||null,seenAt:new Date().toISOString()};
}
export function assess(job,config=defaults){
 const text=(job.title+' '+job.description).toLowerCase(),matched=terms.filter(t=>text.includes(t));
 const km=distance(job.latitude,job.longitude,config),s=job.salary;
 const salaryKnown=s&&s.currency==='PLN'&&s.period==='month'&&s.basis==='gross'&&s.contract==='employment'&&Number.isFinite(s.min)&&Number.isFinite(s.max)&&s.min<=s.max;
 const reasons=[];
 if(!/(?:\bplc\b|\bhmi\b|\bscada\b|structured text|automatyk|automatyka|sterowani|motion control|modbus|ethercat|serwonap)/i.test(text))reasons.push('Brak potwierdzenia kompetencji z automatyki przemysłowej w treści oferty');
 if(job.verification&&(job.verification.stale||Date.now()-Date.parse(job.verification.at)>7*86400000))reasons.push('Potwierdź ponownie dane oferty — zmienione lub starsze niż 7 dni');
 if(job.validThrough&&(!Number.isFinite(Date.parse(job.validThrough))||Date.parse(job.validThrough)<Date.now()))reasons.push('Oferta wygasła lub data ważności wymaga weryfikacji');
 if(!matched.length)reasons.push('Brak dopasowania do automatyki');
 if(km===null)reasons.push('Lokalizacja do weryfikacji');else if(km>config.radiusKm)reasons.push('Poza promieniem');
 if(!salaryKnown)reasons.push('Wynagrodzenie brutto UoP do weryfikacji');else if(s.min<config.minimumSalary)reasons.push('Dolna granica poniżej wymagań');
 return {eligible:reasons.length===0,matched,distanceKm:km,reasons};
}
export async function collect(source,fetcher=fetch){
 if(source.type==='portal')return collectPortal(source.portal,normalize,fetcher,source);
 if(source.type!=='greenhouse')throw Error('Nieobsługiwany typ źródła');
 if(!/^[a-z0-9-]+$/i.test(source.board))throw Error('Nieprawidłowy identyfikator tablicy');
 const res=await fetcher(`https://boards-api.greenhouse.io/v1/boards/${source.board}/jobs?content=true`,{signal:AbortSignal.timeout(20000)});
 if(!res.ok)throw Error(`Źródło HTTP ${res.status}`);
 const data=await res.json();
 return data.jobs.map(j=>normalize({title:j.title,url:j.absolute_url,description:j.content,location:j.location?.name,company:source.board,greenhouse:{board:source.board,id:j.id}},`Greenhouse: ${source.board}`));
}
export function applicationText(job,config=defaults){return `Dzień dobry,\n\naplikuję na stanowisko ${job.title}. ${profile.summary}\n\nPortfolio: https://patrykchoinski.github.io/Portfolio/\nOczekiwania: od ${config.minimumSalary.toLocaleString('pl-PL')} PLN brutto miesięcznie, umowa o pracę.\n\n${profile.name}\n${profile.email}\n${profile.phone}`;}
