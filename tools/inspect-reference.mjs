import {chromium} from './qa/node_modules/playwright/index.mjs';
import fs from 'node:fs';
fs.mkdirSync('reference-design',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto('https://www.thalesgroup.com/fr',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForTimeout(4000);
 console.log('URL',page.url());console.log((await page.locator('body').innerText()).slice(0,10000));
 await page.screenshot({path:'reference-design/thales-desktop.png',fullPage:false});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'reference-design/thales-mobile.png',fullPage:false});
 console.log('Frames',page.frames().map(f=>f.url()));
 fs.writeFileSync('reference-design/reference.html',await page.content());
}catch(e){console.log('Référence inaccessible :',e.message);}finally{await browser.close();}
