import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CameraRig = ({ targetPosition, targetLookAt, mousePosition }) => {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0, 20));
  const lookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const currentPosition = useRef(new THREE.Vector3(0, 0, 20));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (targetPosition) {
      targetRef.current.copy(targetPosition);
    }
    if (targetLookAt) {
      lookAtRef.current.copy(targetLookAt);
    }
  }, [targetPosition, targetLookAt]);

  useFrame((state, delta) => {
    // Smooth camera movement with lerp
    const lerpFactor = 1 - Math.pow(0.001, delta);
    
    currentPosition.current.lerp(targetRef.current, lerpFactor * 2);
    currentLookAt.current.lerp(lookAtRef.current, lerpFactor * 2);
    
    // Add subtle mouse parallax
    if (mousePosition) {
      const parallaxX = (mousePosition.x - 0.5) * 2;
      const parallaxY = (mousePosition.y - 0.5) * 2;
      
      camera.position.x = currentPosition.current.x + parallaxX;
      camera.position.y = currentPosition.current.y + parallaxY;
      camera.position.z = currentPosition.current.z;
    } else {
      camera.position.copy(currentPosition.current);
    }
    
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

export default CameraRig;
