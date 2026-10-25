import {test,expect} from '@playwright/test';
import {spawn} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
test('private dashboard imports, deduplicates and distinguishes preparation from sending',async({page})=>{
 const directory=await mkdtemp(join(tmpdir(),'job-agent-'));
 const child=spawn(process.execPath,['job-agent/server.mjs'],{env:{...process.env,JOB_AGENT_HOME:directory,JOB_AGENT_PORT:'0'},stdio:['ignore','pipe','pipe']});
 try{
 const url=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Server timeout')),15000);child.stdout.on('data',chunk=>{const match=String(chunk).match(/http:\/\/127\.0\.0\.1:\d+/);if(match){clearTimeout(timer);resolve(match[0]);}});child.on('error',reject);});
 await page.goto(url);await expect(page.getByRole('heading',{name:'Radar kariery'})).toBeVisible();
 await expect(page.locator('[data-account]')).toHaveCount(6);
 await page.locator('[data-account="linkedin"]').selectOption('ready');
 await expect(page.locator('#message')).toHaveText('Zapisano.');
 await page.reload();await expect(page.locator('[data-account="linkedin"]')).toHaveValue('ready');
 await expect(page.locator('[data-source]:checked')).toHaveCount(4);
 const cv=await page.request.get(url+'/cv.pdf');expect(cv.status()).toBe(200);expect(cv.headers()['content-type']).toBe('application/pdf');
 const job={title:'PLC engineer test',url:'https://example.com/jobs/test',company:'Firma z branży automatyki',location:'Warszawa',latitude:52.23,longitude:21.01,salary:{min:15000,max:18000,currency:'PLN',period:'month',basis:'gross',contract:'employment'}};
 for(let i=0;i<2;i++){await page.locator('#import').setInputFiles({name:'jobs.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify([job]))});await expect(page.locator('#message')).toHaveText('Zapisano.');}
 await expect(page.locator('.job')).toHaveCount(1);
 await page.getByText('Uzupełnij zweryfikowane warunki oferty',{exact:true}).click();
 await page.locator('[data-offer] [name="note"]').fill('Warunki potwierdzone w ogłoszeniu testowym');
 await page.getByRole('button',{name:'Zapisz potwierdzone warunki',exact:true}).click();
 await expect(page.locator('#message')).toHaveText('Zapisano.');
 await page.getByRole('button',{name:'Przygotuj / aplikuj'}).click();
 await expect(page.locator('.job .badge').first()).toHaveText('Przygotowana');
 await expect(page.locator('#stats')).toContainText('Wysłane / dalszy etap0');
 await page.reload();await expect(page.locator('.job .badge').first()).toHaveText('Przygotowana');
 await page.locator('[data-status]').selectOption('manual-sent');await expect(page.locator('.job .badge').first()).toHaveText('Wysłana · ręcznie');
 const token=await page.locator('[name="agent-token"]').getAttribute('content');
 const invalidReceipt=await page.request.post(url+'/api/browser-result',{headers:{'X-Agent-Token':token},data:{id:'missing',receipt:'',url:job.url}});expect(invalidReceipt.status()).toBe(400);
 const browserJob={...job,url:job.url+'-browser'};
 await page.request.post(url+'/api/import',{headers:{'X-Agent-Token':token},data:{jobs:[browserJob]}});
 const imported=await(await page.request.get(url+'/api/state')).json(),browserId=imported.jobs.find(j=>j.url===browserJob.url).id;
 const verifiedSalary=await page.request.post(url+'/api/offer',{headers:{'X-Agent-Token':token},data:{id:browserId,fields:{salary:{min:17000,max:22000}},note:'TEST: osobno potwierdzone widełki brutto UoP'}});expect(verifiedSalary.status()).toBe(200);
 const receipt={id:browserId,url:browserJob.url,receipt:'TEST: portal potwierdził wysłanie na serwerze testowym'};
 const recorded=await page.request.post(url+'/api/browser-result',{headers:{'X-Agent-Token':token},data:receipt});expect(recorded.status()).toBe(200);
 const duplicate=await page.request.post(url+'/api/browser-result',{headers:{'X-Agent-Token':token},data:receipt});expect(duplicate.status()).toBe(400);
 await page.reload();await expect(page.locator('#stats')).toContainText('Wysłane / dalszy etap2');
 const denied=await page.request.post(url+'/api/scan',{data:{}});expect(denied.status()).toBe(403);
 await page.locator('#search').fill('nieistniejące');await expect(page.locator('.job')).toHaveCount(0);
 }finally{child.kill();await new Promise(resolve=>child.exitCode!==null?resolve():child.once('exit',resolve));await rm(directory,{recursive:true,force:true});}
});
