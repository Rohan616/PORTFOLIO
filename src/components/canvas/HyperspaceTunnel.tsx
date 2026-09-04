import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface HyperspaceTunnelProps {
  warpSpeed: number; // 0 to 1
  isWarpJumping: boolean;
  accentColor: string;
  enabled: boolean;
}

export const HyperspaceTunnel: React.FC<HyperspaceTunnelProps> = ({
  warpSpeed,
  isWarpJumping,
  accentColor,
  enabled,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Clean, sleek relativistic warp lines
    const count = 2500;
    const positions = new Float32Array(count * 6);
    const colors = new Float32Array(count * 6);
    const speeds = new Float32Array(count);
    const radiuses = new Float32Array(count);
    const angles = new Float32Array(count);

    const baseColor = new THREE.Color(accentColor);
    const whiteColor = new THREE.Color(0xffffff);
    const cyanColor = new THREE.Color(0x60a5fa);

    for (let i = 0; i < count; i++) {
      const radius = 1.8 + Math.random() * 20.0;
      const angle = Math.random() * Math.PI * 2;
      const z = -Math.random() * 180.0;
      const speed = 0.8 + Math.random() * 1.2;

      radiuses[i] = radius;
      angles[i] = angle;
      speeds[i] = speed;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      positions[i * 6 + 0] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;

      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y;
      positions[i * 6 + 5] = z - 0.5;

      const mixVal = Math.random();
      const col = mixVal > 0.6 ? whiteColor : mixVal > 0.3 ? baseColor : cyanColor;

      colors[i * 6 + 0] = col.r;
      colors[i * 6 + 1] = col.g;
      colors[i * 6 + 2] = col.b;
      colors[i * 6 + 3] = col.r * 0.1;
      colors[i * 6 + 4] = col.g * 0.1;
      colors[i * 6 + 5] = col.b * 0.1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });

    const lines = new THREE.LineSegments(geometry, material);
    scene.add(lines);

    // Subtle relativistic shockwave rings
    const ringGeo = new THREE.RingGeometry(1.2, 1.4, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentColor),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const rings: THREE.Mesh[] = [];
    for (let r = 0; r < 6; r++) {
      const ring = new THREE.Mesh(ringGeo, ringMat.clone());
      ring.position.z = -r * 25;
      scene.add(ring);
      rings.push(ring);
    }

    let currentOpacity = 0;
    let smoothSpeed = 0;

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);

      if (!enabled && !isWarpJumping) {
        if (currentOpacity > 0.005) {
          currentOpacity *= 0.85;
          material.opacity = currentOpacity;
          renderer.render(scene, camera);
        } else {
          renderer.clear();
        }
        return;
      }

      const targetSpeed = isWarpJumping ? 1.0 : warpSpeed;
      smoothSpeed += (targetSpeed - smoothSpeed) * 0.15;

      const targetOpacity = smoothSpeed > 0.02 ? Math.min(smoothSpeed * 1.4, 0.95) : 0;
      currentOpacity += (targetOpacity - currentOpacity) * 0.12;
      material.opacity = currentOpacity;

      if (currentOpacity > 0.01) {
        const posAttr = geometry.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;

        const effectiveSpeed = 0.8 + smoothSpeed * 22.0;
        const streakLength = 1.0 + smoothSpeed * 32.0;

        for (let i = 0; i < count; i++) {
          const idx = i * 6;
          let z = posArray[idx + 2];

          z += speeds[i] * effectiveSpeed;

          if (z > 15.0) {
            z = -160.0;
            const x = Math.cos(angles[i]) * radiuses[i];
            const y = Math.sin(angles[i]) * radiuses[i];
            posArray[idx + 0] = x;
            posArray[idx + 1] = y;
            posArray[idx + 3] = x;
            posArray[idx + 4] = y;
          }

          posArray[idx + 2] = z;
          posArray[idx + 5] = z - streakLength;
        }
        posAttr.needsUpdate = true;

        rings.forEach((ring) => {
          ring.position.z += effectiveSpeed * 0.75;
          if (ring.position.z > 5) ring.position.z = -120;
          const rm = ring.material as THREE.MeshBasicMaterial;
          rm.opacity = Math.max(0, smoothSpeed * 0.4 * (1.0 - Math.abs(ring.position.z) / 120));
          const sc = 1 + Math.abs(ring.position.z) * 0.06;
          ring.scale.set(sc, sc, 1);
        });

        if (isWarpJumping) {
          camera.fov = 60 + smoothSpeed * 30;
          camera.updateProjectionMatrix();
        } else if (camera.fov > 60) {
          camera.fov += (60 - camera.fov) * 0.08;
          camera.updateProjectionMatrix();
        }

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
  }, [accentColor, isWarpJumping, warpSpeed, enabled]);

  return (
    <div
      ref={mountRef}
      className={`fixed inset-0 pointer-events-none z-10 transition-opacity duration-300 ${
        (enabled && warpSpeed > 0.02) || isWarpJumping ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
};
