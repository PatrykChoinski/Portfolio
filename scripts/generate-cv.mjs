import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { generateCvHtml } from './cv-template.mjs';
const directory=process.argv[2]||'public/cv';
await mkdir(directory,{recursive:true});
const html=generateCvHtml();
await writeFile(`${directory}/index.html`,html);
const browser=await chromium.launch();
try{const page=await browser.newPage();await page.setContent(html);await page.emulateMedia({media:'print'});await page.pdf({path:`${directory}/Patryk-Choinski-CV.pdf`,format:'A4',printBackground:true,preferCSSPageSize:true});console.log(`CV generated: ${directory}`);}finally{await browser.close();}
