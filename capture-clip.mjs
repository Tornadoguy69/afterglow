/* Offline video render of a clip.
 *
 *   node capture-clip.mjs                 renders ?clip=hook
 *   node capture-clip.mjs crash           any preset, or "4,5" for custom beats
 *   node capture-clip.mjs hook --headed   show the browser (use if WebGL fails headless)
 *
 * Drives Chrome over the DevTools Protocol (Node 24 has a built-in WebSocket, so no
 * puppeteer needed), screencasts the page, then muxes the same Ava clips the page uses
 * so picture and voice stay locked. Output: dark-matter-<clip>.mp4
 */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const pexec = promisify(execFile);
const HERE  = path.dirname(fileURLToPath(import.meta.url));
const FPS   = 30;
const W = 1920, H = 1080;
const PORT = 8899;

const args   = process.argv.slice(2);
const CLIP   = args.find(a => !a.startsWith('--')) || 'hook';
const HEADED = args.includes('--headed');
const OUTMP4 = path.join(HERE, `dark-matter-${CLIP.replace(/[^a-z0-9]/gi,'-')}.mp4`);
const FRAMES = path.join(os.tmpdir(), 'dm-frames-' + Date.now());

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
].find(p => fs.existsSync(p));
if (!CHROME) { console.error('No Chromium browser found.'); process.exit(1); }

const log = (...a) => console.log(...a);

/* ---------- make sure the page is being served ---------- */
async function checkServer() {
  try {
    const r = await fetch(`http://127.0.0.1:${PORT}/voice/manifest.json`);
    if (!r.ok) throw new Error('bad status');
    return await r.json();
  } catch {
    console.error(`Nothing serving on ${PORT}. Start it first:\n` +
      `  node -e "..." (see README) or any static server in this folder.`);
    process.exit(1);
  }
}
const manifest = await checkServer();

/* ---------- launch the browser with remote debugging ---------- */
const userDir = path.join(os.tmpdir(), 'dm-chrome-' + Date.now());
const flags = [
  '--remote-debugging-port=0',
  `--user-data-dir=${userDir}`,
  `--window-size=${W},${H}`,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--hide-scrollbars', '--mute-audio', '--force-device-scale-factor=1',
  '--autoplay-policy=no-user-gesture-required',
  '--enable-unsafe-swiftshader',              // software WebGL fallback
  '--disable-features=CalculateNativeWinOcclusion',
];
if (!HEADED) flags.push('--headless=new');
flags.push(`http://127.0.0.1:${PORT}/?clip=${encodeURIComponent(CLIP)}&capture=1`);

log(`Launching ${path.basename(CHROME)} ${HEADED ? '(headed)' : '(headless)'}…`);
const chrome = spawn(CHROME, flags, { stdio: ['ignore', 'pipe', 'pipe'] });

const wsUrl = await new Promise((res, rej) => {
  let buf = '';
  const t = setTimeout(() => rej(new Error('browser did not report a debug port')), 25000);
  chrome.stderr.on('data', d => {
    buf += d.toString();
    const m = buf.match(/ws:\/\/[^\s]+/);
    if (m) { clearTimeout(t); res(m[0]); }
  });
  chrome.on('exit', c => { clearTimeout(t); rej(new Error('browser exited ' + c)); });
});

/* ---------- minimal CDP client over the built-in WebSocket ---------- */
function cdpConnect(url) {
  const ws = new WebSocket(url);
  let id = 0; const pending = new Map(); const handlers = new Map();
  const ready = new Promise(r => ws.addEventListener('open', r));
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { res, rej } = pending.get(m.id); pending.delete(m.id);
      m.error ? rej(new Error(m.error.message)) : res(m.result);
    } else if (m.method && handlers.has(m.method)) {
      handlers.get(m.method).forEach(fn => fn(m.params));
    }
  });
  return {
    ready,
    send(method, params, sessionId) {
      return new Promise((res, rej) => {
        const msg = { id: ++id, method, params: params || {} };
        if (sessionId) msg.sessionId = sessionId;
        pending.set(msg.id, { res, rej });
        ws.send(JSON.stringify(msg));
      });
    },
    on(method, fn) {
      if (!handlers.has(method)) handlers.set(method, []);
      handlers.get(method).push(fn);
    },
    close() { try { ws.close(); } catch {} }
  };
}

const browser = cdpConnect(wsUrl);
await browser.ready;

const { targetInfos } = await browser.send('Target.getTargets');
const page = targetInfos.find(t => t.type === 'page');
const { sessionId } = await browser.send('Target.attachToTarget',
  { targetId: page.targetId, flatten: true });

const send = (m, p) => browser.send(m, p, sessionId);
await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride',
  { width: W, height: H, deviceScaleFactor: 1, mobile: false });

const evalJs = async expr => {
  const r = await send('Runtime.evaluate',
    { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' :: ' + expr);
  return r.result.value;
};

/* ---------- wait for the app, then the pre-warm to finish ---------- */
log('Waiting for the scene to build…');
for (let i = 0; i < 240; i++) {
  const ok = await evalJs(`!!(window.__dm && window.__capStart &&
    document.querySelector('#hookGo') && !document.querySelector('#hookGo').disabled)`)
    .catch(() => false);
  if (ok) break;
  await new Promise(r => setTimeout(r, 500));
}
const webgl = await evalJs(`(()=>{const c=document.querySelector('#gl');
  return !!(c&&(c.getContext('webgl2')||c.getContext('webgl')));})()`);
if (!webgl) {
  console.error('WebGL is not available in this browser session. Retry with --headed.');
  chrome.kill(); process.exit(1);
}
log('  scene ready, WebGL ok');

/* ---------- screencast ---------- */
await fsp.mkdir(FRAMES, { recursive: true });
const frames = [];
send('Page.screencastFrameAck', { sessionId: 0 }).catch(() => {});
browser.on('Page.screencastFrame', async p => {
  frames.push({ t: p.metadata.timestamp, data: p.data });
  try { await send('Page.screencastFrameAck', { sessionId: p.sessionId }); } catch {}
});

log('Recording…');
await send('Page.startScreencast',
  { format: 'jpeg', quality: 92, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
await evalJs('window.__capStart()');

const started = Date.now();
while (Date.now() - started < 8 * 60 * 1000) {
  if (await evalJs('window.__cap.done').catch(() => false)) break;
  await new Promise(r => setTimeout(r, 400));
  process.stdout.write(`\r  ${frames.length} frames`);
}
await new Promise(r => setTimeout(r, 1200));
await send('Page.stopScreencast');
const timeline = await evalJs('JSON.stringify(window.__cap.timeline)').then(JSON.parse);
const beatTexts = await evalJs(
  'JSON.stringify(window.__dm.TOUR.beats.map(b=>b.t.replace(/<[^>]+>/g,"")))').then(JSON.parse);
log(`\r  captured ${frames.length} frames, ${timeline.length} beats`);
await fsp.writeFile(OUTMP4.replace(/\.mp4$/, '.timeline.json'),
  JSON.stringify(timeline.map((b, i) => ({ ...b, text: beatTexts[i] })), null, 1));
chrome.kill();
browser.close();

if (frames.length < 10) { console.error('Too few frames captured.'); process.exit(1); }

/* ---------- resample to a constant frame rate ---------- */
const t0 = frames[0].t, dur = frames[frames.length - 1].t - t0;
const total = Math.max(1, Math.round(dur * FPS));
log(`Resampling ${frames.length} frames -> ${total} @ ${FPS}fps (${dur.toFixed(1)}s)…`);
let cursor = 0;
for (let i = 0; i < total; i++) {
  const want = t0 + i / FPS;
  while (cursor + 1 < frames.length && frames[cursor + 1].t <= want) cursor++;
  await fsp.writeFile(path.join(FRAMES, String(i).padStart(6, '0') + '.jpg'),
    Buffer.from(frames[cursor].data, 'base64'));
}

/* ---------- build the narration track from the same Ava clips ---------- */
log('Building the audio track…');
const parts = [];
for (const b of timeline) {
  const clip = manifest.find(m => m.i === b.beat);
  if (clip) parts.push({ at: b.at, file: path.join(HERE, clip.file.replace(/\//g, path.sep)) });
}
/* The beats never overlap, so this is a plain concatenation of silence and clips —
   no adelay/amix, which this ffmpeg (a 2013 build) does not have. */
const audioOut = path.join(FRAMES, 'voice.wav');
async function probeDur(f) {
  const { stdout } = await pexec('ffprobe',
    ['-v','error','-show_entries','format=duration','-of','csv=p=0', f]);
  return parseFloat(stdout.trim()) || 0;
}
async function silence(sec, tag) {
  const f = path.join(FRAMES, `sil-${tag}.wav`);
  await pexec('ffmpeg', ['-y','-f','lavfi','-i','anullsrc=r=48000:cl=stereo',
    '-t', sec.toFixed(3), '-ar','48000','-ac','2', f]);
  return f;
}
if (parts.length) {
  const segs = [];
  let cursorT = 0;
  for (let i = 0; i < parts.length; i++) {
    const gap = parts[i].at - cursorT;
    if (gap > 0.02) segs.push(await silence(gap, 'g' + i));
    const wav = path.join(FRAMES, `clip-${i}.wav`);
    await pexec('ffmpeg', ['-y','-i', parts[i].file, '-ar','48000','-ac','2', wav]);
    segs.push(wav);
    cursorT = Math.max(cursorT, parts[i].at) + await probeDur(wav);
  }
  const tail = dur - cursorT;
  if (tail > 0.02) segs.push(await silence(tail, 'tail'));

  const listFile = path.join(FRAMES, 'list.txt');
  await fsp.writeFile(listFile,
    segs.map(s => `file '${s.replace(/\\/g, '/')}'`).join('\n'));
  await pexec('ffmpeg', ['-y','-f','concat','-safe','0','-i', listFile,
    '-c','copy', audioOut], { maxBuffer: 1 << 26 });
  log(`  narration track ${(await probeDur(audioOut)).toFixed(1)}s`);
}

/* ---------- mux ---------- */
log('Encoding…');
const hasAudio = fs.existsSync(audioOut);
// this ffmpeg is a 2013 build: its native aac is flagged experimental, so try the
// better libvo_aacenc first and fall back with -strict -2.
const audioCodecs = [['libvo_aacenc', []], ['aac', ['-strict', '-2']]];
let encoded = false, lastErr = null;
for (const [codec, extra] of (hasAudio ? audioCodecs : [[null, []]])) {
  const vArgs = ['-y', '-framerate', String(FPS), '-i', path.join(FRAMES, '%06d.jpg')];
  if (hasAudio) vArgs.push('-i', audioOut);
  vArgs.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '21', '-preset', 'medium',
             '-maxrate', '9M', '-bufsize', '18M', '-movflags', '+faststart');
  if (hasAudio) vArgs.push('-c:a', codec, ...extra, '-b:a', '192k', '-shortest');
  vArgs.push(OUTMP4);
  try { await pexec('ffmpeg', vArgs, { maxBuffer: 1 << 26 }); encoded = true; break; }
  catch (e) { lastErr = e; }
}
if (!encoded) { console.error('Encode failed:\n' + (lastErr && lastErr.stderr || lastErr)); process.exit(1); }

await fsp.rm(FRAMES, { recursive: true, force: true });
await fsp.rm(userDir, { recursive: true, force: true }).catch(() => {});

const { stdout } = await pexec('ffprobe', ['-v', 'error',
  '-show_entries', 'format=duration,size', '-of', 'default=nw=1', OUTMP4]);
log(`\nWrote ${OUTMP4}`);
log(stdout.trim());
