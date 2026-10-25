import fs from 'node:fs';
import assert from 'node:assert/strict';
const paragraphs=JSON.parse(fs.readFileSync('content/accueil.json','utf8'));
const html=paragraphs.map(text=>`<p>${text}</p>`).join('\n');
for(const directory of ['portfolio_celina_khennache1.io','portfolio_celina_khennache1.io/html5up-dimension']) {
  const filename=`${directory}/index.html`;
  const current=fs.readFileSync(filename,'utf8');
  const next=current.replace(/(<div class="hero-copy">[^]*?<\/h1>)\s*(?:<p>[^]*?<\/p>\s*)+(<a class="button primary")/, `$1\n${html}\n$2`);
  assert.notEqual(next,current,`Bloc d’accueil introuvable : ${filename}`);
  for(const text of paragraphs)assert.ok(next.includes(`<p>${text}</p>`));
  fs.writeFileSync(filename,next);
}
console.log(`Les ${paragraphs.length} paragraphes fournis sont présents à l’identique dans les deux accueils.`);
