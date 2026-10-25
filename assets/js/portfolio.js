/* Interactions progressives : le contenu reste lisible sans JavaScript. */
document.documentElement.classList.add('js');

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('is-open'); menu.setAttribute('aria-expanded','false'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded',String(open)); navigation.classList.toggle('is-open',open); });
navigation.addEventListener('click', event => { if(event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if(event.key === 'Escape' && menu.getAttribute('aria-expanded')==='true') { closeMenu(); menu.focus(); } });
document.addEventListener('click', event => { if(!event.target.closest('.site-header')) closeMenu(); });
matchMedia('(min-width: 851px)').addEventListener('change',closeMenu);
const header = document.querySelector('.site-header');
const updateHeader = () => header.classList.toggle('is-scrolled',scrollY>20);
window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
document.querySelectorAll('[data-close-stage]').forEach(link=>{
  link.addEventListener('click',event=>{
    const details=link.closest('details');
    if(!details)return;
    event.preventDefault();details.open=false;
    const summary=details.querySelector('summary');
    summary.focus({preventScroll:true});
    summary.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  });
});

// État initial des rubriques sur les pages autonomes et détaillées.
if(!document.body.classList.contains('home')) {
  const section=blocksSection();
  navigation.querySelectorAll('a').forEach(link=>{if(link.hash===`#${section}`)link.setAttribute('aria-current','page');});
}

function blocksSection(){return document.body.classList.contains('detail')?'projects':document.querySelector('.standalone>article,.standalone>section')?.id;}

const blocks = [...document.querySelectorAll('.project-block')];
function selectProject() {
  const id = decodeURIComponent(location.hash.slice(1));
  const target = blocks.find(block => block.id === id);
  document.body.classList.toggle('has-project',Boolean(target));
  blocks.forEach(block => block.classList.toggle('active',block === target));
  document.querySelectorAll('.project-sidebar nav a').forEach(link => {
    if(link.hash === location.hash && target) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
  });
  const title = target?.querySelector('h2')?.textContent;
  if(title) document.title = `${title} | KHENNACHE Celina-Fathma`;
  if(target) window.scrollTo({top:0,behavior:'instant'});
}
if(blocks.length) { selectProject(); window.addEventListener('hashchange',selectProject); }

if('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(!entry.isIntersecting) return;
      navigation.querySelectorAll('a').forEach(link => { if(link.hash === `#${entry.target.id}`) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
    });
  }, {rootMargin:'-15% 0px -60% 0px',threshold:0});
  document.querySelectorAll('.home #main>article,.home .hero').forEach(section=>sectionObserver.observe(section));
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting) { entry.target.classList.remove('pending'); observer.unobserve(entry.target); }
    }), {threshold:.06});
    document.querySelectorAll('.posts>section,.features>section,.home #intro>section>h1,.home #contact>h1,.home #main>article>header,.stage-content>section').forEach(node=>{node.classList.add('reveal','pending');observer.observe(node);});
  }
}
document.querySelectorAll('img').forEach(image=>{if(!image.closest('.hero')){image.loading='lazy';image.decoding='async';}});
document.querySelectorAll('video').forEach(video=>{video.preload='metadata';video.setAttribute('aria-label',video.closest('.project-block')?.querySelector('h2')?.textContent || 'Vidéo du projet');});

// Zoom clavier et souris des illustrations techniques, sans modifier les médias.
if(blocks.length && 'HTMLDialogElement' in window) {
  const dialog = document.createElement('dialog');
  dialog.className='lightbox'; dialog.setAttribute('aria-label','Illustration du projet agrandie');
  const close = document.createElement('button'); close.textContent='×';close.setAttribute('aria-label','Fermer l’illustration');
  const image = document.createElement('img'); dialog.append(close,image); document.body.append(dialog);
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  document.querySelectorAll('.project-block img').forEach(thumbnail=>{
    if(!thumbnail.hasAttribute('alt')) thumbnail.alt='Illustration technique du projet';
    const button=document.createElement('button');button.type='button';button.className='image-zoom';button.setAttribute('aria-label',`Agrandir : ${thumbnail.alt}`);
    thumbnail.replaceWith(button);button.append(thumbnail);
    button.addEventListener('click',()=>{image.src=thumbnail.src;image.alt=thumbnail.alt;dialog.showModal();});
  });
}
