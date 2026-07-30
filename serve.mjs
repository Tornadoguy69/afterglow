/* Static server for the site and the standalone visualisations.
 *
 *   node serve.mjs            → http://localhost:8899
 *   node serve.mjs 3000       → a different port
 *
 * Root REDIRECTS to /site/ rather than rewriting the path. Rewriting leaves the
 * browser thinking the base URL is "/", so every relative href in the page resolves
 * one directory too high and the stylesheet silently 404s.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.argv[2]) || 8899;

const TYPES = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8', '.md':'text/markdown; charset=utf-8',
  '.mp3':'audio/mpeg', '.wav':'audio/wav', '.png':'image/png', '.jpg':'image/jpeg',
  '.svg':'image/svg+xml', '.woff2':'font/woff2', '.mp4':'video/mp4'
};

http.createServer((req,res)=>{
  let url = decodeURIComponent(req.url.split('?')[0]);

  if(url === '/'){                                   // redirect, do not rewrite
    res.writeHead(302,{Location:'/site/'}); res.end(); return;
  }
  if(url.endsWith('/')) url += 'index.html';

  const file = path.join(ROOT, url);
  if(!file.startsWith(ROOT)){ res.writeHead(403); res.end('forbidden'); return; }

  fs.readFile(file,(err,data)=>{
    if(err){
      res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});
      res.end(`<meta charset="utf-8"><body style="font:14px system-ui;padding:40px">
        <h2>404</h2><p><code>${url}</code> not found.</p>
        <p><a href="/site/">← the site</a></p>`);
      return;
    }
    res.writeHead(200,{
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(data);
  });
}).listen(PORT, ()=>{
  console.log(`serving ${ROOT}`);
  console.log(`  site           http://localhost:${PORT}/site/`);
  console.log(`  dark matter    http://localhost:${PORT}/dark-matter-visualizations.html`);
});
