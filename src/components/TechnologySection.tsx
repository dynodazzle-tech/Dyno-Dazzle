import React from 'react';
import { TECH_CATEGORIES } from '../data/siteData';
import { DynamicIcon, Sparkles } from './Icon';

export const TechnologySection: React.FC = () => {
  return (
    <section id="tech-stack" className="relative py-20 bg-[#05070d]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Modern Engineering Foundation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Technology Categorization
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Modern, industry-tested technologies organized across functional domains to guarantee speed, reliability, and security.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECH_CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="group rounded-2xl glass-card p-6 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 group-hover:bg-cyan-950/40 group-hover:border-cyan-500/40 transition-all">
                <DynamicIcon name={cat.iconName} className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 mb-4 font-mono">{cat.tagline}</p>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                {cat.stack.map((item) => (
                  <span
                    key={item}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-slate-800/90"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
