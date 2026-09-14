import React from 'react';
import { SITE_CONFIG } from '../config/site';
import { Sparkles, CheckCircle2, ShieldCheck, Compass, Zap } from './Icon';

export const AboutSection: React.FC = () => {
  const domains = [
    'Technology & Architecture',
    'Digital Services & Strategy',
    'High-Conversion Marketing',
    'Performant Websites',
    'Mobile & Web Applications',
    'Business Process Automation',
    'Practical AI Workflows',
    'Dependable Technical Support',
    'Specialized Education Platforms',
  ];

  return (
    <section id="about" className="relative py-24 bg-[#070b14] border-t border-slate-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission & Story */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>About DynoDazzle</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              Building Digital Solutions With Purpose
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              <p>
                <strong>DynoDazzle</strong> brings technology, creativity and practical problem-solving
                together to help businesses and individuals build a stronger, more resilient digital presence.
              </p>
              <p className="text-slate-400 text-sm sm:text-base">
                In an era crowded with superficial trends, we prioritize durable software, real-world utility,
                and seamless execution. Whether you need a lightning-fast commercial website, an automated
                client-acquisition engine, or dedicated 24/7 technical troubleshooting, we provide unified expertise
                under one accountable roof.
              </p>
              <p className="text-slate-400 text-sm sm:text-base">
                Through our ecosystem model, we also launch dedicated platforms like <strong>TechClass</strong>,
                delivering targeted tools to empower learners and professionals with tailored study materials.
              </p>
            </div>

            {/* Core Domain Badges */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-4">
                Core Domains of Execution
              </h4>
              <div className="flex flex-wrap gap-2">
                {domains.map((domain) => (
                  <span
                    key={domain}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{domain}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Values Card */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-3xl p-8 border border-slate-800 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <span>Our Principles</span>
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Authentic Craft</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Every line of code and user interface is tested for responsiveness, accessibility, and high performance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Practical Agility</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      No bloated overheads or unnecessary dependencies. We deliver lean, maintainable solutions tailored to your operational scale.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Ecosystem Synergy</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Each platform, from dynodazzle.in to techclass.dynodazzle.in, shares a commitment to clean design and reliable uptime.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Info */}
              <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Domain: <strong className="text-cyan-300">dynodazzle.in</strong></span>
                <span>Contact: <strong className="text-cyan-300">+91 7770032149</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
