import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,sep} from 'node:path';
import {deployHostido,hostidoConfig} from '../scripts/deploy-hostido.mjs';
const env={HOSTIDO_FTP_USERNAME:'test-user',HOSTIDO_FTP_PASSWORD:'test-password'};
test('Hostido requires explicit credentials and verified TLS',()=>{
 assert.throws(()=>hostidoConfig({}),/HOSTIDO_FTP_USERNAME/);
 const config=hostidoConfig(env);assert.equal(config.host,'host150631.hostido.net.pl');assert.equal(config.port,21);assert.equal(config.secure,true);assert.equal(config.secureOptions.rejectUnauthorized,true);
});
test('Hostido uploads only the built artifact, preserves remote files and publishes homepage last',async()=>{
 const root=await mkdtemp(resolve(tmpdir(),'portfolio-hostido-'));
 try{
  const expected=['index.html','src/app.mjs','public/cv/Patryk-Choinski-CV.pdf','public/cv/Patryk-Choinski-CV-EN.pdf','.nojekyll'];
  for(const file of expected){await mkdir(resolve(root,file,'..'),{recursive:true});await writeFile(resolve(root,file),'test');}
  const uploads=[],calls=[];
  const client={ftp:{},access:async config=>calls.push(config),cd:async path=>calls.push(path),ensureDir:async path=>calls.push(path),uploadFrom:async(local,remote)=>uploads.push({local,remote}),close:()=>calls.push('closed')};
  await deployHostido({directory:root,env,client});
  assert.deepEqual(uploads.map(f=>f.remote).sort(),expected.sort());assert.equal(uploads.at(-1).remote,'index.html');assert.ok(uploads.every(f=>f.local.startsWith(root+sep)));assert.equal(calls.at(-1),'closed');
  let closed=false;await assert.rejects(deployHostido({directory:root,env:{},client:{close:()=>closed=true}}),/Actions secrets/);assert.equal(closed,true);
 }finally{assert.ok(root.startsWith(resolve(tmpdir())+sep+'portfolio-hostido-'));await rm(root,{recursive:true,force:true});}
});
