import {test,expect} from '@playwright/test';
test('offline simulator renders 3D and performs a simulated cut without a PLC connection',async({page})=>{
 const errors=[],requests=[];page.on('pageerror',error=>errors.push(error.message));page.on('request',r=>requests.push(r.url()));
 await page.goto('/public/apps/simulator/');await expect(page.locator('#view canvas')).toBeVisible({timeout:20000});
 await expect.poll(()=>page.evaluate(()=>Boolean(window.vizu?.state?.forms))).toBeTruthy();
 const config=await page.evaluate(()=>({static:vizu.state.cfg.static,plc:vizu.state.cfg.plc,endpoint:vizu.state.cfg.endpoint,mode:vizu.state.mode}));expect(config).toEqual({static:true,plc:false,endpoint:undefined,mode:'offline'});
 await expect(page.locator('#mode [data-mode="online"]')).toBeHidden();
 await page.locator('#speed').selectOption('100');await page.locator('.tabs [data-tab="cut"]').click();await page.locator('#op').selectOption('cut');await page.locator('#cutStart').click();
 await expect.poll(()=>page.evaluate(()=>vizu.state.recorder.cuts.length),{timeout:30000}).toBeGreaterThan(0);
 expect(requests.some(url=>/\/api\/|opc\.tcp:/.test(url))).toBeFalsy();expect(errors).toEqual([]);
});
