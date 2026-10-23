import {test,expect} from '@playwright/test';
test('navigation, filters, case study and PDF download work',async({page})=>{const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await expect(page).toHaveTitle(/Patryk Choiński/);await expect(page.locator('.project-card')).toHaveCount(7);await page.getByRole('button',{name:'Dane i SCADA',exact:true}).click();await expect(page.locator('.project-card')).toHaveCount(1);await page.getByRole('button',{name:'Szczegóły: Proces, receptury i raporty'}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();await page.getByRole('button',{name:'Wszystkie',exact:true}).click();await page.getByRole('searchbox').fill('CODESYS');await expect(page.locator('.project-card')).toHaveCount(1);await page.getByRole('searchbox').fill('brak-wyniku');await expect(page.getByText('Brak projektów dla tego wyszukiwania.',{exact:false})).toBeVisible();const response=await page.request.get('/public/cv/Patryk-Choinski-CV.pdf');expect(response.ok()).toBeTruthy();expect((await response.body()).subarray(0,4).toString()).toBe('%PDF');expect(errors).toEqual([]);});
test('mobile layout fits viewport and links reach sections',async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto('/');await page.getByRole('link',{name:'Kompetencje',exact:true}).click();await expect(page).toHaveURL(/#kompetencje/);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await expect(page.locator('#skills .skill')).toHaveCount(8);});
test('CV is accessible under a repository subpath',async({page})=>{await page.goto('/public/cv/index.html');await expect(page.getByRole('heading',{name:'Patryk Choiński',exact:true})).toBeVisible();await expect(page.getByRole('heading',{name:'Kompetencje techniczne'})).toBeVisible();});
test('automation comes first and all photos and application logos load',async({page})=>{
 await page.goto('/');
 await expect(page.locator('h1')).toContainText('Automatyka');
 await expect(page.locator('#automatyka .application-grid>div')).toHaveCount(8);
 await expect(page.locator('#skills .skill')).toHaveCount(8);
 await expect(page.locator('#support-skills .skill')).toHaveCount(4);
 await expect(page.locator('#projects .project-card').first()).toContainText('Czyszczenie i diagnostyka kanałów form');
 await expect(page.locator('#projects .project-art.has-photo')).toHaveCount(6);
 await expect(page.locator('.technology-logo')).toHaveCount(11);
 await expect(page.locator('.hero-portrait')).toHaveAttribute('alt','Patryk Choiński');
 for(const image of await page.locator('img').all()){
  await image.scrollIntoViewIfNeeded();
  await expect.poll(()=>image.evaluate(el=>el.complete&&el.naturalWidth>0)).toBeTruthy();
 }
 await expect(page.locator('.gallery-note')).toContainText('Fotografie producentów');
});
test('SCADA signals, batch comparison and time cursor respond; animation contains motion',async({page})=>{
 await page.goto('/');
 await page.locator('#scada-demo').scrollIntoViewIfNeeded();
 await expect(page.locator('.scada-plot')).toHaveCount(4);
 await expect(page.locator('.scada-series')).toHaveCount(8);
 await page.getByLabel('Temperatura klapy',{exact:true}).check();
 await expect(page.locator('.scada-series')).toHaveCount(10);
 await page.locator('#scada-batch').selectOption('1');
 await expect(page.locator('.scada-series')).toHaveCount(5);
 await page.locator('#scada-cursor').fill('60');
 await expect(page.locator('#scada-time')).toHaveText('60 s');
 await expect(page.locator('.scada-caption')).toContainText('nie są danymi produkcyjnymi');
 await page.getByRole('button',{name:'Przywróć widok'}).click();
 await expect(page.locator('.scada-series')).toHaveCount(8);
 const video=page.locator('.demo-video');
 await video.scrollIntoViewIfNeeded();
 await expect.poll(()=>video.evaluate(v=>v.readyState)).toBeGreaterThanOrEqual(2);
 const result=await video.evaluate(async v=>{
  const canvas=document.createElement('canvas');canvas.width=160;canvas.height=100;const ctx=canvas.getContext('2d');
  async function frame(time){v.currentTime=time;await new Promise(resolve=>v.addEventListener('seeked',resolve,{once:true}));ctx.drawImage(v,0,0,160,100);return [...ctx.getImageData(0,0,160,100).data];}
  const a=await frame(1),b=await frame(7);return {duration:v.duration,changed:a.filter((x,i)=>Math.abs(x-b[i])>15).length};
 });
 expect(result.duration).toBeGreaterThan(10);
 expect(result.changed).toBeGreaterThan(100);
 await page.route('https://patrykchoinski.github.io/Promasz-Visu3D/',route=>route.fulfill({contentType:'text/html',body:'<h1>Simulator</h1>'}));
 await page.getByRole('button',{name:'Uruchom pełny symulator tutaj ↗'}).click();
 await expect(page.locator('.simulator-frame')).toHaveAttribute('src','https://patrykchoinski.github.io/Promasz-Visu3D/');
});

test('merged projects, IT databases and automation equipment remain in their intended sections',async({page})=>{await page.goto('/');await expect(page.locator('#maszyny')).toHaveCount(0);await expect(page.locator('#skills')).not.toContainText('SQL Server');await expect(page.locator('#skills')).not.toContainText('PostgreSQL');await expect(page.locator('#support-skills')).toContainText('SQL Server');await expect(page.locator('#support-skills')).toContainText('PostgreSQL');await expect(page.locator('#support-skills')).toContainText('Claude');await expect(page.locator('#support-skills')).toContainText('Codex');await expect(page.locator('body')).not.toContainText('Three.js');await expect(page.locator('#projects')).not.toContainText('4000');await expect(page.locator('.equipment-strip figure')).toHaveCount(6);await expect(page.locator('.protocol-logos img')).toHaveCount(6);await expect(page.locator('#projects')).not.toContainText('Energia pod kontrolą');await expect(page.locator('#projects')).not.toContainText('Maszyna w przeglądarce');await expect(page.getByRole('heading',{name:'Ekosystem sterowania.'})).toHaveCount(0);});

test('Actions replay animates real steps and preserves the failed run outcome',async({page})=>{await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');await expect(page.locator('#pipeline-result')).toContainText('powodzeniem');await page.getByRole('button',{name:'Odtwórz Actions ▶'}).click();await expect(page.locator('.pipeline-steps [data-state=running]')).toHaveCount(1);await expect(page.locator('#pipeline-result')).toContainText('powodzeniem',{timeout:10000});await page.locator('#pipeline-run').selectOption('1');await expect(page.locator('#pipeline-result')).toContainText('Błąd kompilacji');await expect(page.locator('.pipeline-steps [data-state=skipped]')).toHaveCount(2);await expect(page.locator('.pipeline-source')).toHaveAttribute('href',/35979015070$/);await page.getByRole('searchbox').fill('brak-wyniku');await page.getByRole('searchbox').fill('CODESYS');await expect(page.locator('#pipeline-run')).toHaveValue('0');});
