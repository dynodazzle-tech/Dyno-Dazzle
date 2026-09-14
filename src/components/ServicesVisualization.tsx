import React, { useState } from 'react';
import { ECOSYSTEM_NODES } from '../data/siteData';
import { DynamicIcon, Sparkles, ArrowRight } from './Icon';

interface ServicesVisualizationProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesVisualization: React.FC<ServicesVisualizationProps> = ({ onSelectService }) => {
  const [selectedNode, setSelectedNode] = useState<string>(ECOSYSTEM_NODES[0].id);

  const activeNodeData = ECOSYSTEM_NODES.find((n) => n.id === selectedNode) || ECOSYSTEM_NODES[0];

  return (
    <section id="solutions" className="relative py-20 bg-[#070b14] overflow-hidden border-y border-slate-900">
      {/* Background glow */}
      <div className="absolute inset-0 bg-radial-at-c from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/20">
            Interactive Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3 mb-4">
            The Integrated Tech Nexus
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Every layer in the DynoDazzle ecosystem works in synergy. Select any technology domain to explore how it links directly to your business outcomes.
          </p>
        </div>

        {/* Desktop Circular / Radial Nexus Visualizer */}
        <div className="hidden lg:block relative max-w-4xl mx-auto aspect-[16/10] glass-card rounded-3xl p-8 overflow-hidden border border-slate-800">
          {/* Subtle Grid */}
          <div className="absolute inset-0 tech-grid opacity-50" />

          {/* Center Nexus: DynoDazzle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[2px] shadow-2xl shadow-cyan-500/30 animate-pulse">
              <div className="w-full h-full bg-[#070c18] rounded-[14px] flex flex-col items-center justify-center p-2 text-center">
                <Sparkles className="w-6 h-6 text-cyan-400 mb-1" />
                <span className="text-sm font-extrabold text-white tracking-tight">DynoDazzle</span>
                <span className="text-[10px] font-mono text-cyan-300">CORE HUB</span>
              </div>
            </div>
          </div>

          {/* SVG Connecting Laser Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 500">
            {ECOSYSTEM_NODES.map((node, index) => {
              const angleRad = (node.angle * Math.PI) / 180;
              const radiusX = 280;
              const radiusY = 170;
              const x = 400 + radiusX * Math.cos(angleRad);
              const y = 250 + radiusY * Math.sin(angleRad);
              const isSelected = node.id === selectedNode;

              return (
                <g key={node.id}>
                  <line
                    x1="400"
                    y1="250"
                    x2={x}
                    y2={y}
                    stroke={isSelected ? '#38bdf8' : 'rgba(56, 189, 248, 0.15)'}
                    strokeWidth={isSelected ? '2.5' : '1'}
                    strokeDasharray={isSelected ? 'none' : '4 4'}
                    className="transition-all duration-300"
                  />
                  {isSelected && (
                    <circle cx={x} cy={y} r="5" fill="#38bdf8" className="animate-ping opacity-60" />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Orbiting Interactive Domain Buttons */}
          <div className="relative w-full h-full">
            {ECOSYSTEM_NODES.map((node) => {
              const angleRad = (node.angle * Math.PI) / 180;
              // Percentage based placement
              const leftPercent = 50 + 35 * Math.cos(angleRad);
              const topPercent = 50 + 34 * Math.sin(angleRad);
              const isSelected = node.id === selectedNode;

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  style={{
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 px-3 py-2 rounded-xl flex items-center gap-2 font-semibold text-xs transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold scale-110 shadow-lg shadow-cyan-500/40'
                      : 'bg-slate-900/90 text-slate-300 border border-slate-700/80 hover:border-cyan-400/50 hover:bg-slate-800'
                  }`}
                >
                  <DynamicIcon name={node.icon} className="w-4 h-4" />
                  <span>{node.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Domain Detail Bar at bottom */}
          <div className="absolute bottom-4 left-6 right-6 z-30 bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm font-semibold text-white">
                Active Domain: <strong className="text-cyan-300">{activeNodeData.label}</strong>
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                • Fully interoperable across the DynoDazzle stack
              </span>
            </div>
            <button
              onClick={() => onSelectService(activeNodeData.label)}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Build with this</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Adaptive Layout */}
        <div className="lg:hidden space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">DynoDazzle Interconnected Ecosystem</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Tap any technology node below to inspect compatibility:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ECOSYSTEM_NODES.map((node) => {
                const isSelected = node.id === selectedNode;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className={`p-2.5 rounded-xl flex flex-col items-center gap-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                        : 'bg-slate-900/80 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <DynamicIcon name={node.icon} className="w-4 h-4" />
                    <span className="truncate">{node.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-cyan-300 font-semibold">{activeNodeData.label} Ready</span>
              <button
                onClick={() => onSelectService(activeNodeData.label)}
                className="text-cyan-400 font-bold flex items-center gap-1"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
