import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, Suspense, useMemo } from 'react';
import { Mesh, BufferGeometry, PointsMaterial, Float32BufferAttribute } from 'three';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

function Particles() {
  const points = useRef<any>(null);
  
  const particlesGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    points.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.2;
  });

  return (
    <points ref={points} geometry={particlesGeometry}>
      <pointsMaterial
        size={0.015}
        color="#0EA5E9"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function AnimatedSphere() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  return (
    <Sphere ref={meshRef} args={[1, 100, 100]} scale={2.5}>
      <MeshDistortMaterial
        color="#7C3AED"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-full absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} color="#0EA5E9" intensity={0.5} />
          <pointLight position={[10, -10, -5]} color="#EC4899" intensity={0.3} />
          <Particles />
          <AnimatedSphere />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
