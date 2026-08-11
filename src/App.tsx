import React, { Suspense, useState, createContext, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, BakeShadows, Preload } from '@react-three/drei';
import LoadingScreen from './components/ui/LoadingScreen';
import SceneManager from './components/scene/SceneManager';
import ProjectOS from './components/ui/ProjectOS';
import OverlayPanel from './components/ui/OverlayPanel';
import { AnimatePresence } from 'framer-motion';

// Simple context for UI State
export const UIContext = createContext<{
  activeObject: string | null;
  setActiveObject: (obj: string | null) => void;
}>({
  activeObject: null,
  setActiveObject: () => {},
});

function App() {
  const [started, setStarted] = useState(false);
  const [activeObject, setActiveObject] = useState<string | null>(null);

  const handleCloseUI = () => {
    setActiveObject(null);
  };

  return (
    <UIContext.Provider value={{ activeObject, setActiveObject }}>
      {!started && <LoadingScreen onStarted={() => setStarted(true)} />}
      
      <Canvas
        shadows
        camera={{ position: [-2.2, 3.2, 2.2], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <color attach="background" args={['#050505']} />
        
        <Suspense fallback={null}>
          <SceneManager />
          <Preload all />
          <BakeShadows />
        </Suspense>
        
        <OrbitControls 
          makeDefault
          enablePan={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          minDistance={1.5}
          maxDistance={4.2}
        />
      </Canvas>

      {/* UI Overlays */}
      <AnimatePresence>
        {activeObject === 'mac' && <ProjectOS onClose={handleCloseUI} />}
        {activeObject === 'resume' && (
          <OverlayPanel title="About Me & Resume" onClose={handleCloseUI}>
            <p>Hello! I'm an Information Technology student and developer.</p>
            <p>I love building interactive and premium web experiences.</p>
            <br />
            <h3>Experience</h3>
            <p>Software Engineer Intern at XYZ</p>
            <br />
            <h3>Education</h3>
            <p>B.S. Information Technology</p>
            <br />
            <button style={{ padding: '10px 20px', background: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
              Download Resume
            </button>
          </OverlayPanel>
        )}
        {activeObject === 'phone' && (
          <OverlayPanel title="Contact" onClose={handleCloseUI}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <p>Let's build something amazing together!</p>
              <a href="mailto:hello@example.com" style={{ padding: '10px', background: '#333', color: 'white', textDecoration: 'none', borderRadius: '8px', textAlign: 'center' }}>
                hello@example.com
              </a>
              <a href="#" style={{ padding: '10px', background: '#333', color: 'white', textDecoration: 'none', borderRadius: '8px', textAlign: 'center' }}>
                LinkedIn Profile
              </a>
              <a href="#" style={{ padding: '10px', background: '#333', color: 'white', textDecoration: 'none', borderRadius: '8px', textAlign: 'center' }}>
                GitHub Profile
              </a>
            </div>
          </OverlayPanel>
        )}

        {activeObject === 'bookshelf' && (
          <OverlayPanel title="Learning" onClose={handleCloseUI}>
            <p>I'm always learning new things!</p>
            <p>Currently studying:</p>
            <ul>
              <li>Advanced 3D Web Graphics</li>
              <li>React Three Fiber</li>
              <li>Generative AI Integration</li>
            </ul>
          </OverlayPanel>
        )}
      </AnimatePresence>
    </UIContext.Provider>
  );
}

export default App;
