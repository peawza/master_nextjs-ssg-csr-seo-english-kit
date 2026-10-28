import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const outputRoot = join(process.cwd(), 'out');
const checks = [
  { file: 'index.html', h1: true },
  { file: 'services/index.html', h1: true },
];
let failures = 0;

for (const { file, h1 } of checks) {
  const path = join(outputRoot, file);
  if (!existsSync(path)) {
    console.error(`FAIL ${file}: no static HTML was generated`);
    failures++;
    continue;
  }
  const html = readFileSync(path, 'utf8');
  const assertions = {
    '<html lang>': /<html[^>]+lang=["'][^"']+["']/i.test(html),
    '<title>': /<title>[^<]+<\/title>/i.test(html),
    'description': /<meta[^>]+name=["']description["'][^>]+content=["'][^"']+/i.test(html) || /<meta[^>]+content=["'][^"']+[^>]+name=["']description["']/i.test(html),
    'canonical': /<link[^>]+rel=["']canonical["']/i.test(html) || /<link[^>]+href=["'][^"']+[^>]+rel=["']canonical["']/i.test(html),
    '<main>': /<main(?:\s|>)/i.test(html),
    'HTML H1': !h1 || /<h1(?:\s|>)/i.test(html),
    'visible body text': /<p(?:\s|>)[\s\S]*?<\/p>/i.test(html),
  };
  for (const [name, pass] of Object.entries(assertions)) {
    console.log(`${pass ? 'PASS' : 'FAIL'} ${file} ${name}`);
    if (!pass) failures++;
  }
}
for (const path of ['robots.txt', 'sitemap.xml']) {
  const okay = existsSync(join(outputRoot, path));
  console.log(`${okay ? 'PASS' : 'FAIL'} ${path}`);
  if (!okay) failures++;
}
if (failures) {
  console.error(`Static HTML validation failed: ${failures} check(s).`);
  process.exit(1);
}
console.log('Static HTML basic SEO checks passed. Manual semantic review is still required.');
