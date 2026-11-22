// Optional macOS utility for regenerating the original demo recording.
import { mkdtempSync, writeFileSync, rmSync, mkdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const audioTranscript = "Si vous écoutez ce message, c’est que vous avez retrouvé mon téléphone. Je n’ai pas pu rejoindre la gare. Quelqu’un m’attendait près de l’entrée principale. J’ai fait demi-tour et je suis passé par le café. Cherchez le vieux tunnel, derrière le bâtiment. J’y ai laissé une enveloppe. Ne tirez pas de conclusions trop vite : un téléphone peut changer de mains. Suivez les indices. Je compte sur vous.";

const temp = mkdtempSync(join(tmpdir(), "enigmatik-audio-"));
const output = fileURLToPath(new URL("../assets/audio/message-retrouve.mp3", import.meta.url));
mkdirSync(fileURLToPath(new URL("../assets/audio/", import.meta.url)), { recursive: true });
const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (${result.status})`);
};
try {
  writeFileSync(join(temp, "message.txt"), audioTranscript);
  run("say", ["-v", "Thomas", "-r", "155", "-f", join(temp, "message.txt"), "-o", join(temp, "message.aiff")]);
  if (statSync(join(temp, "message.aiff")).size < 10000) throw new Error("Speech generation produced an empty recording. Check that the Thomas voice is installed and system speech services are accessible.");
  run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", join(temp, "message.aiff"), "-codec:a", "libmp3lame", "-b:a", "96k", "-ac", "1", output]);
  console.log(`Audio generated: ${output}`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
