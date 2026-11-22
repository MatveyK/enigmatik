export function acceptsPassword(story, value) {
  const answer = value.trim();
  return answer.length > 0 && story.passwords.some((password) => password.trim() === answer);
}

export function resolvePage(search, stories) {
  const params = new URLSearchParams(search);
  if (params.has("enigme")) return { type: "missing" };
  const ids = params.getAll("histoire");
  if (ids.length === 0) return { type: "home" };
  if (ids.length !== 1) return { type: "missing" };
  const item = stories.find((story) => story.id === ids[0]);
  return item ? { type: "story", item } : { type: "missing" };
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

export function stationUrl(base, id) {
  const url = new URL("index.html", normalizeBaseUrl(base));
  url.searchParams.set("histoire", id);
  return url.href;
}
