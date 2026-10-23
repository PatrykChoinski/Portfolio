import { mkdir, cp, readFile, writeFile } from 'node:fs/promises';
import { generateCvHtml } from './cv-template.mjs';
import {seoHead,privacyPage,reportsPage,sitemap} from './site-template.mjs';
import {site,projects} from '../src/data.mjs';
import {createStaticServer} from './serve.mjs';
import {chromium} from '@playwright/test';
import {browserChannel} from './browser.mjs';
await mkdir('dist', {recursive:true});
await cp('index.html','dist/index.html');
await cp('src','dist/src',{recursive:true});
await cp('public','dist/public',{recursive:true});
await mkdir('dist/public/vendor',{recursive:true});
await cp('node_modules/web-vitals/dist/web-vitals.js','dist/public/vendor/web-vitals.js');
await cp('node_modules/web-vitals/LICENSE','dist/public/vendor/web-vitals-LICENSE.txt');
let html=await readFile('dist/index.html','utf8');
await writeFile('dist/index.html',html.replace('</head>',seoHead()+'</head>'));
await writeFile('dist/prywatnosc.html',privacyPage());
await writeFile('dist/statystyki.html',reportsPage());
await writeFile('dist/sitemap.xml',sitemap());
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /Portfolio/\nSitemap: ${site.url}sitemap.xml\n`);
await mkdir('dist/public/cv',{recursive:true});
await writeFile('dist/public/cv/index.html',generateCvHtml());
await writeFile('dist/.nojekyll','');
// Produce readable HTML for crawlers and visitors without JavaScript.
const preview=createStaticServer('dist');
await new Promise(resolve=>preview.listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({channel:browserChannel});
 const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:')?route.continue():route.abort());
 await page.goto(`http://127.0.0.1:${preview.address().port}/`,{waitUntil:'networkidle'});
 await page.locator('.project-card').nth(projects.length-1).waitFor();
 if(errors.length)throw new Error('Prerender failed: '+errors.join('; '));
 html=await page.evaluate(()=>{document.querySelectorAll('.consent-panel').forEach(el=>el.remove());return '<!doctype html>\n'+document.documentElement.outerHTML;});
 await writeFile('dist/index.html',html);
}finally{if(browser)await browser.close();await new Promise(resolve=>preview.close(resolve));}
console.log('Portfolio built in dist/');
