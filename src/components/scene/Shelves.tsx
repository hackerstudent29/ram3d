import React, { useMemo } from 'react';
import { Box } from '@react-three/drei';
import InteractiveObject from '../interactions/InteractiveObject';
import * as THREE from 'three';

interface ShelvesProps {
  activeObject: string | null;
  setActiveObject: (obj: string | null) => void;
}

const Shelves: React.FC<ShelvesProps> = ({ activeObject, setActiveObject }) => {
  // Sleek matte black/metal material for shelves
  const shelfMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a', // Matte black
    roughness: 0.3,
    metalness: 0.8,
  }), []);

  // Modern minimalist book palette
  const bookMaterial1 = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f0f0f0', roughness: 0.2 }), []); // Glossy white
  const bookMaterial2 = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.5 }), []); // Matte dark grey
  const bookMaterial3 = useMemo(() => new THREE.MeshStandardMaterial({ color: '#00ff88', roughness: 0.4 }), []); // Neon accent
  const bookMaterials = [bookMaterial1, bookMaterial2, bookMaterial3];

  const renderBooks = (count: number, startX: number, y: number, z: number, rotY: number = 0) => {
    return Array.from({ length: count }).map((_, i) => (
      <Box 
        key={`book-${i}`} 
        args={[0.08, 0.3, 0.2]} 
        position={[startX + (i * 0.085), y + 0.15, z]} 
        rotation={[0, rotY, 0]}
        castShadow
        material={bookMaterials[i % 3]}
      />
    ));
  };

  return (
    <group>
      {/* Right Wall Shelving Unit */}
      <group position={[2.7, 0, 0]}>
        {/* Verticals */}
        <Box args={[0.4, 3, 0.05]} position={[0, 1.5, -2]} castShadow receiveShadow material={shelfMaterial} />
        <Box args={[0.4, 3, 0.05]} position={[0, 1.5, 2]} castShadow receiveShadow material={shelfMaterial} />
        <Box args={[0.4, 3, 0.05]} position={[0, 1.5, 0]} castShadow receiveShadow material={shelfMaterial} />
        
        {/* Horizontals */}
        {[0.5, 1.2, 1.9, 2.6].map((y, i) => (
          <Box key={`r-shelf-${i}`} args={[0.38, 0.05, 4]} position={[0, y, 0]} castShadow receiveShadow material={shelfMaterial} />
        ))}
        
        {/* Books on Right Shelves */}
        {renderBooks(10, 0, 1.25, -1, Math.PI/2)}
        {renderBooks(5, 0, 1.95, 1, Math.PI/2)}
      </group>

      {/* Back Wall Shelving Unit (Interactive Bookshelf for Learning) */}
      <InteractiveObject
        name="bookshelf"
        label="Learning"
        activeObject={activeObject}
        onClick={() => setActiveObject('bookshelf')}
        targetCameraPosition={[1, 1.5, -2]}
        targetCameraLookAt={[2, 1.2, -3]}
      >
        <group position={[1, 0, -2.7]}>
           {/* Verticals */}
          <Box args={[0.05, 2, 0.4]} position={[-1.5, 1, 0]} castShadow receiveShadow material={shelfMaterial} />
          <Box args={[0.05, 2, 0.4]} position={[1.5, 1, 0]} castShadow receiveShadow material={shelfMaterial} />
          
          {/* Horizontals */}
          {[0.4, 1.0, 1.6].map((y, i) => (
            <Box key={`b-shelf-${i}`} args={[3, 0.05, 0.38]} position={[0, y, 0]} castShadow receiveShadow material={shelfMaterial} />
          ))}

          {/* Books on Back Shelves */}
          {renderBooks(8, -1.2, 1.05, 0, 0)}
          {renderBooks(12, -0.5, 0.45, 0, 0)}
        </group>
      </InteractiveObject>

    </group>
  );
};

export default Shelves;
