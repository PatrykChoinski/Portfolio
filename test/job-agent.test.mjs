import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalize,assess,distance,collect,applicationText} from '../job-agent/core.mjs';
import {portals,jobLinks,jobPostings,fromPosting,collectPortal,nextPage,grossEmploymentSalary,pageCoordinates} from '../job-agent/portals.mjs';
const raw={title:'Programista PLC',url:'https://example.com/jobs/1',latitude:52.23,longitude:21.01,salary:{min:15000,max:19000,currency:'PLN',basis:'gross',period:'month',contract:'employment'}};
test('explicit mandatory skills must be supported by CV, with exact technology aliases',()=>{
 assert.equal(assess(normalize({...raw,requiredSkills:['PLC','NodeJS','Modbus','ST']},'test')).eligible,true);
 const job=normalize({...raw,requiredSkills:['PLC','SolidWorks','Ansys','C++']},'test');
 assert.deepEqual(job.requiredSkills,['PLC','SolidWorks','Ansys','C++']);
 assert.equal(assess(job).eligible,false);assert.match(assess(job).reasons.join(' '),/SolidWorks, Ansys, C\+\+/);
 assert.equal(assess(normalize({...raw,requiredSkills:['Java']},'test')).eligible,false);
 assert.deepEqual(normalize({...raw,requiredSkills:[null,{},'PLC','PLC','  ']},'test').requiredSkills,['PLC']);
});
test('only confirmed salary and location qualify',()=>{
 assert.equal(assess(normalize(raw,'test')).eligible,true);
 for(const delta of [{salary:null},{latitude:undefined},{salary:{...raw.salary,basis:'net'}},{salary:{...raw.salary,contract:'b2b'}},{salary:{...raw.salary,min:14000}},{longitude:18},{title:'Accountant'}])assert.equal(assess(normalize({...raw,...delta},'test')).eligible,false);
 assert.equal(distance(undefined,21),null);
 assert.equal(distance(52.2297,21.0122),0);
});
test('application message respects the configured salary requirement',()=>{
 assert.match(applicationText(raw,{minimumSalary:20000}).replace(/\s/g,''),/20000PLNbrutto/);
});
test('tracking parameters do not create duplicates and unsafe URLs fail',()=>{
 assert.equal(normalize(raw,'a').id,normalize({...raw,url:raw.url+'?utm_source=x#top'},'b').id);
 assert.throws(()=>normalize({...raw,url:'javascript:alert(1)'},'test'));
});
test('Greenhouse collection preserves unknown salary and rejects unsupported sources',async()=>{
 const jobs=await collect({type:'greenhouse',board:'example'},async()=>({ok:true,json:async()=>({jobs:[{id:1,title:'PLC engineer',absolute_url:raw.url,location:{name:'Warsaw'},content:'HMI'}]})}));
 assert.equal(jobs[0].greenhouse.id,1);assert.equal(assess(jobs[0]).eligible,false);
 await assert.rejects(collect({type:'unknown'}));
 await assert.rejects(collect({type:'greenhouse',board:'../bad'}));
});
test('portal extraction accepts same-host job links and JSON-LD graphs only',()=>{
 const portal=portals.find(p=>p.id==='nofluffjobs');
 assert.deepEqual(jobLinks('<a href="/pl/job/engineer?utm_source=x">job</a><a href="https://evil.test/pl/job/engineer">x</a><a href="javascript:alert(1)">x</a><a href="/pl/job/engineer">same</a>',portal.search,portal),['https://nofluffjobs.com/pl/job/engineer']);
 const posting={'@type':'JobPosting',title:'PLC engineer',hiringOrganization:{name:'Firma z branży automatyki'},description:'<p>PLC &amp; HMI</p>',jobLocation:{address:{addressLocality:'Warszawa'}},baseSalary:{currency:'PLN',value:{value:22000,unitText:'Month'}}};
 const html='<script type="application/ld+json">'+JSON.stringify({'@graph':[posting]})+'</script><script type="application/ld+json">broken</script>';
 assert.equal(jobPostings(html).length,1);
 const job=normalize(fromPosting(posting,'https://nofluffjobs.com/pl/job/engineer'),'No Fluff Jobs');
 assert.equal(job.latitude,undefined);assert.equal(job.salary.min,null);assert.equal(job.salary.basis,'unknown');assert.equal(assess(job).eligible,false);assert.equal(job.description,'PLC & HMI');
});
test('portal scan reports individual failed details and explicit partial coverage',async()=>{
 const fetcher=async url=>({ok:!url.endsWith('/broken'),status:403,text:async()=>url.includes('/pl/job/')?'<script type="application/ld+json">{"@type":"JobPosting","title":"PLC engineer"}</script>':'<a href="/pl/job/one">one</a><a href="/pl/job/broken">broken</a>'});
 const result=await collectPortal('nofluffjobs',normalize,fetcher);
 assert.equal(result.jobs.length,1);assert.equal(result.failures.length,1);assert.match(result.coverage,/Część stron lub szczegółów/);assert.equal(result.pagesVisited,1);
 await assert.rejects(collectPortal('linkedin',normalize,fetcher));
});
test('pagination follows only observed next links in the selected search',async()=>{
 const portal=portals.find(p=>p.id==='rocketjobs');
 assert.equal(nextPage('<a rel="next" href="https://evil.test/next">Następna</a>',portal.search,portal),null);
 assert.equal(nextPage('<a rel="next" href="/profile">Następna</a>',portal.search,portal),null);
 const calls=[],first=portal.search,second=first+'?strona=2';
 const fetcher=async url=>{calls.push(url);return {ok:true,text:async()=>url===first?'<a href="/oferta-pracy/one">one</a><a href="?strona=2">Następna</a>':url===second?'<a href="/oferta-pracy/one">duplicate</a><a href="/oferta-pracy/two">two</a>':'<script type="application/ld+json">{"@type":"JobPosting","title":"PLC engineer"}</script>'};};
 const result=await collectPortal('rocketjobs',normalize,fetcher);
 assert.equal(result.jobs.length,2);assert.equal(result.pagesVisited,2);assert.equal(result.truncated,false);assert.equal(calls.filter(url=>url.endsWith('/one')).length,1);
 const capped=await collectPortal('rocketjobs',normalize,fetcher,{maxPages:1,maxDetails:1});assert.equal(capped.truncated,true);assert.equal(capped.pagesVisited,1);
});
test('failed later pages and dynamic load-more remain visibly incomplete',async()=>{
 const portal=portals.find(p=>p.id==='rocketjobs');
 const fetcher=async url=>({ok:!url.includes('strona=2'),status:503,text:async()=>url===portal.search?'<a href="/oferta-pracy/one">one</a><a rel="next" href="?strona=2">next</a>':'<script type="application/ld+json">{"@type":"JobPosting","title":"PLC engineer"}</script>'});
 const result=await collectPortal('rocketjobs',normalize,fetcher);assert.equal(result.jobs.length,1);assert.equal(result.truncated,true);assert.equal(result.failures.length,1);
 const dynamic=await collectPortal('rocketjobs',normalize,async url=>({ok:true,text:async()=>url===portal.search?'<a href="/oferta-pracy/one">one</a><button>Pokaż kolejne oferty</button>':'<script type="application/ld+json">{"@type":"JobPosting","title":"PLC engineer"}</script>'}));assert.equal(dynamic.truncated,true);
});
test('gross UoP extraction distinguishes B2B, ambiguity and recommended jobs',()=>{
 const salary=grossEmploymentSalary('<div>20 000 - 26 000 PLN Netto miesięcznie - B2B</div><div>17 000 - 22 000 PLN Brutto miesięcznie - UoP</div>');
 assert.equal(salary.min,17000);assert.equal(salary.max,22000);assert.equal(salary.basis,'gross');
 assert.equal(grossEmploymentSalary('20 000 - 26 000 PLN Netto miesięcznie - B2B'),null);
 assert.equal(grossEmploymentSalary('17 000 - 22 000 PLN Brutto miesięcznie - UoP 19 000 - 24 000 PLN Brutto miesięcznie - UoP'),null);
 assert.equal(grossEmploymentSalary('Wynagrodzenie nieujawnione Podobne oferty 17 000 - 22 000 PLN Brutto miesięcznie - UoP'),null);
});
test('Aplikuj salary requires adjacent monthly gross and employment labels',()=>{
 assert.equal(grossEmploymentSalary('Wynagrodzenie 20 000 do 22 500 zł brutto / mies. Umowa o pracę').min,20000);
 for(const text of ['Wynagrodzenie 20 000 do 22 500 zł netto / mies. Umowa o pracę','Wynagrodzenie 20 000 do 22 500 zł brutto / rok Umowa o pracę','Wynagrodzenie 20 000 do 22 500 zł brutto / mies. B2B','Wynagrodzenie do 22 500 zł brutto / mies. Umowa o pracę','Podobne oferty pracy Wynagrodzenie 20 000 do 22 500 zł brutto / mies. Umowa o pracę'])assert.equal(grossEmploymentSalary(text),null);
 assert.equal(grossEmploymentSalary('Wynagrodzenie 20 000 do 22 500 zł brutto / mies. Umowa o pracę Wynagrodzenie 15 000 do 18 000 zł brutto / mies. Umowa o pracę'),null);
});
test('coordinates belong to the exact job slug and city, never a recommendation',()=>{
 const url='https://rocketjobs.pl/oferta-pracy/plc-warszawa';
 const page=value=>'<script>self.__next_f.push('+JSON.stringify([1,'1:'+JSON.stringify(value)+'\n'])+')</script>';
 const job={slug:'plc-warszawa',city:'Warszawa',latitude:52.227611,longitude:20.8810679};
 assert.equal(pageCoordinates(page({offer:job,recommended:[{...job,slug:'another',latitude:51}]}),url,'Warszawa').latitude,52.227611);
 assert.equal(pageCoordinates(page({offer:job}),url,'Gdańsk'),null);
 assert.equal(pageCoordinates(page({offer:{...job,slug:'another'}}),url,'Warszawa'),null);
 assert.equal(pageCoordinates(page({offers:[job,{...job,latitude:53}]}),url,'Warszawa'),null);
 assert.equal(pageCoordinates('<script>throw Error("must never execute")</script>',url,'Warszawa'),null);
 const prefix='Opis z polskimi znakami: ąęł\nTekst bez końca wiersza';
 const stream='2:T'+Buffer.byteLength(prefix).toString(16)+','+prefix+'3:'+JSON.stringify({offer:job})+'\n';
 assert.equal(pageCoordinates('<script>self.__next_f.push('+JSON.stringify([1,stream])+')</script>',url,'Warszawa').latitude,52.227611);
});
test('expired jobs and stale manual verifications never qualify automatically',()=>{
 assert.equal(assess(normalize({...raw,validThrough:'2020-01-01'},'test')).eligible,false);
 assert.equal(assess({...normalize(raw,'test'),verification:{at:new Date().toISOString(),stale:true}}).eligible,false);
 assert.equal(assess({...normalize(raw,'test'),verification:{at:'2020-01-01'}}).eligible,false);
 assert.equal(assess(normalize({...raw,title:'Motion Designer',description:'Marketing, motion design'},'test')).eligible,false);
 assert.equal(assess(normalize({...raw,title:'Specjalista automatyzacji',description:'Automatyzacja procesów finansowych'},'test')).eligible,false);
});
test('No Fluff salary and coordinates exclude recommendations and mismatched locations',()=>{
 const url='https://nofluffjobs.com/pl/job/plc-engineer';
 const posting={postingUrl:'plc-engineer',location:{places:[{url:'plc-engineer',city:'Warszawa',geoLocation:{latitude:52.23,longitude:21.01}}]}};
 const page=value=>'<script id="serverApp-state" type="application/json">'+JSON.stringify(value)+'</script>';
 const state={'/posting/plc-engineer?region=pl':posting,'/similar':{latitude:51,longitude:19}};
 assert.equal(pageCoordinates(page(state),url,'Warszawa').latitude,52.23);
 assert.equal(pageCoordinates(page(state),url,'Gdańsk'),null);
 assert.equal(pageCoordinates(page({'/posting/other?region=pl':posting}),url,'Warszawa'),null);
 posting.location.places.push({...posting.location.places[0],geoLocation:{latitude:53,longitude:21}});
 assert.equal(pageCoordinates(page(state),url,'Warszawa'),null);
 assert.equal(grossEmploymentSalary('18 000 – 22 000 PLN brutto miesięcznie (UoP)').min,18000);
 assert.equal(grossEmploymentSalary('18 000 – 22 000 PLN netto miesięcznie (B2B)'),null);
});
test('No Fluff collection carries employer mandatory skills into eligibility assessment',async()=>{
 const url='https://nofluffjobs.com/pl/job/plc-engineer',company='Firma z branży automatyki';
 const posting={'@type':'JobPosting',title:'Inżynier automatyki',hiringOrganization:{name:company},jobLocation:{address:{addressLocality:'Warszawa'}},description:'PLC SCADA'};
 const details={postingUrl:'plc-engineer',title:posting.title,company:{name:company},requirements:{description:'Obowiązkowe narzędzia projektowe',musts:[{value:'PLC'},{value:'SolidWorks'}]},location:{places:[{url:'plc-engineer',city:'Warszawa',geoLocation:{latitude:52.23,longitude:21.01}}]}};
 const html='<script type="application/ld+json">'+JSON.stringify(posting)+'</script><script id="serverApp-state" type="application/json">'+JSON.stringify({'/posting/plc-engineer?region=pl':details})+'</script>18 000 – 22 000 PLN brutto miesięcznie (UoP)';
 const result=await collectPortal('nofluffjobs',normalize,async address=>({ok:true,text:async()=>address===url?html:'<a href="'+url+'">Oferta</a>'}));
 const job=result.jobs[0];assert.equal(job.salary.min,18000);assert.equal(job.latitude,52.23);assert.deepEqual(job.requiredSkills,['PLC','SolidWorks']);assert.match(job.description,/Obowiązkowe narzędzia/);assert.equal(assess(job).eligible,false);
});
