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
 const job={title:'PLC engineer test',url:'https://example.com/jobs/test',company:'Firma z branży automatyki',location:'Warszawa',latitude:52.23,longitude:21.01,salary:{min:15000,max:18000,currency:'PLN',period:'month',basis:'gross',contract:'employment'}};
 for(let i=0;i<2;i++){await page.locator('#import').setInputFiles({name:'jobs.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify([job]))});await expect(page.locator('#message')).toHaveText('Zapisano.');}
 await expect(page.locator('.job')).toHaveCount(1);
 await page.getByRole('button',{name:'Przygotuj / aplikuj'}).click();
 await expect(page.locator('.job .badge').first()).toHaveText('Przygotowana');
 await expect(page.locator('#stats')).toContainText('Wysłane / dalszy etap0');
 await page.reload();await expect(page.locator('.job .badge').first()).toHaveText('Przygotowana');
 await page.locator('[data-status]').selectOption('manual-sent');await expect(page.locator('.job .badge').first()).toHaveText('Wysłana · ręcznie');
 const denied=await page.request.post(url+'/api/scan',{data:{}});expect(denied.status()).toBe(403);
 await page.locator('#search').fill('nieistniejące');await expect(page.locator('.job')).toHaveCount(0);
 }finally{child.kill();await new Promise(resolve=>child.exitCode!==null?resolve():child.once('exit',resolve));await rm(directory,{recursive:true,force:true});}
});
