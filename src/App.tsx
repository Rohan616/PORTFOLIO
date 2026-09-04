import React, { useState, useEffect, useCallback } from 'react';
import { ThemeColor, TelemetryData, Project } from './types';
import { cosmicThemes } from './constants/themes';
import { useLenis } from './hooks/useLenis';
import { BlackHoleCanvas } from './components/canvas/BlackHoleCanvas';
import { HaoqiHyperspaceTunnel } from './components/canvas/HaoqiHyperspaceTunnel';
import { Interactive3DCursor } from './components/canvas/Interactive3DCursor';
import { CosmicHUD } from './components/hud/CosmicHUD';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { StickyHyperspaceScroll } from './components/sections/StickyHyperspaceScroll';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { ContactSection } from './components/sections/ContactSection';
import { ProjectModal } from './components/ProjectModal';
import { PortfolioChatbox } from './components/chat/PortfolioChatbox';

export function App() {
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeColor>('gargantua');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [warpSpeed, setWarpSpeed] = useState<number>(0);
  const [hyperspaceProgress, setHyperspaceProgress] = useState<number>(0);
  const [isWarpJumping] = useState<boolean>(false);
  const [spinSpeed, setSpinSpeed] = useState<number>(1.0);
  const [gravitationalStrength, setGravitationalStrength] = useState<number>(1.6);
  const [fps, setFps] = useState<number>(60);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Initialize Lenis smooth momentum scrolling (haoqi.design engine)
  const lenisRef = useLenis(true);

  const currentTheme = cosmicThemes.find((t) => t.id === selectedThemeId) || cosmicThemes[0];

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-accent', currentTheme.accentColor);
    document.documentElement.style.setProperty('--theme-bg-glow', currentTheme.bgGlow);
  }, [currentTheme]);

  // Section observer
  useEffect(() => {
    const sectionIds = ['hero', 'about', 'projects', 'skills', 'hyperspace-scroll-track', 'experience', 'contact'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id === 'hyperspace-scroll-track' ? 'warp' : id);
          }
        },
        { threshold: 0.2 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const handleNavigate = useCallback((sectionId: string) => {
    const targetId = sectionId === 'warp' ? 'hyperspace-scroll-track' : sectionId;
    const el = document.getElementById(targetId);
    if (el) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el, { duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [lenisRef]);

  // Handler for Sticky Hyperspace Scroll progress
  const handleWarpProgress = useCallback((progress: number, warpIntensity: number) => {
    setHyperspaceProgress(progress);
    setWarpSpeed(warpIntensity);
  }, []);

  const telemetry: TelemetryData = {
    fps,
    scrollVelocity: warpSpeed,
    warpSpeed: isWarpJumping ? 0.98 : warpSpeed,
    eventHorizonDistance: 4.2,
    relativisticGamma: 1.0 / Math.sqrt(Math.max(0.01, 1 - Math.pow(0.12 + warpSpeed * 0.85, 2))),
    anomalyDetected: true,
    isWarpJumping,
  };

  const isTunnelActive = isWarpJumping || (hyperspaceProgress > 0.005 && hyperspaceProgress < 0.995);

  return (
    <div className="relative min-h-screen bg-[#02040a] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 cursor-default">
      
      {/* 3D WebGL Photorealistic Black Hole Canvas (Right-anchored, Gargantua geometry) */}
      <BlackHoleCanvas
        theme={currentTheme}
        warpSpeed={warpSpeed}
        spinSpeed={spinSpeed}
        gravitationalStrength={gravitationalStrength}
        onFpsUpdate={setFps}
      />

      {/* 3D Interactive Holographic Glass Cursor with scroll-driven tumbling */}
      <Interactive3DCursor
        theme={currentTheme}
      />

      {/* 3D WebGL Haoqi Hyperspace Radial Streak Tunnel (harmonized with theme) */}
      <HaoqiHyperspaceTunnel
        progress={hyperspaceProgress}
        active={isTunnelActive}
        theme={currentTheme}
      />

      {/* Sci-Fi HUD Navigation & Telemetry (haoqi.design aesthetics) */}
      <CosmicHUD
        telemetry={telemetry}
        activeSection={activeSection}
        theme={currentTheme}
        themes={cosmicThemes}
        onSelectTheme={setSelectedThemeId}
        onNavigate={handleNavigate}
      />

      {/* Main Portfolio Content Flow */}
      <main className="relative z-20 pb-20">
        <HeroSection
          theme={currentTheme}
          onWarpJump={handleNavigate}
          onNavigate={handleNavigate}
        />

        <AboutSection
          theme={currentTheme}
          spinSpeed={spinSpeed}
          setSpinSpeed={setSpinSpeed}
          gravitationalStrength={gravitationalStrength}
          setGravitationalStrength={setGravitationalStrength}
        />

        <ProjectsSection
          theme={currentTheme}
          onSelectProject={setSelectedProject}
        />

        <SkillsSection
          theme={currentTheme}
        />

        {/* Scroll-Bound Sticky Hyperspace Corridor (exact haoqi.design sticky sequence) */}
        <StickyHyperspaceScroll
          theme={currentTheme}
          onWarpProgress={handleWarpProgress}
        />

        <ExperienceSection
          theme={currentTheme}
        />

        <ContactSection
          theme={currentTheme}
        />
      </main>

      {/* Interactive Project Modal */}
      <ProjectModal
        project={selectedProject}
        theme={currentTheme}
        onClose={() => setSelectedProject(null)}
      />

      {/* Floating AI Chatbox (Rohan's Digital Twin Knowledge Base) */}
      <PortfolioChatbox
        theme={currentTheme}
      />

    </div>
  );
}

export default App;
