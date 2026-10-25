import fs from 'node:fs';
import assert from 'node:assert/strict';
const imageName=fs.readdirSync('portfolio_celina_khennache1.io/images').find(name=>name.startsWith('Comparaison des reconstructions'));
assert.ok(imageName,'Image de comparaison introuvable');
fs.copyFileSync(`portfolio_celina_khennache1.io/images/${imageName}`,`portfolio_celina_khennache1.io/html5up-dimension/images/${imageName}`);
const src=`images/${imageName}`;
const image=`<img src="${src}" alt="Comparaison de la chambre réelle, du maillage 3D et de la reconstruction photoréaliste" loading="lazy" decoding="async">`;
const sources=['content/stage-recherche.html','content/stage-reconstruction.html'];
const previous=fs.readFileSync(sources[0],'utf8');
let stage=previous.replace('<span class="stage-cover-image" aria-hidden="true"></span>',`<span class="stage-cover-image">${image}</span>`);
stage=stage.replace('<div class="stage-example-image" aria-hidden="true"></div>',`<a class="stage-example-image" href="${src}" target="_blank" rel="noopener" aria-label="Agrandir la comparaison des reconstructions 3D">${image}</a>`);
stage=stage.replace('  </details>','  </details>');
const returnButton='<div class="stage-return"><a class="button" href="#stage" data-close-stage>Retour</a></div>';
stage=stage.replace('    </div>\n  </details>',`${returnButton}\n    </div>\n  </details>`);
assert.notEqual(stage,previous);
for(const dir of ['portfolio_celina_khennache1.io','portfolio_celina_khennache1.io/html5up-dimension']){
  const filename=`${dir}/index.html`;
  const html=fs.readFileSync(filename,'utf8');assert.ok(html.includes(previous.trim()));
  fs.writeFileSync(filename,html.replace(previous.trim(),stage.trim()));
}
fs.writeFileSync(sources[0],stage);
fs.writeFileSync(sources[1],fs.readFileSync(sources[1],'utf8').replace('<div class="stage-example-image" aria-hidden="true"></div>',`<a class="stage-example-image" href="${src}" target="_blank" rel="noopener" aria-label="Agrandir la comparaison des reconstructions 3D">${image}</a>`));
console.log('Image du stage et bouton Retour intégrés.');
