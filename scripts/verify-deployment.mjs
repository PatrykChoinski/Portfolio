import {chromium,expect} from '@playwright/test';
import {browserChannel} from './browser.mjs';
const target=new URL(process.argv[2]||'https://patrykchoinski.eu/');
const app=new URL('src/app.mjs',target);
const response=await fetch(app);if(!response.ok||!/(?:text|application)\/javascript/i.test(response.headers.get('content-type')||''))throw new Error('Module must have JavaScript MIME type: '+app);
if(process.argv.includes('--mime-only')){console.log('Published JavaScript MIME type verified.');process.exit(0);}
const browser=await chromium.launch({channel:browserChannel});
try{
 const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(target.href,{waitUntil:'domcontentloaded'});
 await page.getByRole('button',{name:'Dane i SCADA',exact:true}).click();await expect(page.locator('.project-card')).toHaveCount(1);
 await page.getByRole('button',{name:'Szczegóły: Proces, receptury i raporty'}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Wszystkie',exact:true}).click();await expect(page.locator('.project-card')).toHaveCount(7);
 await page.locator('[data-device="inverter-1"]').click();await expect(page.locator('#control-detail')).toContainText('Falownik 1');
 await expect(page.locator('.scada-series')).toHaveCount(8);await page.locator('#scada-batch').selectOption('1');await expect(page.locator('.scada-series')).toHaveCount(4);
 await page.getByRole('button',{name:'Uruchom pełny symulator tutaj ↗'}).click();await expect(page.locator('.simulator-frame')).toBeVisible();
 await expect(page.frameLocator('.simulator-frame').locator('#view canvas')).toBeVisible({timeout:20000});
 await expect(page.locator('.demo-video button')).toBeVisible();await page.locator('.demo-video button').click();await expect(page.locator('.demo-video iframe')).toHaveAttribute('src',/youtube-nocookie\.com/,{timeout:20000});
 for(const name of ['Patryk-Choinski-CV.pdf','Patryk-Choinski-CV-EN.pdf']){const pdf=await page.request.get(new URL('public/cv/'+name,target).href);if(!pdf.ok()||(await pdf.body()).subarray(0,4).toString()!=='%PDF')throw new Error('CV download failed: '+name);}
 if(errors.length)throw new Error(errors.join('\n'));
 console.log('Published site verified: modules, project filters, details, control diagram, SCADA, simulator, video embed and both CVs.');
}finally{await browser.close();}
