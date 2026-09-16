import React from 'react';
import { SITE_CONFIG, getWhatsAppUrl } from '../config/site';
import {
  Sparkles,
  MessageCircle,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  ArrowRight,
} from './Icon';
import { Lock } from 'lucide-react';
import { DynoDazzleLogo } from './DynoDazzleLogo';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms, onNavigate, onOpenAdmin }) => {
  return (
    <footer id="main-footer" className="relative bg-[#03050a] border-t border-slate-900 pt-16 pb-20 sm:pb-14 overflow-hidden text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Column 1: Brand Info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <DynoDazzleLogo size="md" />

            <p className="text-xs text-cyan-400 font-mono uppercase tracking-widest">
              Technology. Digital. Innovation.
            </p>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {SITE_CONFIG.subtagline}
            </p>

            {/* Direct Contact Badges */}
            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-cyan-300 transition-colors">
                  {SITE_CONFIG.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                  {SITE_CONFIG.whatsappFormatted} (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{SITE_CONFIG.displayDomain}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-200 font-bold mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('#services')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Technical Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#services')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Digital Marketing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#services')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Website Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#services')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  App Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#services')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  AI Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#services')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Business Automation
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Ecosystem */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-indigo-300 font-bold mb-4 flex items-center gap-1.5">
              <span>Ecosystem</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href={SITE_CONFIG.techClassUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-300 hover:text-indigo-200 font-medium inline-flex items-center gap-1"
                >
                  <span>TechClass</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <p className="text-[11px] text-slate-500">techclass.dynodazzle.in</p>
              </li>
              <li className="pt-2">
                <span className="text-slate-400">DynoDazzle Labs</span>
                <span className="ml-2 text-[10px] text-amber-400/80 bg-amber-950/40 border border-amber-500/20 px-1.5 py-0.5 rounded">
                  Coming Soon
                </span>
              </li>
              <li>
                <span className="text-slate-400">DynoDazzle Apps</span>
                <span className="ml-2 text-[10px] text-amber-400/80 bg-amber-950/40 border border-amber-500/20 px-1.5 py-0.5 rounded">
                  Coming Soon
                </span>
              </li>
              <li>
                <span className="text-slate-400">DynoDazzle Academy</span>
                <span className="ml-2 text-[10px] text-amber-400/80 bg-amber-950/40 border border-amber-500/20 px-1.5 py-0.5 rounded">
                  Coming Soon
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-200 font-bold mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('#about')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  About DynoDazzle
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#contact')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Contact & Enquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#solutions')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Our Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#projects')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Featured Projects
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              {onOpenAdmin && (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="text-slate-500 hover:text-cyan-400 transition-colors text-left flex items-center gap-1.5"
                  >
                    <span>Admin Control Portal</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {SITE_CONFIG.year} {SITE_CONFIG.companyName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={onOpenPrivacy} className="hover:text-slate-200 transition-colors">
              Privacy
            </button>
            <span>•</span>
            <button onClick={onOpenTerms} className="hover:text-slate-200 transition-colors">
              Terms
            </button>
            <span>•</span>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              WhatsApp Contact
            </a>
            {onOpenAdmin && (
              <>
                <span>•</span>
                <button
                  id="footer-admin-btn"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-colors font-medium cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>Admin Access</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
