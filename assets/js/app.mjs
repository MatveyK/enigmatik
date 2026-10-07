import { riddles, stories } from "./data.mjs";
import { checkAnswer, resolvePage } from "./engine.mjs";
import { el, renderBlocks } from "./view.mjs";

const main = document.querySelector("#main");

function header(kicker, title, subtitle) {
  const hero = el("div", "page-heading");
  hero.append(el("p", "eyebrow", kicker), el("h1", "", title), el("p", "lead", subtitle));
  main.append(hero);
}

function inputField(name, labelText, { help, type = "text" } = {}) {
  const wrap = el("div", "input-field");
  const label = el("label", "", labelText);
  label.htmlFor = name;
  const input = el("input");
  input.id = name;
  input.name = name;
  input.type = type;
  input.required = true;
  input.autocomplete = "off";
  input.spellcheck = false;
  if (type === "number") { input.min = "0"; input.step = "1"; input.inputMode = "numeric"; }
  else input.maxLength = 300;
  wrap.append(label, input);
  if (help) {
    const note = el("p", "field-help", help);
    note.id = `${name}-help`;
    input.setAttribute("aria-describedby", note.id);
    wrap.append(note);
  }
  return wrap;
}

function renderRiddle(riddle) {
  document.title = `Énigme ${riddle.id} · ${riddle.title} — Enigmatik`;
  header(`L’enquête / Énigme ${riddle.id}`, riddle.title, riddle.subtitle);
  const metadata = el("div", "metadata");
  metadata.append(el("span", "skill", riddle.skill));
  const difficulty = el("span", "difficulty");
  difficulty.setAttribute("aria-label", `Difficulté : ${riddle.difficulty} sur 5`);
  const dots = el("span", "difficulty-dots", "●".repeat(riddle.difficulty) + "○".repeat(5 - riddle.difficulty));
  dots.setAttribute("aria-hidden", "true");
  difficulty.append(el("span", "", "Difficulté"), dots);
  metadata.append(difficulty);
  main.append(metadata);

  const layout = el("div", "puzzle-layout");
  const evidence = el("section", "evidence paper");
  evidence.setAttribute("aria-labelledby", "evidence-heading");
  const evidenceHeading = el("h2", "section-label", "01 / Les éléments du dossier");
  evidenceHeading.id = "evidence-heading";
  evidence.append(evidenceHeading, renderBlocks(riddle.story), renderBlocks(riddle.prompt));
  if (riddle.hint) {
    const hint = el("aside", "hint");
    hint.append(el("h3", "", "Un indice pour commencer"), renderBlocks(riddle.hint));
    evidence.append(hint);
  }

  const answerCard = el("section", "answer-card paper");
  answerCard.setAttribute("aria-labelledby", "question-heading");
  answerCard.append(el("p", "section-label", "02 / À vous de jouer"));
  const question = el("h2", "question-heading", riddle.question);
  question.id = "question-heading";
  const form = el("form", "answer-form");
  form.noValidate = true;
  const fields = el("fieldset", "answer-fields");
  fields.append(el("legend", "sr-only", riddle.question));
  if (riddle.type === "choice") {
    for (const option of riddle.choices) {
      const label = el("label", "choice");
      const radio = el("input");
      radio.type = "radio";
      radio.name = "answer";
      radio.value = option.id;
      radio.required = true;
      label.append(radio, el("span", "choice-letter", option.id), el("span", "choice-text", option.label));
      fields.append(label);
    }
  } else if (riddle.type === "route") {
    fields.append(inputField("route", "Le chemin, dans l’ordre", { help: "Écrivez les lieux du départ à l’arrivée, séparés par des flèches, des virgules ou des tirets." }), inputField("minutes", "La durée totale (en minutes)", { type: "number" }));
  } else {
    fields.append(inputField("answer", riddle.label, { help: riddle.inputHelp }));
  }
  const error = el("p", "field-error");
  error.id = "answer-error";
  error.setAttribute("role", "alert");
  error.hidden = true;
  fields.setAttribute("aria-describedby", error.id);
  const submit = el("button", "submit-answer", "Vérifier ma réponse");
  submit.type = "submit";
  submit.append(el("span", "", "↗"));
  submit.lastChild.setAttribute("aria-hidden", "true");
  const note = el("p", "submission-note", "Après validation, la solution et votre code seront révélés, même si la réponse est incorrecte.");
  form.append(fields, error, submit, note);
  const result = el("section", "result");
  result.hidden = true;
  result.tabIndex = -1;
  result.setAttribute("aria-labelledby", "result-title");
  const announcement = el("p", "sr-only");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");

  let submitted = false;
  form.addEventListener("input", () => {
    error.hidden = true;
    for (const input of fields.querySelectorAll("input")) input.removeAttribute("aria-invalid");
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submitted) return;
    const values = Object.fromEntries(new FormData(form));
    const checked = checkAnswer(riddle, values);
    if (!checked.complete || !form.checkValidity()) {
      error.textContent = riddle.type === "choice" ? "Choisissez une réponse avant de valider." : riddle.type === "route" ? "Indiquez le chemin et une durée entière en minutes." : "Écrivez une réponse avant de valider.";
      error.hidden = false;
      const invalid = [...fields.querySelectorAll("input")].find((input) => !input.validity.valid || (input.type !== "radio" && !input.value.trim()));
      invalid?.setAttribute("aria-invalid", "true");
      invalid?.focus();
      return;
    }
    submitted = true;
    fields.disabled = true;
    submit.disabled = true;
    submit.textContent = "Réponse vérifiée";
    note.hidden = true;
    error.hidden = true;
    result.classList.add(checked.correct ? "is-correct" : "is-incorrect");
    const title = el("h3", "result-title", checked.correct ? "Bien vu !" : "Pas tout à fait…");
    title.id = "result-title";
    const verdict = checked.correct ? "Votre réponse est correcte." : "Votre réponse est incorrecte. Voici la solution pour poursuivre l’enquête.";
    const code = el("div", "special-code");
    code.append(el("span", "", "Code spécial :"), el("strong", "", riddle.specialCode || "TODO"));
    result.append(title, el("p", "", verdict), el("p", "eyebrow", "La bonne réponse"), el("p", "correct-answer", riddle.displayAnswer), renderBlocks(riddle.explanation), code);
    if (riddle.afterAnswer?.length) {
      const story = el("aside", "story-reveal");
      story.append(el("h4", "", "L’enquête avance"), renderBlocks(riddle.afterAnswer));
      result.append(story);
    }
    result.append(el("p", "station-note", "Notez votre code, puis cherchez le prochain QR code sur le terrain."));
    result.hidden = false;
    announcement.textContent = `${verdict} Bonne réponse : ${riddle.displayAnswer}. Code spécial : ${riddle.specialCode || "TODO"}.`;
    result.focus();
  });
  answerCard.append(question, form, announcement, result);
  layout.append(evidence, answerCard);
  main.append(layout);
}

function renderStory(story) {
  document.title = `${story.title} — Enigmatik`;
  main.classList.add("story-page");
  header("L’enquête / Fragment d’histoire", story.title, story.subtitle);
  const article = el("article", "story-content paper");
  article.append(renderBlocks(story.content), el("p", "station-note", "La suite se trouve sur le terrain. Gardez les yeux ouverts."));
  main.append(article);
}

function renderWelcome(missing = false) {
  main.classList.add("welcome-page");
  const mark = el("div", "scan-mark");
  mark.setAttribute("aria-hidden", "true");
  mark.append(el("span", "", missing ? "?" : "e."));
  main.append(mark);
  header(missing ? "Une piste introuvable" : "L’enquête commence ici", missing ? "Cet indice reste introuvable." : "Chaque détail compte.", missing ? "Ce lien ne correspond à aucune étape du jeu. Scannez à nouveau le QR code ou demandez à votre enseignant de vérifier le lien." : "Une disparition mystérieuse. Des indices numériques. Et vous, pour relier les points.");
  main.append(el("p", "welcome-instruction", missing ? "Votre enquête vous attend sur le terrain." : "Scannez le QR code d’une étape pour ouvrir votre dossier."));
  const bottom = el("div", "welcome-bottom");
  bottom.append(el("span", "", "Observer"), el("span", "", "Déchiffrer"), el("span", "", "Relier les indices"));
  main.append(bottom);
}

const page = resolvePage(window.location.search, riddles, stories);
if (page.type === "riddle") renderRiddle(page.item);
else if (page.type === "story") renderStory(page.item);
else renderWelcome(page.type === "missing");
