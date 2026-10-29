import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
test('published simulator is offline-only and excludes server files and original CNC programs',async()=>{
 const base='public/apps/simulator',config=JSON.parse(await readFile(base+'/config.json','utf8'));
 assert.equal(config.static,true);assert.equal(config.plc,false);assert.deepEqual(config.variables,{});
 for(const key of ['endpoint','password','username','nodePrefix','authFile','connectionFile'])assert.equal(Object.hasOwn(config,key),false);
 const files=await readdir(base,{recursive:true});assert.ok(files.includes('app.js'));assert.ok(files.includes('index.html'));
 assert.ok(files.every(file=>!/(?:\.nc|\.map|\.project|\.library)$|(?:^|\/)server\//i.test(file)));
 const html=await readFile(base+'/index.html','utf8');assert.doesNotMatch(html,/Promasz|192\.168\./i);
});
test('Apache deployment explicitly serves ES modules as JavaScript',async()=>{
 assert.match(await readFile('hosting/.htaccess','utf8'),/AddType text\/javascript \.js \.mjs/);
});
