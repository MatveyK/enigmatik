import qrcode from "../vendor/qrcode.mjs";
import { stories } from "./data.mjs";
import { normalizeBaseUrl, stationUrl } from "./engine.mjs";
import { el } from "./view.mjs";

const form = document.querySelector("#qr-settings");
const input = document.querySelector("#base-url");
const error = document.querySelector("#url-error");
const sheet = document.querySelector("#qr-sheet");
const print = document.querySelector("#print-sheet");
const status = document.querySelector("#sheet-status");
const localNote = document.querySelector("#local-note");

function generateCards() {
  error.hidden = true;
  input.removeAttribute("aria-invalid");
  try {
    const base = normalizeBaseUrl(input.value);
    const cards = document.createDocumentFragment();
    for (const [index, story] of stories.entries()) {
      const url = stationUrl(base, story.id);
      const qr = qrcode(0, "M");
      qr.addData(url, "Byte");
      qr.make();
      const card = el("article", "qr-card");
      const label = `Carte ${index + 1}`;
      card.append(el("p", "eyebrow", label), el("h2", "", story.title));
      const graphic = el("div", "qr-image");
      const svg = qr.createSvgTag({
        cellSize: 4, margin: 16,
        title: { text: `${label} · ${story.title}`, id: `qr-${story.id}` },
      });
      // SVG comes only from the bundled generator, never from user markup.
      graphic.innerHTML = svg;
      const download = el("a", "qr-download", "Télécharger le QR code (SVG)");
      download.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      download.download = `${String(index + 1).padStart(2, "0")}-${story.id}.svg`;
      download.setAttribute("aria-label", `Télécharger le QR code (SVG) · ${story.title}`);
      const link = el("a", "qr-link", url);
      link.href = url;
      card.append(graphic, el("p", "qr-instruction", "Scannez après avoir résolu la question sur votre carte."), link, download);
      cards.append(card);
    }
    sheet.replaceChildren(cards);
    input.value = base;
    const hostname = new URL(base).hostname;
    localNote.hidden = !["localhost", "127.0.0.1", "[::1]"].includes(hostname);
    print.disabled = false;
    status.textContent = `${stories.length} QR codes prêts à imprimer ou à télécharger.`;
  } catch (cause) {
    sheet.replaceChildren();
    print.disabled = true;
    localNote.hidden = true;
    error.textContent = cause instanceof Error ? cause.message : "Cette adresse est trop longue pour un QR code. Utilisez l’adresse directe de votre site.";
    error.hidden = false;
    input.setAttribute("aria-invalid", "true");
    status.textContent = "Corrigez l’adresse pour préparer les cartes.";
  }
}

form.addEventListener("submit", (event) => { event.preventDefault(); generateCards(); });
input.addEventListener("input", () => {
  // Never allow an edited address to be printed with stale QR codes.
  sheet.replaceChildren();
  print.disabled = true;
  error.hidden = true;
  input.removeAttribute("aria-invalid");
  status.textContent = "Cliquez sur « Générer les cartes » pour appliquer cette adresse.";
});
print.addEventListener("click", () => window.print());
if (["http:", "https:"].includes(location.protocol)) {
  input.value = new URL("./", location.href).href;
  generateCards();
}
