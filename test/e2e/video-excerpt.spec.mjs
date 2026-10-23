import {test,expect} from '@playwright/test';
test('3D excerpt uses the supplied YouTube video, loops only its 15s range and pauses outside viewport',async({page})=>{
 const stub=`window.YT={Player:class{constructor(mount,o){this.o=o;this.time=o.playerVars.start;this.paused=true;window.clipPlayer=this;this.frame=document.createElement('iframe');mount.replaceWith(this.frame);setTimeout(()=>o.events.onReady({target:this}),0);}getIframe(){return this.frame;}mute(){}getCurrentTime(){return this.time;}seekTo(t){this.time=t;}playVideo(){this.paused=false;this.o.events.onStateChange({data:1});}pauseVideo(){this.paused=true;}destroy(){this.frame.remove();}}};window.onYouTubeIframeAPIReady();`;
 await page.route('https://www.youtube.com/iframe_api',route=>route.fulfill({contentType:'text/javascript',body:stub}));
 await page.goto('/');const video=page.locator('.demo-video');await video.scrollIntoViewIfNeeded();
 await expect(video.locator('iframe')).toHaveCount(0);
 await video.getByRole('button',{name:'Odtwórz film',exact:true}).click();await expect(video).toHaveAttribute('data-state','playing');
 expect(await page.evaluate(()=>({id:clipPlayer.o.videoId,start:clipPlayer.o.playerVars.start,end:clipPlayer.o.playerVars.end}))).toEqual({id:'PTCmEk8_ix4',start:40,end:55});
 await page.evaluate(()=>clipPlayer.time=54);await page.waitForTimeout(300);expect(await page.evaluate(()=>clipPlayer.time)).toBe(54);
 await page.evaluate(()=>clipPlayer.time=55);await expect.poll(()=>page.evaluate(()=>clipPlayer.time)).toBe(40);
 await video.getByRole('button',{name:'Wstrzymaj film',exact:true}).click();expect(await page.evaluate(()=>clipPlayer.paused)).toBeTruthy();
 await video.getByRole('button',{name:'Odtwórz film',exact:true}).click();expect(await page.evaluate(()=>clipPlayer.paused)).toBeFalsy();
 await page.locator('h1').scrollIntoViewIfNeeded();await expect.poll(()=>page.evaluate(()=>clipPlayer.paused)).toBeTruthy();
});
