import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { riddles, stories, audioTranscript } from "../assets/js/data.mjs";
import { checkAnswer, normalizeText, normalizeRoute, normalizeBaseUrl, stationUrl, resolvePage } from "../assets/js/engine.mjs";
import qrcode from "../assets/vendor/qrcode.mjs";

const byId = (id) => riddles.find((riddle) => riddle.id === id);
const correct = {
  "01": { answer: "CAFE" }, "02": { answer: "A" }, "03": { answer: "18:45" },
  "04": { answer: "7" }, "05": { answer: "B" }, "06": { answer: "C" },
  "07": { answer: "LOCAL 12" }, "08": { answer: "B" }, "09": { answer: "Cherchez sous le pont." },
  "10": { answer: "B" }, "11": { answer: "D" }, "12": { route: "École → Café → Tunnel → Gare", minutes: "7" },
};

test("all 12 stations are present with stable, unique identifiers", () => {
  assert.deepEqual(riddles.map(({ id }) => id), Object.keys(correct).sort());
  assert.equal(stories.length, 1);
  for (const riddle of riddles) {
    assert.equal(riddle.specialCode, "TODO");
    assert.ok(riddle.explanation.length);
    assert.ok(riddle.displayAnswer);
  }
});

for (const [id, values] of Object.entries(correct)) {
  test(`riddle ${id}: accepts the independently specified answer and rejects empty input`, () => {
    assert.deepEqual(checkAnswer(byId(id), values), { complete: true, correct: true });
    assert.deepEqual(checkAnswer(byId(id), {}), { complete: false, correct: false });
    assert.deepEqual(checkAnswer(byId(id), { answer: "  \n ", route: " ", minutes: "7" }), { complete: false, correct: false });
  });
}

test("every distractor in every MCQ is incorrect", () => {
  for (const riddle of riddles.filter(({ type }) => type === "choice")) {
    const expected = correct[riddle.id].answer;
    for (const option of riddle.choices) assert.equal(checkAnswer(riddle, { answer: option.id }).correct, option.id === expected, `${riddle.id}: ${option.id}`);
  }
});

test("text answers tolerate accents, case, spacing and trailing punctuation", () => {
  const variants = {
    "01": ["  Café! ", "cafe", "CAFÉ"],
    "04": ["SEPT", "Casier numéro 7.", "7"],
    "07": [" local    12. ", "LOCAL\n12"],
    "09": ["Cherchez sous le pont…", "sous le pont", "chercher sous le pont!"],
  };
  for (const [id, answers] of Object.entries(variants)) {
    for (const answer of answers) assert.equal(checkAnswer(byId(id), { answer }).correct, true, `${id}: ${answer}`);
  }
  assert.equal(normalizeText(" ÉCOLE   Café. "), "ecole cafe");
});

test("wrong text answers are not accepted through fuzzy or substring matching", () => {
  for (const [id, answer] of [["01", "cafeteria"], ["04", "17"], ["07", "LOCAL 21"], ["09", "sur le pont"], ["09", "ne cherchez pas sous le pont"], ["01", "..."]]) {
    assert.deepEqual(checkAnswer(byId(id), { answer }), { complete: true, correct: false });
  }
});

test("time accepts common formats while rejecting other or malformed times", () => {
  for (const answer of ["18:45", "18h45", "18 h 45", "18 H 45.", "18 : 45"]) assert.equal(checkAnswer(byId("03"), { answer }).correct, true, answer);
  for (const answer of ["18:44", "6:45", "18:450", "18:75", "28:45", "rendez-vous 18:45"]) assert.equal(checkAnswer(byId("03"), { answer }).correct, false, answer);
});

test("route accepts common separators and requires both correct order and duration", () => {
  for (const separator of [" → ", " -> ", ", ", " - ", " / ", " ", ";", "—"]) {
    assert.equal(checkAnswer(byId("12"), { route: ["ecole", "cafe", "tunnel", "gare"].join(separator), minutes: "7" }).correct, true);
  }
  for (const route of ["École → Parc → Gare", "École → Tunnel → Café → Gare", "Café → Tunnel → Gare", "École Café Tunnel Gare Café", "École Café Tunnel Gares"]) {
    assert.equal(checkAnswer(byId("12"), { route, minutes: "7" }).correct, false, route);
  }
  assert.equal(normalizeRoute("École -> Café -> Tunnel -> Gare"), "ecole cafe tunnel gare");
  assert.equal(checkAnswer(byId("12"), { ...correct["12"], minutes: "9" }).correct, false);
  assert.equal(checkAnswer(byId("12"), { ...correct["12"], minutes: "7.5" }).correct, false);
  assert.equal(checkAnswer(byId("12"), { ...correct["12"], minutes: "" }).complete, false);
});

test("compression exercise decodes into a 5×5 seven and agrees with the source document", () => {
  const riddle = byId("04");
  const encoded = riddle.prompt.filter(({ type }) => type === "code").at(-1).text;
  const rows = encoded.split("\n").map((row) => row.split(" ").map((pair) => pair[1].repeat(Number(pair[0]))).join(""));
  assert.deepEqual(rows, ["11111", "00001", "00010", "00100", "01000"]);
  const visual = rows.map((row) => row.replaceAll("1", "■").replaceAll("0", "□")).join("\n");
  assert.equal(riddle.explanation.find(({ type }) => type === "code").text, visual);
  const source = readFileSync(new URL("../enigmes-info.md", import.meta.url), "utf8");
  assert.ok(source.includes(encoded));
  assert.ok(source.includes(visual));
});

test("direct URLs resolve riddles and stories; ambiguous and unknown IDs fail safely", () => {
  for (const riddle of riddles) assert.equal(resolvePage(`?enigme=${riddle.id}`, riddles, stories).item, riddle);
  assert.equal(resolvePage("?histoire=message-audio", riddles, stories).item, stories[0]);
  assert.equal(resolvePage("", riddles, stories).type, "home");
  for (const search of ["?enigme=99", "?enigme=", "?enigme=01&histoire=message-audio", "?enigme=01&enigme=02", "?histoire=absent", "?enigme=%3Cscript%3E"]) assert.equal(resolvePage(search, riddles, stories).type, "missing");
});

test("QR base URLs retain project paths and normalize pasted page URLs", () => {
  for (const base of ["https://example.github.io/enigmatik", "https://example.github.io/enigmatik/", "https://example.github.io/enigmatik/index.html?enigme=01#test", "https://example.github.io/enigmatik/enseignant.html"]) {
    assert.equal(normalizeBaseUrl(base), "https://example.github.io/enigmatik/");
    assert.equal(stationUrl(base, "riddle", "03"), "https://example.github.io/enigmatik/index.html?enigme=03");
  }
  assert.equal(stationUrl("https://example.github.io/", "story", "message-audio"), "https://example.github.io/index.html?histoire=message-audio");
  assert.equal(stationUrl("http://localhost:8000", "riddle", "01"), "http://localhost:8000/index.html?enigme=01");
  assert.equal(stationUrl("https://example.org/a%20b/", "riddle", "01"), "https://example.org/a%20b/index.html?enigme=01");
  for (const base of ["", "example.github.io", "javascript:alert(1)", "file:///tmp/", "https://user:secret@example.org/"]) assert.throws(() => normalizeBaseUrl(base));
});

test("every station has a QR code that fits, including long project URLs", () => {
  for (const [kind, items] of [["riddle", riddles], ["story", stories]]) {
    for (const item of items) {
      const qr = qrcode(0, "M");
      qr.addData(stationUrl("https://example.github.io/an-extended-classroom-project-name/", kind, item.id));
      qr.make();
      assert.ok(qr.getModuleCount() >= 21);
      assert.match(qr.createSvgTag({ cellSize: 4, margin: 16, scalable: true }), /<svg/);
    }
  }
});

test("story media exists locally and narration text matches the transcript", () => {
  const audio = stories[0].content.find(({ type }) => type === "audio");
  assert.equal(audio.transcript, audioTranscript);
  assert.ok(audioTranscript.includes("tunnel"));
  const bytes = readFileSync(new URL(`../${audio.src}`, import.meta.url));
  assert.ok(bytes.length > 10000, "MP3 should contain actual audio");
  assert.ok(bytes.toString("ascii", 0, 3) === "ID3" || bytes[0] === 0xff, "MP3 header");
  for (const block of stories[0].content.filter(({ src }) => src)) assert.ok(existsSync(new URL(`../${block.src}`, import.meta.url)));
  assert.ok(existsSync(new URL("../.nojekyll", import.meta.url)));
});
