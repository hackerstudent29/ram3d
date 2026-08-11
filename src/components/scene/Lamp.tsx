import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface LampProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  isOn: boolean;
}

const Lamp: React.FC<LampProps> = ({ position, rotation, scale, isOn }) => {
  const { nodes, materials } = useGLTF('/models/lamp.glb') as any;
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    // The "luz" material represents the lightbulb
    const bulbMat = materials.luz as THREE.MeshStandardMaterial;
    if (!bulbMat) return;

    if (!bulbMat.emissive) {
      bulbMat.emissive = new THREE.Color(0x000000);
    }

    if (isOn) {
      // Turn on animation
      gsap.to(bulbMat.emissive, {
        r: 1.0, g: 0.9, b: 0.7, // Warm yellowish light
        duration: 0.5,
      });
      gsap.to(bulbMat, {
        emissiveIntensity: 10,
        duration: 0.5,
      });
      
      if (lightRef.current) {
        gsap.to(lightRef.current, {
          intensity: 100,
          distance: 8,
          duration: 0.5,
        });
      }
    } else {
      // Turn off animation
      gsap.to(bulbMat.emissive, {
        r: 0, g: 0, b: 0,
        duration: 0.5,
      });
      gsap.to(bulbMat, {
        emissiveIntensity: 0,
        duration: 0.5,
      });
      
      if (lightRef.current) {
        gsap.to(lightRef.current, {
          intensity: 0,
          duration: 0.5,
        });
      }
    }
  }, [isOn, materials]);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Cube.geometry} material={materials.madera} position={[1.074, 7.075, 0]} />
      <mesh castShadow receiveShadow geometry={nodes.Retopo_Circle.geometry} material={materials.madera} position={[0, 0.166, 0]} />
      <mesh castShadow receiveShadow geometry={nodes.Retopo_Cylinder005.geometry} material={materials.madera} position={[1.593, 6.16, 0.015]} />
      <mesh castShadow receiveShadow geometry={nodes.Roundcube.geometry} material={materials.madera} position={[-1.78, 10.661, 0.008]} />
      <mesh castShadow receiveShadow geometry={nodes.Circle001.geometry} material={materials['metal tubos']} position={[0, 4.834, 0]} />
      <mesh castShadow receiveShadow geometry={nodes.Circle002.geometry} material={materials['metal tubos']} position={[1.078, 8.199, -0.001]} />
      <mesh castShadow receiveShadow geometry={nodes.Cylinder001.geometry} material={materials['metal tubos']} position={[1.591, 6.578, 0]} />
      <mesh castShadow receiveShadow geometry={nodes.Retopo_Circle005.geometry} material={materials['metal tubos']} position={[-1.782, 11.205, 0.003]} />
      <group position={[-1.784, 10.458, 0.008]}>
        <mesh castShadow receiveShadow geometry={nodes.mesh004.geometry} material={materials.madera} />
        <mesh castShadow receiveShadow geometry={nodes.mesh004_1.geometry} material={materials.Material} />
      </group>
      
      {/* Bulb (luz) */}
      <mesh geometry={nodes.Sphere.geometry} material={materials.luz} position={[-1.78, 8.475, -0.064]}>
        {/* Actual point light source radiating from the bulb */}
        <pointLight 
          ref={lightRef} 
          color="#ffb86c" 
          intensity={0} 
          distance={8} 
          decay={2} 
          castShadow 
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
      </mesh>
      
      <mesh castShadow receiveShadow geometry={nodes.Retopo_Cylinder002.geometry} material={materials.cortin} position={[-1.785, 8.475, -0.009]} />
    </group>
  );
};

export default Lamp;
