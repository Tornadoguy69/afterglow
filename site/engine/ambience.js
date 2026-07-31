/* ═══════════════════════════════════════════════════════════════════════════
   Ambient sound beds, one per topic.

   Everything here is synthesised in the browser — filtered noise, drones and
   sparse events through a generated reverb. Nothing is sampled, so there is no
   file to ship and no licence to chase, and each topic gets a bed shaped for it
   rather than one generic pad reused nine times.

   Wired from boot(), so a module gets this without asking. The preset is chosen
   from the module's own folder name; a topic with no entry falls back to `void`.

   On the physics: space really is silent. The interstellar medium is about one
   atom per cubic centimetre, which is nothing to carry a pressure wave. These
   are atmosphere, not recordings, and the button says so.
   ═══════════════════════════════════════════════════════════════════════════ */

const KEY = 'afterglow-ambience';

/* ── presets ───────────────────────────────────────────────────────────────
   noise  : looped noise bed. lp = [min,max] Hz swept by an LFO at `lfo` Hz.
   drones : sustained tones. Pairs detuned by a few cents beat slowly against
            each other, which is what stops a drone sounding like a test tone.
   events : sparse one-offs. `every` is a [min,max] gap in seconds.
   wet    : how much goes through the reverb. Big spaces want more.
   ───────────────────────────────────────────────────────────────────────── */
const PRESETS = {
  'black-holes':{
    /* Felt more than heard — but a bed that lives entirely under 200 Hz is not
       subtle on a phone, it is silent: no phone speaker reproduces 27 Hz, and
       most laptops give up below 200. The sub is kept for anyone on headphones,
       and quiet upper partials of it carry the same pitch on small speakers.
       Ear and brain reconstruct the missing fundamental from them. */
    noise:{type:'brown', gain:0.16, lp:[45,560], lfo:0.028},
    drones:[{f:27.5,g:0.20,detune:7},{f:41.2,g:0.09,detune:-6},{f:55,g:0.05,detune:4},
            {f:110,g:0.032,detune:5},{f:165,g:0.016,detune:-8}],
    events:[{kind:'swell', every:[16,30], f:[34,64], g:0.13, dur:[8,14]}],
    wet:0.62
  },
  'stellar-life':{
    /* A furnace: warm, steady, with slow convective movement over the top. */
    noise:{type:'pink', gain:0.10, lp:[180,900], lfo:0.055},
    drones:[{f:65.4,g:0.13,detune:5},{f:98,g:0.06,detune:-7},{f:196,g:0.025,detune:9}],
    events:[{kind:'swell', every:[13,24], f:[120,260], g:0.07, dur:[6,11]}],
    wet:0.42
  },
  'nebulae':{
    /* Thin and airy — a cloud lit from inside rather than anything massive. */
    noise:{type:'pink', gain:0.09, lp:[500,3200], lfo:0.045, hp:220},
    drones:[{f:110,g:0.05,detune:6},{f:164.8,g:0.04,detune:-8},{f:246.9,g:0.025,detune:5}],
    events:[{kind:'blip', every:[7,15], f:[700,1900], g:0.035, dur:[1.6,3.4]}],
    wet:0.72
  },
  'planet-formation':{
    /* Dust and grit orbiting: a low rotation hum with collisions over it. */
    noise:{type:'brown', gain:0.11, lp:[90,520], lfo:0.07},
    drones:[{f:49,g:0.10,detune:6},{f:73.4,g:0.05,detune:-5}],
    events:[{kind:'tick', every:[0.7,2.6], f:[900,4200], g:0.030},
            {kind:'swell', every:[18,32], f:[70,150], g:0.07, dur:[6,10]}],
    wet:0.38
  },
  'expanding-universe':{
    /* Very slow and very wide. Nothing here should ever feel in a hurry. */
    noise:{type:'brown', gain:0.09, lp:[70,760], lfo:0.018},
    drones:[{f:36.7,g:0.13,detune:4},{f:55,g:0.07,detune:-9},{f:82.4,g:0.035,detune:6},
            {f:165,g:0.022,detune:7}],
    events:[{kind:'swell', every:[20,38], f:[50,110], g:0.10, dur:[11,18]}],
    wet:0.70
  },
  'big-bang':{
    /* Hot and unsettled — the noise bed is pushed harder and sweeps wider. */
    noise:{type:'white', gain:0.07, lp:[240,2600], lfo:0.09, hp:130},
    drones:[{f:32.7,g:0.16,detune:9},{f:49,g:0.08,detune:-11},{f:130.8,g:0.03,detune:7}],
    events:[{kind:'swell', every:[9,19], f:[90,340], g:0.11, dur:[4,9]},
            {kind:'tick', every:[1.4,5.0], f:[1400,6000], g:0.022}],
    wet:0.55
  },
  'little-red-dots':{
    /* Sparse and withholding. Long gaps are the point — this is an open problem. */
    noise:{type:'brown', gain:0.08, lp:[60,620], lfo:0.032},
    drones:[{f:43.7,g:0.12,detune:8},{f:58.3,g:0.05,detune:-6},
            {f:131,g:0.026,detune:6}],
    events:[{kind:'blip', every:[11,23], f:[380,1100], g:0.045, dur:[2.2,4.4]}],
    wet:0.66
  },
  'are-we-alone':{
    /* A dish listening: band-limited hiss and the occasional thing that isn't. */
    noise:{type:'pink', gain:0.075, lp:[900,4200], lfo:0.05, hp:400},
    drones:[{f:87.3,g:0.06,detune:5},{f:131,g:0.03,detune:-7}],
    events:[{kind:'blip', every:[6,16], f:[1100,2600], g:0.040, dur:[0.7,1.8]},
            {kind:'tick', every:[2.2,7.0], f:[2200,7000], g:0.018}],
    wet:0.58
  },
  'multiverse':{
    /* Deliberately uncanny: the drones are tuned a little against each other. */
    noise:{type:'brown', gain:0.10, lp:[80,600], lfo:0.024},
    drones:[{f:38.9,g:0.13,detune:14},{f:58.3,g:0.07,detune:-17},
            {f:77.8,g:0.04,detune:21},{f:103.8,g:0.025,detune:-12}],
    events:[{kind:'swell', every:[14,27], f:[60,190], g:0.10, dur:[8,15]}],
    wet:0.75
  },
  /* Anything without an entry of its own. */
  'void':{
    noise:{type:'brown', gain:0.10, lp:[70,500], lfo:0.03},
    drones:[{f:43.7,g:0.12,detune:6},{f:65.4,g:0.05,detune:-7}],
    events:[{kind:'swell', every:[16,30], f:[60,150], g:0.09, dur:[7,13]}],
    wet:0.60
  }
};

const rnd  = (a,b) => a + Math.random()*(b-a);
const pick = () => {
  const m = location.pathname.match(/modules\/([^/]+)/);
  return (m && PRESETS[m[1]]) ? PRESETS[m[1]] : PRESETS.void;
};

/* Noise as a long looped buffer — far cheaper than generating per frame.
   Brown noise is integrated white noise, which is why it sits so low; pink is
   the usual cascaded-filter approximation. */
function noiseBuffer(ctx, type, seconds=9){
  const n = ctx.sampleRate*seconds;
  const buf = ctx.createBuffer(2, n, ctx.sampleRate);
  for(let ch=0; ch<2; ch++){
    const d = buf.getChannelData(ch);
    if(type==='brown'){
      let last=0;
      for(let i=0;i<n;i++){
        const w=Math.random()*2-1;
        last=(last+0.02*w)/1.02; d[i]=last*3.5;
      }
    } else if(type==='pink'){
      let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
      for(let i=0;i<n;i++){
        const w=Math.random()*2-1;
        b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
        b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
        b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
        d[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11; b6=w*0.115926;
      }
    } else {
      for(let i=0;i<n;i++) d[i]=Math.random()*2-1;
    }
  }
  return buf;
}

/* A decaying-noise impulse response. Not a real room, but it is what turns a
   handful of oscillators into something that sounds like it has somewhere to be. */
function reverbBuffer(ctx, seconds=4.2, decay=2.6){
  const n = ctx.sampleRate*seconds;
  const buf = ctx.createBuffer(2, n, ctx.sampleRate);
  for(let ch=0; ch<2; ch++){
    const d = buf.getChannelData(ch);
    for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n, decay);
  }
  return buf;
}

export function ambience(){
  const cfg = pick();
  let on = true;
  try{ const s = localStorage.getItem(KEY); if(s!=null) on = s==='1'; }catch(_){}

  let ctx=null, master=null, ducked=false, timers=[], started=false;

  function build(){
    ctx = new (window.AudioContext||window.webkitAudioContext)();

    master = ctx.createGain();
    master.gain.value = 0;                       // faded in below
    master.connect(ctx.destination);

    const dry = ctx.createGain(); dry.gain.value = 1-cfg.wet;
    const wet = ctx.createGain(); wet.gain.value = cfg.wet;
    const verb = ctx.createConvolver(); verb.buffer = reverbBuffer(ctx);
    dry.connect(master); wet.connect(verb); verb.connect(master);
    const bus = node => { node.connect(dry); node.connect(wet); };

    /* ── noise bed ── */
    if(cfg.noise){
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(ctx, cfg.noise.type);
      src.loop = true;
      let tail = src;
      if(cfg.noise.hp){
        const hp = ctx.createBiquadFilter();
        hp.type='highpass'; hp.frequency.value=cfg.noise.hp;
        tail.connect(hp); tail = hp;
      }
      const lp = ctx.createBiquadFilter();
      lp.type='lowpass'; lp.Q.value=0.7;
      const [lo,hi] = cfg.noise.lp;
      lp.frequency.value=(lo+hi)/2;
      /* Sweeping the cutoff is what keeps a noise bed from reading as hiss. */
      const lfo = ctx.createOscillator(); lfo.frequency.value=cfg.noise.lfo;
      const amt = ctx.createGain(); amt.gain.value=(hi-lo)/2;
      lfo.connect(amt); amt.connect(lp.frequency); lfo.start();
      const g = ctx.createGain(); g.gain.value=cfg.noise.gain;
      tail.connect(lp); lp.connect(g); bus(g);
      src.start();
    }

    /* ── drones ── */
    (cfg.drones||[]).forEach(d=>{
      const o = ctx.createOscillator();
      o.type='sine'; o.frequency.value=d.f; o.detune.value=d.detune||0;
      const g = ctx.createGain(); g.gain.value=d.g;
      /* A slow gain wobble, each at its own rate, so they drift out of phase
         with each other instead of pulsing together. */
      const lfo = ctx.createOscillator(); lfo.frequency.value=rnd(0.012,0.05);
      const amt = ctx.createGain(); amt.gain.value=d.g*0.42;
      lfo.connect(amt); amt.connect(g.gain); lfo.start();
      o.connect(g); bus(g); o.start();
    });

    /* ── sparse events ── */
    (cfg.events||[]).forEach(ev=>{
      const fire = () => {
        if(ctx.state==='running') EVENTS[ev.kind]?.(ctx, bus, ev);
        timers.push(setTimeout(fire, rnd(ev.every[0], ev.every[1])*1000));
      };
      timers.push(setTimeout(fire, rnd(0.5, ev.every[1])*1000));
    });

    started = true;
  }

  const EVENTS = {
    /* A long filtered rise and fall — the bed breathing. */
    swell(ctx, bus, ev){
      const t = ctx.currentTime, dur = rnd(ev.dur[0], ev.dur[1]);
      const o = ctx.createOscillator();
      o.type='sine'; o.frequency.setValueAtTime(rnd(ev.f[0],ev.f[1]), t);
      o.frequency.exponentialRampToValueAtTime(rnd(ev.f[0],ev.f[1]), t+dur);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(ev.g, t+dur*0.42);
      g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
      o.connect(g); bus(g); o.start(t); o.stop(t+dur+0.1);
    },
    /* A soft ping that rings out into the reverb. */
    blip(ctx, bus, ev){
      const t = ctx.currentTime, dur = rnd(ev.dur[0], ev.dur[1]);
      const o = ctx.createOscillator();
      o.type='sine'; o.frequency.value=rnd(ev.f[0],ev.f[1]);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(ev.g, t+0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
      o.connect(g); bus(g); o.start(t); o.stop(t+dur+0.05);
    },
    /* A grain of dust hitting something. */
    tick(ctx, bus, ev){
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(ctx,'white',0.05);
      const bp = ctx.createBiquadFilter();
      bp.type='bandpass'; bp.frequency.value=rnd(ev.f[0],ev.f[1]); bp.Q.value=6;
      const g = ctx.createGain(); g.gain.setValueAtTime(ev.g, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t+0.09);
      src.connect(bp); bp.connect(g); bus(g); src.start(t); src.stop(t+0.1);
    }
  };

  function level(){ return on ? (ducked ? 0.22 : 1) : 0; }
  function fade(to, secs=1.4){
    if(!master) return;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(to, t+secs);
  }

  function enable(){
    if(!started) build();
    if(ctx.state==='suspended') ctx.resume();
    fade(level(), 2.2);
  }
  function disable(){ fade(0, 0.7); }

  /* An AudioContext cannot start before the visitor has interacted with the
     page, so an enabled bed waits for the first gesture rather than failing. */
  if(on){
    const kick = () => {
      removeEventListener('pointerdown', kick); removeEventListener('keydown', kick);
      if(on) enable();
    };
    addEventListener('pointerdown', kick, {once:false});
    addEventListener('keydown', kick, {once:false});
  }

  /* Backgrounded tabs should go quiet. */
  document.addEventListener('visibilitychange', ()=>{
    if(!started || !on) return;
    document.hidden ? fade(0, 0.4) : fade(level(), 1.2);
  });

  const api = {
    get on(){ return on; },
    toggle(){
      on = !on;
      try{ localStorage.setItem(KEY, on?'1':'0'); }catch(_){}
      on ? enable() : disable();
      return on;
    },
    /* Pulled down under narration rather than off, so the tour does not sound
       like it is happening in a different place from the rest of the page. */
    duck(v){ ducked = !!v; if(started && on && !document.hidden) fade(level(), 0.5); }
  };
  window.__ambience = api;
  return api;
}
