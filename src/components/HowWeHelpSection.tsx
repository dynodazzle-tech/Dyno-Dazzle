import React from 'react';
import {
  Globe,
  Smartphone,
  Cpu,
  Sparkles,
  LifeBuoy,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from './Icon';

interface HowWeHelpSectionProps {
  onSelectServiceForContact: (serviceTitle: string) => void;
}

export const HowWeHelpSection: React.FC<HowWeHelpSectionProps> = ({ onSelectServiceForContact }) => {
  const pillars = [
    {
      id: 'presence',
      title: 'Digital Presence & Platforms',
      badge: 'Web & Mobile',
      icon: Globe,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
      description:
        'Fast, accessible, and conversion-engineered web portals and cross-platform mobile apps for iOS & Android.',
      items: [
        'Custom high-performance websites (<1s load time)',
        'Full-stack web applications & client dashboards',
        'Cross-platform iOS and Android mobile apps',
      ],
      serviceTarget: 'Website Development',
    },
    {
      id: 'automation',
      title: 'Automation & Intelligent Systems',
      badge: 'AI & Speed',
      icon: Cpu,
      color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400',
      description:
        'Streamline operations, eliminate manual bottlenecks, and plug predictive AI logic straight into your daily workflows.',
      items: [
        'Automated lead management & WhatsApp pipelines',
        'Custom business AI assistants & knowledge retrieval',
        'Cross-platform trigger-action system integration',
      ],
      serviceTarget: 'AI Solution',
    },
    {
      id: 'growth',
      title: 'Growth & Operational Support',
      badge: '24/7 Operations',
      icon: LifeBuoy,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      description:
        'Targeted digital marketing funnels coupled with dedicated 24/7 technical troubleshooting and system maintenance.',
      items: [
        'Performance marketing & high-conversion lead generation',
        '24/7 responsive ticketing & incident troubleshooting',
        'System health audits & IT architecture advisory',
      ],
      serviceTarget: 'Technical Support',
    },
  ];

  return (
    <section id="solutions" className="relative py-20 bg-[#070b14] border-t border-slate-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Integrated Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            How We Help Businesses Grow
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            We simplify modern technology into three core transformation pillars designed to deliver measurable commercial results.
          </p>
        </div>

        {/* 3 Unified Pillar Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="group relative rounded-2xl glass-card p-7 sm:p-8 flex flex-col justify-between border border-slate-800 hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.color} border flex items-center justify-center`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-md">
                      Pillar 0{idx + 1}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    {pillar.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 mb-3 group-hover:text-cyan-300 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {pillar.description}
                  </p>

                  {/* Bullet highlights */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-800/80 mb-6">
                    {pillar.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-4 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => onSelectServiceForContact(pillar.serviceTarget)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900/80 border border-slate-700/80 hover:border-cyan-500/50 hover:bg-cyan-950/30 hover:text-cyan-300 transition-all cursor-pointer"
                  >
                    <span>Request Solution</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
