import fs from 'node:fs';
import assert from 'node:assert/strict';
const sourcePath='content/stage-recherche.html';
const original=fs.readFileSync(sourcePath,'utf8');
assert.ok(!original.includes('stage-disclosure'),'Stage déjà repliable');
let updated=original.replace('  <div class="stage-layout">\n    <header class="stage-identity">','  <details class="stage-disclosure">\n    <summary class="stage-overview">\n      <div class="stage-identity">');
updated=updated.replace('    </header>\n    <div class="stage-content">',`        <span class="stage-open-label" aria-hidden="true">Voir le détail du stage <span>+</span></span>
        <span class="stage-close-label" aria-hidden="true">Masquer le détail <span>−</span></span>
      </div>
      <span class="stage-cover-image" aria-hidden="true"></span>
    </summary>
    <div class="stage-expanded">
    <div class="stage-content">`);
updated=updated.replace('    </div>\n  </div>\n<section class="stage-example"','    </div>\n<section class="stage-example"');
updated=updated.replace('</article>','    </div>\n  </details>\n</article>');
assert.notEqual(updated,original);
assert.ok(updated.includes('<details class="stage-disclosure">'));
assert.ok(!updated.includes('stage-layout'));
for(const dir of ['portfolio_celina_khennache1.io','portfolio_celina_khennache1.io/html5up-dimension']){
 const filename=`${dir}/index.html`;
 const html=fs.readFileSync(filename,'utf8');
 assert.ok(html.includes(original.trim()),`Section originale introuvable : ${filename}`);
 fs.writeFileSync(filename,html.replace(original.trim(),updated.trim()));
}
fs.writeFileSync(sourcePath,updated);
console.log('Stage repliable et emplacement image ajoutés aux deux accueils.');
