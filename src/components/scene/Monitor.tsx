import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface MonitorProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  screenOn: boolean;
}

const Monitor: React.FC<MonitorProps> = ({ position, rotation, scale, screenOn }) => {
  const { nodes, materials } = useGLTF('/models/monitor.glb') as any;
  const groupRef = useRef<THREE.Group>(null);

  // Animate screen emissive property when turning on/off
  useEffect(() => {
    // The model has two screens: materials.Screen and materials['Screen.001']
    const screenMat1 = materials.Screen as THREE.MeshStandardMaterial;
    const screenMat2 = materials['Screen.001'] as THREE.MeshStandardMaterial;

    if (!screenMat1 || !screenMat2) return;

    // Ensure emissive is set up
    if (!screenMat1.emissive) screenMat1.emissive = new THREE.Color(0x000000);
    if (!screenMat2.emissive) screenMat2.emissive = new THREE.Color(0x000000);

    const targetIntensity = screenOn ? 1.5 : 0;
    const targetColor = screenOn ? new THREE.Color('#ffffff') : new THREE.Color('#000000');

    // Simple screen power on sequence
    if (screenOn) {
      // 1. Small glow
      gsap.to([screenMat1.emissive, screenMat2.emissive], {
        r: 0.1, g: 0.1, b: 0.2,
        duration: 0.2,
        onComplete: () => {
          // 2. Full illumination
          gsap.to([screenMat1.emissive, screenMat2.emissive], {
            r: targetColor.r,
            g: targetColor.g,
            b: targetColor.b,
            duration: 0.4,
          });
        }
      });
      gsap.to([screenMat1, screenMat2], {
        emissiveIntensity: targetIntensity,
        duration: 0.6,
      });
    } else {
      // Turn off
      gsap.to([screenMat1.emissive, screenMat2.emissive], {
        r: 0, g: 0, b: 0,
        duration: 0.3,
      });
      gsap.to([screenMat1, screenMat2], {
        emissiveIntensity: 0,
        duration: 0.3,
      });
    }

  }, [screenOn, materials]);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} dispose={null}>
      {/* Extracting ONLY the single main monitor to avoid cross/overlapping geometry */}
      
      <group position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow receiveShadow geometry={nodes.Curve.geometry} material={materials['Brushed metal']} position={[1.67, 2.869, 0.274]} rotation={[Math.PI / 2, 0.196, -Math.PI / 2]} scale={0.49} />
        <mesh castShadow receiveShadow geometry={nodes.Circle.geometry} material={materials['Material.004']} position={[-0.102, 0.477, -0.068]} scale={0.501} />
        <mesh castShadow receiveShadow geometry={nodes.Cube.geometry} material={materials['Wood Black UA.002']} position={[0.012, 0.415, 2.645]} rotation={[0, 0.001, 0]} scale={0.368} />
        <group position={[1.135, 5.658, 0.075]} rotation={[0, 0, 0.105]} scale={[0.212, 3.168, 5.928]}>
          <mesh castShadow receiveShadow geometry={nodes.Cube003_1.geometry} material={materials.Screen} />
          <mesh castShadow receiveShadow geometry={nodes.Cube003_2.geometry} material={materials['Wood Black UA']} />
        </group>
        <mesh castShadow receiveShadow geometry={nodes.Cylinder.geometry} material={materials['Body.001']} position={[0.012, 1.974, -0.001]} scale={[0.607, 0.341, 0.607]} />
        <mesh castShadow receiveShadow geometry={nodes.Cylinder001.geometry} material={materials.Gold} position={[0.012, 1.145, -0.001]} scale={0.556} />
        
        {/* Logos/details on the monitor (Curve001 to 012 in original) */}
        <mesh geometry={nodes.Curve001.geometry} material={materials['SVGMat.002']} position={[0.024, 0.54, -0.358]} scale={5.668} />
        <mesh geometry={nodes.Curve002.geometry} material={materials['SVGMat.002']} position={[0.024, 0.54, 0.288]} scale={5.668} />
        <mesh geometry={nodes.Curve003.geometry} material={materials['SVGMat.002']} position={[-0.135, 0.54, -0.305]} scale={5.668} />
      </group>
    </group>
  );
};

export default Monitor;
