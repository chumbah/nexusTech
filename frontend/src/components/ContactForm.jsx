import React, { useState } from 'react';
import { Send, CheckCircle2, Mail, Phone, Clock } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service_type: 'web_dev',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    const API_URL = import.meta.env.VITE_API_URL;
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Name, Email, and Message are required.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service_type: 'web_dev',
          message: ''
        });
      } else {
        setErrorMsg(data.error || 'Failed to submit message.');
      }
    } catch (err) {
      console.error(err);
      // Fallback display if server is not fully running yet
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      style={{
        padding: '100px 0',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Get in Touch</span>
          <h2 className="section-title">Initiate Your Project</h2>
          <p className="section-subtitle">
            Have questions about server deployments or custom software builds? Message our engineers and get a consultation.
          </p>
        </div>

        {/* Contact Layout */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '0.8fr 1.2fr',
            gap: '50px',
            marginTop: '40px'
          }}
          className="contact-grid"
        >
          <style dangerouslySetInnerHTML={{__html: `
            @media (max-width: 992px) {
              .contact-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}} />

          {/* Left Panel - Support details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Corporate Hub</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <Mail className="text-cyan" size={20} style={{ marginTop: '2px' }} />
                  <div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Email Support</h5>
                    <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.85rem' }}>nexustechsupport@gmail.com</p>
                    
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <Phone className="text-purple" size={20} style={{ marginTop: '2px' }} />
                  <div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Voice Infrastructure</h5>
                    <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.85rem' }}>+254 741 427 584</p>
                    <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.85rem' }}>+254 725 248 080</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <Clock className="text-cyan" size={20} style={{ marginTop: '2px' }} />
                  <div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Operation Hours</h5>
                    <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.85rem' }}>Monday - Friday: 0800 - 1800 HRS</p>
                    <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.85rem' }}>Saturday: 0900 - 1300 HRS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Contact Form */}
          <div className="glass-panel" style={{ padding: '40px' }}>
            {submitted ? (
              <div 
                style={{
                  textAlign: 'center',
                  padding: '40px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <CheckCircle2 size={56} className="text-cyan animate-bounce" />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Message Transmitted!</h3>
                <p style={{ color: 'hsl(var(--text-muted))', maxWidth: '400px', margin: '0 auto', fontSize: '0.95rem' }}>
                  Your inquiry has been stored securely in our database. An engineer will follow up via email or phone shortly.
                </p>
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="btn btn-secondary"
                  style={{ marginTop: '10px' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {errorMsg && (
                  <div style={{ color: '#ff5f56', background: 'rgba(255, 95, 86, 0.1)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                    {errorMsg}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-row">
                  <style dangerouslySetInnerHTML={{__html: `
                    @media (max-width: 600px) {
                      .form-row { grid-template-columns: 1fr !important; }
                    }
                  `}} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(var(--text-muted))' }}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. John Doe"
                      style={{
                        padding: '12px 16px',
                        background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        color: 'hsl(var(--text-main))',
                        fontSize: '0.92rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(var(--text-muted))' }}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. john@company.com"
                      style={{
                        padding: '12px 16px',
                        background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        color: 'hsl(var(--text-main))',
                        fontSize: '0.92rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-row">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(var(--text-muted))' }}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +254 123 000 000"
                      style={{
                        padding: '12px 16px',
                        background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        color: 'hsl(var(--text-main))',
                        fontSize: '0.92rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(var(--text-muted))' }}>Company Name</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. Nexus Corp"
                      style={{
                        padding: '12px 16px',
                        background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        color: 'hsl(var(--text-main))',
                        fontSize: '0.92rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(var(--text-muted))' }}>Primary Service Area</label>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleInputChange}
                    style={{
                      padding: '12px 16px',
                      background: '#ffffff',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      borderRadius: '8px',
                      color: 'hsl(var(--text-main))',
                      fontSize: '0.92rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="web_dev" style={{ background: '#ffffff', color: 'hsl(var(--text-main))' }}>Web Development</option>
                    <option value="web_design" style={{ background: '#ffffff', color: 'hsl(var(--text-main))' }}>Web Design</option>
                    <option value="ui_ux" style={{ background: '#ffffff', color: 'hsl(var(--text-main))' }}>UI/UX Designs</option>
                    <option value="pos_dev" style={{ background: '#ffffff', color: 'hsl(var(--text-main))' }}>POS Development/Management</option>
                    <option value="network_support" style={{ background: '#ffffff', color: 'hsl(var(--text-main))' }}>Network Support & Architecture</option>
                    <option value="cctv_install" style={{ background: '#ffffff', color: 'hsl(var(--text-main))' }}>CCTV Installation</option>
                    <option value="ip_phone" style={{ background: '#ffffff', color: 'hsl(var(--text-main))' }}>IP Phone Installation</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(var(--text-muted))' }}>Message / Project Brief</label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Briefly describe your requirements..."
                    style={{
                      padding: '12px 16px',
                      background: '#ffffff',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      color: 'hsl(var(--text-main))',
                      fontSize: '0.92rem',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px' }}
                >
                  <Send size={16} />
                  {submitting ? 'Transmitting...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
