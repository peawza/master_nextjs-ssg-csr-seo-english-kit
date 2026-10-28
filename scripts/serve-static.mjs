import { createServer } from 'node:http';
import { gzipSync } from 'node:zlib';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('out');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.txt':'text/plain', '.xml':'application/xml', '.webp':'image/webp', '.avif':'image/avif', '.ttf':'font/ttf', '.woff2':'font/woff2', '.ico':'image/x-icon', '.svg':'image/svg+xml' };
const port = Number(process.env.PORT || 4173);
const server = createServer(async (request, response) => {
 try {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  let file = resolve(root, `.${pathname}`);
  if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403).end(); return; }
  if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
  const body = await readFile(file);
  const compressed = /\.(html|css|js|json|txt|xml|svg)$/.test(file) && /\bgzip\b/.test(request.headers['accept-encoding'] || '');
  response.writeHead(200, { ...(compressed ? { 'Content-Encoding':'gzip', 'Vary':'Accept-Encoding' } : {}), 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'X-Content-Type-Options':'nosniff', 'X-Robots-Tag':'noindex, follow', 'Cache-Control': /\.(avif|webp|ttf|woff2|css|js)$/.test(file) ? 'public, max-age=3600' : 'no-cache' });
  response.end(compressed ? gzipSync(body) : body);
 } catch { response.writeHead(404, {'Content-Type':'text/html; charset=utf-8'}); response.end(await readFile(resolve(root,'404.html')).catch(()=> 'Not found')); }
});
server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));


