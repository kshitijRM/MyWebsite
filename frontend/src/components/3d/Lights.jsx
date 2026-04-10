import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const Lights = ({ mousePosition }) => {
  const pointLight1 = useRef();
  const pointLight2 = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (pointLight1.current) {
      pointLight1.current.position.x = Math.sin(time * 0.5) * 20;
      pointLight1.current.position.y = Math.cos(time * 0.3) * 10;
      pointLight1.current.intensity = 2 + Math.sin(time) * 0.5;
    }
    
    if (pointLight2.current) {
      pointLight2.current.position.x = Math.cos(time * 0.4) * 15;
      pointLight2.current.position.y = Math.sin(time * 0.6) * 8;
      pointLight2.current.intensity = 1.5 + Math.cos(time * 1.2) * 0.3;
    }
    
    // Mouse-responsive light
    if (mousePosition && pointLight1.current) {
      pointLight1.current.position.x += (mousePosition.x - 0.5) * 10;
      pointLight1.current.position.y += (mousePosition.y - 0.5) * 5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight
        ref={pointLight1}
        position={[10, 10, 10]}
        color="#E0FF00"
        intensity={2}
        distance={100}
      />
      <pointLight
        ref={pointLight2}
        position={[-10, -5, 15]}
        color="#FF003C"
        intensity={1.5}
        distance={80}
      />
      <directionalLight
        position={[0, 20, 20]}
        intensity={0.3}
        color="#F2F2F2"
      />
    </>
  );
};

export default Lights;
