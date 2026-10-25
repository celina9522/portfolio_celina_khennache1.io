import fs from 'node:fs';
const links=JSON.parse(fs.readFileSync('content/liens-profil.json','utf8'));
const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const anchor=(key,label)=>`<a href="${escape(links[key])}" target="_blank" rel="noopener noreferrer" title="${label} — nouvel onglet">${label} <span aria-hidden="true">↗</span></a>`;
export const profileHeader=`<span class="profile-links">${anchor('cv','CV')}${anchor('linkedin','LinkedIn')}</span>`;
export const profileFooter=`<footer class="profile-footer"><nav aria-label="CV et profil professionnel">${anchor('cv','Mon CV')}${anchor('linkedin','LinkedIn')}</nav></footer>`;
export const profileContact=`<nav class="contact-profile-links" aria-label="CV et LinkedIn">${anchor('cv','Mon CV')}${anchor('linkedin','LinkedIn')}</nav>`;
