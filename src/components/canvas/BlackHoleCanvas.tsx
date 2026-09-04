import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { blackHoleVertexShader, blackHoleFragmentShader } from './BlackHoleShaders';
import { ThemeConfig } from '../../types';

interface BlackHoleCanvasProps {
  theme: ThemeConfig;
  warpSpeed: number; // 0 to 1
  spinSpeed: number;
  gravitationalStrength: number;
  onFpsUpdate?: (fps: number) => void;
}

export const BlackHoleCanvas: React.FC<BlackHoleCanvasProps> = ({
  theme,
  warpSpeed,
  spinSpeed,
  gravitationalStrength,
  onFpsUpdate,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<{
    uTime: { value: number };
    uResolution: { value: THREE.Vector2 };
    uMouse: { value: THREE.Vector2 };
    uDiskColor1: { value: THREE.Color };
    uDiskColor2: { value: THREE.Color };
    uPhotonColor: { value: THREE.Color };
    uWarpSpeed: { value: number };
    uSpinSpeed: { value: number };
    uGravitationalStrength: { value: number };
    uBlackHolePos: { value: THREE.Vector3 };
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: false,
      stencil: false,
      depth: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Calculate Right-Side Offset (Desktop: black hole center at ~+0.75 in normalized view coordinates so right half peeks out)
    const isMobile = width < 768;
    const bhOffsetX = isMobile ? 0.35 : 0.85;

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uDiskColor1: { value: new THREE.Color(theme.diskColor1) },
      uDiskColor2: { value: new THREE.Color(theme.diskColor2) },
      uPhotonColor: { value: new THREE.Color(0xffffff) },
      uWarpSpeed: { value: warpSpeed },
      uSpinSpeed: { value: spinSpeed },
      uGravitationalStrength: { value: gravitationalStrength },
      uBlackHolePos: { value: new THREE.Vector3(bhOffsetX, 0.0, 0.0) },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader: blackHoleVertexShader,
      fragmentShader: blackHoleFragmentShader,
      uniforms: uniforms,
      depthWrite: false,
      depthTest: false,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    // Mouse Tracking for subtle gravitational parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Render loop & FPS measurement
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();
    let animId: number;

    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      if (uniformsRef.current) {
        uniformsRef.current.uTime.value = elapsed;
        uniformsRef.current.uMouse.value.set(currentMouseX, currentMouseY);
      }

      renderer.render(scene, camera);

      // FPS tracking
      frameCount++;
      const now = performance.now();
      if (now - lastFpsUpdate >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
        if (onFpsUpdate) onFpsUpdate(fps);
        frameCount = 0;
        lastFpsUpdate = now;
      }
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      if (uniformsRef.current) {
        uniformsRef.current.uResolution.value.set(w, h);
        const mobile = w < 768;
        uniformsRef.current.uBlackHolePos.value.x = mobile ? 0.35 : 0.85;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      material.dispose();
      quad.geometry.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update theme colors when changed
  useEffect(() => {
    if (uniformsRef.current) {
      uniformsRef.current.uDiskColor1.value.set(theme.diskColor1);
      uniformsRef.current.uDiskColor2.value.set(theme.diskColor2);
    }
  }, [theme]);

  // Update real-time physics parameters
  useEffect(() => {
    if (uniformsRef.current) {
      uniformsRef.current.uWarpSpeed.value = warpSpeed;
      uniformsRef.current.uSpinSpeed.value = spinSpeed;
      uniformsRef.current.uGravitationalStrength.value = gravitationalStrength;
    }
  }, [warpSpeed, spinSpeed, gravitationalStrength]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        maskImage: 'radial-gradient(ellipse 100% 100% at 75% 50%, black 70%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 75% 50%, black 70%, transparent 100%)'
      }}
    />
  );
};
