// Build-time bilingual OG cards; no external images, services or downloaded fonts.
import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
const W=1200,H=630,out='public/og';
await mkdir(out,{recursive:true});
const src='public/nese-alkaya-portrait-2x.webp';
const input=sharp(src).rotate();
const dimensions=await input.metadata();
const cropHeight=Math.min(dimensions.height,Math.round(dimensions.width*H/820));
const cropTop=Math.max(0,Math.min(dimensions.height-cropHeight,Math.round(dimensions.height*0.18)));
// Frame the face rather than the top of the original tall portrait.
const photo=await sharp(src).rotate().extract({left:0,top:cropTop,width:dimensions.width,height:cropHeight}).resize(820,H).jpeg({quality:89}).toBuffer();
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const cards=[
 {lang:'tr',name:'nese-alkaya-portre-tr.jpg',topic:'FARKINDALIK  ·  REHBERLİK  ·  DÖNÜŞÜM',lines:['Kendine doğru','bir yolculuk.'],desc:['Kendi yolunuza daha net','bakabileceğiniz bir alan.'],footer:'KİŞİSEL YOL ARKADAŞLIĞI'},
 {lang:'de',name:'nese-alkaya-portre-de.jpg',topic:'ACHTSAMKEIT  ·  BEGLEITUNG  ·  WANDEL',lines:['Ein Weg zu dir','selbst.'],desc:['Neue Perspektiven auf','den eigenen Weg.'],footer:'PERSÖNLICHE BEGLEITUNG'}
];
for(const c of cards){
 const text=(x,y,size,color,value,weight=400)=>'<text x="'+x+'" y="'+y+'" font-family="DejaVu Sans,Arial,sans-serif" font-size="'+size+'" font-weight="'+weight+'" fill="'+color+'">'+escape(value)+'</text>';
 const svg=[
 '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">',
 '<defs><linearGradient id="panel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#193B32"/><stop offset="1" stop-color="#254A3D"/></linearGradient></defs>',
 '<rect x="820" width="380" height="630" fill="url(#panel)"/>',
 '<rect x="820" y="0" width="5" height="630" fill="#C1A36F"/>',
 '<rect x="858" y="105" width="50" height="3" fill="#C7A977"/>',
 text(858,251,45,'#F5F0E7','NEŞE',700),
 text(858,315,45,'#F5F0E7','ALKAYA',700),
 '<rect x="858" y="346" width="274" height="1" fill="#B59A6A" opacity=".65"/>',
 text(858,395,17,'#E4C99A',c.lang==='de'?'ACHTSAMKEIT':'FARKINDALIK',700),
 text(858,433,17,'#E4C99A',c.lang==='de'?'BEGLEITUNG':'REHBERLİK',700),
 text(858,471,17,'#E4C99A',c.lang==='de'?'WANDEL':'DÖNÜŞÜM',700),
 '</svg>' ].join('');
 const bytes=await sharp({create:{width:W,height:H,channels:3,background:'#F5F0E7'}})
 .composite([{input:photo,left:0,top:0},{input:Buffer.from(svg),left:0,top:0}])
 .jpeg({quality:86,progressive:true}).toBuffer();
 const file=join(out,c.name);await writeFile(file,bytes);
 const meta=await sharp(bytes).metadata();
 if(meta.format!=='jpeg'||meta.width!==W||meta.height!==H||bytes.length>850000)throw Error('OG card validation failed: '+file);
 console.log(JSON.stringify({file,width:meta.width,height:meta.height,bytes:bytes.length}));
}
