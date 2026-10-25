import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const production='https://patrykchoinski.github.io/Portfolio/';
test('clean layout, full portrait and sticky navigation on desktop and mobile',async({page})=>{
 for(const width of [1280,390]){
  await page.setViewportSize({width,height:900});await page.goto('/');
  await expect(page.locator('.ticker,.photo-source,.technology-logo[href],.protocol-logos a')).toHaveCount(0);
  const order=await page.locator('main>section[id]').evaluateAll(nodes=>nodes.map(n=>n.id));expect(order.slice(order.indexOf('automatyka'),order.indexOf('kompetencje')+1)).toEqual(['automatyka','kompetencje']);
  await expect(page.locator('.portrait-hero .machine-top')).toHaveCount(0);
  const geometry=await page.locator('.hero-portrait').evaluate(img=>{const r=img.getBoundingClientRect(),caption=document.querySelector('.portrait-caption').getBoundingClientRect();return {width:r.width,height:r.height,fit:getComputedStyle(img).objectFit,caption:caption.top,bottom:r.bottom};});
  expect(geometry.fit).toBe('contain');expect(Math.abs(geometry.width-geometry.height)).toBeLessThan(1);expect(geometry.caption).toBeGreaterThanOrEqual(geometry.bottom-1);
  await page.locator('#projekty').scrollIntoViewIfNeeded();const header=await page.locator('header').boundingBox();expect(header.y).toBeCloseTo(0,0);await expect(page.getByRole('link',{name:'Kompetencje',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 }
});
test('production HTML contains project content and SEO even without JavaScript',async({browser,request})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('http://127.0.0.1:4173/');
 await expect(page.locator('#projects .project-card')).toHaveCount(7);await expect(page.locator('#skills')).toContainText('Programowanie PLC');await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',production);
 expect(await page.locator('script[type="application/ld+json"]').textContent()).toContain('ProfilePage');await context.close();
 const map=await request.get('/sitemap.xml');expect(map.headers()['content-type']).toContain('xml');expect(await map.text()).toContain(production);
 const robots=await request.get('/robots.txt');expect(await robots.text()).toContain(production+'sitemap.xml');
});
test('GA4 loads only after consent, sends one pageview and useful events without search/contact data',async({page})=>{
 let tagLoads=0;
 const config=(await readFile(new URL('../../src/data.mjs',import.meta.url),'utf8')).replace("url:'https://patrykchoinski.github.io/Portfolio/'","url:'http://127.0.0.1:4173/'");
 await page.route('https://www.googletagmanager.com/**',route=>{tagLoads++;return route.fulfill({contentType:'text/javascript',body:'/* mocked Google tag: no production data transmitted */'});});
 await page.route('**/src/data.mjs',route=>route.fulfill({contentType:'text/javascript',body:config}));
 await page.addInitScript(()=>document.addEventListener('click',event=>{const a=event.target.closest('a');if(a&&(/^(mailto:|tel:)/.test(a.getAttribute('href'))||a.getAttribute('download')!==null))event.preventDefault();}));
 await page.goto('/?email=private@example.com&utm_source=linkedin');
 await expect(page.getByRole('button',{name:'Zgadzam się na statystyki'})).toBeVisible();expect(tagLoads).toBe(0);
 await page.getByRole('button',{name:'Bez statystyk',exact:true}).click();expect(tagLoads).toBe(0);
 await page.getByRole('button',{name:'Ustawienia statystyk',exact:true}).click();await page.getByRole('button',{name:'Zgadzam się na statystyki'}).click();
 await expect.poll(()=>tagLoads).toBe(1);
 await page.getByRole('searchbox').fill('private@example.com');await page.getByRole('searchbox').fill('');
 await page.getByRole('button',{name:'Szczegóły: PLC z automatyczną weryfikacją'}).click();await page.keyboard.press('Escape');
 await page.locator('a[href^="mailto:"]').click();await page.locator('a[href^="tel:"]').click();await page.locator('a[download]').first().click();
 const commands=await page.evaluate(()=>window.dataLayer.map(args=>Array.from(args))),events=commands.filter(args=>args[0]==='event');
 expect(events.filter(e=>e[1]==='page_view')).toHaveLength(1);expect(events.map(e=>e[1])).toEqual(expect.arrayContaining(['project_search','project_open','contact_click','cv_download']));
 expect(JSON.stringify(commands)).not.toContain('private@example.com');expect(JSON.stringify(events)).not.toContain('patryk@');
 expect(events.filter(e=>e[1]==='contact_click').map(e=>e[2])).toEqual([{contact_method:'email'},{contact_method:'phone'}]);
 await page.reload();await expect.poll(()=>tagLoads).toBe(2);await expect(page.locator('.consent-panel')).toBeHidden();
 await page.getByRole('button',{name:'Ustawienia statystyk',exact:true}).click();
 await Promise.all([page.waitForEvent('domcontentloaded'),page.getByRole('button',{name:'Bez statystyk',exact:true}).click()]);
 await expect(page.locator('.consent-panel')).toBeHidden();
 expect(await page.evaluate(()=>localStorage.getItem('portfolio-analytics-consent-v1'))).toBe('denied');
 await page.reload();expect(tagLoads).toBe(2);
 await page.unrouteAll({behavior:'wait'});
});
