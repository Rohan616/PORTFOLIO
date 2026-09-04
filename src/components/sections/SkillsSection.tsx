import React from 'react';
import { Cpu, Code, Database, Sparkles, Orbit, Flame, Terminal } from 'lucide-react';
import { SkillCategory, ThemeConfig } from '../../types';

interface SkillsSectionProps {
  theme: ThemeConfig;
}

export const skillClusters: SkillCategory[] = [
  {
    title: 'Graphics, Shaders & Frontend',
    badge: 'ENGINEERING',
    skills: [
      { name: 'Three.js / WebGL 2.0', level: 95, description: 'Custom raymarching, postprocessing & particle engines', icon: '✨' },
      { name: 'GLSL & Shader Programming', level: 92, description: 'Volumetric ray deflection, fluid simulation & noise', icon: '🌀' },
      { name: 'React 19 & Next.js', level: 96, description: 'Server components, high-performance concurrent UI', icon: '⚛️' },
      { name: 'TypeScript', level: 94, description: 'Strict typing, AST transformations & generic systems', icon: '🔷' },
      { name: 'WebGPU & Compute Shaders', level: 85, description: 'Next-generation parallel GPGPU browser compute', icon: '⚡' },
    ],
  },
  {
    title: 'Backend & High-Throughput Systems',
    badge: 'INFRASTRUCTURE',
    skills: [
      { name: 'Node.js & Bun', level: 92, description: 'Event-driven streaming servers & microservices', icon: '🟢' },
      { name: 'Python & FastAPI', level: 90, description: 'Asynchronous API gateways & data science orchestration', icon: '🐍' },
      { name: 'Rust & WebAssembly', level: 84, description: 'Memory-safe low latency compiled modules', icon: '🦀' },
      { name: 'PostgreSQL & Redis', level: 88, description: 'Distributed caching, spatial queries & clustering', icon: '🐘' },
      { name: 'WebSockets & gRPC', level: 92, description: 'Sub-millisecond real-time bidirectional streams', icon: '📡' },
    ],
  },
  {
    title: 'AI, Machine Learning & Compute',
    badge: 'INTELLIGENCE',
    skills: [
      { name: 'Gemini API & LLM Tooling', level: 94, description: 'Multimodal streaming, agent swarms & structured output', icon: '🧠' },
      { name: 'Vector DBs & Embeddings', level: 88, description: 'HNSW indexing, semantic hybrid search pipelines', icon: '🧬' },
      { name: 'PyTorch & Transformers', level: 82, description: 'Attention mechanisms, fine-tuning & model inference', icon: '🔥' },
    ],
  },
  {
    title: 'Architecture & Creative Tooling',
    badge: 'PIPELINES',
    skills: [
      { name: 'Docker & Kubernetes', level: 86, description: 'Containerized cluster orchestration & auto-scaling', icon: '🐳' },
      { name: 'CI/CD & Cloud Deployments', level: 90, description: 'Automated GitHub Actions, AWS, GCP, Vercel', icon: '☁️' },
      { name: 'Blender 3D Modeling', level: 80, description: 'PBR materials, procedural node shaders & low-poly assets', icon: '🎨' },
    ],
  }
];

export const SkillsSection: React.FC<SkillsSectionProps> = ({ theme }) => {
  return (
    <section 
      id="skills" 
      className="relative min-h-screen py-24 px-4 sm:px-8 max-w-7xl mx-auto z-20"
    >
      <div className="w-full lg:w-3/5 space-y-8">
        
        {/* Section Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs tracking-widest uppercase">
            <Cpu className="w-4 h-4" />
            <span>STELLAR MATRIX // TECHNICAL ARSENAL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Specialized Tech Stack
          </h2>
          <p className="text-slate-300 font-light text-sm sm:text-base">
            Mastered technologies and technical disciplines forged through years of challenging deployments.
          </p>
        </div>

        {/* Skill Category Cards */}
        <div className="space-y-6">
          {skillClusters.map((cluster, cIdx) => (
            <div key={cIdx} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{cluster.title}</span>
                </h3>
                <span className="font-mono text-[10px] text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {cluster.badge}
                </span>
              </div>

              <div className="space-y-3">
                {cluster.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-200 font-medium flex items-center gap-1.5">
                        <span>{skill.icon}</span>
                        <span>{skill.name}</span>
                      </span>
                      <span className="text-amber-400 font-bold">{skill.level}%</span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-space-950 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${skill.level}%`,
                          background: `linear-gradient(to right, ${theme.diskColor1}, ${theme.accentColor})`
                        }}
                      />
                    </div>

                    <div className="text-[11px] text-slate-400 font-light pl-6">
                      {skill.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
