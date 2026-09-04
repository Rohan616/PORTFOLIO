# Architectural Decisions & Comprehensive Code Documentation

This document provides a detailed breakdown of every design decision, mathematical formulation, and source code module implemented in the **Event Horizon: Black Hole & Hyperspace Portfolio**.

---

## Table of Contents
1. [Core Architectural & Design Decisions](#1-core-architectural--design-decisions)
2. [Astrophysics & Shader Mathematics](#2-astrophysics--shader-mathematics)
3. [Scroll & Dual-Stage WebGL Architecture](#3-scroll--dual-stage-webgl-architecture)
4. [Procedural Web Audio Engine](#4-procedural-web-audio-engine)
5. [Detailed Code-by-Code Explanation](#5-detailed-code-by-code-explanation)
   - [5.1 `BlackHoleShaders.ts` — GLSL Raymarcher](#51-blackholeshadersts--glsl-raymarcher)
   - [5.2 `BlackHoleCanvas.tsx` — Three.js WebGL Host](#52-blackholecanvastsx--threejs-webgl-host)
   - [5.3 `HaoqiHyperspaceTunnel.tsx` — Radial Laser Burst](#53-haoqihyperspacetunneltsx--radial-laser-burst)
   - [5.4 `Interactive3DCursor.tsx` — 3D Holographic Gyro Cursor](#54-interactive3dcursortsx--3d-holographic-gyro-cursor)
   - [5.5 `useLenis.ts` — Momentum Scroll Hook](#55-uselenists--momentum-scroll-hook)
   - [5.6 `CosmicAudioEngine.ts` — Synthesizer](#56-cosmicaudioenginets--synthesizer)
   - [5.7 `StickyHyperspaceScroll.tsx` — Pinned Scrollytelling](#57-stickyhyperspacescrolltsx--pinned-scrollytelling)
   - [5.8 `CosmicHUD.tsx` — Telemetry & HUD Navigation](#58-cosmichudtsx--telemetry--hud-navigation)
   - [5.9 Portfolio Sections & Modals](#59-portfolio-sections--modals)
   - [5.10 `App.tsx` — Root State & Lifecycle](#510-apptsx--root-state--lifecycle)

---

## 1. Core Architectural & Design Decisions

### Decision 1: Custom GLSL Raymarching vs. Static 3D Models / Videos
- **Why**: Standard 3D polygon meshes cannot reproduce general relativistic gravitational light bending (Einstein ring lensing) or dynamic plasma rotation with Keplerian shear.
- **Solution**: A full-screen orthographic quad running a custom numerical geodesic raymarcher on the GPU at a constant 60 FPS.

### Decision 2: Asymmetric Right-Side Viewport Anchoring
- **Why**: To prevent 3D graphics from obstructing textual content and typography.
- **Solution**: The black hole origin is placed at normalized coordinate $X \approx +0.85$ on desktop (shifting to $+0.35$ on mobile). The left 60% of the screen remains completely legible for information architecture.

### Decision 3: Pinned Sticky Scrollytelling for Hyperspace
- **Why**: Normal scroll-based particle effects often feel chaotic or interfere with standard page reading.
- **Solution**: A dedicated `500vh` scroll track with a pinned `sticky top-0 h-screen` child. Normal sections scroll cleanly, while scrolling through this specific track drives a multi-stage radial speed-line burst with synchronized typography.

### Decision 4: Procedural Web Audio API vs. Audio Files
- **Why**: Audio asset files (`.mp3`, `.wav`) introduce network payload, latency, and decoding overhead.
- **Solution**: Procedural synthesis using native browser `AudioContext` oscillators, noise buffers, and biquad filters generated in real time.

---

## 2. Astrophysics & Shader Mathematics

### 2.1 Gravitational Ray Deflection (Einstein Deflection Approximation)
In curved Schwarzschild spacetime, the deflection angle of light passing at impact parameter $r$ from a mass $M$ is given by:
$$\theta \approx \frac{4GM}{c^2 r}$$
Inside our numerical raymarcher, each ray step applies a deflection velocity vector toward the singularity center:
$$\vec{F}_{\text{deflect}} = \frac{3GM}{\|\vec{r}\|^3} \cdot \Delta s \cdot \hat{r}$$
This bends background light and rear accretion disk light around the event horizon, forming the iconic upper and lower luminous arches.

### 2.2 Relativistic Doppler Beaming
As accretion plasma orbits at relativistic speeds, radiation emitted in the direction of motion is boosted in intensity (beamed) due to Lorentz transformation:
$$I_{\text{observed}} = I_{\text{emitted}} \cdot \left(1 + \vec{v}_{\text{orbital}} \cdot \hat{r}_{\text{ray}}\right)$$
Plasma rotating toward the observer (left side) appears hotter and brighter, while receding plasma (right side) appears dimmed and redshifted.

### 2.3 Keplerian Differential Rotation
Inner orbital regions rotate significantly faster than outer regions according to Kepler's Third Law:
$$\omega(r) = \frac{v_{\text{orbit}}}{r} \propto r^{-1.5}$$
This angular velocity is used to shear the 3D simplex noise coordinates, creating realistic plasma turbulence filaments.

---

## 3. Scroll & Dual-Stage WebGL Architecture

We use **Lenis** to provide smooth, inertia-guided scrolling. The scroll progress $p \in [0, 1]$ of the pinned track is calculated via `getBoundingClientRect()`:
$$p = \text{clamp}\left(\frac{-\text{rect.top}}{\text{rect.height} - \text{windowHeight}}, 0, 1\right)$$
This normalized value $p$ directly governs:
1. Streak line length: $L(p) = 1.0 + p^{1.5} \times 55.0$
2. Ray velocity: $V(p) = 0.5 + p^{1.8} \times 45.0$
3. Camera field of view: $\text{FOV}(p) = 65^\circ + p \times 25.0^\circ$
4. Multi-stage typographic crossfades ($0.0 \to 0.35 \to 0.72 \to 1.0$)

---

## 4. Procedural Web Audio Engine

- **Sub-Bass Ambient Hum**: Dual oscillators (38 Hz sine wave + 55 Hz triangle wave detuned by 4 Hz) routed through a 120 Hz resonant low-pass filter.
- **Warp Drone Pitch Modulation**: Sawtooth oscillator frequency scaled dynamically by warp velocity:
  $$f_{\text{drone}} = 80\text{ Hz} + v_{\text{warp}} \times 400\text{ Hz}$$
- **Warp Boom Effect**: Exponential frequency sweep ($100\text{ Hz} \to 1200\text{ Hz}$) combined with a white noise buffer passing through an automated biquad bandpass filter ($300\text{ Hz} \to 3500\text{ Hz} \to 200\text{ Hz}$).

---

## 5. Detailed Code-by-Code Explanation

### 5.1 `BlackHoleShaders.ts` — GLSL Raymarcher

```glsl
// blackHoleVertexShader: Passes normalized quad UV coordinates to fragment shader
export const blackHoleVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;
```
- **Line 1-7**: Standard vertex pass-through mapping a 2D plane across the full screen viewport.

```glsl
#define MAX_STEPS 100
#define STEP_SIZE 0.055
```
- **`MAX_STEPS`**: Maximum iterations for ray propagation through curved space.
- **`STEP_SIZE`**: Base integration step size for numerical ray advancement.

```glsl
// Numerical Geodesic Raymarcher Loop
for (int i = 0; i < MAX_STEPS; i++) {
  vec3 toBH = bhPos - rayPos;
  float dist = length(toBH);
  minDistance = min(minDistance, dist);

  // If ray enters event horizon, light is swallowed (zero emission)
  if (dist < r_horizon) {
    hitHorizon = true;
    break;
  }

  // Calculate Einstein gravitational deflection
  float bendForce = (mass / (dist * dist * dist)) * stepSize * 0.68;
  rayDir = normalize(rayDir + toBH * bendForce);

  // Volumetric sampling of the equatorial accretion disk plane
  float diskDistY = abs(rayPos.y - bhPos.y);
  float diskDistR = length(rayPos.xz - bhPos.xz);

  if (diskDistR > r_disk_in && diskDistR < r_disk_out && diskDistY < 0.2) {
    float radialNorm = (diskDistR - r_disk_in) / (r_disk_out - r_disk_in);
    float orbitalAngle = atan(rayPos.z - bhPos.z, rayPos.x - bhPos.x);
    float keplerSpeed = (2.2 / pow(diskDistR, 1.5)) * (uTime * 0.9 * uSpinSpeed);
    
    // Multi-scale 3D simplex turbulence
    vec3 noiseCoords = vec3(
      cos(orbitalAngle + keplerSpeed) * diskDistR * 1.6,
      sin(orbitalAngle + keplerSpeed) * diskDistR * 1.6,
      diskDistY * 6.5 + uTime * 0.2
    );
    float turbulence = fbm(noiseCoords);
    
    // Doppler beaming calculation
    vec3 diskVelocity = normalize(vec3(-(rayPos.z - bhPos.z), 0.0, rayPos.x - bhPos.x));
    float dopplerFactor = dot(rayDir, diskVelocity);
    float beaming = clamp(1.0 + dopplerFactor * 0.82, 0.18, 2.8);

    float sampleDensity = pow(1.0 - radialNorm, 1.85) * exp(-pow(diskDistY / 0.065, 2.0)) * (0.6 + turbulence * 0.8) * beaming * 0.22;
    vec3 plasmaColor = mix(uDiskColor1, uDiskColor2, pow(radialNorm, 0.72));
    
    totalColor += plasmaColor * sampleDensity * (1.0 - totalDensity);
    totalDensity += sampleDensity;
    if (totalDensity >= 0.98) break;
  }

  stepSize = clamp(dist * 0.042, 0.028, 0.15); // Adaptive step size
  rayPos += rayDir * stepSize;
  if (dist > 14.0) break; // Ray escaped bounding box
}
```
- **Explanation**: Loops through 3D spacetime, dynamically calculates gravitational ray deflection at each point, computes the intersection and density of the accretion disk with relativistic Doppler beaming and turbulence, and handles ray termination upon reaching the event horizon.

---

### 5.2 `BlackHoleCanvas.tsx` — Three.js WebGL Host
- Sets up an orthographic Three.js scene containing a single plane mesh sized $(2 \times 2)$.
- Supplies dynamic uniforms: `uTime`, `uResolution`, `uMouse`, `uDiskColor1`, `uDiskColor2`, `uWarpSpeed`, `uSpinSpeed`, and `uGravitationalStrength`.
- Handles window resizing and computes mouse parallax coordinates with smooth exponential lerping.

---

### 5.3 `HaoqiHyperspaceTunnel.tsx` — Radial Laser Burst
- Generates a buffer geometry with **4,500 line segments** ($9,000$ vertices) radiating from the screen center into 3D depth.
- Maps colors from the palette (cyan, chartreuse `#c0fe04`, magenta, electric blue, and theme colors).
- In the animation loop:
  - Extrapolates depth $z$ based on scroll progress: $z = ((z_{\text{base}} + p \times 150 \times \text{speed}) \pmod{140}) - 130$.
  - Adjusts radial distance $r$ with perspective distance expansion to create an expansive conical warp tunnel.
  - Dynamically stretches line segment tails backwards according to warp speed.

---

### 5.4 `Interactive3DCursor.tsx` — 3D Holographic Gyro Cursor
- Creates a 3D group with:
  1. `OctahedronGeometry(0.18)`: Physical glass material with transmission and ambient color.
  2. `OctahedronGeometry(0.20)`: Wireframe outline overlay for a holographic aesthetic.
  3. `TorusGeometry(0.28, 0.008)`: Rotating gyroscope ring.
  4. `Points`: A 24-point particle history buffer forming an additive luminescent trail.
- Projects screen mouse coordinates onto the 3D camera plane using vector unprojection:
  ```ts
  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  const distance = -camera.position.z / vec.z;
  const worldPos = camera.position.clone().add(vec.multiplyScalar(distance));
  ```
- Applies real-time 3D rotation and tumbling driven by vertical scroll velocity:
  $$\text{rot}_x = t \times 0.8 + v_{\text{scroll}} \times 0.25$$

---

### 5.5 `useLenis.ts` — Momentum Scroll Hook
- Initializes a `Lenis` instance with custom easing: `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`.
- Integrates Lenis updates into the `requestAnimationFrame` render loop to prevent frame-lag between DOM layout and WebGL canvas rendering.

---

### 5.6 `CosmicAudioEngine.ts` — Synthesizer
- Manages audio nodes using Web Audio API:
  - `rumbleOsc1` & `rumbleOsc2`: Sub-bass ambient hum (38 Hz + 55 Hz).
  - `warpDroneOsc`: Sawtooth wave modulated by scroll progress.
  - `playWarpJump()`: Multi-stage sound effect with frequency sweep and white noise burst.
  - `playUIBeep()`: High-frequency resonance chirp on button interactions.

---

### 5.7 `StickyHyperspaceScroll.tsx` — Pinned Scrollytelling
- Implements a `500vh` scroll track with a `sticky top-0 h-screen` child.
- Normalizes scroll position into progress $p \in [0, 1]$.
- Seamlessly reveals typographic stages:
  - **Stage 01**: `"INNOVATE WITH PURPOSE"`
  - **Stage 02**: `"INNOVATE WITH A HUMAN TOUCH"`
  - **Stage 03**: `"FUTURE-FIRST ALWAYS"`
- Includes retro pixel cursor branding and top/bottom gradient blending.

---

### 5.8 `CosmicHUD.tsx` — Telemetry & HUD Navigation
- Tracks live mouse coordinates in retro format (`0001 X 0001 Y`).
- Provides UTC Stardate clock and FPS performance monitoring.
- Provides interactive theme palette switching (`THEME[G]`, `THEME[C]`, `THEME[U]`, `THEME[S]`) and audio toggle (`SOUND[|]`).

---

### 5.9 Portfolio Sections & Modals
- **`HeroSection.tsx`**: Left-aligned high-impact typography, status callouts, and action buttons.
- **`AboutSection.tsx`**: Core biography, technical highlights, and interactive GLSL telemetry tuning sliders (real-time accretion spin and gravitational mass controls).
- **`ProjectsSection.tsx` & `ProjectModal.tsx`**: Category filter pills, project cards, and comprehensive architecture modals with metrics.
- **`SkillsSection.tsx`**: Categorized proficiencies with progress meters.
- **`ExperienceSection.tsx`**: Chronological mission flight log.
- **`ContactSection.tsx`**: Subspace transceiver form with live transmission feedback.

---

### 5.10 `App.tsx` — Root State & Lifecycle
- Coordinates global theme state, scroll observation, section detection via `IntersectionObserver`, and smooth navigation transitions between DOM components and WebGL layers.
