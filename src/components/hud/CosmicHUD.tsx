import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Menu,
  X
} from 'lucide-react';
import { TelemetryData, ThemeColor, ThemeConfig } from '../../types';
import { cosmicAudio } from '../../audio/CosmicAudioEngine';

interface CosmicHUDProps {
  telemetry: TelemetryData;
  activeSection: string;
  theme: ThemeConfig;
  themes: ThemeConfig[];
  onSelectTheme: (themeId: ThemeColor) => void;
  onNavigate: (sectionId: string) => void;
}

export const CosmicHUD: React.FC<CosmicHUDProps> = ({
  telemetry,
  activeSection,
  theme,
  themes,
  onSelectTheme,
  onNavigate,
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mouseCoords, setMouseCoords] = useState({ x: '0000', y: '0000' });
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const pad = (n: number) => String(Math.floor(n)).padStart(4, '0');
      setMouseCoords({ x: pad(e.clientX), y: pad(e.clientY) });
    };
    window.addEventListener('mousemove', handleMouse);

    const updateClock = () => {
      const d = new Date();
      setCurrentTime(d.toTimeString().split(' ')[0] + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      clearInterval(interval);
    };
  }, []);

  const handleAudioToggle = () => {
    const muted = cosmicAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) cosmicAudio.playUIBeep(true);
  };

  const navItems = [
    { id: 'hero', label: 'SINGULARITY' },
    { id: 'about', label: 'ABOUT' },
    { id: 'projects', label: 'WORK' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'experience', label: 'LOGS' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <>
      {/* TOP SCI-FI NAVIGATION HUD (haoqi.design inspired) */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 lg:px-12 py-3 bg-space-950/80 backdrop-blur-md border-b border-white/10 transition-all duration-300 font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => onNavigate('hero')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-7 h-7 rounded-full bg-black border border-amber-500/50 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.5)] group-hover:scale-105 transition-transform">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping opacity-75" />
              <div className="absolute inset-0 rounded-full border border-dashed border-amber-300/40 animate-spin-slow" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest text-white flex items-center gap-2">
                <span>ROHAN_BHARDWAJ</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-slate-400 tracking-wider">
                DSEU // COMPUTER ENGINEERING
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links with retro dotted borders */}
          <nav className="hidden lg:flex items-center gap-2 text-xs">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    cosmicAudio.playUIBeep();
                    onNavigate(item.id);
                  }}
                  className={`relative px-3 py-1.5 rounded uppercase tracking-wider transition-all duration-200 retro-dotted ${
                    isActive
                      ? 'bg-white/10 text-white font-bold border border-white/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  style={{
                    borderColor: isActive ? theme.accentColor : undefined,
                    color: isActive ? theme.accentColor : undefined,
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Theme & Audio */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            
            {/* Theme Toggle (haoqi style THEME[X]) */}
            <div className="relative">
              <button
                onClick={() => {
                  cosmicAudio.playUIBeep();
                  setShowThemePicker(!showThemePicker);
                }}
                className="px-2.5 py-1.5 rounded bg-space-900 border border-white/10 hover:border-amber-400 text-slate-300 hover:text-white transition-colors retro-dotted uppercase"
                title="Accretion Spectrum Theme"
              >
                THEME[{theme.id.charAt(0).toUpperCase()}]
              </button>

              {showThemePicker && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-space-950/95 backdrop-blur-xl rounded-lg border border-white/15 shadow-2xl z-50 animate-in fade-in">
                  <div className="px-3 py-1 text-[10px] text-slate-400 uppercase tracking-wider border-b border-white/10 mb-1">
                    Accretion Spectrum
                  </div>
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        cosmicAudio.playUIBeep(true);
                        onSelectTheme(t.id);
                        setShowThemePicker(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-white/10 transition-colors ${
                        theme.id === t.id ? 'text-amber-400 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: t.accentColor }} 
                        />
                        <span>{t.name}</span>
                      </div>
                      {theme.id === t.id && <span className="text-[10px]">●</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Audio Toggle (haoqi style SOUND[|]) */}
            <button
              onClick={handleAudioToggle}
              className={`px-2.5 py-1.5 rounded border transition-all retro-dotted uppercase ${
                isMuted
                  ? 'bg-space-900 border-white/10 text-slate-400 hover:text-white'
                  : 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
              }`}
              title={isMuted ? "Unmute Deep Space Audio" : "Mute Audio"}
            >
              SOUND[{isMuted ? 'x' : '|'}]
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded bg-space-900 border border-white/10 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-1 text-xs">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  cosmicAudio.playUIBeep();
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded uppercase ${
                  activeSection === item.id ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* BOTTOM TELEMETRY BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 lg:px-12 py-2 bg-space-950/85 backdrop-blur-md border-t border-white/10 font-mono text-[11px] text-slate-400 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Mouse Coordinate HUD */}
          <div className="flex items-center gap-4">
            <span className="text-slate-300 tracking-wider">
              {mouseCoords.x} X {mouseCoords.y} Y
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 hidden md:inline">
              {currentTime}
            </span>
          </div>

          {/* Section & Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span className="uppercase text-slate-200 font-bold">{activeSection.toUpperCase()}</span>
            </div>

            <div className="border-l border-white/10 pl-4 flex items-center gap-2">
              <span>FPS:</span>
              <span className={telemetry.fps >= 55 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {telemetry.fps}
              </span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
