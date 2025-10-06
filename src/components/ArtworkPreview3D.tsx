import { Suspense, useEffect, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

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

const Sculpture = ({ paused, visibleRef }: { paused: boolean; visibleRef: MutableRefObject<boolean> }) => {
  const meshRef = useRef<Mesh>(null);
  const lastFrame = useRef(0);

  useFrame(({ clock }) => {
    if (paused || !meshRef.current || !visibleRef.current) return;
    const elapsed = clock.getElapsedTime();
    if (elapsed - lastFrame.current < 1 / 45) return;
    lastFrame.current = elapsed;

    meshRef.current.rotation.y = elapsed * 0.3;
    meshRef.current.rotation.x = Math.sin(elapsed * 0.4) * 0.35;
  });

  return (
    <mesh ref={meshRef} scale={1.4} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.1, 2]} />
      <meshStandardMaterial
        color="#a855f7"
        emissive="#0ea5e9"
        emissiveIntensity={0.45}
        metalness={0.65}
        roughness={0.2}
      />
    </mesh>
  );
};

const Halo = () => (
  <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
    <torusGeometry args={[1.8, 0.02, 16, 80]} />
    <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} />
  </mesh>
);

export default function ArtworkPreview3D() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const visibleRef = useVisibilityController();

  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-3xl border border-border/60 bg-card/80">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 5]} intensity={1} color="#c084fc" />
          <pointLight position={[-4, -4, -4]} intensity={0.7} color="#0ea5e9" />
          <Sculpture paused={prefersReducedMotion} visibleRef={visibleRef} />
          <Halo />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={!prefersReducedMotion}
            autoRotate={!prefersReducedMotion}
            autoRotateSpeed={0.7}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
