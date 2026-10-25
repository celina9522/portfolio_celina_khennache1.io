import fs from 'node:fs';
import {profileHeader,profileContact} from './profile-links.mjs';

const root = 'portfolio_celina_khennache1.io';
const backup = 'sauvegarde-originale';
const stageCopy = JSON.parse(fs.readFileSync('content/stage.json', 'utf8'));
const projectNote = JSON.parse(fs.readFileSync('content/projets-note.json', 'utf8'));
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
  html = html.replace(/(<div class="box contact-box">[^]*?)(<\/div>)/,`$1${profileContact}$2`);
  html = html.replace('<strong>Disponibilité :</strong> Stage de 3 à 4 mois', '<strong>Disponibilité :</strong> Stage de 6 mois').replace('06 22 93 03 20', '+33 6 22 93 03 20');
  html = html.replace('<strong>Téléphone :</strong> +33 6 22 93 03 20', '<strong>Téléphone :</strong> <a href="tel:+33622930320">+33 6 22 93 03 20</a>');
  html = html.replace(/<div class="contact-intro">[^]*?<\/div>/, fs.readFileSync('content/contact-intro.html', 'utf8').trim());
  html = html.replace(projectNote.original, projectNote.replacement);
  html = html.replace(/[ \t]*:contentReference\[oaicite:\d+\]\{index=\d+\}/g, '');
  return html.replace('bras robotisés KUKA', 'bras robotisés KUKA et FANUC').replace('Ingénieure en formation en Automatique & Robotique', 'Ingénieure en formation en Automatique, Robotique, Mécatronique et Intelligence artificielle').replace(stageCopy.original, stageCopy.replacement).replace(/<!--[^]*?-->/g, '').replace(/\sstyle="[^"]*"/g, '')
    .replace(/<script\b[^]*?<\/script>/g, '').replace(/<style\b[^]*?<\/style>/g, '');
}
const nav = `<a class="skip-link" href="#main">Aller au contenu</a>
<header class="site-header"><a class="signature" href="index.html" aria-label="CELINA FATHMA KHENNACHE — accueil">CELINA FATHMA<br><strong>KHENNACHE</strong></a><button class="menu-toggle" aria-expanded="false" aria-controls="navigation"><span>Menu</span><span class="menu-lines" aria-hidden="true"></span></button><nav id="navigation" aria-label="Navigation principale"><a href="index.html#accueil">Accueil</a><a href="index.html#intro">À propos</a><a href="index.html#competances">Compétences</a><a href="index.html#projects">Projets</a><a class="nav-contact" href="index.html#contact">Contact <span aria-hidden="true">↗</span></a></nav></header>`;
function page(title, body, kind = '') {
  const stageNav = nav.replace('<a href="index.html#projects">Projets</a>', '<a href="index.html#stage">Stage</a><a href="index.html#projects">Projets</a>').replace('</nav></header>',profileHeader+'</nav></header>');
  return `<!DOCTYPE html>\n<!-- Contenus et ressources du site original conservés. Dimension by HTML5 UP, html5up.net | @ajlkn, CCA 3.0 : voir LICENSE.txt. -->
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#092C7F"><title>${title} | KHENNACHE Celina-Fathma</title><meta name="description" content="Portfolio de KHENNACHE Celina-Fathma — Automatique, Robotique & Mécatronique. Projets techniques et compétences."><link rel="stylesheet" href="assets/css/fontawesome-all.min.css"><link rel="stylesheet" href="assets/css/portfolio.css"><script src="assets/js/portfolio.js" defer></script></head><body class="${kind}">${kind==='home'?stageNav.replaceAll('index.html#','#'):stageNav}${body}</body></html>`;
}

for (const dir of [root, `${root}/html5up-dimension`]) {
  const source = fs.readFileSync(`${backup}/${dir}/index.html`, 'utf8');
  const originalDetail = fs.readFileSync(`${backup}/${dir}/generic.html`, 'utf8');
  const sections = ['intro', 'competances', 'projects', 'contact'].map(id => {
    const html = clean(element(source, 'article', id)).replace('src="images/a.png"', 'src="images/moi.jpeg"').replace('>Introduction</h1>', '>À propos</h1>');
    return id==='competances'?html.replace('<p class="skills-note">',fs.readFileSync('content/competence-vision.html','utf8')+'\n<p class="skills-note">'):html;
  });
  const homeParagraphs = JSON.parse(fs.readFileSync('content/accueil.json', 'utf8'));
  const welcome = element(source, 'header', 'header').match(/<div class="inner">([^]*?)<\/div>/)[1].replace(/<p>[^]*?<\/p>/, homeParagraphs.map(text=>`<p>${text}</p>`).join('\n'));
  const footer = clean(element(source, 'footer', 'footer'));
  const finalHero = `<section id="accueil" class="hero" aria-labelledby="hero-heading"><div class="hero-copy">${clean(welcome).replace('<h1>', '<h1 id="hero-heading">').replace(/Penser\. Concevoir\. (Innover\.+)/, '<span>Penser.</span> <span>Concevoir.</span> <span>\$1</span>')}<a class="button primary" href="#projects">Découvrir mes projets <span aria-hidden="true">↗</span></a></div><figure class="hero-visual"><img src="images/Ingénieure au cœur de l’usine intelligente.png" alt="Ingénieure et robot dans une usine intelligente" fetchpriority="high"></figure></section>`;
  const homeSections = [sections[0], sections[1], fs.readFileSync('content/stage-recherche.html','utf8'), sections[2], sections[3]];
  fs.writeFileSync(`${dir}/index.html`, page('Portfolio — Automatique, Robotique & Mécatronique', `<main id="main">${finalHero}${homeSections.join('\n')}</main>${footer}`, 'home'));
  const intro = fs.readFileSync(`${backup}/${dir}/into.html`, 'utf8').replace('src="images/a.png"', 'src="images/moi.jpeg"').replace('>Introduction</h1>', '>À propos</h1>');
  fs.writeFileSync(`${dir}/into.html`, page('À propos', `<main id="main" class="standalone">${clean(element(intro, 'section', 'main')).replace('id="main"', 'id="intro"')}</main>`));
  for (const [file, index, title] of [['comp.html',1,'Compétences'], ['work.html',2,'Projets'], ['contact.html',3,'Contact']]) {
    fs.writeFileSync(`${dir}/${file}`, page(title, `<main id="main" class="standalone">${sections[index]}</main>`));
  }
  let detail = clean(element(originalDetail, 'article', 'project-page'));
  const projects = [...source.matchAll(/<a href="generic.html#([^"]+)" class="image">[^]*?<h3>([^]*?)<\/h3>/g)].map(m=>({id:m[1],title:m[2]}));
  for(const [index,project] of projects.entries()) {
    const block=element(detail,'section',project.id);
    const previous=projects[(index+projects.length-1)%projects.length];
    const next=projects[(index+1)%projects.length];
    const pagination=`<nav class="project-pagination" aria-label="Autres projets"><a href="#${previous.id}"><span>← Projet précédent</span><strong>${previous.title}</strong></a><a href="#${next.id}"><span>Projet suivant →</span><strong>${next.title}</strong></a></nav>`;
    detail=detail.replace(block,block.replace(/<\/section>\s*$/,`${pagination}</section>`));
  }
  if(dir===root)fs.writeFileSync('inventaire-projets.json',JSON.stringify(projects.map(project=>({...project,detailTitle:element(originalDetail,'section',project.id).match(/<h2>([^]*?)<\/h2>/)[1],media:[...element(originalDetail,'section',project.id).matchAll(/src="([^"]+)"/g)].map(m=>m[1])})),null,2));
  fs.writeFileSync(`${dir}/generic.html`, page('Détail du projet', `<main id="main" class="detail-main"><aside class="project-sidebar"><a class="text-link" href="index.html#projects">← Tous les projets</a><p class="eyebrow">Projets techniques</p><nav aria-label="Parcourir les projets">${[...source.matchAll(/<a href="generic.html#([^"]+)" class="image">[^]*?<h3>([^]*?)<\/h3>/g)].map(m=>`<a href="#${m[1]}">${m[2]}</a>`).join('')}</nav></aside>${detail}</main>`, 'detail'));
  fs.mkdirSync(`${dir}/assets/css`, {recursive:true});
  fs.mkdirSync(`${dir}/assets/js`, {recursive:true});
  if(dir!==root)for(const asset of ['css/portfolio.css','js/portfolio.js'])fs.copyFileSync(`${root}/assets/${asset}`,`${dir}/assets/${asset}`);
}
console.log('12 pages reconstruites depuis les contenus sauvegardés.');
