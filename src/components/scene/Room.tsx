import React from 'react';
import { Plane } from '@react-three/drei';

const Room: React.FC = () => {
  return (
    <group>
      {/* Huge Sand Floor */}
      <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <meshStandardMaterial color="#e0cda9" roughness={1.0} metalness={0.0} />
      </Plane>
    </group>
  );
};

export default Room;
