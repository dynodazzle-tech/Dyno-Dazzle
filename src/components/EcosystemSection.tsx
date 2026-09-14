import React from 'react';
import { ECOSYSTEM_PRODUCTS } from '../config/ecosystem';
import { SITE_CONFIG } from '../config/site';
import { EcosystemProduct } from '../types';
import {
  ExternalLink,
  ArrowRight,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Lock,
  FlaskConical,
  Boxes,
} from './Icon';

export const EcosystemSection: React.FC = () => {
  const techClassProduct = ECOSYSTEM_PRODUCTS.find((p) => p.id === 'techclass') || ECOSYSTEM_PRODUCTS[0];
  const futureProducts = ECOSYSTEM_PRODUCTS.filter((p) => p.id !== 'techclass');

  return (
    <section id="ecosystem" className="relative py-24 bg-[#05070d] tech-grid">
      {/* Glow highlight */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Multi-Platform Vision</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5">
            The DynoDazzle Ecosystem
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            DynoDazzle is more than a single service. We are building a growing ecosystem of digital products,
            technology services and specialized platforms across interconnected subdomains.
          </p>
        </div>

        {/* Featured Ecosystem Hero Card: TechClass */}
        <div className="relative rounded-3xl overflow-hidden glass-card border border-indigo-500/30 p-8 sm:p-10 lg:p-12 mb-12 shadow-2xl shadow-indigo-950/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/15 via-emerald-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: TechClass Description & Features */}
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                  {techClassProduct.type}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Production Subdomain</span>
                </span>

                <span className="text-xs font-mono text-slate-400 bg-slate-900/90 px-2.5 py-0.5 rounded-md border border-slate-800">
                  {techClassProduct.subdomain}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
                {techClassProduct.name}
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
                {techClassProduct.description}
              </p>

              {/* Highlight Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {techClassProduct.highlights?.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  id="explore-techclass-btn"
                  href={techClassProduct.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Explore TechClass</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <span className="text-xs text-slate-400 font-mono">
                  URL: {techClassProduct.url}
                </span>
              </div>
            </div>

            {/* Right Column: Visual Subdomain Graphic Badge */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-xs aspect-square rounded-2xl bg-gradient-to-br from-indigo-950/60 via-[#0d152a] to-slate-950 border border-indigo-500/40 p-6 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between border-b border-indigo-900/50 pb-3">
                  <span className="text-[11px] font-mono text-indigo-300">SUBDOMAIN LIVE</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <div className="my-auto py-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-white">TechClass</h4>
                  <p className="text-xs text-indigo-300/80 font-mono mt-0.5">techclass.dynodazzle.in</p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Tests • PDFs • Mock Papers • Practice
                  </p>
                </div>

                <div className="pt-3 border-t border-indigo-900/50 text-center">
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Independent Student Portal</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Future Ecosystem Platforms (Clearly Labeled Coming Soon) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Boxes className="w-5 h-5 text-cyan-400" />
              <span>More Platforms Coming Soon</span>
            </h4>
            <span className="text-xs text-slate-400">Expanding DynoDazzle Roadmap</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {futureProducts.map((platform: EcosystemProduct) => (
              <div
                key={platform.id}
                className="rounded-2xl glass-card p-6 flex flex-col justify-between border border-slate-800/80 hover:border-slate-700 transition-all opacity-90 hover:opacity-100"
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
                  <span className="text-slate-600 font-mono">2026 Release</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
