# Enigmatik

Enigmatik est un jeu d’enquête en français pour des élèves de 15 à 16 ans. Les participants résolvent une question sur une carte papier, scannent son QR code et saisissent leur réponse pour ouvrir une pièce de l’enquête. Les six cartes sont indépendantes. Une réponse incorrecte permet de réessayer. Recharger la page verrouille à nouveau la pièce.

## Essayer le jeu

Depuis le dossier du projet, lancer un serveur statique avec `python3 -m http.server 8000`, puis ouvrir [l’accueil](http://localhost:8000/), [la conversation de Justine](http://localhost:8000/index.html?histoire=conversation-justine) ou [l’atelier enseignant](http://localhost:8000/enseignant.html).

La conversation s’ouvre avec `Justine12`. Les cinq autres pages utilisent le mot de passe provisoire `TEST` et affichent un texte d’attente.

## Préparer les QR codes

1. Ouvrir `enseignant.html` et vérifier l’adresse publique du site, en incluant le chemin du dépôt. Sur le site publié, le champ est prérempli.
2. Cliquer sur **Générer les cartes** après avoir changé l’adresse. Chaque QR code ouvre la page indiquée sous son titre.
3. Choisir **Télécharger le QR code (SVG)** pour insérer un code dans la maquette d’une carte, ou **Imprimer / Enregistrer en PDF** pour obtenir la planche numérotée. Pour l’impression, choisir A4 portrait, échelle 100 %, sans en-têtes ni pieds de page.
4. Scanner une carte avec un téléphone avant l’impression finale. Une adresse `localhost` désigne l’appareil qui scanne.

## Modifier une pièce ou ses mots de passe

Les six pièces figurent dans le tableau `stories` de [data.mjs](assets/js/data.mjs), dans l’ordre d’impression. Chaque entrée contient un identifiant stable `id`, un titre `title`, les réponses acceptées `passwords` et les blocs à révéler `content`. Conserver l’identifiant et l’adresse du site après avoir imprimé les cartes.

- **Réponses.** Inscrire chaque variante sous forme de chaîne, par exemple `passwords: ["007", "sept"]`. La vérification respecte la casse et les zéros initiaux et ignore les espaces en début et en fin de saisie. Une liste vide garde la pièce verrouillée.
- **Suivi.** Reporter à la main tout changement de titre ou de réponse dans le [registre des mots de passe](mots-de-passe.md). Le site utilise directement les données JavaScript.
- **Contenu.** Une liste vide affiche le texte d’attente. Pour ajouter un paragraphe, utiliser `{ type: "text", text: "…" }`. Les blocs prennent aussi en charge les conversations (`chat`), images, enregistrements audio, citations, tableaux et extraits de code. Pour un enregistrement, renseigner `type: "audio"`, `src`, `title` et `transcript` avec un chemin relatif à la racine du site.

Les verrous font partie du jeu. Les réponses et les indices sont consultables dans les fichiers publics. Le site ne conserve aucune progression.

## Publication et vérification

Le site utilise des fichiers HTML, CSS et JavaScript statiques. Sur GitHub Pages, publier la racine de la branche `main` avec `.nojekyll`, les deux pages HTML et le dossier `assets/`. Les QR codes sont générés dans le navigateur grâce à la copie locale de [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator), distribuée sous [licence MIT](assets/vendor/qrcode-LICENSE.txt).

Exécuter `node --test` avec Node.js 20 ou ultérieur pour vérifier les six destinations, les mots de passe et les URL des QR codes.
