import React, { useState, useEffect } from 'react';
import { Lock, X, LogOut, MessageSquare, Calculator, Landmark, ShieldCheck, Database } from 'lucide-react';

export default function AdminDashboard({ isOpen, onClose }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Data states
  const [inquiries, setInquiries] = useState([]);
  const [estimates, setEstimates] = useState([]);
  const [activeTab, setActiveTab] = useState('inquiries'); // inquiries, estimates
  const [loadingData, setLoadingData] = useState(false);

  // Fetch admin lists
  const fetchData = async (authToken) => {
    setLoadingData(true);
    try {
      // Fetch inquiries
      const resInq = await fetch('http://localhost:5000/api/admin/inquiries', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const dataInq = await resInq.json();
      if (resInq.ok) setInquiries(dataInq.inquiries || []);

      // Fetch estimates
      const resEst = await fetch('http://localhost:5000/api/admin/estimates', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const dataEst = await resEst.json();
      if (resEst.ok) setEstimates(dataEst.estimates || []);

    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setLoggingIn(true);
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
        setIsLoggedIn(true);
        setToken(data.token);
        fetchData(data.token);
      } else {
        setErrorMsg(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error(err);
      // Client-side local development bypass / mock login if backend server isn't running yet
      if (username === 'admin' && password === 'admin123') {
        setIsLoggedIn(true);
        const dummyToken = 'nexus-admin-token-secret-9988';
        setToken(dummyToken);
        // Load mock lists for demonstration
        setInquiries([
          { id: 1, name: 'Alice Smith', email: 'alice@corp.com', phone: '+12345', company: 'Alice Corp', message: 'Need full office network layout and 8 CCTV cameras.', service_type: 'cctv_install', date: new Date().toISOString() },
          { id: 2, name: 'Bob Johnson', email: 'bob@retail.net', phone: '+98765', company: 'Bob Retail', message: 'Looking for a web development solution with React + custom POS dashboard.', service_type: 'web_dev', date: new Date(Date.now() - 3600000).toISOString() }
        ]);
        setEstimates([
          { id: 1, name: 'Alice Smith', email: 'alice@corp.com', phone: '+12345', items_selected: '{"service":"CCTV Installation","camerasCount":8,"storageCapacity":"2tb"}', total_price: 2140.00, date: new Date().toISOString() },
          { id: 2, name: 'Bob Johnson', email: 'bob@retail.net', phone: '+98765', items_selected: '{"service":"Web Development","scale":"medium","dbIncluded":true,"authRequired":true}', total_price: 4600.00, date: new Date(Date.now() - 3600000).toISOString() }
        ]);
      } else {
        setErrorMsg('Could not reach backend. Try admin/admin123 for simulated local evaluation.');
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken('');
    setUsername('');
    setPassword('');
    setInquiries([]);
    setEstimates([]);
  };

  // Calculations for Admin Analytics
  const totalPipeline = estimates.reduce((sum, est) => sum + parseFloat(est.total_price || 0), 0);
  const avgEstimate = estimates.length > 0 ? (totalPipeline / estimates.length).toFixed(2) : 0;

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(26, 20, 18, 0.55)',
        backdropFilter: 'blur(16px)',
        zIndex: 5000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        className="glass-panel"
        style={{
          maxWidth: isLoggedIn ? '1100px' : '440px',
          width: '100%',
          height: isLoggedIn ? '85vh' : 'auto',
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}
      >
        {/* Header bar */}
        <div 
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.01)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database className="text-cyan animate-pulse" size={22} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Nexus Portal: {isLoggedIn ? 'Central Command' : 'Admin Gate'}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {isLoggedIn && (
              <button 
                onClick={handleLogout}
                style={{
                  background: 'rgba(255,95,86,0.1)',
                  border: '1px solid rgba(255,95,86,0.2)',
                  color: '#ff5f56',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={12} />
                Disconnect
              </button>
            )}
            <button 
              onClick={onClose}
              style={{
                background: 'rgba(0, 0, 0, 0.02)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                color: 'hsl(var(--text-main))',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Command Screen content */}
        {!isLoggedIn ? (
          /* LOGIN FORM */
          <div style={{ padding: '40px 30px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div 
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(6, 182, 212, 0.05)',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}
              >
                <Lock size={24} className="text-cyan" />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>Sign in to Admin Dashboard</h4>
              <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-dim))' }}>
                Default: <span style={{ color: 'white', fontFamily: 'monospace' }}>admin</span> / <span style={{ color: 'white', fontFamily: 'monospace' }}>admin123</span>
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {errorMsg && (
                <div style={{ color: '#ff5f56', background: 'rgba(255, 95, 86, 0.1)', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', textAlign: 'center' }}>
                  {errorMsg}
                </div>
              )}
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                    padding: '12px',
                    background: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    color: 'hsl(var(--text-main))',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    padding: '12px',
                    background: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    color: 'hsl(var(--text-main))',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-glow"
                disabled={loggingIn}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '8px' }}
              >
                {loggingIn ? 'Connecting...' : 'Authorize Session'}
              </button>
            </form>
          </div>
        ) : (
          /* FULL COMMAND PANEL */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* 1. Quick Stats row */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                padding: '24px 28px',
                background: 'rgba(0, 0, 0, 0.01)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.04)'
              }}
              className="stats-row"
            >
              <style dangerouslySetInnerHTML={{__html: `
                @media (max-width: 600px) {
                  .stats-row { grid-template-columns: 1fr !important; }
                }
              `}} />
              {/* Stat 1 */}
              <div style={{ padding: '16px', background: 'rgba(0, 0, 0, 0.02)', borderRadius: '10px', border: '1px solid rgba(0, 0, 0, 0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'hsl(var(--primary))', flexShrink: 0 }}><MessageSquare size={20} style={{margin:'auto'}} /></div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-dim))' }}>CONTACT TICKETS</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{inquiries.length}</div>
                </div>
              </div>
              {/* Stat 2 */}
              <div style={{ padding: '16px', background: 'rgba(0, 0, 0, 0.02)', borderRadius: '10px', border: '1px solid rgba(0, 0, 0, 0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'hsl(var(--secondary))', flexShrink: 0 }}><Calculator size={20} style={{margin:'auto'}} /></div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-dim))' }}>QUOTE INQUIRIES</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{estimates.length}</div>
                </div>
              </div>
              {/* Stat 3 */}
              <div style={{ padding: '16px', background: 'rgba(0, 0, 0, 0.02)', borderRadius: '10px', border: '1px solid rgba(0, 0, 0, 0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(219, 39, 119, 0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'hsl(var(--accent-pink))', flexShrink: 0 }}><Landmark size={20} style={{margin:'auto'}} /></div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-dim))' }}>PIPELINE VALUE</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'hsl(var(--secondary))' }}>${totalPipeline.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* 2. Menu Navigation Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(0, 0, 0, 0.04)', padding: '0 28px' }}>
              <button
                onClick={() => setActiveTab('inquiries')}
                style={{
                  padding: '16px 24px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'inquiries' ? '2px solid hsl(var(--primary))' : '2px solid transparent',
                  color: activeTab === 'inquiries' ? 'hsl(var(--text-main))' : 'hsl(var(--text-dim))',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'var(--transition-fast)'
                }}
              >
                Messages / Contact Briefs ({inquiries.length})
              </button>
              <button
                onClick={() => setActiveTab('estimates')}
                style={{
                  padding: '16px 24px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'estimates' ? '2px solid hsl(var(--secondary))' : '2px solid transparent',
                  color: activeTab === 'estimates' ? 'hsl(var(--text-main))' : 'hsl(var(--text-dim))',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'var(--transition-fast)'
                }}
              >
                Cost Calculator Bids ({estimates.length})
              </button>
            </div>

            {/* 3. Main Data Lists Container */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
              {loadingData ? (
                <div style={{ color: 'hsl(var(--text-dim))', textAlign: 'center', padding: '40px' }}>Loading registry...</div>
              ) : activeTab === 'inquiries' ? (
                /* INQUIRIES LIST */
                inquiries.length === 0 ? (
                  <div style={{ color: 'hsl(var(--text-dim))', textAlign: 'center', padding: '40px' }}>No messages found in DB.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {inquiries.map((inq) => (
                      <div 
                        key={inq.id}
                        style={{
                          background: 'rgba(0, 0, 0, 0.01)',
                          border: '1px solid rgba(0, 0, 0, 0.04)',
                          borderRadius: '10px',
                          padding: '20px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '1.05rem', marginRight: '10px' }}>{inq.name}</span>
                            <span style={{ fontSize: '0.8rem', background: 'rgba(139,92,246,0.15)', color: 'hsl(var(--primary))', padding: '2px 8px', borderRadius: '4px', textTransform: 'capitalize' }}>
                              {inq.service_type.replace('_', ' ')}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-dim))' }}>
                            {new Date(inq.date).toLocaleString()}
                          </span>
                        </div>
                        <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem', whiteSpace: 'pre-line', marginBottom: '14px', borderLeft: '2px solid rgba(0, 0, 0, 0.1)', paddingLeft: '12px' }}>
                          {inq.message}
                        </p>
                        <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem', color: 'hsl(var(--text-dim))' }}>
                          <span>Email: <strong style={{color:'hsl(var(--text-main))'}}>{inq.email}</strong></span>
                          {inq.phone && <span>Phone: <strong style={{color:'hsl(var(--text-main))'}}>{inq.phone}</strong></span>}
                          {inq.company && <span>Company: <strong style={{color:'hsl(var(--text-main))'}}>{inq.company}</strong></span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* ESTIMATES LIST */
                estimates.length === 0 ? (
                  <div style={{ color: 'hsl(var(--text-dim))', textAlign: 'center', padding: '40px' }}>No estimates found in DB.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {estimates.map((est) => {
                      let specs = {};
                      try {
                        specs = typeof est.items_selected === 'string' ? JSON.parse(est.items_selected) : est.items_selected;
                      } catch (e) {
                        specs = { raw: est.items_selected };
                      }
                      
                      return (
                        <div 
                          key={est.id}
                          style={{
                            background: 'rgba(0, 0, 0, 0.01)',
                            border: '1px solid rgba(0, 0, 0, 0.04)',
                            borderRadius: '10px',
                            padding: '20px',
                            display: 'grid',
                            gridTemplateColumns: '1fr auto',
                            gap: '20px',
                            alignItems: 'center'
                          }}
                          className="estimate-card"
                        >
                          <style dangerouslySetInnerHTML={{__html: `
                            @media (max-width: 600px) {
                              .estimate-card { grid-template-columns: 1fr !important; }
                            }
                          `}} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{est.name}</span>
                              <span style={{ fontSize: '0.75rem', background: 'rgba(6,182,212,0.15)', color: 'hsl(var(--secondary))', padding: '2px 8px', borderRadius: '4px' }}>
                                {specs.service || 'Service Quote'}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-dim))' }}>
                                {new Date(est.date).toLocaleString()}
                              </span>
                            </div>
                            
                            {/* Specs options breakdown */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '4px 0' }}>
                              {Object.entries(specs).map(([key, val]) => {
                                if (key === 'service') return null;
                                return (
                                  <span key={key} style={{ fontSize: '0.72rem', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid rgba(0, 0, 0, 0.05)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                                    {key.replace(/([A-Z])/g, ' $1')}: <strong style={{color:'hsl(var(--text-main))'}}>{val.toString()}</strong>
                                  </span>
                                );
                              })}
                            </div>

                            <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem', color: 'hsl(var(--text-dim))', marginTop: '4px' }}>
                              <span>Email: <strong style={{color:'hsl(var(--text-main))'}}>{est.email}</strong></span>
                              {est.phone && <span>Phone: <strong style={{color:'hsl(var(--text-main))'}}>{est.phone}</strong></span>}
                            </div>
                          </div>
                          
                          <div style={{ padding: '12px 20px', background: 'rgba(6,182,212,0.05)', borderRadius: '8px', border: '1px solid rgba(6,182,212,0.15)', textAlign: 'right' }}>
                            <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-dim))', display: 'block' }}>QUOTE VALUE</span>
                            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'hsl(var(--secondary))' }}>
                              ${parseFloat(est.total_price).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
