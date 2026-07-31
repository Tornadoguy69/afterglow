/* One-off: makes every guided-tour beat declare the state it needs.
 *
 * The dots let a visitor jump straight to any beat, so a beat that inherits
 * state from its predecessor narrates the wrong thing — Life of a Star was
 * saying "red giant" and "white dwarf" over a molecular cloud. Each module below
 * gets a small `at()` helper and every beat gets a run() that calls it.
 *
 * Beats are matched on a distinctive tail of their say: text rather than an
 * index, so a mismatch fails loudly instead of silently patching the wrong beat.
 */
import fs from 'node:fs/promises';

const MODULES = {
  'planet-formation': {
    helper:
      "/* Each beat declares the whole world it needs — beats are reachable in any\n" +
      "   order, so inheriting state narrates the wrong disk. Growth stage and radius\n" +
      "   both glide: stepping them teleports the bodies instead of growing them. */\n" +
      "const glideT = (t, ms=2000) => tween('pf-t', P.t, t, ms, setT);\n" +
      "const glideR = (r, ms=2200) => tween('pf-r', P.r, r, ms, setR, {log:true});\n" +
      "const at = (t, r, play=false) => {\n" +
      "  setPlay(false); glideR(r);\n" +
      "  if(play){ cancelTween('pf-t'); setT(t); setPlay(true); }   // loop owns t while playing\n" +
      "  else glideT(t);\n" +
      "};",
    imports: true,
    beats: [
      ['orbiting a new star in a flat disk like this one.',        'at(0, 1)'],
      ['Let me run it.',                                            'at(0, 1, true)'],
      ['in laboratories.',                                          'at(0.10, 1, true)'],
      ['unsolved problem in astrophysics.',                         'at(0.36, 1)'],
      ['they fall inward in a few hundred years.',                  'at(0.36, 1)'],
      ['And yet here we are, standing on the result.',              'at(0.36, 1)'],
      ['a settled account of every disk.',                          'at(0.36, 1)'],
      ['smaller ones faster and faster.',                           'at(0.42, 1, true)'],
      ['Planetesimals, then protoplanets, then planets.',           'at(0.62, 1, true)'],
      ['Inside it, water is vapour. Outside it, water is ice.',     'at(1.0, 1)'],
      ['So you build something small.',                             'at(1.0, 1)'],
      ['Now move out to five astronomical units, where Jupiter is.','at(1.0, 1)'],
      ['are giants and the inner ones are not.',                    'at(1.0, 5)'],
      ['Drag the radius slider and watch what forms where.',        'at(1.0, 5)']
    ]
  },

  'big-bang': {
    helper:
      "/* Each beat declares its own epoch. setTime already pauses playback, so the\n" +
      "   only thing needed here is that no beat relies on a predecessor's cue. */\n" +
      "const at = t => setTime(t);\n" +
      "const atEpoch = n => setEpoch(n);",
    imports: false,
    beats: [
      ['happened because it was cooling down.',                     'at(1e-36)'],
      ['Particles that touch simply blow apart.',                   'at(1e-36)'],
      ['below some binding energy.',                                'at(1e-30)'],
      ['have never come apart since.',                              'at(1e-8)'],
      ['building the lightest elements.',                           'at(1e-5)'],
      ['The evidence is still sitting there.',                      "atEpoch('Nucleosynthesis')"],
      ['before being knocked sideways.',                            "atEpoch('Nucleosynthesis')"],
      ['is still travelling.',                                      "atEpoch('Matter–radiation equality')"],
      ['on what light can ever show us.',                           "atEpoch('Recombination')"],
      ['everything you have ever seen was assembled after that.',   "atEpoch('Recombination')"],
      ['Watch the row that says whether we can observe it.',        "atEpoch('Now')"],
      ['the first instant has no accepted theory at all.',          'at(1e-43)'],
      ['the readout tells you which is which the whole way along.', 'at(1e-43)']
    ]
  },

  'little-red-dots': {
    helper:
      "/* Only one piece of state on this page — which model is selected — but the\n" +
      "   scorecard is the whole point, so every beat has to pin it. */\n" +
      "const at = k => setModel(k);",
    imports: false,
    beats: [
      ['This page is about something nobody understands yet.',      "at('Black hole star')"],
      ['no agreed explanation for what they are.',                  "at('Black hole star')"],
      ['ordinary dusty galaxies do not do that.',                   "at('Black hole star')"],
      ['a thousand to three thousand kilometres a second.',         "at('Black hole star')"],
      ['Except for the next fact.',                                 "at('Black hole star')"],
      ['That contradiction is the whole problem.',                  "at('Black hole star')"],
      ['skipping the usual star-and-supernova route.',              "at('Direct-collapse seed')"],
      ['it just does not account for everything.',                  "at('Direct-collapse seed')"],
      ['in short violent bursts.',                                  "at('Super-Eddington bursts')"],
      ['The envelope would swallow the X-rays.',                    "at('Black hole star')"],
      ['stars packed unbelievably tightly together.',               "at('Supermassive first stars')"],
      ['tripping over the rest.',                                   "at('Black hole star')"],
      ['that is what an open problem looks like while it is still open.', "at('Black hole star')"]
    ]
  },

  'are-we-alone': {
    helper:
      "/* The measured terms and the guessed terms are separate state. A beat that\n" +
      "   inherits either one shows the wrong N, which is the entire argument. */\n" +
      "const setMeasured = (R, fp, ne) => { setTerm('R',R); setTerm('fp',fp); setTerm('ne',ne); };\n" +
      "const at = (scenario, R=1.6, fp=1.0, ne=0.4) => { setScenario(scenario); setMeasured(R,fp,ne); };",
    imports: false,
    beats: [
      ['Are we the only ones?',                                     "at('Middle')"],
      ['stays detectable.',                                         "at('Middle')"],
      ['and that split is the whole story.',                        "at('Middle')"],
      ['a rocky world at the right distance.',                      "at('Middle')"],
      ['as far in each direction as anyone would defend.',          "at('Middle')"],
      ['And back the other way, to the most generous values.',      "at('Middle', 0.5, 0.1, 0.01)"],
      ['makes almost no difference to the result.',                 "at('Middle', 10, 1.0, 2)"],
      ['And how long it keeps broadcasting.',                       "at('Middle')"],
      ['That is a textbook selection effect.',                      "at('Middle')"],
      ['by somebody who thought hard about it.',                    "at('Middle')"],
      ['The galaxy is crowded.',                                    "at('Optimistic')"],
      ['Also argued for in print, also by serious people.',         "at('Optimistic')"],
      ['Not one other civilisation in the entire galaxy. We are alone.', "at('Rare Earth')"],
      ['swung by fourteen orders of magnitude.',                    "at('Rare Earth')"],
      ['which four things we would need to learn to find out.',     "at('Rare Earth')"]
    ]
  },

  'multiverse': {
    helper:
      "/* Three unrelated ideas share this page, so every beat has to pin which one\n" +
      "   is on screen. Inflation time glides — it is a growth process, not a jump. */\n" +
      "const glideT = (t, ms=2400) => tween('mv-t', P.t, t, ms, setT);\n" +
      "const at = (idea, t=2.4, play=false) => {\n" +
      "  setIdea(idea); setPlay(false);\n" +
      "  if(play){ cancelTween('mv-t'); setT(t); setPlay(true); }\n" +
      "  else glideT(t);\n" +
      "};",
    imports: true,
    beats: [
      ['and I am going to keep saying it.',                         "at('Eternal inflation', 2.4, true)"],
      ['people argue past each other constantly because of it.',    "at('Eternal inflation', 2.4, true)"],
      ['in most versions, inflation never actually stops.',         "at('Eternal inflation', 1.2)"],
      ['Each bubble is a universe. Ours is one of them.',           "at('Eternal inflation', 2.4)"],
      ['Nothing will ever get from one to the other.',              "at('Eternal inflation', 3.2)"],
      ['hard to call science in the usual sense.',                  "at('Eternal inflation', 4.5)"],
      ['it comes from quantum mechanics.',                          "at('Eternal inflation', 4.5)"],
      ['one branch without noticing.',                              "at('Many worlds')"],
      ['can currently tell them apart.',                            "at('Many worlds')"],
      ['The third comes from string theory.',                       "at('Many worlds')"],
      ['The blue marker is ours.',                                  "at('String landscape')"],
      ['squared, several times over.',                              "at('String landscape')"],
      ['there is any way to test it.',                              "at('String landscape')"],
      ['come out differently if it were false.',                    "at('String landscape')"],
      ['it is the only one on this page.',                          "at('Eternal inflation', 2.4, true)"],
      ['and it is not the same as true either.',                    "at('Eternal inflation', 2.4, true)"]
    ]
  }
};

let totalPatched = 0, totalMissed = 0;

for(const [id, spec] of Object.entries(MODULES)){
  const p = `site/modules/${id}/index.html`;
  let s = await fs.readFile(p, 'utf8');

  if(spec.imports && !/tween/.test(s.split('\n').slice(0, 60).join('\n'))){
    s = s.replace(/(import \{[^}]*?)(\}\s*\n?\s*from '\.\.\/\.\.\/engine\/engine\.js';)/,
                  '$1, tween, cancelTween$2');
  }
  if(!s.includes('const at =') && !s.includes('const at ='))
    s = s.replace('tour(app, {beats:[', spec.helper + '\n\ntour(app, {beats:[');

  let patched = 0, missed = [];
  for(const [tail, call] of spec.beats){
    /* Anchor on the end of the say: literal, then insert run() after the
       beat's option list but before its closing brace. */
    const idx = s.indexOf(tail);
    if(idx < 0){ missed.push(tail.slice(0, 40)); continue; }

    /* Walk forward to the end of this beat object (the `},` that closes it). */
    let i = s.indexOf("'", idx + tail.length);       // end of the string literal
    let depth = 0, end = -1;
    for(let k = i; k < s.length; k++){
      const c = s[k];
      if(c === '{') depth++;
      else if(c === '}'){ if(depth === 0){ end = k; break; } depth--; }
    }
    if(end < 0){ missed.push(tail.slice(0, 40)); continue; }

    const body = s.slice(idx, end);
    if(/run\(\)\s*\{/.test(body)){
      /* Already has a run() — replace its contents with the canonical call. */
      s = s.slice(0, idx) + body.replace(/run\(\)\s*\{[^}]*\}/, `run(){ ${call}; }`) + s.slice(end);
    } else {
      s = s.slice(0, end) + `,\n  run(){ ${call}; }` + s.slice(end);
    }
    patched++;
  }

  await fs.writeFile(p, s);
  totalPatched += patched; totalMissed += missed.length;
  console.log(`${id.padEnd(20)} ${patched}/${spec.beats.length} beats pinned` +
              (missed.length ? `   MISSED: ${missed.join(' | ')}` : ''));
}

console.log(`\n${totalPatched} beats pinned, ${totalMissed} missed.`);
if(totalMissed) process.exitCode = 1;
