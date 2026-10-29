import {loadYouTube} from './machine-previews.mjs';

export function initVideoExcerpt(root,clip){
 const button=root.querySelector('button');
 let player,ready=false,visible=false,requested=!matchMedia('(prefers-reduced-motion: reduce)').matches,loading=false;
 const end=clip.start+clip.duration;
 function range(){if(!ready)return;const time=player.getCurrentTime();if(time>=end||time<clip.start-.5)player.seekTo(clip.start,true);}
 async function start(){
  if(!visible||!requested||document.hidden)return;
  if(player){if(ready)player.playVideo();return;}
  if(loading)return;loading=true;root.dataset.state='loading';
  try{
   const YT=await loadYouTube();
   if(!visible||!requested||document.hidden){loading=false;return;}
   const mount=document.createElement('div');root.prepend(mount);
   player=new YT.Player(mount,{
    host:'https://www.youtube-nocookie.com',videoId:clip.youtubeId,
    playerVars:{autoplay:1,mute:1,controls:0,playsinline:1,rel:0,disablekb:1,start:clip.start,end,origin:location.origin},
    events:{
     onReady:e=>{ready=true;e.target.getIframe().title='Ruch maszyny w 3D — 15-sekundowy fragment';e.target.mute();if(visible&&requested&&!document.hidden)e.target.playVideo();else e.target.pauseVideo();},
     onStateChange:e=>{
      if(e.data===1){
       if(!visible||!requested||document.hidden){player.pauseVideo();return;}
       root.dataset.state='playing';button.textContent='Wstrzymaj film';root.dispatchEvent(new Event('play'));range();
      }else if(e.data===0&&visible&&requested&&!document.hidden){player.seekTo(clip.start,true);player.playVideo();}
     },
     onError:()=>{ready=false;root.dataset.state='error';button.textContent='Ponów odtwarzanie';player?.destroy();player=undefined;loading=false;}
    }
   });
  }catch{loading=false;root.dataset.state='error';button.textContent='Ponów odtwarzanie';}
 }
 function update(){if(visible&&requested&&!document.hidden)start();else{if(ready)player?.pauseVideo();root.dataset.state='paused';}}
 button.addEventListener('click',()=>{requested=root.dataset.state==='error'||!requested;button.textContent=requested?'Wstrzymaj film':'Odtwórz film';update();});
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();},{threshold:.25});observer.observe(root);
 document.addEventListener('visibilitychange',update);
 setInterval(()=>{if(player&&visible&&requested&&!document.hidden)range();},200);
}
