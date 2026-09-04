import React, { useState } from 'react';
import { Send, Mail, MapPin, CheckCircle, Copy, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '../icons/SocialIcons';
import { ThemeConfig } from '../../types';
import { cosmicAudio } from '../../audio/CosmicAudioEngine';

interface ContactSectionProps {
  theme: ThemeConfig;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ theme }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('rohanbh838@email.com');
    setCopied(true);
    cosmicAudio.playUIBeep(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);
    cosmicAudio.playUIBeep();

    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setFormData({ name: '', email: '', message: '' });
      cosmicAudio.playWarpJump();
      setTimeout(() => setIsSent(false), 6000);
    }, 1200);
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-8 max-w-7xl mx-auto z-20">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
        <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
          04 // SUBSPACE TRANSCEIVER &amp; CONTACT
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Direct Info & Socials */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              LET'S BUILD SOMETHING GRAVITATIONAL.
            </h2>
            <p className="text-base text-slate-300 font-light mt-4 leading-relaxed">
              Whether you want to collaborate on high-performance web applications, explore generative AI integrations, or talk anime and fictional universes—my transceiver is always open.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            
            {/* Direct Email Card with One-Click Copy */}
            <div className="p-4 rounded-xl glass-panel border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/20"
                  style={{ backgroundColor: `${theme.accentColor}22` }}
                >
                  <Mail className="w-4 h-4" style={{ color: theme.accentColor }} />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Primary Transmission</div>
                  <div className="text-sm font-bold text-white">rohanbh838@email.com</div>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors border border-white/10"
                title="Copy Email Address"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Location & Timezone */}
            <div className="p-4 rounded-xl glass-panel border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Current Coordinate</div>
                <div className="text-sm font-bold text-white">Ganaur, India // IST (UTC+5:30)</div>
              </div>
            </div>

          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Subspace Social Channels
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/Rohan616"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs bg-space-900 border border-white/10 hover:border-white/30 text-white transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </a>

              <a
                href="https://www.linkedin.com/in/rohan-bhardwaj-a56689276?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs bg-space-900 border border-white/10 hover:border-cyan-400/50 text-white transition-colors"
              >
                <LinkedinIcon className="w-4 h-4 text-cyan-400" />
                <span>LinkedIn</span>
              </a>

              <a
                href="https://www.instagram.com/rohan616__?igsi=MWZpbWZvbXlnbzAw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs bg-space-900 border border-white/10 hover:border-pink-400/50 text-white transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

        </div>

        {/* Right Column: Encrypted Transmission Form */}
        <div className="lg:col-span-7 glass-panel p-8 rounded-2xl border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Send className="w-4 h-4 text-amber-400" />
              <span>SEND A DIRECT MESSAGE</span>
            </h3>

            {isSent && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center gap-3 animate-in fade-in">
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                <span>TRANSMISSION RECEIVED // I will respond to your coordinates shortly.</span>
              </div>
            )}

            <div className="space-y-2 font-mono text-xs">
              <label className="text-slate-300">YOUR NAME / CALLSIGN</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Bruce Wayne"
                className="w-full px-4 py-3 rounded-xl bg-space-900 border border-white/10 focus:border-amber-400 focus:outline-none text-white transition-colors"
              />
            </div>

            <div className="space-y-2 font-mono text-xs">
              <label className="text-slate-300">COMMUNICATION FREQUENCY (EMAIL)</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@universe.com"
                className="w-full px-4 py-3 rounded-xl bg-space-900 border border-white/10 focus:border-amber-400 focus:outline-none text-white transition-colors"
              />
            </div>

            <div className="space-y-2 font-mono text-xs">
              <label className="text-slate-300">MESSAGE PAYLOAD</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Share your project vision, question, or mission details..."
                className="w-full px-4 py-3 rounded-xl bg-space-900 border border-white/10 focus:border-amber-400 focus:outline-none text-white transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-4 rounded-xl font-mono text-xs font-bold tracking-widest text-black uppercase flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${theme.diskColor1}, ${theme.accentColor})`,
                boxShadow: `0 0 25px ${theme.accentColor}44`,
              }}
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>TRANSMITTING TO SINGULARITY...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 fill-black" />
                  <span>DISPATCH TRANSMISSION</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between font-mono text-xs text-slate-500 gap-4">
        <div>
          © 2026 <strong className="text-slate-300">Rohan Bhardwaj</strong>. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span>DSEU // Computer Engineering</span>
          <span>•</span>
          <span>WebGL Relativistic Engine</span>
        </div>
      </footer>

    </section>
  );
};
