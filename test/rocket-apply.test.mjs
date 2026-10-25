import {test} from 'node:test';
import assert from 'node:assert/strict';
import {rocketUrl,verifyRocketPage} from '../job-agent/rocket-apply.mjs';
const job={url:'https://rocketjobs.pl/oferta-pracy/plc-warszawa',title:'Programista PLC',company:'Firma testowa'};
function fixture({min=17000,latitude=52.23,title=job.title,company=job.company}={}){
 const posting={'@type':'JobPosting',title,hiringOrganization:{name:company},description:'PLC i HMI',jobLocation:{address:{addressLocality:'Warszawa'}}};
 const model={slug:'plc-warszawa',city:'Warszawa',latitude,longitude:21.01};
 return '<script type="application/ld+json">'+JSON.stringify(posting)+'</script><script>self.__next_f.push('+JSON.stringify([1,'1:'+JSON.stringify(model)+'\n'])+')</script>'+min+' - 22000 PLN Brutto miesięcznie - UoP';
}
test('Rocket application accepts only the explicit production HTTPS job origin',()=>{
 assert.equal(rocketUrl(job.url),job.url);
 for(const url of ['http://rocketjobs.pl/oferta-pracy/x','https://rocketjobs.pl:8443/oferta-pracy/x','https://rocketjobs.pl.evil.test/oferta-pracy/x','https://user:secret@rocketjobs.pl/oferta-pracy/x','https://rocketjobs.pl/profile'])assert.throws(()=>rocketUrl(url));
});
test('live Rocket verification blocks changed pay, geography, employer and title',()=>{
 assert.equal(verifyRocketPage(fixture(),job).assessment.eligible,true);
 for(const delta of [{min:14000},{latitude:50},{title:'Inne stanowisko'},{company:'Inna firma'}])assert.throws(()=>verifyRocketPage(fixture(delta),job));
 assert.throws(()=>verifyRocketPage(fixture().replace('Brutto miesięcznie - UoP','Netto miesięcznie - B2B'),job));
});
