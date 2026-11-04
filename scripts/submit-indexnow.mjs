// IndexNow: explicit opt-in submission. Never contact a search engine without --submit.
// Requires live canonical host AND publicly accessible key verification.
import fs from 'node:fs';
const host='nesealkaya.com';
const canonical='https://'+host;
const key='71667c077d9caf2cd980541e4dde7309';
const keyPath='/'+key+'.txt';
const keyUrl=canonical+keyPath;
const submitting=process.argv.includes('--submit');
const asset=fs.readFileSync('public/'+key+'.txt','utf8').trim();
if(asset!==key)throw Error('IndexNow verification key file mismatch');
const xml=fs.readFileSync('public/sitemap.xml','utf8');
const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
if(urls.length!==54||urls.some(x=>{try{return new URL(x).hostname!==host}catch{return true}})){
 throw Error('Sitemap must contain exactly 54 canonical URLs on '+host);
}
const payload={host,key,keyLocation:keyUrl,urlList:urls};
if(!submitting){
 console.log('DRY RUN — no network request sent:',JSON.stringify({host,keyLocation:keyUrl,urls:urls.length,first:urls[0],last:urls.at(-1)},null,2));
 process.exit(0);
}
// A 200/202 IndexNow response confirms receipt, not guaranteed indexing.
const check=await fetch(keyUrl,{redirect:'error',signal:AbortSignal.timeout(12000)});
if(!check.ok||(await check.text()).trim()!==key)throw Error('Live domain key check failed; no submission sent');
const response=await fetch('https://api.indexnow.org/indexnow',{
 method:'POST',headers:{'Content-Type':'application/json; charset=utf-8'},
 body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)
});
console.log(JSON.stringify({httpStatus:response.status,accepted:[200,202].includes(response.status),urls:urls.length}));
if(![200,202].includes(response.status))process.exitCode=1;
