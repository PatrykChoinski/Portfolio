import {readFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {browserChannel} from '../scripts/browser.mjs';
import {assess,normalize} from './core.mjs';
import {jobPostings,fromPosting,grossEmploymentSalary,pageCoordinates} from './portals.mjs';

const compact=value=>String(value||'').replace(/\s+/g,' ').trim().toLocaleLowerCase('pl');
export function rocketUrl(value){
 const url=new URL(value);
 if(url.protocol!=='https:'||url.hostname!=='rocketjobs.pl'||url.port||url.username||url.password||!/^\/oferta-pracy\/[^/]+$/.test(url.pathname))throw Error('Nieprawidłowy adres oferty RocketJobs');
 return url.href;
}
export function verifyRocketPage(html,job,config){
 rocketUrl(job.url);
 const posting=jobPostings(html).find(p=>compact(p.title)===compact(job.title));
 if(!posting)throw Error('Treść strony nie potwierdza stanowiska');
 const fresh=fromPosting(posting,job.url),salary=grossEmploymentSalary(html),coordinates=pageCoordinates(html,job.url,fresh.location);
 if(!salary||!coordinates)throw Error('Aktualna strona nie potwierdza widełek brutto UoP i lokalizacji');
 Object.assign(fresh,{salary,latitude:coordinates.latitude,longitude:coordinates.longitude,locationEvidence:coordinates});
 const normalized=normalize(fresh,'RocketJobs'),assessment=assess(normalized,config);
 if(compact(normalized.company)!==compact(job.company))throw Error('Zmienił się pracodawca w ogłoszeniu');
 if(!assessment.eligible)throw Error('Aktualne warunki wymagają weryfikacji: '+assessment.reasons.join('; '));
 return {...normalized,assessment};
}

/** Form-only operation, also exercised against local HTML fixtures in browser tests. */
export async function fillRocketForm(page,{job,candidate,cvFile,message,beforeSubmit,confirmationTimeout=20000}){
 let attempted=false;
 try{
  await page.getByRole('heading',{level:1,name:job.title.trim(),exact:true}).waitFor({state:'visible',timeout:15000});
  const reject=page.getByRole('button',{name:/^odrzuć wszystkie$/i});
  if(await reject.count()===1&&await reject.isVisible())await reject.click();
  await page.getByRole('button',{name:'Aplikuj',exact:true}).first().click();
  const dialog=page.getByRole('dialog').filter({hasText:job.title.trim()});
  await dialog.waitFor({state:'visible',timeout:10000});
  if(/(?:klikając|wysyłając|aplikując)[^.!?\n]{0,200}(?:akceptuj|zgadz)[^.!?\n]{0,100}(?:regulamin|warunkami korzystania)/i.test(await dialog.innerText()))return {status:'review',detail:'Wysłanie oznacza akceptację regulaminu. Wymaga decyzji użytkownika w portalu.'};
  const required=await dialog.locator('input,textarea,select').evaluateAll(elements=>elements.filter(el=>el.required||el.getAttribute('aria-required')==='true').map(el=>({type:el.type,tag:el.tagName,label:el.getAttribute('aria-label')||[...(el.labels||[])].map(l=>l.textContent).join(' ')||el.placeholder||'',id:el.id})));
  const unknown=required.filter(f=>f.type!=='hidden'&&f.type!=='file'&&f.type!=='email'&&!(/^(?:Imię i nazwisko|Adres e-mail)\s*\*?$/i.test(f.label)||f.id==='name'));
  if(unknown.length)return {status:'review',detail:'Formularz wymaga dodatkowej odpowiedzi lub zgody. Uzupełnij go ręcznie.'};
  for(const checkbox of await dialog.getByRole('checkbox').all())if(await checkbox.isChecked())await checkbox.uncheck();
  await dialog.getByRole('textbox',{name:'Imię i nazwisko*',exact:true}).fill(candidate.name);
  await dialog.getByRole('textbox',{name:'Adres e-mail*',exact:true}).fill(candidate.email);
  const messageField=dialog.getByRole('textbox',{name:'Napisz kilka słów o sobie lub dodaj linki do swoich prac lub portfolio.',exact:true});
  if(!await messageField.isVisible()){
   const toggles=dialog.getByRole('checkbox',{name:'',exact:true});
   if(await toggles.count()!==1||!await dialog.getByText('Napisz wiadomość do pracodawcy',{exact:true}).isVisible())return {status:'review',detail:'Nie rozpoznano pola wiadomości do pracodawcy'};
   await toggles.check();
  }
  await messageField.fill(message);
  const uploads=dialog.locator('input[type="file"]');
  if(await uploads.count()!==1)return {status:'review',detail:'Nie rozpoznano pola załączania CV'};
  await uploads.setInputFiles(cvFile);
  const challenge=page.locator('iframe[title*="recaptcha challenge"],iframe[title*="reCAPTCHA challenge"]');
  for(const frame of await challenge.all())if(await frame.isVisible())return {status:'review',detail:'Portal wymaga weryfikacji CAPTCHA przez użytkownika'};
  // Persist the intent before dispatch; interruption afterwards must never silently retry.
  await beforeSubmit();
  attempted=true;
  await dialog.getByRole('button',{name:'Aplikuj',exact:true}).click();
  const success=page.getByRole('heading',{name:/Twoja aplikacja została wysłana do firmy/});
  await success.waitFor({state:'visible',timeout:confirmationTimeout});
  const receipt=await success.innerText();
  if(!compact(receipt).includes(compact(job.company)))return {status:'uncertain',detail:'Potwierdzenie nie wskazuje oczekiwanego pracodawcy. Sprawdź portal przed ponowieniem.'};
  return {status:'browser-sent',receipt,detail:'RocketJobs potwierdził wysłanie CV przez formularz.'};
 }catch(error){return {status:attempted?'uncertain':'review',detail:(attempted?'Wysyłka wymaga sprawdzenia potwierdzenia. ':'Formularz wymaga ręcznej obsługi. ')+error.message.split('\n')[0]};}
}

export async function submitRocket({job,config,candidate,cvPath,message,evidenceDirectory,beforeSubmit}){
 rocketUrl(job.url);
 const cv=await readFile(cvPath);if(cv.length>5*1024*1024||!cv.subarray(0,5).equals(Buffer.from('%PDF-')))throw Error('CV musi być plikiem PDF do 5 MB');
 const cvSha256=createHash('sha256').update(cv).digest('hex');
 const {chromium}=await import('@playwright/test');let browser;
 try{
  browser=await chromium.launch({channel:browserChannel,headless:true});
  const page=await browser.newPage({locale:'pl-PL',timezoneId:'Europe/Warsaw'});page.setDefaultTimeout(15000);
  await page.goto(job.url,{waitUntil:'domcontentloaded',timeout:30000});
  if(new URL(page.url()).origin!=='https://rocketjobs.pl')throw Error('Portal przekierował poza rozpoznany formularz');
  const live=verifyRocketPage(await page.content(),job,config);
  const result=await fillRocketForm(page,{job:live,candidate,cvFile:{name:'Patryk-Choinski-CV.pdf',mimeType:'application/pdf',buffer:cv},message,beforeSubmit:()=>beforeSubmit({cvSha256,live})});
  if(evidenceDirectory&&/^[a-f0-9]{24}$/.test(job.id)){
   try{await mkdir(evidenceDirectory,{recursive:true});result.screenshot=join(evidenceDirectory,job.id+'-'+Date.now()+'.png');await page.screenshot({path:result.screenshot,fullPage:false});}catch{result.evidenceWarning='Nie zapisano zrzutu ekranu; zachowano wynik i tekst potwierdzenia';delete result.screenshot;}
  }
  return {...result,cvSha256,checkedAt:new Date().toISOString()};
 }catch(error){return {status:'review',detail:error.message.split('\n')[0],cvSha256};}
 finally{if(browser)await browser.close().catch(()=>{});}
}
