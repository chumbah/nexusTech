import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, Activity, ArrowRight, Server } from 'lucide-react';

export default function Hero({ onOpenQuote }) {
  const words = [
    'Web Development',
    'Web Design & UI/UX',
    'POS Software Systems',
    'Enterprise Networking',
    'CCTV Security Systems',
    'IP Phone Networks'
  ];
  
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenWords = 2000;

  useEffect(() => {
    let timer;
    const fullWord = words[currentWordIdx];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(fullWord.substring(0, currentText.length - 1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText(fullWord.substring(0, currentText.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && currentText === fullWord) {
      timer = setTimeout(() => setIsDeleting(true), delayBetweenWords);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIdx((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIdx]);

  return (
    <section 
      id="home" 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        padding: '120px 0 80px 0',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '60px',
            alignItems: 'center'
          }}
          className="hero-grid"
        >
          <style dangerouslySetInnerHTML={{__html: `
            @media (max-width: 992px) {
              .hero-grid {
                grid-template-columns: 1fr !important;
                text-align: center;
              }
              .hero-buttons {
                justify-content: center;
              }
              .mock-terminal-wrapper {
                margin: 0 auto;
                max-width: 450px;
              }
            }
          `}} />

          {/* Left Text Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                borderRadius: '9999px',
                width: 'fit-content',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'hsl(var(--primary))'
              }}
              className="animate-float"
            >
              <Activity size={14} className="text-purple" />
              <span>NEXT-GEN ENTERPRISE SOLUTIONS</span>
            </div>
            
            <h1 style={{ fontSize: '3.6rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: '1.1' }}>
              Digital & Hardware <br />
              <span className="text-gradient">Infrastructure</span> Engineered.
            </h1>

            <div style={{ minHeight: '40px', fontSize: '1.6rem', fontWeight: 500, color: 'hsl(var(--text-muted))' }}>
              We specialize in <span className="text-cyan" style={{ borderRight: '2px solid hsl(var(--secondary))', paddingRight: '4px', animation: 'blink 0.8s infinite' }}>{currentText}</span>
              <style>{`
                @keyframes blink {
                  50% { border-color: transparent; }
                }
              `}</style>
            </div>

            <p style={{ color: 'hsl(var(--text-muted))', fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.7' }}>
              Nexus Tech Solutions bridges software architecture and hardware engineering. We build high-performance web systems, custom POS architectures, enterprise-grade server networks, secure CCTV matrices, and integrated IP PBX phone systems.
            </p>

            <div className="hero-buttons" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
              <button onClick={onOpenQuote} className="btn btn-glow">
                Request Service Quote
                <ArrowRight size={18} />
              </button>
              <a href="#services" className="btn btn-secondary">
                Explore Core Services
              </a>
            </div>
          </div>

          {/* Right Mock Tech Node Visualizer */}
          <div className="mock-terminal-wrapper" style={{ width: '100%' }}>
            <div 
              className="glass-panel animate-float"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              {/* Terminal Title Bar */}
              <div 
                style={{
                  background: 'rgba(0, 0, 0, 0.15)',
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
                </div>
                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'hsl(var(--text-dim))' }}>
                  system_status.sh
                </span>
                <Server size={14} className="text-cyan" />
              </div>

              {/* Terminal Screen */}
              <div 
                style={{
                  padding: '24px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: '#e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  background: '#1d1916'
                }}
              >
                {/* Server Status Lines */}
                <div>
                  <span style={{ color: 'hsl(var(--secondary))' }}>$</span> init_nexus_services --verbose
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: 'hsl(var(--text-muted))' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>&gt; Web Dev Node:</span>
                    <span style={{ color: '#27c93f' }}>ACTIVE [100ms]</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>&gt; CCTV Matrix:</span>
                    <span style={{ color: '#27c93f' }}>ONLINE [16 cams]</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>&gt; PBX Voice Switch:</span>
                    <span style={{ color: '#27c93f' }}>ONLINE [SIP Ok]</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>&gt; IP Firewall:</span>
                    <span style={{ color: 'hsl(var(--secondary))' }}>SHIELD UP</span>
                  </div>
                </div>

                {/* Animated Graph / Monitor */}
                <div 
                  style={{
                    height: '80px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '4px',
                    background: 'rgba(0,0,0,0.3)',
                    position: 'relative'
                  }}
                >
                  <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '0.7rem', color: 'hsl(var(--text-dim))' }}>
                    NETWORK BANDWIDTH
                  </div>
                  {/* Graph bars */}
                  {[40, 65, 30, 85, 45, 90, 70, 50, 95, 60, 40, 80, 55, 75, 88].map((val, idx) => (
                    <div 
                      key={idx} 
                      style={{
                        flex: 1,
                        height: `${val}%`,
                        background: 'linear-gradient(to top, hsl(var(--primary)), hsl(var(--secondary)))',
                        borderRadius: '2px 2px 0 0',
                        opacity: 0.8,
                        animation: `pulse-glow ${1 + (idx % 3) * 0.5}s ease-in-out infinite`
                      }}
                    />
                  ))}
                </div>

                {/* Interactive Status Indicator */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={16} className="text-cyan" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>SSL SECURE / POSTGRES DB</span>
                  </div>
                  <div 
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#27c93f',
                      boxShadow: '0 0 10px #27c93f'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
