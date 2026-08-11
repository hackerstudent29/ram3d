import React, { useRef, useEffect } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface IPhoneProps {
  activeObject?: string | null;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

const IPhone: React.FC<IPhoneProps> = ({ activeObject, position, rotation, scale }) => {
  const { nodes, materials } = useGLTF('/models/iphone.glb') as any;
  const groupRef = useRef<THREE.Group>(null);
  const meshGroupRef = useRef<THREE.Group>(null);
  
  const initialY = position ? position[1] : 0.88;

  useEffect(() => {
    if (activeObject === 'phone') {
      if (groupRef.current && meshGroupRef.current) {
        // Float up
        gsap.to(groupRef.current.position, {
          y: initialY + 0.1,
          duration: 1.0,
          ease: 'power3.out'
        });
        // Stand up and face camera
        gsap.to(meshGroupRef.current.rotation, {
          x: Math.PI / 2, // Stand up vertically
          y: Math.PI,     // Face front
          z: 0,
          duration: 1.0,
          ease: 'power3.out'
        });
      }
    } else {
      if (groupRef.current && meshGroupRef.current) {
        // Return down
        gsap.to(groupRef.current.position, {
          y: initialY,
          duration: 1.0,
          ease: 'power3.out'
        });
        // Lay back flat
        gsap.to(meshGroupRef.current.rotation, {
          x: rotation ? rotation[0] : -Math.PI / 2,
          y: rotation ? rotation[1] : 0,
          z: rotation ? rotation[2] : 0.2,
          duration: 1.0,
          ease: 'power3.out'
        });
      }
    }
  }, [activeObject, initialY, rotation]);

  return (
    <group ref={groupRef} position={position} scale={scale} dispose={null}>
      <Center bottom>
        <group ref={meshGroupRef} rotation={rotation}>
          <mesh castShadow receiveShadow geometry={nodes.main_1.geometry} material={materials.phone16pro} />
          <mesh castShadow receiveShadow geometry={nodes.camera_1.geometry} material={materials.phone16pro} />
          <mesh castShadow receiveShadow geometry={nodes.glass_1.geometry} material={materials.phone16pro_transparent} />
          <mesh castShadow receiveShadow geometry={nodes.apple_1.geometry} material={materials.phone16pro} />
        </group>
      </Center>
    </group>
  );
};

export default IPhone;
