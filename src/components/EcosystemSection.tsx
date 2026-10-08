import React from 'react';
import { ECOSYSTEM_PRODUCTS } from '../config/ecosystem';
import { EcosystemProduct } from '../types';
import { Sparkles, Lock, Boxes } from './Icon';

export const EcosystemSection: React.FC = () => {
  return (
    <section id="ecosystem" className="relative py-24 bg-[#05070d] tech-grid">
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Future Products</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5">
            The DynoDazzle Ecosystem
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Our core focus is helping businesses grow with websites, digital marketing, AI automation and technical solutions.
            Future DynoDazzle products will be introduced here when they are ready.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-cyan-400" />
            <span>More Platforms Coming Soon</span>
          </h4>
          <span className="text-xs text-slate-400">Expanding carefully, one useful product at a time</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ECOSYSTEM_PRODUCTS.map((platform: EcosystemProduct) => (
            <div
              key={platform.id}
              className="rounded-2xl glass-card p-6 flex flex-col justify-between border border-slate-800/80 hover:border-cyan-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded">
                    {platform.subdomain}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" />
                    <span>{platform.badge || 'Coming Soon'}</span>
                  </span>
                </div>

                <h5 className="text-lg font-bold text-white mb-1.5">{platform.name}</h5>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {platform.type}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {platform.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Status: In Development</span>
                <span className="text-slate-600 font-mono">Future Release</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
