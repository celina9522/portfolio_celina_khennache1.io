# Portfolio — KHENNACHE Celina-Fathma

## Ouvrir le site

Depuis ce dossier, double-cliquer sur **lancer-portfolio.cmd**, puis ouvrir **http://localhost:4173**. Node.js est nécessaire (déjà présent sur cet ordinateur). Garder la fenêtre du serveur ouverte ; `Ctrl+C` arrête le serveur.

Autre possibilité dans un terminal :

```powershell
node tools/serve.mjs
```

Avec Live Server dans VS Code : ouvrir `portfolio_celina_khennache1.io/index.html`, puis choisir **Open with Live Server**. Le site fonctionne également en ouvrant directement ce fichier dans le navigateur.

## Organisation

- `portfolio_celina_khennache1.io/index.html` : accueil, introduction, compétences, 13 projets et contact.
- `generic.html#…` : vues détaillées des 13 projets, avec les adresses originales.
- `into.html`, `comp.html`, `work.html`, `contact.html` : pages autonomes.
- `assets/css/portfolio.css` et `assets/js/portfolio.js` : styles et interactions de la refonte.
- `html5up-dimension/` : seconde arborescence conservée et modernisée.
- `sauvegarde-originale/` : copie intégrale du dossier initial, créée avant les modifications.
- `verification-contenu.json` : résultat du contrôle de conservation.
- `inventaire-projets.json` : titres et médias des 13 projets.
- `sauvegarde-avant-refonte-corporate/` : version conservée avant la nouvelle direction artistique.
- `DIRECTION-ARTISTIQUE.md` : choix visuels, limites d'accès à la référence et contrôles.

Le site est statique, sans installation de dépendances, sans compilation et compatible avec GitHub Pages. Le fichier `index.html` à la racine dirige vers le portfolio. Aucune publication n'a été effectuée.

## Conservation et contrôle

Les textes, titres de projets, descriptions, listes, liens de contenu et chemins des médias proviennent des fichiers originaux. Les éléments de démonstration du template sont conservés dans le volet « Éléments du site original ». Les anciennes ressources CSS/JS restent présentes, mais ne sont plus chargées.

Vérification reproductible, sans dépendance :

```powershell
node tools/verify.mjs
```

Le contrôle compare les paragraphes, titres, listes, libellés, liens et médias aux fichiers sauvegardés et recherche les chemins et ancres manquants. Il couvre les deux arborescences.

Les licences originales `LICENSE.txt` et `README.txt` et les mentions HTML5 UP sont conservées. Les dépendances de test dans `tools/qa` servent uniquement au contrôle navigateur et ne sont jamais utilisées par le site.

## Points présents dans le site original

- La durée du stage varie : **3 à 4 mois** dans l'introduction et les coordonnées, **4 à 6 mois** dans le texte de contact. Les deux versions sont conservées.
- La vidéo **images/vd.mp4** est référencée par le projet d'empileur / dépileur de palettes, mais absente des deux arborescences. Le chemin et le lecteur sont conservés en attendant une décision ou le fichier.
- L'accroche de la seconde arborescence se termine par « Innover... », celle de la principale par « Innover. ». Chaque version est conservée.
- Les fichiers `comp.html`, `contact.html` et `work.html` étaient vides. Ils reprennent maintenant les sections originales correspondantes, en intégralité.
- Le lien d'attribution « Celina Khennache » pointe vers HTML5 UP dans l'original. Sa destination reste identique.
