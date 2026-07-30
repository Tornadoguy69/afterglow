# Afterglow — physics you can poke at

Interactive astronomy where the equations actually run in the browser. Ten topics, from
stellar evolution to the multiverse, each one a working simulation rather than a
pre-rendered animation dressed up as a model.

```bash
node serve.mjs      # → http://localhost:8899
```

A server is required. ES modules and `fetch` do not work from `file://`.

---

## The one rule

**Every page states how confident the field actually is.**

| Badge | Means |
|---|---|
| `established` | Reproduced, quantitative, not seriously contested |
| `active` | Real data exists, no consensus on what it means |
| `speculative` | Internally consistent and currently impossible to test |

This is not decoration. A site that renders the multiverse with the same authority as
stellar fusion has taught the reader something false about how science works, however
good the shader is. The badge is the point of the project.

---

## What's in it

**Settled physics** — Dark Matter · The Life of a Star · Black Holes · Nebulae ·
Planet Formation · The Expanding Universe · The Big Bang

**Open questions** — The Little Red Dots · Are We Alone?

**Not currently testable** — The Multiverse

A few things they compute, so you know the level:

- Black holes integrate a **null geodesic per pixel** in the Schwarzschild metric.
  The `(3/2)r_s u²` term is the whole departure from Newton, and deleting it removes
  the photon ring.
- Stellar lifetimes are interpolated from **Ekström et al. 2012** evolutionary models,
  not the textbook `t = 10 Gyr · M/L` shortcut, which is wrong by 4× for massive stars.
- Structure formation is a **Zel'dovich displacement of a BBKS power spectrum** evolved
  with the exact ΛCDM growth factor.
- The dark matter halo profile, fitted to flatten a rotation curve and extrapolated
  inward, predicts **0.35 GeV/cm³** at the Sun's radius — the same density LZ, XENONnT
  and PandaX-4T assume when converting a null result into a cross-section limit.

52 sources cited across the modules, and 24 explicitly stated limitations.

---

## Adding a topic

One topic is one folder. Open **`/site/contribute.html`** — it walks through the module
anatomy interactively, hands you a working starter template, and gives you the checklist
every existing module was held to.

```
site/modules/your-topic/
  index.html      the module (imports the engine)
  meta.json       title, tier, a source per claim, and what it does NOT model
```

The engine supplies the renderer, bloom, camera, smooth zoom, resizing, the draggable
inspector, panel widgets, the 2D plotter, theming and tooltips. You supply physics, a
scene, a plot and captions.

### What gets a module rejected

- **A number with no source in `meta.json`.**
- **A relation used outside its validity range.** Real example from this repo: the
  white-dwarf initial–final mass relation is calibrated above 0.83 M☉; applied blindly to
  a 0.2 M☉ star it returned a remnant heavier than the star it came from.
- **A convenient approximation presented as exact.**
- **Physics tuned to look good.** Tune the rendering freely — exposure, bloom, point
  size, colour scales. Never tune the equations.

---

## Layout

```
serve.mjs                  static server; / redirects to /site/
site/
  index.html               gallery
  contribute.html          interactive contribution guide
  engine/                  engine.js · style.css · theme.js
  modules/                 one folder per topic
dark-matter-visualizations.html   the original standalone piece, narrated
research/                  source notes for the JWST and biosignature modules
render-narration.mjs       re-render narration with local Kokoro TTS
capture-clip.mjs           offline video render via headless Chrome + ffmpeg
```

## Extras

`dark-matter-visualizations.html` is a standalone narrated piece with a 27-beat guided
tour, spoken by a local TTS voice, plus an offline video renderer:

```bash
node render-narration.mjs          # re-render narration audio
node capture-clip.mjs reel         # → dark-matter-reel.mp4, 1080p with voice
```

The written argument behind it is in [`THE_CASE_FOR_DARK_MATTER.md`](THE_CASE_FOR_DARK_MATTER.md)
— five independent lines of evidence, every claim traceable to a paper.

## Keyboard

`D` theme · `P` panel · `I` inspector · `R` reset camera

## Honest limits

Every module carries an `open` array in its `meta.json` naming what it does not do.
The black hole is Schwarzschild only — no spin, so no off-centre photon ring, and no
Doppler beaming on the disk. Planet formation does not model migration. The Big Bang
timeline is interpolated between published epoch markers rather than integrated from the
Friedmann equations.

None of that is hidden, because the whole point of the badges would collapse if it were.

---

Built with [three.js](https://threejs.org). Type is Newsreader, Inter and IBM Plex Mono.
