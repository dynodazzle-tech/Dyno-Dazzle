import React from 'react';
import { PROCESS_STEPS } from '../data/siteData';
import { Sparkles, CheckCircle2 } from './Icon';

export const ProcessSection: React.FC = () => {
  return (
    <section id="process" className="relative py-24 bg-[#070b14] border-t border-slate-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Structured Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            From Idea to Reality
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            A transparent, milestone-driven execution cycle designed to eliminate ambiguity and deliver verified results on time.
          </p>
        </div>

        {/* Timeline Cards Container */}
        <div className="relative">
          {/* Desktop connecting track */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-[2px] bg-gradient-to-r from-cyan-500/20 via-blue-500/30 to-indigo-500/20 -translate-y-12 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={step.step}
                className="group relative rounded-2xl glass-card p-6 flex flex-col justify-between border border-slate-800/80 hover:border-cyan-500/40 hover:-translate-y-1 transition-all"
              >
                <div>
                  {/* Step Number Circle */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-mono font-bold text-base shadow-lg shadow-cyan-500/10 group-hover:scale-105 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                      {step.number}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      Stage {idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                {/* Deliverable bullets */}
                <div className="pt-3 border-t border-slate-800/70 space-y-1.5">
                  {step.deliverables.map((deliv, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
