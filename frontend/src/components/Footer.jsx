import React from 'react';
import { Cpu, Phone, Mail, MapPin, ShieldAlert } from 'lucide-react';

export default function Footer({ onOpenAdmin }) {
  return (
    <footer 
      style={{
        background: 'rgba(8, 10, 18, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '80px 0 30px 0',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div className="container">
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '60px'
          }}
        >
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.4rem', fontWeight: 800 }}>
              <Cpu className="text-cyan" size={28} />
              <span>NEXUS <span className="text-gradient">TECH</span></span>
            </div>
            <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Your elite digital infrastructure partner. We construct state-of-the-art networks, secure CCTV setups, high-performance web systems, and full-featured business management platforms.
            </p>
          </div>

          {/* Solutions Offered */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>Services</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>
              <li>Web Dev & Software</li>
              <li>UI/UX & Web Design</li>
              <li>POS Software Solutions</li>
              <li>Network & Server Architecture</li>
              <li>IP Phone Installations</li>
              <li>Commercial CCTV Security</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} className="text-cyan" />
                <span>00100 Nairobi, Kenya</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} className="text-cyan" />
                <span>+254 741 427 584 </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} className="text-cyan" />
                <span>nexustechsupport@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>Corporate</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>
              <li><a href="#home">Home Portal</a></li>
              <li><a href="#services">Our Offerings</a></li>
              <li><a href="#estimator">Quote Estimator</a></li>
              <li>
                <button 
                  onClick={onOpenAdmin}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'hsl(var(--text-muted))',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'hsl(var(--accent-pink))'}
                  onMouseLeave={(e) => e.target.style.color = 'hsl(var(--text-muted))'}
                >
                  <ShieldAlert size={14} />
                  Admin Panel Login
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Subfooter */}
        <div 
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            fontSize: '0.85rem',
            color: 'hsl(var(--text-dim))'
          }}
        >
          <span>&copy; {new Date().getFullYear()} Nexus Tech Solutions. All Rights Reserved.</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
