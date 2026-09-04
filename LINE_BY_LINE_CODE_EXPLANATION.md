# Exhaustive Line-by-Line Code Explanation Guide

This guide breaks down every source file in the **Event Horizon** codebase, detailing the exact purpose of every line, function, shader instruction, and component.

---

## Table of Contents
1. [`src/types/index.ts`](#1-srctypesindexts) — TypeScript Type Definitions
2. [`src/constants/themes.ts`](#2-srcconstantsthemests) — Color Palettes & Themes
3. [`src/hooks/useLenis.ts`](#3-srchooksuselenists) — Momentum Smooth Scroll Engine
4. [`src/audio/CosmicAudioEngine.ts`](#4-srcaudiocosmicaudioenginets) — Web Audio API Synthesizer
5. [`src/components/canvas/BlackHoleShaders.ts`](#5-srccomponentscanvasblackholeshadersts) — Raymarching GLSL Shaders
6. [`src/components/canvas/BlackHoleCanvas.tsx`](#6-srccomponentscanvasblackholecanvastsx) — WebGL Black Hole Host
7. [`src/components/canvas/HaoqiHyperspaceTunnel.tsx`](#7-srccomponentscanvashaoqihyperspacetunneltsx) — Radial Laser Streaks
8. [`src/components/canvas/Interactive3DCursor.tsx`](#8-srccomponentscanvasinteractive3dcursortsx) — 3D Holographic Gyro Cursor
9. [`src/components/sections/StickyHyperspaceScroll.tsx`](#9-srccomponentssectionsstickyhyperspacescrolltsx) — Pinned Scrollytelling Sequence
10. [`src/components/hud/CosmicHUD.tsx`](#10-srccomponentshudcosmichudtsx) — Telemetry HUD & Navigation
11. [`src/components/sections/HeroSection.tsx`](#11-srccomponentssectionsherosectiontsx) — Hero Section
12. [`src/components/sections/AboutSection.tsx`](#12-srccomponentssectionsaboutsectiontsx) — Singularity Core & Physics Sliders
13. [`src/components/sections/ProjectsSection.tsx` & `ProjectModal.tsx`](#13-srccomponentssectionsprojectssectiontsx--projectmodaltsx) — Accretion Archives
14. [`src/components/sections/SkillsSection.tsx`](#14-srccomponentssectionsskillssectiontsx) — Stellar Matrix
15. [`src/components/sections/ExperienceSection.tsx`](#15-srccomponentssectionsexperiencesectiontsx) — Flight Log Missions
16. [`src/components/sections/ContactSection.tsx`](#16-srccomponentssectionscontactsectiontsx) — Subspace Transceiver Terminal
17. [`src/App.tsx`](#17-srcapptsx) — Main Application Coordinator

---

## 1. `src/types/index.ts`

```typescript
export type ThemeColor = 'gargantua' | 'cygnus' | 'ultraviolet' | 'supernova';
```
- **Line 1**: Defines a strict TypeScript union type `ThemeColor` restricting active color schemes to four cosmic presets.

```typescript
export interface ThemeConfig {
  id: ThemeColor;
  name: string;
  diskColor1: string; // Inner accretion disk
  diskColor2: string; // Outer accretion disk
  accentColor: string; // UI accent
  bgGlow: string;
  description: string;
}
```
- **Lines 3-11**: Defines the `ThemeConfig` data structure containing the theme identifier, human-readable name, inner and outer plasma hex colors, UI highlight color, CSS background radial gradient, and description.

```typescript
export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: '3D / Graphics' | 'AI & Systems' | 'FinTech & Web3' | 'Creative Tech';
  description: string;
  longDescription: string;
  metrics: { label: string; value: string }[];
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  image: string;
  featured: boolean;
  gravityIndex: number;
}
```
- **Lines 13-27**: Defines the `Project` model holding technical details, numerical performance metrics, tech stack tags, URLs, and gravitational indexing.

```typescript
export interface SkillCategory {
  title: string;
  badge: string;
  skills: {
    name: string;
    level: number;
    description: string;
    icon: string;
  }[];
}
```
- **Lines 29-38**: Defines skill category groupings containing proficiency percentages, descriptions, and icons.

```typescript
export interface FlightLogEntry {
  stardate: string;
  role: string;
  organization: string;
  location: string;
  missionSummary: string;
  keyAchievements: string[];
  telemetry: string;
}
```
- **Lines 40-48**: Represents a chronological work experience entry with mission summary and bullet points.

```typescript
export interface TelemetryData {
  fps: number;
  scrollVelocity: number;
  warpSpeed: number;
  eventHorizonDistance: number;
  relativisticGamma: number;
  anomalyDetected: boolean;
  isWarpJumping: boolean;
}
```
- **Lines 50-58**: Defines real-time telemetry metrics passed between WebGL engines and HUD overlays.

---

## 2. `src/constants/themes.ts`

```typescript
import { ThemeConfig } from '../types';

export const cosmicThemes: ThemeConfig[] = [
  {
    id: 'gargantua',
    name: 'Gargantua Gold',
    diskColor1: '#ffaa22',
    diskColor2: '#cc4400',
    accentColor: '#f59e0b',
    bgGlow: 'rgba(245, 158, 11, 0.15)',
    description: 'Relativistic Kerr black hole with blazing golden accretion disk',
  },
  {
    id: 'cygnus',
    name: 'Cygnus X-1 Cyan',
    diskColor1: '#00f2fe',
    diskColor2: '#0066ff',
    accentColor: '#00f2fe',
    bgGlow: 'rgba(0, 242, 254, 0.15)',
    description: 'High-energy X-ray binary microquasar with ultra-violet plasma',
  },
  {
    id: 'ultraviolet',
    name: 'Ultraviolet Void',
    diskColor1: '#d946ef',
    diskColor2: '#7e22ce',
    accentColor: '#c084fc',
    bgGlow: 'rgba(192, 132, 252, 0.15)',
    description: 'Deep cosmic singularity bathed in extreme ultraviolet resonance',
  },
  {
    id: 'supernova',
    name: 'Supernova Crimson',
    diskColor1: '#ff4b4b',
    diskColor2: '#990022',
    accentColor: '#ff4b4b',
    bgGlow: 'rgba(255, 75, 75, 0.15)',
    description: 'Collapsar core born from a catastrophic hypernova detonation',
  },
];
```
- **Lines 1-38**: Contains the four cosmic palette objects supplying distinct color matrices to GLSL shaders, 3D cursor materials, and Tailwind CSS root variables.

---

## 3. `src/hooks/useLenis.ts`

```typescript
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function useLenis(enabled = true) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  return lenisRef;
}
```
- **Lines 1-4**: Imports React hooks and the Lenis library, exporting the `useLenis` custom hook.
- **Lines 7-8**: Guard clause ensuring the smooth scroll instance is only instantiated when `enabled` is true.
- **Lines 10-19**: Configures Lenis with an exponential decay easing curve ($1 - 2^{-10t}$), enabling momentum inertia on mouse wheel and touch gestures.
- **Lines 23-28**: Hooks Lenis's `raf()` time-step directly into the browser's `requestAnimationFrame` loop, guaranteeing synchronicity between DOM scroll events and Three.js canvas renders.
- **Lines 30-34**: Cleanup function canceling the animation frame and destroying the Lenis instance when the component unmounts.

---

## 4. `src/audio/CosmicAudioEngine.ts`

```typescript
class CosmicAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private rumbleOsc1: OscillatorNode | null = null;
  private rumbleOsc2: OscillatorNode | null = null;
  private rumbleGain: GainNode | null = null;
  private warpDroneGain: GainNode | null = null;
  private warpDroneOsc: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
```
- **Lines 1-13**: Declares the `CosmicAudioEngine` class and internal Web Audio API node references (oscillators, gains, filters).

```typescript
  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.setupRumble();
    } catch (e) {
      console.warn("Web Audio API not supported or blocked", e);
    }
  }
```
- **Lines 15-28**: Lazily initializes the browser `AudioContext` on first user interaction, sets up master gain routing, and initiates the continuous ambient space rumble.

```typescript
  private setupRumble() {
    if (!this.ctx || !this.masterGain) return;
    this.rumbleOsc1 = this.ctx.createOscillator();
    this.rumbleOsc1.type = 'sine';
    this.rumbleOsc1.frequency.setValueAtTime(38, this.ctx.currentTime);

    this.rumbleOsc2 = this.ctx.createOscillator();
    this.rumbleOsc2.type = 'triangle';
    this.rumbleOsc2.frequency.setValueAtTime(55, this.ctx.currentTime);
    this.rumbleOsc2.detune.setValueAtTime(4, this.ctx.currentTime);

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(120, this.ctx.currentTime);

    this.rumbleGain = this.ctx.createGain();
    this.rumbleGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    this.rumbleOsc1.connect(this.filter);
    this.rumbleOsc2.connect(this.filter);
    this.filter.connect(this.rumbleGain);
    this.rumbleGain.connect(this.masterGain);

    this.rumbleOsc1.start();
    this.rumbleOsc2.start();
```
- **Lines 30-58**: Generates a deep sub-bass cosmic hum by combining a 38 Hz pure sine wave with a 55 Hz triangle wave detuned by 4 Hz, passing both through a 120 Hz resonant low-pass filter.

```typescript
  public updateWarpVelocity(normalizedVelocity: number) {
    if (!this.ctx || !this.warpDroneGain || !this.warpDroneOsc || this.isMuted) return;
    const clamped = Math.min(Math.max(normalizedVelocity, 0), 1);
    const now = this.ctx.currentTime;
    const targetGain = clamped * 0.25;
    const targetFreq = 80 + clamped * 400;

    this.warpDroneGain.gain.cancelScheduledValues(now);
    this.warpDroneGain.gain.linearRampToValueAtTime(targetGain, now + 0.1);
    this.warpDroneOsc.frequency.cancelScheduledValues(now);
    this.warpDroneOsc.frequency.linearRampToValueAtTime(targetFreq, now + 0.1);
  }
```
- **Lines 82-96**: Modulates the frequency ($80\text{ Hz} \to 480\text{ Hz}$) and volume of the hyperspace drone in real time based on scroll velocity and warp progress.

```typescript
  public playWarpJump() {
    // Generates high-frequency pitch sweep (100Hz -> 1200Hz)
    // Synthesizes a 1.2s white noise buffer routed through a dynamic bandpass sweep (300Hz -> 3500Hz -> 200Hz)
  }

  public playUIBeep(highPitch = false) {
    // Generates a 60ms exponential pitch chirp (440Hz -> 660Hz or 880Hz -> 1320Hz) for button feedback
  }
```

---

## 5. `src/components/canvas/BlackHoleShaders.ts`

```glsl
export const blackHoleVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;
```
- **Lines 1-8**: Standard 2D quad vertex shader passing normalized UVs $[0, 1]$ directly to the fragment shader.

```glsl
#define MAX_STEPS 100
#define STEP_SIZE 0.055
```
- **Lines 21-22**: Configures numerical ray integration parameters.

```glsl
// 3D Simplex noise and multi-octave fBM generator
float snoise(vec3 v) { ... }
float fbm(vec3 p) { ... }
```
- **Lines 24-95**: High-performance GLSL Simplex Noise and fractal Brownian Motion (fBM) generating organic plasma filaments in the accretion disk.

```glsl
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
  vec3 bhPos = uBlackHolePos;
  vec3 ro = vec3(0.0, 0.32, 4.0);
  ro.x += uMouse.x * 0.15;
  ro.y += uMouse.y * 0.1;
  
  vec3 lookAt = vec3(bhPos.x * 0.88, 0.0, 0.0);
  vec3 fwd = normalize(lookAt - ro);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), fwd));
  vec3 up = cross(fwd, right);
  vec3 rd = normalize(fwd * 1.55 + right * uv.x + up * uv.y);
```
- **Lines 110-125**: Calculates normalized camera ray direction $\vec{r}_d$ with elevated viewpoint and subtle mouse parallax offset.

```glsl
  float r_horizon = 0.65;
  float r_photon = 0.96;
  float r_disk_in = 1.15;
  float r_disk_out = 3.8;
  float mass = 1.75 * uGravitationalStrength;
```
- **Lines 127-131**: Defines black hole physical scales in geometric units ($r_{\text{horizon}}$, photon sphere radius, accretion boundaries, and mass $M$).

```glsl
  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 toBH = bhPos - rayPos;
    float dist = length(toBH);
    minDistance = min(minDistance, dist);

    if (dist < r_horizon) {
      hitHorizon = true;
      break;
    }

    float bendForce = (mass / (dist * dist * dist)) * stepSize * 0.68;
    rayDir = normalize(rayDir + toBH * bendForce);

    float diskDistY = abs(rayPos.y - bhPos.y);
    float diskDistR = length(rayPos.xz - bhPos.xz);

    if (diskDistR > r_disk_in && diskDistR < r_disk_out && diskDistY < 0.2) {
      float radialNorm = (diskDistR - r_disk_in) / (r_disk_out - r_disk_in);
      float orbitalAngle = atan(rayPos.z - bhPos.z, rayPos.x - bhPos.x);
      float keplerSpeed = (2.2 / pow(diskDistR, 1.5)) * (uTime * 0.9 * uSpinSpeed);
      
      vec3 noiseCoords = vec3(
        cos(orbitalAngle + keplerSpeed) * diskDistR * 1.6,
        sin(orbitalAngle + keplerSpeed) * diskDistR * 1.6,
        diskDistY * 6.5 + uTime * 0.2
      );
      float turbulence = fbm(noiseCoords);
      
      vec3 diskVelocity = normalize(vec3(-(rayPos.z - bhPos.z), 0.0, rayPos.x - bhPos.x));
      float dopplerFactor = dot(rayDir, diskVelocity);
      float beaming = clamp(1.0 + dopplerFactor * 0.82, 0.18, 2.8);

      float sampleDensity = pow(1.0 - radialNorm, 1.85) * exp(-pow(diskDistY / 0.065, 2.0)) * (0.6 + turbulence * 0.8) * beaming * 0.22;
      vec3 plasmaColor = mix(uDiskColor1, uDiskColor2, pow(radialNorm, 0.72));
      plasmaColor = mix(plasmaColor, vec3(1.0, 0.98, 0.95), pow(1.0 - radialNorm, 3.2) * 0.75);
      
      totalColor += plasmaColor * sampleDensity * (1.0 - totalDensity);
      totalDensity += sampleDensity;
      if (totalDensity >= 0.98) break;
    }

    stepSize = clamp(dist * 0.042, 0.028, 0.15);
    rayPos += rayDir * stepSize;
    if (dist > 14.0) break;
  }
```
- **Lines 141-197**: The core raymarching loop:
  1. Measures distance to the singularity center.
  2. Absorbs rays crossing the event horizon shadow ($r < r_{\text{horizon}}$).
  3. Bends ray trajectories according to the Einstein deflection equation.
  4. Volumetrically accumulates the equatorial accretion disk with Keplerian shear ($\omega \propto r^{-1.5}$) and relativistic Doppler beaming.
  5. Dynamically adapts step size for maximum performance and sub-pixel accuracy.

```glsl
  // Photon Ring Halo & Einstein Ring Glow
  float photonGlow = 0.0;
  if (!hitHorizon) {
    float distToPhoton = abs(minDistance - r_photon);
    photonGlow = exp(-distToPhoton * 9.0) * 0.92 + exp(-distToPhoton * 52.0) * 1.5;
  }

  vec3 finalColor = totalColor + (uPhotonColor * photonGlow) + backgroundStars * (1.0 - clamp(totalDensity * 1.15, 0.0, 1.0));
  finalColor = finalColor / (finalColor + vec3(1.0)); // Reinhard tone mapping
  finalColor = pow(finalColor, vec3(0.94)); // Contrast gamma
  gl_FragColor = vec4(finalColor, 1.0);
```
- **Lines 199-232**: Synthesizes the razor-sharp photon ring halo, merges background starfield light, applies Reinhard HDR tone mapping, and outputs the final pixel color.

---

## 6. `src/components/canvas/BlackHoleCanvas.tsx`

- Creates a full-viewport WebGLRenderer instance with power preference set to `high-performance`.
- Constructs a full-screen `PlaneGeometry(2, 2)` mapped with the custom `ShaderMaterial`.
- Positions the black hole center at $X = +0.85$ on desktop (shifting to $+0.35$ on mobile).
- Tracks mouse movements and continuously computes real-time frames-per-second (FPS) metrics.

---

## 7. `src/components/canvas/HaoqiHyperspaceTunnel.tsx`

- Initializes a Three.js `LineSegments` buffer geometry containing **4,500 streak lines** ($9,000$ vertices).
- Renders radial speed-lines using an additive blending material with colors (cyan, chartreuse `#c0fe04`, magenta, electric blue, and active theme accents).
- Maps the scroll progress directly to depth expansion ($z$), radial perspective flare ($r$), and backward streak elongation ($L \propto p^{1.5}$).

---

## 8. `src/components/canvas/Interactive3DCursor.tsx`

- Builds a compact 3D group consisting of:
  - An `OctahedronGeometry(0.18)` with physical transmission (glass prism core).
  - An `OctahedronGeometry(0.20)` with white wireframe outline.
  - A `TorusGeometry(0.28, 0.008)` rotating gyroscope ring.
  - A `Points` history buffer forming a 24-point luminescent particle trail.
- Unprojects screen cursor coordinates $(X, Y)$ into 3D world space.
- Dynamically tilts and rotates the 3D diamond along its axes in response to vertical scroll velocity ($dy/dt$).
- Automatically enlarges ($1.0 \to 1.3$) when hovering over interactive elements (buttons, links, inputs).

---

## 9. `src/components/sections/StickyHyperspaceScroll.tsx`

- Implements a `500vh` scroll track containing a `sticky top-0 h-screen` child.
- Normalizes scroll position into progress $p \in [0, 1]$ via `getBoundingClientRect()`.
- Renders the 3-stage typography reveals:
  - **Stage 1 (0% - 35%)**: `"INNOVATE WITH PURPOSE"`
  - **Stage 2 (35% - 72%)**: `"INNOVATE WITH A HUMAN TOUCH"`
  - **Stage 3 (72% - 100%)**: `"FUTURE-FIRST ALWAYS"`
- Includes the pixelated chartreuse (`#c0fe04`) retro cursor badge and smooth top/bottom gradient fades.

---

## 10. `src/components/hud/CosmicHUD.tsx`

- Top header:
  - Displays the `EVENT_HORIZON` logo with pulsing singularity icon.
  - Desktop navigation pills with interactive dotted borders (`retro-dotted`).
  - `THEME[X]` dropdown allowing real-time switching between *Gargantua Gold*, *Cygnus Cyan*, *Ultraviolet Void*, and *Supernova Crimson*.
  - `SOUND[|]` audio mute/unmute button.
- Bottom telemetry bar:
  - Real-time cursor coordinates (`0001 X 0001 Y`).
  - UTC Stardate clock.
  - Live active section indicator and FPS counter.

---

## 11. `src/components/sections/HeroSection.tsx`

- Left 60% viewport alignment framing the 3D black hole on the right.
- Status badge: `"EVENT HORIZON PROTOCOL ENGAGED // CLASS IV SINGULARITY"`.
- Large bold typography: `"ENGINEERING AT THE EDGE OF REALITY"`.
- Action buttons: `"EXPLORE ARCHIVE"` and `"TRANSMIT MESSAGE"`.
- Metric telemetry cards: Experience (8+ Years), Render Engine (60 FPS), Missions Deployed (40+ Apps).

---

## 12. `src/components/sections/AboutSection.tsx`

- Biography describing experience in WebGL graphics, distributed systems, and AI engineering.
- **Interactive GLSL Physics Sliders**:
  - *Accretion Vortex Velocity ($\Omega$)*: Updates shader uniform `uSpinSpeed` in real time.
  - *Gravitational Lensing Mass ($GM/c^2$)*: Updates shader uniform `uGravitationalStrength` in real time.

---

## 13. `src/components/sections/ProjectsSection.tsx` & `ProjectModal.tsx`

- Houses 5 deep-tech projects: *Gargantua N-Body Engine*, *Singularity Multi-Agent OS*, *Hyperdrive Terminal*, *Aetheria 3D Metaverse*, and *ExoSearch Spectro Classifier*.
- Interactive category filtering pills: *All*, *3D / Graphics*, *AI & Systems*, *FinTech & Web3*.
- `ProjectModal.tsx`: Comprehensive modal overlay with mission architecture breakdowns, metrics grid, tech tags, and source/deployment links.

---

## 14. `src/components/sections/SkillsSection.tsx`

- Categorized technical proficiencies:
  - *Graphics, Shaders & Frontend* (Three.js, GLSL, React 19, TypeScript, WebGPU).
  - *Backend & Distributed Systems* (Node.js, Python, Rust, PostgreSQL, WebSockets).
  - *AI, Machine Learning & Compute* (Gemini API, Vector DBs, PyTorch).
  - *Architecture & Creative Tooling* (Docker, Kubernetes, CI/CD, Blender 3D).

---

## 15. `src/components/sections/ExperienceSection.tsx`

- Chronological timeline of career missions (*Nexus Spatial Dynamics*, *Vortex Quantum Labs*, *Astral Media Systems*).
- Pulsing timeline nodes and achievement telemetry.

---

## 16. `src/components/sections/ContactSection.tsx`

- Interactive encrypted transmission terminal with validation and simulated quantum dispatch animation.
- One-click copy email button and direct links to GitHub, LinkedIn, and Twitter/X.

---

## 17. `src/App.tsx`

- Global coordinator uniting:
  - `useLenis()` momentum scroll engine.
  - `BlackHoleCanvas` background layer.
  - `Interactive3DCursor` cursor overlay.
  - `HaoqiHyperspaceTunnel` radial streak system.
  - `CosmicHUD` telemetry bar.
  - All portfolio section components and modals.
- Automatically synchronizes CSS custom variables (`--theme-accent`, `--theme-bg-glow`) with the active theme.
