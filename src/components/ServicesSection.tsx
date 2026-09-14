import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/siteData';
import { ServiceItem } from '../types';
import { DynamicIcon, ArrowRight, CheckCircle2, Sparkles } from './Icon';

interface ServicesSectionProps {
  onSelectServiceForContact: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForContact }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'dev', label: 'Web & Apps' },
    { id: 'ai', label: 'AI & Automation' },
    { id: 'growth', label: 'Growth & Support' },
  ];

  const filteredServices = SERVICES_DATA.filter((s) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'dev') return s.id.includes('web') || s.id.includes('app');
    if (activeTab === 'ai') return s.id.includes('ai') || s.id.includes('auto');
    if (activeTab === 'growth') return s.id.includes('marketing') || s.id.includes('support') || s.id.includes('consult');
    return true;
  });

  return (
    <section id="services" className="relative py-24 bg-[#05070d] tech-grid">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Full-Cycle Digital Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5">
            Everything You Need to Build Digital
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            From technical infrastructure and bespoke applications to high-impact marketing and AI workflows,
            we engineer robust digital foundations designed to scale.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === cat.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((service: ServiceItem) => {
            const isExpanded = expandedService === service.id;

            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="group relative rounded-2xl glass-card p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/40"
              >
                <div>
                  {/* Icon & Category */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-cyan-500/20 group-hover:border-cyan-400/50 group-hover:bg-cyan-950/30 flex items-center justify-center text-cyan-400 transition-all">
                      <DynamicIcon name={service.iconName} className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800">
                      {service.category.split(' ')[0]}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {service.shortDescription}
                  </p>

                  {/* Expanded Features List */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-300 animate-in fade-in duration-200">
                      <p className="font-semibold text-cyan-400 mb-1">Key Deliverables:</p>
                      {service.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-slate-800/70 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setExpandedService(isExpanded ? null : service.id)}
                    className="text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
                  >
                    {isExpanded ? 'Show less' : 'Learn more'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectServiceForContact(service.title)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/btn cursor-pointer"
                    title={`Enquire for ${service.title}`}
                  >
                    <span>Enquire</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
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
