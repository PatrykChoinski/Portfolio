import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {generateCvHtml} from './cv-template.mjs';
import {browserChannel} from './browser.mjs';
const directory=process.argv[2]||'public/cv';
await mkdir(directory,{recursive:true});
const browser=await chromium.launch({channel:browserChannel});
try{
 for(const language of ['pl','en']){
  const html=generateCvHtml(language),suffix=language==='en'?'-EN':'';
  await writeFile(`${directory}/${language==='en'?'index-en':'index'}.html`,html);
  const page=await browser.newPage();await page.setContent(html);await page.locator('.portrait').evaluate(img=>img.decode());await page.emulateMedia({media:'print'});
  await page.pdf({path:`${directory}/Patryk-Choinski-CV${suffix}.pdf`,format:'A4',printBackground:true,preferCSSPageSize:true});await page.close();
 }
 console.log(`Polish and English CVs generated: ${directory}`);
}finally{await browser.close();}
