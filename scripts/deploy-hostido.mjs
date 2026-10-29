import {Client} from 'basic-ftp';
import {readdir,readFile} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
import {pathToFileURL} from 'node:url';
export function hostidoConfig(env=process.env){
 const user=env.HOSTIDO_FTP_USERNAME,password=env.HOSTIDO_FTP_PASSWORD;
 if(!user||!password)throw new Error('Add HOSTIDO_FTP_USERNAME and HOSTIDO_FTP_PASSWORD in repository Actions secrets. Use an FTP account restricted to the domain public_html directory.');
 return {host:'host150631.hostido.net.pl',port:21,user,password,secure:true,secureOptions:{rejectUnauthorized:true,minVersion:'TLSv1.2'}};
}
export async function deployHostido({directory='dist',env=process.env,client=new Client(60000)}={}){
 try{
  const config=hostidoConfig(env),root=resolve(directory);
  for(const file of ['index.html','src/app.mjs','public/cv/Patryk-Choinski-CV.pdf','public/cv/Patryk-Choinski-CV-EN.pdf'])await readFile(resolve(root,file));
  const files=await readdir(root,{recursive:true,withFileTypes:true});
  if(files.some(file=>file.isSymbolicLink()))throw new Error('Deployment artifact must not contain symbolic links.');
  const uploads=files.filter(file=>file.isFile()).map(file=>({local:resolve(file.parentPath,file.name),remote:relative(root,resolve(file.parentPath,file.name)).replaceAll('\\','/')}));
  // Upload entry HTML last, so it references assets already present on the server.
  uploads.sort((a,b)=>Number(a.remote==='index.html')-Number(b.remote==='index.html')||a.remote.localeCompare(b.remote));
  client.ftp.verbose=false;
  await client.access(config);await client.cd('/');
  const created=new Set();
  for(const file of uploads){
   const parts=file.remote.split('/');parts.pop();const folder=parts.join('/');
   if(folder&&!created.has(folder)){await client.ensureDir('/'+folder);await client.cd('/');created.add(folder);}
   await client.uploadFrom(file.local,file.remote);
  }
  console.log(`Uploaded ${uploads.length} files to patrykchoinski.eu over FTPS.`);
 }finally{client.close();}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 deployHostido().catch(()=>{console.error('Hostido deployment failed. Check Actions secrets, the FTP account directory, TLS certificate and connection. Credentials are not logged.');process.exitCode=1;});
}
