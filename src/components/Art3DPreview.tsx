import { Suspense, useEffect, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import { Mesh } from 'three';

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

const RibbonSculpture = ({ visibleRef }: { visibleRef: MutableRefObject<boolean> }) => {
  const meshRef = useRef<Mesh>(null);
  const lastFrame = useRef(0);

  useFrame(({ clock }) => {
    if (!meshRef.current || !visibleRef.current) return;
    const elapsed = clock.getElapsedTime();
    if (elapsed - lastFrame.current < 1 / 48) return;
    lastFrame.current = elapsed;

    meshRef.current.rotation.y = elapsed * 0.35;
    meshRef.current.rotation.x = Math.sin(elapsed * 0.6) * 0.3;
  });

  return (
    <mesh ref={meshRef} scale={1.8} position={[0, 0, 0]}>
      <torusKnotGeometry args={[0.85, 0.28, 200, 32, 2, 3]} />
      <MeshDistortMaterial
        color="#a855f7"
        emissive="#0ea5e9"
        emissiveIntensity={0.45}
        metalness={0.75}
        roughness={0.25}
        distort={0.4}
        speed={1}
      />
    </mesh>
  );
};

const Art3DPreview = () => {
  const visibleRef = useVisibilityController();

  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.2} color="#7c3aed" />
        <pointLight position={[-4, -3, -4]} intensity={0.8} color="#22d3ee" />
        <RibbonSculpture visibleRef={visibleRef} />
        <OrbitControls enablePan={false} enableZoom enableDamping dampingFactor={0.08} />
      </Suspense>
    </Canvas>
  );
};

export default Art3DPreview;
