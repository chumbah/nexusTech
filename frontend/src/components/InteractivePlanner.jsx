import React, { useState, useRef } from 'react';
import { Cctv, PhoneCall, Trash2, ArrowRight, Layers, LayoutGrid } from 'lucide-react';

export default function InteractivePlanner({ onApplyToEstimator }) {
  const [selectedLayout, setSelectedLayout] = useState('office'); // office, retail, home
  const [selectedTool, setSelectedTool] = useState('cctv'); // cctv, ipphone
  const [nodes, setNodes] = useState([
    { id: 1, type: 'cctv', x: 200, y: 120, label: 'Cam 1' },
    { id: 2, type: 'cctv', x: 420, y: 80, label: 'Cam 2' },
    { id: 3, type: 'ipphone', x: 300, y: 220, label: 'Ext 101' },
  ]);
  
  const canvasRef = useRef(null);

  const layouts = {
    office: {
      title: 'Corporate Office (800 sq ft)',
      rooms: [
        { name: 'Server Room', x: 20, y: 20, w: 150, h: 120, color: 'rgba(139, 92, 246, 0.05)' },
        { name: 'Reception', x: 190, y: 20, w: 290, h: 120, color: 'rgba(6, 182, 212, 0.05)' },
        { name: 'Open Desk Space', x: 20, y: 160, w: 300, h: 180, color: 'rgba(255, 255, 255, 0.01)' },
        { name: 'Conference Room', x: 340, y: 160, w: 140, h: 180, color: 'rgba(219, 39, 119, 0.03)' }
      ]
    },
    retail: {
      title: 'Retail Store (600 sq ft)',
      rooms: [
        { name: 'Warehouse / Stock', x: 20, y: 20, w: 160, h: 180, color: 'rgba(139, 92, 246, 0.05)' },
        { name: 'Sales Floor', x: 200, y: 20, w: 280, h: 320, color: 'rgba(6, 182, 212, 0.05)' },
        { name: 'Cash Register Counter', x: 20, y: 220, w: 160, h: 120, color: 'rgba(219, 39, 119, 0.03)' }
      ]
    },
    home: {
      title: 'Smart Smart-Home / Office',
      rooms: [
        { name: 'Living Area', x: 20, y: 20, w: 250, h: 200, color: 'rgba(6, 182, 212, 0.05)' },
        { name: 'Master Bedroom', x: 290, y: 20, w: 190, h: 180, color: 'rgba(139, 92, 246, 0.05)' },
        { name: 'Home Office', x: 20, y: 240, w: 220, h: 100, color: 'rgba(219, 39, 119, 0.03)' },
        { name: 'Front Entrance Yard', x: 260, y: 220, w: 220, h: 120, color: 'rgba(255, 255, 255, 0.01)' }
      ]
    }
  };

  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return;
    
    // Get mouse position relative to canvas
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check boundaries to keep inside the floor plan
    if (x < 10 || x > 490 || y < 10 || y > 350) return;

    const cctvCount = nodes.filter(n => n.type === 'cctv').length;
    const phoneCount = nodes.filter(n => n.type === 'ipphone').length;
    
    const newNode = {
      id: Date.now(),
      type: selectedTool,
      x,
      y,
      label: selectedTool === 'cctv' ? `Cam ${cctvCount + 1}` : `Ext ${101 + phoneCount}`
    };

    setNodes([...nodes, newNode]);
  };

  const removeNode = (id, e) => {
    e.stopPropagation();
    setNodes(nodes.filter(n => n.id !== id));
  };

  const clearNodes = () => {
    setNodes([]);
  };

  const cctvs = nodes.filter(n => n.type === 'cctv');
  const phones = nodes.filter(n => n.type === 'ipphone');

  return (
    <section 
      id="planner" 
      style={{
        padding: '100px 0',
        position: 'relative',
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.2)'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Interactive Simulation</span>
          <h2 className="section-title">Physical Layout Planner</h2>
          <p className="section-subtitle">
            Simulate your hardware layout. Select a premises blueprints, place cameras & VoIP office extensions, and sync the count instantly with our cost estimator.
          </p>
        </div>

        {/* Planner Workspace */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '40px',
            alignItems: 'stretch',
            marginTop: '40px'
          }}
          className="planner-grid"
        >
          <style dangerouslySetInnerHTML={{__html: `
            @media (max-width: 992px) {
              .planner-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}} />

          {/* Interactive Canvas Panel */}
          <div 
            className="glass-panel"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Canvas Header Controls */}
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                paddingBottom: '16px'
              }}
            >
              {/* Layout Selectors */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {Object.keys(layouts).map((layKey) => (
                  <button
                    key={layKey}
                    onClick={() => {
                      setSelectedLayout(layKey);
                      clearNodes();
                    }}
                    className={`btn ${selectedLayout === layKey ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '6px 14px', fontSize: '0.8rem', textTransform: 'capitalize' }}
                  >
                    {layKey} Plan
                  </button>
                ))}
              </div>

              {/* Tool selector */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => setSelectedTool('cctv')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: selectedTool === 'cctv' ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.08)',
                    background: selectedTool === 'cctv' ? 'rgba(249, 115, 22, 0.15)' : 'transparent',
                    color: selectedTool === 'cctv' ? 'hsl(var(--primary))' : 'hsl(var(--text-main))',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <Cctv size={14} />
                  IP CCTV Camera
                </button>
                <button
                  onClick={() => setSelectedTool('ipphone')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: selectedTool === 'ipphone' ? 'hsl(var(--secondary))' : 'rgba(255,255,255,0.08)',
                    background: selectedTool === 'ipphone' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                    color: selectedTool === 'ipphone' ? 'hsl(var(--secondary))' : 'hsl(var(--text-main))',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <PhoneCall size={14} />
                  IP VoIP Phone
                </button>
              </div>
            </div>

            {/* Canvas Box */}
            <div 
              ref={canvasRef}
              onClick={handleCanvasClick}
              style={{
                height: '360px',
                width: '100%',
                background: '#FAF8F5',
                border: '1px dashed rgba(0,0,0,0.15)',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'crosshair',
                userSelect: 'none'
              }}
            >
              {/* Floor Plan Drawings */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                {layouts[selectedLayout].rooms.map((room, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: `${room.x}px`,
                      top: `${room.y}px`,
                      width: `${room.w}px`,
                      height: `${room.h}px`,
                      border: '1px solid rgba(0,0,0,0.08)',
                      background: room.color,
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      pointerEvents: 'none'
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'rgba(0,0,0,0.35)', fontWeight: 600 }}>
                      {room.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Instruction banner overlay */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(255,255,255,0.95)',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  color: 'hsl(var(--text-main))',
                  border: '1px solid rgba(0,0,0,0.08)',
                  pointerEvents: 'none'
                }}
              >
                Click inside floor plan to place: {selectedTool === 'cctv' ? 'CCTV Camera' : 'IP VoIP Phone'}
              </div>

              {/* Placed Nodes */}
              {nodes.map((node) => (
                <div
                  key={node.id}
                  style={{
                    position: 'absolute',
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20,
                    cursor: 'pointer'
                  }}
                  title="Click red x to delete"
                >
                  {/* Glowing vision cone for CCTV */}
                  {node.type === 'cctv' && (
                    <div 
                      style={{
                        position: 'absolute',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)',
                        transform: 'translate(-50%, -50%)',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none',
                        animation: 'pulse-glow 2s infinite'
                      }}
                    />
                  )}

                  {/* Glowing ripple for VoIP */}
                  {node.type === 'ipphone' && (
                    <div 
                      style={{
                        position: 'absolute',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 75%)',
                        transform: 'translate(-50%, -50%)',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none',
                        animation: 'pulse-glow 3s infinite'
                      }}
                    />
                  )}

                  {/* Marker Node Button */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: node.type === 'cctv' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: node.type === 'cctv' ? 'white' : '#ffffff',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
                      border: '2px solid rgba(255,255,255,0.95)',
                      position: 'relative'
                    }}
                  >
                    {node.type === 'cctv' ? <Cctv size={14} /> : <PhoneCall size={14} />}

                    {/* Node Text Label */}
                    <span 
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        whiteSpace: 'nowrap',
                        background: 'rgba(255, 255, 255, 0.95)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontFamily: 'monospace',
                        marginTop: '4px',
                        color: 'hsl(var(--text-main))',
                        border: '1px solid rgba(0,0,0,0.1)'
                      }}
                    >
                      {node.label}
                    </span>

                    {/* Delete node overlay */}
                    <button
                      onClick={(e) => removeNode(node.id, e)}
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        background: '#ff5f56',
                        border: 'none',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        color: 'white',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0
                      }}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration and Sync Panel */}
          <div 
            className="glass-panel"
            style={{
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers className="text-cyan" size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Equipment Bill</h3>
              </div>
              <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem', lineHeight: '1.5' }}>
                You are designing layout: <span style={{ color: 'hsl(var(--text-main))', fontWeight: 600 }}>{layouts[selectedLayout].title}</span>
              </p>

              {/* Counters */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '10px 0' }}>
                <div 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: 'rgba(249, 115, 22, 0.05)',
                    border: '1px solid rgba(249, 115, 22, 0.15)',
                    borderRadius: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Cctv size={18} className="text-purple" />
                    <span>CCTV Cameras Placed</span>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'hsl(var(--primary))' }}>
                    {cctvs.length}
                  </span>
                </div>

                <div 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: 'rgba(245, 158, 11, 0.05)',
                    border: '1px solid rgba(245, 158, 11, 0.15)',
                    borderRadius: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <PhoneCall size={18} className="text-cyan" />
                    <span>VoIP Phones Placed</span>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'hsl(var(--secondary))' }}>
                    {phones.length}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={clearNodes}
                  className="btn btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    fontSize: '0.75rem'
                  }}
                  disabled={nodes.length === 0}
                >
                  <Trash2 size={12} />
                  Clear Grid
                </button>
              </div>
            </div>

            {/* Sync Button */}
            <div style={{ marginTop: '24px' }}>
              <button 
                onClick={() => onApplyToEstimator(cctvs.length, phones.length)}
                className="btn btn-glow"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}
              >
                Sync with Cost Estimator
                <ArrowRight size={16} />
              </button>
              <p style={{ fontSize: '0.72rem', color: 'hsl(var(--text-dim))', textAlign: 'center', marginTop: '8px' }}>
                Transfer counts into the Request Quote calculator below.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
