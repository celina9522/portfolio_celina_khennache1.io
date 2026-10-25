# Refonte corporate du portfolio

## Référence et limites d'observation

Référence demandée : https://www.thalesgroup.com/fr

L'accès web a renvoyé la protection Incapsula, et la tentative dans Chrome a échoué avec `ERR_CONNECTION_RESET`. L'accueil, les menus, les pages intérieures et les interactions de Thales n'ont donc pas pu être observés, ni sur ordinateur ni sur mobile. Aucun détail de leur interface n'est présenté comme vérifié.

La direction réalisée suit la description donnée dans la demande : composition corporate technologique, header blanc, titres généreux, photographies techniques, grille éditoriale, grands espacements, séparateurs fins et aplats bleus ponctuels. Aucun logo, texte, visuel, code ou actif de Thales n'est repris.

## Composition du portfolio

- Identité personnelle dans le header, cinq rubriques, menu mobile et indication de la section active.
- Accueil asymétrique : accroche et texte originaux à gauche, photographie existante `images/kuka.jpeg` à droite, lien vers le projet concerné et bouton vers la galerie. Le visuel est cadré sans déformation.
- Introduction : portrait original et texte intégral en regard sur fond gris clair.
- Compétences : neuf domaines, deux colonnes, numérotation et séparateurs.
- Projets : treize réalisations dans leur ordre original, grands visuels, deux compositions de pleine largeur sur fond bleu, accès aux descriptions originales.
- Détails : navigation entre les réalisations, titres généreux, largeur de lecture limitée, médias ajustés sans étirer les schémas, agrandissement accessible au clavier, liens précédent/suivant.
- Contact : tous les textes et les coordonnées conservés, coordonnées sur un aplat bleu.

Palette : `#092C7F`, `#FFFFFF`, `#F3F5F9`, `#252B36`, accent interactif `#2461C7`. Polices système sans chargement externe. HTML, CSS et JavaScript sans framework ni dépendance à l'exécution.

## Conservation et sauvegardes

`sauvegarde-originale` conserve le site initial. `sauvegarde-avant-refonte-corporate` conserve la version juste avant cette nouvelle refonte. `inventaire-projets.json` énumère les treize projets, leurs titres de galerie et de détail, ainsi que leurs médias.

`node tools/verify.mjs` compare les contenus éditoriaux et médias à la sauvegarde initiale : 638 blocs textuels, 98 références médias et 405 fichiers hors HTML contrôlés sur les deux arborescences. Ces nombres incluent les copies de l'arborescence secondaire.

Les résultats de contrôle navigateur et les captures sont dans `verification-visuelle`. `tools/browser-check.mjs` et `tools/final-review.mjs` utilisent uniquement l'outil local de test dans `tools/qa` ; il n'est pas nécessaire pour ouvrir ou héberger le portfolio.

## Incohérences conservées

- Stage de 3 à 4 mois dans l'introduction et les coordonnées, mais de 4 à 6 mois dans le texte de contact.
- La vidéo `images/vd.mp4` du projet d'empileur / dépileur de palettes est référencée mais absente. Le lecteur et son chemin sont conservés.
- Certains titres de galerie diffèrent des titres de détail (notamment cuve, IA, KUKA et MATLAB). Les deux versions restent inchangées.
- L'accroche de l'arborescence secondaire se termine par « Innover... » ; celle de l'arborescence principale par « Innover. ».
- Le lien historique d'attribution vers HTML5 UP est conservé tel quel.

Aucune publication n'est effectuée.
