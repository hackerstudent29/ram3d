import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';
import { projects } from '../../data/projects';

interface ProjectOSProps {
  onClose: () => void;
}

const ProjectOS: React.FC<ProjectOSProps> = ({ onClose }) => {
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  return (
    <motion.div 
      className="ui-layer project-os"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.4)', 
        pointerEvents: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <motion.div 
        className="os-screen"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: '90%',
          height: '90%',
          background: 'linear-gradient(135deg, #1e1e2f, #2a2a40)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid #444'
        }}
      >
        {/* Menu Bar */}
        <div style={{ height: '30px', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', padding: '0 20px', fontSize: '12px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontWeight: 'bold', marginRight: '20px' }}>Portfolio OS</div>
          <div style={{ marginRight: '15px' }}>File</div>
          <div style={{ marginRight: '15px' }}>Edit</div>
          <div style={{ marginRight: '15px' }}>View</div>
          <div style={{ flex: 1 }} />
          <div>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <button onClick={onClose} style={{ marginLeft: '20px', background: 'none', border: 'none', color: '#ff5f56', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            Close OS
          </button>
        </div>

        {/* Desktop Icons */}
        <div style={{ padding: '20px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          {projects.map(app => (
            <div 
              key={app.id} 
              onClick={() => setActiveWindow(app.id)}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                width: '80px', 
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '8px',
                background: activeWindow === app.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                transition: 'background 0.2s'
              }}
            >
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'rgba(255,255,255,0.1)', 
                borderRadius: '12px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                marginBottom: '8px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}>
                {app.icon}
              </div>
              <span style={{ fontSize: '12px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{app.name}</span>
            </div>
          ))}
        </div>

        {/* Project Window */}
        <AnimatePresence>
          {activeWindow && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'absolute',
                top: '10%',
                left: '20%',
                width: '60%',
                height: '70%',
                background: '#1a1a1a',
                borderRadius: '10px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                border: '1px solid #333',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ 
                height: '32px', 
                background: '#2d2d2d', 
                borderRadius: '10px 10px 0 0', 
                display: 'flex', 
                alignItems: 'center',
                padding: '0 10px'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div onClick={() => setActiveWindow(null)} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', cursor: 'pointer' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
                </div>
                <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#888' }}>
                  {projects.find(a => a.id === activeWindow)?.name}
                </div>
              </div>
              <div style={{ padding: '30px', flex: 1, overflowY: 'auto' }}>
                {(() => {
                  const project = projects.find(a => a.id === activeWindow);
                  if (!project) return null;
                  return (
                    <>
                      <h1 style={{ marginBottom: '10px' }}>{project.name}</h1>
                      <p style={{ color: '#aaa', marginBottom: '20px' }}>{project.description}</p>
                      
                      <h3 style={{ marginBottom: '10px', fontSize: '14px', color: '#888' }}>Technologies</h3>
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        {project.technologies.map(tech => (
                           <span key={tech} style={{ padding: '4px 8px', background: '#333', borderRadius: '4px', fontSize: '12px' }}>{tech}</span>
                        ))}
                      </div>

                      <h3 style={{ marginBottom: '10px', fontSize: '14px', color: '#888' }}>Features</h3>
                      <ul style={{ color: '#ccc', paddingLeft: '20px', marginBottom: '30px' }}>
                        {project.features.map(feature => (
                          <li key={feature} style={{ marginBottom: '8px' }}>{feature}</li>
                        ))}
                      </ul>

                      <div style={{ display: 'flex', gap: '15px' }}>
                        <button style={{ padding: '10px 20px', background: 'white', color: 'black', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                          Live Demo
                        </button>
                        <button style={{ padding: '10px 20px', background: 'transparent', color: 'white', border: '1px solid #555', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                          GitHub
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </motion.div>
  );
};

export default ProjectOS;
