/* Theme switching for the static pages (gallery, contribute) — no three.js needed.
   Kept in sync with the same localStorage key the engine uses, so the choice
   survives navigating between a module and the gallery. */
const KEY = 'afterglow-theme';

export function getTheme(){
  return document.documentElement.getAttribute('data-theme') || 'light';
}
export function setTheme(name){
  const t = name === 'dark' ? 'dark' : 'light';
  if(t === 'dark') document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.removeAttribute('data-theme');
  try{ localStorage.setItem(KEY, t); }catch(_){}
  document.dispatchEvent(new CustomEvent('themechange',{detail:t}));
}

/* Resolve before first paint: stored choice, else the OS preference. */
export function initTheme(){
  let t;
  try{ t = localStorage.getItem(KEY); }catch(_){}
  if(!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  setTheme(t);
}

/* Same animated icon button the engine uses, duplicated here rather than imported
   so the static pages do not have to pull in three.js just to draw a moon. */
export function iconButton({icon, title, onClick}){
  const b = document.createElement('button');
  b.className = 'iconbtn'; b.type = 'button';
  const ico = document.createElement('span');
  ico.className = 'ico'; ico.textContent = icon;
  b.appendChild(ico);
  b.title = title; b.setAttribute('aria-label', title);
  let busy = false;
  b.set = (nextIcon, nextTitle) => {
    b.title = nextTitle; b.setAttribute('aria-label', nextTitle);
    if(ico.textContent === nextIcon || busy){ ico.textContent = nextIcon; return; }
    busy = true;
    ico.classList.add('swap');
    setTimeout(() => { ico.textContent = nextIcon; ico.classList.remove('swap'); busy = false; }, 160);
  };
  if(onClick) b.addEventListener('click', onClick);
  return b;
}

/* Drops a theme toggle into any element you point it at. */
export function mountToggle(host){
  const dark = () => getTheme() === 'dark';
  const b = iconButton({
    icon: dark() ? '☀' : '☾',
    title: dark() ? 'Switch to light  (D)' : 'Switch to dark  (D)',
    onClick: () => setTheme(dark() ? 'light' : 'dark')
  });
  document.addEventListener('themechange', () =>
    b.set(dark() ? '☀' : '☾', dark() ? 'Switch to light  (D)' : 'Switch to dark  (D)'));
  host.appendChild(b);
  return b;
}

addEventListener('keydown', e => {
  if(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  if(e.key.toLowerCase() === 'd') setTheme(getTheme()==='dark'?'light':'dark');
});
