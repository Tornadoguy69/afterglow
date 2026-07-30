/* Renders the guided-tour narration to audio with the local Kokoro TTS server.
 *
 *   node render-narration.mjs                 all 27 beats
 *   node render-narration.mjs --beats 4,5     just those (1-based), keeps the rest
 *   node render-narration.mjs --list          print the beats and exit
 *
 * Pulls the beat text straight out of dark-matter-visualizations.html so the audio
 * can never drift from what is on screen. Writes voice/beat-NN.mp3 plus a manifest
 * carrying each clip's measured duration. Re-rendering a subset merges into the
 * existing manifest rather than replacing it.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const pexec = promisify(execFile);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC  = path.join(HERE, 'dark-matter-visualizations.html');
const OUT  = path.join(HERE, 'voice');
const TTS  = 'http://127.0.0.1:8880/v1/audio/speech';
const FFPROBE = 'ffprobe';

const html = await fs.readFile(SRC, 'utf8');

/* Each beat looks like:  {t:'…'+ '…', hold:9, run(){…}}
   Capture the string-concat expression and evaluate it — it is only string literals. */
const beats = [];
const re = /\{t:\s*('(?:[^'\\]|\\.)*'(?:\s*\+\s*'(?:[^'\\]|\\.)*')*)\s*,\s*\n?\s*hold:\s*(\d+)/g;
let m;
while ((m = re.exec(html)) !== null) {
  const text = Function('"use strict";return (' + m[1] + ')')();
  beats.push({ text: text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(), hold: +m[2] });
}

if (!beats.length) { console.error('No beats found — the pattern in the HTML changed.'); process.exit(1); }

const argv = process.argv.slice(2);
if (argv.includes('--list')) {
  beats.forEach((b, i) => console.log(String(i + 1).padStart(3) + '  ' + b.text));
  process.exit(0);
}
const bi = argv.indexOf('--beats');
const only = bi >= 0 && argv[bi + 1]
  ? new Set(argv[bi + 1].split(',').map(s => parseInt(s, 10) - 1).filter(n => n >= 0 && n < beats.length))
  : null;

console.log(`Found ${beats.length} narration beats.` +
            (only ? `  Rendering ${only.size}: ${[...only].map(n => n + 1).join(', ')}` : '') + '\n');

await fs.mkdir(OUT, { recursive: true });

// keep clips we are not re-rendering
let manifest = [];
try { manifest = JSON.parse(await fs.readFile(path.join(OUT, 'manifest.json'), 'utf8')); } catch {}
if (!only) manifest = [];

for (let i = 0; i < beats.length; i++) {
  if (only && !only.has(i)) continue;
  const n = String(i + 1).padStart(2, '0');
  const file = path.join(OUT, `beat-${n}.mp3`);
  process.stdout.write(`  ${n}/${beats.length}  `);

  const res = await fetch(TTS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'kokoro', voice: 'ava',
      input: beats[i].text, response_format: 'mp3', speed: 1.0
    })
  });
  if (!res.ok) { console.error(`FAILED ${res.status} ${await res.text()}`); process.exit(1); }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(file, buf);

  let dur = 0;
  try {
    const { stdout } = await pexec(FFPROBE,
      ['-v','error','-show_entries','format=duration','-of','csv=p=0', file]);
    dur = parseFloat(stdout.trim()) || 0;
  } catch { /* ffprobe optional */ }

  const entry = { i, file: `voice/beat-${n}.mp3`, dur: +dur.toFixed(2), text: beats[i].text };
  const at = manifest.findIndex(e => e.i === i);
  if (at >= 0) manifest[at] = entry; else manifest.push(entry);
  console.log(`${(buf.length/1024).toFixed(0).padStart(4)} KB   ${dur.toFixed(1)}s   ${beats[i].text.slice(0,58)}…`);
}

manifest.sort((a, b) => a.i - b.i);
await fs.writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1));
const total = manifest.reduce((s, b) => s + b.dur, 0);
console.log(`\nWrote ${manifest.length} clips + manifest.json`);
console.log(`Total narration: ${Math.floor(total/60)}m ${Math.round(total%60)}s`);
