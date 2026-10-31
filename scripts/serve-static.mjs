import { createServer } from 'node:http';
import { gzipSync } from 'node:zlib';
import { readFile, stat } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';

// Static preview of out/ for local tests and the Docker preview image.
// No Next.js runtime: it serves exported files, 404.html with HTTP 404, and the
// headers declared in out/_headers (the same file Cloudflare Pages applies).
const root = resolve(process.env.STATIC_ROOT || 'out');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.txt':'text/plain', '.xml':'application/xml', '.webp':'image/webp', '.avif':'image/avif', '.ttf':'font/ttf', '.woff2':'font/woff2', '.ico':'image/x-icon', '.svg':'image/svg+xml' };
const port = Number(process.env.PORT || 4173);
// 127.0.0.1 by default; the container sets HOST=0.0.0.0 and Docker publishes it on 127.0.0.1 only.
const host = process.env.HOST || '127.0.0.1';

/** Parse the Cloudflare Pages `_headers` format: a URL pattern line, then indented `Name: value` lines. */
function loadHeaderRules() {
 let text;
 try { text = readFileSync(resolve(root, '_headers'), 'utf8'); } catch { return [{ test: () => true, headers: { 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, follow' } }]; }
 const rules = [];
 for (const line of text.split(/\r?\n/)) {
  if (!line.trim() || line.trim().startsWith('#')) continue;
  if (!/^\s/.test(line)) {
   const pattern = line.trim();
   const regex = new RegExp(`^${pattern.split('*').map(part => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*')}$`);
   rules.push({ test: pathname => regex.test(pathname), headers: {} });
  } else if (rules.length) {
   const index = line.indexOf(':');
   if (index > 0) rules.at(-1).headers[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
 }
 return rules;
}
const headerRules = loadHeaderRules();
const headersFor = pathname => Object.assign({}, ...headerRules.filter(rule => rule.test(pathname)).map(rule => rule.headers));

const server = createServer(async (request, response) => {
 let pathname = '/';
 try {
  pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  let file = resolve(root, `.${pathname}`);
  if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403).end(); return; }
  if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
  const body = await readFile(file);
  const compressed = /\.(html|css|js|json|txt|xml|svg)$/.test(file) && /\bgzip\b/.test(request.headers['accept-encoding'] || '');
  response.writeHead(200, { ...headersFor(pathname), ...(compressed ? { 'Content-Encoding':'gzip', 'Vary':'Accept-Encoding' } : {}), 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': /\.(avif|webp|ttf|woff2|css|js)$/.test(file) ? 'public, max-age=3600' : 'no-cache' });
  response.end(compressed ? gzipSync(body) : body);
 } catch { response.writeHead(404, { ...headersFor(pathname), 'Content-Type':'text/html; charset=utf-8' }); response.end(await readFile(resolve(root,'404.html')).catch(()=> 'Not found')); }
});
server.listen(port, host, () => console.log(`Local: http://${host}:${port}`));
