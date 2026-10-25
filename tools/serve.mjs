import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('portfolio_celina_khennache1.io');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
  let filename;
  try{filename=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));}catch{res.writeHead(400).end();return;}
  if(filename!==root&&!filename.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  if(fs.existsSync(filename)&&fs.statSync(filename).isDirectory())filename=path.join(filename,'index.html');
  if(!fs.existsSync(filename)||!fs.statSync(filename).isFile()){res.writeHead(404).end('Fichier introuvable');return;}
  const size=fs.statSync(filename).size;
  const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  const headers={'Content-Type':types[path.extname(filename)]||'application/octet-stream','Accept-Ranges':'bytes'};
  if(range){const start=Number(range[1]);const end=range[2]?Math.min(Number(range[2]),size-1):size-1;if(start>end||start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return;}res.writeHead(206,{...headers,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${size}`});fs.createReadStream(filename,{start,end}).pipe(res);}
  else{res.writeHead(200,{...headers,'Content-Length':size});fs.createReadStream(filename).pipe(res);}
});
server.listen(4173,'127.0.0.1',()=>console.log('Portfolio : http://localhost:4173'));
