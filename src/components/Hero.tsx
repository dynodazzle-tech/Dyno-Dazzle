import React from 'react';
import { SITE_CONFIG, getWhatsAppUrl } from '../config/site';
import { HeroAnimation } from './HeroAnimation';
import {
  ArrowRight,
  MessageCircle,
  Sparkles,
  Globe,
  Smartphone,
  Cpu,
  Cloud,
  TrendingUp,
  LifeBuoy,
} from './Icon';
import { DynoDazzleLogo } from './DynoDazzleLogo';

interface HeroProps {
  onStartProject: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartProject, onExploreServices }) => {
  const ecosystemPills = [
    { label: 'AI Intelligence', icon: Sparkles, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { label: 'Web Development', icon: Globe, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    { label: 'Mobile Apps', icon: Smartphone, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { label: 'Automation', icon: Cpu, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { label: 'Digital Marketing', icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Tech Support', icon: LifeBuoy, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  ];

  return (
    <section
      id="home"
      className="relative min-h-[90vh] lg:min-h-[88vh] flex items-center pt-24 pb-12 md:pt-28 md:pb-16 overflow-hidden tech-grid"
    >
      <HeroAnimation />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Top Brand Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-5 backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>Digital Technology Command Center</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-[3.75rem] font-extrabold tracking-tight text-white leading-[1.12] mb-5">
              Technology That Makes Your Business{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                Move.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-7">
              Digital solutions, websites, applications, automation and technical support designed around your business.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mb-6">
              <button
                id="hero-start-project-btn"
                onClick={onStartProject}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-900 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-explore-services-btn"
                onClick={onExploreServices}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-200 bg-slate-900/80 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all cursor-pointer"
              >
                <span>Explore Services</span>
              </button>

              <a
                id="hero-whatsapp-btn"
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-medium text-xs sm:text-sm text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 transition-all cursor-pointer"
                title="Chat with DynoDazzle on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp +91 7770032149</span>
              </a>
            </div>

            {/* Quick Subtitle Trust Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
                AI Solutions
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
                Web & Mobile
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
                Business Automation
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
                Technical Support
              </span>
            </div>
          </div>

          {/* Right Column: Compact Futuristic Technology Network Graphic */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-square rounded-3xl glass-card p-5 sm:p-6 flex flex-col justify-between overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-950/40">
              {/* Outer decorative subtle glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-cyan-500/10 via-transparent to-indigo-500/20 pointer-events-none" />

              {/* Status Header */}
              <div className="flex items-center justify-between z-10 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-medium text-slate-300">
                    ecosystem.dynodazzle.in
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  ONLINE • ACTIVE
                </span>
              </div>

              {/* Orbital Interactive Centerpiece */}
              <div className="relative my-auto py-4 flex items-center justify-center">
                {/* Outer Rotating SVG Orbit */}
                <svg
                  className="absolute w-56 h-56 sm:w-64 sm:h-64 animate-[spin_25s_linear_infinite]"
                  viewBox="0 0 240 240"
                  aria-hidden="true"
                >
                  <circle
                    cx="120"
                    cy="120"
                    r="105"
                    fill="none"
                    stroke="rgba(56, 189, 248, 0.15)"
                    strokeWidth="1.5"
                    strokeDasharray="6 8"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r="75"
                    fill="none"
                    stroke="rgba(99, 102, 241, 0.2)"
                    strokeWidth="1"
                  />
                  <circle cx="225" cy="120" r="4" fill="#38bdf8" />
                  <circle cx="120" cy="15" r="4" fill="#818cf8" />
                  <circle cx="45" cy="120" r="3" fill="#06b6d4" />
                </svg>

                {/* Core Brand Nexus */}
                <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-slate-900/95 via-[#070b14] to-slate-950 border border-cyan-400/40 p-2 shadow-2xl shadow-cyan-500/20 flex flex-col items-center justify-center text-center group">
                  <DynoDazzleLogo size="md" showText={false} />
                  <span className="text-[11px] font-bold text-white tracking-tight mt-1">DynoDazzle</span>
                  <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-wider">Command Hub</span>
                </div>

                {/* Floating Technology Nodes */}
                <div className="absolute top-1 left-2 z-20 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-[10px] text-cyan-300 flex items-center gap-1 shadow-md animate-float">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  <span>AI Solutions</span>
                </div>

                <div className="absolute bottom-2 right-2 z-20 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-indigo-500/30 text-[10px] text-indigo-300 flex items-center gap-1 shadow-md animate-float [animation-delay:1.5s]">
                  <Cloud className="w-2.5 h-2.5 text-indigo-400" />
                  <span>Cloud & Apps</span>
                </div>

                <div className="absolute top-4 right-1 z-20 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-emerald-500/30 text-[10px] text-emerald-300 flex items-center gap-1 shadow-md animate-float [animation-delay:2.5s]">
                  <Globe className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Web & Mobile</span>
                </div>
              </div>

              {/* Bottom Quick Grid */}
              <div className="z-10 pt-2.5 border-t border-slate-800/80">
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  {ecosystemPills.slice(0, 6).map((p) => (
                    <span
                      key={p.label}
                      className={`text-[9px] font-medium px-1.5 py-0.5 rounded border flex items-center justify-center gap-1 ${p.color}`}
                    >
                      <p.icon className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{p.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
