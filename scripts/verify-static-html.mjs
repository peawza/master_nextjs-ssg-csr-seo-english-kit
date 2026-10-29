import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const root = join(process.cwd(), 'out');
const origin = 'https://example.com';
let failures = 0;
function check(name, pass) { console.log(`${pass ? 'PASS' : 'FAIL'} ${name}`); if (!pass) failures++; }

/** Head helpers. Attribute order is not assumed. */
const tagsOf = (html, tag) => html.match(new RegExp(`<${tag}\\s[^>]*>`, 'g')) || [];
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const metas = (html, key) => tagsOf(html, 'meta').filter(t => attr(t, 'name') === key || attr(t, 'property') === key).map(t => attr(t, 'content'));
const meta = (html, key) => metas(html, key)[0];
const canonicalOf = html => tagsOf(html, 'link').filter(t => attr(t, 'rel') === 'canonical').map(t => attr(t, 'href'));
const titleOf = html => html.match(/<title>([^<]*)<\/title>/)?.[1];
const jsonLdOf = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
const parseJson = text => { try { return JSON.parse(text); } catch { return undefined; } };

/** Indexable routes (once a real domain is approved) and their canonical URLs. */
const routes = { 'index.html': `${origin}/`, 'services/index.html': `${origin}/services/` };
const titles = new Set();
const descriptions = new Set();

for (const [file, expected] of Object.entries(routes)) {
 check(`${file} exported`, existsSync(join(root,file)));
 if (!existsSync(join(root,file))) continue;
 const html = readFileSync(join(root,file),'utf8');
 check(`${file} lang=en`, /<html[^>]+lang="en"/.test(html));
 check(`${file} one H1`, (html.match(/<h1(?:\s|>)/g)||[]).length === 1);
 check(`${file} main landmark`, /<main[^>]+id="main-content"/.test(html));
 const title = titleOf(html);
 const description = meta(html, 'description');
 check(`${file} title`, Boolean(title));
 check(`${file} description`, Boolean(description));
 titles.add(title); descriptions.add(description);
 const canonical = canonicalOf(html);
 check(`${file} single correct canonical`, canonical.length === 1 && canonical[0] === expected);
 check(`${file} single robots meta`, metas(html, 'robots').length === 1);
 check(`${file} study noindex`, meta(html, 'robots') === 'noindex, follow');
 // Social previews must describe this route, not inherit another route's values.
 check(`${file} og:url equals canonical`, meta(html, 'og:url') === expected);
 check(`${file} og:title equals title`, meta(html, 'og:title') === title);
 check(`${file} og:description equals description`, meta(html, 'og:description') === description);
 check(`${file} twitter matches OG`, meta(html, 'twitter:title') === title && meta(html, 'twitter:description') === description && meta(html, 'twitter:image') === meta(html, 'og:image'));
 const ogImage = meta(html, 'og:image') || '';
 check(`${file} og:image absolute and exported`, ogImage.startsWith(`${origin}/`) && existsSync(join(root, ogImage.slice(origin.length))));
 check(`${file} og:image:alt`, Boolean(meta(html, 'og:image:alt')));
 const blocks = jsonLdOf(html);
 check(`${file} JSON-LD parses`, blocks.every(b => parseJson(b) !== undefined));
 const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
 check(`${file} unique IDs`, new Set(ids).size === ids.length);
 check(`${file} body copy`, /<p(?:\s|>)[\s\S]*?<\/p>/.test(html));
 if (file === 'index.html') {
  const website = blocks.map(parseJson).find(d => d?.['@type'] === 'WebSite');
  check('home WebSite JSON-LD url equals canonical', website?.url === expected);
  check('home WebSite JSON-LD name/description match visible metadata', website?.name === meta(html, 'og:site_name') && website?.description === description);
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
check('titles unique across routes', titles.size === Object.keys(routes).length);
check('descriptions unique across routes', descriptions.size === Object.keys(routes).length);

// 404: must not claim a canonical URL or a social preview of another page.
if (existsSync(join(root, '404.html'))) {
 const html = readFileSync(join(root, '404.html'), 'utf8');
 check('404.html no canonical', canonicalOf(html).length === 0);
 check('404.html no og:url', meta(html, 'og:url') === undefined);
 check('404.html single robots noindex', metas(html, 'robots').length === 1 && /noindex/.test(meta(html, 'robots') || ''));
 check('404.html own title', /not found/i.test(titleOf(html) || ''));
 check('404.html one H1', (html.match(/<h1(?:\s|>)/g)||[]).length === 1);
} else check('404.html', false);

// Sitemap lists exactly the indexable routes; robots points to it.
if (existsSync(join(root, 'sitemap.xml'))) {
 const locs = [...readFileSync(join(root, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
 const expectedLocs = Object.values(routes);
 check('sitemap lists exactly the indexable routes', locs.length === expectedLocs.length && expectedLocs.every(u => locs.includes(u)));
} else check('sitemap.xml', false);
if (existsSync(join(root, 'robots.txt'))) {
 const robots = readFileSync(join(root, 'robots.txt'), 'utf8');
 check('robots.txt sitemap URL', robots.includes(`Sitemap: ${origin}/sitemap.xml`));
 check('robots.txt does not block crawling', !/^Disallow:\s*\/\s*$/m.test(robots));
} else check('robots.txt', false);
if (failures) {console.error(`${failures} static verification failures`);process.exit(1);}
console.log('Static content, metadata, social previews, sitemap and route regression passed.');
