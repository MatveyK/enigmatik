// Edit the game here. Blocks support text, code, quote, table, image and audio.
// Keep identifiers stable after printing QR codes. See README.md for examples.
const text = (text) => ({ type: "text", text });
const code = (text) => ({ type: "code", text });
const quote = (text) => ({ type: "quote", text });
const choices = (...labels) => labels.map((label, index) => ({ id: String.fromCharCode(65 + index), label }));

export const audioTranscript = "Si vous écoutez ce message, c’est que vous avez retrouvé mon téléphone. Je n’ai pas pu rejoindre la gare. Quelqu’un m’attendait près de l’entrée principale. J’ai fait demi-tour et je suis passé par le café. Cherchez le vieux tunnel, derrière le bâtiment. J’y ai laissé une enveloppe. Ne tirez pas de conclusions trop vite : un téléphone peut changer de mains. Suivez les indices. Je compte sur vous.";

export const riddles = [
  {
    id: "01", title: "Le dernier lieu connu", subtitle: "Le message ASCII", skill: "Binaire → ASCII", difficulty: 2, type: "text",
    prompt: [text("Sur l’ordinateur de la personne disparue, les enquêteurs retrouvent cette suite :"), code("01000011 01000001 01000110 01000101"), text("Un post-it posé à côté indique :"), quote("Chaque groupe de 8 bits correspond à un caractère ASCII.")],
    question: "À l’aide d’une table ASCII, décodez le message. Quel mot obtenez-vous ?",
    label: "Le mot décodé", acceptedAnswers: ["CAFE"], displayAnswer: "CAFE",
    explanation: [code("01000011 = C\n01000001 = A\n01000110 = F\n01000101 = E")],
    afterAnswer: [text("Le café… C’est peut-être le dernier endroit où la personne disparue a été vue.")],
  },
  {
    id: "02", title: "Le SMS chiffré", subtitle: "Sur les traces de César", skill: "Chiffrement de César", difficulty: 2, type: "choice",
    prompt: [text("Le téléphone de la personne disparue contient cet étrange message :"), code("JDUDJH"), text("Les enquêteurs trouvent également cette note :"), quote("César avançait toujours de trois lettres. Pour lire le message, fais donc l’inverse."), text("Par exemple :"), code("D → A\nE → B\nF → C")],
    question: "Que signifie JDUDJH ?", choices: choices("GARAGE", "JARDIN", "SECRET", "DEPART"), correctChoice: "A", displayAnswer: "GARAGE",
    explanation: [text("Il faut reculer de trois lettres dans l’alphabet."), code("J → G\nD → A\nU → R\nD → A\nJ → G\nH → E")],
    afterAnswer: [text("Le garage devient un nouvel endroit à fouiller.")],
  },
  {
    id: "03", title: "L’heure du rendez-vous", subtitle: "Une rencontre en binaire", skill: "Nombres binaires", difficulty: 2, type: "text", match: "time",
    prompt: [text("Dans l’agenda numérique de la personne disparue, l’heure d’un rendez-vous a été remplacée par ceci :"), code("Heures :   10010\nMinutes :  101101")],
    hint: [text("Chaque nombre est écrit en binaire. De droite à gauche, les positions correspondent aux valeurs :"), code("1, 2, 4, 8, 16, 32…")],
    question: "À quelle heure avait lieu le rendez-vous ?", label: "L’heure du rendez-vous", inputHelp: "Vous pouvez écrire l’heure sous la forme 09:30 ou 9 h 30.", acceptedAnswers: ["18:45"], displayAnswer: "18 h 45",
    explanation: [code("10010 = 16 + 2 = 18\n101101 = 32 + 8 + 4 + 1 = 45")],
    afterAnswer: [text("18 h 45 : vous connaissez maintenant l’heure exacte du rendez-vous.")],
  },
  {
    id: "04", title: "La photo compressée", subtitle: "Une image, un numéro", skill: "Compression · RLE", difficulty: 3, type: "text",
    prompt: [text("Une caméra de surveillance a enregistré une minuscule image en noir et blanc. Pour économiser de la mémoire, chaque ligne a été compressée."), text("Chaque paire de symboles signifie :"), code("nombre de cases + couleur\n\n0 = blanc □\n1 = noir  ■"), text("Par exemple, 30 21 30 signifie :"), code("□□□■■□□□"), text("Décompressez les cinq lignes suivantes :"), code("51\n40 11\n30 11 10\n20 11 20\n10 11 30")],
    question: "Quel numéro de casier apparaît dans l’image décompressée ?", label: "Le numéro du casier", acceptedAnswers: ["7", "sept", "casier 7", "casier numéro 7"], displayAnswer: "7",
    explanation: [text("Chaque ligne comporte cinq cases. Les cases noires dessinent le chiffre 7."), code("■■■■■\n□□□□■\n□□□■□\n□□■□□\n□■□□□")],
    afterAnswer: [text("Le casier numéro 7 mérite un examen attentif.")],
  },
  {
    id: "05", title: "Le mot de passe oublié", subtitle: "Trois chiffres, une seule possibilité", skill: "Logique informatique", difficulty: 3, type: "choice",
    prompt: [text("Pour accéder au dernier fichier de la personne disparue, il faut trouver un code à trois chiffres. Le programme affiche :"), code("Le premier chiffre est supérieur à 3.\nLe deuxième chiffre est le double du premier.\nLe troisième chiffre est égal au premier + 1.\nTous les chiffres doivent être inférieurs à 10.")],
    question: "Quel code respecte toutes les conditions ?", choices: choices("3 – 6 – 4", "4 – 8 – 5", "5 – 10 – 6", "4 – 6 – 5"), correctChoice: "B", displayAnswer: "485",
    explanation: [code("Premier chiffre : 4\nDeuxième chiffre : 4 × 2 = 8\nTroisième chiffre : 4 + 1 = 5"), text("Toutes les conditions sont respectées. Un premier chiffre de 5 ou plus donnerait un deuxième nombre à deux chiffres.")],
  },
  {
    id: "06", title: "Le fichier mystérieux", subtitle: "La bonne extension", skill: "Fichiers et extensions", difficulty: 1, type: "choice",
    prompt: [text("Sur l’ordinateur de la personne disparue se trouvent quatre fichiers :"), code("vacances.jpg\nmusique.mp3\nmessage.txt\nprogramme.exe"), text("Un enquêteur affirme :"), quote("La personne disparue a laissé un message écrit juste avant de disparaître.")],
    question: "Quel fichier devriez-vous ouvrir en premier ?", choices: choices("vacances.jpg", "musique.mp3", "message.txt", "programme.exe"), correctChoice: "C", displayAnswer: "message.txt",
    explanation: [text("L’extension .txt correspond généralement à un fichier contenant du texte.")],
    afterAnswer: [text("Dans le fichier, vous découvrez ces mots :"), quote("Ne cherchez pas chez moi. Cherchez l’endroit où nous avons cours le jeudi matin.")],
  },
  {
    id: "07", title: "Où faut-il chercher ?", subtitle: "Le message en hexadécimal", skill: "Hexadécimal → ASCII", difficulty: 2, type: "text",
    prompt: [text("Dans un fichier supprimé du téléphone de la personne disparue, les enquêteurs récupèrent cette suite :"), code("4C 4F 43 41 4C 20 31 32")],
    hint: [text("Chaque nombre hexadécimal représente un caractère dans la table ASCII. Par exemple :"), code("41 = A\n42 = B\n43 = C")],
    question: "Quel message est caché ?", label: "Le message décodé", acceptedAnswers: ["LOCAL 12"], displayAnswer: "LOCAL 12",
    explanation: [code("4C = L\n4F = O\n43 = C\n41 = A\n4C = L\n20 = espace\n31 = 1\n32 = 2")],
    afterAnswer: [text("Un nouvel indice vous attend peut-être dans le local 12.")],
  },
  {
    id: "08", title: "Le programme du cadenas", subtitle: "Suivez les instructions", skill: "Lecture d’un pseudo-code", difficulty: 3, type: "choice",
    prompt: [text("À côté d’un cadenas électronique, les enquêteurs trouvent ce petit programme :"), code("code = 2\ncode = code * 3\ncode = code + 4\ncode = code / 2"), text("Le résultat final donne le numéro à entrer dans le cadenas.")],
    question: "Quel est le code ?", choices: choices("4", "5", "7", "10"), correctChoice: "B", displayAnswer: "5",
    explanation: [text("On applique les instructions dans l’ordre :"), code("2 × 3 = 6\n6 + 4 = 10\n10 / 2 = 5")],
  },
  {
    id: "09", title: "Le message caché", subtitle: "Dans les coulisses d’une page web", skill: "HTML et commentaires", difficulty: 2, type: "text",
    prompt: [text("La personne disparue avait commencé à créer une petite page web. À l’écran, on ne voit que :"), quote("Bienvenue sur mon site !"), text("Mais lorsque les enquêteurs regardent le code source, ils découvrent ceci :"), code("<html>\n  <body>\n    <h1>Bienvenue sur mon site !</h1>\n\n    <!-- Cherchez sous le pont -->\n\n  </body>\n</html>")],
    hint: [text("Dans le langage HTML, ce qui est placé entre <!-- et --> est un commentaire. Un commentaire est présent dans le code, mais n’est normalement pas affiché sur la page web.")],
    question: "Quel indice la personne disparue a-t-elle laissé ?", label: "L’indice caché", acceptedAnswers: ["Cherchez sous le pont", "sous le pont", "chercher sous le pont"], displayAnswer: "Cherchez sous le pont.",
    explanation: [text("Le commentaire HTML contient l’indication « Cherchez sous le pont ». Le navigateur ne l’affiche pas dans la page, mais il reste visible dans son code source.")],
    afterAnswer: [text("Le pont devient un nouveau lieu à examiner dans l’enquête.")],
  },
  {
    id: "10", title: "Qui a utilisé l’ordinateur ?", subtitle: "Une trace sur le réseau", skill: "Réseaux et adresse IP", difficulty: 2, type: "choice",
    prompt: [text("Les enquêteurs examinent le réseau Wi-Fi de l’école. Le journal informatique indique :"), code("18:41 — fichier SECRET.txt ouvert\nAppareil : 192.168.1.37"), text("Ils trouvent ensuite la liste des appareils connectés :"), code("Ordinateur de Léa     192.168.1.21\nTéléphone de Jonas    192.168.1.37\nTablette de Mia       192.168.1.42\nOrdinateur du prof    192.168.1.58")],
    question: "Quel appareil a ouvert le fichier SECRET.txt à 18 h 41 ?", choices: choices("L’ordinateur de Léa", "Le téléphone de Jonas", "La tablette de Mia", "L’ordinateur du professeur"), correctChoice: "B", displayAnswer: "Le téléphone de Jonas",
    explanation: [text("L’adresse IP 192.168.1.37 indiquée dans le journal correspond au téléphone de Jonas.")],
    afterAnswer: [text("Cela ne signifie pas forcément que Jonas est coupable. Son téléphone pourrait avoir été volé, emprunté, utilisé par quelqu’un d’autre ou laissé sans surveillance. Attention aux fausses pistes.")],
  },
  {
    id: "11", title: "La porte logique", subtitle: "Deux conditions pour entrer", skill: "Logique booléenne · ET / AND", difficulty: 3, type: "choice",
    prompt: [text("Une porte électronique protège une pièce dans laquelle pourrait se trouver un indice. Le programme de la porte contient cette condition :"), code("SI carte_valide = VRAI\nET code_correct = VRAI\nALORS\n    ouvrir_porte"), text("Les enquêteurs testent quatre situations :"), { type: "table", headers: ["Situation", "Carte valide", "Code correct"], rows: [["A", "Faux", "Faux"], ["B", "Vrai", "Faux"], ["C", "Faux", "Vrai"], ["D", "Vrai", "Vrai"]] }],
    question: "Dans quelle situation la porte s’ouvrira-t-elle ?", choices: choices("Situation A", "Situation B", "Situation C", "Situation D"), correctChoice: "D", displayAnswer: "Situation D : carte valide ET code correct",
    explanation: [text("Le mot logique ET / AND signifie que les deux conditions doivent être vraies en même temps."), code("carte_valide = VRAI\nET\ncode_correct = VRAI")],
    afterAnswer: [text("La porte s’ouvre. Derrière, une enveloppe vous attend…")],
  },
  {
    id: "12", title: "Le chemin le plus rapide", subtitle: "Reconstituez le trajet", skill: "Algorithmique · Plus court chemin", difficulty: 4, type: "route",
    prompt: [text("Une caméra montre la personne disparue quittant le bâtiment principal. Les enquêteurs pensent qu’elle voulait rejoindre la gare le plus rapidement possible."), text("Son téléphone contient les durées estimées entre différents endroits :"), code("École → Parc : 4 min\nÉcole → Café : 3 min\n\nParc → Gare : 5 min\nParc → Café : 2 min\n\nCafé → Gare : 8 min\nCafé → Tunnel : 2 min\n\nTunnel → Gare : 2 min")],
    question: "Quel est le chemin le plus rapide entre l’école et la gare ? Calculez également la durée totale.",
    correctRoute: ["École", "Café", "Tunnel", "Gare"], correctMinutes: 7, displayAnswer: "École → Café → Tunnel → Gare · 7 minutes",
    explanation: [code("Chemin 1 : École → Parc → Gare\n4 + 5 = 9 minutes\n\nChemin 2 : École → Café → Gare\n3 + 8 = 11 minutes\n\nChemin 3 : École → Café → Tunnel → Gare\n3 + 2 + 2 = 7 minutes"), text("Le troisième chemin est le plus rapide.")],
    afterAnswer: [text("Le tunnel : voilà votre nouvel indice. La personne disparue est probablement passée par cet endroit.")],
  },
].map((riddle) => ({ specialCode: "TODO", ...riddle }));

export const stories = [
  {
    id: "message-audio", title: "Le message vocal retrouvé", subtitle: "Une voix dans le silence",
    content: [
      text("Au fond d’une poche, le téléphone vibre une dernière fois. Un enregistrement a survécu. Dans le dossier, une enveloppe numérotée accompagne ce nouveau témoignage."),
      { type: "image", src: "assets/images/enveloppe.svg", alt: "Une enveloppe fermée, classée comme pièce 13 du dossier.", caption: "Pièce 13 · Un message à écouter attentivement." },
      { type: "audio", src: "assets/audio/message-retrouve.mp3", title: "Écouter le message retrouvé", transcript: audioTranscript },
      text("Le message s’arrête. Le vieux tunnel pourrait être la prochaine piste. Notez ce que vous venez d’apprendre, puis poursuivez votre enquête sur le terrain."),
    ],
  },
];
