import {interactiveDemos} from './data.mjs';
export function sampleSignal(key,t,batch=1){
 const p=t/90,offset=batch===2?3:0;
 const running=t>=12&&t<78;
 const heat=24+offset+58*Math.sin(Math.min(p,0.85)*Math.PI/2);
 switch(key){
  case 'mixer':return heat+2*Math.sin(t/8);
  case 'flap':return heat*.88+3;
  case 'gear':return 26+offset+23*p;
  case 'motor':return 30+offset+34*p;
  case 'bearing-l':return 25+offset+18*p;
  case 'bearing-r':return 25+offset+20*p;
  case 'oil':return 27+offset+19*p;
  case 'speed':return running?Math.min(105+offset,Math.max(0,(t-12)*20))+5*Math.sin(t/4):0;
  case 'current':return running?32+offset+8*Math.sin(t/6):3;
  case 'stamp':return t<18?0:t<76?85:0;
  case 'drain':return t>=78?100:0;
  case 'inlet':return t>=3&&t<12?100:0;
  default:throw new Error('Unknown signal');
 }
}
export function initScada(root){
 const signals=interactiveDemos.scada.signals;
 const selected=new Set(['mixer','speed','current','stamp']);
 let mode='compare',cursor=45;
 root.innerHTML=`<div class="scada-toolbar"><label>Przebiegi <select id="scada-batch"><option value="compare">Porównaj cykl A i B</option><option value="1">Cykl A</option><option value="2">Cykl B</option></select></label><button id="scada-reset" type="button">Przywróć widok</button><button id="scada-export" type="button">Eksport CSV ↓</button><span class="demo-badge">DANE DEMONSTRACYJNE</span></div><fieldset class="scada-signals"><legend>Sygnały na wykresach</legend>${signals.map(s=>`<label><input type="checkbox" value="${s.key}" ${selected.has(s.key)?'checked':''}><span style="--signal:${s.color}"></span>${s.name}</label>`).join('')}</fieldset><div class="scada-charts"></div><div class="scada-steps" aria-label="Etapy demonstracyjnego cyklu"><span>Napełnianie</span><span>Mieszanie</span><span>Wyładunek</span></div><label class="scada-cursor">Kursor czasu <input id="scada-cursor" type="range" min="0" max="90" value="45"><output id="scada-time">45 s</output></label><div class="scada-values" aria-live="polite"></div><p class="scada-caption">Linia ciągła: cykl A. Linia przerywana: cykl B. Wartości wygenerowane na potrzeby portfolio; nie są danymi produkcyjnymi.</p>`;
 const axes=[{id:'temp',name:'Temperatury',unit:'°C',max:120},{id:'vel',name:'Prędkość obrotowa',unit:'RPM',max:150},{id:'cur',name:'Prąd silnika',unit:'A',max:80},{id:'stamp',name:'Stempel i klapy',unit:'%',max:100}];
 const batches=()=>mode==='compare'?[1,2]:[Number(mode)];
 const point=(t,v,max)=>[48+t/90*530,177-v/max*145];
 function values(){
  root.querySelector('#scada-time').value=`${cursor} s`;
  root.querySelector('.scada-values').innerHTML=signals.filter(s=>selected.has(s.key)).map(s=>`<div><span>${s.name}</span><strong>${batches().map(b=>`${b===1?'A':'B'}: ${sampleSignal(s.key,cursor,b).toFixed(1)} ${s.unit}`).join(' · ')}</strong></div>`).join('')||'<p>Wybierz sygnały, aby zobaczyć przebiegi.</p>';
 }
 function draw(){
  root.querySelector('.scada-charts').innerHTML=axes.map(axis=>{
   const visible=signals.filter(s=>s.axis===axis.id&&selected.has(s.key));
   const lines=visible.flatMap(s=>batches().map(b=>`<path class="scada-series" data-signal="${s.key}" data-batch="${b}" d="${Array.from({length:91},(_,t)=>{const [x,y]=point(t,sampleSignal(s.key,t,b),axis.max);return `${t?'L':'M'}${x.toFixed(1)},${y.toFixed(1)}`}).join(' ')}" fill="none" stroke="${s.color}" stroke-width="2.5" ${b===2?'stroke-dasharray="7 5"':''}/>`)).join('');
   return `<div class="scada-plot"><h4>${axis.name} <span>${axis.unit}</span></h4><svg viewBox="0 0 600 210" role="img" aria-label="${axis.name} — demonstracyjne przebiegi cyklu">${[0,.25,.5,.75,1].map(f=>`<line x1="48" x2="578" y1="${177-f*145}" y2="${177-f*145}" stroke="#dbe3e1"/><text x="40" y="${181-f*145}" text-anchor="end">${axis.max*f}</text>`).join('')}${[0,30,60,90].map(t=>`<text x="${48+t/90*530}" y="199" text-anchor="middle">${t} s</text>`).join('')}${lines}<line class="cursor-line" x1="${point(cursor,0,1)[0]}" x2="${point(cursor,0,1)[0]}" y1="30" y2="177" stroke="#455f56" stroke-dasharray="3 3"/>${visible.length?'':'<text x="300" y="100" text-anchor="middle">Wybierz sygnał z tej grupy</text>'}</svg></div>`;
  }).join('');
  values();
 }
 root.querySelectorAll('.scada-signals input').forEach(input=>input.addEventListener('change',()=>{input.checked?selected.add(input.value):selected.delete(input.value);draw();}));
 root.querySelector('#scada-batch').addEventListener('change',e=>{mode=e.target.value;draw();});
 root.querySelector('#scada-cursor').addEventListener('input',e=>{cursor=Number(e.target.value);root.querySelectorAll('.cursor-line').forEach(line=>{line.setAttribute('x1',point(cursor,0,1)[0]);line.setAttribute('x2',point(cursor,0,1)[0]);});values();});
 root.querySelector('#scada-reset').addEventListener('click',()=>{selected.clear();['mixer','speed','current','stamp'].forEach(k=>selected.add(k));mode='compare';cursor=45;root.querySelector('#scada-batch').value=mode;root.querySelector('#scada-cursor').value=cursor;root.querySelectorAll('.scada-signals input').forEach(i=>i.checked=selected.has(i.value));draw();});
 root.querySelector('#scada-export').addEventListener('click',()=>{const chosen=signals.filter(s=>selected.has(s.key));const rows=[['Cykl','Czas_s',...chosen.map(s=>`${s.name} [${s.unit}]`)]];for(const b of batches())for(let t=0;t<=90;t++)rows.push([b,t,...chosen.map(s=>sampleSignal(s.key,t,b).toFixed(2))]);const url=URL.createObjectURL(new Blob(['\uFEFF'+rows.map(r=>r.join(';')).join('\n')],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='scada-dane-demonstracyjne.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 draw();
}
