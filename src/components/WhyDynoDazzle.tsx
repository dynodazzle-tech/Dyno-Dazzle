import React from 'react';
import { WHY_DYNODAZZLE } from '../data/siteData';
import { DynamicIcon, Sparkles } from './Icon';

export const WhyDynoDazzle: React.FC = () => {
  return (
    <section id="why" className="relative py-24 bg-[#05070d]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Built for Real Outcomes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Why Build With DynoDazzle?
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            We operate at the intersection of technical excellence and commercial pragmatism.
            Here is what distinguishes our engineering approach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_DYNODAZZLE.map((item, index) => (
            <div
              key={item.title}
              className="group relative rounded-2xl glass-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/30"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 group-hover:border-cyan-500/50 group-hover:bg-cyan-950/30 flex items-center justify-center text-cyan-400 mb-5 transition-all">
                <DynamicIcon name={item.iconName} className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center gap-2 text-[11px] font-mono text-cyan-400/80 uppercase">
                <span>Value Pillar 0{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
