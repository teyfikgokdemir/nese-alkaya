// Build-time bilingual OG cards; no external images, services or downloaded fonts.
import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
const W=1200,H=630,out='public/og';
await mkdir(out,{recursive:true});
const photo=await sharp('public/nese-alkaya-portrait-2x.webp').rotate().resize(460,H,{fit:'cover',position:sharp.strategy.attention}).jpeg({quality:89}).toBuffer();
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const cards=[
 {lang:'tr',name:'nese-alkaya-tr.jpg',topic:'FARKINDALIK  ·  REHBERLİK  ·  DÖNÜŞÜM',lines:['Kendine doğru','bir yolculuk.'],desc:['Kendi yolunuza daha net','bakabileceğiniz bir alan.'],footer:'KİŞİSEL YOL ARKADAŞLIĞI'},
 {lang:'de',name:'nese-alkaya-de.jpg',topic:'ACHTSAMKEIT  ·  BEGLEITUNG  ·  WANDEL',lines:['Ein Weg zu dir','selbst.'],desc:['Neue Perspektiven auf','den eigenen Weg.'],footer:'PERSÖNLICHE BEGLEITUNG'}
];
for(const c of cards){
 const text=(x,y,size,color,value,weight=400)=>'<text x="'+x+'" y="'+y+'" font-family="DejaVu Sans,Arial,sans-serif" font-size="'+size+'" font-weight="'+weight+'" fill="'+color+'">'+escape(value)+'</text>';
 const svg=[
 '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">',
 '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#173B32"/><stop offset="1" stop-color="#264C3D"/></linearGradient></defs>',
 '<rect width="740" height="630" fill="url(#bg)"/>',
 '<rect x="739" width="5" height="630" fill="#B59A6A"/>',
 '<path d="M-120 520 Q270 160 700 735" fill="none" stroke="#B59A6A" stroke-width="2" opacity="0.13"/>',
 '<path d="M-160 580 Q290 210 715 785" fill="none" stroke="#B59A6A" stroke-width="2" opacity="0.11"/>',
 '<rect x="72" y="82" width="52" height="3" fill="#C7A977"/>',
 text(72,140,34,'#F5F0E7','NEŞE ALKAYA',700),
 text(72,204,15,'#D8BB88',c.topic,700),
 text(68,318,c.lang==='de'?59:58,'#FFFFFF',c.lines[0],700),
 text(68,392,64,'#FFFFFF',c.lines[1],700),
 text(72,478,22,'#E3E9E2',c.desc[0]),
 text(72,511,22,'#E3E9E2',c.desc[1]),
 '<rect x="72" y="567" width="74" height="2" fill="#C7A977"/>',
 text(166,574,15,'#D3C0A2',c.footer,500),
 '</svg>'
 ].join('');
 const bytes=await sharp({create:{width:W,height:H,channels:3,background:'#F5F0E7'}})
 .composite([{input:photo,left:740,top:0},{input:Buffer.from(svg),left:0,top:0}])
 .jpeg({quality:86,progressive:true}).toBuffer();
 const file=join(out,c.name);await writeFile(file,bytes);
 const meta=await sharp(bytes).metadata();
 if(meta.format!=='jpeg'||meta.width!==W||meta.height!==H||bytes.length>850000)throw Error('OG card validation failed: '+file);
 console.log(JSON.stringify({file,width:meta.width,height:meta.height,bytes:bytes.length}));
}
