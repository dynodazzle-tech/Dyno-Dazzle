import React, { useState, useEffect } from 'react';
import { SITE_CONFIG } from '../config/site';
import { Menu, X, ArrowRight, Sparkles, Lock } from 'lucide-react';

interface HeaderProps {
  onStartProjectClick?: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartProjectClick, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#projects' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Ecosystem', href: '#ecosystem' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartProject = () => {
    setIsMobileMenuOpen(false);
    if (onStartProjectClick) {
      onStartProjectClick();
    } else {
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-nav-scrolled py-3.5' : 'glass-nav py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
          aria-label="DynoDazzle Home"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-[1.5px] flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 text-xl tracking-tighter">
                D
              </span>
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              {SITE_CONFIG.companyName}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-cyan-400/80 -mt-1">
              Technology & Digital
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors rounded-lg hover:bg-slate-800/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Button & Subdomain Pill */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={SITE_CONFIG.techClassUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all flex items-center gap-1.5"
            title="DynoDazzle Ecosystem Platform"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span>TechClass</span>
            <span className="text-[10px] text-indigo-400 font-mono">.in</span>
          </a>

          <button
            id="header-start-project-btn"
            onClick={handleStartProject}
            className="relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-900 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 shadow-md shadow-cyan-500/25 hover:shadow-lg hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-900" />
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {onOpenAdmin && (
            <button
              id="header-admin-btn"
              onClick={onOpenAdmin}
              className="p-2.5 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 border border-slate-800 transition-colors"
              title="Admin Portal (Secure Access)"
              aria-label="Open Admin Portal"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          id="mobile-menu-toggle-btn"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
          aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden fixed inset-0 top-[68px] bg-[#05070d]/95 backdrop-blur-2xl z-40 flex flex-col justify-between p-6 overflow-y-auto border-t border-slate-800 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-3 pb-2">
              Navigation
            </div>
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-slate-200 hover:text-cyan-400 hover:bg-slate-800/60 transition-all flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-xs text-slate-500">→</span>
              </button>
            ))}

            <div className="pt-4 border-t border-slate-800/80 mt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 px-3 pb-2">
                Ecosystem Platforms
              </div>
              <a
                href={SITE_CONFIG.techClassUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 font-medium text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>TechClass Platform</span>
                </div>
                <span className="text-xs text-indigo-400 font-mono">techclass.dynodazzle.in</span>
              </a>
            </div>
          </div>

          <div className="pt-6 pb-4 space-y-3">
            <button
              id="mobile-start-project-btn"
              onClick={handleStartProject}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 text-center shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 text-base"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-center text-xs text-slate-500">
              Direct Contact: <a href={`mailto:${SITE_CONFIG.email}`} className="text-cyan-400 underline">{SITE_CONFIG.email}</a>
            </div>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-800 text-xs font-medium text-slate-400 hover:text-white flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Control Portal</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
