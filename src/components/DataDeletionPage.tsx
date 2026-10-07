import React from 'react';
import { SITE_CONFIG } from '../config/site';
import { ShieldCheck } from './Icon';

export const DataDeletionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 font-sans">
      <main className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-16">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          ← Back to DynoDazzle
        </a>

        <div className="mt-10 rounded-3xl border border-slate-700/80 bg-[#080d1a] p-7 shadow-2xl sm:p-10">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/80 text-cyan-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-400">{SITE_CONFIG.companyName}</p>
              <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">Data Deletion Instructions</h1>
              <p className="mt-2 text-sm text-slate-400">{SITE_CONFIG.displayDomain}</p>
            </div>
          </div>

          <div className="mt-10 space-y-8 text-sm leading-7 text-slate-300">
            <section>
              <h2 className="mb-2 text-lg font-bold text-white">1. Your right to request deletion</h2>
              <p>
                You may request deletion of personal information that you have voluntarily submitted to
                DynoDazzle through our website, enquiries, or supported communication channels.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-bold text-white">2. How to request deletion</h2>
              <p>
                Send a request to{' '}
                <a href="mailto:dynodazzle@gmail.com" className="text-cyan-400 underline">
                  dynodazzle@gmail.com
                </a>{' '}
                with the subject <strong className="text-white">Data Deletion Request</strong>. Include the
                email address or phone number associated with the information you want deleted so that we can
                identify the relevant records.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-bold text-white">3. What happens next</h2>
              <p>
                We will review the request, verify that it relates to the requester where reasonably necessary,
                and remove or anonymize applicable personal information that DynoDazzle is permitted to delete.
                Some information may need to be retained where required for legal, security, accounting, or
                contractual purposes.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-bold text-white">4. Instagram and Meta-related data</h2>
              <p>
                If you interacted with DynoDazzle through an Instagram integration, you may request deletion of
                personal information received or stored by DynoDazzle in connection with that interaction using
                the same process above.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-bold text-white">5. Contact</h2>
              <p>
                Email: <a href="mailto:dynodazzle@gmail.com" className="text-cyan-400 underline">dynodazzle@gmail.com</a>
                <br />
                WhatsApp: <a href="https://wa.me/917770032149" className="text-cyan-400 underline">+91 7770032149</a>
              </p>
            </section>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-5 text-xs text-slate-500">
            Last reviewed: October 2026
          </div>
        </div>
      </main>
    </div>
  );
};
