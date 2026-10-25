import fs from 'node:fs';
import path from 'node:path';

const root = 'portfolio_celina_khennache1.io';
const backup = 'sauvegarde-originale';
function element(source, tag, id) {
  const start = source.search(new RegExp(`<${tag}\\b[^>]*id="${id}"[^>]*>`));
  if (start < 0) throw new Error(`Élément absent : ${id}`);
  const tags = new RegExp(`</?${tag}\\b[^>]*>`, 'g');
  tags.lastIndex = start;
  let depth = 0, match;
  while ((match = tags.exec(source))) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (!depth) return source.slice(start, tags.lastIndex);
  }
  throw new Error(`Élément incomplet : ${id}`);
}
function clean(html) {
  return html.replace(/<!--[^]*?-->/g, '').replace(/\sstyle="[^"]*"/g, '')
    .replace(/<script\b[^]*?<\/script>/g, '').replace(/<style\b[^]*?<\/style>/g, '');
}
const nav = `<a class="skip-link" href="#main">Aller au contenu</a>
<header class="site-header"><a class="signature" href="index.html" aria-label="KHENNACHE Celina-Fathma — accueil"><span class="monogram" aria-hidden="true">CK<span>.</span></span><span>Celina-Fathma <strong>Khennache</strong></span></a><button class="menu-toggle" aria-expanded="false" aria-controls="navigation">Menu <span aria-hidden="true">☰</span></button><nav id="navigation" aria-label="Navigation principale"><a href="index.html#intro">Introduction</a><a href="index.html#competances">Compétences</a><a href="index.html#projects">Projets</a><a class="nav-contact" href="index.html#contact">Contact <span aria-hidden="true">↗</span></a></nav></header>`;
function page(title, body, kind = '') {
  return `<!DOCTYPE html>\n<!-- Contenus et ressources du site original conservés. Dimension by HTML5 UP, html5up.net | @ajlkn, CCA 3.0 : voir LICENSE.txt. -->
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#092C7F"><title>${title} | KHENNACHE Celina-Fathma</title><meta name="description" content="Portfolio de KHENNACHE Celina-Fathma — Automatique, Robotique & Mécatronique. Projets techniques et compétences."><link rel="stylesheet" href="assets/css/portfolio.css"><script src="assets/js/portfolio.js" defer></script></head><body class="${kind}">${kind==='home'?nav.replaceAll('index.html#','#'):nav}${body}<footer class="site-footer"><a href="index.html">KHENNACHE Celina-Fathma</a><span>Automatique, Robotique & Mécatronique</span><a href="https://html5up.net">Ressources originales : HTML5 UP</a></footer></body></html>`;
}

for (const dir of [root, `${root}/html5up-dimension`]) {
  const source = fs.readFileSync(`${backup}/${dir}/index.html`, 'utf8');
  const originalDetail = fs.readFileSync(`${backup}/${dir}/generic.html`, 'utf8');
  const sections = ['intro', 'competances', 'projects', 'contact'].map(id => clean(element(source, 'article', id)));
  const welcome = element(source, 'header', 'header').match(/<div class="inner">([^]*?)<\/div>/)[1];
  const elements = clean(element(source, 'article', 'elements'));
  const footer = clean(element(source, 'footer', 'footer'));
  const finalHero = `<section class="hero home-simple" aria-labelledby="hero-heading"><div class="hero-copy">${clean(welcome).replace('<h1>', '<h1 id="hero-heading">')}</div></section>`;
  fs.writeFileSync(`${dir}/index.html`, page('Portfolio — Automatique, Robotique & Mécatronique', `<main id="main">${finalHero}${sections.join('\n')}<details class="original-elements"><summary>Éléments du site original</summary>${elements}</details></main>${footer}`, 'home'));
  const intro = fs.readFileSync(`${backup}/${dir}/into.html`, 'utf8');
  fs.writeFileSync(`${dir}/into.html`, page('Introduction', `<main id="main" class="standalone">${clean(element(intro, 'section', 'main')).replace('id="main"', 'id="intro"')}</main>`));
  for (const [file, index, title] of [['comp.html',1,'Compétences'], ['work.html',2,'Projets'], ['contact.html',3,'Contact']]) {
    fs.writeFileSync(`${dir}/${file}`, page(title, `<main id="main" class="standalone">${sections[index]}</main>`));
  }
  const detail = clean(element(originalDetail, 'article', 'project-page'));
  fs.writeFileSync(`${dir}/generic.html`, page('Détail du projet', `<main id="main" class="detail-main"><aside class="project-sidebar"><a class="text-link" href="index.html#projects">← Tous les projets</a><p class="eyebrow">Projets techniques</p><nav aria-label="Parcourir les projets">${[...source.matchAll(/<a href="generic.html#([^"]+)" class="image">[^]*?<h3>([^]*?)<\/h3>/g)].map(m=>`<a href="#${m[1]}">${m[2]}</a>`).join('')}</nav></aside>${detail}</main>`, 'detail'));
  fs.mkdirSync(`${dir}/assets/css`, {recursive:true});
  fs.mkdirSync(`${dir}/assets/js`, {recursive:true});
  if(dir!==root)for(const asset of ['css/portfolio.css','js/portfolio.js'])fs.copyFileSync(`${root}/assets/${asset}`,`${dir}/assets/${asset}`);
}
console.log('12 pages reconstruites depuis les contenus sauvegardés.');
