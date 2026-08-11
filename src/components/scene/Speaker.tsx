import React, { useRef, useState, useEffect } from 'react';
import { PositionalAudio, useGLTF, Center, Html } from '@react-three/drei';
import InteractiveObject from '../interactions/InteractiveObject';
import * as THREE from 'three';

interface SpeakerProps {
  activeObject: string | null;
  setActiveObject: (obj: string | null) => void;
  position: [number, number, number];
}

const SONGS = [
  { title: "Old Town Road", url: "/music/Old Town Road.mp3" },
  { title: "Blinding Lights", url: "/music/Blinding Lights.mp3" },
  { title: "Harleys In Hawaii", url: "/music/Harleys In Hawaii.mp3" },
  { title: "Industry Baby", url: "/music/Industry Baby.mp3" }
];

const Speaker: React.FC<SpeakerProps> = ({ activeObject, setActiveObject, position }) => {
  const audioRef = useRef<THREE.PositionalAudio>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const { nodes } = useGLTF('/models/speaker.glb') as any;

  // Handle Play/Pause
  const togglePlay = (e?: any) => {
    if (e) e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const nextSong = (e: any) => {
    e.stopPropagation();
    if (audioRef.current && isPlaying) audioRef.current.stop();
    setCurrentSong((prev) => (prev + 1) % SONGS.length);
  };

  const prevSong = (e: any) => {
    e.stopPropagation();
    if (audioRef.current && isPlaying) audioRef.current.stop();
    setCurrentSong((prev) => (prev - 1 + SONGS.length) % SONGS.length);
  };

  // Re-play when song changes
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (audioRef.current && !audioRef.current.isPlaying) {
          audioRef.current.play();
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [currentSong, isPlaying]);

  const handleSpeakerClick = () => {
    setActiveObject('speaker');
    setShowControls(!showControls);
  };

  useEffect(() => {
    if (activeObject !== 'speaker') setShowControls(false);
  }, [activeObject]);

  const renderMeshes = () => {
    const meshes = [];
    for (let i = 0; i < 65; i++) {
      const nodeName = `mesh_${i}`;
      if (nodes[nodeName]) {
        meshes.push(
          <mesh 
            key={nodeName}
            castShadow 
            receiveShadow 
            geometry={nodes[nodeName].geometry} 
            material={nodes[nodeName].material} 
          />
        );
      }
    }
    return meshes;
  };

  const btnStyle = {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '5px'
  };

  return (
    <InteractiveObject
      name="speaker"
      label={isPlaying ? "Playing..." : "Speaker"}
      activeObject={activeObject}
      onClick={handleSpeakerClick}
      targetCameraPosition={position} // Unused due to disableZoom
      targetCameraLookAt={position}
      disableZoom={true}
    >
      <group position={position} rotation={[0, 0, 0]} scale={0.02} dispose={null}>
        
        {showControls && (
          <Html position={[0, 20, 0]} center zIndexRange={[100, 0]}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              padding: '15px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '180px',
              color: 'white',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              pointerEvents: 'auto'
            }} onClick={(e) => e.stopPropagation()}>
              
              {/* Animated Equalizer if playing */}
              {isPlaying && (
                <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', height: '15px', alignItems: 'flex-end' }}>
                  <div style={{ width: '4px', height: '100%', background: '#00ff88', animation: 'bounce 0.8s infinite alternate' }} />
                  <div style={{ width: '4px', height: '60%', background: '#00ff88', animation: 'bounce 0.8s infinite alternate 0.2s' }} />
                  <div style={{ width: '4px', height: '80%', background: '#00ff88', animation: 'bounce 0.8s infinite alternate 0.4s' }} />
                </div>
              )}

              <div style={{ fontSize: '13px', marginBottom: '12px', fontWeight: 'bold', textAlign: 'center' }}>
                {SONGS[currentSong].title}
              </div>
              
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <button onClick={prevSong} style={btnStyle}>⏮</button>
                <button onClick={togglePlay} style={{...btnStyle, fontSize: '24px'}}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button onClick={nextSong} style={btnStyle}>⏭</button>
              </div>
            </div>
          </Html>
        )}

        <Center bottom>
          <group>
            {renderMeshes()}
          </group>
        </Center>
        
        <PositionalAudio
          key={currentSong}
          ref={audioRef}
          url={SONGS[currentSong].url}
          distance={2}
          loop
        />
      </group>
    </InteractiveObject>
  );
};

export default Speaker;
