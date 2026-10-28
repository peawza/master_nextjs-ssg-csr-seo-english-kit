import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const root = join(process.cwd(), 'out');
let failures = 0;
function check(name, pass) { console.log(`${pass ? 'PASS' : 'FAIL'} ${name}`); if (!pass) failures++; }
for (const file of ['index.html', 'services/index.html']) {
 check(`${file} exported`, existsSync(join(root,file)));
 if (!existsSync(join(root,file))) continue;
 const html = readFileSync(join(root,file),'utf8');
 check(`${file} lang=en`, /<html[^>]+lang="en"/.test(html));
 check(`${file} one H1`, (html.match(/<h1(?:\s|>)/g)||[]).length === 1);
 check(`${file} main landmark`, /<main[^>]+id="main-content"/.test(html));
 check(`${file} title`, /<title>[^<]+<\/title>/.test(html));
 check(`${file} description`, /<meta[^>]+name="description"[^>]+content="[^"]+"/.test(html));
 const expected = file === 'index.html' ? 'https://example.com/' : 'https://example.com/services/';
 check(`${file} correct canonical`, html.includes(`rel="canonical" href="${expected}"`));
 check(`${file} study noindex`, /<meta[^>]+name="robots"[^>]+content="noindex, follow"/.test(html));
 check(`${file} OG`, /property="og:title"/.test(html) && /property="og:image"/.test(html));
 const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
 check(`${file} unique IDs`, new Set(ids).size === ids.length);
 check(`${file} body copy`, /<p(?:\s|>)[\s\S]*?<\/p>/.test(html));
 if (file === 'index.html') {
  for (const id of ['about','seasons','seasonal-notes','suites','stories','journal','places','about-project']) check(`section ${id}`, ids.includes(id));
  const anchors = [...html.matchAll(/href="\/?#([^"]+)"/g)].map(match=>match[1]);
  check('all home anchor targets exist', anchors.every(id=>ids.includes(id)));
  check('footer no-JS navigation', /<nav aria-label="Footer navigation"/.test(html));
  check('no hotel schema', !html.includes('"@type":"Hotel"'));
  check('study disclosure', html.includes('No reservations or services are offered.'));
  check('no reference assets', !/https?:[^"\s<>]*passalacqua/i.test(html));
  for (const match of html.matchAll(/(?:src|srcSet)="(\/images\/[^" ,]+)/g)) check(`local media ${match[1]}`, existsSync(join(root,match[1])));
 }
}
for (const file of ['robots.txt','sitemap.xml','404.html']) check(file,existsSync(join(root,file)));
if (failures) {console.error(`${failures} static verification failures`);process.exit(1);}
console.log('Static content, metadata, anchors and route regression passed.');
