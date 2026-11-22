import { stories } from "./data.mjs";
import { acceptsPassword, resolvePage } from "./engine.mjs";
import { el, renderBlocks } from "./view.mjs";

const main = document.querySelector("#main");

function header(kicker, title, subtitle) {
  const hero = el("div", "page-heading");
  hero.append(el("p", "eyebrow", kicker), el("h1", "", title));
  if (subtitle) hero.append(el("p", "lead", subtitle));
  main.append(hero);
}

function renderStory(story) {
  main.replaceChildren();
  header("L’enquête / Pièce à conviction", story.title);
  const article = el("article", "story-content paper");
  if (story.content.length) {
    article.append(renderBlocks(story.content));
  } else {
    article.append(el("p", "", "Le contenu de cette pièce à conviction sera ajouté prochainement."));
  }
  main.append(article);
  const title = main.querySelector("h1");
  title.tabIndex = -1;
  title.focus();
}

function renderLockedStory(story) {
  document.title = `${story.title} — Enigmatik`;
  main.classList.add("story-page");
  header("L’enquête / Accès verrouillé", story.title, "Saisissez la réponse trouvée sur votre carte pour découvrir la suite de l’enquête.");
  const form = el("form", "password-card paper");
  form.noValidate = true;
  const field = el("div", "input-field");
  const label = el("label", "", "Votre réponse");
  label.htmlFor = "story-password";
  const input = el("input");
  input.id = label.htmlFor;
  input.type = "password";
  input.required = true;
  input.autocomplete = "off";
  input.autocapitalize = "none";
  input.spellcheck = false;
  input.setAttribute("aria-describedby", "story-password-help story-password-error");
  const help = el("p", "field-help", "Respectez les majuscules et les minuscules.");
  help.id = "story-password-help";
  field.append(label, input, help);
  const error = el("p", "field-error");
  error.id = "story-password-error";
  error.setAttribute("role", "alert");
  error.hidden = true;
  const submit = el("button", "submit-answer", "Vérifier ma réponse");
  submit.type = "submit";
  form.append(field, error, submit);
  form.addEventListener("input", () => {
    error.hidden = true;
    input.removeAttribute("aria-invalid");
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (acceptsPassword(story, input.value)) {
      renderStory(story);
      return;
    }
    error.textContent = input.value.trim() ? "Réponse incorrecte. Réessayez." : "Entrez votre réponse pour continuer.";
    error.hidden = false;
    input.setAttribute("aria-invalid", "true");
    input.focus();
  });
  main.append(form);
}

function renderWelcome(missing) {
  main.classList.add("welcome-page");
  const mark = el("div", "scan-mark");
  mark.setAttribute("aria-hidden", "true");
  mark.append(el("span", "", missing ? "?" : "e."));
  main.append(mark);
  if (missing) {
    header("Une piste introuvable", "Cet indice reste introuvable.", "Scannez à nouveau le QR code de votre carte ou demandez à votre enseignant de vérifier le lien.");
  } else {
    header("L’enquête commence ici", "Chaque détail compte.", "Résolvez la question sur votre carte, scannez son QR code, puis saisissez votre réponse pour découvrir une pièce de l’enquête.");
  }
}

const page = resolvePage(window.location.search, stories);
if (page.type === "story") renderLockedStory(page.item);
else renderWelcome(page.type === "missing");
