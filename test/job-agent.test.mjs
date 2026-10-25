import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalize,assess,distance,collect} from '../job-agent/core.mjs';
import {portals,jobLinks,jobPostings,fromPosting,collectPortal} from '../job-agent/portals.mjs';
const raw={title:'Programista PLC',url:'https://example.com/jobs/1',latitude:52.23,longitude:21.01,salary:{min:15000,max:19000,currency:'PLN',basis:'gross',period:'month',contract:'employment'}};
test('only confirmed salary and location qualify',()=>{
 assert.equal(assess(normalize(raw,'test')).eligible,true);
 for(const delta of [{salary:null},{latitude:undefined},{salary:{...raw.salary,basis:'net'}},{salary:{...raw.salary,contract:'b2b'}},{salary:{...raw.salary,min:14000}},{longitude:18},{title:'Accountant'}])assert.equal(assess(normalize({...raw,...delta},'test')).eligible,false);
 assert.equal(distance(undefined,21),null);
 assert.equal(distance(52.2297,21.0122),0);
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
 assert.equal(result.jobs.length,1);assert.equal(result.failures.length,1);assert.match(result.coverage,/Pierwsza strona/);
 await assert.rejects(collectPortal('linkedin',normalize,fetcher));
});
test('expired jobs and stale manual verifications never qualify automatically',()=>{
 assert.equal(assess(normalize({...raw,validThrough:'2020-01-01'},'test')).eligible,false);
 assert.equal(assess({...normalize(raw,'test'),verification:{at:new Date().toISOString(),stale:true}}).eligible,false);
 assert.equal(assess({...normalize(raw,'test'),verification:{at:'2020-01-01'}}).eligible,false);
 assert.equal(assess(normalize({...raw,title:'Motion Designer',description:'Marketing, motion design'},'test')).eligible,false);
 assert.equal(assess(normalize({...raw,title:'Specjalista automatyzacji',description:'Automatyzacja procesów finansowych'},'test')).eligible,false);
});
