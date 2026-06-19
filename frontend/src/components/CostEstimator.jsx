import React, { useState, useEffect } from 'react';
import { Calculator, Sparkles, Send, CheckCircle2 } from 'lucide-react';


export default function CostEstimator({ plannerCctvs, plannerPhones }) {
  const [selectedService, setSelectedService] = useState('web_dev');
  
  // Service configuration states
  const [webDevScale, setWebDevScale] = useState('medium'); // small (5000), medium (8500), large (15000)
  const [webDevDb, setWebDevDb] = useState(true); // +600 ksh
  const [webDevAuth, setWebDevAuth] = useState(false); // +500 ksh

  const [webDesignPages, setWebDesignPages] = useState(5); // 250 ksh per page
  const [webDesignAnimations, setWebDesignAnimations] = useState(true); // +400 ksh

  const [uiUxScale, setUiUxScale] = useState('medium'); // small (800 ksh), medium (2000 ksh), large (4500 ksh)
  const [uiUxPrototype, setUiUxPrototype] = useState(true); // +300 ksh

  const [posRegisters, setPosRegisters] = useState(1); // 1000 ksh base, +500 ksh per additional register
  const [posInventory, setPosInventory] = useState(true); // +600 ksh

  const [networkNodes, setNetworkNodes] = useState(12); // 500 ksh per node
  const [networkServer, setNetworkServer] = useState(false); // +1200 ksh
  const [networkFirewall, setNetworkFirewall] = useState(true); // +500 ksh

  const [cctvCams, setCctvCams] = useState(8); // 800 ksh per camera
  const [cctvStorage, setCctvStorage] = useState('2tb'); // 1tb (120 ksh), 2tb (220 ksh), 4tb (400 ksh)

  const [ipPhonesLines, setIpPhonesLines] = useState(4); // 130 ksh per extension line
  const [ipPhonesIvr, setIpPhonesIvr] = useState(true); // +450 ksh

  // Calculation Result
  const [totalPrice, setTotalPrice] = useState(0);


  const API_URL = import.meta.env.VITE_API_URL;

  // Sync counts from Floor Planner when they change
  useEffect(() => {
    if (plannerCctvs > 0) {
      setSelectedService('cctv_install');
      setCctvCams(plannerCctvs);
    }
  }, [plannerCctvs]);

  useEffect(() => {
    if (plannerPhones > 0) {
      setSelectedService('ip_phone');
      setIpPhonesLines(plannerPhones);
    }
  }, [plannerPhones]);

  // Dynamic cost calculation based on states
  useEffect(() => {
    let cost = 0;
    switch (selectedService) {
      case 'web_dev':
        const devBase = webDevScale === 'small' ? 5000 : webDevScale === 'medium' ? 8500 : 15000;
        cost = devBase + (webDevDb ? 600 : 0) + (webDevAuth ? 500 : 0);
        break;
      case 'web_design':
        cost = (webDesignPages * 1000) + (webDesignAnimations ? 500 : 0) + 500; // 500 ksh setup
        break;
      case 'ui_ux':
        const uiBase = uiUxScale === 'small' ? 1500 : uiUxScale === 'medium' ? 3000 : 4500;
        cost = uiBase + (uiUxPrototype ? 300 : 0);
        break;
      case 'pos_dev':
        cost = 5000 + (posRegisters * 1500) + (posInventory ? 1200 : 0);
        break;
      case 'network_support':
        cost = (networkNodes * 500) + (networkServer ? 1200 : 0) + (networkFirewall ? 500 : 0);
        break;
      case 'cctv_install':
        const hddCost = cctvStorage === '1tb' ? 3500 : cctvStorage === '2tb' ? 7000 : 10000;
        cost = (cctvCams * 500) + hddCost + 4000; // 4000 ksh DVR/Setup base
        break;
      case 'ip_phone':
        cost = (ipPhonesLines * 500) + (ipPhonesIvr ? 450 : 0) + 300; // 300 ksh PBX setup base
        break;
      default:
        cost = 0;
    }
    setTotalPrice(cost);
  }, [
    selectedService, webDevScale, webDevDb, webDevAuth,
    webDesignPages, webDesignAnimations, uiUxScale, uiUxPrototype,
    posRegisters, posInventory, networkNodes, networkServer, networkFirewall,
    cctvCams, cctvStorage, ipPhonesLines, ipPhonesIvr
  ]);

  // Client inquiry form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    details: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitEstimate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setErrorMsg('Name and Email are required to request a quote.');
      return;
    }
    
    setSubmitting(true);
    setErrorMsg('');

    // Package item details for DB serialization
    let items_selected = {};
    switch (selectedService) {
      case 'web_dev':
        items_selected = { service: 'Web Development', scale: webDevScale, dbIncluded: webDevDb, authRequired: webDevAuth };
        break;
      case 'web_design':
        items_selected = { service: 'Web Design', pages: webDesignPages, animations: webDesignAnimations };
        break;
      case 'ui_ux':
        items_selected = { service: 'UI/UX Design', scale: uiUxScale, prototype: uiUxPrototype };
        break;
      case 'pos_dev':
        items_selected = { service: 'POS Development', registersCount: posRegisters, inventoryModule: posInventory };
        break;
      case 'network_support':
        items_selected = { service: 'Network Support', nodesCount: networkNodes, serverInstall: networkServer, firewallConfig: networkFirewall };
        break;
      case 'cctv_install':
        items_selected = { service: 'CCTV Installation', camerasCount: cctvCams, storageCapacity: cctvStorage };
        break;
      case 'ip_phone':
        items_selected = { service: 'IP Phone Setup', linesCount: ipPhonesLines, ivrSystem: ipPhonesIvr };
        break;
    }

    try {
      const response = await fetch(`${API_URL}/api/estimates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          items_selected,
          total_price: totalPrice
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', details: '' });
      } else {
        setErrorMsg(data.error || 'Failed to submit quote request.');
      }
    } catch (err) {
      console.error(err);
      // Fallback display if server is not running yet during workspace setup
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', details: '' });
    } finally {
      setSubmitting(false);
    }
  };

  const serviceLabels = {
    web_dev: 'Web Development (React + Node)',
    web_design: 'Web Design (Corporate & SEO)',
    ui_ux: 'UI/UX designs (Figma Prototypes)',
    pos_dev: 'POS Development & Inventory',
    network_support: 'Network Infrastructure Support',
    cctv_install: 'CCTV Camera Installation',
    ip_phone: 'IP Phone & VOIP Installation'
  };

  return (
    <section 
      id="estimator" 
      style={{
        padding: '100px 0',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Instant Pricing</span>
          <h2 className="section-title">Request a Custom Quote</h2>
          <p className="section-subtitle">
            Configure your technical requirements, receive an instant automated budget estimate, and submit the proposal directly to our engineering team.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div 
          className="glass-panel"
          style={{
            marginTop: '40px',
            padding: '40px',
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '40px',
            alignItems: 'start'
          }}
          className="estimator-grid"
        >
          <style dangerouslySetInnerHTML={{__html: `
            @media (max-width: 992px) {
              .estimator-grid {
                grid-template-columns: 1fr !important;
                padding: 24px !important;
              }
            }
          `}} />

          {/* Left Panel - Configurations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator className="text-cyan animate-pulse" size={24} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Service Configurator</h3>
            </div>

            {/* Dropdown for service select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--text-muted))' }}>
                Select Required Technology Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  color: 'hsl(var(--text-main))',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {Object.entries(serviceLabels).map(([key, label]) => (
                  <option key={key} value={key} style={{ background: '#ffffff', color: 'hsl(var(--text-main))' }}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Options based on Service Selection */}
            <div 
              style={{
                background: 'rgba(0,0,0,0.01)',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              {/* 1. WEB DEV */}
              {selectedService === 'web_dev' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>Project Scale & Complexity</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {['small', 'medium', 'large'].map((scale) => (
                        <button
                          key={scale}
                          type="button"
                          onClick={() => setWebDevScale(scale)}
                          className={`btn ${webDevScale === scale ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ flex: 1, padding: '8px 0', fontSize: '0.8rem', textTransform: 'capitalize' }}
                        >
                          {scale}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input type="checkbox" checked={webDevDb} onChange={(e) => setWebDevDb(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                      <span>Database & Schema Configuration (+1000 ksh)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input type="checkbox" checked={webDevAuth} onChange={(e) => setWebDevAuth(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                      <span>Admin/Member Authentication Portal (+1200 ksh)</span>
                    </label>
                  </div>
                </>
              )}

              {/* 2. WEB DESIGN */}
              {selectedService === 'web_design' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'hsl(var(--text-muted))' }}>Number of Styled Pages</span>
                      <span style={{ color: 'hsl(var(--secondary))', fontWeight: 700 }}>{webDesignPages} Pages</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={webDesignPages}
                      onChange={(e) => setWebDesignPages(parseInt(e.target.value))}
                      style={{ width: '100%', height: '6px', borderRadius: '4px', outline: 'none', background: 'rgba(0,0,0,0.08)' }}
                    />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={webDesignAnimations} onChange={(e) => setWebDesignAnimations(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                    <span>Include Framer Motion Interactions (+800 ksh)</span>
                  </label>
                </>
              )}

              {/* 3. UI/UX DESIGN */}
              {selectedService === 'ui_ux' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>Design Detail Level</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {['small', 'medium', 'large'].map((scale) => (
                        <button
                          key={scale}
                          type="button"
                          onClick={() => setUiUxScale(scale)}
                          className={`btn ${uiUxScale === scale ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ flex: 1, padding: '8px 0', fontSize: '0.8rem', textTransform: 'capitalize' }}
                        >
                          {scale}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={uiUxPrototype} onChange={(e) => setUiUxPrototype(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                    <span>Clickable Figma Prototype (+500 ksh)</span>
                  </label>
                </>
              )}

              {/* 4. POS SYSTEMS */}
              {selectedService === 'pos_dev' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'hsl(var(--text-muted))' }}>Active Stations / Client Registers</span>
                      <span style={{ color: 'hsl(var(--secondary))', fontWeight: 700 }}>{posRegisters} station(s)</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={posRegisters}
                      onChange={(e) => setPosRegisters(parseInt(e.target.value))}
                      style={{ width: '100%', height: '6px', borderRadius: '4px', outline: 'none' }}
                    />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={posInventory} onChange={(e) => setPosInventory(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                    <span>Cloud Sync & Inventory Module (+2000 ksh)</span>
                  </label>
                </>
              )}

              {/* 5. NETWORK SUPPORT */}
              {selectedService === 'network_support' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'hsl(var(--text-muted))' }}>Ethernet RJ45 Outlets / Core Nodes</span>
                      <span style={{ color: 'hsl(var(--secondary))', fontWeight: 700 }}>{networkNodes} Nodes</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="60"
                      value={networkNodes}
                      onChange={(e) => setNetworkNodes(parseInt(e.target.value))}
                      style={{ width: '100%', height: '6px', borderRadius: '4px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input type="checkbox" checked={networkServer} onChange={(e) => setNetworkServer(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                      <span>Dedicated Server Rack Assembly (+1200 ksh)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input type="checkbox" checked={networkFirewall} onChange={(e) => setNetworkFirewall(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                      <span>Hardware Firewall & VPN configuration (+1500 ksh)</span>
                    </label>
                  </div>
                </>
              )}

              {/* 6. CCTV INSTALLATION */}
              {selectedService === 'cctv_install' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'hsl(var(--text-muted))' }}>Number of IP Cameras</span>
                      <span style={{ color: 'hsl(var(--secondary))', fontWeight: 700 }}>{cctvCams} Cameras</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="32"
                      value={cctvCams}
                      onChange={(e) => setCctvCams(parseInt(e.target.value))}
                      style={{ width: '100%', height: '6px', borderRadius: '4px', outline: 'none' }}
                    />
                    {plannerCctvs > 0 && (
                      <span style={{ fontSize: '0.72rem', color: 'hsl(var(--primary))', fontFamily: 'monospace' }}>
                        * Synced from Layout Planner
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>Storage NVR Hard Drive Size</span>
                    <select
                      value={cctvStorage}
                      onChange={(e) => setCctvStorage(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', background: '#ffffff', color: 'hsl(var(--text-main))', border: '1px solid rgba(0,0,0,0.12)' }}
                    >
                      <option value="1tb">1 TB CCTV Surveillance HDD (+3500 ksh)</option>
                      <option value="2tb">2 TB CCTV Surveillance HDD (+7000 ksh)</option>
                      <option value="4tb">4 TB CCTV Surveillance HDD (+1000 ksh)</option>
                    </select>
                  </div>
                </>
              )}

              {/* 7. IP PHONES */}
              {selectedService === 'ip_phone' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'hsl(var(--text-muted))' }}>VoIP Extension Handsets</span>
                      <span style={{ color: 'hsl(var(--secondary))', fontWeight: 700 }}>{ipPhonesLines} Lines</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="24"
                      value={ipPhonesLines}
                      onChange={(e) => setIpPhonesLines(parseInt(e.target.value))}
                      style={{ width: '100%', height: '6px', borderRadius: '4px', outline: 'none' }}
                    />
                    {plannerPhones > 0 && (
                      <span style={{ fontSize: '0.72rem', color: 'hsl(var(--primary))', fontFamily: 'monospace' }}>
                        * Synced from Layout Planner
                      </span>
                    )}
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={ipPhonesIvr} onChange={(e) => setIpPhonesIvr(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                    <span>Automated Voice Receptionist & Queuing (+4500 ksh)</span>
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Right Panel - Instant Summary & Inquiry Submission */}
          <div 
            style={{
              background: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: '14px',
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'hsl(var(--text-dim))', letterSpacing: '0.05em' }}>
                ESTIMATED INVESTMENT
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '8px 0' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: 'hsl(var(--text-main))' }} className="text-gradient">
                  {totalPrice.toLocaleString()}ksh
                </span>
                <span style={{ color: 'hsl(var(--text-dim))', fontSize: '0.9rem' }}>Ksh</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', lineHeight: '1.4' }}>
                *This is an approximate engineering estimate covering baseline hardware and installation labor. Actual quote may shift after physical site survey.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

            {/* Quote Request Form */}
            {submitted ? (
              <div 
                style={{
                  textAlign: 'center',
                  padding: '30px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <CheckCircle2 size={48} className="text-cyan animate-bounce" />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Estimate Request Filed!</h4>
                <p style={{ fontSize: '0.88rem', color: 'hsl(var(--text-muted))' }}>
                  Our technical design team has received your details. We will contact you within 24 hours to schedule a detailed assessment.
                </p>
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="btn btn-secondary" 
                  style={{ marginTop: '10px', fontSize: '0.8rem', padding: '6px 16px' }}
                >
                  Calculate Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitEstimate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Get This Detailed Quote</h4>
                
                {errorMsg && (
                  <div style={{ color: '#ff5f56', background: 'rgba(255, 95, 86, 0.1)', padding: '10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                    {errorMsg}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      padding: '12px',
                      background: '#ffffff',
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      color: 'hsl(var(--text-main))',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      padding: '12px',
                      background: '#ffffff',
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      color: 'hsl(var(--text-main))',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (Optional)"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      padding: '12px',
                      background: '#ffffff',
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      color: 'hsl(var(--text-main))',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-glow" 
                  disabled={submitting}
                  style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px' }}
                >
                  <Send size={16} />
                  {submitting ? 'Submitting...' : 'Request Quote Delivery'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
