import React, { useRef } from 'react';
import { Box, Cylinder, Sphere, Torus, Plane } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { Model as TreeModel } from './Tree';

// 1. Tree Plant
const ModernPlant: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <TreeModel position={position} scale={0.4} />
  );
};

// 2. Abstract Kinetic Sculpture
const AbstractSculpture: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ring1.current) ring1.current.rotation.y += delta * 0.5;
    if (ring2.current) ring2.current.rotation.x += delta * 0.8;
  });

  return (
    <group position={position}>
      {/* Base */}
      <Box args={[0.3, 0.05, 0.3]} position={[0, 0.025, 0]} castShadow>
        <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
      </Box>
      {/* Inner Glowing Orb */}
      <Sphere args={[0.08, 32, 32]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2} />
      </Sphere>
      {/* Rotating Rings */}
      <Torus ref={ring1} args={[0.15, 0.01, 16, 100]} position={[0, 0.3, 0]} castShadow>
        <meshStandardMaterial color="#fff" metalness={1} roughness={0} />
      </Torus>
      <Torus ref={ring2} args={[0.2, 0.01, 16, 100]} position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <meshStandardMaterial color="#aaa" metalness={1} roughness={0} />
      </Torus>
    </group>
  );
};

// 3. Modern Wall Art
const WallArt: React.FC<{ position: [number, number, number], rotation: [number, number, number] }> = ({ position, rotation }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <Box args={[2, 3, 0.05]} position={[0, 0, -0.025]} castShadow>
        <meshStandardMaterial color="#111" roughness={0.2} />
      </Box>
      {/* Canvas */}
      <Plane args={[1.8, 2.8]} position={[0, 0, 0.01]} receiveShadow>
        {/* Abstract gradient-like material */}
        <meshStandardMaterial color="#00ff88" roughness={0.5} />
      </Plane>
      {/* Geometric Overlay on Canvas */}
      <Plane args={[1.8, 1.4]} position={[0, -0.7, 0.011]}>
        <meshStandardMaterial color="#1a1b26" roughness={0.5} />
      </Plane>
      <Sphere args={[0.4, 32, 32]} position={[0, 0.2, 0.012]} scale={[1, 1, 0.1]}>
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </Sphere>
    </group>
  );
};

const Decorations: React.FC = () => {
  return (
    <group>
      {/* Large Floor Plant in left corner */}
      <ModernPlant position={[-2, 0, -2]} />
      
      {/* Sculpture on right shelf */}
      <AbstractSculpture position={[2.7, 1.25, 0]} />
      
      {/* Wall Art on Left Wall */}
      {/* Left wall is at x = -3. Place slightly off wall to prevent z-fighting */}
      <WallArt position={[-2.95, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
};

export default Decorations;
