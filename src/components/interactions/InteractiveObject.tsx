import React, { useRef, useState, useEffect } from 'react';
import { useCursor, Html } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

interface InteractiveObjectProps {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  targetCameraPosition: [number, number, number];
  targetCameraLookAt: [number, number, number];
  activeObject: string | null;
  name: string;
  onCameraArrive?: () => void;
  disableZoom?: boolean;
}

const InteractiveObject: React.FC<InteractiveObjectProps> = ({ 
  children, 
  label, 
  onClick,
  targetCameraPosition,
  targetCameraLookAt,
  activeObject,
  name,
  onCameraArrive,
  disableZoom = false
}) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const { camera, controls } = useThree();

  // Store the initial camera position to return to
  const initialCameraState = useRef({
    position: new THREE.Vector3(-2.2, 3.2, 2.2),
    target: new THREE.Vector3(0, 0.5, 0)
  });

  // Watch for activeObject changes to reset camera
  useEffect(() => {
    // If we WERE active, and now we are NOT, return to center
    // (We also check if activeObject became null to prevent resetting when just switching panels, though switching directly isn't currently possible)
    if (activeObject === null && controls && (controls as any).enabled === false) {
       // A bit hacky, but if controls are disabled, we might have just closed the UI
       const orbitControls = controls as any;
       
       gsap.to(camera.position, {
         x: initialCameraState.current.position.x,
         y: initialCameraState.current.position.y,
         z: initialCameraState.current.position.z,
         duration: 1.0,
         ease: 'power3.out',
         onUpdate: () => {
           camera.lookAt(orbitControls.target);
         }
       });
       
       gsap.to(orbitControls.target, {
         x: initialCameraState.current.target.x,
         y: initialCameraState.current.target.y,
         z: initialCameraState.current.target.z,
         duration: 1.0,
         ease: 'power3.out',
         onComplete: () => {
           orbitControls.enabled = true;
           if (orbitControls.enableDamping !== undefined) {
             orbitControls.enableDamping = true;
           }
         }
       });
    }
  }, [activeObject, camera.position, controls]);

  useCursor(hovered, 'pointer', 'auto');

  // Highlight effect
  useEffect(() => {
    if (!groupRef.current) return;

    const meshes: THREE.Mesh[] = [];
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          meshes.push(mesh);
        }
      }
    });

    meshes.forEach((mesh) => {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      
      mats.forEach((mat) => {
        const material = mat as THREE.MeshStandardMaterial;
        if (!material || !material.emissive) return;

        if (!material.userData.originalEmissive) {
          material.userData.originalEmissive = material.emissive.clone();
        }
        
        const targetEmissive = hovered ? new THREE.Color(0.15, 0.15, 0.15) : material.userData.originalEmissive;
        
        gsap.to(material.emissive, {
          r: targetEmissive.r,
          g: targetEmissive.g,
          b: targetEmissive.b,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }, [hovered]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    console.log(`[InteractiveObject] Clicked on: ${name}, current activeObject: ${activeObject}`);
    
    // Only allow clicking if no object is currently active or if this is the active object (to toggle off? No, toggle off is handled elsewhere usually)
    if (activeObject && activeObject !== name) {
      console.log(`[InteractiveObject] Blocked click because activeObject is ${activeObject}`);
      return;
    }

    console.log(`[InteractiveObject] Proceeding with click for: ${name}`);
    onClick();

    // Save current camera state before moving
    const orbitControls = controls as any;
    initialCameraState.current.position.copy(camera.position);
    initialCameraState.current.target.copy(orbitControls.target);

    // Camera animation using GSAP
    if (controls && !disableZoom) {
      orbitControls.enabled = false; // Disable during animation
      if (orbitControls.enableDamping !== undefined) {
        orbitControls.enableDamping = false; // Stop inertia from fighting GSAP
      }

      gsap.to(camera.position, {
        x: targetCameraPosition[0],
        y: targetCameraPosition[1],
        z: targetCameraPosition[2],
        duration: 1.0,
        ease: 'power3.out',
        onUpdate: () => {
          // Force camera to look at target during transition
          camera.lookAt(orbitControls.target);
        }
      });

      gsap.to(orbitControls.target, {
        x: targetCameraLookAt[0],
        y: targetCameraLookAt[1],
        z: targetCameraLookAt[2],
        duration: 1.0,
        ease: 'power3.out',
        onComplete: () => {
          orbitControls.enabled = false; // KEEP disabled so user cannot drag away while tab is open
          if (onCameraArrive) onCameraArrive();
        }
      });
    } else {
      if (onCameraArrive) onCameraArrive();
    }
  };

  return (
    <group 
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {children}
      
      {hovered && !activeObject && (
        <Html position={[0, 0.5, 0]} center style={{ pointerEvents: 'none' }} wrapperClass="no-pointer">
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
};

export default InteractiveObject;
