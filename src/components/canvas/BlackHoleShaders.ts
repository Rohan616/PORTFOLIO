/**
 * Black Hole Raymarching & Gravitational Lensing GLSL Shader
 * Authentic Interstellar Gargantua-style rendering:
 * - Central pitch black Schwarzschild event horizon void
 * - Front horizontal equatorial accretion disk
 * - Top & bottom gravitational lensing arcs (back disk bent over top and under bottom)
 * - Razor-sharp photon sphere ring around the event horizon
 * - Relativistic Doppler beaming (intense luminance on approaching side)
 * - Turbulent Keplerian plasma fluid dynamics
 */

export const blackHoleVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

export const blackHoleFragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uDiskColor1;
uniform vec3 uDiskColor2;
uniform vec3 uPhotonColor;
uniform float uWarpSpeed;
uniform float uSpinSpeed;
uniform float uGravitationalStrength;
uniform vec3 uBlackHolePos;

varying vec2 vUv;

#define PI 3.14159265359
#define MAX_STEPS 100
#define STEP_SIZE 0.055

// 3D Simplex noise helper
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 4; i++) {
    value += amplitude * abs(snoise(p * frequency));
    frequency *= 2.1;
    amplitude *= 0.48;
  }
  return value;
}

// Background Starfield & Deep Space Dust
vec3 getStarfield(vec3 rayDir) {
  vec3 norm = normalize(rayDir);
  float star1 = pow(clamp(snoise(norm * 150.0), 0.0, 1.0), 20.0) * 1.8;
  float star2 = pow(clamp(snoise(norm * 70.0 + vec3(42.1)), 0.0, 1.0), 26.0) * 2.5;
  
  float neb = fbm(norm * 2.0 + vec3(1.0, 0.5, 2.0)) * 0.08;
  vec3 nebColor = mix(vec3(0.01, 0.02, 0.04), vec3(0.05, 0.02, 0.07), neb * 3.0);
  
  return nebColor + vec3(star1 + star2 * 0.85, star1 + star2 * 0.9, star1 + star2);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);

  // Black hole center in world coordinates (anchored on right side)
  vec3 bhPos = uBlackHolePos;
  
  // Camera elevated ~12 degrees looking at the black hole
  vec3 ro = vec3(0.0, 0.32, 4.0);
  
  // Subtle interactive mouse parallax
  ro.x += uMouse.x * 0.15;
  ro.y += uMouse.y * 0.1;
  
  vec3 lookAt = vec3(bhPos.x * 0.88, 0.0, 0.0);
  vec3 fwd = normalize(lookAt - ro);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), fwd));
  vec3 up = cross(fwd, right);
  
  // Ray direction
  vec3 rd = normalize(fwd * 1.55 + right * uv.x + up * uv.y);

  // Black Hole Physical Scales (Gargantua proportions)
  float r_horizon = 0.65; // Central event horizon shadow
  float r_photon = 0.96;  // Sharp photon ring halo
  float r_disk_in = 1.15; // Inner stable accretion boundary
  float r_disk_out = 3.8; // Outer accretion disk boundary
  float mass = 1.75 * uGravitationalStrength;

  vec3 rayPos = ro;
  vec3 rayDir = rd;
  
  vec3 totalColor = vec3(0.0);
  float totalDensity = 0.0;
  bool hitHorizon = false;
  float minDistance = 1000.0;
  
  float stepSize = STEP_SIZE;

  // Numerical Geodesic Raymarcher
  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 toBH = bhPos - rayPos;
    float dist = length(toBH);
    minDistance = min(minDistance, dist);

    // If ray plunges into event horizon: swallowed by singularity (pitch black)
    if (dist < r_horizon) {
      hitHorizon = true;
      break;
    }

    // Gravitational Bending Force: F ~ 3GM / r^3
    float bendForce = (mass / (dist * dist * dist)) * stepSize * 0.68;
    rayDir = normalize(rayDir + toBH * bendForce);

    // Sample Equatorial Accretion Disk (plane Y = bhPos.y)
    float diskDistY = abs(rayPos.y - bhPos.y);
    float diskDistR = length(rayPos.xz - bhPos.xz);

    if (diskDistR > r_disk_in && diskDistR < r_disk_out && diskDistY < 0.2) {
      float radialNorm = (diskDistR - r_disk_in) / (r_disk_out - r_disk_in);
      
      // Keplerian orbital velocity: omega ~ r^(-1.5)
      float orbitalAngle = atan(rayPos.z - bhPos.z, rayPos.x - bhPos.x);
      float keplerSpeed = (2.2 / pow(diskDistR, 1.5)) * (uTime * 0.9 * uSpinSpeed);
      
      // Dynamic plasma turbulence coordinates
      vec3 noiseCoords = vec3(
        cos(orbitalAngle + keplerSpeed) * diskDistR * 1.6,
        sin(orbitalAngle + keplerSpeed) * diskDistR * 1.6,
        diskDistY * 6.5 + uTime * 0.2
      );
      
      float turbulence = fbm(noiseCoords);
      
      // Radial brightness intensity profile
      float radialProfile = pow(1.0 - radialNorm, 1.85) * smoothstep(0.0, 0.12, radialNorm);
      // Vertical gaussian falloff
      float verticalProfile = exp(-pow(diskDistY / 0.065, 2.0));
      
      // Relativistic Doppler Beaming
      // Velocity vector of rotating disk in XZ plane (counter-clockwise)
      vec3 diskVelocity = normalize(vec3(-(rayPos.z - bhPos.z), 0.0, rayPos.x - bhPos.x));
      float dopplerFactor = dot(rayDir, diskVelocity);
      
      // Doppler boost: approaching plasma (left side) is amplified, receding is dimmed
      float beaming = 1.0 + dopplerFactor * 0.82;
      beaming = clamp(beaming, 0.18, 2.8);

      float sampleDensity = radialProfile * verticalProfile * (0.6 + turbulence * 0.8) * beaming * 0.22;
      
      // Hot plasma color gradient
      vec3 plasmaColor = mix(uDiskColor1, uDiskColor2, pow(radialNorm, 0.72));
      plasmaColor = mix(plasmaColor, vec3(1.0, 0.98, 0.95), pow(1.0 - radialNorm, 3.2) * 0.75);
      
      totalColor += plasmaColor * sampleDensity * (1.0 - totalDensity);
      totalDensity += sampleDensity;
      
      if (totalDensity >= 0.98) break;
    }

    // Adaptive step size: finer steps near horizon for sharp lensing, larger far away
    stepSize = clamp(dist * 0.042, 0.028, 0.15);
    rayPos += rayDir * stepSize;

    if (dist > 14.0) break;
  }

  // Photon Sphere Halo Ring around the central Event Horizon
  float photonGlow = 0.0;
  if (!hitHorizon) {
    float distToPhoton = abs(minDistance - r_photon);
    photonGlow = exp(-distToPhoton * 9.0) * 0.92;
    // Ultra razor-thin photon ring
    float thinRing = exp(-distToPhoton * 52.0) * 1.5;
    photonGlow += thinRing;
  } else {
    // Edge halo immediately outside the shadow
    float edgeGlow = smoothstep(r_horizon * 0.96, r_horizon * 1.14, minDistance);
    photonGlow = pow(edgeGlow, 7.5) * 0.5;
  }

  // Background deep space stars (gravitationally lensed around Einstein ring)
  vec3 backgroundStars = vec3(0.0);
  if (!hitHorizon) {
    backgroundStars = getStarfield(rayDir);
    float lensAmp = 1.0 + (mass / max(minDistance, 0.75)) * 0.5;
    backgroundStars *= lensAmp;
  }

  // Combine layers: Accretion Disk + Photon Ring + Deep Space
  vec3 finalColor = totalColor + (uPhotonColor * photonGlow) + backgroundStars * (1.0 - clamp(totalDensity * 1.15, 0.0, 1.0));

  // Hyperspace warp flash overlay
  if (uWarpSpeed > 0.01) {
    vec2 warpUv = uv - vec2(bhPos.x * 0.35, 0.0);
    float radialDist = length(warpUv);
    float warpGlow = exp(-radialDist * 2.2) * uWarpSpeed * 0.4;
    finalColor += uDiskColor1 * warpGlow;
  }

  // High-dynamic range tone mapping & contrast
  finalColor = finalColor / (finalColor + vec3(1.0));
  finalColor = pow(finalColor, vec3(0.94));

  gl_FragColor = vec4(finalColor, 1.0);
}
`;
