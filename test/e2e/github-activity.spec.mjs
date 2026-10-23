import {test,expect} from '@playwright/test';
test('GitHub profile, real calendar and commit links appear at the bottom with highlighted links',async({page})=>{
 await page.goto('/');const section=page.locator('#github');await section.scrollIntoViewIfNeeded();
 await expect(section.getByRole('heading',{name:'Na bieżąco z kodem.'})).toBeVisible();
 await expect(section.locator('.github-day')).toHaveCount((await (await page.request.get('/public/github-activity.json')).json()).days.length);
 expect(await section.locator('.github-commits li').count()).toBeGreaterThan(0);
 await expect(section.locator('.github-stats')).not.toContainText('godzin');
 expect(await section.evaluate(el=>el===document.querySelector('main').lastElementChild)).toBeTruthy();
 for(const link of await page.locator('a[href="https://github.com/PatrykChoinski"]').all())await expect(link).toHaveClass(/github-cta/);
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
