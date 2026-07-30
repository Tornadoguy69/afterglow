# The Case for Dark Matter

### A quantitative argument from five independent lines of evidence

*Companion interactive visualizations: [`dark-matter-visualizations.html`](dark-matter-visualizations.html)*

---

**Conventions.** Unless noted, $h \equiv H_0 / (100\ \mathrm{km\,s^{-1}\,Mpc^{-1}})$, $\Omega_i \equiv \rho_i/\rho_{\rm crit}$ with $\rho_{\rm crit} = 3H_0^2/8\pi G = 2.775\times10^{11}\,h^2\ M_\odot\,\mathrm{Mpc^{-3}}$. Galactic work uses $G = 4.30091\times10^{-6}\ \mathrm{kpc}\,M_\odot^{-1}\,(\mathrm{km\,s^{-1}})^2$. Mass-to-light ratios $\Upsilon \equiv M/L$ are in solar units, band specified.

---

## 1. The Problem Statement

The anomaly is not subtle and it is not a modeling artifact. **Every gravitational probe of a system larger than a globular cluster returns more mass than the light can account for, and the discrepancy grows with the scale of the system.**

### 1.1 The baryonic budget from stellar populations

Stellar population synthesis fixes what a given amount of starlight *must* weigh. In the near-infrared, where the mass-to-light ratio is least sensitive to star formation history, dust, and metallicity, the calibration is tight: at Spitzer 3.6 μm, $\Upsilon_\star^{[3.6]} = 0.5\ M_\odot/L_\odot$ for disks and $0.7$ for bulges, with a scatter of order 0.1 dex (McGaugh & Schombert 2014, AJ 148, 77). In the optical $V$-band, ordinary stellar populations give $\Upsilon_V \approx 1$–$5$.

These are not adjustable to taste. Raising $\Upsilon_\star$ by the factors required below would demand initial mass functions so bottom-heavy that the resulting M-dwarfs would themselves be detectable, and would violate the observed colors.

### 1.2 The dynamical mass from gravity

| System | Method | Observed $\Upsilon$ | Stellar-population $\Upsilon$ | Discrepancy |
|---|---|---|---|---|
| Solar neighborhood | Vertical Jeans / Oort limit | $\sim 3$–$5$ ($V$) | $\sim 3$ | $\lesssim 1.5$ |
| Spiral, inside optical radius | Rotation curve | $\sim 5$–$10$ ($V$) | $\sim 2$–$5$ | $\sim 2$ |
| Spiral, to last HI radius | Rotation curve | $\sim 20$–$100$ ($V$) | $\sim 2$–$5$ | $\sim 10$–$30$ |
| Galaxy clusters | Virial / X-ray / lensing | $\sim 200$–$400\,h$ ($B$) | $\sim 3$–$8$ | $\sim 50$–$100$ |
| Cosmic mean | CMB + BBN | — | — | **$\Omega_m/\Omega_b = 6.39$** |

Zwicky's original 1933 application of the virial theorem to Coma (*Helvetica Physica Acta* 6, 110) is the founding measurement. For a self-gravitating system in steady state, $2\langle T\rangle + \langle U\rangle = 0$, so

$$M \simeq \frac{\alpha\,\sigma^2 R}{G}, \qquad \alpha \sim 2\text{–}3$$

For Coma, $\sigma_v \approx 1000\ \mathrm{km\,s^{-1}}$ and $R \approx 1.5$ Mpc give $M \sim 10^{15}\,M_\odot$, against a luminosity implying $\lesssim 10^{13}\,M_\odot$ in stars. Zwicky's factor of ~400 was inflated by the then-current distance scale; with modern $h$ it becomes ~50–100. **The conclusion survived the recalibration.**

### 1.3 The modern statement

The gap is now expressed in parameters rather than ratios. Planck 2018 (Planck Collaboration VI, *A&A* 641, A6, 2020) gives, from TT,TE,EE+lowE+lensing:

$$\Omega_b h^2 = 0.02237 \pm 0.00015, \qquad \Omega_c h^2 = 0.1200 \pm 0.0012, \qquad \Omega_m h^2 = 0.1430 \pm 0.0011$$

$$\boxed{\ \frac{\Omega_c}{\Omega_m} = \frac{0.1200}{0.1430} = 0.839 \qquad \frac{\Omega_c}{\Omega_b} = \frac{0.1200}{0.02237} = 5.36\ }$$

**84% of the matter in the universe is not baryonic.** And $\Omega_c h^2$ differs from zero by $0.1200/0.0012 = 100\sigma$ within the six-parameter model.

A crucial consistency check sits inside this: the cosmic baryon fraction $f_b = \Omega_b/\Omega_m = 0.156$ is reproduced by rich clusters, whose hot gas plus stars give $f_{\rm gas} + f_\star \approx 0.13$–$0.15$ (Vikhlinin et al. 2006, ApJ 640, 691; Allen et al. 2008, MNRAS 383, 879). Clusters are fair samples of the universe, and they are 85% dark.

---

## 2. Galactic Rotation Curves

### 2.1 The Newtonian prediction

For a test particle on a circular orbit of radius $r$ in a spherically symmetric potential, Newton's shell theorem lets only the enclosed mass $M(r)$ act. Balancing centripetal acceleration against gravity:

$$\frac{G M(r) m}{r^2} = \frac{m v^2}{r} \quad\Longrightarrow\quad \boxed{\,v(r) = \sqrt{\frac{G M(r)}{r}}\,}$$

Kepler's third law is the same statement. For $T^2 = 4\pi^2 a^3/GM$ and $v = 2\pi a/T$:

$$v^2 = \frac{4\pi^2 a^2}{T^2} = \frac{4\pi^2 a^2 \cdot GM}{4\pi^2 a^3} = \frac{GM}{a}$$

Now the key step. Outside the luminous body — beyond the last star — $M(r)$ should saturate at the total mass $M_{\rm tot}$. Then

$$v(r) = \sqrt{\frac{G M_{\rm tot}}{r}} \ \propto\ r^{-1/2}$$

This is not a soft expectation. It is verified to exquisite precision in the Solar System, where $M(r)$ genuinely saturates: Neptune at 30 AU moves at 5.43 km/s, Mercury at 0.39 AU at 47.4 km/s, and $47.4/5.43 = 8.73$ against $\sqrt{30/0.39} = 8.77$.

### 2.2 What is actually observed

Galaxies do not do this. Beyond a few disk scale lengths, rotation curves flatten:

$$v(r) \approx v_{\rm flat} = \text{const}$$

and stay flat as far as tracers can be followed — for HI, typically 2–3× the optical radius, in some cases to 50 kpc and beyond.

Insert $v = v_{\rm flat}$ into the Newtonian relation:

$$v_{\rm flat}^2 = \frac{G M(r)}{r} \quad\Longrightarrow\quad \boxed{\,M(r) = \frac{v_{\rm flat}^2}{G}\,r \ \propto\ r\,}$$

Differentiating for the density in the spherical approximation, $M(r) = \int_0^r 4\pi r'^2 \rho\, dr'$:

$$\rho(r) = \frac{1}{4\pi r^2}\frac{dM}{dr} = \frac{v_{\rm flat}^2}{4\pi G r^2} \ \propto\ r^{-2}$$

**The mass keeps increasing linearly with radius in a region where the light has already converged.** An $r^{-2}$ density run is the singular isothermal sphere — the classic halo profile — and it contains, per logarithmic radial interval, equal mass. There is no plausible way to hide this in stars.

### 2.3 The Milky Way, worked numerically

Take $v_{\rm flat} = 220\ \mathrm{km\,s^{-1}}$ at $r = 20$ kpc:

$$M(<20\ \mathrm{kpc}) = \frac{v_{\rm flat}^2 r}{G} = \frac{(220)^2 \times 20}{4.30091\times10^{-6}} \approx 2.25\times10^{11}\,M_\odot$$

The Milky Way's total stellar mass is $\approx 5\times10^{10}\,M_\odot$ and its HI+H₂ perhaps $1\times10^{10}\,M_\odot$. Even placing *every* baryon inside 20 kpc leaves a factor of ~3.7 unaccounted. Extend to the virial radius $r_{200}\approx 210$ kpc and the required $M_{200} \sim 1\times10^{12}\,M_\odot$ makes the deficit a factor of ~15.

### 2.4 The empirical backbone

**A note on attribution.** Vera Rubin and Kent Ford's landmark work used *optical* spectroscopy — the Hα and [NII] emission lines — with their image-tube spectrograph, not the 21 cm line. Rubin & Ford 1970 (*ApJ* 159, 379) mapped M31 to ~24 kpc; Rubin, Ford & Thonnard 1978 (*ApJ* 225, L107) and 1980 (*ApJ* 238, 471) extended this to 21 Sc galaxies and established flatness as generic. The **21 cm HI** extension — which is what pushed the curves far beyond the optical disk, where the Keplerian falloff should have been unmistakable — came from Roberts & Whitehurst 1975 (*ApJ* 201, 327) on M31, Bosma 1978 (Groningen PhD thesis; 1981, *AJ* 86, 1825), and van Albada et al. 1985 (*ApJ* 295, 305) on NGC 3198. The two techniques are independent and agree.

The modern statistical backbone is **SPARC** — *Spitzer Photometry and Accurate Rotation Curves* (Lelli, McGaugh & Schombert 2016, *AJ* 152, 157). It comprises **175 late-type galaxies** with Spitzer 3.6 μm surface photometry (near-optimal for stellar mass) matched to high-quality HI/Hα rotation curves. It spans a factor of ~10⁵ in luminosity, from dwarf irregulars to bright spirals, and every morphological class. The mass discrepancy is present across the entire sample, and it is *largest in the smallest, lowest-surface-brightness galaxies* — precisely where the baryons are most dilute.

Two scaling relations from these data are worth stating because any theory must reproduce them:

- **Baryonic Tully–Fisher relation**: $M_b = A\, v_{\rm flat}^{\,s}$ with $s = 3.94 \pm 0.08$ and scatter consistent with observational error alone (McGaugh 2012, *ApJ* 751, 8; Lelli et al. 2016, *ApJ* 816, L14).
- **Radial acceleration relation**: the observed centripetal acceleration $g_{\rm obs}$ is a tight one-to-one function of the Newtonian acceleration from the baryons alone, $g_{\rm bar}$, with $\sim0.11$ dex scatter (McGaugh, Lelli & Schombert 2016, *PRL* 117, 201101).

The second relation is genuinely surprising under ΛCDM and is discussed honestly in §9.

For the Milky Way specifically, Gaia + APOGEE now give a directly measured curve: $v_c(R_0) = 229 \pm 0.2\ \mathrm{km\,s^{-1}}$ with a gentle decline of $-1.7 \pm 0.1\ \mathrm{km\,s^{-1}\,kpc^{-1}}$ out to 25 kpc (Eilers et al. 2019, *ApJ* 871, 120). A gentle decline is *still* wildly non-Keplerian — Kepler would predict $-4.6\ \mathrm{km\,s^{-1}\,kpc^{-1}}$ at 8 kpc and the curve would have dropped to ~130 km/s by 25 kpc.

> **See Visualization 1** — decompose $v(r)$ into bulge (Hernquist), stellar disk (exact Freeman/Bessel solution), gas, and NFW halo, and watch the outer disk fall Keplerian the moment the halo is switched off.

---

## 3. Gravitational Lensing

Rotation curves measure the potential where there is gas to trace it. Lensing measures the potential *everywhere*, with no assumption of dynamical equilibrium, no tracer particles, and no reliance on Newtonian dynamics — it is pure general relativity applied to null geodesics.

### 3.1 The deflection angle

A photon with impact parameter $b$ passing a point mass $M$ is deflected by

$$\boxed{\ \hat\alpha = \frac{4GM}{b\,c^2}\ }$$

in the weak-field limit $\hat\alpha \ll 1$. The factor of 4 (rather than the Newtonian 2) comes from the space-curvature term in the Schwarzschild metric contributing equally with the time-dilation term — this is Einstein's 1915 correction to his own 1911 result, and the 1919 Eddington eclipse measurement of the solar limb value confirmed it:

$$\hat\alpha_\odot = \frac{4 \times 6.674\times10^{-11} \times 1.989\times10^{30}}{6.96\times10^{8} \times (2.998\times10^8)^2} = 8.49\times10^{-6}\ \mathrm{rad} = 1.75''$$

### 3.2 The lens equation and convergence

For a source at angular diameter distance $D_s$, lens at $D_d$, and lens–source separation $D_{ds}$, the apparent position $\theta$ and true position $\beta$ satisfy

$$\beta = \theta - \frac{D_{ds}}{D_s}\hat\alpha(\theta)$$

For an extended lens, define the surface mass density $\Sigma(\vec\theta)$ and the **critical surface density**

$$\Sigma_{\rm cr} = \frac{c^2}{4\pi G}\frac{D_s}{D_d D_{ds}}, \qquad \kappa(\vec\theta) \equiv \frac{\Sigma(\vec\theta)}{\Sigma_{\rm cr}}$$

The dimensionless convergence $\kappa$ **is** the projected mass map, in units set by pure geometry. Background galaxies are sheared; measuring the ellipticity correlation of tens of thousands of them yields the shear field $\gamma$, and $\kappa$ is recovered by the Kaiser & Squires (1993, *ApJ* 404, 441) inversion:

$$\kappa(\vec\theta) = \frac{1}{\pi}\int d^2\theta'\ \mathcal{D}(\vec\theta - \vec\theta')\,\gamma(\vec\theta'), \qquad \mathcal{D}(\vec\theta) = \frac{\theta_2^2 - \theta_1^2 - 2i\theta_1\theta_2}{|\vec\theta|^4}$$

No dynamical assumptions enter. The output is a map of *where the mass is*.

### 3.3 The Bullet Cluster: 1E 0657-558

This is the decisive observation, because it *spatially separates* the two candidate explanations.

1E 0657-558 at $z = 0.296$ is a merger of two clusters caught shortly after first core passage. The smaller subcluster — the "bullet" — has driven a bow shock through the primary's intracluster medium at a Mach number $\mathcal{M} \approx 3.0$, corresponding to a shock speed of $\approx 4700\ \mathrm{km\,s^{-1}}$ (Markevitch et al. 2002, *ApJ* 567, L27; Markevitch 2006, astro-ph/0511345).

The system has three components with three different collisional behaviors:

| Component | Baryonic? | Collisional? | Behavior in the merger |
|---|---|---|---|
| **X-ray plasma** (~90% of baryons, ~10–12% of total mass) | Yes | **Yes** — ram pressure, shocks | *Stripped and decelerated*; lags behind |
| **Galaxies** (~10% of baryons, ~1–2% of total) | Yes | No — collision cross-section negligible | Passes straight through |
| **Total mass** (lensing $\kappa$) | ? | ? | **← the measurement** |

If the missing mass were merely unseen baryons — cold molecular gas, faint stars, MACHOs — or if it were a modification of gravity sourced by the baryons, the lensing map would peak on the X-ray plasma, because *the plasma is where the baryons are*. The plasma outweighs the stars in clusters by roughly a factor of 5–10.

It does not.

**Clowe et al. 2006** (*ApJ* 648, L109, "A Direct Empirical Proof of the Existence of Dark Matter") combined strong and weak lensing across the field and found the $\kappa$ peaks coincident with the **galaxy** concentrations, offset from the X-ray surface brightness peaks. The offset is significant at **8σ**. Independent reconstruction by Bradač et al. 2006 (*ApJ* 652, 937) using a joint strong+weak method reached the same conclusion.

The logic is airtight and worth stating precisely:

> Whatever generates the lensing potential is (i) **not** spatially coincident with the dominant baryonic component, and (ii) **is** spatially coincident with the collisionless component. Therefore the lensing mass is neither baryonic nor a functional of the baryon distribution — and it is itself effectively collisionless.

This is why the Bullet Cluster is fatal to modified-gravity theories in which the field equations are sourced by the visible matter: in such theories $\kappa \propto$ (some functional of) $\Sigma_{\rm baryon}$, and $\Sigma_{\rm baryon}$ demonstrably peaks in the wrong place.

**It is not a one-off.** MACS J0025.4−1222 (Bradač et al. 2008, *ApJ* 687, 959), Abell 520, Abell 2744, and DLSCL J0916.2+2951 ("the Musket Ball") show the same signature with varying merger geometries and ages.

**A quantitative bonus.** The lack of offset between the DM and galaxy centroids, and the survival of the subcluster halo, bound the dark matter self-interaction cross-section:

$$\sigma/m < 1.25\ \mathrm{cm^2\,g^{-1}} \quad (68\%\ \mathrm{CL})$$

(Randall et al. 2008, *ApJ* 679, 1173). This is a *measurement of a particle property* extracted from an astronomical image, and it rules out large swaths of self-interacting dark matter parameter space.

> **See Visualization 2** — run the collision forward and watch the ram-pressure-braked gas separate from the ballistic collisionless mass; then set the DM drag coefficient nonzero and see the lensing peak wrongly snap onto the gas.

---

## 4. The Cosmic Microwave Background

The CMB constrains $\Omega_b$ and $\Omega_m$ **separately and by different physical mechanisms**, using linear perturbation theory in a regime where every relevant process (Thomson scattering, hydrogen recombination, gravitational infall) is textbook physics with no free astrophysics.

### 4.1 The photon–baryon fluid

Before recombination, free electrons Thomson-scatter photons on a timescale far shorter than the expansion time, and Coulomb-couple to protons. Photons, electrons and baryons behave as a **single fluid** with an enormous radiation pressure and a small baryon inertia. Define the baryon-to-photon momentum density ratio

$$R \equiv \frac{3\rho_b}{4\rho_\gamma} \approx 0.60\left(\frac{\Omega_b h^2}{0.0224}\right)\left(\frac{1090}{1+z}\right)$$

The sound speed in this fluid is

$$c_s = \frac{c}{\sqrt{3(1+R)}}$$

approaching $c/\sqrt3$ when radiation dominates the fluid inertia and dropping as baryons are loaded in. Gravitational potential wells from primordial perturbations drive the fluid into acoustic oscillation; at recombination ($z_* \approx 1090$) the electrons combine into neutral hydrogen, the photon mean free path explodes, and the oscillation pattern is frozen into the temperature field.

The **sound horizon** — the comoving distance a sound wave has traveled by then —

$$r_s = \int_0^{t_*}\frac{c_s\,dt}{a} = \int_{z_*}^{\infty}\frac{c_s\,dz}{H(z)} = 144.43 \pm 0.26\ \mathrm{Mpc}\quad(\text{Planck 2018}; \ r_{\rm drag} = 147.09\ \mathrm{Mpc})$$

sets a standard ruler. It subtends $\theta_* = 1.04109\times10^{-2}$ rad, producing the first acoustic peak at

$$\ell_1 \approx \frac{\pi}{\theta_*} \approx 220$$

with subsequent peaks at roughly $\ell_n \approx n\,\ell_A$, $\ell_A = \pi D_A/r_s \approx 302$.

### 4.2 Why the peak *heights* separate baryons from total matter

This is the crux. Two distinct effects operate on the height pattern.

**(a) Baryon loading → odd/even peak asymmetry → $\Omega_b h^2$.**

Baryons add inertia without adding pressure. In the oscillator analogy, they act like extra mass on a spring in a gravitational field: the equilibrium point is displaced *downward into the potential well*. Writing the temperature perturbation with the shift explicit,

$$[\Theta_0 + \Psi](\eta) = [\Theta_0 + (1+R)\Psi](0)\cos(k r_s) - R\Psi$$

the oscillation is offset by $-R\Psi$. Compressions (into the well) are amplified; rarefactions (out of the well) are suppressed. **Odd peaks ($\ell_1, \ell_3, \dots$) are compressions; even peaks ($\ell_2, \dots$) are rarefactions.** Therefore

$$\frac{\text{height of peak 1}}{\text{height of peak 2}} \ \text{is a direct thermometer of}\ R \propto \Omega_b h^2$$

The observed first peak is markedly higher than the second. This measures the baryons and *nothing else*.

**(b) Radiation driving and $z_{\rm eq}$ → third peak and damping envelope → $\Omega_m h^2$.**

During radiation domination, the gravitational potentials $\Psi, \Phi$ *decay* once a mode enters the horizon, because the dominant component (radiation) is pressure-supported and cannot cluster. This decay resonantly drives the acoustic oscillation, boosting the amplitude of modes that entered the horizon before matter–radiation equality. The redshift of equality,

$$1 + z_{\rm eq} = \frac{\Omega_m}{\Omega_r} = 3402 \pm 26 \quad (\text{Planck 2018})$$

is set by $\Omega_m h^2$ — **total** matter, including anything that clusters gravitationally without pressure support. Increasing $\Omega_m h^2$ pushes equality earlier, so fewer modes get driven, and the third and higher peaks *drop* relative to the first. The observed third peak is nearly as high as the second — this requires a large non-radiative matter density at $z \sim 3000$.

**(c) Silk damping → the cutoff scale.** Photon diffusion during the finite duration of recombination erases power below $k_D^{-1}$, with $k_D^{-2} \sim \int d\eta\ \frac{1}{6(1+R)n_e\sigma_T a}\left[\frac{R^2}{1+R}+\frac{8}{9}\right]$. The damping tail's position independently depends on $\Omega_b h^2$ through $n_e$.

### 4.3 The result

Planck Collaboration VI 2018 (*A&A* 641, A6), base ΛCDM, TT,TE,EE+lowE+lensing:

$$\Omega_b h^2 = 0.02237 \pm 0.00015 \qquad \Omega_c h^2 = 0.1200 \pm 0.0012$$
$$H_0 = 67.36 \pm 0.54\ \mathrm{km\,s^{-1}Mpc^{-1}} \qquad n_s = 0.9649 \pm 0.0042 \qquad \sigma_8 = 0.8111 \pm 0.0060$$

**The two effects are physically distinct, act on different multipoles, and are separately well-measured. They disagree by a factor of 5.4.** A universe with $\Omega_m h^2 = 0.143$ *all in baryons* would produce an enormously enhanced odd/even asymmetry, a crushed third peak, and a badly displaced damping tail. It is excluded overwhelmingly.

**Independent confirmation from ground-based CMB.** ACT DR6 (Louis et al. 2025, arXiv:2503.14452), combining ACT+Planck lensing+DESI Y1 BAO, gives $\Omega_c h^2 = 0.118 \pm 0.001$ — a different telescope, different frequency coverage, different systematics, same answer. DESI DR2 BAO (arXiv:2503.14738; *PRD* 112, 083515, 2025) gives $\Omega_m = 0.295 \pm 0.015$ from BAO alone and $0.307 \pm 0.005$ combined with CMB — using the *same* sound horizon $r_s$ imprinted in the galaxy distribution 13 billion years later.

---

## 5. Large-Scale Structure Formation

This is the argument that is least often stated quantitatively and is arguably the most damning, because it is a *timing* problem and timing arguments are hard to evade.

### 5.1 Baryons cannot start growing until $z \approx 1100$

Before recombination the photon–baryon fluid has an enormous Jeans mass. With $c_s \approx c/\sqrt3$,

$$M_J = \frac{4\pi}{3}\rho\left(\frac{\lambda_J}{2}\right)^3, \qquad \lambda_J = c_s\sqrt{\frac{\pi}{G\rho}} \quad\Longrightarrow\quad M_J \sim 10^{16}\,M_\odot \ \text{at } z\gtrsim 1100$$

Every scale of cosmological interest lies *below* this. Baryonic perturbations therefore do not grow — they **oscillate as sound waves**. This is not a modeling choice; the acoustic peaks in the CMB are the direct observational signature of exactly this oscillation.

### 5.2 The growth budget

After recombination, in matter domination, the linear growing mode is

$$\delta(a) \propto a \qquad (\text{exact for Einstein–de Sitter; ΛCDM suppresses growth further at } z \lesssim 1)$$

The CMB tells us the amplitude at the start. Temperature anisotropies are $\Delta T/T \sim 10^{-5}$, and on large scales the Sachs–Wolfe relation $\Delta T/T = \Psi/3$ with the Poisson equation gives baryon density contrast at recombination of order

$$\delta_b(z_{\rm rec}) \sim \text{few}\times10^{-5}$$

Growing from $z = 1100$ to $z = 0$ multiplies this by $(1+z_{\rm rec}) \approx 1100$ at most:

$$\delta_b(z=0) \sim 3\times10^{-5} \times 1100 \approx 0.03$$

Collapse requires, in the spherical top-hat model, a *linearly extrapolated* contrast of

$$\delta_c = \frac{3}{5}\left(\frac{3\pi}{2}\right)^{2/3} = 1.686$$

$$\boxed{\ 0.03 \ \ll\ 1.686 \quad \text{— short by a factor of} \sim 50\ }$$

**A baryon-only universe is smooth today.** No galaxies, no clusters, no filaments. This is a hard, quantitative contradiction with the existence of the observer.

### 5.3 How CDM resolves it

Cold dark matter does not couple to photons. Its perturbations are therefore free of radiation pressure and begin growing as soon as they enter the horizon — growing only logarithmically during radiation domination (the Mészáros effect, since the expansion is driven by an unclustered component) but then $\propto a$ from $z_{\rm eq} = 3402$, a full factor of 3 in scale factor *before* recombination, and without ever being reset by an acoustic oscillation.

By recombination, $\delta_c \sim 10^{-3}$ — about two orders of magnitude ahead of the baryons. When the baryons are released at recombination, they fall into the pre-existing CDM potential wells and their contrast rapidly catches up:

$$\delta_b(a) \to \delta_c(a)\left[1 - \frac{a_{\rm rec}}{a}\right]$$

so within a few expansion times $\delta_b \approx \delta_c$. Growing $10^{-3}$ by $1100$ gives $\delta \sim 1$ today — nonlinear collapse, exactly on schedule.

**CDM is not an extra ingredient added to explain rotation curves. It is the only known way to give structure a head start.**

### 5.4 The simulations, and what they matched

The **Millennium Simulation** (Springel et al. 2005, *Nature* 435, 629) evolved $2160^3 = 1.0078\times10^{10}$ particles of mass $8.6\times10^8\,h^{-1}M_\odot$ in a $500\,h^{-1}$ Mpc periodic box from $z = 127$ to $z = 0$ under pure gravity in a ΛCDM background. It reproduced, without tuning the gravitational physics:

- The filament–wall–void topology of the cosmic web, matching 2dFGRS and SDSS
- The galaxy two-point correlation function $\xi(r) \approx (r/r_0)^{-1.8}$, $r_0 \approx 5\,h^{-1}$ Mpc
- The halo mass function, matching the Press–Schechter/Sheth–Tormen form
- The abundance of bright quasars at $z \approx 6$ in $\sim10^{13}M_\odot$ halos

Successors — Illustris/IllustrisTNG (Pillepich et al. 2018, *MNRAS* 473, 4077), EAGLE (Schaye et al. 2015, *MNRAS* 446, 521), AbacusSummit, Uchuu — add hydrodynamics and feedback and continue to match.

**The independent standard-ruler test.** The same sound horizon $r_s$ that sets the CMB peak spacing must appear as a bump in the low-redshift galaxy correlation function. It does: baryon acoustic oscillations were detected at $\sim 150$ Mpc in SDSS LRGs (Eisenstein et al. 2005, *ApJ* 633, 560) and are now measured to sub-percent precision across $0.1 < z < 4$ by eBOSS (Alam et al. 2021, *PRD* 103, 083533) and DESI DR2. The *amplitude* of that bump relative to the smooth clustering is directly proportional to $\Omega_b/\Omega_m$ — and it is small, requiring most of the matter to be non-baryonic.

**"Cold" is measured, not assumed.** If dark matter were warm, free-streaming would erase small-scale power. The Lyman-α forest at $z \sim 5$ probes exactly those scales and gives $m_{\rm WDM} > 5.3$ keV (thermal relic, 95% CL; Iršič et al. 2017, *PRD* 96, 023522) — i.e. the dark matter must be dynamically cold.

> **See Visualization 3** — a Zel'dovich-approximation realization of a BBKS ΛCDM power spectrum evolved with the exact ΛCDM growth factor, run side by side against a baryon-only growth history, with $\delta_{\rm rms}$ tracked against $\delta_c = 1.686$.

---

## 6. Big Bang Nucleosynthesis

BBN provides a measurement of $\Omega_b$ that shares **no physics whatsoever** with the CMB determination. It relies on nuclear reaction cross-sections, weak interaction rates, and neutron decay, in a plasma at $T \sim 10^{9}$ K at $t \sim 1$–$200$ s — versus atomic recombination and gravitational infall at $T \sim 3000$ K at $t \sim 380{,}000$ yr. If both give the same $\Omega_b h^2$, the number is not an artifact of either framework.

### 6.1 Deuterium as the baryometer

The single free parameter of standard BBN (given $N_\nu = 3$ and the measured neutron lifetime) is the baryon-to-photon ratio

$$\eta \equiv \frac{n_b}{n_\gamma}, \qquad \eta_{10} \equiv 10^{10}\eta = 273.9\ \Omega_b h^2$$

Deuterium is the sensitive species. It is fragile (binding energy 2.22 MeV), it is a bottleneck in the chain to ⁴He, and it is *destroyed* — never net-produced — in stars. Any measured D/H is therefore a **lower bound** on the primordial value, and in the most metal-poor systems it approaches it. Crucially, the burn-through is efficient, so

$$\mathrm{D/H} \propto \eta^{-1.6}$$

a steep monotonic dependence. Measure D/H, get $\eta$, get $\Omega_b h^2$.

### 6.2 The measurement

Cooke, Pettini & Steidel 2018 (*ApJ* 855, 102, "One Percent Determination of the Primordial Deuterium Abundance") analyzed damped Lyman-α absorbers at $z \approx 2.5$ toward bright quasars — gas with oxygen abundance as low as $\sim1/600$ solar, essentially unprocessed — using Keck/HIRES:

$$\boxed{\ (\mathrm{D/H})_p = (2.527 \pm 0.030)\times10^{-5}\ } \qquad \log_{10}(\mathrm{D/H})_p = -4.5974 \pm 0.0052$$

This is a **1% measurement of a primordial abundance**.

### 6.3 Converting to $\Omega_b h^2$ — and the nuclear-physics fix

Converting D/H to $\eta$ requires the rate of the deuterium-destroying reaction $d(p,\gamma)^3$He at BBN energies. Until recently this was the dominant uncertainty, and it produced a mild ($\sim 2\sigma$) tension: with the older rate, $(\mathrm{D/H})_p$ implied $\Omega_b h^2 \approx 0.0217$, slightly below the CMB value.

**LUNA** — the Laboratory for Underground Nuclear Astrophysics, 1400 m under Gran Sasso, where the cosmic-ray background is suppressed enough to measure a sub-picobarn cross-section directly — measured $d(p,\gamma)^3$He in the BBN energy window to 3% (Mossa et al. 2020, *Nature* 587, 210–213, "The baryon density of the Universe from an improved rate of deuterium burning"). The result:

$$\boxed{\ \Omega_b h^2\big|_{\rm BBN} = 0.02233 \pm 0.00036 \quad (1.6\%)\ }$$

Compare:

$$\Omega_b h^2\big|_{\rm CMB} = 0.02237 \pm 0.00015$$

**Agreement to 0.2%, well within $1\sigma$.** A cross-section measured in an Italian mountain tunnel and an anisotropy pattern measured at L2 agree on the baryon content of the universe.

### 6.4 The corroborating light elements

- **⁴He**: $Y_p = 0.245 \pm 0.003$ (Aver, Olive & Skillman 2015, *JCAP* 07, 011; Izotov et al. 2014, *MNRAS* 445, 778) from extragalactic HII regions. ⁴He depends only logarithmically on $\eta$ (essentially all neutrons that survive to $t\sim200$ s end up in ⁴He, so $Y_p \approx 2(n/p)/(1+n/p)$), which makes it a poor baryometer but an excellent constraint on $N_{\rm eff}$ — and it gives $N_{\rm eff} = 3$, consistent.
- **³He**: consistent, though complicated by stellar processing.
- **⁷Li**: the one failure. Standard BBN predicts $^7$Li/H $\approx 5\times10^{-10}$ at the CMB $\eta$; the Spite plateau in metal-poor halo stars gives $\approx 1.6\times10^{-10}$. This **factor-of-3 "lithium problem" is unresolved** (see §9).

### 6.5 The synthesis of §4 and §6

$$\Omega_b h^2 = 0.0223 \quad\text{(two independent methods)} \qquad \Omega_m h^2 = 0.1430 \quad\text{(CMB peak heights, lensing, LSS)}$$

$$\frac{\Omega_m h^2}{\Omega_b h^2} = \frac{0.1430}{0.0223} = 6.4$$

**Baryons are pinned. They are pinned twice, by disjoint physics. And they fall short by a factor of 6.4.** Whatever makes up the difference cannot be made of protons and neutrons — not because we failed to find them, but because if they existed, deuterium would have burned differently and the CMB peaks would have different heights.

---

## 7. The Direct Detection Frontier — Current State

Everything above concerns dark matter's *gravitational* behavior. Its *particle* identity is an open experimental question, and this section reports the state of the search honestly. **The absence of a laboratory detection does not weaken §§2–6; it constrains the candidate list.**

### 7.1 The method

If dark matter is a WIMP with a weak-scale coupling to nucleons, the Milky Way halo ($\rho_\odot \approx 0.3$–$0.4\ \mathrm{GeV\,cm^{-3}}$, $v_0 \approx 238\ \mathrm{km\,s^{-1}}$) supplies a flux of $\sim10^5\,(100\,\mathrm{GeV}/m_\chi)\ \mathrm{cm^{-2}s^{-1}}$ through any detector. Elastic scattering off a nucleus deposits recoil energy

$$E_R = \frac{\mu^2 v^2 (1-\cos\theta)}{m_N}, \qquad \mu = \frac{m_\chi m_N}{m_\chi + m_N}$$

peaking at a few keV — hence the need for tonne-scale ultra-radiopure targets deep underground. Dual-phase liquid xenon TPCs read both scintillation (S1) and ionization (S2), which discriminates nuclear recoils from electron recoils at the $10^{-9}$ level.

### 7.2 LUX-ZEPLIN, December 2025

LZ operates 10 tonnes of liquid xenon (7 tonne active) at the Sanford Underground Research Facility, 4850 ft down.

**The high-mass search** (arXiv:2410.17036; *PRL*): $4.2 \pm 0.1$ tonne-year exposure from 280 live days. No signal. Minimum spin-independent WIMP–nucleon cross-section limit:

$$\sigma_{\rm SI} < 2.2\times10^{-48}\ \mathrm{cm^2} \ \ (90\%\ \mathrm{CL}) \ \text{ at } m_\chi = 40\ \mathrm{GeV}/c^2$$

**The December 2025 light-mass search** (arXiv:2512.08065, "Searches for Light Dark Matter and Evidence of Coherent Elastic Neutrino-Nucleus Scattering of Solar Neutrinos with the LUX-ZEPLIN (LZ) Experiment"): a **5.7 tonne-year** exposure from **417 live days** taken March 2023–April 2025 — the largest dataset ever collected by a dark matter detector. Analyzing the 1–6 keV window, LZ searched the $3$–$9\ \mathrm{GeV}/c^2$ mass range for the first time and set **world-leading limits on spin-independent and spin-dependent-neutron interactions for masses down to $5\ \mathrm{GeV}/c^2$** — i.e. down to a few proton masses.

**No dark matter signal was found.**

### 7.3 The validation that matters: CEvNS at 4.5σ

The same analysis reports **evidence for coherent elastic neutrino–nucleus scattering (CEvNS) of solar ⁸B neutrinos at 4.5σ statistical significance** — the most significant observation of solar ⁸B CEvNS to date, surpassing the earlier hints from XENONnT (2.73σ; arXiv:2408.02877, *PRL* 133, 191002) and PandaX-4T (2.64σ; arXiv:2407.10892).

**This is the single most important number in the section, and it is not about dark matter.**

CEvNS from ⁸B neutrinos produces nuclear recoils of $\lesssim 2$ keV — kinematically almost identical to a $\sim6\ \mathrm{GeV}/c^2$ WIMP. Detecting it proves, from a source of known flux (the Sun, calibrated by SNO and Super-Kamiokande), that the detector genuinely has the sensitivity claimed in exactly the recoil regime where the WIMP limits are set. **The null result is a real null result, not a sensitivity shortfall.** A calibrated instrument looked and saw nothing.

It also marks the arrival at the **"neutrino fog"** — the region where astrophysical neutrino backgrounds become irreducible and sensitivity improves only as $\sqrt{\text{exposure}}$ or worse rather than linearly (O'Hare 2021, *PRL* 127, 251802). Future gains require directional detection or much larger targets.

### 7.4 Cross-checks

- **XENONnT** (arXiv:2502.18005, "WIMP Dark Matter Search using a 3.1 Tonne-Year Exposure of the XENONnT Experiment"): blind analysis of SR0+SR1, 3.1 tonne-year, no significant nuclear-recoil excess. Minimum limit $\sigma_{\rm SI} < 1.7\times10^{-47}\ \mathrm{cm^2}$ (90% CL) at $30\ \mathrm{GeV}/c^2$; best median sensitivity $1.4\times10^{-47}\ \mathrm{cm^2}$ at $41\ \mathrm{GeV}/c^2$; up to a factor 1.8 improvement over their previous dataset.
- **PandaX-4T** (*PRL* 134, 011805, 2025): 1.54 tonne-year Run0+Run1 combined, no excess, most stringent constraint above $100\ \mathrm{GeV}/c^2$; minimum $1.6\times10^{-47}\ \mathrm{cm^2}$ at $40\ \mathrm{GeV}/c^2$. Their 259-day light-DM search (arXiv:2507.11930; *PRL* 135, 211001) leads in the $2.5$–$5.0\ \mathrm{GeV}/c^2$ SI window.

Three experiments, three collaborations, three sites, consistent nulls.

### 7.5 The rest of the search

- **Colliders**: LHC mono-jet/mono-photon searches exclude simplified-model mediators to the TeV scale; no missing-energy excess.
- **Indirect detection**: Fermi-LAT stacking of Milky Way dwarf spheroidals excludes the canonical thermal relic cross-section $\langle\sigma v\rangle = 3\times10^{-26}\ \mathrm{cm^3s^{-1}}$ for $m_\chi \lesssim 100$ GeV in the $b\bar b$ channel (Ackermann et al. 2015, *PRL* 115, 231301).
- **Axions**: ADMX has excluded DFSZ-coupling axions over parts of the 2.7–4.2 μeV window; the QCD axion remains fully viable and the effort is expanding (Braine et al. 2020, *PRL* 124, 101303).
- **Primordial black holes**: microlensing (OGLE, Subaru HSC) and CMB accretion constraints close most of the mass range, though asteroid-mass windows ($10^{17}$–$10^{22}$ g) survive.

### 7.6 What the nulls actually mean

The WIMP was motivated by a coincidence — a particle with weak-scale mass and weak-scale couplings freezes out with roughly the observed relic abundance. That coincidence is now under real pressure across four orders of magnitude in cross-section. But:

$$\text{"the WIMP hypothesis is constrained"} \ \neq\ \text{"dark matter is constrained"}$$

The gravitational evidence measures a *density* and a *clustering behavior*. It says nothing about the coupling to the Standard Model, which could be zero apart from gravity. Axions, sterile neutrinos, asymmetric dark matter, dark-sector composites, and gravitationally-produced relics all remain fully consistent with §§2–6 and with every null in §7.

---

## 8. Synthesis

Five independent methods. Different physics, different epochs, different systematics, different failure modes.

| # | Probe | Epoch | Physics invoked | What it measures | Result |
|---|---|---|---|---|---|
| 1 | Rotation curves | $z \approx 0$ | Newtonian dynamics | $M(r)$ in galaxy halos | $M(r) \propto r$; $\Upsilon$ up to ~100 |
| 2 | Gravitational lensing | $z \sim 0.3$–$1$ | GR null geodesics | Projected $\Sigma$, no equilibrium assumed | $\kappa$ peak offset 8σ from baryons |
| 3 | CMB acoustic peaks | $z \approx 1100$ | Linear perturbation theory, Thomson scattering | $\Omega_b h^2$ and $\Omega_m h^2$ separately | $\Omega_c h^2 = 0.1200 \pm 0.0012$ |
| 4 | Structure formation | $z: 1100 \to 0$ | Gravitational instability | Required growth budget | Baryons short by ~50× |
| 5 | BBN | $t \sim 100$ s | Nuclear + weak interactions | $\Omega_b h^2$ | $0.02233 \pm 0.00036$ |

**These are not five restatements of one measurement.** They could easily have disagreed. A modeling error in stellar $\Upsilon$ affects (1) and nothing else. A recombination-history error affects (3) and nothing else. A wrong $d(p,\gamma)^3$He rate affects (5) and nothing else. There is no shared systematic that could produce a coherent factor-of-6 offset across all of them.

And they are *quantitatively* concordant, not merely qualitatively:
- BBN and CMB agree on $\Omega_b h^2$ to 0.2%.
- Cluster baryon fractions ($f_b \approx 0.13$–$0.15$) match the cosmic $\Omega_b/\Omega_m = 0.156$.
- The BAO scale in low-$z$ galaxies matches the CMB sound horizon.
- Weak-lensing surveys (DES Y3, KiDS-1000, HSC) independently measure $S_8 = \sigma_8\sqrt{\Omega_m/0.3}$ consistent with CMB-extrapolated ΛCDM to within $\sim2\sigma$.

### 8.1 Why MOND does not close this

Modified Newtonian Dynamics (Milgrom 1983, *ApJ* 270, 365) posits that below $a_0 \approx 1.2\times10^{-10}\ \mathrm{m\,s^{-2}}$, the effective gravity becomes $g = \sqrt{g_N a_0}$, giving $v^4 = G M a_0$ — flat curves and the baryonic Tully–Fisher relation with the right slope, from one parameter.

**It should be said plainly that MOND's galactic-scale successes are real and were predictive.** The radial acceleration relation and the tightness of BTFR were MOND expectations before they were measurements. Any complete theory must explain them.

But MOND does not close the case, for reasons that are separate and cumulative:

1. **Clusters.** MOND applied to cluster dynamics still leaves a factor of ~2 in missing mass (Sanders 2003, *MNRAS* 342, 901; The & White 1988, *AJ* 95, 1642). MOND requires dark matter in clusters.
2. **The Bullet Cluster.** In any theory where the field is sourced by the visible matter, $\kappa$ tracks $\Sigma_{\rm baryon}$. It demonstrably does not. This is a geometric fact, insensitive to the interpolating function.
3. **The CMB third peak.** Standard MOND has no mechanism to provide the pressureless clustering component that drives the peak-height pattern in §4.2(b).
4. **Structure formation timing.** MOND modifies the force law but does not give baryons a head start; the growth budget in §5.2 remains short.
5. **GW170817.** The simultaneous arrival of gravitational waves and gamma rays from a binary neutron star merger 40 Mpc away constrained $|c_{\rm gw}/c - 1| < 10^{-15}$. This eliminated the broad class of relativistic MOND completions — including Bekenstein's TeVeS (2004, *PRD* 70, 083509) — in which tensor and photon modes propagate on different effective metrics (Boran et al. 2018, *PRD* 97, 041501).

**The honest caveat.** Skordis & Złośnik 2021 (*PRL* 127, 161302) constructed a relativistic MOND-like theory that *does* fit the CMB and matter power spectrum while reproducing MOND in galaxies. It is a genuine achievement. But it does so by introducing additional fields whose cosmological stress-energy behaves as pressureless dust — that is, it reproduces the CMB **by recovering CDM phenomenology at cosmological scales**. The field content is different; the effective cosmological ingredient is not. That is a reformulation of dark matter, not its elimination.

### 8.2 The unified statement

> A single hypothesis — that ~84% of the matter density consists of a pressureless, effectively collisionless, non-baryonic, dynamically cold component with $\Omega_c h^2 = 0.1200$ — simultaneously accounts for flat rotation curves across 175 SPARC galaxies, the 8σ lensing/gas offset in the Bullet Cluster, the full acoustic peak structure of the CMB, the growth of structure from $10^{-5}$ to nonlinear collapse, and the observed cluster baryon fraction, while remaining consistent with a factor-6.4 baryon deficit independently established by nuclear physics at $t \sim 100$ s.
>
> No alternative framework currently accounts for all of these simultaneously.

---

## 9. Honest Limits

The credibility of this argument depends on distinguishing what has been measured from what has been assumed.

### 9.1 What is settled

**The existence of a dominant, non-baryonic, gravitationally-clustering mass component is established.** This is settled at a level comparable to any result in observational cosmology:

- It is measured by five methods with disjoint systematics (§8).
- Two of those methods ($\Omega_b h^2$ from BBN and from the CMB) agree to 0.2%, which pins the baryon side rather than merely bounding it.
- The Bullet Cluster demonstrates spatial separation between the dominant baryonic mass and the lensing mass at 8σ, which is a *direct* rather than inferential result.
- The required component's macroscopic properties are themselves measured, not postulated: it is cold ($m_{\rm WDM} > 5.3$ keV), collisionless ($\sigma/m < 1.25\ \mathrm{cm^2\,g^{-1}}$), pressureless ($w \approx 0$), and non-baryonic (from BBN + CMB peak ratios).

Someone arguing against this must explain all five independent lines with one alternative mechanism. No one has.

### 9.2 What is not settled

**The particle identity is unknown.** This is the honest headline of §7. We have a density, a temperature bound, a self-interaction bound, and nothing else.

- WIMP parameter space has been reduced by four orders of magnitude in cross-section without a detection, and LZ has now reached the neutrino fog in the light-mass region. The specific thermal-relic WIMP is under serious pressure.
- Axion searches have covered a small fraction of the viable mass range.
- Candidates coupling to the Standard Model *only* gravitationally are consistent with everything and may be undetectable in principle by current methods.

### 9.3 Genuine open problems within ΛCDM

These are not fatal, but stating them is part of stating the case accurately:

- **The core–cusp problem.** Dissipationless CDM simulations predict inner density profiles $\rho \propto r^{-1}$ (NFW; Navarro, Frenk & White 1997, *ApJ* 490, 493). Many dwarf and low-surface-brightness galaxies show flat cores. Baryonic feedback (supernova-driven potential fluctuations) plausibly resolves this (Pontzen & Governato 2012, *MNRAS* 421, 3464), but the resolution is not clean.
- **The radial acceleration relation.** The scatter is $\sim0.11$ dex, consistent with observational error alone. ΛCDM predicts a correlation, but the observed *tightness* — given the halo-to-halo scatter in formation history — is a real tension and a live research question.
- **Planes of satellites.** The co-rotating satellite planes around the Milky Way, M31 and Cen A are rare in ΛCDM simulations at the few-percent level.
- **The ⁷Li problem.** BBN over-predicts primordial lithium by a factor of ~3 (§6.4). Most likely a stellar-depletion or nuclear-rate issue, but unsolved.
- **The $S_8$ and $H_0$ tensions.** Weak-lensing $S_8$ sits $\sim2$–$3\sigma$ below the CMB-extrapolated value; local $H_0$ (SH0ES: $73.0 \pm 1.0$) sits $\sim5\sigma$ above the Planck value. These concern dark energy and the expansion history far more than dark matter, but they are unresolved features of the concordance model.
- **The Bullet Cluster's collision velocity** was once argued to be improbably high for ΛCDM (Lee & Komatsu 2010, *ApJ* 718, 60). Careful distinction between the shock speed and the subcluster infall speed (Springel & Farrar 2007, *MNRAS* 380, 911) largely resolved this — but it is an example of why single-system arguments need care.

### 9.4 The precise claim

> **Settled:** There is a non-baryonic, cold, collisionless mass component comprising $\Omega_c h^2 = 0.1200 \pm 0.0012$, ~84% of the matter density. Five independent methods agree. This is not going to be overturned.
>
> **Open:** What it is made of. That is an experimental question, currently being answered in the negative, one candidate at a time.

The distinction is not a hedge. It is the difference between a measurement and a hypothesis — and dark matter has been, for four decades, a measurement in search of a hypothesis.

---

## References

**Foundational**
- Zwicky, F. 1933, *Helvetica Physica Acta*, 6, 110 — Coma virial mass
- Rubin, V. C. & Ford, W. K. 1970, *ApJ*, 159, 379 — M31 rotation curve
- Roberts, M. S. & Whitehurst, R. N. 1975, *ApJ*, 201, 327 — M31 at 21 cm
- Bosma, A. 1981, *AJ*, 86, 1825 — HI rotation curves of 25 galaxies
- Rubin, V. C., Ford, W. K. & Thonnard, N. 1980, *ApJ*, 238, 471 — 21 Sc galaxies
- van Albada, T. S. et al. 1985, *ApJ*, 295, 305 — NGC 3198 mass model
- Freeman, K. C. 1970, *ApJ*, 160, 811 — exponential disk rotation law
- Navarro, J., Frenk, C. & White, S. 1997, *ApJ*, 490, 493 — NFW profile

**Rotation curves, modern**
- Lelli, F., McGaugh, S. & Schombert, J. 2016, *AJ*, 152, 157 — SPARC (175 galaxies)
- McGaugh, S., Lelli, F. & Schombert, J. 2016, *PRL*, 117, 201101 — radial acceleration relation
- McGaugh, S. 2012, *ApJ*, 751, 8 — baryonic Tully–Fisher
- Eilers, A.-C. et al. 2019, *ApJ*, 871, 120 — Milky Way circular velocity curve

**Lensing**
- Kaiser, N. & Squires, G. 1993, *ApJ*, 404, 441 — weak lensing mass reconstruction
- Markevitch, M. et al. 2002, *ApJ*, 567, L27 — 1E 0657-558 Chandra shock
- **Clowe, D. et al. 2006, *ApJ*, 648, L109 — "A Direct Empirical Proof of the Existence of Dark Matter"**
- Bradač, M. et al. 2006, *ApJ*, 652, 937 — joint strong+weak reconstruction
- Bradač, M. et al. 2008, *ApJ*, 687, 959 — MACS J0025.4−1222
- Randall, S. et al. 2008, *ApJ*, 679, 1173 — $\sigma/m$ constraint

**CMB & cosmological parameters**
- **Planck Collaboration VI 2020, *A&A*, 641, A6 — Planck 2018 cosmological parameters**
- Hu, W. & Sugiyama, N. 1996, *ApJ*, 471, 542 — acoustic peak physics
- Louis, T. et al. (ACT) 2025, arXiv:2503.14452 — ACT DR6 power spectra and ΛCDM parameters
- DESI Collaboration 2025, *PRD*, 112, 083515 (arXiv:2503.14738) — DR2 BAO constraints

**Structure formation**
- Bardeen, J., Bond, J., Kaiser, N. & Szalay, A. 1986, *ApJ*, 304, 15 — BBKS transfer function
- Zel'dovich, Ya. B. 1970, *A&A*, 5, 84 — Zel'dovich approximation
- **Springel, V. et al. 2005, *Nature*, 435, 629 — the Millennium Simulation**
- Eisenstein, D. et al. 2005, *ApJ*, 633, 560 — BAO detection in SDSS
- Alam, S. et al. 2021, *PRD*, 103, 083533 — eBOSS cosmology
- Iršič, V. et al. 2017, *PRD*, 96, 023522 — Lyα forest WDM limit
- Schaye, J. et al. 2015, *MNRAS*, 446, 521 — EAGLE
- Pillepich, A. et al. 2018, *MNRAS*, 473, 4077 — IllustrisTNG

**BBN**
- **Cooke, R., Pettini, M. & Steidel, C. 2018, *ApJ*, 855, 102 — 1% primordial D/H**
- **Mossa, V. et al. 2020, *Nature*, 587, 210 — LUNA $d(p,\gamma)^3$He and $\Omega_b h^2$**
- Aver, E., Olive, K. & Skillman, E. 2015, *JCAP*, 07, 011 — primordial helium
- Fields, B., Olive, K., Yeh, T.-H. & Young, C. 2020, *JCAP*, 03, 010 — BBN status

**Direct detection**
- **LZ Collaboration 2025, arXiv:2512.08065 — light DM search + 4.5σ solar ⁸B CEvNS, 5.7 t·yr / 417 live days**
- LZ Collaboration 2024, arXiv:2410.17036 — 4.2 t·yr WIMP search, $2.2\times10^{-48}\ \mathrm{cm^2}$ at 40 GeV
- **XENONnT Collaboration 2025, arXiv:2502.18005 — 3.1 t·yr WIMP search**
- PandaX-4T Collaboration 2025, *PRL*, 134, 011805 — 1.54 t·yr combined run
- PandaX-4T Collaboration 2025, *PRL*, 135, 211001 (arXiv:2507.11930) — 259-day light DM search
- O'Hare, C. 2021, *PRL*, 127, 251802 — the neutrino fog
- Ackermann, M. et al. 2015, *PRL*, 115, 231301 — Fermi-LAT dwarf spheroidals
- Braine, T. et al. (ADMX) 2020, *PRL*, 124, 101303 — axion search

**Alternatives**
- Milgrom, M. 1983, *ApJ*, 270, 365 — MOND
- Bekenstein, J. 2004, *PRD*, 70, 083509 — TeVeS
- Sanders, R. H. 2003, *MNRAS*, 342, 901 — MOND in clusters
- Boran, S. et al. 2018, *PRD*, 97, 041501 — GW170817 constraints on modified gravity
- Skordis, C. & Złośnik, T. 2021, *PRL*, 127, 161302 — relativistic MOND fitting the CMB
