import {profile} from './data.mjs';
const paths={
 linkedin:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7m0-10v.1M11 17v-7m0 3c0-4 6-4 6 0v4"/>',
 phone:'<path d="m7 3 3 5-2 2c1 3 3 5 6 6l2-2 5 3c-1 5-4 5-8 3A20 20 0 0 1 4 11C2 7 2 4 7 3Z"/>',
 github:'<path d="M9 21v-4c-4 1-5-2-5-2m13 6v-4c0-1-.4-2-1-2 4-.5 5-2.5 5-6 0-1.5-.5-2.5-1.5-3.5 0-1 .1-2-.5-3-2 0-3 1-4 1a14 14 0 0 0-6 0C8 2.5 7 2 5 2c-.6 1-.5 2-.5 3.5C3.5 6.5 3 7.5 3 9c0 3.5 1 5.5 5 6-.6.5-1 1-1 2v4"/>',
 email:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 6 9 7 9-7"/>'
};
export function initContactLinks(){
 if(document.querySelector('.header-contacts'))return;
 const brand=document.querySelector('header .brand');
 const group=document.createElement('div');group.className='header-identity';brand.before(group);group.append(brand);
 const contacts=[['linkedin','LinkedIn',profile.linkedin],['phone',`Telefon: ${profile.phone}`,'tel:'+profile.phone.replaceAll(' ','')],['github','GitHub',profile.github],['email',`E-mail: ${profile.email}`,'mailto:'+profile.email]];
 group.insertAdjacentHTML('beforeend',`<div class="header-contacts" role="group" aria-label="Kontakt">${contacts.map(([icon,label,url])=>`<a href="${url}" aria-label="${label}" title="${label}"${url.startsWith('https:')?' target="_blank" rel="noopener noreferrer"':''}><svg viewBox="0 0 24 24" aria-hidden="true">${paths[icon]}</svg></a>`).join('')}</div>`);
}
