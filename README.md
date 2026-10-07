# Enigmatik

Un jeu d’enquête en français pour des élèves de 15–16 ans : **12 énigmes informatiques**, **un fragment d’histoire avec narration audio**, et une **planche de QR codes à imprimer**.

Le site utilise uniquement HTML, CSS et JavaScript. Aucun compte, serveur applicatif, service externe, gestionnaire de paquets ou étape de compilation n’est nécessaire pour le publier. Les médias et le générateur de QR codes sont inclus dans le projet.

## Essayer en local

Dans le dossier du projet :

```sh
python3 -m http.server 8000
```

Ouvrir ensuite :

- Accueil : <http://localhost:8000/>
- Première énigme : <http://localhost:8000/index.html?enigme=01>
- Histoire audio : <http://localhost:8000/index.html?histoire=message-audio>
- Atelier enseignant : <http://localhost:8000/enseignant.html>

Utiliser le serveur local plutôt qu’un double-clic sur les fichiers HTML : les modules JavaScript sont chargés via HTTP. Ce serveur ne sert que les fichiers et n’ajoute aucun backend au jeu. Arrêter le serveur avec `Ctrl+C`.

## Déroulement

Chaque QR code ouvre une étape indépendante. Les élèves doivent trouver les QR suivants sur le terrain ; aucune liste des énigmes ni aucun bouton « suivant » ne figure sur leurs pages.

Une réponse non vide est nécessaire pour valider. Après validation, la page affiche la réussite ou l’erreur, la bonne réponse, son explication, le **code spécial** et, pour certaines énigmes, la suite de l’histoire. Cela fonctionne aussi après une réponse incorrecte. Le formulaire reste verrouillé jusqu’au rechargement de la page. Aucun résultat n’est enregistré ou envoyé à l’enseignant.

Les codes spéciaux valent tous `TODO` pour le moment. Ce sont des codes indépendants des réponses aux énigmes.

## Publier sur GitHub Pages

1. Créer ou choisir un dépôt GitHub. Avec GitHub Free, utiliser un dépôt public.
2. Ajouter les fichiers de ce projet à la racine du dépôt, en conservant leur structure et le fichier vide `.nojekyll`. Publier notamment `index.html`, `enseignant.html` et tout le dossier `assets/`.
3. Dans le dépôt, ouvrir **Settings → Pages → Build and deployment**.
4. Choisir **Deploy from a branch**, la branche `main` et **/(root)**, puis enregistrer.
5. Attendre la publication et copier l’URL affichée, généralement `https://votre-compte.github.io/nom-du-depot/`.
6. Ouvrir `enseignant.html` à cette adresse et préparer les QR codes.

Les liens relatifs fonctionnent aussi bien à la racine d’un domaine que sous le nom d’un dépôt. Il n’y a pas de workflow de compilation à configurer. Le dossier de travail fourni n’a pas de dépôt distant configuré ; ces instructions couvrent la publication initiale.

Références : [création d’un site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) et [publication depuis une branche](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Préparer et imprimer les QR codes

1. Ouvrir la page `enseignant.html`. Sur le site publié, son adresse de base est préremplie.
2. Vérifier l’adresse publique complète, **y compris le nom du dépôt**. Une adresse `localhost` ne fonctionnera pas depuis le téléphone d’un élève.
3. Cliquer sur **Générer les cartes**. La planche contient 12 énigmes et un fragment d’histoire ; chaque carte comporte le titre et son URL.
4. Cliquer sur **Imprimer / Enregistrer en PDF**. Le format prévu est **A4 portrait**, à l’échelle **100 %**, avec quatre cartes par page. Désactiver les en-têtes et pieds de page ajoutés par le navigateur.
5. Tester un QR code avec un téléphone avant de distribuer les cartes.

Les QR codes sont générés dans le navigateur. Aucune URL n’est envoyée à un service de QR codes. Modifier l’adresse efface les anciennes cartes pour éviter d’imprimer des QR obsolètes. Si vous changez l’adresse du site, réimprimez les cartes.

## Modifier le jeu

Le contenu se trouve dans **`assets/js/data.mjs`**. Le document `enigmes-info.md` conserve les énigmes pédagogiques d’origine, avec la correction de l’énigme 4. Le site ne lit pas automatiquement ce document : modifier les données JavaScript pour changer ce que voient les élèves.

### Une énigme

Chaque élément de `riddles` possède un `id` stable, un titre, une question, un niveau de difficulté de 1 à 5 et des blocs de contenu. **Ne changez pas les identifiants après l’impression des QR codes.**

Les champs principaux :

| Champ | Rôle |
| --- | --- |
| `prompt` | Les éléments du dossier, avant la réponse |
| `hint` | Un indice facultatif, visible dès l’ouverture |
| `story` | Des blocs d’histoire facultatifs avant l’énigme |
| `question` | La question affichée au-dessus du formulaire |
| `type` | `text`, `choice` ou `route` |
| `displayAnswer` | La bonne réponse présentée après validation |
| `explanation` | L’explication pédagogique |
| `afterAnswer` | Des blocs d’histoire révélés après validation |
| `specialCode` | Le code à remettre aux élèves ; `TODO` par défaut |

Pour changer le code d’une énigme, ajouter par exemple `specialCode: "LUNE-42"` à son objet. Le défaut `TODO` est défini à la fin de la liste.

- **Texte** : renseigner `label` et `acceptedAnswers`, par exemple `acceptedAnswers: ["CAFE"]`. La casse, les accents, les espaces répétés et la ponctuation finale `. ! ? …` sont ignorés. Ajouter explicitement les synonymes acceptés ; le jeu ne fait pas de correction sémantique ni de correspondance approximative.
- **Heure** : ajouter `match: "time"` et une réponse comme `"18:45"`. Les formats `18h45`, `18 h 45` et `18:45` sont équivalents.
- **QCM** : renseigner `choices: [{ id: "A", label: "…" }, …]` et `correctChoice: "A"`. Une seule réponse peut être sélectionnée.
- **Trajet** : renseigner `correctRoute` (lieux dans l’ordre) et `correctMinutes`. L’élève remplit le trajet et la durée séparément. Les flèches, virgules, tirets, points-virgules, barres obliques ou espaces sont acceptés entre les lieux. Les noms de lieux et leur ordre doivent correspondre.

Pour ajouter une énigme, copier un objet existant, lui attribuer un identifiant unique et adapter ses champs. La page enseignant l’ajoute automatiquement à la planche.

### Texte, images et audio

Les listes de blocs acceptent ces formats, dans les questions comme dans les histoires :

```js
{ type: "text", text: "Vous retrouvez une enveloppe." }
{ type: "code", text: "01000011 01000001 01000110 01000101" }
{ type: "quote", text: "Un message laissé par un témoin." }
{ type: "table", headers: ["Lieu", "Durée"], rows: [["Gare", "7 min"]] }
{ type: "image", src: "assets/images/indice.jpg", alt: "Description de l’indice", caption: "Une photographie retrouvée." }
{ type: "audio", src: "assets/audio/indice.mp3", title: "Écouter le témoin", transcript: "Texte complet de l’enregistrement." }
```

Les chemins de médias sont relatifs à la racine du site, sans `/` initial, pour conserver la compatibilité GitHub Pages. Fournir une description pour chaque image et une transcription pour chaque audio. Les textes et exemples HTML sont affichés comme du texte, jamais exécutés comme du HTML.

### L’histoire audio

La liste `stories` contient l’exemple `message-audio`. Ajouter un objet avec `id`, `title`, `subtitle` et `content` pour créer une autre histoire. Son lien sera `index.html?histoire=son-identifiant` et sa carte apparaîtra automatiquement dans l’atelier.

L’exemple comprend une illustration SVG originale et une vraie narration MP3 en français, créée avec la voix système macOS **Thomas**. Le lecteur ne démarre jamais automatiquement. Une transcription et un lien de téléchargement restent disponibles.

Pour utiliser votre propre enregistrement, remplacer `assets/audio/message-retrouve.mp3` et mettre à jour `audioTranscript` dans les données. Pour régénérer la narration de démonstration sur macOS avec la voix Thomas installée et FFmpeg disponible :

```sh
node scripts/generate-audio.mjs
```

Ce script est un outil facultatif de création ; il n’est pas utilisé par le site publié. Le fichier MP3 est déjà inclus.

## Vérifier les réponses

Avec Node.js 20 ou plus récent, sans installer de dépendances :

```sh
node --test
```

Les tests couvrent les douze réponses, tous les distracteurs des QCM, les variantes textuelles, les formats d’heure, le trajet et la durée, la grille RLE, les URL des stations et les chemins de médias.

Après une modification, vérifier aussi dans un navigateur une réponse juste, une réponse fausse et une réponse vide, l’affichage sur téléphone, la lecture audio et l’aperçu d’impression. Scanner un QR imprimé pour confirmer sa destination.

## Fonctionnement et dépendances

Les réponses sont vérifiées côté navigateur. Le code source contient les solutions et la page enseignant est publique ; le jeu ne vise pas à empêcher leur consultation. Il ne stocke aucune progression, n’utilise ni cookies ni stockage local et n’effectue aucun suivi.

Le générateur QR est une copie locale de **qrcode-generator 2.0.4**, de Kazuhiko Arase, sous licence MIT : `assets/vendor/qrcode.mjs` et `assets/vendor/qrcode-LICENSE.txt`. [Projet d’origine](https://github.com/kazuhikoarase/qrcode-generator). Aucune dépendance n’est chargée depuis un CDN à l’exécution.
