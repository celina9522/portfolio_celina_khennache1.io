import fs from 'node:fs';
import assert from 'node:assert/strict';
import {profileHeader,profileFooter} from './profile-links.mjs';
for(const dir of ['portfolio_celina_khennache1.io','portfolio_celina_khennache1.io/html5up-dimension']){
 for(const file of ['index.html','into.html','comp.html','work.html','contact.html','generic.html']){
   const path=`${dir}/${file}`;
   const html=fs.readFileSync(path,'utf8');
   assert.ok(!html.includes('class="profile-links"'),`Liens déjà présents : ${path}`);
   assert.ok(html.includes('</nav></header>'));
   fs.writeFileSync(path,html.replace('</nav></header>',profileHeader+'</nav></header>').replace('</body>',profileFooter+'</body>'));
 }
}
console.log('Liens CV et LinkedIn intégrés en haut et en bas des 12 pages.');
