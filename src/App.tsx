import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { HowWeHelpSection } from './components/HowWeHelpSection';
import { ProjectsSection } from './components/ProjectsSection';
import { EcosystemSection } from './components/EcosystemSection';
import { WhyDynoDazzle } from './components/WhyDynoDazzle';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { LegalModal } from './components/LegalModal';
import { AdminModal } from './components/Admin/AdminModal';

export default function App() {
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<string>('');
  const [legalModalOpen, setLegalModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms'>('privacy');
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);

  // Auto-open admin if navigated to #admin or /admin or pressed Alt+A
  useEffect(() => {
    const checkAdminRoute = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setAdminModalOpen(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setAdminModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.querySelector(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (serviceTitle: string) => {
    // Map ecosystem node titles or card titles to closest service category
    let mappedService = serviceTitle;
    if (serviceTitle.includes('AI') || serviceTitle === 'AI Solutions') {
      mappedService = 'AI Solutions & Full-Stack Apps';
    } else if (serviceTitle.includes('Web') || serviceTitle === 'Custom Software') {
      mappedService = 'Website Development';
    } else if (serviceTitle.includes('Mobile') || serviceTitle.includes('App')) {
      mappedService = 'App Development';
    } else if (serviceTitle.includes('Support')) {
      mappedService = 'Technical Support';
    } else if (serviceTitle.includes('Marketing') || serviceTitle.includes('Growth')) {
      mappedService = 'Digital Marketing & Growth';
    } else if (serviceTitle.includes('Automation')) {
      mappedService = 'Business Automation';
    }

    setSelectedServiceForContact(mappedService);
    scrollToSection('#contact');
  };

  const openLegal = (tab: 'privacy' | 'terms') => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Fixed Sticky Glass Header */}
      <Header
        onStartProjectClick={() => scrollToSection('#contact')}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Main Page Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section (Digital Technology Command Center) */}
        <Hero
          onStartProject={() => scrollToSection('#contact')}
          onExploreServices={() => scrollToSection('#services')}
        />

        {/* 2. Services Section (Interactive Grid) */}
        <ServicesSection onSelectServiceForContact={handleSelectService} />

        {/* 3. How We Help Section (3 Core Transformation Pillars) */}
        <HowWeHelpSection onSelectServiceForContact={handleSelectService} />

        {/* 4. Projects Portfolio (Directly Managed by Admin Dashboard) */}
        <ProjectsSection onSelectProjectForContact={handleSelectService} />

        {/* 5. DynoDazzle Ecosystem (Featuring TechClass & Subdomain Roadmap) */}
        <EcosystemSection />

        {/* 6. Why DynoDazzle & About (Engineering Value Pillars & Core Principles) */}
        <WhyDynoDazzle />
        <AboutSection />

        {/* 7. Contact Section (Direct Channels & Preserved Form Backend) */}
        <ContactSection initialService={selectedServiceForContact} />
      </main>

      {/* Multi-column Footer */}
      <Footer
        onOpenPrivacy={() => openLegal('privacy')}
        onOpenTerms={() => openLegal('terms')}
        onNavigate={scrollToSection}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Floating WhatsApp Action Beacon */}
      <WhatsAppFloatingButton />

      {/* Legal Privacy & Terms Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        activeTab={legalModalTab}
        onClose={() => setLegalModalOpen(false)}
        onSwitchTab={setLegalModalTab}
      />

      {/* Admin Dashboard & 2-Factor OTP Modal (Preserved Alt+A / #admin portal) */}
      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => {
          setAdminModalOpen(false);
          if (window.location.hash === '#admin') {
            history.replaceState(null, '', window.location.pathname);
          }
        }}
      />
    </div>
  );
}
