import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChairProps {
  activeObject?: string | null;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

const Chair: React.FC<ChairProps> = ({ activeObject, position, rotation, scale }) => {
  const { nodes, materials } = useGLTF('/models/chair.glb') as any;
  const groupRef = useRef<THREE.Group>(null);
  
  // Base rotation if provided via props
  const baseRotationY = rotation ? rotation[1] : 0;

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle swiveling animation (sine wave)
      const swivelAngle = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
      groupRef.current.rotation.y = baseRotationY + swivelAngle;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} dispose={null}>
      <mesh 
        castShadow 
        receiveShadow 
        geometry={nodes.OBJ_HighTechChair_base.geometry} 
        material={materials.MAT_HighTechChair_base} 
      />
    </group>
  );
};

export default Chair;
