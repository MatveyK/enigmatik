import test from "node:test";
import assert from "node:assert/strict";
import { stories } from "../assets/js/data.mjs";
import { acceptsPassword, normalizeBaseUrl, resolvePage, stationUrl } from "../assets/js/engine.mjs";

const cards = [
  ["mail-suspicieux", "Un mail suspicieux"],
  ["message-audio", "Un message vocal"],
  ["conversation-justine", "Une conversation incriminante ?"],
  ["article-revelateur", "L'article révélateur"],
  ["declaration", "Une déclaration"],
  ["liste-achats", "Liste d'achats"],
];

test("six cards keep their print order, titles and QR destinations", () => {
  assert.deepEqual(stories.map(({ id, title }) => [id, title]), cards);
  for (const story of stories) {
    const url = new URL(stationUrl("https://example.github.io/enigmatik/", story.id));
    assert.equal(url.pathname, "/enigmatik/index.html");
    assert.equal(url.search, `?histoire=${story.id}`);
    assert.deepEqual(resolvePage(url.search, stories), { type: "story", item: story });
  }
});

test("the five draft pages use TEST and the existing conversation retains its lock and messages", () => {
  for (const story of stories) {
    const conversation = story.id === "conversation-justine";
    assert.equal(acceptsPassword(story, "Justine12"), conversation);
    assert.equal(acceptsPassword(story, "TEST"), !conversation);
    if (conversation) {
      assert.equal(story.content.find(({ type }) => type === "chat").messages.length, 9);
    } else {
      assert.deepEqual(story.content, []);
    }
  }
});

test("multiple answers preserve case, accents, internal spaces and leading zeroes", () => {
  const story = { passwords: ["007", "Étage B", ""] };
  for (const answer of ["007", " 007 ", " Étage B "]) assert.ok(acceptsPassword(story, answer));
  for (const answer of ["", "  ", "7", "étage b", "Etage B", "Étage  B"]) assert.equal(acceptsPassword(story, answer), false);
  assert.equal(acceptsPassword({ passwords: [] }, "TEST"), false);
});

test("home, retired riddles and invalid story links resolve safely", () => {
  assert.equal(resolvePage("", stories).type, "home");
  for (let i = 1; i <= 12; i++) {
    assert.equal(resolvePage(`?enigme=${String(i).padStart(2, "0")}`, stories).type, "missing");
  }
  for (const search of ["?histoire=", "?histoire=absent", "?histoire=message-audio&histoire=declaration", "?enigme=01&histoire=message-audio"]) {
    assert.equal(resolvePage(search, stories).type, "missing");
  }
});

test("QR links support a domain root, repository path and pasted teacher or player URLs", () => {
  const base = "https://example.github.io/enigmatik/";
  for (const suffix of ["", "index.html?histoire=declaration#test", "enseignant.html"]) {
    assert.equal(normalizeBaseUrl(base + suffix), base);
  }
  assert.equal(normalizeBaseUrl("https://example.github.io/enigmatik"), base);
  assert.equal(stationUrl("http://localhost:8000", "message-audio"), "http://localhost:8000/index.html?histoire=message-audio");
  assert.equal(stationUrl("https://example.org/a%20b/", "liste-achats"), "https://example.org/a%20b/index.html?histoire=liste-achats");
  for (const invalid of ["", "example.github.io", "javascript:alert(1)", "file:///tmp/", "https://user:secret@example.org/"]) {
    assert.throws(() => normalizeBaseUrl(invalid));
  }
});
