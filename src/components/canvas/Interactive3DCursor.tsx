import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { ThemeConfig } from '../../types';

interface Interactive3DCursorProps {
  theme: ThemeConfig;
}

export const Interactive3DCursor: React.FC<Interactive3DCursorProps> = ({ theme }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only initialize 3D cursor on desktop / mouse devices (avoids mobile clutter/touch conflicts)
    if (window.innerWidth < 1024 || (window.matchMedia && !window.matchMedia('(hover: hover)').matches)) {
      return;
    }

    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();

    // 1. Compact 3D Geometric Core
    const coreGeo = new THREE.OctahedronGeometry(0.18, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(theme.accentColor),
      emissive: new THREE.Color(theme.diskColor1),
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      thickness: 0.3,
      ior: 1.5,
      transparent: true,
      opacity: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // 2. Wireframe Accent Outline
    const wireGeo = new THREE.OctahedronGeometry(0.20, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xffffff),
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    group.add(wireMesh);

    // 3. Compact Gyro Ring
    const ringGeo = new THREE.TorusGeometry(0.28, 0.008, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(theme.accentColor),
      transparent: true,
      opacity: 0.7,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    group.add(ringMesh);

    // 4. Point Light
    const cursorLight = new THREE.PointLight(theme.accentColor, 1.0, 4);
    group.add(cursorLight);

    scene.add(group);

    // Particle Trail Buffer
    const trailCount = 24;
    const trailPositions = new Float32Array(trailCount * 3);
    const trailColors = new Float32Array(trailCount * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));

    const trailMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const trailPoints = new THREE.Points(trailGeo, trailMat);
    scene.add(trailPoints);

    const trailHistory: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < trailCount; i++) {
      trailHistory.push({ x: 0, y: 0, z: 0 });
    }

    let mouseScreenX = window.innerWidth / 2;
    let mouseScreenY = window.innerHeight / 2;
    let targetWorldX = 0;
    let targetWorldY = 0;
    let currentWorldX = 0;
    let currentWorldY = 0;
    let currentScale = 1.0;
    let targetScale = 1.0;

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const updateTargetWorld = (clientX: number, clientY: number) => {
      const ndcX = (clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(clientY / window.innerHeight) * 2 + 1;
      const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
      vec.unproject(camera);
      vec.sub(camera.position).normalize();
      const distance = -camera.position.z / vec.z;
      const pos = camera.position.clone().add(vec.multiplyScalar(distance));
      targetWorldX = pos.x;
      targetWorldY = pos.y;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseScreenX = e.clientX;
      mouseScreenY = e.clientY;
      updateTargetWorld(e.clientX, e.clientY);

      const target = e.target as HTMLElement | null;
      const isInteractive = target?.closest('button, a, input, textarea, .retro-dotted, [role="button"]');
      targetScale = isInteractive ? 1.3 : 1.0;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const dy = currentScrollY - lastScrollY;
      scrollVelocity = dy * 0.08;
      lastScrollY = currentScrollY;
      updateTargetWorld(mouseScreenX, mouseScreenY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock.getDelta();
      const time = clock.getElapsedTime();

      currentWorldX += (targetWorldX - currentWorldX) * 0.16;
      currentWorldY += (targetWorldY - currentWorldY) * 0.16;
      currentScale += (targetScale - currentScale) * 0.12;

      group.position.set(currentWorldX, currentWorldY, 0);
      group.scale.set(currentScale, currentScale, currentScale);

      scrollVelocity *= 0.92;
      group.rotation.x = time * 0.8 + scrollVelocity * 0.25;
      group.rotation.y = time * 1.2 + scrollVelocity * 0.15;
      group.rotation.z += scrollVelocity * 0.1;

      ringMesh.rotation.x = time * 2.0;
      ringMesh.rotation.y = time * 1.5;

      trailHistory.unshift({ x: currentWorldX, y: currentWorldY, z: 0 });
      trailHistory.pop();

      const posArray = trailGeo.attributes.position.array as Float32Array;
      const colArray = trailGeo.attributes.color.array as Float32Array;
      const themeCol = new THREE.Color(theme.accentColor);

      for (let i = 0; i < trailCount; i++) {
        posArray[i * 3 + 0] = trailHistory[i].x;
        posArray[i * 3 + 1] = trailHistory[i].y;
        posArray[i * 3 + 2] = trailHistory[i].z;

        const ratio = 1 - i / trailCount;
        colArray[i * 3 + 0] = themeCol.r * ratio;
        colArray[i * 3 + 1] = themeCol.g * ratio;
        colArray[i * 3 + 2] = themeCol.b * ratio;
      }
      trailGeo.attributes.position.needsUpdate = true;
      trailGeo.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      trailGeo.dispose();
      trailMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden hidden lg:block"
    />
  );
};
