import {test,expect} from '@playwright/test';
import {fillRocketForm} from '../../job-agent/rocket-apply.mjs';

const job={title:'Programista PLC — formularz testowy',company:'Firma testowa'};
function fixture({requiredConsent=false,extraQuestion=false,implicitTerms=false,confirm=true}={}){
 return `<!doctype html><html lang="pl"><body><h1>${job.title}</h1><button id="open">Aplikuj</button><dialog id="application"><h2>${job.title}</h2><form id="form"><label>Imię i nazwisko*<input id="name" required></label><label>Adres e-mail*<input type="email" required></label><input type="file" accept="application/pdf" required><input id="message-toggle" type="checkbox"><span>Napisz wiadomość do pracodawcy</span><textarea aria-label="Napisz kilka słów o sobie lub dodaj linki do swoich prac lub portfolio." hidden></textarea><label><input id="account" type="checkbox" ${requiredConsent?'required':''}>Zakładam konto, akceptuję Regulamin</label><label><input id="marketing" type="checkbox" checked>Informacje marketingowe</label>${extraQuestion?'<label>Oczekiwany termin rozpoczęcia<input required></label>':''}${implicitTerms?'<p>Klikając Aplikuj, akceptuję regulamin portalu.</p>':''}<button>Aplikuj</button></form></dialog><div id="confirmation"></div><script>
 document.getElementById('open').onclick=()=>document.getElementById('application').showModal();
 document.getElementById('message-toggle').onchange=e=>document.querySelector('textarea').hidden=!e.target.checked;
 document.getElementById('form').onsubmit=e=>{e.preventDefault();document.body.dataset.submitted='true';document.body.dataset.submitCount=String(Number(document.body.dataset.submitCount||0)+1);document.body.dataset.account=document.getElementById('account').checked;document.body.dataset.marketing=document.getElementById('marketing').checked;document.body.dataset.message=document.querySelector('textarea').value;${confirm?"document.getElementById('application').close();document.getElementById('confirmation').innerHTML='<h2>Gotowe! Twoja aplikacja została wysłana do firmy Firma testowa.</h2>';":''}};
 </script></body></html>`;
}
const cvFile={name:'CV-test.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.7\nLOCAL TEST ONLY')};
test('Rocket form uploads CV, keeps optional account/marketing off and records intent before submit',async({page})=>{
 await page.setContent(fixture());let before=0;
 const result=await fillRocketForm(page,{job,candidate:{name:'Kandydat testowy',email:'candidate@example.test'},cvFile,message:'TEST — oczekiwania od 15 000 PLN brutto UoP',beforeSubmit:async()=>{expect(await page.locator('body').getAttribute('data-submitted')).toBeNull();before++;}});
 expect(before).toBe(1);expect(result.status).toBe('browser-sent');expect(result.receipt).toContain('Firma testowa');
 await expect(page.locator('body')).toHaveAttribute('data-account','false');await expect(page.locator('body')).toHaveAttribute('data-marketing','false');await expect(page.locator('body')).toHaveAttribute('data-message',/15 000 PLN/);
});
test('Rocket form never accepts required account terms or invents additional answers',async({page})=>{
 for(const options of [{requiredConsent:true},{extraQuestion:true},{implicitTerms:true}]){
  await page.setContent(fixture(options));let before=0;
  const result=await fillRocketForm(page,{job,candidate:{name:'Test',email:'candidate@example.test'},cvFile,message:'TEST',beforeSubmit:async()=>before++});
  expect(result.status).toBe('review');expect(before).toBe(0);await expect(page.locator('body')).not.toHaveAttribute('data-submitted','true');
 }
});
test('Rocket form with a missing receipt stays uncertain and does not submit twice',async({page})=>{
 await page.setContent(fixture({confirm:false}));let before=0;
 const result=await fillRocketForm(page,{job,candidate:{name:'Test',email:'candidate@example.test'},cvFile,message:'TEST',beforeSubmit:async()=>before++,confirmationTimeout:500});
 expect(result.status).toBe('uncertain');expect(before).toBe(1);await expect(page.locator('body')).toHaveAttribute('data-submit-count','1');await expect(page.locator('body')).toHaveAttribute('data-submitted','true');
});
