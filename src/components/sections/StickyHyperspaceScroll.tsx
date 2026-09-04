import React, { useRef, useEffect, useState } from 'react';
import { ThemeConfig } from '../../types';
import { cosmicAudio } from '../../audio/CosmicAudioEngine';

interface StickyHyperspaceScrollProps {
  theme: ThemeConfig;
  onWarpProgress: (progress: number, warpIntensity: number) => void;
}

export const StickyHyperspaceScroll: React.FC<StickyHyperspaceScrollProps> = ({
  theme,
  onWarpProgress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;
      
      const currentScroll = -rect.top;
      const rawProgress = currentScroll / totalScrollable;
      const clamped = Math.min(Math.max(rawProgress, 0), 1);
      
      setProgress(clamped);

      let intensity = 0;
      if (clamped > 0.02 && clamped < 0.98) {
        intensity = Math.min(clamped * 1.5, 1.0);
      }

      onWarpProgress(clamped, intensity);
      cosmicAudio.updateWarpVelocity(intensity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onWarpProgress]);

  // Exact 3-stage typography transitions matching user's screenshots
  const getStageContent = () => {
    if (progress < 0.35) {
      const pNorm = progress / 0.35;
      const opacity = Math.sin(pNorm * Math.PI * 0.95);
      return {
        stageId: '01',
        lines: ['INNOVATE', 'WITH', 'PURPOSE'],
        opacity: Math.max(0, opacity),
        scale: 0.95 + pNorm * 0.15,
      };
    } else if (progress < 0.72) {
      const pNorm = (progress - 0.35) / 0.37;
      const opacity = Math.sin(pNorm * Math.PI);
      return {
        stageId: '02',
        lines: ['INNOVATE', 'WITH A', 'HUMAN TOUCH'],
        opacity: Math.max(0, opacity),
        scale: 1.0 + pNorm * 0.15,
      };
    } else {
      const pNorm = (progress - 0.72) / 0.28;
      const opacity = Math.sin(pNorm * Math.PI);
      return {
        stageId: '03',
        lines: ['FUTURE-FIRST', 'ALWAYS'],
        opacity: Math.max(0, opacity),
        scale: 1.05 + pNorm * 0.1,
      };
    }
  };

  const stage = getStageContent();

  return (
    <div
      ref={containerRef}
      id="hyperspace-scroll-track"
      className="relative w-full text-white h-[300vh] sm:h-[400vh] lg:h-[500vh]"
    >
      {/* Top transition gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-b from-[#02040a] to-transparent pointer-events-none z-10" />

      {/* Pinned Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center px-4 sm:px-8 lg:px-14 overflow-hidden select-none pointer-events-none">
        
        {/* Subtle Retro Background Crosshair Grid */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-15 sm:opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Top Left Retro Pixel Cursor Icon & Badge */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-10 lg:left-14 flex items-center gap-2 sm:gap-3 z-30">
          <div className="w-5 h-5 sm:w-6 sm:h-6 relative animate-pulse">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-[0_0_8px_#c0fe04]">
              <path d="M4 2L4 20L9 15L14 22L17 20L12 13L19 13L4 2Z" fill="#c0fe04" />
            </svg>
          </div>
          
          <div 
            className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-dashed font-mono text-[9px] sm:text-[11px] font-bold text-white tracking-widest uppercase"
            style={{
              borderColor: '#c0fe04',
              boxShadow: '0 0 12px rgba(192,254,4,0.25)',
            }}
          >
            WARP.STAGE_{stage.stageId}
          </div>
        </div>

        {/* Giant Centered Typography with clean mobile responsiveness */}
        <div 
          className="relative z-20 w-full flex flex-col justify-center items-center text-center px-2 transition-all duration-100"
          style={{
            opacity: stage.opacity,
            transform: `scale(${stage.scale})`,
          }}
        >
          <h2 className="flex flex-col font-black text-4xl sm:text-6xl md:text-7xl lg:text-[7.2vw] tracking-tighter uppercase leading-[0.94] text-white drop-shadow-[0_0_35px_rgba(0,242,254,0.35)]">
            {stage.lines.map((line, idx) => (
              <span 
                key={idx} 
                className={
                  line === 'WITH' || line === 'WITH A'
                    ? 'relative inline-block text-white' 
                    : 'text-white'
                }
              >
                {line.includes('WITH') ? (
                  <span className="relative">
                    {line}
                    <span className="inline-block w-2 h-3.5 sm:w-2.5 sm:h-4 ml-1.5 sm:ml-2 bg-[#c0fe04] align-middle shadow-[0_0_10px_#c0fe04]" />
                  </span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h2>
        </div>

        {/* Bottom Telemetry HUD Coordinates */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 lg:bottom-10 lg:left-14 lg:right-14 flex justify-between items-center font-mono text-[10px] sm:text-[11px] text-slate-400 z-30">
          <span>STAGE: {stage.stageId} // WARP</span>
          <div className="flex items-center gap-1.5 text-[#c0fe04]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c0fe04] animate-ping" />
            <span>TRANSIT: {Math.round(progress * 100)}%</span>
          </div>
          <span>{(0.2 + progress * 9.7).toFixed(1)}c</span>
        </div>

      </div>

      {/* Bottom transition gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-[#02040a] to-transparent pointer-events-none z-10" />
    </div>
  );
};
