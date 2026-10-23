import { profile, projects, skills, experience, filterProjects } from './data.mjs';
const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let category = 'Wszystkie';
const categories = ['Wszystkie', ...new Set(projects.map(p=>p.category))];
const filters = document.querySelector('#filters');
filters.innerHTML = categories.map(c=>`<button type="button" aria-pressed="${c===category}" data-category="${escape(c)}">${escape(c)}</button>`).join('');
function render() {
 const list = filterProjects(category, document.querySelector('#search').value);
 document.querySelector('#result-count').textContent = `Liczba projektów: ${list.length}`;
 document.querySelector('#projects').innerHTML = list.length ? list.map(p=>`<article class="project-card"><button class="project-art ${p.accent}" data-project="${p.id}" aria-label="Szczegóły: ${escape(p.title)}"><span class="art-label">${escape(p.category.toUpperCase())}</span><span class="art-diagram" aria-hidden="true">${p.id==='digital-twin'?'◇':p.id==='plc-ci'?'[ RUN ]':p.id==='energy'?'▁▃▂▅▄▇':'∿ ∿ ∿'}</span><span class="art-caption">${escape(p.subtitle)}</span><span class="art-arrow">↗</span></button><div class="card-body"><p class="card-sector">${escape(p.sector)}</p><h3><button data-project="${p.id}">${escape(p.title)}</button></h3><p>${escape(p.description)}</p><div class="tags">${p.tags.map(t=>`<span>${escape(t)}</span>`).join('')}</div><span class="project-kind">${escape(p.kind)}</span></div></article>`).join('') : '<p class="empty">Brak projektów dla tego wyszukiwania. Spróbuj innej technologii.</p>';
}
filters.addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;category=button.dataset.category;filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();});
document.querySelector('#search').addEventListener('input',render);
document.querySelector('#skills').innerHTML=skills.map((s,i)=>`<article class="skill"><span class="skill-number">0${i+1}</span><h3>${escape(s.group)}</h3><p>${escape(s.description)}</p><div class="tags">${s.items.map(t=>`<span>${escape(t)}</span>`).join('')}</div><small>${escape(s.type)}</small></article>`).join('');
const dialog=document.querySelector('#project-dialog');
document.querySelector('#projects').addEventListener('click',e=>{const button=e.target.closest('[data-project]');if(!button)return;const p=projects.find(p=>p.id===button.dataset.project);document.querySelector('#project-detail').innerHTML=`<p class="eyebrow">${escape(p.category)} / ${escape(p.kind)}</p><h2>${escape(p.title)}</h2><p>${escape(p.sector)}</p><h3>Wyzwanie</h3><p>${escape(p.challenge)}</p><h3>Rozwiązanie</h3><p>${escape(p.solution)}</p><h3>Podstawa opisu</h3><p>${escape(p.evidence)}</p>${p.url?`<a class="text-link" href="${p.url}" target="_blank" rel="noopener noreferrer">Repozytorium projektu ↗</a>`:''}`;dialog.showModal();});
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelector('#cv .actions').insertAdjacentHTML('afterend',`<p class="contact-details"><a href="mailto:${profile.email}">${profile.email}</a> &nbsp; / &nbsp; <a href="tel:+48696568545">${profile.phone}</a></p>`);
document.querySelector('#cv').insertAdjacentHTML('beforebegin',`<section class="section experience-section"><div class="section-head"><div><p class="eyebrow">DOŚWIADCZENIE</p><h2>Praktyka inżynierska.</h2></div></div><div class="experience-grid">${experience.map(e=>`<article class="experience-item"><small>${escape(e.period)}</small><h3>${escape(e.role)}</h3><p class="card-sector">${escape(e.company)}</p><p>${escape(e.description)}</p></article>`).join('')}</div></section>`);
render();
