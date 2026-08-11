import React, { useRef, useState, useEffect } from 'react';
import { Box, Cylinder, PositionalAudio } from '@react-three/drei';
import InteractiveObject from '../interactions/InteractiveObject';
import * as THREE from 'three';

interface HeadphonesProps {
  activeObject: string | null;
  setActiveObject: (obj: string | null) => void;
  position: [number, number, number];
}

const Headphones: React.FC<HeadphonesProps> = ({ activeObject, setActiveObject, position }) => {
  const audioRef = useRef<THREE.PositionalAudio>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Stop playing if closed, play if active
  useEffect(() => {
    if (activeObject === 'headphones' && audioRef.current) {
      if (!audioRef.current.isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else if (audioRef.current && audioRef.current.isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [activeObject]);

  return (
    <InteractiveObject
      name="headphones"
      label={isPlaying ? "Playing Zenify..." : "Zenify"}
      activeObject={activeObject}
      onClick={() => setActiveObject('headphones')}
      targetCameraPosition={[position[0] - 0.2, position[1] + 0.3, position[2] + 0.5]}
      targetCameraLookAt={position}
    >
      <group position={position} rotation={[0, Math.PI / 4, 0]}>
        {/* Headband */}
        <Box args={[0.15, 0.02, 0.02]} position={[0, 0.1, 0]} castShadow>
          <meshStandardMaterial color="#111" roughness={0.5} />
        </Box>
        {/* Left Ear */}
        <Cylinder args={[0.04, 0.04, 0.03, 16]} position={[-0.075, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
           <meshStandardMaterial color="#222" roughness={0.2} metalness={0.8} />
        </Cylinder>
        {/* Right Ear */}
        <Cylinder args={[0.04, 0.04, 0.03, 16]} position={[0.075, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
           <meshStandardMaterial color="#222" roughness={0.2} metalness={0.8} />
        </Cylinder>
        
        {/* Audio */}
        <PositionalAudio
          ref={audioRef}
          url="/audio/song.mp3"
          distance={1}
          loop
        />
      </group>
    </InteractiveObject>
  );
};

export default Headphones;
