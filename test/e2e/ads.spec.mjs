import {test,expect} from '@playwright/test';
test('side banner preview fits desktop, scrolls out and stays hidden on smaller screens',async({page})=>{
 const adRequests=[];page.on('request',r=>{if(r.url().includes('pagead2.googlesyndication.com'))adRequests.push(r.url());});
 await page.setViewportSize({width:1920,height:900});await page.goto('/?ads-preview=1');
 await expect(page.locator('.ad-rail')).toHaveCount(2);
 const geometry=await page.locator('.ad-rail').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();const content=document.querySelector('main>section').getBoundingClientRect();return {left:r.left,right:r.right,contentLeft:content.left,contentRight:content.right,position:getComputedStyle(n).position};}));
 expect(geometry[0].right).toBeLessThan(geometry[0].contentLeft);expect(geometry[1].left).toBeGreaterThan(geometry[1].contentRight);
 expect(geometry.every(g=>g.position==='absolute')).toBeTruthy();
 await page.locator('#kompetencje').scrollIntoViewIfNeeded();expect((await page.locator('.ad-rail').first().boundingBox()).y).toBeLessThan(-600);
 for(const width of [1719,1280,390]){await page.setViewportSize({width,height:900});await expect(page.locator('.ad-rail').first()).toBeHidden();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();}
 expect(adRequests).toEqual([]);
 await page.goto('/');await expect(page.locator('.ad-rail')).toHaveCount(0);
});

test('active AdSense loads once on desktop and exposes Google consent settings',async({page})=>{
 let loads=0;
 await page.route('https://pagead2.googlesyndication.com/**',async route=>{loads++;await route.fulfill({contentType:'text/javascript',body:`window.adPushes=0;window.adsbygoogle={push(){window.adPushes++}};window.googlefc.showRevocationMessage=()=>window.reopened=true;for(const entry of window.googlefc.callbackQueue)entry.CONSENT_API_READY?.();window.googlefc.callbackQueue={push(entry){entry.CONSENT_API_READY?.();}};`});});
 await page.setViewportSize({width:1280,height:900});await page.goto('/');
 await page.evaluate(async()=>{const {initAds}=await import('./src/ads.mjs');const {advertising}=await import('./src/data.mjs');initAds({...advertising,origin:location.origin});});
 expect(loads).toBe(0);
 await page.setViewportSize({width:1920,height:900});await expect.poll(()=>page.evaluate(()=>window.adPushes)).toBe(2);
 await page.getByRole('button',{name:'Ustawienia reklam',exact:true}).click();expect(await page.evaluate(()=>window.reopened)).toBe(true);
 await page.setViewportSize({width:1280,height:900});await page.setViewportSize({width:1920,height:900});expect(loads).toBe(1);expect(await page.evaluate(()=>window.adPushes)).toBe(2);
});
