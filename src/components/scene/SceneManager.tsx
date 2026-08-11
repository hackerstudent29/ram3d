import React, { useContext, useState, useEffect } from 'react';
import { Environment, Box, Sky } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import InteractiveObject from '../interactions/InteractiveObject';
import Room from './Room';
import Shelves from './Shelves';
import Speaker from './Speaker';
import Monitor from './Monitor';
import Lamp from './Lamp';
import Chair from './Chair';
import IPhone from './IPhone';
import Table from './Table';
import Decorations from './Decorations';
import { UIContext } from '../../App';
import * as THREE from 'three';

const SceneManager: React.FC = () => {
  const { activeObject, setActiveObject } = useContext(UIContext);
  const [isNight, setIsNight] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  
  // States for Monitor cinematic sequence
  const [monitorState, setMonitorState] = useState<'IDLE' | 'MOVING' | 'SCREEN_ON'>('IDLE');

  // Reset monitor screen when UI is closed
  useEffect(() => {
    if (activeObject !== 'mac' && monitorState === 'SCREEN_ON') {
      setMonitorState('IDLE');
    }
  }, [activeObject, monitorState]);

  // Smooth day/night transition
  useFrame((state, delta) => {
    const target = isNight ? 1 : 0;
    if (transitionProgress !== target) {
      const newProgress = THREE.MathUtils.lerp(transitionProgress, target, delta * 2);
      setTransitionProgress(newProgress);
    }
  });

  // Calculate colors/intensities based on transitionProgress
  // 0 = Day, 1 = Night
  const ambientIntensity = THREE.MathUtils.lerp(0.8, 0.1, transitionProgress);
  const directionalIntensity = THREE.MathUtils.lerp(2.5, 0.05, transitionProgress);
  const directionalColor = new THREE.Color().lerpColors(new THREE.Color('#fff0dd'), new THREE.Color('#0f172a'), transitionProgress);
  const envIntensity = THREE.MathUtils.lerp(1.2, 0.1, transitionProgress);

  return (
    <group>
      <Environment preset="sunset" environmentIntensity={envIntensity} />
      
      {/* Sky Background */}
      <Sky sunPosition={isNight ? [0, -100, 0] : [100, 20, 100]} turbidity={0.1} rayleigh={0.5} />

      <ambientLight intensity={ambientIntensity} />
      <directionalLight 
        castShadow 
        position={[10, 20, 10]} 
        intensity={directionalIntensity} 
        color={directionalColor}
        shadow-mapSize={[2048, 2048]} 
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* High Quality Procedural Room & Shelves */}
      <Room />
      <Decorations />
      <Shelves activeObject={activeObject} setActiveObject={setActiveObject} />
      
      {/* Desk (Replaced with Custom Model) */}
      <Table position={[0, 0.38, 0]} scale={1.0} />

      {/* Speaker (Replaces Headphones) */}
      <Speaker activeObject={activeObject} setActiveObject={setActiveObject} position={[0.6, 0.88, 0.2]} />

      {/* Interactive Real GLB Monitor */}
      <InteractiveObject 
        name="mac"
        label="Projects"
        activeObject={activeObject}
        onClick={() => {
          setMonitorState('MOVING'); // Camera starts moving
          setActiveObject('mac-transition'); // Prevent other interactions
        }}
        onCameraArrive={() => {
          setMonitorState('SCREEN_ON');
          // Wait for screen to turn on (800ms) before showing UI
          setTimeout(() => {
            setActiveObject('mac');
          }, 800);
        }}
        targetCameraPosition={[0, 1.21, 0.2]} // Pulled back slightly so the monitor isn't over-zoomed
        targetCameraLookAt={[0, 1.21, -0.2]} // Looking at the screen
      >
        <Monitor 
          position={[0, 0.76, -0.2]} // Centered, brought forward, fixed Y
          rotation={[0, 0, 0]} 
          scale={0.08} // Slightly larger
          screenOn={monitorState === 'SCREEN_ON'} 
        />
      </InteractiveObject>
      
      {/* Interactive Chair - Resume */}
      <InteractiveObject 
        name="resume"
        label="About Me"
        activeObject={activeObject}
        onClick={() => setActiveObject('resume')}
        targetCameraPosition={[0, 1.2, 1.5]} // Look at chair
        targetCameraLookAt={[0, 0.8, 0.8]}
      >
        <Chair 
          activeObject={activeObject}
          position={[0, 0, 0.8]} // Floor level
          rotation={[0, -Math.PI / 2, 0]} // Face North (rotated -90 deg from West)
          scale={1.2} 
        />
      </InteractiveObject>



      {/* Interactive Lamp (Day/Night Toggle) */}
      <InteractiveObject 
        name="lamp"
        label="Toggle Time"
        activeObject={activeObject}
        onClick={() => setIsNight(!isNight)}
        targetCameraPosition={[-0.7, 1.1, 0.9]} 
        targetCameraLookAt={[-0.7, 0.8, 0.4]}
        disableZoom={true}
      >
        <Lamp 
          position={[-0.7, 0.76, 0.4]} // Moved to the south side (front)
          rotation={[0, 0, 0]}
          scale={0.035}
          isOn={isNight} 
        />
      </InteractiveObject>

      {/* Interactive iPhone (Contact) */}
      <InteractiveObject 
        name="phone"
        label="Contact"
        activeObject={activeObject}
        onClick={() => setActiveObject('phone')}
        targetCameraPosition={[0.2, 1.0, 0.35]} // Camera perfectly aligned with floating phone (Y=0.98)
        targetCameraLookAt={[0.2, 1.0, 0.1]} // Looking directly at the phone screen
      >
        <IPhone 
          activeObject={activeObject}
          position={[0.2, 0.88, 0.1]} // On desk
          rotation={[-Math.PI / 2, 0, 0.2]} // Laying flat, slightly rotated
          scale={1.2} 
        />
      </InteractiveObject>
      
    </group>
  );
};

export default SceneManager;
