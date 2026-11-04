import fs from 'node:fs';
import path from 'node:path';
import {blogTR} from '../src/data/blog-tr.js';
import {blogDE} from '../src/data/blog-de.js';
import {dePathMap,trPathMap,deServices} from '../src/data/de.js';
import {services} from '../src/data/content.js';
import {expandedServiceCopy} from '../src/data/service-expanded.js';
const dist=path.resolve('dist');
const origin='https://nesealkaya.com';
const failures=[];
const check=(yes,message)=>{if(!yes)failures.push(message)};
const read=file=>fs.readFileSync(file,'utf8');
const output=urlPath=>path.join(dist,decodeURIComponent(urlPath).replace(/^\/+/,'').replace(/\/$/,'')+(urlPath.endsWith('/')?'\/index.html':''));
const cat=JSON.parse(read('public/ai-catalog.json'));
const paths=[...new Set(cat.pages.map(x=>new URL(x.url).pathname))];
const sitemap=read(path.join(dist,'sitemap.xml'));
const sitemapUrls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
check(paths.length===54,'Expected 54 site URLs');
check(sitemapUrls.length===54,'Expected 54 sitemap URLs');
check(new Set(sitemapUrls).size===54,'Duplicated sitemap URLs');
check(blogTR.length===8&&blogDE.length===8,'Blog language count invalid');
check(services.length===13&&deServices.length===13,'Service language count invalid');
for(const service of services){
 const item=expandedServiceCopy[service.slug];
 check(Boolean(item),'Missing expanded copy '+service.slug);
 for(const lang of ['tr','de']){
  const entry=item?.[lang];
  check(Boolean(entry?.headline&&entry?.context&&entry?.approach&&entry?.takeaway),'Missing service sections '+lang+'/'+service.slug);
  check(entry?.situations?.length===3,'Expected three service prompts '+lang+'/'+service.slug);
  check(entry?.faq?.length===2,'Expected two service FAQs '+lang+'/'+service.slug);
 }
 check(deServices.some(x=>x.tr===service.slug),'Missing German service '+service.slug);
}
blogTR.forEach((p,i)=>check(blogDE[i]?.tr===p.slug,'Blog language pair mismatch: '+p.slug));
let tested=0,articles=0,links=0,servicePages=0;
const link=(html,rel,lang)=>{
 const tags=html.match(/<link\b[^>]*>/g)||[];
 const tag=tags.find(t=>t.includes('rel="'+rel+'"')&&(!lang||t.includes('hreflang="'+lang+'"')));
 return tag?.match(/href="([^"]+)"/)?.[1]??null;
};
for(const urlPath of paths){
 check(sitemapUrls.includes(urlPath),'Missing sitemap URL '+urlPath);
 const pathname=output(urlPath);
 if(!fs.existsSync(pathname)){failures.push('Missing HTML: '+urlPath);continue}
 tested++;
 const html=read(pathname);
 const german=urlPath.startsWith('/de/');
 const other=german?trPathMap[urlPath]:dePathMap[urlPath];
 check(Boolean(other),'No language pair: '+urlPath);
 check(link(html,'canonical')===origin+urlPath,'Wrong canonical: '+urlPath);
 check(link(html,'alternate','tr-TR')===origin+(german?other:urlPath),'Wrong Turkish alternate: '+urlPath);
 check(link(html,'alternate','de-DE')===origin+(german?urlPath:other),'Wrong German alternate: '+urlPath);
 check(link(html,'alternate','x-default')===origin+(german?other:urlPath),'Wrong default alternate: '+urlPath);
 check(html.includes('lang="'+(german?'de':'tr')+'"'),'Wrong html language: '+urlPath);
 check((html.match(/<h1(?:\s|>)/g)||[]).length===1,'Wrong H1 count: '+urlPath);
 check(html.includes('name="description"'),'Meta description missing: '+urlPath);
 check(html.includes('href="/.well-known/ard.json"'),'ARD discovery missing: '+urlPath);
 check(html.includes('content="https://nese-alkaya.pages.dev/og/nese-alkaya-portre-'+(german?'de':'tr')+'.jpg"'),'OG image missing/wrong language: '+urlPath);
 check(!/<div[^>]*class="scroll-controls"[^>]*aria-label/.test(html),'Invalid aria on floating wrapper: '+urlPath);
 const schema=html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
 if(!schema)check(false,'Missing JSON-LD: '+urlPath);
 else{
  try{
   const nodes=JSON.parse(schema[1])['@graph']||[];
   check(nodes.some(x=>x['@type']==='WebPage'),'WebPage schema missing: '+urlPath);
   if(/^\/(?:hizmetler|de\/angebote)\/[^/]+\/$/.test(urlPath)){
    check(nodes.some(x=>x['@type']==='Service'),'Service schema missing: '+urlPath);
    check(nodes.some(x=>x['@type']==='FAQPage'&&x.mainEntity?.length===2),'Service FAQ schema missing: '+urlPath);
   }
   if(urlPath.includes('/blog/')&&!['/blog/','/de/blog/'].includes(urlPath)){
    articles++;
    check(nodes.some(x=>x['@type']==='BlogPosting'),'BlogPosting missing: '+urlPath);
   }
  }catch(e){check(false,'Invalid JSON-LD: '+urlPath+' '+e.message)}
 }
 const detailService=german?deServices.find(x=>urlPath==='/de/angebote/'+x.slug+'/'):services.find(x=>urlPath==='/hizmetler/'+x.slug+'/');
 if(detailService){
  servicePages++;
  const expanded=expandedServiceCopy[german?detailService.tr:detailService.slug][german?'de':'tr'];
  check(html.includes(expanded.headline),'Missing service heading: '+urlPath);
  check(html.includes('service-deep-prompt-grid'),'Missing service prompt grid: '+urlPath);
  check(html.includes('service-deep-related-grid'),'Missing related services: '+urlPath);
  check((html.match(/class="service-deep-prompt"/g)||[]).length===3,'Wrong service prompts: '+urlPath);
  check((html.match(/<details>/g)||[]).length===2,'Wrong detail FAQ count: '+urlPath);
 }
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=m[1].replaceAll('&amp;','&');
  if(href.startsWith('#')||href.startsWith('tel:')||href.startsWith('mailto:')||href.startsWith('data:'))continue;
  let u;
  try{u=new URL(href,'https://nese-alkaya.pages.dev'+urlPath)}catch{check(false,'Bad URL: '+urlPath);continue}
  if(u.hostname!=='nese-alkaya.pages.dev')continue;
  links++;
  const target=output(u.pathname);
  check(fs.existsSync(target),'Broken internal target '+urlPath+' -> '+u.pathname);
 }
}
check(tested===54,'Not all pages generated');
check(articles===16,'Expected 16 blog articles');
check(servicePages===26,'Expected 26 expanded service pages');
for(const file of ['robots.txt','sitemap.xml','llms.txt','llms-full.txt','llms-tr.txt','llms-de.txt','ai-catalog.json','.well-known/ard.json','.well-known/ai-catalog.json','_headers']){
 check(fs.existsSync(path.join(dist,file)),'Missing asset: '+file);
}
for(const name of ['.well-known/ard.json','.well-known/ai-catalog.json']){
 try{const j=JSON.parse(read(path.join(dist,name)));check(j.specVersion==='1.0'&&j.entries.length>0,'ARD schema basics: '+name)}catch(e){check(false,'Invalid ARD: '+name)}
}
for(const lang of ['tr','de']){
 const file=path.join(dist,'og','nese-alkaya-portre-'+lang+'.jpg');
 check(fs.existsSync(file),'Missing OG JPG for '+lang);
 if(fs.existsSync(file)){
  const bytes=fs.readFileSync(file);
  check(bytes[0]===0xff&&bytes[1]===0xd8&&bytes.byteLength>30000&&bytes.byteLength<850000,'Invalid OG JPEG for '+lang);
 }
}
check(read(path.join(dist,'_headers')).includes('Content-Security-Policy:'),'CSP missing');
console.log(JSON.stringify({generatedPages:tested,blogArticles:articles,servicePages,linksChecked:links,failures:failures.length},null,2));
if(failures.length){console.error(failures.slice(0,50).join('\n'));process.exitCode=1}
