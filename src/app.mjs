import {initAnalytics} from './analytics.mjs';
import { profile, projects, skills, experience, applicationAreas, filterProjects, portrait, machines, technologyLogos, interactiveDemos, equipment, protocols, pipelineRuns } from './data.mjs';
import {initPipeline} from './pipeline-demo.mjs';
import {initScada} from './scada-demo.mjs';
const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let category = 'Wszystkie';
const categories = ['Wszystkie', ...new Set(projects.map(p=>p.category))];
const filters = document.querySelector('#filters');
filters.innerHTML = categories.map(c=>`<button type="button" aria-pressed="${c===category}" data-category="${escape(c)}">${escape(c)}</button>`).join('');
function render() {
 const list = filterProjects(category, document.querySelector('#search').value);
 document.querySelector('#result-count').textContent = `Liczba projektów: ${list.length}`;
 document.querySelector('#projects').innerHTML = list.length ? list.map(p=>{const photo=machines.find(m=>m.id===p.machine);return `<article class="project-card ${p.id==='plc-ci'?'pipeline-project':''}"><button class="project-art ${p.accent} ${photo?'has-photo':''}" data-project="${p.id}" aria-label="Szczegóły: ${escape(p.title)}">${photo?`<img src="${photo.src}" alt="${escape(photo.alt)}" loading="lazy">`:''}<span class="art-label">${escape(p.category.toUpperCase())}</span>${photo?'':`<span class="art-diagram" aria-hidden="true">${p.id==='plc-ci'?'[ RUN ]':'∿ ∿ ∿'}</span>`}<span class="art-caption">${escape(p.subtitle)}${photo?' · zdjęcie poglądowe':''}</span><span class="art-arrow">↗</span></button><div class="card-body"><p class="card-sector">${escape(p.sector)}</p><h3><button data-project="${p.id}">${escape(p.title)}</button></h3><p>${escape(p.description)}</p><div class="tags">${p.tags.map(t=>`<span>${escape(t)}</span>`).join('')}</div><span class="project-kind">${escape(p.kind)}</span>${photo?`<p class="photo-context">${escape(photo.description)}</p>`:''}</div>${p.id==='plc-ci'?'<div id="pipeline-demo"></div>':''}</article>`;}).join('') : '<p class="empty">Brak projektów dla tego wyszukiwania. Spróbuj innej technologii.</p>';
 initPipeline(document.querySelector('#pipeline-demo'),pipelineRuns);
}
filters.addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;category=button.dataset.category;filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();});
document.querySelector('#search').addEventListener('input',render);
const skillCard=(s,i)=>`<article class="skill"><span class="skill-number">${String(i+1).padStart(2,'0')}</span><h3>${escape(s.group)}</h3><p>${escape(s.description)}</p><div class="tags">${s.items.map(t=>`<span>${escape(t)}</span>`).join('')}</div><small>${escape(s.type)}</small></article>`;
document.querySelector('#skills').innerHTML=skills.filter(s=>s.area!=='support').map(skillCard).join('');
if(!document.querySelector('.support-area')) document.querySelector('#skills').insertAdjacentHTML('afterend',`<div class="support-area"><p class="eyebrow">KOMPETENCJE UZUPEŁNIAJĄCE</p><h3>IT jako wsparcie automatyki.</h3><p class="support-intro">Wizualizacja, integracje i automatyczne testy pomagają mi rozwijać aplikacje przemysłowe.</p><div id="support-skills" class="skills-grid">${skills.filter(s=>s.area==='support').map(skillCard).join('')}</div></div>`);
const dialog=document.querySelector('#project-dialog');
dialog.setAttribute('aria-label','Szczegóły projektu');
document.querySelector('#projects').addEventListener('click',e=>{const button=e.target.closest('[data-project]');if(!button)return;const p=projects.find(p=>p.id===button.dataset.project);document.querySelector('#project-detail').innerHTML=`<p class="eyebrow">${escape(p.category)} / ${escape(p.kind)}</p><h2>${escape(p.title)}</h2><p>${escape(p.sector)}</p><h3>Wyzwanie</h3><p>${escape(p.challenge)}</p><h3>Rozwiązanie</h3><p>${escape(p.solution)}</p><h3>Podstawa opisu</h3><p>${escape(p.evidence)}</p>${p.url?`<a class="text-link" href="${p.url}" target="_blank" rel="noopener noreferrer">Repozytorium projektu ↗</a>`:''}`;dialog.showModal();});
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.querySelector('#year').textContent=new Date().getFullYear();
const heroMachine=document.querySelector('.hero .machine');
heroMachine.classList.add('portrait-hero');
heroMachine.removeAttribute('role');
heroMachine.removeAttribute('aria-label');
heroMachine.innerHTML=`<img class="hero-portrait" src="${portrait.src}" alt="${escape(portrait.alt)}" width="460" height="460" fetchpriority="high"><div class="portrait-caption"><div><strong>${profile.name}</strong><span>Field Application Engineer</span></div><span class="live">PLC × HMI × MOTION</span></div>`;
const logoCard=logo=>`<div class="technology-logo"><img src="${logo.src}" alt="" width="36" height="36" loading="lazy"><span>${logo.name}</span></div>`;
if(!document.querySelector('.automation-logos')) document.querySelector('#kompetencje .section-head').insertAdjacentHTML('afterend',`<div class="technology-logos automation-logos" aria-label="Oprogramowanie automatyki">${technologyLogos.filter(l=>l.area==='automation').map(logoCard).join('')}</div>`);
if(!document.querySelector('.support-logos')) document.querySelector('.support-area').insertAdjacentHTML('beforeend',`<div class="technology-logos support-logos" aria-label="Narzędzia uzupełniające">${technologyLogos.filter(l=>l.area!=='automation').map(logoCard).join('')}</div>`);
if(!document.querySelector('#automatyka')) document.querySelector('#kompetencje').insertAdjacentHTML('beforebegin',`<section id="automatyka" class="section application-areas"><div class="section-head"><div><p class="eyebrow">GŁÓWNY OBSZAR PRACY</p><h2>Aplikacje dla przemysłu.</h2></div><p>PLC, HMI, motion, napędy i pneumatyka.<br>Doświadczenie w różnych typach maszyn.</p></div><div class="application-grid">${applicationAreas.map((area,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><h3>${area}</h3></div>`).join('')}</div></section>`);
if(!document.querySelector('.contact-details')) document.querySelector('#cv .actions').insertAdjacentHTML('afterend',`<p class="contact-details"><a href="mailto:${profile.email}">${profile.email}</a> &nbsp; / &nbsp; <a href="tel:+48696568545">${profile.phone}</a></p>`);
if(!document.querySelector('.experience-section')) document.querySelector('#cv').insertAdjacentHTML('beforebegin',`<section class="section experience-section"><div class="section-head"><div><p class="eyebrow">DOŚWIADCZENIE</p><h2>Praktyka inżynierska.</h2></div></div><div class="experience-grid">${experience.map(e=>`<article class="experience-item"><small>${escape(e.period)}</small><h3>${escape(e.role)}</h3><p class="card-sector">${escape(e.company)}</p><p>${escape(e.description)}</p></article>`).join('')}</div></section>`);
render();
if(!document.querySelector('#dema')) document.querySelector('#projekty').insertAdjacentHTML('beforebegin',`<section id="dema" class="section demo-section"><div class="section-head"><div><p class="eyebrow">APLIKACJE W DZIAŁANIU</p><h2>${interactiveDemos.visu.title}</h2></div><p>${interactiveDemos.visu.description}</p></div><video class="demo-video" src="${interactiveDemos.visu.video}" controls muted loop playsinline preload="metadata" aria-label="Animacja z aplikacji Visu3D — symulacja pracy maszyny"></video><div class="demo-links"><button type="button" id="load-simulator">Uruchom pełny symulator tutaj ↗</button><a class="text-link" href="${interactiveDemos.visu.url}" target="_blank" rel="noopener noreferrer">Otwórz aplikację w nowej karcie ↗</a></div><div id="simulator-slot"></div><div class="section-head"><div><p class="eyebrow">SCADA / DANE PROCESOWE</p><h2>${interactiveDemos.scada.title}</h2></div></div><p class="scada-intro">${interactiveDemos.scada.description}</p><div id="scada-demo"></div></section>`);
const video=document.querySelector('.demo-video');
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){video.autoplay=true;video.play().catch(()=>{});}
document.querySelector('#load-simulator').addEventListener('click',e=>{document.querySelector('#simulator-slot').innerHTML=`<iframe class="simulator-frame" src="${interactiveDemos.visu.url}" title="Interaktywny symulator Visu3D" loading="lazy" allow="fullscreen" referrerpolicy="no-referrer"></iframe>`;e.currentTarget.disabled=true;e.currentTarget.textContent='Symulator uruchomiony poniżej';});
initScada(document.querySelector('#scada-demo'));

if(!document.querySelector('.gallery-note')) document.querySelector('#projects').insertAdjacentHTML('afterend','<p class="gallery-note">Fotografie producentów pokazują typy maszyn i paneli. Nie stanowią potwierdzenia mojego udziału w realizacji konkretnego pokazanego egzemplarza. Logotypy technologii należą do ich właścicieli.</p>');

if(!document.querySelector('.equipment-strip')) document.querySelector('#automatyka').insertAdjacentHTML('beforeend',`<div class="equipment-strip" aria-label="Przykłady urządzeń automatyki">${equipment.map(e=>`<figure><img src="${e.src}" alt="${e.name}" loading="lazy"><figcaption>${e.name}</figcaption></figure>`).join('')}</div><div class="protocol-header"><p class="eyebrow">KOMUNIKACJA PRZEMYSŁOWA</p></div><div class="protocol-logos">${protocols.map(p=>`<div title="${p.use}"><img src="${p.src}" alt="${p.name}" loading="lazy">${p.variant?`<span>${p.variant}</span>`:' '}</div>`).join('')}</div>`);

initAnalytics();
