import React, { useState, useEffect } from 'react';
import { ProjectItem } from '../types';
import { Sparkles, ArrowRight, ExternalLink, Layers, CheckCircle2 } from 'lucide-react';

interface ProjectsSectionProps {
  onSelectProjectForContact?: (category: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onSelectProjectForContact }) => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProjects(data.data);
        }
      })
      .catch((err) => console.error('Failed to load projects:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'AI Solutions & Automation', 'Web Platforms & Education', 'Digital Marketing & Funnels', 'Mobile & App Development'];

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.category.toLowerCase().includes(activeCategory.split(' ')[0].toLowerCase());
  });

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Proven Business Impact</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Featured Engineering & Work
        </h2>
        <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
          Explore real-world client solutions engineered by DynoDazzle — from enterprise AI workflow automation and custom cloud web platforms to cross-platform mobile apps.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/25'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Projects */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900/70 to-[#080d1a] overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/20 transition-all duration-300"
            >
              {/* Image Preview */}
              {project.imageUrl && (
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900/90 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>
                  {project.metrics && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{project.metrics}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-medium text-slate-400">
                      Client: <strong className="text-slate-200">{project.client}</strong>
                    </span>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-cyan-400 transition-colors p-1"
                        title="View Live"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
                    {project.summary}
                  </p>

                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack?.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px] font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectProjectForContact) {
                        onSelectProjectForContact(project.category);
                      } else {
                        const contact = document.querySelector('#contact');
                        contact?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors group/btn"
                  >
                    <span>Request Similar Solution</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
