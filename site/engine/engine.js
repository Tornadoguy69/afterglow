/* ═══════════════════════════════════════════════════════════════════════════
   Shared engine. A module supplies physics, a scene, a plot and a caption;
   everything below is handled here so no module has to rewrite it.

     import { boot, ui, Plot } from '../../engine/engine.js';

   ═══════════════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';
import { OrbitControls }   from 'three/addons/controls/OrbitControls.js';
import { EffectComposer }  from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }      from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass }      from 'three/addons/postprocessing/OutputPass.js';

export { THREE };

/* PAL is mutated in place when the theme changes, so modules can keep a reference
   to it and simply redraw. Values mirror the CSS custom properties exactly. */
export const PAL = {};
const THEMES = {
  light:{
    ink:'#141413', ink2:'#3F3F3B', ink3:'#6E6D66', ink4:'#97958D',
    paper:'#FAFAF7', paper2:'#F2F1EC', paper3:'#EAE8E1', manila:'#EBDBBC',
    line:'#E3E1D9', line2:'#CFCCC2',
    clay:'#C1613F', clay2:'#D97757', kraft:'#B8874F',
    sage:'#6E8B63', blue:'#5B7FA6', rust:'#A8483A', plum:'#7B5E8C'
  },
  dark:{
    ink:'#F2F1EB', ink2:'#D2D0C7', ink3:'#9E9C93', ink4:'#736F66',
    paper:'#1A1A18', paper2:'#232320', paper3:'#2D2D29', manila:'#383126',
    line:'#2E2E2A', line2:'#3F3F38',
    clay:'#E08A67', clay2:'#EDA184', kraft:'#D0A472',
    sage:'#8FB183', blue:'#84A8CE', rust:'#D4705F', plum:'#A98BC4'
  }
};
const redrawHooks = [];
export function onThemeChange(fn){ redrawHooks.push(fn); }

export function getTheme(){
  return document.documentElement.getAttribute('data-theme') || 'light';
}
export function setTheme(name){
  const t = THEMES[name] ? name : 'light';
  Object.assign(PAL, THEMES[t]);
  if(t==='dark') document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.removeAttribute('data-theme');
  try{ localStorage.setItem('afterglow-theme', t); }catch(_){}
  redrawHooks.forEach(fn=>{ try{ fn(t); }catch(e){ console.warn(e); } });
}
/* Resolve before first paint: stored choice, else the OS preference. */
setTheme((()=>{
  try{ const s=localStorage.getItem('afterglow-theme'); if(s) return s; }catch(_){}
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
})());

/* ─────────────────────────── small DOM helpers ─────────────────────────── */
export const $  = s => document.querySelector(s);
export const el = (t,c,h)=>{const n=document.createElement(t); if(c)n.className=c;
                            if(h!==undefined)n.innerHTML=h; return n;};
export const fmt = (v,d=2)=>Number(v).toFixed(d);
export const sci = (v,d=2)=>{
  if(!isFinite(v)) return '—';
  if(v===0) return '0';
  const e=Math.floor(Math.log10(Math.abs(v)));
  if(e>=-2&&e<=3) return (+v.toPrecision(d+1)).toString();
  return (v/Math.pow(10,e)).toFixed(d)+'e'+e;
};

/* ─────────────────────────── panel widgets ─────────────────────────── */
const SEC_STATE = new Map();

export const ui = {
  section(title, ...kids){
    const s = el('div','sec');
    const body = el('div','sec-body'); const inner = el('div','inner');
    kids.forEach(k=>k&&inner.appendChild(k)); body.appendChild(inner);
    if(title){
      const h = el('h3');
      h.append(document.createTextNode(title), el('span','chev','▼'));
      if(SEC_STATE.get(title)) s.classList.add('closed');
      h.addEventListener('click',()=>{
        s.classList.toggle('closed');
        SEC_STATE.set(title, s.classList.contains('closed'));
      });
      s.appendChild(h);
    }
    s.appendChild(body);
    return s;
  },

  /* o.log maps the track logarithmically — useful when a quantity spans decades */
  slider(o){
    const enc = v => o.log? Math.log10(v) : v;
    const dec = s => o.log? Math.pow(10,s) : s;
    const wrap = el('div','ctl');
    const lab = el('label'); const nm = el('span','nm',o.label); const vl = el('span','vl');
    lab.append(nm,vl); wrap.appendChild(lab);
    const inp = el('input'); inp.type='range';
    inp.min=enc(o.min); inp.max=enc(o.max);
    inp.step = o.log? (enc(o.max)-enc(o.min))/600 : (o.step??0.01);
    inp.value=enc(o.value);
    wrap.appendChild(inp);
    const val = ()=>dec(+inp.value);
    const show = ()=> vl.textContent =
      (o.fmt? o.fmt(val()) : fmt(val(), o.d??2)) + (o.unit? ' '+o.unit : '');
    inp.addEventListener('input',()=>{show(); o.on && o.on(val());});
    show();
    return {node:wrap, get:val, set:v=>{inp.value=enc(v);show();}, input:inp};
  },

  toggle(o){
    const l = el('label','chk'); const i = el('input'); i.type='checkbox'; i.checked=!!o.value;
    l.append(i, el('span',null,o.label));
    i.addEventListener('change',()=>o.on && o.on(i.checked));
    return {node:l, get:()=>i.checked, set:v=>{i.checked=v;}};
  },

  button(label,onClick,cls){
    const b=el('button','btn'+(cls?' '+cls:''),label);
    b.addEventListener('click',onClick); return b;
  },
  btnRow(...kids){ const d=el('div','btnrow'); kids.forEach(k=>d.appendChild(k)); return d; },

  readout(rows){
    const t = el('table','ro'); const map={};
    rows.forEach(r=>{
      const tr=el('tr'); if(r.cls) tr.className=r.cls;
      const k=el('td');
      if(r.tip){ const s=el('span'); s.textContent=r.k; s.dataset.tip=r.tip; k.appendChild(s); }
      else k.textContent=r.k;
      tr.append(k, el('td',null,'—'));
      t.appendChild(tr); map[r.id]=tr.lastChild;
    });
    return {node:t, set:(id,v)=>{ if(map[id]) map[id].innerHTML=v; }};
  },

  legend(items){
    const d=el('div','lg');
    items.forEach(([c,t])=>{ const s=el('span'); const i=el('i'); i.style.background=c;
      s.append(i,document.createTextNode(t)); d.appendChild(s); });
    return d;
  },

  eq(html){ return el('div','eq',html); },
  note(html){ return el('p','note',html); },
  ref(html){ return el('p','ref',html); }
};

/* ─────────────────────────── 2D plot on the inspector canvas ─────────────────────────── */
export function Plot(cfg){
  const ctx = Plot.ctx;
  const {x0=52,y0=246,x1=414,y1=18} = cfg;
  const W=x1-x0, H=y0-y1;
  const tx = v => x0 + W*(v-cfg.xmin)/(cfg.xmax-cfg.xmin);
  const ty = v => y0 - H*(v-cfg.ymin)/(cfg.ymax-cfg.ymin);
  const clip = fn => { ctx.save(); ctx.beginPath(); ctx.rect(x0,y1,W,H); ctx.clip(); fn(); ctx.restore(); };
  return {
    x0,y0,x1,y1,tx,ty,
    frame(title,xlab,ylab,xticks,yticks){
      ctx.clearRect(0,0,430,290);
      ctx.fillStyle=PAL.paper; ctx.fillRect(0,0,430,290);
      ctx.strokeStyle=PAL.line; ctx.lineWidth=1;
      ctx.font='9.5px "IBM Plex Mono",ui-monospace,monospace'; ctx.fillStyle=PAL.ink4;
      xticks.forEach(v=>{ const X=Math.round(tx(v))+.5;
        ctx.beginPath(); ctx.moveTo(X,y1); ctx.lineTo(X,y0); ctx.stroke();
        ctx.textAlign='center'; ctx.fillText(cfg.xfmt?cfg.xfmt(v):v, X, y0+14); });
      yticks.forEach(v=>{ const Y=Math.round(ty(v))+.5;
        ctx.beginPath(); ctx.moveTo(x0,Y); ctx.lineTo(x1,Y); ctx.stroke();
        ctx.textAlign='right'; ctx.fillText(cfg.yfmt?cfg.yfmt(v):v, x0-7, Y+3); });
      ctx.strokeStyle=PAL.line2; ctx.strokeRect(x0+.5,y1+.5,W,H);
      ctx.fillStyle=PAL.ink; ctx.textAlign='left';
      ctx.font='500 10.5px Inter,system-ui,sans-serif';
      ctx.fillText(title, x0, y1-7);
      ctx.textAlign='center'; ctx.fillStyle=PAL.ink4;
      ctx.font='10px Inter,system-ui,sans-serif';
      ctx.fillText(xlab, x0+W/2, 285);
      ctx.save(); ctx.translate(14,y1+H/2); ctx.rotate(-Math.PI/2);
      ctx.fillText(ylab,0,0); ctx.restore();
    },
    line(pts,color,width=1.6,dash=null){
      if(!pts||!pts.length) return;
      clip(()=>{
        ctx.strokeStyle=color; ctx.lineWidth=width;
        if(dash) ctx.setLineDash(dash);
        ctx.beginPath();
        pts.forEach((p,i)=> i? ctx.lineTo(tx(p[0]),ty(p[1])) : ctx.moveTo(tx(p[0]),ty(p[1])));
        ctx.stroke();
      });
    },
    pts(pts,color,r=2.2){
      clip(()=>{ ctx.fillStyle=color;
        pts.forEach(p=>{ ctx.beginPath(); ctx.arc(tx(p[0]),ty(p[1]),r,0,7); ctx.fill(); }); });
    },
    marker(x,y,color,r=4){
      clip(()=>{
        ctx.fillStyle=color; ctx.beginPath(); ctx.arc(tx(x),ty(y),r,0,7); ctx.fill();
        ctx.strokeStyle=PAL.paper; ctx.lineWidth=1.6; ctx.stroke();
      });
    },
    vline(v,color,dash=[3,3]){
      ctx.save(); ctx.strokeStyle=color; ctx.setLineDash(dash); ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(tx(v),y1); ctx.lineTo(tx(v),y0); ctx.stroke(); ctx.restore();
    },
    hline(v,color,dash=[3,3]){
      ctx.save(); ctx.strokeStyle=color; ctx.setLineDash(dash); ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(x0,ty(v)); ctx.lineTo(x1,ty(v)); ctx.stroke(); ctx.restore();
    },
    label(txt,x,y,color,align='left'){
      ctx.font='500 10px Inter,system-ui,sans-serif';
      ctx.fillStyle=color; ctx.textAlign=align; ctx.fillText(txt,x,y);
    }
  };
}

/* ─────────────────────────── textures ─────────────────────────── */
export function starTexture(spikes){
  const s=128, c=document.createElement('canvas'); c.width=c.height=s;
  const g=c.getContext('2d'), h=s/2;
  const r=g.createRadialGradient(h,h,0,h,h,h);
  r.addColorStop(0.00,'rgba(255,255,255,1)');
  r.addColorStop(0.06,'rgba(255,255,255,0.72)');
  r.addColorStop(0.16,'rgba(255,255,255,0.20)');
  r.addColorStop(0.34,'rgba(255,255,255,0.045)');
  r.addColorStop(0.62,'rgba(255,255,255,0.010)');
  r.addColorStop(1.00,'rgba(255,255,255,0)');
  g.fillStyle=r; g.fillRect(0,0,s,s);
  if(spikes){
    g.globalCompositeOperation='lighter';
    for(const a of [0,Math.PI/2]){
      g.save(); g.translate(h,h); g.rotate(a);
      const lg=g.createLinearGradient(-h,0,h,0);
      lg.addColorStop(0,'rgba(255,255,255,0)');
      lg.addColorStop(0.5,'rgba(255,255,255,0.55)');
      lg.addColorStop(1,'rgba(255,255,255,0)');
      g.fillStyle=lg; g.fillRect(-h,-1.1,s,2.2); g.restore();
    }
  }
  const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; return t;
}

/* A shell of distant field stars, so scenes have depth instead of floating in void. */
export function deepField(scene, radius, count, scale, tex){
  const pos=new Float32Array(count*3), col=new Float32Array(count*3), sz=new Float32Array(count);
  const c=new THREE.Color();
  for(let i=0;i<count;i++){
    const r=radius*(0.75+0.25*Math.random());
    const ct=2*Math.random()-1, st=Math.sqrt(1-ct*ct), ph=Math.random()*6.2832;
    pos[i*3]=r*st*Math.cos(ph); pos[i*3+1]=r*ct; pos[i*3+2]=r*st*Math.sin(ph);
    c.setHSL(0.07+0.06*Math.random(), 0.25+0.35*Math.random(), 0.55+0.35*Math.random());
    col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
    sz[i]=0.35+1.5*Math.pow(Math.random(),3);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  g.setAttribute('color',new THREE.BufferAttribute(col,3));
  g.setAttribute('psize',new THREE.BufferAttribute(sz,1));
  const m=new THREE.ShaderMaterial({
    uniforms:{uMap:{value:tex||starTexture(true)},uOpacity:{value:0.6},
              uScale:{value:scale},uRef:{value:radius}},
    transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, vertexColors:true,
    vertexShader:`uniform float uScale,uRef; attribute float psize; varying vec3 vC;
      void main(){ vC=color; vec4 mv=modelViewMatrix*vec4(position,1.0);
        gl_PointSize=psize*uScale*(uRef/max(-mv.z,1.0)); gl_Position=projectionMatrix*mv; }`,
    fragmentShader:`uniform sampler2D uMap; uniform float uOpacity; varying vec3 vC;
      void main(){ vec4 t=texture2D(uMap,gl_PointCoord);
        gl_FragColor=vec4(vC*t.r*1.5, t.a*uOpacity); }`
  });
  const p=new THREE.Points(g,m); p.frustumCulled=false; scene.add(p); return p;
}

/* ═══════════════════════════════════════════════════════════════════════════
   boot() — renderer, bloom, camera, controls, smooth zoom, resize, inspector
   drag, divider resize, tooltips. Returns the pieces a module needs.
   ═══════════════════════════════════════════════════════════════════════════ */
export function boot(opts={}){
  const canvas = $('#gl');
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setClearColor(opts.clear ?? 0x0B0B0A, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = opts.exposure ?? 0.78;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(opts.fov??42, 1, opts.near??0.5, opts.far??20000);
  camera.position.copy(opts.cameraPos || new THREE.Vector3(0,80,220));

  const composer   = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene,camera);
  const bloom = new UnrealBloomPass(new THREE.Vector2(1024,1024),
    opts.bloom?.strength ?? 0.24, opts.bloom?.radius ?? 0.48, opts.bloom?.threshold ?? 0.62);
  composer.addPass(renderPass); composer.addPass(bloom); composer.addPass(new OutputPass());

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.06;
  controls.enableZoom = false;                       // replaced by the smooth dolly below
  const dist = opts.dist || [1, 5000];
  controls.minDistance = dist[0]; controls.maxDistance = dist[1];
  controls.target.copy(opts.target || new THREE.Vector3());
  controls.update();
  const home = {pos:camera.position.clone(), tgt:controls.target.clone()};

  /* OrbitControls applies its dolly in a single frame and ignores deltaY magnitude,
     which makes the wheel jump. Accumulate a target distance and ease to it. */
  const ZOOM = {target:null, tau:0.10, k:0.00085};
  canvas.addEventListener('wheel',e=>{
    e.preventDefault();
    let d=e.deltaY;
    if(e.deltaMode===1) d*=16; else if(e.deltaMode===2) d*=100;
    d=Math.max(-100,Math.min(100,d));
    const cur=(ZOOM.target!=null)? ZOOM.target : camera.position.distanceTo(controls.target);
    ZOOM.target=Math.min(dist[1],Math.max(dist[0],cur*Math.exp(d*ZOOM.k)));
  },{passive:false});
  function applyZoom(dt){
    if(ZOOM.target==null) return;
    const off=camera.position.clone().sub(controls.target);
    const cur=off.length();
    if(Math.abs(cur-ZOOM.target)<=cur*2e-4){ ZOOM.target=null; return; }
    const a=1-Math.exp(-dt/ZOOM.tau);
    camera.position.copy(controls.target).add(off.multiplyScalar((cur+(ZOOM.target-cur)*a)/cur));
  }

  const inset = $('#inset');
  if(inset){
    const dpr=Math.min(devicePixelRatio,2);
    inset.width=430*dpr; inset.height=290*dpr;
    Plot.ctx = inset.getContext('2d');
    Plot.ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  /* Size is reconciled every frame against the canvas's actual layout box.
     A ResizeObserver alone is not reliable here — an unreferenced observer can be
     collected, and it can miss the case where layout settles after boot. The symptom
     is nasty and non-obvious: the drawing buffer keeps a stale size and the scene
     renders into the wrong region of the canvas. */
  function resize(){
    const w=canvas.clientWidth, h=canvas.clientHeight;
    if(w<2||h<2) return false;
    if(canvas.width===w && canvas.height===h) return false;
    renderer.setSize(w,h,false); composer.setSize(w,h); bloom.resolution.set(w,h);
    camera.aspect=w/h; camera.updateProjectionMatrix();
    return true;
  }
  addEventListener('resize',resize);
  resize();

  wireInspector(); wireDivider(); wireTooltips(); wireChrome();

  addEventListener('keydown',e=>{
    if(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    const k=e.key.toLowerCase();
    if(k==='r'){
      ZOOM.target=null;
      camera.position.copy(home.pos); controls.target.copy(home.tgt); controls.update();
    }
    else if(k==='d') setTheme(getTheme()==='dark'?'light':'dark');
    else if(k==='p'){ $('#app').classList.toggle('panel-hidden'); window.__paintPanel?.(); }
    else if(k==='i'){ $('#insMin')?.click(); }
  });

  let last=performance.now(), onFrame=null;
  (function loop(now){
    requestAnimationFrame(loop);
    const dt=Math.min(0.05,(now-last)/1000); last=now;
    resize();                       // cheap: only acts when the layout box actually changed
    if(onFrame) onFrame(dt);
    controls.update(); applyZoom(dt);
    composer.render();
  })(last);

  return {
    scene, camera, renderer, composer, controls, resize,
    setPanel(node){ const p=$('#panel'); p.innerHTML=''; p.appendChild(node); },
    setCaption(html){ const c=$('#caption'); if(c) c.innerHTML=html; },
    setInsetTitle(t){ const n=$('#insTitle'); if(n) n.textContent=t; },
    onFrame(fn){ onFrame=fn; },
    /* Register the module's draw function so its 2D plot repaints on theme change —
       the canvas is owned by the module, so the engine cannot repaint it itself. */
    onThemeChange(fn){ onThemeChange(fn); },
    resetView(){ ZOOM.target=null; camera.position.copy(home.pos);
                 controls.target.copy(home.tgt); controls.update(); }
  };
}

/* ─────────────────────────── chrome wiring ─────────────────────────── */
/* An icon button whose glyph animates when its meaning changes. Exported so the
   static pages can use exactly the same control. */
export function iconButton({icon, title, onClick}){
  const b = el('button','iconbtn');
  b.type='button';
  const ico = el('span','ico', icon);
  b.appendChild(ico);
  b.title = title; b.setAttribute('aria-label', title);
  let busy = false;
  b.set = (nextIcon, nextTitle) => {
    b.title = nextTitle; b.setAttribute('aria-label', nextTitle);
    if(ico.textContent === nextIcon || busy) { ico.textContent = nextIcon; return; }
    busy = true;
    ico.classList.add('swap');                 // spin out
    setTimeout(()=>{
      ico.textContent = nextIcon;
      ico.classList.remove('swap');            // spin back in, the other way
      busy = false;
    }, 160);
  };
  if(onClick) b.addEventListener('click', onClick);
  return b;
}

/* Injects the theme toggle, the panel toggle and a skip link, so every module gets
   them without repeating the markup. */
function wireChrome(){
  const brand=document.querySelector('.brand');
  if(brand && !brand.querySelector('.tools')){
    const tools=el('div','tools');

    const theme = iconButton({
      icon: getTheme()==='dark' ? '☀' : '☾',
      title: getTheme()==='dark' ? 'Switch to light  (D)' : 'Switch to dark  (D)',
      onClick: ()=> setTheme(getTheme()==='dark'?'light':'dark')
    });
    const paintTheme = ()=>{
      const d = getTheme()==='dark';
      theme.set(d?'☀':'☾', d?'Switch to light  (D)':'Switch to dark  (D)');
    };
    onThemeChange(paintTheme);

    /* One control, two states. The button that hid the panel is the button that
       brings it back — no second control appearing elsewhere on screen. */
    /* » and « rather than ⇥/⇤ — the arrow-to-bar glyphs fall back inconsistently
       across fonts and render as a plain arrow, which loses the meaning. */
    const pan = iconButton({ icon:'»', title:'Hide the panel  (P)',
      onClick: ()=>{ $('#app').classList.toggle('panel-hidden'); paintPanel(); } });
    const paintPanel = ()=>{
      const hidden = $('#app').classList.contains('panel-hidden');
      pan.set(hidden?'«':'»', hidden?'Show the panel  (P)':'Hide the panel  (P)');
    };
    window.__paintPanel = paintPanel;          // so the P shortcut can keep it in sync

    tools.append(theme,pan);
    brand.appendChild(tools);
  }
  if(!document.querySelector('.skip')){
    const s=el('a','skip','Skip to controls');
    s.href='#panel';
    document.body.insertBefore(s, document.body.firstChild);
  }
}

function wireInspector(){
  const insp=$('#inspector'), bar=$('#insBar'); if(!insp||!bar) return;
  let dx=0,dy=0,on=false;
  bar.addEventListener('pointerdown',e=>{
    if(e.target.closest('.ib')) return;
    on=true; insp.classList.add('drag');
    const r=insp.getBoundingClientRect(), s=$('#stage').getBoundingClientRect();
    dx=e.clientX-r.left; dy=e.clientY-r.top;
    insp.style.right='auto';
    insp.style.left=(r.left-s.left)+'px'; insp.style.top=(r.top-s.top)+'px';
    try{ bar.setPointerCapture(e.pointerId); }catch(_){}
  });
  bar.addEventListener('pointermove',e=>{
    if(!on) return;
    const s=$('#stage').getBoundingClientRect(), r=insp.getBoundingClientRect();
    insp.style.left=Math.min(Math.max(e.clientX-s.left-dx,6), s.width -r.width -6)+'px';
    insp.style.top =Math.min(Math.max(e.clientY-s.top -dy,6), s.height-r.height-6)+'px';
  });
  const end=()=>{on=false; insp.classList.remove('drag');};
  bar.addEventListener('pointerup',end); bar.addEventListener('pointercancel',end);
  const min=$('#insMin'), rst=$('#insReset');
  if(min) min.addEventListener('click',()=>{
    const m=insp.classList.toggle('min'); min.textContent=m?'▸':'▾';
  });
  if(rst) rst.addEventListener('click',()=>{
    insp.style.left='auto'; insp.style.right='16px'; insp.style.top='16px';
    insp.classList.remove('min'); if(min) min.textContent='▾';
  });
}
function wireDivider(){
  const div=$('#divider'), panel=$('#panel'); if(!div||!panel) return;
  let on=false;
  div.addEventListener('pointerdown',e=>{
    on=true; div.classList.add('drag'); document.body.style.cursor='col-resize';
    try{ div.setPointerCapture(e.pointerId); }catch(_){}
  });
  div.addEventListener('pointermove',e=>{
    if(!on) return;
    panel.style.width=Math.min(Math.max(innerWidth-e.clientX-14,280),620)+'px';
  });
  const end=()=>{on=false; div.classList.remove('drag'); document.body.style.cursor='';};
  div.addEventListener('pointerup',end); div.addEventListener('pointercancel',end);
}
function wireTooltips(){
  let tip=$('#tip');
  if(!tip){ tip=el('div'); tip.id='tip'; document.body.appendChild(tip); }
  document.addEventListener('pointerover',e=>{
    const t=e.target.closest('[data-tip]'); if(!t) return;
    tip.textContent=t.dataset.tip; tip.classList.add('on');
    const r=t.getBoundingClientRect();
    tip.style.left=Math.max(8,Math.min(r.left, innerWidth-282))+'px';
    tip.style.top =(r.top - tip.offsetHeight - 9)+'px';
  });
  document.addEventListener('pointerout',e=>{
    if(e.target.closest('[data-tip]')) tip.classList.remove('on');
  });
}
