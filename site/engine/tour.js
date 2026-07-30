/* ═══════════════════════════════════════════════════════════════════════════
   Guided tour — shared by every module.

   A module declares what it wants said and what should be true on screen while
   it is said; everything else (sequencing, audio, transport, camera moves,
   keyboard) lives here.

     import { tour } from '../../engine/tour.js';

     tour(app, {
       title:'Life of a star',
       beats:[
         { say:'A star is a fight between gravity and heat.',
           hold:7,                                  // only used when there is no clip
           cam:{pos:[0,60,180], target:[0,0,0], ms:2200},
           run(){ P.mass=1; sM.set(1); rebuild(); },
           at:[{t:3.2, do(){ highlightCore(); }}]   // seconds into the beat
         },
         …
       ]
     });

   Narration is pre-rendered with local Kokoro TTS (voice "ava") by
   render-narration.mjs, which reads the `say:` strings straight out of this
   file's caller — so the audio can never drift from what is on screen. If the
   clips are missing the browser's own speech synthesis stands in, and if that
   is missing too the tour still runs on `hold`.
   ═══════════════════════════════════════════════════════════════════════════ */
import { $, el } from './engine.js';

const plain = html => String(html).replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function tour(app, cfg){
  const beats = (cfg.beats||[]).filter(Boolean);
  if(!beats.length) return null;

  /* ── narration clips ───────────────────────────────────────────────────── */
  const VOICE = {on:true, clips:null, audio:null, heartbeat:null};
  /* The manifest is fetched at load, but a visitor can hit the tour button before
     it lands. Everything that speaks awaits this first, so the browser's own
     synthesiser is only ever heard when the Kokoro clips genuinely are not there —
     never merely because they had not finished loading. */
  const VOICE_READY = fetch('voice/manifest.json')
    .then(r => r.ok ? r.json() : null)
    .then(m => { if(m && m.length) VOICE.clips = m; })
    .catch(()=>{});

  function stopVoice(){
    if(VOICE.heartbeat){ clearInterval(VOICE.heartbeat); VOICE.heartbeat=null; }
    if(VOICE.audio){
      try{ VOICE.audio.pause(); VOICE.audio.onended=null; VOICE.audio.onerror=null; }catch(_){}
      VOICE.audio=null;
    }
    try{ speechSynthesis.cancel(); }catch(_){}
  }

  async function speak(idx, text, token, onDone){
    stopVoice();
    if(!VOICE.on){ onDone(); return; }
    await VOICE_READY;
    if(token !== T.token) return;         // beat changed while we waited

    const clip = VOICE.clips && VOICE.clips[idx];
    if(clip){
      const a = new Audio(clip.file);
      a.onended = onDone;
      a.onerror = onDone;                 // missing file — fall through to hold
      /* timeupdate keeps running when requestAnimationFrame is throttled — a
         backgrounded tab, a slow device — so the beat's cues still land. */
      a.addEventListener('timeupdate', ()=>{
        if(token !== T.token || !T.playing) return;
        T.clock = a.currentTime;
        fireDue();
      });
      VOICE.audio = a;
      a.play().catch(onDone);
      return;
    }
    if(!('speechSynthesis' in window)){ onDone(); return; }
    const u = new SpeechSynthesisUtterance(plain(text));
    const v = pickVoice(); if(v) u.voice = v;
    u.rate = 0.96;
    u.onend = u.onerror = onDone;
    speechSynthesis.speak(u);
    /* Chrome truncates utterances past ~15s unless nudged. */
    VOICE.heartbeat = setInterval(()=>{
      if(speechSynthesis.speaking){ speechSynthesis.pause(); speechSynthesis.resume(); }
    }, 9000);
  }
  function pickVoice(){
    const all = speechSynthesis.getVoices().filter(v=>/^en[-_]?/i.test(v.lang));
    if(!all.length) return null;
    for(const re of [/natural/i,/neural/i,/google (uk|us)/i,/samantha/i,/aria/i,
                     /jenny/i,/sonia/i,/libby/i,/zira/i]){
      const m = all.find(v=>re.test(v.name)); if(m) return m;
    }
    return all[0];
  }
  if('speechSynthesis' in window) speechSynthesis.getVoices();

  /* ── chrome ────────────────────────────────────────────────────────────── */
  const startBtn = el('button','tourbtn');
  startBtn.type = 'button';
  startBtn.innerHTML = '<span class="tb-ico">▶</span><span class="tb-lab">Guided tour</span>';
  startBtn.title = 'Play the narrated walkthrough  (T)';
  const tools = document.querySelector('.brand .tools');
  if(tools) tools.insertBefore(startBtn, tools.firstChild);
  else document.querySelector('.brand')?.appendChild(startBtn);

  const bar = el('div'); bar.id = 'tourbar';
  bar.innerHTML =
    '<div class="tb-head">'+
      '<div class="tb-dots" role="tablist" aria-label="Tour beats"></div>'+
      '<span class="tb-count"></span>'+
      '<button class="tb-x" type="button" title="Leave the tour  (Esc)" aria-label="Leave the tour">✕</button>'+
    '</div>'+
    '<p class="tb-say" aria-live="polite"></p>'+
    '<div class="tb-foot">'+
      '<button class="tb-b" data-a="prev" type="button" title="Previous  (←)" aria-label="Previous beat">⏮</button>'+
      '<button class="tb-b tb-play" data-a="play" type="button" title="Pause  (Space)" aria-label="Pause">❚❚</button>'+
      '<button class="tb-b" data-a="next" type="button" title="Next  (→)" aria-label="Next beat">⏭</button>'+
      '<span class="tb-sp"></span>'+
      '<button class="tb-b tb-mute" data-a="mute" type="button" title="Mute narration  (M)" aria-label="Mute narration">🔊</button>'+
    '</div>';
  ($('#stage')||document.body).appendChild(bar);

  const dotsBox = bar.querySelector('.tb-dots');
  const sayBox  = bar.querySelector('.tb-say');
  const countEl = bar.querySelector('.tb-count');
  const playBtn = bar.querySelector('.tb-play');
  const muteBtn = bar.querySelector('.tb-mute');

  const dots = beats.map((b,n)=>{
    const d = el('button','tb-dot');
    d.type='button';
    d.title = (n+1)+'. '+plain(b.say).slice(0,54)+'…';
    d.setAttribute('aria-label','Beat '+(n+1));
    d.addEventListener('click',()=>goto(n));
    dotsBox.appendChild(d);
    return d;
  });

  /* ── state ─────────────────────────────────────────────────────────────── */
  const T = {on:false, i:-1, playing:true, token:0, clock:0, hold:0, fired:null, raf:null};

  function paint(){
    dots.forEach((d,n)=>{
      d.classList.toggle('on', n===T.i);
      d.classList.toggle('past', n<T.i);
    });
    countEl.textContent = (T.i+1)+' / '+beats.length;
    playBtn.textContent = T.playing ? '❚❚' : '▶';
    playBtn.title = T.playing ? 'Pause  (Space)' : 'Play  (Space)';
    playBtn.setAttribute('aria-label', T.playing ? 'Pause' : 'Play');
    muteBtn.textContent = VOICE.on ? '🔊' : '🔇';
    muteBtn.title = VOICE.on ? 'Mute narration  (M)' : 'Unmute narration  (M)';
  }

  /* A beat's `at` times are written against the spoken words — "switch it off when
     she says four seconds in" — so the narration's own playback position is the
     honest clock. It also survives a buffering stall, which a wall clock does not.
     The rAF accumulator is only the stand-in for when nothing is speaking. */
  function fireDue(){
    if(!T.on || !T.playing) return;
    const b = beats[T.i];
    if(b && b.at) b.at.forEach((a,k)=>{
      if(!T.fired[k] && T.clock >= a.t){ T.fired[k]=true; try{ a.do(); }catch(e){ console.warn(e); } }
    });
    if(T.hold > 0 && T.clock >= T.hold) advance(T.token);
  }

  /* Own rAF loop rather than app.onFrame — the module already owns that slot,
     and registering here would silently replace the module's own animation. */
  function tick(now){
    T.raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - (tick.last||now))/1000); tick.last = now;
    if(!T.on || !T.playing) return;
    const a = VOICE.audio;
    if(a && !a.paused && isFinite(a.currentTime)) T.clock = a.currentTime;
    else T.clock += dt;
    fireDue();
  }

  function advance(token){
    if(token !== T.token) return;
    T.hold = 0;
    goto(T.i + 1);
  }

  function goto(n){
    if(!T.on) return;
    if(n < 0) n = 0;
    if(n >= beats.length){ finish(); return; }
    const token = ++T.token;
    T.i = n; T.clock = 0; T.hold = 0;
    const b = beats[n];
    T.fired = (b.at||[]).map(()=>false);

    sayBox.innerHTML = b.say;
    paint();

    if(b.cam) app.flyTo(b.cam.pos, b.cam.target, reduced() ? 0 : (b.cam.ms ?? 2000));
    if(b.run){ try{ b.run(); }catch(e){ console.warn(e); } }

    /* When a clip plays, `ended` drives the advance. When nothing speaks — muted,
       missing clip, no TTS — fall back to the declared hold so the tour still moves. */
    const holdFor = () => b.hold ?? Math.max(4, plain(b.say).split(/\s+/).length / 2.6);
    speak(n, b.say, token, ()=>{
      if(token !== T.token) return;
      if(VOICE.clips && VOICE.clips[n]) setTimeout(()=>advance(token), 420);
      else T.hold = holdFor();
    });
    if(!VOICE.on) T.hold = holdFor();
  }

  function start(){
    if(T.on) return;
    T.on = true; T.playing = true; T.i = -1;
    document.documentElement.classList.add('touring');
    $('#app').classList.add('tour');
    startBtn.classList.add('running');
    if(!T.raf) T.raf = requestAnimationFrame(tick);
    goto(0);
  }
  function finish(){ stop(true); }
  function stop(completed){
    if(!T.on) return;
    T.on = false; T.token++;
    stopVoice();
    if(T.raf){ cancelAnimationFrame(T.raf); T.raf = null; }
    document.documentElement.classList.remove('touring');
    $('#app').classList.remove('tour');
    startBtn.classList.remove('running');
    /* Replaying is the common case after finishing, so say so on the button. */
    startBtn.querySelector('.tb-lab').textContent = completed ? 'Replay the tour' : 'Guided tour';
    if(cfg.onEnd) try{ cfg.onEnd(completed); }catch(e){ console.warn(e); }
  }
  function togglePlay(){
    T.playing = !T.playing;
    if(VOICE.audio){ T.playing ? VOICE.audio.play().catch(()=>{}) : VOICE.audio.pause(); }
    else if('speechSynthesis' in window){
      T.playing ? speechSynthesis.resume() : speechSynthesis.pause();
    }
    paint();
  }

  startBtn.addEventListener('click', ()=> T.on ? stop(false) : start());
  bar.querySelector('.tb-x').addEventListener('click', ()=>stop(false));
  bar.addEventListener('click', e=>{
    const b = e.target.closest('.tb-b'); if(!b) return;
    const a = b.dataset.a;
    if(a==='prev') goto(T.i-1);
    else if(a==='next') goto(T.i+1);
    else if(a==='play') togglePlay();
    else if(a==='mute'){
      VOICE.on = !VOICE.on;
      if(!VOICE.on){ stopVoice(); const bt=beats[T.i];
        T.hold = (bt?.hold) ?? 7; }
      else goto(T.i);                       // restart the beat with sound
      paint();
    }
  });

  /* Backgrounding the tab stops requestAnimationFrame, which would freeze the
     timed actions inside a beat while the narration carried on talking — the
     picture and the words would drift apart. Pause instead, and stay paused:
     coming back to a tab that resumes narrating on its own is startling. */
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden && T.on && T.playing) togglePlay();
  });

  addEventListener('keydown', e=>{
    if(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    const k = e.key.toLowerCase();
    if(k==='t' && !T.on){ e.preventDefault(); start(); return; }
    if(!T.on) return;
    if(k==='escape'){ e.preventDefault(); stop(false); }
    else if(k===' '){ e.preventDefault(); togglePlay(); }
    else if(e.key==='ArrowRight'){ e.preventDefault(); goto(T.i+1); }
    else if(e.key==='ArrowLeft'){ e.preventDefault(); goto(T.i-1); }
    else if(k==='m'){ e.preventDefault(); muteBtn.click(); }
  });

  paint();
  return {start, stop, goto, get index(){ return T.i; }, beats};
}
