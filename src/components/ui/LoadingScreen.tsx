import React, { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';

interface LoadingScreenProps {
  onStarted: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onStarted }) => {
  const { progress } = useProgress();
  const [canStart, setCanStart] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      setCanStart(true);
      // Auto start after a short delay once fully loaded for a cinematic feel
      const timeout = setTimeout(() => {
        onStarted();
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [progress, onStarted]);

  return (
    <div className="loading-screen" style={{ opacity: canStart ? 0 : 1, pointerEvents: canStart ? 'none' : 'auto' }}>
      <h1>RAM</h1>
      <p>Interactive Portfolio</p>
      
      <div className="loading-progress">
        <div 
          className="loading-bar" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      <p style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.5 }}>
        Loading environment... {Math.round(progress)}%
      </p>
    </div>
  );
};

export default LoadingScreen;
