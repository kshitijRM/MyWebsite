import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const FloatingText3D = ({ text, position = [0, 0, 0], scale = 1, color = '#E0FF00' }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Glow effect behind text */}
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[text.length * 0.8, 1.5]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export const GlowingSphere = ({ position, color = '#E0FF00', size = 1, pulseSpeed = 1 }) => {
  const meshRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime * pulseSpeed;
    
    if (meshRef.current) {
      meshRef.current.scale.setScalar(size * (1 + Math.sin(time) * 0.1));
    }
    
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(time) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={glowRef} scale={1.5}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

export const FloatingPanel = ({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  width = 4, 
  height = 3,
  children,
  onClick,
  isHovered,
  onPointerOver,
  onPointerOut
}) => {
  const meshRef = useRef();
  const borderRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const targetScale = isHovered ? 1.05 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
    
    if (borderRef.current && isHovered) {
      borderRef.current.material.opacity = 0.8;
    } else if (borderRef.current) {
      borderRef.current.material.opacity = 0.3;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#0A0A0A"
          transparent
          opacity={0.6}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      {/* Border glow */}
      <lineSegments ref={borderRef}>
        <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
        <lineBasicMaterial 
          color={isHovered ? '#E0FF00' : '#F2F2F2'} 
          transparent 
          opacity={0.3}
        />
      </lineSegments>
      {children}
    </group>
  );
};

export const OrbitingObject = ({ 
  radius = 5, 
  speed = 1, 
  offset = 0, 
  children,
  yOffset = 0
}) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime * speed + offset;
    
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(time) * radius;
      groupRef.current.position.z = Math.sin(time) * radius;
      groupRef.current.position.y = yOffset + Math.sin(time * 2) * 0.5;
      groupRef.current.rotation.y = time;
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

export default { FloatingText3D, GlowingSphere, FloatingPanel, OrbitingObject };
