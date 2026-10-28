import { mkdir, writeFile } from 'node:fs/promises';
const photos = {
  lake: 'photo-1476514525535-07fb3b4ae5f1',
  room: 'photo-1611892440504-42a792e24d32',
  terrace: 'photo-1566073771259-6a8506099945',
  dining: 'photo-1414235077428-338989a2e8c0',
  garden: 'photo-1418065460487-3e41a6c84dc5',
};
await mkdir('public/images', { recursive: true });
const records = [];
for (const [name, id] of Object.entries(photos)) {
  for (const width of [640, 1280, 1920]) {
    const url = `https://images.unsplash.com/${id}?auto=format&fm=webp&fit=crop&w=${width}&h=${Math.round(width*2/3)}&q=78`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${name}: ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(`public/images/${name}-${width}.webp`, buffer);
    records.push({name, width, height: Math.round(width*2/3), source: url, bytes: buffer.length});
  }
}
for (const [source, target] of [
 ['OFL.txt','OFL-CormorantGaramond.txt']
]) {
 const response = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/${source}`);
 if (!response.ok) throw new Error(`font ${response.status}`);
 await writeFile(`public/fonts/${target}`, Buffer.from(await response.arrayBuffer()));
}
const fontResponse = await fetch('https://fonts.gstatic.com/s/cormorantgaramond/v21/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff2');
if (!fontResponse.ok) throw new Error('Font download failed');
await writeFile('public/fonts/cormorant-garamond-latin.woff2', Buffer.from(await fontResponse.arrayBuffer()));
await writeFile('docs/reverse-engineering/passalacqua/assets.json', JSON.stringify({downloadedAt:new Date().toISOString(),license:'https://unsplash.com/license',fontLicense:'SIL Open Font License 1.1; public/fonts/OFL-CormorantGaramond.txt',records},null,2));
console.log(`Downloaded ${records.length} local image variants and OFL font.`);

