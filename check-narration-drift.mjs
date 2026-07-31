/* Finds narration clips whose audio no longer matches the beat text on screen.
 *
 *   node check-narration-drift.mjs
 *
 * Every manifest entry stores the exact text it was rendered from, so drift is
 * detectable: reword a beat and its mp3 is silently stale until re-rendered.
 * Prints the exact re-render commands for whatever has moved.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MODULES = path.join(HERE, 'site', 'modules');

const RE = /\bsay:\s*('(?:[^'\\]|\\.)*'(?:\s*\+\s*\n?\s*'(?:[^'\\]|\\.)*')*)/g;
const clean = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const cmds = [];
let clean_ = 0, drifted = 0;

for(const id of (await fs.readdir(MODULES, {withFileTypes:true}))
      .filter(d => d.isDirectory()).map(d => d.name).sort()){

  const html = await fs.readFile(path.join(MODULES, id, 'index.html'), 'utf8');
  const beats = [];
  RE.lastIndex = 0;
  let m;
  while((m = RE.exec(html)) !== null){
    beats.push(clean(Function('"use strict";return(' + m[1] + ')')()));
  }
  if(!beats.length){ console.log(`${id.padEnd(20)} no tour`); continue; }

  let man = null;
  try { man = JSON.parse(await fs.readFile(path.join(MODULES, id, 'voice', 'manifest.json'), 'utf8')); }
  catch { console.log(`${id.padEnd(20)} ⚠ no manifest — needs a full render`); cmds.push(id); continue; }

  const bad = [];
  beats.forEach((t, i) => { if(!man[i] || man[i].text !== t) bad.push(i + 1); });
  /* Beats removed since the last render leave orphan clips behind. */
  const orphans = man.length > beats.length ? man.length - beats.length : 0;

  if(bad.length){
    drifted += bad.length;
    console.log(`${id.padEnd(20)} ⚠ ${bad.length} stale: beats ${bad.join(', ')}` +
                (orphans ? `  (+${orphans} orphan clip${orphans>1?'s':''})` : ''));
    cmds.push(`${id} ${bad.join(',')}`);
  } else {
    clean_ += beats.length;
    console.log(`${id.padEnd(20)} ✓ all ${beats.length} clips match`);
  }
}

console.log(`\n${clean_} clips in sync, ${drifted} stale.`);
if(cmds.length){
  console.log('\nRe-render with:');
  cmds.forEach(c => console.log(`  node render-module-narration.mjs ${c}`));
  process.exitCode = 1;
}
