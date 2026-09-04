import React from 'react';
import { Sliders, Sparkles, Code2, Film, Tv, BookOpen } from 'lucide-react';
import { ThemeConfig } from '../../types';
import { cosmicAudio } from '../../audio/CosmicAudioEngine';

interface AboutSectionProps {
  theme: ThemeConfig;
  spinSpeed: number;
  setSpinSpeed: (val: number) => void;
  gravitationalStrength: number;
  setGravitationalStrength: (val: number) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  theme,
  spinSpeed,
  setSpinSpeed,
  gravitationalStrength,
  setGravitationalStrength,
}) => {
  return (
    <section id="about" className="relative py-24 px-4 sm:px-8 max-w-7xl mx-auto z-20">
      
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
        <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
          01 // BIOGRAPHY &amp; CORE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Biography (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            BRIDGING LOGIC, CODE &amp; CREATIVE STORYTELLING
          </h2>
          
          <p className="text-base text-slate-300 leading-relaxed font-light">
            I am a <strong className="text-white font-medium">Computer Engineering student at Delhi Skill and Entrepreneurship University (DSEU)</strong> specializing in responsive web development, interactive UI design, and generative AI integrations. My goal is to build digital experiences that feel intuitive, fast, and visually striking.
          </p>

          <p className="text-base text-slate-300 leading-relaxed font-light">
            When I am not writing code, debugging APIs, or designing layouts, you can usually find me analyzing intense anime training arcs, or exploring massive fictional universes like <strong className="text-amber-300 font-medium">Middle-earth (LOTR)</strong>, <strong className="text-cyan-300 font-medium">Hogwarts (Harry Potter)</strong>, the <strong className="text-purple-300 font-medium">MCU</strong>, and legendary series like <strong className="text-rose-300 font-medium">Game of Thrones</strong>, <strong className="text-emerald-300 font-medium">Stranger Things</strong>, and <strong className="text-blue-300 font-medium">Breaking Bad</strong>.
          </p>

          {/* Skill Tag Badges */}
          <div className="pt-2">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
              Core Tech Stack &amp; Specializations
            </div>
            <div className="flex flex-wrap gap-2">
              {['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'Tailwind CSS', 'UI/UX Design', 'Three.js & WebGL', 'Generative AI', 'REST APIs'].map((skill) => (
                <span
                  key={skill}
                  className="px-3.5 py-1.5 rounded-full text-xs font-mono border transition-all duration-200 hover:scale-105"
                  style={{
                    borderColor: `${theme.accentColor}44`,
                    backgroundColor: `${theme.accentColor}11`,
                    color: theme.accentColor,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Fictional Universe Badges */}
          <div className="pt-2">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Favorite Fictional Universes &amp; Lore</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Anime Training Arcs', 'The Lord of the Rings', 'Harry Potter', 'Marvel MCU', 'Game of Thrones', 'Stranger Things', 'Breaking Bad'].map((lore) => (
                <span
                  key={lore}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-slate-300"
                >
                  {lore}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live GLSL Relativistic Physics Controller (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                PHYSICS CONTROLLER
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
              GPU LIVE
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            Adjust the live GLSL shader uniforms powering the 3D black hole in the background.
          </p>

          {/* Spin Velocity Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">ACCRETION DISK SPIN (Ω)</span>
              <span className="text-amber-400 font-bold">{spinSpeed.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.05"
              value={spinSpeed}
              onChange={(e) => {
                setSpinSpeed(parseFloat(e.target.value));
                cosmicAudio.playUIBeep();
              }}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-space-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.10x (Calm)</span>
              <span>1.00x (Standard)</span>
              <span>3.00x (Extreme)</span>
            </div>
          </div>

          {/* Gravitational Strength Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">GRAVITATIONAL MASS (GM/c²)</span>
              <span className="text-cyan-400 font-bold">{gravitationalStrength.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.05"
              value={gravitationalStrength}
              onChange={(e) => {
                setGravitationalStrength(parseFloat(e.target.value));
                cosmicAudio.playUIBeep();
              }}
              className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-space-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.50 (Mild Lensing)</span>
              <span>1.60 (Interstellar)</span>
              <span>3.00 (Extreme Void)</span>
            </div>
          </div>

          {/* Telemetry Status readout */}
          <div className="p-3 bg-space-950/80 rounded-xl border border-white/5 font-mono text-[11px] space-y-1">
            <div className="text-slate-400 flex justify-between">
              <span>SCHWARZSCHILD RADIUS:</span>
              <span className="text-white">4.20 AU</span>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>DOPPLER RELATIVISTIC BOOST:</span>
              <span className="text-amber-400">ENABLED (2.8x MAX)</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
