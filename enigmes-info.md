# Énigmes informatiques – Jeu de mystère

Public cible : élèves de 15–16 ans, première année de gymnase
Thème général : disparition mystérieuse / enquête
Domaines abordés : codage, binaire, hexadécimal, ASCII, chiffrement, compression, logique, algorithmique, réseaux et web

---

## 1. Le message ASCII — « Le dernier lieu connu »

**Type :** réponse ouverte
**Compétence :** binaire → ASCII
**Difficulté :** ★★☆☆☆

Sur l’ordinateur de la personne disparue, les enquêteurs retrouvent cette suite :

```text
01000011 01000001 01000110 01000101
```

Un post-it posé à côté indique :

> Chaque groupe de 8 bits correspond à un caractère ASCII.

### Question

À l’aide d’une table ASCII, décodez le message.

Quel mot obtenez-vous ?

### Solution

```text
01000011 = C
01000001 = A
01000110 = F
01000101 = E
```

**Réponse :** `CAFE`

### Utilisation dans le mystère

Cela peut indiquer le dernier endroit où la personne disparue a été vue.

---

## 2. Le SMS chiffré — César

**Type :** QCM
**Compétence :** chiffrement de César
**Difficulté :** ★★☆☆☆

Le téléphone de la personne disparue contient cet étrange message :

```text
JDUDJH
```

Les enquêteurs trouvent également cette note :

> César avançait toujours de trois lettres.
> Pour lire le message, fais donc l’inverse.

Par exemple :

```text
D → A
E → B
F → C
```

### Question

Que signifie `JDUDJH` ?

- A. GARAGE
- B. JARDIN
- C. SECRET
- D. DEPART

### Solution

**Bonne réponse : A. GARAGE**

```text
J → G
D → A
U → R
D → A
J → G
H → E
```

### Utilisation dans le mystère

Le mot obtenu peut indiquer un nouvel endroit à fouiller.

---

## 3. L’heure du rendez-vous

**Type :** réponse ouverte
**Compétence :** nombres binaires
**Difficulté :** ★★☆☆☆

Dans l’agenda numérique de la personne disparue, l’heure d’un rendez-vous a été remplacée par ceci :

```text
Heures :   10010
Minutes :  101101
```

### Indice

Chaque nombre est écrit en binaire.

Les positions correspondent aux valeurs :

```text
1, 2, 4, 8, 16, 32...
```

### Question

À quelle heure avait lieu le rendez-vous ?

### Solution

```text
10010 = 16 + 2 = 18
101101 = 32 + 8 + 4 + 1 = 45
```

**Réponse :** `18 h 45`

### Utilisation dans le mystère

Les élèves découvrent ainsi l’heure exacte à laquelle un événement important a eu lieu.

---

## 4. La photo compressée

**Type :** réponse ouverte
**Compétence :** compression simple / Run-Length Encoding
**Difficulté :** ★★★☆☆

Une caméra de surveillance a enregistré une minuscule image en noir et blanc.

Pour économiser de la mémoire, chaque ligne a été compressée.

Chaque paire de symboles signifie :

```text
nombre de cases + couleur
```

avec :

```text
0 = blanc □
1 = noir  ■
```

Par exemple :

```text
30 21 30
```

signifie :

```text
□□□■■□□□
```

Décompressez les cinq lignes suivantes :

```text
51
40 11
30 11 10
20 11 20
10 11 30
```

### Question

Quel numéro de casier apparaît dans l’image décompressée ?

### Solution

```text
■■■■■
□□□□■
□□□■□
□□■□□
□■□□□
```

Chaque ligne comporte cinq cases. Les cases noires dessinent le chiffre **7**.

**Réponse :** `7`

### Utilisation dans le mystère

L’image révèle un grand **7**, indiquant le casier numéro 7.

---

## 5. Le mot de passe oublié

**Type :** QCM
**Compétence :** logique informatique
**Difficulté :** ★★★☆☆

Pour accéder au dernier fichier de la personne disparue, il faut trouver un code à trois chiffres.

Le programme affiche :

```text
Le premier chiffre est supérieur à 3.
Le deuxième chiffre est le double du premier.
Le troisième chiffre est égal au premier + 1.
Tous les chiffres doivent être inférieurs à 10.
```

### Question

Quel code respecte toutes les conditions ?

- A. 3 – 6 – 4
- B. 4 – 8 – 5
- C. 5 – 10 – 6
- D. 4 – 6 – 5

### Solution

**Bonne réponse : B. 485**

Car :

```text
Premier chiffre : 4
Deuxième chiffre : 4 × 2 = 8
Troisième chiffre : 4 + 1 = 5
```

Toutes les conditions sont respectées.

---

## 6. Le fichier mystérieux

**Type :** QCM
**Compétence :** fichiers et extensions
**Difficulté :** ★☆☆☆☆

Sur l’ordinateur de la personne disparue se trouvent quatre fichiers :

```text
vacances.jpg
musique.mp3
message.txt
programme.exe
```

Un enquêteur affirme :

> La personne disparue a laissé un message écrit juste avant de disparaître.

### Question

Quel fichier devriez-vous ouvrir en premier ?

- A. `vacances.jpg`
- B. `musique.mp3`
- C. `message.txt`
- D. `programme.exe`

### Solution

**Bonne réponse : C. `message.txt`**

L’extension `.txt` correspond généralement à un fichier contenant du texte.

### Utilisation dans le mystère

Le fichier pourrait contenir un indice, par exemple :

> Ne cherchez pas chez moi. Cherchez l’endroit où nous avons cours le jeudi matin.

---

## 7. Le message en hexadécimal — « Où faut-il chercher ? »

**Type :** réponse ouverte
**Compétence :** HEX → ASCII
**Difficulté :** ★★☆☆☆

Dans un fichier supprimé du téléphone de la personne disparue, les enquêteurs récupèrent cette suite :

```text
4C 4F 43 41 4C 20 31 32
```

### Indice

Chaque nombre hexadécimal représente un caractère dans la table ASCII.

Par exemple :

```text
41 = A
42 = B
43 = C
```

### Question

Quel message est caché ?

### Solution

```text
4C = L
4F = O
43 = C
41 = A
4C = L
20 = espace
31 = 1
32 = 2
```

**Réponse :** `LOCAL 12`

### Utilisation dans le mystère

Les élèves savent désormais qu’ils doivent chercher un indice dans le **local 12**.

---

## 8. Le programme du cadenas

**Type :** QCM
**Compétence :** lecture d’un pseudo-code
**Difficulté :** ★★★☆☆

À côté d’un cadenas électronique, les enquêteurs trouvent ce petit programme :

```text
code = 2
code = code * 3
code = code + 4
code = code / 2
```

Le résultat final donne le numéro à entrer dans le cadenas.

### Question

Quel est le code ?

- A. 4
- B. 5
- C. 7
- D. 10

### Solution

**Bonne réponse : B. 5**

```text
2 × 3 = 6
6 + 4 = 10
10 / 2 = 5
```

### Variante plus difficile

Supprimer les réponses proposées et demander directement aux élèves de calculer le résultat.

---

## 9. Le message caché dans une page web

**Type :** réponse ouverte
**Compétence :** HTML / commentaires dans le code
**Difficulté :** ★★☆☆☆

La personne disparue avait commencé à créer une petite page web.

À l’écran, on ne voit que :

> **Bienvenue sur mon site !**

Mais lorsque les enquêteurs regardent le code source, ils découvrent ceci :

```html
<html>
  <body>
    <h1>Bienvenue sur mon site !</h1>

    <!-- Cherchez sous le pont -->

  </body>
</html>
```

### Indice

Dans le langage HTML, ce qui est placé entre `<!--` et `-->` est un **commentaire**.

Un commentaire est présent dans le code, mais n’est normalement pas affiché sur la page web.

### Question

Quel indice la personne disparue a-t-elle laissé ?

### Solution

**Réponse :** `Cherchez sous le pont.`

### Utilisation dans le mystère

Le pont peut devenir un nouveau lieu à examiner dans l’enquête.

---

## 10. Qui a utilisé l’ordinateur ?

**Type :** QCM
**Compétence :** adresse IP / identification d’un appareil
**Difficulté :** ★★☆☆☆

Les enquêteurs examinent le réseau Wi-Fi de l’école.

Le journal informatique indique :

```text
18:41 — fichier SECRET.txt ouvert
Appareil : 192.168.1.37
```

Ils trouvent ensuite la liste des appareils connectés :

```text
Ordinateur de Léa     192.168.1.21
Téléphone de Jonas    192.168.1.37
Tablette de Mia       192.168.1.42
Ordinateur du prof    192.168.1.58
```

### Question

Quel appareil a ouvert le fichier `SECRET.txt` à 18 h 41 ?

- A. L’ordinateur de Léa
- B. Le téléphone de Jonas
- C. La tablette de Mia
- D. L’ordinateur du professeur

### Solution

**Bonne réponse : B. Le téléphone de Jonas**

L’adresse IP indiquée dans le journal est :

```text
192.168.1.37
```

Elle correspond au téléphone de Jonas.

### Utilisation dans le mystère

Cela ne signifie pas forcément que Jonas est coupable.

Son téléphone pourrait avoir été :

- volé ;
- emprunté ;
- utilisé par quelqu’un d’autre ;
- laissé sans surveillance.

Cette énigme peut donc servir à créer une **fausse piste**.

---

## 11. La porte avec une condition logique

**Type :** QCM
**Compétence :** logique booléenne — AND / ET
**Difficulté :** ★★★☆☆

Une porte électronique protège une pièce dans laquelle pourrait se trouver un indice.

Le programme de la porte contient cette condition :

```text
SI carte_valide = VRAI
ET code_correct = VRAI
ALORS
    ouvrir_porte
```

Les enquêteurs testent quatre situations :

| Situation | Carte valide | Code correct |
|---|---|---|
| A | Faux | Faux |
| B | Vrai | Faux |
| C | Faux | Vrai |
| D | Vrai | Vrai |

### Question

Dans quelle situation la porte s’ouvrira-t-elle ?

- A. Situation A
- B. Situation B
- C. Situation C
- D. Situation D

### Solution

**Bonne réponse : D. Situation D**

Le mot logique **ET / AND** signifie que les deux conditions doivent être vraies en même temps.

```text
carte_valide = VRAI
ET
code_correct = VRAI
```

### Utilisation dans le mystère

Derrière la porte, les élèves peuvent trouver :

- une enveloppe ;
- une photographie ;
- un témoignage ;
- un objet appartenant à la personne disparue ;
- un nouvel indice.

---

## 12. Quel chemin a pris la personne disparue ?

**Type :** réponse ouverte
**Compétence :** algorithmique / recherche du chemin le plus court
**Difficulté :** ★★★★☆

Une caméra montre la personne disparue quittant le bâtiment principal.

Les enquêteurs pensent qu’elle voulait rejoindre la **gare** le plus rapidement possible.

Son téléphone contient les durées estimées entre différents endroits :

```text
École → Parc : 4 min
École → Café : 3 min

Parc → Gare : 5 min
Parc → Café : 2 min

Café → Gare : 8 min
Café → Tunnel : 2 min

Tunnel → Gare : 2 min
```

### Question

Quel est le chemin le plus rapide entre **l’école et la gare** ?

Calculez également la durée totale.

### Solution

#### Chemin 1

```text
École → Parc → Gare
4 + 5 = 9 minutes
```

#### Chemin 2

```text
École → Café → Gare
3 + 8 = 11 minutes
```

#### Chemin 3

```text
École → Café → Tunnel → Gare
3 + 2 + 2 = 7 minutes
```

Le chemin le plus rapide est donc :

**École → Café → Tunnel → Gare**

**Durée totale : 7 minutes**

### Utilisation dans le mystère

Cette réponse fournit un nouvel indice important : **le tunnel**.

Les enquêteurs peuvent en déduire que la personne disparue est probablement passée par cet endroit et qu’il faut maintenant y chercher de nouveaux indices.

---

# Récapitulatif des compétences

| N° | Énigme | Compétence principale |
|---|---|---|
| 1 | Message ASCII | Binaire → ASCII |
| 2 | SMS chiffré | Chiffrement de César |
| 3 | Heure du rendez-vous | Conversion binaire |
| 4 | Photo compressée | Compression / RLE |
| 5 | Mot de passe | Logique |
| 6 | Fichier mystérieux | Extensions de fichiers |
| 7 | Message hexadécimal | HEX → ASCII |
| 8 | Programme du cadenas | Pseudo-code |
| 9 | Page web | HTML |
| 10 | Qui a utilisé l’ordinateur ? | Réseaux / adresse IP |
| 11 | Porte logique | Logique booléenne |
| 12 | Chemin le plus rapide | Algorithmique |
