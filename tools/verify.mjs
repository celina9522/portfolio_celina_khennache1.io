import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root='portfolio_celina_khennache1.io';
const stageCopy=JSON.parse(fs.readFileSync('content/stage.json','utf8'));
const projectNote=JSON.parse(fs.readFileSync('content/projets-note.json','utf8'));
const strip=s=>s.replace(/[ \t]*:contentReference\[oaicite:\d+\]\{index=\d+\}/g,'').replace(/<!--[^]*?-->|<script\b[^]*?<\/script>|<style\b[^]*?<\/style>/g,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const attrs=(s,name)=>[...s.matchAll(new RegExp(`\\b${name}="([^"]*)"`,'g'))].map(m=>m[1]);
const report={pages:0,projects:0,paragraphs:0,media:0,existingMissing:[],newMissing:[]};
report.preservedFiles=0;
function compareFiles(folder){
  for(const entry of fs.readdirSync(`sauvegarde-originale/${folder}`,{withFileTypes:true})){
    const name=`${folder}/${entry.name}`;
    if(entry.isDirectory())compareFiles(name);
    else if(!name.endsWith('.html')){assert.ok(fs.existsSync(name),`Fichier original absent : ${name}`);assert.ok(fs.readFileSync(name).equals(fs.readFileSync(`sauvegarde-originale/${name}`)),`Fichier original modifié : ${name}`);report.preservedFiles++;}
  }
}
compareFiles(root);
for(const dir of [root,`${root}/html5up-dimension`]){
  for(const file of ['index.html','into.html','generic.html']){
    // Le bloc de démonstration du template a été retiré à la demande de l'utilisatrice.
    const old=fs.readFileSync(`sauvegarde-originale/${dir}/${file}`,'utf8').replace(/<article id="elements">[^]*?<\/article>/,'').replace(/<div class="contact-intro">[^]*?<\/div>/,'');
    const current=fs.readFileSync(`${dir}/${file}`,'utf8');
    const newText=strip(current);
    // Nouveau texte d'accueil fourni et autorisé par l'utilisatrice.
    const originalWelcome=file==='index.html'?strip(old.match(/<div class="inner">[^]*?<p>([^]*?)<\/p>/)[1]):null;
    if(file==='index.html')for(const text of JSON.parse(fs.readFileSync('content/accueil.json','utf8')))assert.ok(current.includes(`<p>${text}</p>`),`Nouveau paragraphe absent : ${text}`);
    if(file==='index.html')assert.ok(current.includes(fs.readFileSync('content/stage-recherche.html','utf8').trim()),'Contenu du stage incomplet');
    if(file==='index.html')assert.ok(current.includes(fs.readFileSync('content/contact-intro.html','utf8').trim()),'Nouveau texte de contact incomplet');
    for(const paragraph of old.matchAll(/<(p|h[1-6]|li|label|option|blockquote)\b[^>]*>([^]*?)<\/\1>/g)){
      const text=strip(paragraph[2]).replace(/^Introduction$/, 'À propos').replace(stageCopy.original, stageCopy.replacement).replace('Ingénieure en formation en Automatique & Robotique', 'Ingénieure en formation en Automatique, Robotique, Mécatronique et Intelligence artificielle').replace('bras robotisés KUKA', 'bras robotisés KUKA et FANUC').replace(strip(projectNote.original),strip(projectNote.replacement)).replace('Disponibilité : Stage de 3 à 4 mois', 'Disponibilité : Stage de 6 mois').replace('06 22 93 03 20', '+33 6 22 93 03 20');
      if(text===originalWelcome)continue;
      assert.ok(newText.includes(text),`Texte absent ${dir}/${file} : ${text.slice(0,100)}`);
      report.paragraphs++;
    }
    for(const href of attrs(old,'href').filter(h=>!h.startsWith('assets/css/')))assert.ok(attrs(current,'href').includes(href),`Lien original absent : ${file} ${href}`);
    // Remplacement de portrait explicitement demandé : l'ancien fichier reste conservé.
    const replacements={'images/a.png':'images/moi.jpeg'};
    for(const src of attrs(old,'src').filter(s=>!s.startsWith('assets/js/'))){assert.ok(attrs(current,'src').includes(replacements[src]||src),`Média absent : ${src}`);report.media++;}
    if(file==='generic.html')report.projects+=[...current.matchAll(/class="project-block"/g)].length;
  }
  for(const file of ['index.html','into.html','generic.html','comp.html','contact.html','work.html']){
    report.pages++;
    const html=fs.readFileSync(`${dir}/${file}`,'utf8');
    const old=fs.readFileSync(`sauvegarde-originale/${dir}/${file}`,'utf8');
    for(const url of [...attrs(html,'src'),...attrs(html,'href')]){
      if(/^(https?:|mailto:|tel:|data:|\/\/)/.test(url))continue;
      const [name,hash]=url.split('#');const target=path.join(dir,name||file);
      const original=attrs(old,'src').includes(url)||attrs(old,'href').includes(url);
      let issue;
      if(!fs.existsSync(target))issue=`${dir}/${file} → ${url} (fichier absent)`;
      else if(hash&&target.endsWith('.html')&&!attrs(fs.readFileSync(target,'utf8'),'id').includes(hash))issue=`${dir}/${file} → ${url} (ancre absente)`;
      if(issue)(original?report.existingMissing:report.newMissing).push(issue);
    }
  }
}
assert.equal(report.newMissing.length,0,JSON.stringify(report.newMissing));
fs.writeFileSync('verification-contenu.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
