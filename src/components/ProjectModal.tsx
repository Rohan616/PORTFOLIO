import React from 'react';
import { X, ExternalLink, Sparkles } from 'lucide-react';
import { Project, ThemeConfig } from '../types';
import { cosmicAudio } from '../audio/CosmicAudioEngine';
import { GithubIcon } from './icons/SocialIcons';

interface ProjectModalProps {
  project: Project | null;
  theme: ThemeConfig;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  theme,
  onClose,
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel-glow rounded-2xl border border-white/20 p-6 sm:p-8 space-y-6 text-slate-100"
        style={{
          boxShadow: `0 0 40px -10px ${theme.accentColor}33`,
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            cosmicAudio.playUIBeep();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-8">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{project.category} // GRAV_INDEX {project.gravityIndex.toFixed(1)}</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
            {project.title}
          </h3>
          <p className="text-base text-slate-300 font-light">
            {project.subtitle}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
          {project.metrics.map((m, idx) => (
            <div key={idx} className="glass-panel p-3 rounded-xl border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase">{m.label}</div>
              <div className="text-base font-bold text-white mt-0.5" style={{ color: theme.accentColor }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Narrative */}
        <div className="space-y-3 font-light text-slate-300 leading-relaxed text-sm sm:text-base border-t border-white/10 pt-4">
          <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Mission Architecture & Engineering
          </h4>
          <p>{project.longDescription}</p>
        </div>

        {/* Tech Stack Chips */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Deployed Technologies
          </div>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Links */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cosmicAudio.playUIBeep()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            <span>SOURCE CODE</span>
          </a>

          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cosmicAudio.playUIBeep(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg font-mono text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all"
            style={{
              background: `linear-gradient(135deg, ${theme.diskColor1}, ${theme.accentColor})`
            }}
          >
            <ExternalLink className="w-4 h-4" />
            <span>LAUNCH DEPLOYMENT</span>
          </a>
        </div>
      </div>
    </div>
  );
};
