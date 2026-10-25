import {test,expect} from '@playwright/test';
import {controlSystem} from '../../src/data.mjs';
test('control architecture shows every device and supports keyboard selection',async({page})=>{
 await page.goto('/#system-sterowania');
 const section=page.locator('#system-sterowania');await expect(section).toHaveCount(1);
 await expect(section.locator('[data-device]')).toHaveCount(9);
 await expect(section.locator('[data-device^="servo-"]')).toHaveCount(3);
 await expect(section.locator('[data-device^="inverter-"]')).toHaveCount(2);
 for(const device of controlSystem.devices){
  const button=section.locator(`[data-device="${device.id}"]`);
  await button.focus();await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-pressed','true');
  await expect(section.locator('#control-detail h3')).toHaveText(device.name);
  await expect(section.locator('#control-detail')).toContainText(device.description);
 }
 await section.locator('[data-device="eb80"]').click();
 await expect(section.getByRole('link',{name:/dokumentacja producenta/})).toHaveAttribute('href',controlSystem.devices.find(d=>d.id==='eb80').source);
 await expect(section.getByRole('link',{name:/dokumentacja producenta/})).toHaveCSS('color','rgb(194, 249, 112)');
 await expect(section.locator('[aria-pressed="true"]')).toHaveCount(1);
 await expect(section.locator('.control-note')).toContainText('Schemat poglądowy');
 await expect(section.locator('.control-legend>div')).toHaveCount(3);
 const outside=await section.locator('[data-device]').evaluateAll(els=>els.filter(el=>{const r=el.getBoundingClientRect(),p=el.parentElement.getBoundingClientRect();return r.left<p.left||r.right>p.right||r.top<p.top||r.bottom>p.bottom}).map(el=>el.dataset.device));
 expect(outside).toEqual([]);
});
test('control architecture fits mobile and remains readable without JavaScript',async({page,browser})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/#system-sterowania');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await expect(page.locator('.control-wires')).toBeHidden();
 await page.locator('[data-device="temperature"]').click();await expect(page.locator('#control-detail')).toContainText('PID');
 for(const card of await page.locator('.control-device').all()){const box=await card.boundingBox();expect(box.width).toBeGreaterThan(130);expect(box.height).toBeGreaterThanOrEqual(170);}
 const context=await browser.newContext({javaScriptEnabled:false});const staticPage=await context.newPage();
 await staticPage.goto('/');await expect(staticPage.locator('#system-sterowania')).toContainText('Wyspa EB80');await expect(staticPage.locator('#system-sterowania [data-device]')).toHaveCount(9);await context.close();
});
