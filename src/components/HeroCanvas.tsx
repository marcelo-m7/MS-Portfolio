import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { BufferGeometry, Float32BufferAttribute, Mesh, Points } from 'three';

const useVisibilityController = () => {
  const visibleRef = useRef(true);

  useEffect(() => {
    const handleVisibility = () => {
      visibleRef.current = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return visibleRef;
};

const Particles = ({ visibleRef }: { visibleRef: MutableRefObject<boolean> }) => {
  const pointsRef = useRef<Points>(null);
  const geometry = useMemo(() => {
    const count = 1500; // Increased particle count
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      const radius = 2.5 + Math.random() * 2.5; // Slightly larger spread
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3; // Wider vertical spread
      positions[i] = Math.cos(angle) * radius;
      positions[i + 1] = y;
      positions[i + 2] = Math.sin(angle) * radius;
    }

    const geom = new BufferGeometry();
    geom.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return geom;
  }, []);

  const lastFrame = useRef(0);

  useFrame(({ clock }) => {
    if (!visibleRef.current || !pointsRef.current) return;
    const elapsed = clock.getElapsedTime();
    if (elapsed - lastFrame.current < 1 / 45) return;
    lastFrame.current = elapsed;
    pointsRef.current.rotation.y = elapsed * 0.07; // Slightly faster rotation
    pointsRef.current.rotation.x = Math.sin(elapsed * 0.35) * 0.09; // More subtle x-axis wobble
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        attach="material"
        color="#60a5fa" // Tailwind blue-400
        size={0.04} // Slightly larger particles
        sizeAttenuation
        transparent
        opacity={0.6} // Slightly more opaque
      />
    </points>
  );
};

const Ribbon = ({ visibleRef }: { visibleRef: MutableRefObject<boolean> }) => {
  const meshRef = useRef<Mesh>(null);
  const lastFrame = useRef(0);

  useFrame(({ clock }) => {
    if (!visibleRef.current || !meshRef.current) return;
    const elapsed = clock.getElapsedTime();
    if (elapsed - lastFrame.current < 1 / 45) return;
    lastFrame.current = elapsed;

    meshRef.current.rotation.y = elapsed * 0.18;
    meshRef.current.rotation.x = Math.sin(elapsed * 0.6) * 0.25;
  });

  return (
    <mesh ref={meshRef} scale={1.65} position={[0, 0, 0]}>
      <torusKnotGeometry args={[0.9, 0.28, 120, 18, 2, 5]} />
      <MeshDistortMaterial
        color="#a855f7" // Tailwind purple-400
        emissive="#0ea5e9" // Tailwind cyan-500
        emissiveIntensity={0.5} // Increased emissive intensity
        roughness={0.2}
        metalness={0.7}
        distort={0.4} // Slightly more distortion
        speed={1.2} // Slightly faster distortion speed
      />
    </mesh>
  );
};

export default function HeroCanvas() {
  const visibleRef = useVisibilityController();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 5, 6]} intensity={1.1} color="#a855f7" />
          <pointLight position={[-6, -4, -4]} intensity={0.8} color="#22d3ee" />
          <Particles visibleRef={visibleRef} />
          <Ribbon visibleRef={visibleRef} />
          <EffectComposer disableNormalPass multisampling={0}>
            <Bloom intensity={0.4} luminanceThreshold={0.3} luminanceSmoothing={0.9} radius={0.6} />
          </EffectComposer>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={!prefersReducedMotion}
            autoRotate={!prefersReducedMotion}
            autoRotateSpeed={0.6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}