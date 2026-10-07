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
