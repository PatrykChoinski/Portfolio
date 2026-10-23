const labels={'Checkout':'Pobranie kodu','Compile project':'Kompilacja PLC','Deploy application to runtime (login, download, start)':'Wdrożenie do runtime','Run smoke test':'Test aplikacji','Write consolidated report':'Raport końcowy'};
const status={success:'Zakończono',failure:'Błąd',skipped:'Pominięto',pending:'Oczekuje',running:'W toku'};
let cancelPrevious=()=>{};
export function initPipeline(root,runs){
 cancelPrevious();if(!root)return;
 let timer,position=Infinity;
 cancelPrevious=()=>clearInterval(timer);
 root.innerHTML=`<div class="pipeline-toolbar"><label>Przebieg <select id="pipeline-run">${runs.map((r,i)=>`<option value="${i}">#${r.number} · ${r.date.slice(0,10)} · ${r.result==='success'?'udany':'błąd kompilacji'}</option>`).join('')}</select></label><button id="pipeline-play" type="button">Odtwórz Actions ▶</button></div><p class="pipeline-note">Odtworzenie wybranych etapów rzeczywistego przebiegu GitHub Actions w skróconym czasie. Nie uruchamia sterownika ani nowego zadania.</p><ol class="pipeline-steps"></ol><p id="pipeline-result" role="status"></p><a class="text-link pipeline-source" target="_blank" rel="noopener noreferrer">Zobacz przebieg w GitHub Actions ↗</a>`;
 const select=root.querySelector('select'),button=root.querySelector('button');
 function render(){const run=runs[Number(select.value)];root.querySelector('.pipeline-source').href=run.url;root.querySelector('.pipeline-steps').innerHTML=run.steps.map((step,i)=>{const state=i<position?step.result:i===position?'running':'pending';return `<li data-state="${state}"><span class="pipeline-status" aria-hidden="true">${state==='success'?'✓':state==='failure'?'×':state==='running'?'↻':state==='skipped'?'−':'○'}</span><span>${labels[step.name]}<small>${status[state]}</small></span><time>${i<position?step.seconds+' s':'—'}</time></li>`;}).join('');root.querySelector('#pipeline-result').textContent=position<run.steps.length?'Odtwarzanie przebiegu…':run.result==='success'?'Kompilacja, wdrożenie i test zakończone powodzeniem.':'Błąd kompilacji — wdrożenie i test zostały pominięte.';}
 select.addEventListener('change',()=>{clearInterval(timer);position=Infinity;button.textContent='Odtwórz Actions ▶';render();});
 button.addEventListener('click',()=>{clearInterval(timer);position=0;render();button.textContent='Odtwórz ponownie ↻';if(matchMedia('(prefers-reduced-motion: reduce)').matches){position=Infinity;render();return;}timer=setInterval(()=>{position++;render();if(position>=runs[Number(select.value)].steps.length)clearInterval(timer);},850);});
 render();
}
