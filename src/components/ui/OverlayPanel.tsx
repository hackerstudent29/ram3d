import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface OverlayPanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const OverlayPanel: React.FC<OverlayPanelProps> = ({ title, onClose, children }) => {
  return (
    <motion.div 
      className="ui-layer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <motion.div 
        className="ui-panel"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ width: '80%', maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto', padding: '2rem', position: 'relative' }}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>
        <h2 style={{ marginBottom: '1.5rem', fontWeight: 300, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>{title}</h2>
        <div style={{ lineHeight: '1.6', color: '#ccc' }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OverlayPanel;
