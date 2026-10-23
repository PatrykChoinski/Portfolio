let youtube;
export function loadYouTube(){
 if(window.YT?.Player)return Promise.resolve(window.YT);
 return youtube ||= new Promise((resolve,reject)=>{
  const script=document.createElement('script');
  const fail=()=>{youtube=undefined;script.remove();reject(new Error('Video unavailable'));};
  const timeout=setTimeout(fail,15000);
  window.onYouTubeIframeAPIReady=()=>{clearTimeout(timeout);resolve(window.YT);};
  script.src='https://www.youtube.com/iframe_api';script.onerror=()=>{clearTimeout(timeout);fail();};
  document.head.append(script);
 });
}

// Buffer near the viewport; the photograph overlay has its own exact one-second timer.
export function initMachinePreviews(root){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const disposers=[];
 for(const card of root.querySelectorAll('[data-machine-video]')){
  const art=card.querySelector('.project-art'),toggle=card.querySelector('.preview-toggle');
  let player,photoTimer,videoTimer,retryTimer,watchdog,visible=false,near=false,paused=reduced,disposed=false,loading=false,playing=false,phase='photo',remaining=15000,started=0;
  const active=()=>visible&&!paused&&!document.hidden&&!disposed;
  function stopClock(){if(started){remaining=Math.max(0,remaining-(performance.now()-started));started=0;}clearTimeout(videoTimer);}
  function clock(){if(active()&&phase==='video'&&playing&&!started){started=performance.now();videoTimer=setTimeout(cycle,remaining);}}
  function cycle(){
   stopClock();clearTimeout(photoTimer);remaining=15000;phase='photo';art.dataset.preview='photo';
   if(!active()){player?.pauseVideo();return;}
   if(player){player.seekTo(Number(card.dataset.videoStart),true);player.playVideo();}else prepare();
   photoTimer=setTimeout(()=>{if(active()){phase='video';art.dataset.preview='video';clock();}},1000);
  }
  function failed(){
   if(disposed)return;stopClock();clearTimeout(watchdog);player?.destroy();player=undefined;playing=false;loading=false;
   clearTimeout(retryTimer);retryTimer=setTimeout(()=>{if(near&&!paused&&!document.hidden)prepare();},5000);
  }
  async function prepare(){
   if(player||loading||disposed||!near||paused||document.hidden)return;loading=true;
   watchdog=setTimeout(failed,20000);
   try{
    const YT=await loadYouTube();
    if(disposed||!near||paused||document.hidden){loading=false;clearTimeout(watchdog);return;}
    const mount=document.createElement('span');art.append(mount);
    player=new YT.Player(mount,{
     host:'https://www.youtube-nocookie.com',videoId:card.dataset.machineVideo,
     playerVars:{autoplay:1,mute:1,controls:0,playsinline:1,rel:0,disablekb:1,start:Number(card.dataset.videoStart),origin:location.origin},
     events:{
      onReady:e=>{if(disposed)return;clearTimeout(watchdog);const frame=e.target.getIframe();frame.tabIndex=-1;frame.title='Film poglądowy: maszyna w działaniu';frame.setAttribute('aria-hidden','true');e.target.mute();e.target.playVideo();},
      onStateChange:e=>{
       if(disposed)return;
       if(e.data===1){clearTimeout(watchdog);playing=true;if(!active()){player.pauseVideo();return;}clock();}
       else if(e.data===0){playing=false;if(active())cycle();}
       else if(e.data===2||e.data===3){playing=false;stopClock();if(e.data===3)watchdog=setTimeout(failed,20000);}
      },onError:failed
     }
    });
   }catch{if(!disposed)failed();}
  }
  toggle.textContent=paused?'Uruchom animację':'Wstrzymaj animację';
  toggle.addEventListener('click',()=>{paused=!paused;toggle.textContent=paused?'Uruchom animację':'Wstrzymaj animację';cycle();if(!paused)prepare();});
  const preloader=new IntersectionObserver(entries=>{near=entries[0].isIntersecting;if(near)prepare();},{rootMargin:'600px',threshold:0});preloader.observe(art);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;cycle();},{threshold:.35});observer.observe(art);
  const visibility=()=>{cycle();if(!document.hidden)prepare();};document.addEventListener('visibilitychange',visibility);
  disposers.push(()=>{disposed=true;stopClock();clearTimeout(photoTimer);clearTimeout(retryTimer);clearTimeout(watchdog);observer.disconnect();preloader.disconnect();document.removeEventListener('visibilitychange',visibility);player?.destroy();});
 }
 return ()=>disposers.forEach(dispose=>dispose());
}
