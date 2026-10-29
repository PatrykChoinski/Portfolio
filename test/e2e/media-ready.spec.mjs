import {test,expect} from '@playwright/test';
test('video and machine previews wait for YouTube readiness before invoking playback methods',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 const stub=`window.pendingPlayers=[];window.releasePlayers=()=>{for(const {p,o}of pendingPlayers.splice(0)){p.time=o.playerVars.start;p.mute=()=>{};p.getCurrentTime=()=>p.time;p.seekTo=t=>p.time=t;p.playVideo=()=>o.events.onStateChange({data:1});p.pauseVideo=()=>{};o.events.onReady({target:p});}};window.YT={Player:class{constructor(mount,o){this.frame=document.createElement('iframe');mount.replaceWith(this.frame);this.getIframe=()=>this.frame;this.destroy=()=>this.frame.remove();pendingPlayers.push({p:this,o});}}};window.onYouTubeIframeAPIReady();`;
 await page.route('https://www.youtube.com/iframe_api',route=>route.fulfill({contentType:'text/javascript',body:stub}));
 await page.goto('/');const video=page.locator('.demo-video');await video.scrollIntoViewIfNeeded();await video.getByRole('button',{name:'Odtwórz film',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>window.pendingPlayers?.length)).toBe(1);
 await page.waitForTimeout(350);await page.locator('h1').scrollIntoViewIfNeeded();await video.scrollIntoViewIfNeeded();await video.getByRole('button',{name:'Wstrzymaj film',exact:true}).click();
 await page.evaluate(()=>releasePlayers());await video.getByRole('button',{name:'Odtwórz film',exact:true}).click();await expect(video).toHaveAttribute('data-state','playing');
 const card=page.locator('[data-machine-video]').first();await card.scrollIntoViewIfNeeded();await card.getByRole('button',{name:'Uruchom animację',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>pendingPlayers.length)).toBe(1);
 await page.locator('h1').scrollIntoViewIfNeeded();await card.scrollIntoViewIfNeeded();await card.getByRole('button',{name:'Wstrzymaj animację',exact:true}).click();await page.evaluate(()=>releasePlayers());
 await card.getByRole('button',{name:'Uruchom animację',exact:true}).click();expect(errors).toEqual([]);
});
