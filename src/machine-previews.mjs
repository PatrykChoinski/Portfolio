let youtube;
function loadYouTube(){
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

// Each visible card repeats two seconds of the photograph, then ten seconds of playback.
export function initMachinePreviews(root){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const disposers=[];
 for(const card of root.querySelectorAll('[data-machine-video]')){
  const art=card.querySelector('.project-art'),toggle=card.querySelector('.preview-toggle');
  let player,timer,watchdog,visible=false,paused=reduced,disposed=false,phase='photo';
  const state=value=>{phase=value;art.dataset.preview=value;};
  function clear(){clearTimeout(timer);clearTimeout(watchdog);}
  function photo(){clear();state('photo');player?.pauseVideo();}
  function schedule(){
   photo();
   if(visible&&!paused&&!document.hidden)timer=setTimeout(start,2000);
  }
  function failed(){if(disposed)return;photo();paused=true;toggle.textContent='Ponów podgląd filmu';}
  async function start(){
   if(disposed||!visible||paused||document.hidden)return;
   state('loading');watchdog=setTimeout(failed,15000);
   try{
    if(player){player.seekTo(Number(card.dataset.videoStart),true);player.playVideo();return;}
    const YT=await loadYouTube();
    if(disposed||!visible||paused||document.hidden){photo();return;}
    const mount=document.createElement('span');art.append(mount);
    player=new YT.Player(mount,{
     host:'https://www.youtube-nocookie.com',videoId:card.dataset.machineVideo,
     playerVars:{autoplay:1,mute:1,controls:0,playsinline:1,rel:0,disablekb:1,start:Number(card.dataset.videoStart),origin:location.origin},
     events:{
      onReady:e=>{if(disposed)return;const frame=e.target.getIframe();frame.tabIndex=-1;frame.title='Film poglądowy: maszyna w działaniu';frame.setAttribute('aria-hidden','true');e.target.mute();if(visible&&!paused&&!document.hidden)e.target.playVideo();else photo();},
      onStateChange:e=>{
       if(disposed)return;
       if(e.data===1){
        if(!visible||paused||document.hidden){photo();return;}
        clear();state('video');timer=setTimeout(schedule,10000);
       }else if(e.data===0)schedule();
       else if(e.data===3){clearTimeout(timer);state('loading');watchdog=setTimeout(failed,15000);}
      },onError:failed
     }
    });
   }catch{if(!disposed)failed();}
  }
  toggle.textContent=paused?'Uruchom podgląd filmu':'Wstrzymaj podgląd';
  toggle.addEventListener('click',()=>{paused=!paused;toggle.textContent=paused?'Uruchom podgląd filmu':'Wstrzymaj podgląd';schedule();});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.35});
  observer.observe(art);
  const visibility=()=>schedule();document.addEventListener('visibilitychange',visibility);
  disposers.push(()=>{disposed=true;clear();observer.disconnect();document.removeEventListener('visibilitychange',visibility);player?.destroy();});
 }
 return ()=>disposers.forEach(dispose=>dispose());
}
