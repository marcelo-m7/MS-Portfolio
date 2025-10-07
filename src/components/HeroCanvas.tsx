import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useThemeColor } from '@/hooks/useThemeColor';
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

const Particles = ({
  visibleRef,
  prefersReducedMotion,
  color,
}: {
  visibleRef: MutableRefObject<boolean>;
  prefersReducedMotion: boolean;
  color: string | undefined;
}) => {
  const pointsRef = useRef<Points>(null);
  const geometry = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      const radius = 2 + Math.random() * 2;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2.5;
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
    if (!visibleRef.current || !pointsRef.current || prefersReducedMotion) return;
    const elapsed = clock.getElapsedTime();
    if (elapsed - lastFrame.current < 1 / 45) return;
    lastFrame.current = elapsed;
    pointsRef.current.rotation.y = elapsed * 0.06;
    pointsRef.current.rotation.x = Math.sin(elapsed * 0.3) * 0.08;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial attach="material" color={color} size={0.035} sizeAttenuation transparent opacity={0.55} />
    </points>
  );
};

const Ribbon = ({
  visibleRef,
  prefersReducedMotion,
  color,
  emissive,
}: {
  visibleRef: MutableRefObject<boolean>;
  prefersReducedMotion: boolean;
  color: string | undefined;
  emissive: string | undefined;
}) => {
  const meshRef = useRef<Mesh>(null);
  const lastFrame = useRef(0);

  useFrame(({ clock }) => {
    if (!visibleRef.current || !meshRef.current || prefersReducedMotion) return;
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
        color={color}
        emissive={emissive}
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.7}
        distort={0.38}
        speed={1.1}
      />
    </mesh>
  );
};

export default function HeroCanvas() {
  const visibleRef = useVisibilityController();
  const prefersReducedMotion = usePrefersReducedMotion();
  const glowBlue = useThemeColor('--glow-blue');
  const glowPurple = useThemeColor('--glow-purple');

  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 5, 6]} intensity={1.1} color={glowPurple || undefined} />
          <pointLight position={[-6, -4, -4]} intensity={0.8} color={glowBlue || undefined} />
          <Particles
            visibleRef={visibleRef}
            prefersReducedMotion={prefersReducedMotion}
            color={glowBlue || undefined}
          />
          <Ribbon
            visibleRef={visibleRef}
            prefersReducedMotion={prefersReducedMotion}
            color={glowPurple || undefined}
            emissive={glowBlue || undefined}
          />
          <EffectComposer disableNormalPass multisampling={0}>
            <Bloom
              intensity={prefersReducedMotion ? 0.2 : 0.4}
              luminanceThreshold={0.3}
              luminanceSmoothing={0.9}
              radius={0.6}
            />
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
