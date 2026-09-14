import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ServicesVisualization } from './components/ServicesVisualization';
import { ProjectsSection } from './components/ProjectsSection';
import { WhyDynoDazzle } from './components/WhyDynoDazzle';
import { ProcessSection } from './components/ProcessSection';
import { EcosystemSection } from './components/EcosystemSection';
import { AboutSection } from './components/AboutSection';
import { TechnologySection } from './components/TechnologySection';
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
      {/* Top Fixed Header */}
      <Header
        onStartProjectClick={() => scrollToSection('#contact')}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Main Page Sections */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero
          onStartProject={() => scrollToSection('#contact')}
          onExploreServices={() => scrollToSection('#services')}
        />

        {/* Services Cards */}
        <ServicesSection onSelectServiceForContact={handleSelectService} />

        {/* Interactive Ecosystem Visualization */}
        <ServicesVisualization onSelectService={handleSelectService} />

        {/* Dynamic Showcase Portfolio Projects (Admin Managed) */}
        <ProjectsSection onSelectProjectForContact={handleSelectService} />

        {/* Why DynoDazzle Pillars */}
        <WhyDynoDazzle />

        {/* 5-Step Process Timeline */}
        <ProcessSection />

        {/* DynoDazzle Ecosystem (featuring TechClass & Future Subdomains) */}
        <EcosystemSection />

        {/* Technology Categorization */}
        <TechnologySection />

        {/* About DynoDazzle */}
        <AboutSection />

        {/* Contact Section & Live Backend Form */}
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

      {/* Admin Dashboard & 2-Factor OTP Modal */}
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
