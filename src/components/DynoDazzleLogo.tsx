import React from 'react';

interface DynoDazzleLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const DynoDazzleLogo: React.FC<DynoDazzleLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Precision Brand Icon without white background */}
      <div className={`relative ${sizeClasses[size]} shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(6,182,212,0.35)]"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="coralArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d4d" />
              <stop offset="60%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>

            <linearGradient id="cyanArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="70%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>

            <linearGradient id="innerDGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>

          {/* Outer Coral Orbital Arc (from user's logo) */}
          <path
            d="M 52 10 A 42 42 0 1 0 52 94"
            stroke="url(#coralArcGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Inner Cyan/Teal Concentric Orbital Track (from user's logo) */}
          <path
            d="M 46 19 A 33 33 0 1 0 46 85"
            stroke="url(#cyanArcGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="95 10"
          />

          {/* Floating Mosaic App / Technology Cluster (from user's logo top-right cluster) */}
          <g transform="translate(42, 10)">
            {/* Tile 1: Social / Facebook Blue */}
            <rect x="18" y="4" width="7" height="7" rx="2" fill="#1877f2" />
            <path d="M 23 8 L 23 6 Q 23 5 22 5" stroke="#fff" strokeWidth="1" strokeLinecap="round" />

            {/* Tile 2: Coral / Pinterest Red */}
            <rect x="28" y="2" width="7" height="7" rx="2" fill="#e60023" />
            <circle cx="31.5" cy="5.5" r="1.5" fill="#fff" />

            {/* Tile 3: Cyan Twitter/Bird */}
            <rect x="8" y="9" width="7" height="7" rx="2" fill="#00c4ff" />
            <circle cx="11.5" cy="12.5" r="1.2" fill="#fff" />

            {/* Tile 4: Purple / Instagram Gradient */}
            <rect x="18" y="14" width="7" height="7" rx="2" fill="#a855f7" />
            <rect x="20" y="16" width="3" height="3" rx="0.8" stroke="#fff" strokeWidth="0.8" fill="none" />

            {/* Tile 5: LinkedIn Cyan-Navy */}
            <rect x="28" y="12" width="7" height="7" rx="2" fill="#0a66c2" />
            <circle cx="30" cy="14" r="0.8" fill="#fff" />

            {/* Tile 6: YouTube Red */}
            <rect x="11" y="19" width="7" height="7" rx="2" fill="#ff0033" />
            <polygon points="13.5,21.5 13.5,23.5 15.5,22.5" fill="#fff" />

            {/* Tile 7: WhatsApp Emerald */}
            <rect x="21" y="23" width="7" height="7" rx="2" fill="#25d366" />
            <circle cx="24.5" cy="26.5" r="1.3" fill="#fff" />

            {/* Tile 8: Emerald Tech App */}
            <rect x="31" y="21" width="7" height="7" rx="2" fill="#10b981" />
          </g>

          {/* Center Brand Monogram "D" */}
          <text
            x="40"
            y="65"
            fontSize="30"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            fill="url(#innerDGrad)"
            textAnchor="middle"
          >
            D
          </text>
        </svg>

        {/* Live Active Beacon */}
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400" />
      </div>

      {/* Brand Text formatted cleanly to match Dark Theme */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              DYNO
            </span>
            <span className="text-lg sm:text-xl font-black tracking-tight text-[#f43f5e] group-hover:text-rose-400 transition-colors">
              DAZZLE
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-cyan-400/90 font-semibold mt-0.5">
            Digital Marketing Agency & Tech
          </span>
        </div>
      )}
    </div>
  );
};
