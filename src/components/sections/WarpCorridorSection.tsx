import React from 'react';
import { Zap, Rocket, Activity, Navigation, Compass, Sparkles, Gauge } from 'lucide-react';
import { ThemeConfig } from '../../types';
import { cosmicAudio } from '../../audio/CosmicAudioEngine';

interface WarpCorridorSectionProps {
  theme: ThemeConfig;
  warpSpeed: number;
  setManualWarpSpeed: (v: number) => void;
  scrollWarpEnabled: boolean;
  setScrollWarpEnabled: (enabled: boolean) => void;
  onWarpJump: (targetSectionId?: string) => void;
}

export const WarpCorridorSection: React.FC<WarpCorridorSectionProps> = ({
  theme,
  warpSpeed,
  setManualWarpSpeed,
  scrollWarpEnabled,
  setScrollWarpEnabled,
  onWarpJump,
}) => {
  const warpPresets = [
    { label: 'IMPULSE (0.2c)', value: 0.05 },
    { label: 'WARP 1 (1.0c)', value: 0.35 },
    { label: 'WARP 5 (5.2c)', value: 0.7 },
    { label: 'MAX WARP (9.9c)', value: 1.0 },
  ];

  const destinations = [
    { id: 'hero', label: 'SECTOR 01: SINGULARITY (HERO)' },
    { id: 'projects', label: 'SECTOR 02: ACCRETION ARCHIVE' },
    { id: 'skills', label: 'SECTOR 03: STELLAR MATRIX' },
    { id: 'experience', label: 'SECTOR 04: FLIGHT LOG' },
    { id: 'contact', label: 'SECTOR 05: TRANSCEIVER' },
  ];

  return (
    <section 
      id="warp-corridor" 
      className="relative min-h-screen py-24 px-4 sm:px-8 max-w-7xl mx-auto z-20 flex items-center"
    >
      <div className="w-full lg:w-3/5 space-y-8">
        
        {/* Section Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs tracking-widest uppercase">
            <Rocket className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>HYPERSPACE ACCELERATOR // INTERSTELLAR CORRIDOR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Hyperspace Warp Chamber
          </h2>
          <p className="text-slate-300 font-light text-sm sm:text-base leading-relaxed">
            Enter the relativistic transport manifold. Engage hyperdrive propulsion, accelerate light speed vectors, or initiate instant transit to remote sectors.
          </p>
        </div>

        {/* Warp Controls Command Deck */}
        <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-white font-bold">
              <Gauge className="w-4 h-4 text-amber-400" />
              <span>WARP ENGINE PROPULSION MATRIX</span>
            </div>
            <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              {(0.15 + warpSpeed * 9.75).toFixed(1)}c / MAX 9.9c
            </span>
          </div>

          {/* Warp Velocity Slider */}
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between text-slate-300">
              <span>RELATIVISTIC THROTTLE:</span>
              <span className="text-amber-300 font-bold">
                {warpSpeed > 0.8 ? 'MAXIMUM HYPERSPACE' : warpSpeed > 0.3 ? 'WARP DRIVE ENGAGED' : 'SUB-LIGHT IMPULSE'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={warpSpeed}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setManualWarpSpeed(val);
                cosmicAudio.updateWarpVelocity(val);
              }}
              className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />

            {/* Velocity Preset Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {warpPresets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    cosmicAudio.playUIBeep(true);
                    setManualWarpSpeed(p.value);
                    cosmicAudio.updateWarpVelocity(p.value);
                  }}
                  className={`px-2.5 py-2 rounded-lg font-mono text-[11px] border transition-all text-center ${
                    Math.abs(warpSpeed - p.value) < 0.1
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                      : 'bg-space-950/60 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scroll-Warp Feature Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-space-950/80 border border-white/10 font-mono text-xs">
            <div>
              <div className="text-white font-bold mb-0.5">Scroll-Driven Hyperspace Mode</div>
              <div className="text-[11px] text-slate-400">
                Accelerate warp streaks dynamically when scrolling down the page
              </div>
            </div>
            <button
              onClick={() => {
                cosmicAudio.playUIBeep();
                setScrollWarpEnabled(!scrollWarpEnabled);
              }}
              className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                scrollWarpEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-space-900 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              {scrollWarpEnabled ? '● ACTIVE' : '○ DISABLED'}
            </button>
          </div>

          {/* Instant Sector Jump Buttons */}
          <div className="space-y-2 pt-2">
            <div className="font-mono text-xs text-slate-400 uppercase tracking-wider">
              Initiate Instant Sector Warp Jump:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {destinations.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => onWarpJump(dest.id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-left text-xs font-mono text-slate-200 hover:text-white transition-all group"
                >
                  <span>{dest.label}</span>
                  <Zap className="w-3.5 h-3.5 text-amber-400 opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all" />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
