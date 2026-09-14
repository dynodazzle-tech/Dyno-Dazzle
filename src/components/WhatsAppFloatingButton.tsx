import React, { useState } from 'react';
import { SITE_CONFIG, getWhatsAppUrl } from '../config/site';
import { MessageCircle, X } from './Icon';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end pointer-events-auto select-none">
      {/* Tooltip Badge */}
      {showTooltip && (
        <div className="mb-2 mr-1 px-2.5 py-1 rounded-lg bg-slate-900/95 border border-emerald-500/40 text-[11px] text-white shadow-xl shadow-black/60 backdrop-blur-md flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>WhatsApp Chat</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white ml-1 p-0.5"
            aria-label="Dismiss tooltip"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        id="floating-whatsapp-btn"
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="relative group w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
        aria-label={`Chat with DynoDazzle on WhatsApp at ${SITE_CONFIG.whatsappFormatted}`}
      >
        {/* Radar ping ring */}
        <span className="absolute -inset-0.5 rounded-full bg-emerald-400/25 animate-ping pointer-events-none opacity-60" />

        <MessageCircle className="w-5 h-5 text-slate-950 fill-slate-950 group-hover:scale-105 transition-transform" />

        {/* Small online indicator */}
        <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-300 border-[1.5px] border-[#05070d]" />
      </a>
    </div>
  );
};
