import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.webm':'video/webm','.pdf':'application/pdf','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
export function createStaticServer(directory='.'){
const root=resolve(directory);
return createServer(async(req,res)=>{
try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=resolve(root,`.${pathname}`);if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}if((await stat(file)).isDirectory())file=resolve(file,'index.html');const bytes=await readFile(file);const headers={'Content-Type':types[extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};if(req.headers.range){const match=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range);const start=match?Number(match[1]):-1,end=match&&match[2]?Math.min(Number(match[2]),bytes.length-1):bytes.length-1;if(start<0||start>=bytes.length||end<start){res.writeHead(416,{'Content-Range':`bytes */${bytes.length}`});res.end();return;}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${bytes.length}`,'Content-Length':end-start+1});res.end(bytes.subarray(start,end+1));return;}res.writeHead(200,{...headers,'Content-Length':bytes.length});res.end(bytes);}catch{res.writeHead(404);res.end('Nie znaleziono strony');}
});
}
export const server=createStaticServer(process.argv[2]||'.');
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
