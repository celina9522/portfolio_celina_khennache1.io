import fs from 'node:fs';
const target='sauvegarde-avant-refonte-corporate';
if(fs.existsSync(target))throw new Error('Sauvegarde déjà présente ; aucune écrasement effectué.');
fs.mkdirSync(target);
fs.cpSync('portfolio_celina_khennache1.io',`${target}/portfolio_celina_khennache1.io`,{recursive:true});
fs.cpSync('tools/refonte.mjs',`${target}/refonte.mjs`);
console.log(`Sauvegarde créée : ${target}`);
