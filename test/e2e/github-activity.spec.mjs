import {test,expect} from '@playwright/test';
test('GitHub profile, real calendar and commit links appear at the bottom with highlighted links',async({page})=>{
 await page.goto('/');const section=page.locator('#github');await section.scrollIntoViewIfNeeded();
 await expect(section.getByRole('heading',{name:'Na bieżąco z kodem.'})).toBeVisible();
 await expect(section.locator('.github-day')).toHaveCount((await (await page.request.get('/public/github-activity.json')).json()).days.length);
 expect(await section.locator('.github-commits li').count()).toBeGreaterThan(0);
 await expect(section.locator('.github-stats')).not.toContainText('godzin');
 expect(await section.evaluate(el=>el.nextElementSibling===document.querySelector('.experience-section'))).toBeTruthy();
 for(const link of await page.locator('a[href="https://github.com/PatrykChoinski"]').all())await expect(link).toHaveClass(/github-cta/);
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});

test('published styles bypass old cached CSS and render the GitHub calendar',async({page})=>{
 await page.route('**/src/*.css*',route=>new URL(route.request().url()).searchParams.has('v')?route.continue():route.fulfill({contentType:'text/css',body:'/* stale cached stylesheet */'}));
 await page.goto('/#github');
 for(const link of await page.locator('link[rel=stylesheet]').all())await expect(link).toHaveAttribute('href',/\.css\?v=[a-f0-9]{12}$/);
 await expect(page.locator('.github-calendar')).toHaveCSS('display','grid');
 await expect(page.locator('.github-stats')).toHaveCSS('display','grid');
 await expect(page.locator('#github .section-head .github-cta')).toHaveCSS('background-color','rgb(194, 249, 112)');
 const day=page.locator('.github-day[data-level="4"]').first();await expect(day).toHaveCSS('height','12px');
});
