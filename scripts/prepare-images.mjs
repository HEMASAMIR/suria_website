import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
const root = "../reference_assets";
const srcs = [
  ...fs.readdirSync(root).filter(f=>f.endsWith(".jpeg")).map(f=>path.join(root,f)),
  ...fs.readdirSync(path.join(root,"zip")).filter(f=>f.endsWith(".jpeg")).sort().map(f=>path.join(root,"zip",f)),
];
const tiles=[];
let i=0;
for (const s of srcs){
  i++;
  const out=`public/products/p${String(i).padStart(2,"0")}.webp`;
  await sharp(s).rotate().resize({width:1000,withoutEnlargement:true}).webp({quality:82}).toFile(out);
  tiles.push({input: await sharp(s).resize(200,250,{fit:"cover"}).composite([{input:Buffer.from(`<svg width="200" height="250"><rect width="44" height="26" fill="black"/><text x="4" y="20" font-size="20" fill="yellow">${i}</text></svg>`)}]).png().toBuffer(), left:((i-1)%9)*200, top:Math.floor((i-1)/9)*250});
}
const rows=Math.ceil(srcs.length/9);
await sharp({create:{width:1800,height:rows*250,channels:3,background:"#fff"}}).composite(tiles).jpeg({quality:70}).toFile(process.argv[2]);
console.log(srcs.length);
