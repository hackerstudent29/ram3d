import React, { useRef } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

interface TableProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

const Table: React.FC<TableProps> = ({ position, rotation, scale }) => {
  const { nodes, materials } = useGLTF('/models/table.glb') as any;
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} dispose={null}>
      {/* Center the table so its origin is precisely at the middle of its bounding box */}
      <Center>
        <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh castShadow receiveShadow geometry={nodes.Table.geometry} material={materials.Material__21} scale={0.01} />
        </group>
      </Center>
    </group>
  );
};

export default Table;
