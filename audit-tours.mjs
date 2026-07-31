/* Audits every guided-tour beat for narration that does not match the screen.
 *
 *   node audit-tours.mjs            every module
 *   node audit-tours.mjs nebulae    one of them
 *
 * The failure this is looking for is a beat that *asserts* a value in the
 * narration while the screen still shows the previous one — either because the
 * beat sets it late in an `at:` cue, or because it never sets it at all and is
 * relying on a previous beat having left the right state behind.
 *
 * It reports facts, not verdicts: what each beat says, what it sets, and when.
 * Judging whether a mismatch matters still needs reading.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MODULES = path.join(HERE, 'site', 'modules');

const clean = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/* Numbers a narrator might be asserting: "forty four thousand", "thirty times",
   "one astronomical unit". Spelled out, because that is how they are written for
   the TTS, so a plain digit scan would miss all of them. */
const WORDS = {
  zero:0, one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9,
  ten:10, eleven:11, twelve:12, thirteen:13, fourteen:14, fifteen:15, sixteen:16,
  seventeen:17, eighteen:18, nineteen:19, twenty:20, thirty:30, forty:40, fifty:50,
  sixty:60, seventy:70, eighty:80, ninety:90, hundred:100, thousand:1000, million:1e6
};

function spokenNumbers(text){
  const out = [];
  const toks = text.toLowerCase().replace(/[^a-z0-9. ]/g, ' ').split(/\s+/);
  let cur = null, seen = false;
  const flush = () => { if(seen && cur) out.push(cur); cur = null; seen = false; };
  for(const t of toks){
    if(WORDS[t] !== undefined){
      const v = WORDS[t];
      if(v === 100 || v === 1000 || v === 1e6){ cur = (cur || 1) * v; }
      else { cur = (cur || 0) + v; }
      seen = true;
    } else if(/^\d+(\.\d+)?$/.test(t)){ out.push(parseFloat(t)); flush(); }
    else flush();
  }
  flush();
  return out;
}

/* Pull each beat's say / run / at out of the source. The tour literal is regular
   enough to split on the beat boundary rather than needing a real parser. */
function beatsOf(src){
  const i = src.indexOf('tour(app,');
  if(i < 0) return [];
  const tour = src.slice(i);
  return tour.split(/\n\{ say:/).slice(1).map(chunk => {
    const lit = chunk.match(/^((?:\s*'(?:[^'\\]|\\.)*'\s*\+?)+)/);
    let say = '<unparsed>';
    if(lit){
      const expr = lit[1].trim().replace(/\+$/, '');
      try { say = clean(Function('"use strict";return(' + expr + ')')()); } catch { /* leave marker */ }
    }
    const run = (chunk.match(/run\(\)\s*\{([\s\S]*?)\}\s*[,\n]/) || [])[1] || '';
    const at = [...chunk.matchAll(/\{\s*t:\s*([\d.]+)\s*,\s*do\(\)\s*\{([\s\S]*?)\}\s*\}/g)]
      .map(m => ({ t: parseFloat(m[1]), code: m[2].replace(/\s+/g, ' ').trim() }));
    return { say, run: run.replace(/\s+/g, ' ').trim(), at };
  });
}

const only = process.argv[2];
const all = (await fs.readdir(MODULES, { withFileTypes: true }))
  .filter(d => d.isDirectory()).map(d => d.name).sort();
const targets = only ? [only] : all;

let flagged = 0;

for(const id of targets){
  const src = await fs.readFile(path.join(MODULES, id, 'index.html'), 'utf8');
  const beats = beatsOf(src);
  console.log(`\n${'═'.repeat(74)}\n  ${id}  —  ${beats.length} beats\n${'═'.repeat(74)}`);

  beats.forEach((b, n) => {
    const nums = spokenNumbers(b.say);
    /* A number in the narration that also appears in a late cue is the smoking
       gun: it is being said before it is true. */
    const lateHits = [];
    b.at.forEach(a => {
      const setNums = (a.code.match(/[\d.]+e?\d*/g) || []).map(parseFloat);
      nums.forEach(v => {
        if(setNums.some(s => s === v || Math.abs(s - v) / Math.max(s, v) < 0.001))
          lateHits.push(`"${v}" is said at t=0 but only set at t=${a.t}s`);
      });
    });

    const head = lateHits.length ? '  ⚠ ' : '    ';
    console.log(`${head}beat ${String(n + 1).padStart(2)}  ${b.say.slice(0, 96)}`);
    if(b.run) console.log(`          run  ${b.run.slice(0, 96)}`);
    b.at.forEach(a => console.log(`          t=${String(a.t).padEnd(5)} ${a.code.slice(0, 88)}`));
    lateHits.forEach(h => { console.log(`          ⚠ ${h}`); flagged++; });
  });
}

console.log(`\n${flagged} beat(s) assert a value before setting it.`);
