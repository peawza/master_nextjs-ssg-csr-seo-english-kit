import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
const records=[];
for(const name of ['lake','room','terrace','dining','garden']) {
 for(const width of [640,960,1280,1920]) {
  const path=`public/images/${name}-${width}.avif`;
  const info=await sharp(`public/images/${name}-1920.webp`).resize(width,Math.round(width*2/3)).avif({quality:42,effort:5}).toFile(path);
  records.push({path,source:`public/images/${name}-1920.webp`,...info});
 }
}
// 768w covers 412 CSS px at DPR 1.75 (common Android); without it the browser jumps to 960w.
for(const width of [640,768,960]) {
 const path=`public/images/lake-mobile-${width}.avif`;
 const info=await sharp('public/images/lake-1920.webp').resize(width,Math.round(width*1.5),{fit:'cover',position:'centre'}).avif({quality:42,effort:5}).toFile(path);
 records.push({path,source:'public/images/lake-1920.webp',...info});
}
await writeFile('docs/reverse-engineering/passalacqua/optimized-assets.json',JSON.stringify(records,null,2));
console.log(records.map(({path,size})=>({path,bytes:size})));
