# Afterglow — physics you can poke at

Interactive astronomy where the equations actually run. Every module computes real physics
in the browser; nothing is a pre-rendered animation dressed up as a model.

```bash
node serve.mjs        # from the repo root, then open http://localhost:8899
```

Needs a server, not `file://` — ES modules and `fetch` require a real origin.

---

## The one rule

**Every module declares how confident the field actually is.**

| Tier | Means |
|---|---|
| `established` | Reproduced, quantitative, not seriously contested |
| `active` | Real data exists, no consensus on what it means |
| `speculative` | Internally consistent and currently impossible to test |

This is not decoration. A site that renders the multiverse with the same authority as
stellar fusion has taught the reader something false about how science works, no matter how
good the shader is. The badge is the point.

---

## Adding a module

One topic is one folder. The engine handles the renderer, bloom, camera, smooth zoom,
resizing, the draggable inspector, panel widgets, the 2D plotter and tooltips — a module
supplies only physics, a scene, a plot and captions.

```
modules/your-topic/
  index.html      the module (imports the engine)
  meta.json       title, tier, and a source for every quantitative claim
```

Minimum viable module:

```js
import { THREE, boot, ui, Plot, PAL } from '../../engine/engine.js';

// 1. physics as plain functions — no rendering, so they stay checkable
const orbitalVelocity = (M, r) => Math.sqrt(G * M / r);

// 2. boot the shell
const app = boot({ cameraPos:new THREE.Vector3(0,40,120), dist:[10,900] });

// 3. build a scene on app.scene, a panel with ui.*, a plot with Plot()
app.setPanel(panel);
app.setCaption('What the reader should take away.');
app.onFrame(dt => { /* animate */ });
```

Copy `modules/stellar-life/index.html` — it exercises every part of the engine.

### What gets a module rejected

- **A quantitative claim with no source in `meta.json`.** If a number appears on screen,
  its origin appears in the metadata.
- **A relation used outside its validity range.** Real example from this repo: the
  white-dwarf initial–final mass relation is calibrated above 0.83 M☉; applied blindly to a
  0.2 M☉ star it returned a remnant heavier than the star it came from.
- **A convenient approximation presented as exact.** The textbook `t = 10 Gyr · M/L`
  stellar lifetime is wrong by a factor of four for massive stars. Either use real models
  or say plainly that it is a first-order estimate.
- **Tuning physics to look good.** Tune the *rendering* freely — exposure, bloom, point
  size, colour scales. Never tune the equations.

### Known-good pattern

The dark matter module found three bugs that only appeared when the visuals were checked
against what the narration claimed at that exact moment — including a cosmic web rendered
at z = 99, roughly 13 billion years before it could exist. Frames tell you what was drawn,
not whether it was true. Check the state, not just the picture.

---

## Layout

```
serve.mjs                    static server; / redirects to /site/
site/
  index.html                 gallery
  engine/
    engine.js                renderer, bloom, zoom, panel widgets, plotter, chrome
    style.css                shared design system
  modules/
    stellar-life/            first reference module
research/
  JWST_AND_LIFE.md           notes for the JWST and biosignature modules
```

Built with [three.js](https://threejs.org). Type is Newsreader, Inter and IBM Plex Mono.
