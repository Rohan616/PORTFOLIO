import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, Terminal, Orbit } from 'lucide-react';
import { ThemeConfig } from '../../types';
import { cosmicAudio } from '../../audio/CosmicAudioEngine';

interface HeroSectionProps {
  theme: ThemeConfig;
  onWarpJump: (sectionId: string) => void;
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  theme,
  onNavigate,
}) => {
  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center pt-24 sm:pt-28 pb-14 sm:pb-16 px-4 sm:px-8 max-w-7xl mx-auto z-20"
    >
      {/* Left Content Area (100% on mobile, 60% on desktop to showcase the Black Hole on the right) */}
      <div className="w-full lg:w-3/5 space-y-6 sm:space-y-8">
        
        {/* Status Callout Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-space-900/90 border border-amber-500/30 text-amber-300 text-[10px] sm:text-xs font-mono backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-float max-w-full">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="tracking-normal sm:tracking-wider uppercase font-semibold truncate">
            ROHAN BHARDWAJ // COMPUTER ENGINEERING @ DSEU
          </span>
        </div>

        {/* Main Headline */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
            ROHAN, BUILDING AT THE <br className="hidden sm:inline" />
            <span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-200 to-amber-500 drop-shadow-[0_0_35px_rgba(245,158,11,0.4)]"
              style={{
                backgroundImage: `linear-gradient(to right, #ffffff, #fef3c7, ${theme.accentColor})`
              }}
            >
              EDGE OF DESIGN &amp; CODE
            </span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-light max-w-2xl leading-relaxed">
            Computer Engineering student at <strong className="text-white font-semibold">Delhi Skill and Entrepreneurship University (DSEU)</strong>. Exploring full-stack web development, interactive 3D UI design, and generative AI integrations to craft intuitive, lightning-fast digital experiences.
          </p>
        </div>

        {/* Interactive CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
          <button
            onClick={() => {
              cosmicAudio.playUIBeep();
              onNavigate('projects');
            }}
            className="group px-6 py-3.5 rounded-xl font-mono text-xs sm:text-sm font-bold tracking-wider text-black flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(245,158,11,0.4)]"
            style={{
              background: `linear-gradient(135deg, ${theme.diskColor1}, ${theme.accentColor})`
            }}
          >
            <Orbit className="w-4 h-4 text-black group-hover:rotate-180 transition-transform duration-500" />
            <span>EXPLORE WORK</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              cosmicAudio.playUIBeep();
              onNavigate('contact');
            }}
            className="px-6 py-3.5 rounded-xl font-mono text-xs sm:text-sm font-semibold tracking-wider text-slate-200 bg-space-900/80 hover:bg-space-800 border border-white/15 hover:border-amber-400/50 backdrop-blur-md transition-all duration-300 hover:scale-105 text-center"
          >
            GET IN TOUCH
          </button>
        </div>

        {/* Sci-Fi Telemetry Cards Matrix (Responsive 1-col on mobile, 3-col on tablet/desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 sm:pt-6 font-mono">
          <div className="glass-panel p-3.5 sm:p-4 rounded-xl border border-white/10 hover:border-amber-500/40 transition-colors flex sm:block items-center justify-between">
            <div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-0.5 sm:mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>EDUCATION</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-white">DSEU</div>
            </div>
            <div className="text-[10px] text-slate-400 sm:mt-0.5">Computer Engineering</div>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 rounded-xl border border-white/10 hover:border-cyan-500/40 transition-colors flex sm:block items-center justify-between">
            <div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-0.5 sm:mb-1">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>FOCUS</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-white">FULL-STACK</div>
            </div>
            <div className="text-[10px] text-slate-400 sm:mt-0.5">React • Python • AI</div>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 rounded-xl border border-white/10 hover:border-purple-500/40 transition-colors flex sm:block items-center justify-between">
            <div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-0.5 sm:mb-1">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span>PASSION</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-white">UI/UX &amp; AI</div>
            </div>
            <div className="text-[10px] text-slate-400 sm:mt-0.5">Interactive experiences</div>
          </div>
        </div>

      </div>
    </section>
  );
};
