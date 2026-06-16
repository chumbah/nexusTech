import React, { useState } from 'react';
import { 
  Globe, Layout, PenTool, Database, Network, Cctv, PhoneCall, 
  ArrowRight, X, Shield, Cpu, Sliders, CheckCircle 
} from 'lucide-react';

export default function Services({ onSelectService }) {
  const [selectedService, setSelectedService] = useState(null);

  const servicesData = [
    {
      id: 'web_dev',
      icon: <Globe size={32} className="text-cyan" />,
      title: 'Web Development',
      shortDesc: 'Custom backend-driven platforms, APIs, and headless applications engineered for scale.',
      tech: 'React, Node.js, Express, PostgreSQL, Next.js, REST APIs',
      duration: '4-8 Weeks',
      features: [
        'Custom REST & GraphQL API Architectures',
        'Database configuration & migration (PostgreSQL, MongoDB)',
        'E-commerce systems & payment gateway integrations',
        'Headless CMS & Serverless deployments'
      ],
      details: 'We engineer secure, scalable, and responsive web applications tailored to your exact business needs. Our team handles everything from Postgres schema design and server-side routes to rich frontend states and performance optimization.'
    },
    {
      id: 'web_design',
      icon: <Layout size={32} className="text-purple" />,
      title: 'Web Design',
      shortDesc: 'Vibrant, fast-loading, SEO-optimized marketing and corporate websites built to convert.',
      tech: 'HTML5, CSS Modules, HSL variables, Framer Motion, GSAP',
      duration: '2-4 Weeks',
      features: [
        'Fully responsive & fluid layouts',
        'Advanced CSS Grid & Flexbox layouts',
        'Interactive micro-animations & CSS transitions',
        'Built-in modern SEO best practices'
      ],
      details: 'Your website is your digital storefront. We build modern, elegant designs featuring custom color theory, premium font pairings, and responsive components that deliver the perfect brand impression on mobile, tablet, and desktop.'
    },
    {
      id: 'ui_ux',
      icon: <PenTool size={32} className="text-cyan" />,
      title: 'UI/UX Designs',
      shortDesc: 'High-fidelity wireframes, interactive user flows, and modern design systems.',
      tech: 'Figma, Adobe XD, Vector illustration, User Persona Mapping',
      duration: '2-3 Weeks',
      features: [
        'High-fidelity visual mockups & assets',
        'User research & dynamic persona mapping',
        'Clickable design prototypes',
        'Reusable Component Libraries & Style Guides'
      ],
      details: 'Great software starts with exceptional user experience. We map out full user journeys, conduct usability testing, and create clean Figma UI prototypes to ensure your customers enjoy an intuitive, friction-free interaction.'
    },
    {
      id: 'pos_dev',
      icon: <Database size={32} className="text-purple" />,
      title: 'POS Development & Management',
      shortDesc: 'Custom inventory, sales ledger, and cashier software customized for retail and hospitality.',
      tech: 'Node, SQLite/PostgreSQL, Electron, Receipt SDKs, Barcode API',
      duration: '6-10 Weeks',
      features: [
        'Real-time inventory and supplier tracking',
        'Multi-register sync & offline operations',
        'Comprehensive analytical sales reports',
        'Thermal printer & barcode integration'
      ],
      details: 'Take control of your retail or restaurant operations with an custom POS application. We implement secure POS software that operates offline, syncs with cloud-based PostgreSQL servers, and integrates seamlessly with checkout hardware.'
    },
    {
      id: 'network_support',
      icon: <Network size={32} className="text-cyan" />,
      title: 'Network Support & Design',
      shortDesc: 'Enterprise server racks, structured cabling, routing, firewall config, and VPN setup.',
      tech: 'Cisco IOS, Ubiquiti UniFi, Pfsense, VLAN, Cat6A Cabling',
      duration: 'Ongoing / Project',
      features: [
        'Structured network cabling (Cat6 / Cat6A / Fiber)',
        'VLAN segregation & secure firewall configuration',
        'Wireless site surveys & high-density Wi-Fi configurations',
        'Server rack installation & Active Directory setups'
      ],
      details: 'A business is only as fast as its network. We design, install, and support high-speed local area networks (LANs). From cabling and server-rack assembly to VLAN configuration and secure remote VPN setups, we ensure uptime.'
    },
    {
      id: 'cctv_install',
      icon: <Cctv size={32} className="text-purple" />,
      title: 'CCTV Security Installation',
      shortDesc: 'Ultra-HD IP surveillance systems, remote viewing setup, NVR server installation.',
      tech: 'Dahua, Hikvision, NVR Servers, AI Motion Detection, PoE Switches',
      duration: '3-5 Days',
      features: [
        '4K IP Cameras with color night-vision capabilities',
        'Network Video Recorder (NVR) server configuration',
        'Secure remote viewing mobile/tablet app setup',
        'AI boundary crossing and motion notifications'
      ],
      details: 'Secure your premises with enterprise-grade security. We install PoE IP camera systems that record local storage and provide secure, encrypted live feeds direct to your smartphone. We calculate strategic camera positions for maximum coverage.'
    },
    {
      id: 'ip_phone',
      icon: <PhoneCall size={32} className="text-cyan" />,
      title: 'IP Phone Installation',
      shortDesc: 'VoIP PBX systems, SIP trunk configuration, automated IVR, and VoIP handsets.',
      tech: 'Yeastar, Grandstream PBX, Fanvil SIP, IVR Flowcharts',
      duration: '1-2 Weeks',
      features: [
        'Automated Interactive Voice Response (IVR) setups',
        'SIP Trunking & cost-effective outbound calling routing',
        'Call queuing, recording, and transfers',
        'Softphone apps for hybrid remote staff'
      ],
      details: 'Upgrade your communications with high-definition voice over IP (VoIP) telephony. We deploy physical Grandstream/Yeastar PBX servers or configure cloud PBX, hook up SIP accounts, and configure IVRs to optimize office efficiency.'
    }
  ];

  return (
    <section 
      id="services" 
      style={{
        padding: '100px 0',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Digital & Infrastructure</span>
          <h2 className="section-title">Core Service Offerings</h2>
          <p className="section-subtitle">
            We provide elite software engineering and robust IT hardware deployments. Click any service card to view advanced specifications.
          </p>
        </div>

        {/* Services Grid */}
        <div 
          className="grid grid-cols-3" 
          style={{ marginTop: '50px' }}
        >
          {servicesData.map((service) => (
            <div 
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="glass-panel"
              style={{
                padding: '36px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div 
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(0, 0, 0, 0.05)'
                }}
              >
                {service.icon}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{service.title}</h3>
                <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.92rem', lineHeight: '1.6' }}>
                  {service.shortDesc}
                </p>
              </div>

              <div 
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'hsl(var(--secondary))',
                  transition: 'var(--transition-fast)'
                }}
                className="learn-more-btn"
              >
                <span>Technical Specifications</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {selectedService && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(26, 20, 18, 0.55)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}
          onClick={() => setSelectedService(null)}
        >
          <div 
            className="glass-panel"
            style={{
              maxWidth: '680px',
              width: '100%',
              background: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '20px',
              overflow: 'hidden',
              animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div 
              style={{
                padding: '24px 30px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {selectedService.icon}
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{selectedService.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedService(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'hsl(var(--secondary))', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Overview
                </h4>
                <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.98rem', lineHeight: '1.6' }}>
                  {selectedService.details}
                </p>
              </div>

              {/* Specs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ padding: '16px', background: 'rgba(0, 0, 0, 0.02)', borderRadius: '12px', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.8rem', color: 'hsl(var(--text-dim))' }}>
                    <Cpu size={14} className="text-purple" />
                    <span>TECH STACK / HARDWARE</span>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{selectedService.tech}</span>
                </div>

                <div style={{ padding: '16px', background: 'rgba(0, 0, 0, 0.02)', borderRadius: '12px', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.8rem', color: 'hsl(var(--text-dim))' }}>
                    <Sliders size={14} className="text-cyan" />
                    <span>ESTIMATED DURATION</span>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{selectedService.duration}</span>
                </div>
              </div>

              {/* Features List */}
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'hsl(var(--secondary))', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  Key Capabilities
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedService.features.map((feature, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
                      <CheckCircle size={16} className="text-cyan" style={{ marginTop: '3px', flexShrink: 0 }} />
                      <span style={{ color: 'hsl(var(--text-muted))' }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div 
              style={{
                padding: '20px 30px',
                background: 'rgba(255, 255, 255, 0.01)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}
            >
              <button 
                onClick={() => setSelectedService(null)} 
                className="btn btn-secondary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Close Specs
              </button>
              <button 
                onClick={() => {
                  onSelectService(selectedService.id);
                  setSelectedService(null);
                }} 
                className="btn btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Select in Estimator
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes modalSlideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
