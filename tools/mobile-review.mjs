import {chromium} from './qa/node_modules/playwright/index.mjs';
import {pathToFileURL} from 'node:url';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const root='portfolio_celina_khennache1.io';
const url=(file='index.html')=>pathToFileURL(`${process.cwd()}/${root}/${file.split('#')[0]}`).href+(file.includes('#')?'#'+file.split('#')[1]:'');
const report={layouts:[],projects:0,errors:[],menu:true,stage:true,zoom:true,reducedMotion:true};
fs.mkdirSync('verification-visuelle',{recursive:true});
try {
  for(const [width,height] of [[320,568],[375,667],[390,844],[430,932],[844,390],[768,1024]]) {
    const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
    const page=await context.newPage();
    page.on('pageerror',error=>report.errors.push(error.message));
    for(const file of ['index.html','into.html','comp.html','work.html','contact.html','generic.html#punching']) {
      await page.goto(url(file));
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Débordement : ${width} ${file}`);
      await page.locator('.menu-toggle').tap();
      assert.equal(await page.locator('#navigation').isVisible(),true);
      assert.ok(await page.locator('#navigation').evaluate(n=>n.getBoundingClientRect().bottom<=innerHeight+2),`Menu trop haut ${width}x${height}`);
      await page.locator('.profile-links').scrollIntoViewIfNeeded();
      assert.equal(await page.locator('.profile-links a').count(),2);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#navigation').isVisible(),false);
      assert.equal(await page.locator('.menu-toggle').evaluate(n=>n===document.activeElement),true);
      report.layouts.push({width,height,file});
    }
    await page.goto(url());
    await page.locator('.menu-toggle').tap();
    await page.locator('#navigation a[href="#stage"]').tap();
    assert.equal(await page.locator('#navigation').isVisible(),false);
    await page.waitForFunction(()=>document.querySelector('.stage-cover-image img').naturalWidth>0);
    assert.ok(await page.locator('.stage-cover-image').evaluate(n=>n.getBoundingClientRect().height>120));
    await page.locator('.stage-identity').tap();
    assert.equal(await page.locator('.stage-expanded').isVisible(),true);
    assert.equal(await page.locator('.stage-steps>li').count(),6);
    await page.locator('.stage-example-image').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.querySelector('.stage-example-image img').naturalWidth>0);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.locator('[data-close-stage]').tap();
    assert.equal(await page.locator('.stage-expanded').isVisible(),false);
    assert.equal(await page.locator('.pending').count(),0);
    if(width===390) {
      await page.goto(url());
      await page.screenshot({path:'verification-visuelle/mobile-accueil.png'});
      for(const id of ['intro','competances','stage','contact']) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        await page.screenshot({path:`verification-visuelle/mobile-${id}.png`});
      }
    }
    if(width===320||width===430) {
      for(const project of JSON.parse(fs.readFileSync('inventaire-projets.json','utf8'))) {
        await page.goto(url(`generic.html#${project.id}`));
        assert.equal(await page.locator('.project-block:visible').count(),1);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Projet ${project.id} à ${width}px`);
        report.projects++;
      }
      await page.goto(url('generic.html#kuka'));
      await page.locator('.project-block.active .image-zoom').first().tap();
      assert.equal(await page.locator('dialog').isVisible(),true);
      await page.getByRole('button',{name:'Fermer l’illustration'}).tap();
      assert.equal(await page.locator('dialog').isVisible(),false);
      await page.goto(url('contact.html'));
      assert.equal(await page.locator('a[href="tel:+33622930320"]').count(),1);
      assert.equal(await page.locator('.contact-profile-links a').count(),2);
    }
    await context.close();
  }
  // Les styles mobiles ne remplacent pas la composition d'ordinateur.
  const desktop=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  await desktop.goto(url());
  assert.equal(await desktop.locator('.menu-toggle').isVisible(),false);
  assert.equal(await desktop.locator('#navigation').isVisible(),true);
  assert.equal(await desktop.locator('#competances .features').evaluate(n=>getComputedStyle(n).gridTemplateColumns.split(' ').length),2);
  await desktop.locator('#navigation a[href="#competances"]').click();
  const cards=await desktop.locator('#competances .features>section').evaluateAll(nodes=>nodes.slice(0,6).map(n=>({top:n.getBoundingClientRect().top,bottom:n.getBoundingClientRect().bottom})));
  assert.ok(cards[3].bottom<=900&&cards[4].top>=900);
  assert.deepEqual(report.errors,[]);
  fs.writeFileSync('verification-visuelle/mobile-resultats.json',JSON.stringify(report,null,2));
  console.log(`Validation réussie : ${report.layouts.length} mises en page, ${report.projects} vues projet, menus tactiles, Stage, zoom, téléphone et affichage ordinateur.`);
} finally { await browser.close(); }
