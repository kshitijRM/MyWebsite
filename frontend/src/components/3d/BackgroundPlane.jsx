import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    vec3 pos = position;
    pos.z += sin(pos.x * 2.0 + uTime) * 0.5;
    pos.z += sin(pos.y * 2.0 + uTime * 0.7) * 0.3;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  
  void main() {
    float dist = length(vUv - 0.5);
    float wave = sin(dist * 20.0 - uTime * 2.0) * 0.5 + 0.5;
    
    vec3 color = mix(uColor1, uColor2, wave * 0.3 + vUv.y * 0.7);
    
    float alpha = smoothstep(0.5, 0.0, dist) * 0.15;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export const BackgroundPlane = () => {
  const mesh = useRef();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#E0FF00') },
    uColor2: { value: new THREE.Color('#FF003C') }
  }), []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, -50]} rotation={[0, 0, 0]}>
      <planeGeometry args={[200, 200, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default BackgroundPlane;
