import React, { useEffect } from 'react';
import { SITE_CONFIG } from '../config/site';
import { X, ShieldCheck } from './Icon';

interface LegalModalProps {
  isOpen: boolean;
  activeTab: 'privacy' | 'terms';
  onClose: () => void;
  onSwitchTab: (tab: 'privacy' | 'terms') => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  activeTab,
  onClose,
  onSwitchTab,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="legal-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl glass-card border border-slate-700/80 bg-[#080d1a] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="legal-modal-title" className="text-lg font-bold text-white">
                {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h3>
              <p className="text-xs text-slate-400">{SITE_CONFIG.companyName} • dynodazzle.in</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-1">
              <button
                onClick={() => onSwitchTab('privacy')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'privacy'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Privacy
              </button>
              <button
                onClick={() => onSwitchTab('terms')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'terms'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Terms
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close legal modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
          {activeTab === 'privacy' ? (
            <>
              <div>
                <h4 className="text-base font-bold text-white mb-2">1. Overview</h4>
                <p>
                  This Privacy Policy explains how <strong>{SITE_CONFIG.companyName}</strong> ("we",
                  "our", or "us"), operating at <strong>{SITE_CONFIG.displayDomain}</strong>, collects,
                  uses, and protects your personal information when you browse our website or submit an enquiry.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">2. Information We Collect</h4>
                <p>
                  When you voluntarily complete our project enquiry form, we collect the details you provide:
                  your full name, email address, phone number, company name, service interest, budget range, and
                  project message. We collect this solely to communicate regarding your requested service.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">3. How We Use Your Data</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li>To review and respond to your technical and business inquiries.</li>
                  <li>To coordinate project scopes, proposals, and estimates.</li>
                  <li>To deliver relevant updates regarding your requested solutions.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">4. Data Protection & Sharing</h4>
                <p>
                  We do not sell, lease, or trade your contact information to third-party advertisers. Your
                  information is processed securely. Outbound email workflows utilize secure SMTP communication.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">5. Subdomains & Ecosystem Platforms</h4>
                <p>
                  DynoDazzle operates affiliated platforms such as <strong>techclass.dynodazzle.in</strong>.
                  Each platform adheres to consistent data privacy standards.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">6. Contact for Privacy Inquiries</h4>
                <p>
                  If you wish to access, modify, or delete any personal details submitted via our contact forms,
                  please write to us at{' '}
                  <a href={`mailto:${SITE_CONFIG.email}`} className="text-cyan-400 underline">
                    {SITE_CONFIG.email}
                  </a>{' '}
                  or contact WhatsApp: {SITE_CONFIG.whatsappFormatted}.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="text-base font-bold text-white mb-2">1. Terms Acceptance</h4>
                <p>
                  By accessing or using the website of <strong>{SITE_CONFIG.companyName}</strong> (
                  <strong>{SITE_CONFIG.displayDomain}</strong>), you acknowledge these terms of service.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">2. Technology & Services Scope</h4>
                <p>
                  DynoDazzle provides digital services including technical support, IT consulting, digital
                  marketing, website development, mobile application engineering, AI solutions, and business
                  automation. All formal project engagements are subject to independent written agreements
                  defining milestones, deliverables, and commercial arrangements.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">3. Subdomains & Ecosystem</h4>
                <p>
                  Services or portals operating under subdomains (e.g.,{' '}
                  <span className="font-mono text-cyan-300">techclass.dynodazzle.in</span>) are part of the
                  DynoDazzle ecosystem. Specific features, access rules, or terms applicable to those platforms
                  govern student material and exams.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">4. Intellectual Property</h4>
                <p>
                  The brand name DynoDazzle, logos, website layout, graphics, and codebase are the proprietary
                  property of DynoDazzle. Client deliverables remain owned by the client upon completion of
                  agreed contractual terms.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">5. Inquiries & Communication</h4>
                <p>
                  For questions regarding these terms, contact us via email at{' '}
                  <a href={`mailto:${SITE_CONFIG.email}`} className="text-cyan-400 underline">
                    {SITE_CONFIG.email}
                  </a>{' '}
                  or phone/WhatsApp at {SITE_CONFIG.whatsappFormatted}.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
          <span>Last reviewed: September 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
