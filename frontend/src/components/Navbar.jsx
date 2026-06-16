import React, { useState, useEffect } from 'react';
import { Menu, X, Cpu, Calculator } from 'lucide-react';

export default function Navbar({ onOpenQuote, activeSection }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Planner', href: '#planner' },
    { label: 'Estimator', href: '#estimator' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '12px 0' : '20px 0',
        background: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid transparent',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.4rem', fontWeight: 800 }}>
          <Cpu className="text-cyan animate-pulse" size={28} />
          <span style={{ letterSpacing: '-0.03em' }}>
            NEXUS <span className="text-gradient">TECH</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div style={{ display: 'none', gap: '32px', alignItems: 'center' }} className="desktop-menu-wrapper">
          <style dangerouslySetInnerHTML={{__html: `
            @media (min-width: 769px) {
              .desktop-menu-wrapper { display: flex !important; }
              .mobile-toggle { display: none !important; }
            }
          `}} />
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a 
                key={link.href} 
                href={link.href}
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: isActive ? 'hsl(var(--secondary))' : 'hsl(var(--text-muted))',
                  transition: 'var(--transition-fast)',
                  position: 'relative',
                  padding: '6px 0'
                }}
                className="nav-link"
              >
                {link.label}
                {isActive && (
                  <span 
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: 'linear-gradient(90deg, hsl(var(--secondary)), hsl(var(--primary)))',
                      borderRadius: '2px'
                    }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="desktop-menu-wrapper" style={{ display: 'none', alignItems: 'center', gap: '16px' }}>
          <button onClick={onOpenQuote} className="btn btn-glow" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
            <Calculator size={16} />
            Quick Estimate
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="mobile-toggle"
          style={{
            background: 'none',
            border: 'none',
            color: 'hsl(var(--text-main))',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          {navLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: activeSection === link.href.slice(1) ? 'hsl(var(--secondary))' : 'hsl(var(--text-main))',
                padding: '8px 0'
              }}
            >
              {link.label}
            </a>
          ))}
          <button 
            onClick={() => {
              setIsOpen(false);
              onOpenQuote();
            }} 
            className="btn btn-glow" 
            style={{ width: '100%', marginTop: '12px' }}
          >
            <Calculator size={18} />
            Quick Estimate
          </button>
        </div>
      )}
    </nav>
  );
}
