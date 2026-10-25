import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalize,assess,distance,collect} from '../job-agent/core.mjs';
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
