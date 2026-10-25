import { chromium } from './qa/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
fs.mkdirSync('verification-visuelle',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage();
const errors=[];page.on('pageerror',error=>errors.push(error.message));
const result=[];
for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:1000});
  for(const route of ['/', '/into.html', '/comp.html', '/work.html','/contact.html', '/generic.html#kuka']){
    await page.goto(`http://localhost:4173${route}`);await page.waitForTimeout(700);
    const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>i.hasAttribute('src')&&i.getBoundingClientRect().height>0&&i.getBoundingClientRect().top<innerHeight&&i.getBoundingClientRect().bottom>0&&(!i.complete||i.naturalWidth===0)).map(i=>i.getAttribute('src'))}));
    assert.ok(layout.scroll<=width,`Débordement ${width} ${route} : ${layout.scroll}`);
    assert.deepEqual(layout.broken,[],`Images ${route}`);
    result.push({width,route,...layout});
    if(route==='/'||route.includes('#kuka'))await page.screenshot({path:`verification-visuelle/${width}-${route==='/'?'accueil':'projet'}.png`,fullPage:route!=='/'});
  }
}
await page.setViewportSize({width:390,height:844});await page.goto('http://localhost:4173');
await page.getByRole('button',{name:/Menu/}).click();assert.equal(await page.locator('#navigation').isVisible(),true);
await page.locator('#navigation a[href="#projects"]').click();assert.equal(await page.locator('#navigation').isVisible(),false);
const ids=await page.locator('.posts a.image').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
for(const width of [1440,768,390]){await page.setViewportSize({width,height:844});for(const href of ids){await page.goto(`http://localhost:4173/${href}`);assert.equal(await page.locator('.project-block:visible').count(),1);assert.equal(await page.locator('.project-block.active').getAttribute('id'),href.split('#')[1]);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Débordement : ${width} ${href}`);}}
await page.goto('http://localhost:4173/generic.html#kuka');
await page.locator('.project-block.active .image-zoom').first().click();assert.equal(await page.locator('dialog').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').isVisible(),false);
await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://localhost:4173');assert.equal(await page.locator('.pending').count(),0);
const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const plain=await context.newPage();await plain.goto('http://localhost:4173/generic.html#kuka');assert.equal(await plain.locator('.project-block:visible').count(),13);
assert.deepEqual(errors,[]);fs.writeFileSync('verification-visuelle/resultats.json',JSON.stringify({layouts:result,projects:ids.length,errors,mobileMenu:true,imageZoom:true,reducedMotion:true,noJavaScript:true},null,2));console.log('Validation navigateur réussie : 18 mises en page, 13 vues projet, menu, zoom, mouvement réduit et lecture sans JavaScript.');await browser.close();
