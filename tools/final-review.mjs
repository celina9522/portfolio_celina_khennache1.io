import {chromium} from './qa/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const report={sections:[],videos:[],secondaryPages:[],projectNavigation:true};
try {
  await page.goto('http://localhost:4173');
  for(const id of ['intro','competances','projects','contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();await page.waitForTimeout(700);
    await page.screenshot({path:`verification-visuelle/1440-${id}.png`});
    report.sections.push(id);
  }
  await page.setViewportSize({width:390,height:844});
  for(const name of ['index.html','into.html','comp.html','work.html','contact.html','generic.html#empileur']) {
    const response=await page.goto(`http://localhost:4173/html5up-dimension/${name}`);
    assert.equal(response.status(),200);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    report.secondaryPages.push(name);
  }
  await page.goto('http://localhost:4173/generic.html#punching');
  await page.locator('.project-block.active .project-pagination a').last().click();
  assert.equal(new URL(page.url()).hash,'#eolienne');assert.equal(await page.locator('.project-block:visible').count(),1);
  await page.goto('http://localhost:4173');
  const paths=[...new Set(JSON.parse(fs.readFileSync('inventaire-projets.json','utf8')).flatMap(p=>p.media).filter(src=>src.endsWith('.mp4')))];
  for(const src of paths) {
    if(!fs.existsSync(`portfolio_celina_khennache1.io/${src}`)){report.videos.push({src,status:'Fichier absent dans le site original'});continue;}
    const metadata=await page.evaluate(src=>new Promise(resolve=>{
      const v=document.createElement('video');v.preload='metadata';v.src=src;
      const timer=setTimeout(()=>{v.remove();resolve({ok:false,error:'Délai de chargement'});},15000);
      v.onloadedmetadata=()=>{clearTimeout(timer);resolve({ok:true,width:v.videoWidth,height:v.videoHeight,duration:v.duration});v.remove();};
      v.onerror=()=>{clearTimeout(timer);resolve({ok:false,error:v.error?.message});v.remove();};
      document.body.append(v);
    }),src);
    assert.ok(metadata.ok,`${src}: ${JSON.stringify(metadata)}`);
    const response=await fetch(`http://localhost:4173/${src}`,{headers:{Range:'bytes=0-1023'}});assert.equal(response.status,206);
    report.videos.push({src,...metadata,rangeRequest:response.status});
  }
  const context=await browser.newContext({viewport:{width:320,height:740}});const small=await context.newPage();
  for(const route of ['','generic.html#empileur','work.html']){await small.goto(`http://localhost:4173/${route}`);assert.ok(await small.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Débordement à 320px : ${route}`);}
  report.smallScreen320=true;
  fs.writeFileSync('verification-visuelle/revue-finale.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
} finally { await browser.close(); }
