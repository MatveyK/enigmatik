import qrcode from "../vendor/qrcode.mjs";
import { riddles, stories } from "./data.mjs";
import { normalizeBaseUrl, stationUrl } from "./engine.mjs";
import { el } from "./view.mjs";

const form = document.querySelector("#qr-settings");
const input = document.querySelector("#base-url");
const error = document.querySelector("#url-error");
const sheet = document.querySelector("#qr-sheet");
const print = document.querySelector("#print-sheet");
const status = document.querySelector("#sheet-status");
const localNote = document.querySelector("#local-note");
const stations = [...riddles.map((riddle) => ({ ...riddle, kind: "riddle" })), ...stories.map((story) => ({ ...story, kind: "story" }))];

function generateCards() {
  error.hidden = true;
  input.removeAttribute("aria-invalid");
  try {
    const base = normalizeBaseUrl(input.value);
    const cards = document.createDocumentFragment();
    for (const station of stations) {
      const url = stationUrl(base, station.kind, station.id);
      const qr = qrcode(0, "M");
      qr.addData(url, "Byte");
      qr.make();
      const card = el("article", "qr-card");
      const label = station.kind === "riddle" ? `Énigme ${station.id}` : "Fragment d’histoire";
      card.append(el("p", "eyebrow", `Enigmatik / ${label}`), el("h2", "", station.title));
      const graphic = el("div", "qr-image");
      // SVG comes only from the bundled generator, never from user markup.
      graphic.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 16, scalable: true });
      const svg = graphic.querySelector("svg");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", `QR code : ${label}, ${station.title}`);
      const link = el("a", "qr-link", url);
      link.href = url;
      card.append(graphic, el("p", "qr-instruction", "Scannez. Observez. À vous de jouer."), link);
      cards.append(card);
    }
    sheet.replaceChildren(cards);
    input.value = base;
    const hostname = new URL(base).hostname;
    localNote.hidden = !["localhost", "127.0.0.1", "[::1]"].includes(hostname);
    print.disabled = false;
    status.textContent = `${stations.length} cartes prêtes · ${riddles.length} énigmes + ${stories.length} fragment d’histoire`;
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
