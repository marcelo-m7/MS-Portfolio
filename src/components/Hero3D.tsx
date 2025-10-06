import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, Suspense, useMemo, useState, useEffect } from 'react';
import { Mesh, BufferGeometry, Float32BufferAttribute, Color, Points } from 'three';
import { OrbitControls, Sphere, MeshDistortMaterial, Torus } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

function NeonParticles() {
  const points = useRef<Points>(null);

  const geometry = useMemo(() => {
    const buffer = new BufferGeometry();
    const count = 2500;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 2;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    buffer.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return buffer;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    const elapsed = state.clock.getElapsedTime();
    points.current.rotation.y = elapsed * 0.04;
    points.current.rotation.x = Math.sin(elapsed * 0.1) * 0.08;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        attach="material"
        size={0.03}
        color={new Color('#38bdf8')}
        opacity={0.6}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

function LuminousCore() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const elapsed = state.clock.getElapsedTime();
    meshRef.current.rotation.x = elapsed * 0.2;
    meshRef.current.rotation.y = elapsed * 0.25;
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.1}>
      <MeshDistortMaterial
        color="#7C3AED"
        emissive="#A855F7"
        emissiveIntensity={0.6}
        distort={0.4}
        speed={2}
        roughness={0.1}
        metalness={0.9}
      />
    </Sphere>
  );
}

function OrbitingRing() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.PI / 3;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.35;
  });

  return (
    <Torus ref={meshRef} args={[3, 0.12, 32, 200]}> 
      <meshStandardMaterial
        color="#22d3ee"
        emissive="#0ea5e9"
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.8}
      />
    </Torus>
  );
}

export default function Hero3D() {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const handleVisibility = () => setIsActive(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <div className="w-full h-full absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        frameloop={isActive ? 'always' : 'demand'}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#040714"]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[8, 12, 8]} intensity={1.1} color="#818cf8" />
          <pointLight position={[-4, -6, -3]} color="#38bdf8" intensity={0.7} />
          <pointLight position={[6, -4, -2]} color="#f472b6" intensity={0.4} />

          <NeonParticles />
          <OrbitingRing />
          <LuminousCore />

          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.1}
              luminanceSmoothing={0.85}
              height={300}
            />
          </EffectComposer>

          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
        </Suspense>
      </Canvas>
    </div>
  );
}
