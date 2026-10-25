import {controlSystem as system} from './data.mjs';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function icon(kind){
 const body={
 hmi:'<rect x="12" y="12" width="96" height="58" rx="5"/><rect class="device-display" x="21" y="21" width="78" height="39" rx="2"/><path d="M30 49V37h12v12m9 0V29h12v20m9 0V39h12v10M47 79h26M60 70v9"/>',
 plc:'<rect x="12" y="14" width="42" height="64" rx="3"/><path d="M54 20h18v58H54m18-58h18v58H72m18-58h18v58H90M21 25h25M21 33h25M22 65h24"/><circle cx="26" cy="46" r="3" class="device-led"/><circle cx="39" cy="46" r="3"/><path d="M61 28v37m18-37v37m18-37v37"/>',
 temperature:'<rect x="25" y="12" width="70" height="67" rx="4"/><rect class="device-display" x="33" y="21" width="54" height="32" rx="2"/><path d="M40 44V30h10v14m8 0V30h10v14m8-14v14M38 65h9m9 0h9m9 0h9"/>',
 servo:'<rect x="35" y="8" width="50" height="72" rx="3"/><rect class="device-display" x="43" y="17" width="34" height="18" rx="2"/><path d="M44 44h32M44 51h32M44 58h32M44 65h32M47 80v6m26-6v6"/>',
 inverter:'<rect x="30" y="8" width="60" height="72" rx="3"/><rect class="device-display" x="39" y="17" width="42" height="20" rx="2"/><path d="M40 49h40M40 56h40M40 63h40M40 70h40"/><circle cx="46" cy="43" r="2" class="device-led"/>',
 valves:'<rect x="4" y="30" width="20" height="44" rx="2"/><path d="M24 23h88v51H24M41 23v51m18-51v51m18-51v51m18-51v51M24 42h88"/><circle cx="32" cy="58" r="4"/><circle cx="50" cy="58" r="4"/><circle cx="68" cy="58" r="4"/><circle cx="86" cy="58" r="4"/><circle cx="104" cy="58" r="4"/><path d="M12 39h4m-4 8h4m-4 8h4"/>'
 }[kind];
 return `<svg class="control-device-icon" viewBox="0 0 120 90" aria-hidden="true">${body}</svg>`;
}
export function initControlSystem(){
 let root=document.querySelector('#system-sterowania');
 if(!root){
 document.querySelector('#automatyka').insertAdjacentHTML('beforeend',`<div id="system-sterowania" class="control-section"><div class="section-head"><div><p class="eyebrow">ARCHITEKTURA AUTOMATYKI</p><h3 class="control-title">${system.title}</h3></div></div><div class="control-legend">${system.networks.map(n=>`<div data-network="${n.id}"><i aria-hidden="true"></i><strong>${n.label}</strong><span>${n.description}</span></div>`).join('')}</div><p class="control-hint">Wybierz urządzenie, aby poznać jego rolę w systemie.</p><div class="control-diagram" role="group" aria-label="Schemat systemu sterowania"><svg class="control-wires" viewBox="0 0 1120 530" aria-hidden="true"><g class="wire-ethernet"><path d="M270 105H400"/></g><g class="wire-ethercat"><path d="M530 175V250H105V330M175 410H205M345 410H375M515 410H575M755 410H800M930 410H960"/></g><g class="wire-modbus"><path d="M660 105H850"/></g><text x="305" y="91">Ethernet</text><text x="685" y="91">Modbus RTU / RS-485</text><text x="105" y="520" class="control-wire-note">SERWONAPĘDY + WYSPA ZAWOROWA</text><text x="825" y="520" class="control-wire-note">NAPĘDY SILNIKÓW</text></svg>${system.devices.map(d=>`<button type="button" class="control-device" data-device="${d.id}" data-network="${d.network}" aria-pressed="${d.id==='plc'}" aria-controls="control-detail" style="--x:${d.x/11.2}%;--y:${d.y/5.3}%;--w:${d.w/11.2}%;--h:${d.h/5.3}%"><span class="control-device-tag">${d.tag}</span>${icon(d.kind)}<strong>${d.name}</strong><span class="control-device-network">${d.network==='all'?'Ethernet / EtherCAT / Modbus':system.networks.find(n=>n.id===d.network).label}</span></button>`).join('')}</div><div id="control-detail" class="control-detail" aria-live="polite" aria-atomic="true"></div></div>`);
 root=document.querySelector('#system-sterowania');
 }
 const select=id=>{
 const device=system.devices.find(d=>d.id===id);
 root.querySelectorAll('[data-device]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.device===id)));
 root.querySelector('#control-detail').innerHTML=`<div><p class="eyebrow">${device.tag}</p><h3>${device.name}</h3></div><div><p>${device.description}</p>${device.source?`<a href="${escape(device.source)}" target="_blank" rel="noopener noreferrer">Interfejs EtherCAT EB80 — dokumentacja producenta ↗</a>`:''}</div>`;
 };
 root.querySelectorAll('[data-device]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.device)));
 select('plc');
}
