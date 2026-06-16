import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import InteractivePlanner from './components/InteractivePlanner';
import CostEstimator from './components/CostEstimator';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // States to sync counts from InteractivePlanner to CostEstimator
  const [plannerCctvCount, setPlannerCctvCount] = useState(0);
  const [plannerPhoneCount, setPlannerPhoneCount] = useState(0);

  // Monitor scroll positioning to update active navigation tab indicator
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'planner', 'estimator', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenQuote = () => {
    const estimatorSection = document.getElementById('estimator');
    if (estimatorSection) {
      estimatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceFromCard = (serviceId) => {
    // Smooth scroll to estimator
    const estimatorSection = document.getElementById('estimator');
    if (estimatorSection) {
      estimatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyPlannerCounts = (cctvs, phones) => {
    setPlannerCctvCount(cctvs);
    setPlannerPhoneCount(phones);
    
    // Smooth scroll to estimator
    const estimatorSection = document.getElementById('estimator');
    if (estimatorSection) {
      estimatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Background glowing gradients & grid overlays */}
      <div className="mesh-bg" />
      <div className="mesh-grid" />

      {/* Primary Sticky Header */}
      <Navbar 
        onOpenQuote={handleOpenQuote} 
        activeSection={activeSection} 
      />

      {/* Main Sections */}
      <main>
        <Hero onOpenQuote={handleOpenQuote} />
        
        <Services onSelectService={handleSelectServiceFromCard} />
        
        <InteractivePlanner onApplyToEstimator={handleApplyPlannerCounts} />
        
        <CostEstimator 
          plannerCctvs={plannerCctvCount} 
          plannerPhones={plannerPhoneCount} 
        />
        
        <ContactForm />
      </main>

      {/* Footer & Admin triggers */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Admin Central Dashboard Modal */}
      <AdminDashboard 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />
    </>
  );
}
