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
