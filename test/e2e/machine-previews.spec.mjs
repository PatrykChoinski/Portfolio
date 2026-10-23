import {test,expect} from '@playwright/test';
const stub=`window.YT={Player:class{constructor(mount,options){this.o=options;this.frame=document.createElement('iframe');mount.replaceWith(this.frame);setTimeout(()=>options.events.onReady({target:this}),0);}getIframe(){return this.frame;}mute(){}seekTo(){}playVideo(){this.o.events.onStateChange({data:1});}pauseVideo(){}destroy(){this.frame.remove();}}};window.onYouTubeIframeAPIReady();`;
test('machine previews show photo for 1s, video for 15s, and stop outside viewport',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.route('https://www.youtube.com/iframe_api',route=>route.fulfill({contentType:'text/javascript',body:stub}));
 await page.goto('/');
 const card=page.locator('[data-machine-video]').first(),art=card.locator('.project-art');
 await expect(page.locator('[data-machine-video]')).toHaveCount(6);
 await card.scrollIntoViewIfNeeded();
 await expect(art).toHaveAttribute('data-preview','photo');
 await page.waitForTimeout(500);await expect(art).toHaveAttribute('data-preview','photo');
 await expect(art).toHaveAttribute('data-preview','video');
 await page.waitForTimeout(14000);await expect(art).toHaveAttribute('data-preview','video');
 await expect(art).toHaveAttribute('data-preview','photo');
 await expect(art).toHaveAttribute('data-preview','video');
 await card.locator('.preview-toggle').click();await expect(art).toHaveAttribute('data-preview','photo');
 await card.locator('.preview-toggle').click();await expect(art).toHaveAttribute('data-preview','video');
 await page.locator('h1').scrollIntoViewIfNeeded();await expect(art).toHaveAttribute('data-preview','photo');
 await page.getByRole('searchbox').fill('brak-wyniku');await expect(page.locator('#projects iframe')).toHaveCount(0);
});
test('reduced motion keeps photos until requested; failed video retains photo',async({page})=>{
 await page.route('https://www.youtube.com/iframe_api',route=>route.abort());
 await page.goto('/');const card=page.locator('[data-machine-video]').first();await card.scrollIntoViewIfNeeded();
 await expect(card.locator('.preview-toggle')).toHaveText('Uruchom animację');
 await page.waitForTimeout(2200);await expect(page.locator('script[src*="youtube.com"]')).toHaveCount(0);
 await card.locator('.preview-toggle').click();await page.waitForTimeout(1200);await expect(card.locator('.preview-toggle')).toHaveText('Wstrzymaj animację');await expect(page.getByText('Ponów podgląd filmu',{exact:true})).toHaveCount(0);
 await expect(card.locator('.project-art')).toHaveAttribute('data-preview','video');
});

test('the photograph overlay ends after 1s even while the video provider is still loading',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.route('https://www.youtube.com/iframe_api',async route=>{await new Promise(resolve=>setTimeout(resolve,3000));await route.fulfill({contentType:'text/javascript',body:stub});});
 await page.goto('/');const card=page.locator('[data-machine-video]').first(),art=card.locator('.project-art');await art.scrollIntoViewIfNeeded();
 await expect(art).toHaveAttribute('data-preview','photo');await page.waitForTimeout(500);await expect(art).toHaveAttribute('data-preview','photo');
 await expect(art).toHaveAttribute('data-preview','video',{timeout:1000});
 await expect(art.locator('iframe')).toHaveCount(0);
 await expect(art.locator('iframe')).toHaveCount(1,{timeout:6000});
 await expect(art.locator('[data-project],.art-label,.art-caption,.art-arrow')).toHaveCount(0);
 await expect(card.locator('.project-details')).toBeVisible();await card.locator('.project-details').click();await expect(page.getByRole('dialog')).not.toContainText('Podstawa opisu');await expect(page.getByRole('dialog')).not.toContainText('Zaprogramowane przeze mnie');
});
