import React, { useState } from 'react';
import { ExternalLink, Sparkles, Layers, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '../icons/SocialIcons';
import { Project, ThemeConfig } from '../../types';
import { cosmicAudio } from '../../audio/CosmicAudioEngine';

interface ProjectsSectionProps {
  theme: ThemeConfig;
  onSelectProject: (project: Project) => void;
}

export const sampleProjects: Project[] = [
  {
    id: 'batman-arkham',
    title: 'Batman: Arkham Detective Mode',
    subtitle: 'Arkham Detective Scanner & Gotham UI',
    category: 'Creative Tech',
    description: 'Batman game-inspired interactive webpage featuring real-time Arkham detective mode scanner vision, interactive clue inspection, and gothic UI aesthetics.',
    longDescription: 'An interactive Batman Arkham-inspired web application featuring real-time detective mode visual filters, atmospheric Gotham audio cues, and dynamic clue discovery mechanics.',
    metrics: [
      { label: 'SCAN SPEED', value: '60 FPS' },
      { label: 'VISUAL FILTERS', value: 'Arkham HUD' },
      { label: 'AUDIO CUES', value: 'Custom SFX' },
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Audio API', 'UI Design'],
    githubUrl: 'https://github.com/Rohan616',
    liveUrl: 'https://github.com/Rohan616',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    gravityIndex: 9.8,
  },
  {
    id: 'hulk-unleashed',
    title: 'Hulk Unleashed',
    subtitle: 'Kinetic Superhero Interactive Experience',
    category: 'Creative Tech',
    description: 'Visually stunning superhero showcase with kinetic screen-smashing physics, dynamic gamma particles, and interactive comic book UI.',
    longDescription: 'A high-impact superhero web experience capturing the raw kinetic power of the Incredible Hulk with screen-shake animations, particle explosions, and custom typography.',
    metrics: [
      { label: 'PARTICLES', value: '1000+' },
      { label: 'ANIMATION', value: 'Kinetic CSS' },
      { label: 'PERFORMANCE', value: 'GPU Accel' },
    ],
    technologies: ['HTML5', 'CSS Animations', 'JavaScript', 'Canvas', 'Responsive UI'],
    githubUrl: 'https://github.com/Rohan616',
    liveUrl: 'https://github.com/Rohan616',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    gravityIndex: 8.9,
  },
  {
    id: 'event-horizon-portfolio',
    title: 'Event Horizon: 3D Black Hole Portfolio',
    subtitle: 'Relativistic WebGL 3D Black Hole',
    category: '3D / Graphics',
    description: 'Authentic Interstellar Gargantua raymarched black hole with Lenis momentum smooth scrolling, 3D holographic gyro cursor, and radial laser speed streaks.',
    longDescription: 'A cinematic developer portfolio powered by numerical geodesic raymarching in GLSL, Three.js, React 19, and haoqi.design-inspired scrollytelling.',
    metrics: [
      { label: 'RAY MARCH', value: '100 Steps' },
      { label: 'RENDER FPS', value: '60 FPS' },
      { label: 'STREAKS', value: '4500 Rays' },
    ],
    technologies: ['React 19', 'Three.js', 'GLSL Shaders', 'Lenis', 'Tailwind CSS'],
    githubUrl: 'https://github.com/Rohan616',
    liveUrl: 'https://github.com/Rohan616',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    gravityIndex: 10.0,
  },
  {
    id: 'hero-forge-ui',
    title: 'Hero Forge UI',
    subtitle: 'Next-Gen Landing Page Exploration',
    category: 'Creative Tech',
    description: 'High-impact hero page layout practicing bold typography hierarchies, glassmorphic floating cards, and micro-interactions.',
    longDescription: 'A design system and hero exploration crafted to push the limits of modern CSS grid layout, responsive typography, and subtle ambient motion.',
    metrics: [
      { label: 'LAYOUT', value: 'Grid / Flex' },
      { label: 'RESPONSIVENESS', value: '100%' },
      { label: 'LOAD TIME', value: '< 0.3s' },
    ],
    technologies: ['HTML5', 'Modern CSS', 'JavaScript', 'UI/UX Design'],
    githubUrl: 'https://github.com/Rohan616',
    liveUrl: 'https://github.com/Rohan616',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    gravityIndex: 7.5,
  },
];

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  theme,
  onSelectProject,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Creative Tech', '3D / Graphics'];

  const filteredProjects = activeCategory === 'All'
    ? sampleProjects
    : sampleProjects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-8 max-w-7xl mx-auto z-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f2fe]" />
            <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
              02 // SELECTED WORK &amp; EXPERIMENTS
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            SELECTED EXPEDITIONS
          </h2>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                cosmicAudio.playUIBeep();
                setActiveCategory(cat);
              }}
              className={`px-4 py-2 rounded-xl border transition-all duration-200 whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-white text-black font-bold border-white shadow-lg'
                  : 'bg-space-900/60 text-slate-400 hover:text-white border-white/10 hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => {
              cosmicAudio.playUIBeep();
              onSelectProject(project);
            }}
            className="group relative glass-panel rounded-2xl border border-white/10 overflow-hidden cursor-pointer transition-all duration-300 hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:-translate-y-1"
          >
            {/* Project Image Banner */}
            <div className="relative h-60 w-full overflow-hidden bg-space-950">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-transparent to-transparent" />
              
              {/* Category Tag */}
              <div className="absolute top-4 left-4">
                <span 
                  className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border backdrop-blur-md"
                  style={{
                    backgroundColor: `${theme.accentColor}22`,
                    borderColor: `${theme.accentColor}66`,
                    color: theme.accentColor,
                  }}
                >
                  {project.category}
                </span>
              </div>

              {/* View Arrow */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-black transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  {project.subtitle}
                </p>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-white/5 border border-white/10 text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
