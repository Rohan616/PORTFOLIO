import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { ThemeConfig } from '../../types';

interface HaoqiHyperspaceTunnelProps {
  progress: number;
  active: boolean;
  theme: ThemeConfig;
}

export const HaoqiHyperspaceTunnel: React.FC<HaoqiHyperspaceTunnelProps> = ({
  progress,
  active,
  theme,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4500 Radial Streak Lines radiating from center into depth
    const count = 4500;
    const positions = new Float32Array(count * 6);
    const colors = new Float32Array(count * 6);
    
    const angles = new Float32Array(count);
    const baseRadiuses = new Float32Array(count);
    const baseDepths = new Float32Array(count);
    const speeds = new Float32Array(count);

    // Theme-harmonized neon laser palette (preserving exact multi-color aesthetic)
    const palette = [
      new THREE.Color('#00f2fe'), // bright cyan
      new THREE.Color('#0066ff'), // electric blue
      new THREE.Color('#c0fe04'), // neon lime / chartreuse
      new THREE.Color('#d946ef'), // vivid magenta / purple
      new THREE.Color('#ffffff'), // pure white
      new THREE.Color(theme.accentColor), // dynamic active theme accent
      new THREE.Color(theme.diskColor1), // dynamic theme plasma glow
    ];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.2 + Math.pow(Math.random(), 1.5) * 14.0;
      const z = -Math.random() * 120.0;
      const speed = 0.6 + Math.random() * 1.4;

      angles[i] = angle;
      baseRadiuses[i] = r;
      baseDepths[i] = z;
      speeds[i] = speed;

      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;

      // Vertex 0 (head)
      positions[i * 6 + 0] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;

      // Vertex 1 (tail)
      positions[i * 6 + 3] = x * 1.05;
      positions[i * 6 + 4] = y * 1.05;
      positions[i * 6 + 5] = z - 2.0;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 6 + 0] = col.r;
      colors[i * 6 + 1] = col.g;
      colors[i * 6 + 2] = col.b;

      colors[i * 6 + 3] = col.r * 0.35;
      colors[i * 6 + 4] = col.g * 0.35;
      colors[i * 6 + 5] = col.b * 0.35;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      linewidth: 1,
    });

    const lineSystem = new THREE.LineSegments(geometry, material);
    scene.add(lineSystem);

    let smoothProgress = 0;
    let smoothOpacity = 0;

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);

      const targetProgress = progressRef.current;
      smoothProgress += (targetProgress - smoothProgress) * 0.12;

      const isVisible = targetProgress > 0.01 && targetProgress < 0.99;
      const targetOpacity = isVisible ? Math.min(smoothProgress * 1.8, 1.0) : 0.0;
      smoothOpacity += (targetOpacity - smoothOpacity) * 0.1;
      material.opacity = smoothOpacity;

      if (smoothOpacity > 0.01) {
        const posAttr = geometry.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;

        const streakLength = 1.0 + Math.pow(smoothProgress, 1.5) * 55.0;
        const radialExpansion = 1.0 + smoothProgress * 1.8;

        for (let i = 0; i < count; i++) {
          const idx = i * 6;
          let z = baseDepths[i] + (smoothProgress * 150.0 * speeds[i]);

          z = ((z % 140.0) + 140.0) % 140.0 - 130.0;

          const perspectiveDist = 1.0 + (z + 130.0) * 0.02 * radialExpansion;
          const r = baseRadiuses[i] * perspectiveDist;
          const angle = angles[i] + smoothProgress * 0.4;

          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;

          posArray[idx + 0] = x;
          posArray[idx + 1] = y;
          posArray[idx + 2] = z;

          posArray[idx + 3] = x * 1.08;
          posArray[idx + 4] = y * 1.08;
          posArray[idx + 5] = z - streakLength;
        }

        posAttr.needsUpdate = true;

        camera.fov = 65 + smoothProgress * 25.0;
        camera.updateProjectionMatrix();

        lineSystem.rotation.z = smoothProgress * 0.6;

        renderer.render(scene, camera);
      } else {
        renderer.clear();
      }
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      className={`fixed inset-0 pointer-events-none z-10 transition-opacity duration-300 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
};
