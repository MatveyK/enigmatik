// Keep these identifiers stable once the physical cards have been printed.
export const stories = [
  { id: "mail-suspicieux", title: "Un mail suspicieux", passwords: ["TEST"], content: [] },
  { id: "message-audio", title: "Un message vocal", passwords: ["TEST"], content: [] },
  {
    id: "conversation-justine",
    title: "Une conversation incriminante ?",
    passwords: ["Justine12"],
    content: [
      { type: "text", text: "Extrait d’une conversation WhatsApp entre Justine et son copain, retrouvé sur le téléphone de Justine." },
      {
        type: "chat", contact: "Son copain", owner: "Justine",
        messages: [
          { sender: "Justine", time: "21:14", text: "J’ai récupéré ton pull tout à l’heure. Il sentait un parfum que je connais très bien." },
          { sender: "Son copain", time: "21:14", text: "Quel parfum ?" },
          { sender: "Justine", time: "21:15", text: "Celui de ma meilleure copine. Je le reconnaîtrais entre mille." },
          { sender: "Son copain", time: "21:16", text: "On s’est croisés aujourd’hui, c’est tout." },
          { sender: "Justine", time: "21:16", text: "Juste croisés ? Son parfum est resté sur ton pull. Tu me trompes avec elle ?" },
          { sender: "Son copain", time: "21:17", text: "Non, Justine. Ce n’est pas ce que tu crois. Laisse-moi t’expliquer." },
          { sender: "Justine", time: "21:18", text: "C’est ma meilleure copine… Je vous faisais confiance à tous les deux." },
          { sender: "Son copain", time: "21:19", text: "On peut se voir pour en parler ?" },
          { sender: "Justine", time: "21:20", text: "Pas ce soir. J’ai besoin de réfléchir." },
        ],
      },
    ],
  },
  { id: "article-revelateur", title: "L'article révélateur", passwords: ["TEST"], content: [] },
  { id: "declaration", title: "Une déclaration", passwords: ["TEST"], content: [] },
  { id: "liste-achats", title: "Liste d'achats", passwords: ["TEST"], content: [] },
];
