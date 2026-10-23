import {test,expect} from '@playwright/test';
import {profile,site} from '../../src/data.mjs';
const external='a[href^="http"],a[href^="mailto:"],a[href^="tel:"]';
async function checkAccent(page){
 const links=page.locator(external);expect(await links.count()).toBeGreaterThan(0);
 const incorrect=await links.evaluateAll(els=>els.filter(el=>{
  const css=getComputedStyle(el);
  return css.color!=='rgb(194, 249, 112)'&&!(css.color==='rgb(20, 32, 24)'&&css.backgroundColor==='rgb(194, 249, 112)');
 }).map(el=>el.textContent.trim()));
 expect(incorrect).toEqual([]);
}
test('all outgoing links share the lime accent on the site and information pages',async({page})=>{
 for(const path of ['/','/prywatnosc.html','/statystyki.html']){await page.goto(path);await checkAccent(page);}
 await page.goto('/');await page.getByRole('button',{name:'Szczegóły: PLC z automatyczną weryfikacją'}).click();await checkAccent(page);
 await expect(page.locator('#load-simulator')).toHaveCSS('background-color','rgb(194, 249, 112)');
});
test('CV has a complete portrait and three working professional destinations',async({page})=>{
 await page.goto('/public/cv/index.html');
 for(const [name,url] of [['Portfolio',site.url],['GitHub',profile.github],['LinkedIn',profile.linkedin]]){
  const link=page.getByRole('navigation',{name:'Profile zawodowe'}).getByRole('link',{name:name+' ↗',exact:true});
  await expect(link).toHaveAttribute('href',url);await expect(link).toHaveCSS('background-color','rgb(194, 249, 112)');
 }
 const photo=page.locator('.portrait');expect(await photo.evaluate(el=>el.complete&&el.naturalWidth>0)).toBeTruthy();await expect(photo).toHaveCSS('object-fit','contain');
 await page.emulateMedia({media:'print'});expect(await page.locator('.cv-page').count()).toBe(2);
 const heights=await page.locator('.cv-page').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().height));
 for(const height of heights)expect(height).toBeLessThan(1024); // A4 minus the two 13 mm margins.
 await page.emulateMedia({media:'screen'});await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
