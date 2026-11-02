import test from 'node:test';
import assert from 'node:assert/strict';
import {adsEnabled} from '../src/ads.mjs';
import {advertising} from '../src/data.mjs';
test('AdSense stays off until CMP publication and accepts only the approved origin',()=>{
 const production={origin:advertising.origin};
 assert.equal(adsEnabled(advertising,production),false);
 const ready={...advertising,enabled:true,consentMessagePublished:true};
 assert.equal(adsEnabled(ready,production),true);
 for(const origin of ['http://localhost:4173','https://patrykchoinski.github.io','https://patrykchoinski.eu.example.com'])assert.equal(adsEnabled(ready,{origin}),false);
 assert.equal(adsEnabled({...ready,publisherId:'invalid'},production),false);
 assert.equal(adsEnabled({...ready,consentMessagePublished:false},production),false);
});
