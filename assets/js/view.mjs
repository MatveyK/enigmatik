export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderBlocks(blocks = []) {
  const fragment = document.createDocumentFragment();
  for (const block of blocks) {
    let node;
    switch (block.type) {
      case "text": node = el("p", "", block.text); break;
      case "code":
        node = el("pre");
        node.append(el("code", "", block.text)); // Never interpret the HTML puzzle as markup.
        break;
      case "quote": node = el("blockquote", "", block.text); break;
      case "chat": {
        node = el("figure", "chat-evidence");
        node.setAttribute("aria-label", `Conversation WhatsApp entre ${block.owner} et ${block.contact.toLocaleLowerCase("fr")}`);
        const chat = el("div", "whatsapp-chat");
        const header = el("div", "chat-header");
        const avatar = el("span", "chat-avatar", block.contact.charAt(0));
        avatar.setAttribute("aria-hidden", "true");
        const contact = el("div", "chat-contact");
        contact.append(el("p", "chat-contact-name", block.contact), el("p", "chat-app", `WhatsApp · Téléphone de ${block.owner}`));
        header.append(avatar, contact);
        const messages = el("ol", "chat-messages");
        messages.setAttribute("aria-label", "Messages dans l’ordre chronologique");
        for (const message of block.messages) {
          const bubble = el("li", `chat-message${message.sender === block.owner ? " chat-message-outgoing" : ""}`);
          const time = el("time", "chat-time", message.time);
          time.dateTime = message.time;
          bubble.append(el("p", "chat-sender", message.sender), el("p", "chat-text", message.text), time);
          messages.append(bubble);
        }
        chat.append(header, messages, el("p", "chat-excerpt-end", "Fin de l’extrait"));
        node.append(chat, el("figcaption", "", `Extrait de la conversation · Les messages de ${block.owner} apparaissent en vert.`));
        break;
      }
      case "table": {
        node = el("div", "table-wrap");
        const table = el("table");
        const head = el("thead");
        const headerRow = el("tr");
        for (const heading of block.headers) {
          const th = el("th", "", heading);
          th.scope = "col";
          headerRow.append(th);
        }
        head.append(headerRow);
        const body = el("tbody");
        for (const row of block.rows) {
          const tr = el("tr");
          for (const cell of row) tr.append(el("td", "", cell));
          body.append(tr);
        }
        table.append(head, body);
        node.append(table);
        break;
      }
      case "image": {
        node = el("figure", "story-image");
        const img = el("img");
        img.src = block.src;
        img.alt = block.alt;
        img.loading = "lazy";
        img.addEventListener("error", () => {
          img.hidden = true;
          node.prepend(el("p", "media-error", `Image indisponible : ${block.alt}`));
        }, { once: true });
        node.append(img);
        if (block.caption) node.append(el("figcaption", "", block.caption));
        break;
      }
      case "audio": {
        node = el("section", "audio-card");
        node.append(el("p", "eyebrow", "Enregistrement retrouvé"), el("h2", "", block.title));
        const audio = el("audio");
        audio.controls = true;
        audio.preload = "metadata";
        audio.src = block.src;
        audio.setAttribute("aria-label", block.title);
        const fallback = el("p", "media-error", "L’audio ne peut pas être lu. Vous pouvez le télécharger ou lire sa transcription ci-dessous.");
        fallback.hidden = true;
        fallback.setAttribute("role", "status");
        audio.addEventListener("error", () => { fallback.hidden = false; });
        const download = el("a", "audio-download", "Télécharger l’audio ↓");
        download.href = block.src;
        download.download = "";
        const transcript = el("details", "transcript");
        transcript.append(el("summary", "", "Lire la transcription"), el("p", "", block.transcript));
        node.append(audio, fallback, download, transcript);
        break;
      }
      default: throw new Error(`Type de contenu inconnu : ${block.type}`);
    }
    fragment.append(node);
  }
  return fragment;
}
