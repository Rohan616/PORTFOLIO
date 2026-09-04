import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2, Award } from 'lucide-react';
import { ThemeConfig } from '../../types';

interface ExperienceSectionProps {
  theme: ThemeConfig;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ theme }) => {
  const experiences = [
    {
      role: 'Computer Engineering Student & Researcher',
      organization: 'Delhi Skill and Entrepreneurship University (DSEU)',
      period: '2023 — PRESENT',
      location: 'Delhi / Ganaur, India',
      description: 'Focusing on advanced algorithms, full-stack software architecture, responsive interface engineering, and generative AI integrations.',
      highlights: [
        'Built modern web applications emphasizing responsive CSS layouts, performance tuning, and cross-browser stability.',
        'Explored generative AI models and LLM API integrations (Gemini API, prompt engineering, and intelligent chatbots).',
        'Engineered dynamic interactive web experiences including superhero UI mechanics and 3D WebGL particle shaders.',
      ],
    },
    {
      role: 'Creative Web Developer & UI Designer',
      organization: 'Independent Project Expeditions',
      period: '2023 — 2026',
      location: 'Remote',
      description: 'Designing high-impact interactive web portals, game-inspired HUDs, and real-time canvas visualizers.',
      highlights: [
        'Developed the Batman: Arkham Detective Mode interactive scanner with real-time visual filters and audio cues.',
        'Crafted the Hulk Unleashed superhero interactive showcase with kinetic CSS screen-shake and canvas particle physics.',
        'Engineered this Event Horizon 3D black hole portfolio featuring numerical GLSL raymarching and Lenis smooth momentum scrolling.',
      ],
    },
  ];

  return (
    <section id="experience" className="relative py-24 px-4 sm:px-8 max-w-7xl mx-auto z-20">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc]" />
        <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
          03 // ACADEMIC &amp; ENGINEERING FLIGHT LOG
        </span>
      </div>

      <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-12">
        MISSION LOGS &amp; EDUCATION
      </h2>

      <div className="space-y-8">
        {experiences.map((exp, idx) => (
          <div
            key={idx}
            className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 hover:border-amber-400/40 transition-all duration-300 relative overflow-hidden"
          >
            {/* Top Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
              <div>
                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase mb-2 border"
                  style={{
                    backgroundColor: `${theme.accentColor}15`,
                    borderColor: `${theme.accentColor}44`,
                    color: theme.accentColor,
                  }}
                >
                  EXPEDITION // 0{idx + 1}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {exp.role}
                </h3>
                <div className="text-sm font-medium text-slate-300 mt-1">
                  {exp.organization}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5 bg-space-900 px-3 py-1.5 rounded-lg border border-white/5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{exp.period}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-space-900 px-3 py-1.5 rounded-lg border border-white/5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{exp.location}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 font-light leading-relaxed mb-6">
              {exp.description}
            </p>

            {/* Highlights List */}
            <div className="space-y-2.5">
              {exp.highlights.map((highlight, hIdx) => (
                <div key={hIdx} className="flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
                  <CheckCircle2 
                    className="w-4 h-4 flex-shrink-0 mt-0.5" 
                    style={{ color: theme.accentColor }} 
                  />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
