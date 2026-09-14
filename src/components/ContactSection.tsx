import React, { useState, useEffect } from 'react';
import { SITE_CONFIG, getWhatsAppUrl } from '../config/site';
import { ContactFormData, ContactApiResponse } from '../types';
import { apiFetch } from '../utils/api';
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Mail,
  Phone,
  Globe,
  Sparkles,
  ArrowRight,
} from './Icon';

interface ContactSectionProps {
  initialService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialService }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: initialService || '',
    budget: '',
    message: '',
    consent: true,
    honeypot: '',
  });

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<ContactApiResponse | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);

  const serviceOptions = [
    'Technical Support',
    'Digital Marketing',
    'Website Development',
    'App Development',
    'AI Solution',
    'Business Automation',
    'Web Application',
    'IT Consulting',
    'Other',
  ];

  const budgetOptions = [
    'Not decided',
    'Under ₹10,000',
    '₹10,000 – ₹25,000',
    '₹25,000 – ₹50,000',
    '₹50,000+',
    'Discuss with DynoDazzle',
  ];

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please enter your full name (at least 2 characters).';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      errors.phone = 'Please enter a valid phone number (at least 7 digits).';
    }

    if (!formData.service) {
      errors.service = 'Please select a required service category.';
    }

    if (!formData.budget) {
      errors.budget = 'Please select your estimated budget range.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Please provide details about your project (at least 10 characters).';
    }

    if (!formData.consent) {
      errors.consent = 'Please agree to be contacted regarding your enquiry.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNetworkError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiFetch<ContactApiResponse>('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = response.data;

      if (response.ok && data?.success) {
        setSubmissionResult(data);
      } else {
        if (data?.errors) {
          setFieldErrors(data.errors);
        } else {
          setNetworkError(
            data?.message ||
              'Something went wrong while sending your enquiry. Please try again or contact us on WhatsApp.'
          );
        }
      }
    } catch (err) {
      console.error('Submission network error:', err);
      setNetworkError('Unable to connect. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      service: '',
      budget: '',
      message: '',
      consent: true,
      honeypot: '',
    });
    setSubmissionResult(null);
    setFieldErrors({});
    setNetworkError(null);
  };

  return (
    <section id="contact" className="relative py-24 bg-[#05070d] tech-grid">
      {/* Background glow */}
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Direct Project Inquiry</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Let's Build Something Digital.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Have an idea, business problem or technology requirement? Tell us what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contact Info & WhatsApp CTA */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card rounded-3xl p-7 border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-3">Direct Channels</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Connect directly with the DynoDazzle engineering and digital services team.
              </p>

              <div className="space-y-4">
                {/* WhatsApp */}
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 hover:border-emerald-400/40 hover:bg-emerald-900/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                      Instant WhatsApp
                    </div>
                    <div className="text-sm font-bold text-white font-mono">
                      {SITE_CONFIG.whatsappFormatted}
                    </div>
                    <div className="text-[11px] text-slate-400">Available for rapid messaging</div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-cyan-400 uppercase tracking-wider">
                      Official Email
                    </div>
                    <div className="text-sm font-bold text-white">{SITE_CONFIG.email}</div>
                    <div className="text-[11px] text-slate-400">For detailed RFPs & requirements</div>
                  </div>
                </a>

                {/* Main Domain */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-indigo-400 uppercase tracking-wider">
                      Parent Domain
                    </div>
                    <div className="text-sm font-bold text-white font-mono">
                      {SITE_CONFIG.displayDomain}
                    </div>
                    <div className="text-[11px] text-slate-400">Main portal & subdomains</div>
                  </div>
                </div>
              </div>

              {/* Note on Authenticity */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                <span>
                  DynoDazzle respects your privacy. Inquiries are processed securely and your details
                  are never shared with external parties.
                </span>
              </div>
            </div>

            {/* Quick WhatsApp Action Banner */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-950/40 via-[#06241a] to-slate-950 border border-emerald-500/30 text-center">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Prefer WhatsApp?
              </span>
              <h4 className="text-base font-bold text-white mt-1 mb-2">
                Chat With Us Directly
              </h4>
              <p className="text-xs text-slate-300 mb-4">
                Message us with your project idea or troubleshooting question anytime.
              </p>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Start WhatsApp Conversation</span>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form or Success State */}
          <div className="lg:col-span-8">
            <div className="glass-card rounded-3xl p-7 sm:p-10 border border-slate-800 shadow-2xl relative">
              {submissionResult ? (
                /* Success Experience Panel */
                <div
                  id="contact-success-panel"
                  className="py-10 text-center animate-in fade-in zoom-in-95 duration-300"
                >
                  <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <h3 className="text-3xl font-extrabold text-white mb-2">Thank You!</h3>
                  <p className="text-lg text-emerald-300 font-semibold mb-2">
                    Your enquiry has been received by DynoDazzle.
                  </p>

                  <p className="text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
                    {submissionResult.emailSent
                      ? "We've sent a confirmation email to your email address."
                      : "Our team has safely recorded your enquiry and will review your requirements promptly."}
                  </p>

                  {submissionResult.enquiryId && (
                    <div className="inline-block px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 mb-8">
                      Reference ID: <span className="text-cyan-300 font-bold">{submissionResult.enquiryId}</span>
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-800/80 max-w-md mx-auto space-y-3">
                    <p className="text-xs text-slate-400 font-medium">Need a faster response?</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <a
                        href={getWhatsAppUrl(
                          `Hello DynoDazzle, following up on my enquiry #${submissionResult.enquiryId}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm shadow-md hover:bg-emerald-400 transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat on WhatsApp</span>
                      </a>

                      <button
                        onClick={handleResetForm}
                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-sm font-semibold transition-all cursor-pointer"
                      >
                        Send Another Enquiry
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* The Contact Form */
                <form id="dynodazzle-contact-form" onSubmit={handleSubmit} noValidate>
                  {/* Anti-spam honeypot (hidden from human users) */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {networkError && (
                    <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">{networkError}</p>
                        <p className="text-xs text-red-400/80 mt-1">
                          You can also reach us directly via WhatsApp at {SITE_CONFIG.whatsappFormatted}.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Full Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                          fieldErrors.name
                            ? 'border-red-500/60 focus:ring-red-500/30'
                            : 'border-slate-800 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                        }`}
                      />
                      {fieldErrors.name && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{fieldErrors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email Address <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. rahul@business.com"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                          fieldErrors.email
                            ? 'border-red-500/60 focus:ring-red-500/30'
                            : 'border-slate-800 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                        }`}
                      />
                      {fieldErrors.email && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{fieldErrors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone Number / WhatsApp <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 9876543210"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                          fieldErrors.phone
                            ? 'border-red-500/60 focus:ring-red-500/30'
                            : 'border-slate-800 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                        }`}
                      />
                      {fieldErrors.phone && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{fieldErrors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Company / Organization */}
                    <div>
                      <label htmlFor="contact-company" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Company / Organization <span className="text-slate-500">(Optional)</span>
                      </label>
                      <input
                        id="contact-company"
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Apex Enterprises"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>

                    {/* Service Required */}
                    <div>
                      <label htmlFor="contact-service" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Service Required <span className="text-cyan-400">*</span>
                      </label>
                      <select
                        id="contact-service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-sm text-white focus:outline-none focus:ring-2 transition-all ${
                          fieldErrors.service
                            ? 'border-red-500/60 focus:ring-red-500/30'
                            : 'border-slate-800 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                        }`}
                      >
                        <option value="" disabled>
                          Select Service
                        </option>
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-slate-900 text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.service && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{fieldErrors.service}</span>
                        </p>
                      )}
                    </div>

                    {/* Budget Range */}
                    <div>
                      <label htmlFor="contact-budget" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Budget Range <span className="text-cyan-400">*</span>
                      </label>
                      <select
                        id="contact-budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-sm text-white focus:outline-none focus:ring-2 transition-all ${
                          fieldErrors.budget
                            ? 'border-red-500/60 focus:ring-red-500/30'
                            : 'border-slate-800 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                        }`}
                      >
                        <option value="" disabled>
                          Select Budget
                        </option>
                        {budgetOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-slate-900 text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.budget && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{fieldErrors.budget}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="mb-5">
                    <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Project Details <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your requirements, key features, target timeframe, or technical problem..."
                      className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all resize-y ${
                        fieldErrors.message
                          ? 'border-red-500/60 focus:ring-red-500/30'
                          : 'border-slate-800 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                      }`}
                    />
                    {fieldErrors.message && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{fieldErrors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Consent Checkbox */}
                  <div className="mb-6">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        id="contact-consent"
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400/30 mt-0.5"
                      />
                      <span className="text-xs text-slate-300">
                        I agree to be contacted by DynoDazzle regarding my enquiry.
                      </span>
                    </label>
                    {fieldErrors.consent && (
                      <p className="text-xs text-red-400 mt-1">{fieldErrors.consent}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <button
                      id="contact-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-slate-900 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Enquiry</span>
                        </>
                      )}
                    </button>

                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Encrypted SSL • Direct Routing to dynodazzle@gmail.com</span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
