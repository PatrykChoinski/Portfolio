import {createServer} from 'node:http';
import {readFile,mkdir,writeFile,rename} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {homedir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import {defaults,candidate,normalize,assess,collect,applicationText} from './core.mjs';
const directory=resolve(process.env.JOB_AGENT_HOME||join(homedir(),'.portfolio-job-agent'));
const here=fileURLToPath(new URL('.',import.meta.url));
const token=randomBytes(32).toString('hex');
let state={config:{...defaults},jobs:[],events:[],sources:[]},busy=false;
await mkdir(directory,{recursive:true});
try{state=JSON.parse(await readFile(join(directory,'state.json'),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
async function save(){await writeFile(join(directory,'state.tmp'),JSON.stringify(state,null,2));await rename(join(directory,'state.tmp'),join(directory,'state.json'));}
function event(job,type,detail){state.events.unshift({id:randomBytes(8).toString('hex'),jobId:job?.id,title:job?.title,type,detail,at:new Date().toISOString()});}
function merge(jobs){for(const job of jobs){const old=state.jobs.find(j=>j.id===job.id);if(old){Object.assign(old,job,{status:old.status,seenAt:old.seenAt});}else state.jobs.push({...job,status:'new'});}}
async function scan(){
 state.sources=[];
 for(const source of state.config.sources){try{const jobs=await collect(source);merge(jobs);state.sources.push({name:source.board,count:jobs.length,at:new Date().toISOString(),ok:true});}catch(e){state.sources.push({name:source.board,ok:false,error:e.message,at:new Date().toISOString()});}}
 event(null,'scan',`Sprawdzono źródeł: ${state.sources.length}`);await save();
 if(state.config.autoApply)for(const job of state.jobs)if(job.status==='new'&&assess(job,state.config).eligible)await apply(job);
}
async function apply(job){
 if(!assess(job,state.config).eligible)throw Error('Oferta nie spełnia wymagań lub wymaga weryfikacji');
 if(['sent','manual-sent','interview','rejected','withdrawn','sending','uncertain'].includes(job.status))throw Error('Aplikacja już obsłużona lub wymaga sprawdzenia potwierdzenia');
 const gh=job.greenhouse,key=gh&&process.env[`GREENHOUSE_KEY_${gh.board.toUpperCase().replaceAll('-','_')}`];
 if(!gh||!key){job.status='prepared';event(job,'prepared','Przygotowano treść. Wysyłka wymaga formularza portalu lub klucza API pracodawcy.');await save();return;}
 if(!/^[a-z0-9-]+$/i.test(gh.board)||!/^\d+$/.test(String(gh.id)))throw Error('Nieprawidłowy identyfikator Greenhouse');
 const endpoint=`https://boards-api.greenhouse.io/v1/boards/${gh.board}/jobs/${gh.id}`;
 const response=await fetch(endpoint,{signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error(`Formularz HTTP ${response.status}`);
 const form=await response.json();
 const payload={first_name:'Patryk',last_name:'Choiński',email:candidate.email,phone:candidate.phone,resume_text:[candidate.summary,...candidate.experience.map(e=>`${e.period}: ${e.role}, ${e.company}. ${e.description}`),candidate.skills.join(', ')].join('\n'),cover_letter_text:applicationText(job)};
 const unanswered=[...(form.questions||[]),...(form.location_questions||[]),...(form.compliance||[])].filter(q=>q.required&&!(q.fields||[]).every(f=>Object.hasOwn(payload,f.name)));
 if(unanswered.length||form.data_compliance?.length||form.demographic_questions){job.status='review';event(job,'review','Formularz zawiera dodatkowe pytania lub zgody. Wymaga ręcznego uzupełnienia.');await save();return;}
 job.status='sending';event(job,'sending','Rozpoczęto wysyłkę');await save();
 try{const sent=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Basic ${Buffer.from(key+':').toString('base64')}`},body:JSON.stringify(payload),signal:AbortSignal.timeout(30000)});if(!sent.ok)throw Error(`Wysyłka HTTP ${sent.status}`);const receipt=await sent.json();if(receipt.success!==true)throw Error('Brak jednoznacznego potwierdzenia');job.status='sent';event(job,'sent','Greenhouse potwierdził przyjęcie aplikacji');}catch(e){job.status='uncertain';event(job,'uncertain',e.message+' — sprawdź portal przed ponowieniem');}await save();
}
for(const job of state.jobs)if(job.status==='sending')job.status='uncertain';
function output(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));}
const server=createServer(async(req,res)=>{
 try{
 const path=new URL(req.url,'http://localhost').pathname;
 if(!/^127\.0\.0\.1:\d+$/.test(req.headers.host||''))return output(res,403,{error:'Niedozwolony host'});
 if(req.method==='GET'&&path==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'none'; base-uri 'none'"});return res.end((await readFile(join(here,'index.html'),'utf8')).replace('__TOKEN__',token));}
 if(req.method==='GET'&&path==='/app.mjs'){res.writeHead(200,{'Content-Type':'text/javascript'});return res.end(await readFile(join(here,'app.mjs')));}
 if(req.method==='GET'&&path==='/api/state')return output(res,200,{...state,config:{...state.config},candidate:{name:candidate.name,summary:candidate.summary,skills:candidate.skills},jobs:state.jobs.map(j=>({...j,assessment:assess(j,state.config),draft:applicationText(j)}))});
 if(req.method!=='POST'||req.headers['x-agent-token']!==token)return output(res,403,{error:'Brak dostępu'});
 if(busy)return output(res,409,{error:'Operacja w toku'});
 let bytes=0,parts=[];for await(const part of req){bytes+=part.length;if(bytes>2000000)return output(res,413,{error:'Plik za duży'});parts.push(part);}const body=JSON.parse(Buffer.concat(parts).toString()||'{}');
 busy=true;
 try{
 if(path==='/api/import'){if(!Array.isArray(body.jobs)||body.jobs.length>1000)throw Error('Wymagana lista do 1000 ofert');const jobs=body.jobs.map(j=>normalize(j,'Import'));merge(jobs);event(null,'import',`Zaimportowano ${jobs.length} ofert`);await save();}
 else if(path==='/api/config'){const c=body;if(!Number.isFinite(c.minimumSalary)||c.minimumSalary<15000||!Number.isFinite(c.radiusKm)||c.radiusKm<=0||c.radiusKm>100||!Array.isArray(c.sources)||c.sources.length>50||c.sources.some(s=>s.type!=='greenhouse'||!/^[a-z0-9-]+$/i.test(s.board)))throw Error('Nieprawidłowe ustawienia');state.config={...defaults,minimumSalary:c.minimumSalary,radiusKm:c.radiusKm,autoApply:c.autoApply===true,sources:c.sources};await save();}
 else if(path==='/api/scan')await scan();
 else if(path==='/api/apply'){const job=state.jobs.find(j=>j.id===body.id);if(!job)throw Error('Nie znaleziono oferty');await apply(job);}
 else if(path==='/api/status'){const job=state.jobs.find(j=>j.id===body.id);if(!job||!['interview','rejected','withdrawn','manual-sent'].includes(body.status))throw Error('Nieprawidłowy status');job.status=body.status;event(job,body.status,'Status wpisany przez użytkownika');await save();}
 else return output(res,404,{error:'Nie znaleziono'});
 output(res,200,{ok:true});
 }finally{busy=false;}
 }catch(e){output(res,400,{error:e.message});}
});
setInterval(async()=>{if(busy||!state.config.sources.length)return;busy=true;try{await scan();}catch(e){event(null,'error',e.message);}finally{busy=false;}},defaults.intervalMinutes*60000).unref();
server.listen(Number(process.env.JOB_AGENT_PORT||4318),'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${server.address().port}`));
