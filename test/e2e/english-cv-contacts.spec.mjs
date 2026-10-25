import {test,expect} from '@playwright/test';
import {profile,cvEnglish} from '../../src/data.mjs';
test('contact icons are in the header and CV downloads offer both languages',async({page})=>{
 await page.goto('/');
 const icons=page.locator('header .header-contacts');await expect(icons.getByRole('link')).toHaveCount(4);
 for(const [label,url] of [['LinkedIn',profile.linkedin],['GitHub',profile.github],['Telefon: '+profile.phone,'tel:'+profile.phone.replaceAll(' ','')],['E-mail: '+profile.email,'mailto:'+profile.email]]){
  const link=icons.getByRole('link',{name:label,exact:true});await expect(link).toHaveAttribute('href',url);await expect(link.locator('svg')).toHaveCount(1);await expect(link).toHaveCSS('color','rgb(194, 249, 112)');
 }
 await expect(page.locator('#cv a[href^="mailto:"],#cv a[href^="tel:"],#cv a[href^="https:"]')).toHaveCount(0);
 await expect(page.locator('.contact-details')).toHaveCount(0);
 await expect(page.locator('#cv a[download]')).toHaveCount(2);
 for(const suffix of ['','-EN']){const response=await page.request.get(`/public/cv/Patryk-Choinski-CV${suffix}.pdf`);expect(response.ok()).toBeTruthy();expect((await response.body()).subarray(0,4).toString()).toBe('%PDF');}
 for(const width of [1280,390]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();for(const icon of await icons.getByRole('link').all())await expect(icon).toBeVisible();}
});
test('English CV is fully translated, fits two pages and switches back to Polish',async({page})=>{
 await page.goto('/public/cv/index-en.html');await expect(page.locator('html')).toHaveAttribute('lang','en');
 for(const heading of ['Professional profile','Professional experience','Technical skills','Selected applications and projects','IT supporting industrial automation','Education','Languages and training'])await expect(page.getByRole('heading',{name:heading,exact:false})).toBeVisible();
 for(const project of cvEnglish.projects){await expect(page.locator('.projects')).toContainText(project.title);await expect(page.locator('.projects')).toContainText(project.description);}
 await expect(page.locator('body')).not.toContainText('Firma z branży');
 await expect(page.getByRole('navigation',{name:'Professional profiles'}).getByRole('link',{name:'LinkedIn ↗'})).toHaveAttribute('href',profile.linkedin);
 expect(await page.locator('.portrait').evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();
 await page.emulateMedia({media:'print'});await expect(page.locator('.cv-page')).toHaveCount(2);
 for(const height of await page.locator('.cv-page').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().height)))expect(height).toBeLessThan(1024);
 await page.emulateMedia({media:'screen'});await page.getByRole('link',{name:'Polski',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('lang','pl');
 await page.getByRole('link',{name:'English',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('lang','en');
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
