export function normalizeText(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr").trim().replace(/[.!?…]+$/u, "").trim().replace(/\s+/g, " ");
}

function normalizeTime(value) {
  const normalized = normalizeText(value);
  const parts = normalized.match(/^(\d{1,2})\s*(?:h|:)\s*(\d{2})$/);
  if (!parts || Number(parts[1]) > 23 || Number(parts[2]) > 59) return null;
  return `${Number(parts[1])}:${parts[2]}`;
}

export function normalizeRoute(value) {
  return normalizeText(value).replace(/(?:->|→|⇒|⟶|>|[-–—,;/])/g, " ").replace(/\s+/g, " ").trim();
}

// The result distinguishes missing input from a submitted incorrect answer.
export function checkAnswer(riddle, values) {
  if (riddle.type === "route") {
    if (!String(values.route ?? "").trim() || !String(values.minutes ?? "").trim()) return { complete: false, correct: false };
    return { complete: true, correct: normalizeRoute(values.route) === normalizeRoute(riddle.correctRoute.join(" → ")) && Number(values.minutes) === riddle.correctMinutes };
  }
  if (!String(values.answer ?? "").trim()) return { complete: false, correct: false };
  if (riddle.type === "choice") return { complete: true, correct: values.answer === riddle.correctChoice };
  const normalize = riddle.match === "time" ? normalizeTime : normalizeText;
  const answer = normalize(values.answer);
  return { complete: true, correct: answer !== null && riddle.acceptedAnswers.some((accepted) => normalize(accepted) === answer) };
}

export function resolvePage(search, riddles, stories) {
  const params = new URLSearchParams(search);
  const hasRiddle = params.has("enigme");
  const hasStory = params.has("histoire");
  if (!hasRiddle && !hasStory) return { type: "home" };
  if (hasRiddle && hasStory) return { type: "missing" };
  const key = hasRiddle ? "enigme" : "histoire";
  if (params.getAll(key).length !== 1) return { type: "missing" };
  const item = (hasRiddle ? riddles : stories).find(({ id }) => id === params.get(key));
  return item ? { type: hasRiddle ? "riddle" : "story", item } : { type: "missing" };
}

export function normalizeBaseUrl(value) {
  let url;
  try { url = new URL(value.trim()); } catch { throw new Error("Indiquez une adresse complète commençant par https:// ou http://."); }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error("Utilisez une adresse http:// ou https:// sans identifiants de connexion.");
  url.search = "";
  url.hash = "";
  url.pathname = url.pathname.replace(/\/(?:index|enseignant)\.html$/i, "/");
  if (!url.pathname.endsWith("/")) url.pathname += "/";
  return url.href;
}

export function stationUrl(base, kind, id) {
  const url = new URL("index.html", normalizeBaseUrl(base));
  url.searchParams.set(kind === "riddle" ? "enigme" : "histoire", id);
  return url.href;
}
