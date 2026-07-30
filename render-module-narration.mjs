/* Renders the guided-tour narration for every module on the site, using the local
 * Kokoro TTS server (voice "ava"). The dark-matter page has its own renderer —
 * render-narration.mjs — because its beats live in a different shape.
 *
 *   node render-module-narration.mjs                     every module, every beat
 *   node render-module-narration.mjs black-holes         one module
 *   node render-module-narration.mjs black-holes 3,4     just those beats (1-based)
 *   node render-module-narration.mjs --list              print everything and exit
 *
 * Beat text is pulled straight out of each module's `say:` strings, so the audio
 * cannot drift from what is on screen. Writes site/modules/<id>/voice/beat-NN.mp3
 * plus a manifest carrying each clip's measured duration — tour.js advances on
 * the audio's own `ended` event, and uses the durations only for capture work.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const pexec   = promisify(execFile);
const HERE    = path.dirname(fileURLToPath(import.meta.url));
const MODULES = path.join(HERE, 'site', 'modules');
const TTS     = 'http://127.0.0.1:8880/v1/audio/speech';
const FFPROBE = 'ffprobe';

/* Each beat opens with:   { say:'…' + '…' + '…',
   Capture the concatenated string expression and evaluate it — it is only string
   literals, so this is a parse, not an eval of arbitrary page code. */
const RE = /\bsay:\s*('(?:[^'\\]|\\.)*'(?:\s*\+\s*\n?\s*'(?:[^'\\]|\\.)*')*)/g;

const clean = s => s.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();

async function beatsFor(id){
  const html = await fs.readFile(path.join(MODULES, id, 'index.html'), 'utf8');
  const out = [];
  let m;
  RE.lastIndex = 0;
  while((m = RE.exec(html)) !== null){
    out.push(clean(Function('"use strict";return ('+m[1]+')')()));
  }
  return out;
}

const argv = process.argv.slice(2);
const listOnly = argv.includes('--list');
const args = argv.filter(a => !a.startsWith('--'));

const all = (await fs.readdir(MODULES, {withFileTypes:true}))
  .filter(d => d.isDirectory()).map(d => d.name).sort();

const targets = args[0] ? [args[0]] : all;
for(const t of targets){
  if(!all.includes(t)){ console.error(`No such module: ${t}\n  have: ${all.join(', ')}`); process.exit(1); }
}
const only = args[1]
  ? new Set(args[1].split(',').map(s => parseInt(s,10)-1).filter(n => n>=0))
  : null;

if(listOnly){
  let n = 0;
  for(const id of targets){
    const b = await beatsFor(id);
    n += b.length;
    console.log(`\n── ${id}  (${b.length} beats) ──`);
    b.forEach((t,i)=>console.log(String(i+1).padStart(3)+'  '+t));
  }
  console.log(`\n${n} beats across ${targets.length} module(s).`);
  process.exit(0);
}

let grandTotal = 0, grandCount = 0;

for(const id of targets){
  const beats = await beatsFor(id);
  if(!beats.length){ console.log(`── ${id}: no tour beats, skipping`); continue; }

  const out = path.join(MODULES, id, 'voice');
  await fs.mkdir(out, {recursive:true});

  /* Re-rendering a subset merges into the existing manifest rather than
     replacing it, so a one-line fix does not cost a full re-render. */
  let manifest = [];
  if(only){
    try{ manifest = JSON.parse(await fs.readFile(path.join(out,'manifest.json'),'utf8')); }catch{}
  }

  console.log(`\n── ${id}  (${beats.length} beats) ──`);
  for(let i=0;i<beats.length;i++){
    if(only && !only.has(i)) continue;
    const n = String(i+1).padStart(2,'0');
    const file = path.join(out, `beat-${n}.mp3`);
    process.stdout.write(`  ${n}  `);

    const res = await fetch(TTS, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({model:'kokoro', voice:'ava', input:beats[i],
                            response_format:'mp3', speed:1.0})
    });
    if(!res.ok){
      console.error(`\nFAILED ${res.status} ${await res.text()}`);
      console.error('Is the Kokoro server up on 127.0.0.1:8880?');
      process.exit(1);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(file, buf);

    let dur = 0;
    try{
      const {stdout} = await pexec(FFPROBE,
        ['-v','error','-show_entries','format=duration','-of','csv=p=0', file]);
      dur = parseFloat(stdout.trim()) || 0;
    }catch{ /* ffprobe is optional — tour.js advances on `ended`, not on dur */ }

    const entry = {i, file:`voice/beat-${n}.mp3`, dur:+dur.toFixed(2), text:beats[i]};
    const at = manifest.findIndex(e => e.i === i);
    if(at >= 0) manifest[at] = entry; else manifest.push(entry);
    console.log(`${(buf.length/1024).toFixed(0).padStart(4)} KB  ${dur.toFixed(1).padStart(5)}s  ${beats[i].slice(0,52)}…`);
  }

  manifest.sort((a,b)=>a.i-b.i);
  await fs.writeFile(path.join(out,'manifest.json'), JSON.stringify(manifest,null,1));
  const total = manifest.reduce((s,b)=>s+b.dur,0);
  grandTotal += total; grandCount += manifest.length;
  console.log(`  → ${manifest.length} clips, ${Math.floor(total/60)}m ${Math.round(total%60)}s`);
}

console.log(`\n${grandCount} clips total, ` +
            `${Math.floor(grandTotal/60)}m ${Math.round(grandTotal%60)}s of narration.`);
