import { Suspense, useEffect, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import { Mesh, PointLight } from 'three';
import { useReducedMotion } from 'framer-motion';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

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

function Static3DFallback() {
  return (
    <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,hsl(var(--secondary)/0.18),transparent_35%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))]">
      <div className="rounded-3xl border border-border/60 bg-card/70 px-6 py-5 text-center shadow-xl backdrop-blur">
        <p className="text-sm font-medium text-foreground">Preview 3D leve desativado</p>
        <p className="mt-2 max-w-xs text-xs text-muted-foreground">
          Esta visualização usa um fallback estático para preservar bateria, fluidez e acessibilidade.
        </p>
      </div>
    </div>
  );
}

const RibbonSculpture = ({ visibleRef, lightweight }: { visibleRef: MutableRefObject<boolean>; lightweight: boolean }) => {
  const meshRef = useRef<Mesh>(null);
  const lastFrame = useRef(0);

  useFrame(({ clock }) => {
    if (!meshRef.current || !visibleRef.current) return;
    const elapsed = clock.getElapsedTime();
    if (elapsed - lastFrame.current < 1 / (lightweight ? 24 : 40)) return;
    lastFrame.current = elapsed;

    meshRef.current.rotation.y = elapsed * 0.28;
    meshRef.current.rotation.x = Math.sin(elapsed * 0.45) * 0.18;
  });

  return (
    <mesh ref={meshRef} scale={lightweight ? 1.55 : 1.7} position={[0, 0, 0]}>
      <torusKnotGeometry args={[0.85, 0.24, lightweight ? 96 : 160, lightweight ? 18 : 28, 2, 3]} />
      <MeshDistortMaterial
        color="#292966"
        emissive="#2682D9"
        emissiveIntensity={lightweight ? 0.45 : 0.6}
        metalness={0.7}
        roughness={0.32}
        distort={lightweight ? 0.28 : 0.45}
        speed={lightweight ? 0.9 : 1.2}
      />
    </mesh>
  );
};

const DynamicLight = ({ lightweight }: { lightweight: boolean }) => {
  const lightRef = useRef<PointLight | null>(null);
  useFrame(({ clock }) => {
    if (lightRef.current) {
      const time = clock.getElapsedTime();
      lightRef.current.position.x = Math.sin(time * 0.5) * 2.2;
      lightRef.current.position.y = Math.cos(time * 0.35) * 1.4;
      lightRef.current.position.z = Math.sin(time * 0.6) * 3.2;
    }
  });
  return <pointLight ref={lightRef} intensity={lightweight ? 0.38 : 0.55} color="#9966CC" />;
};

export default function Art3DPreview() {
  const visibleRef = useVisibilityController();
  const prefersReducedMotion = useReducedMotion();
  const capabilities = useDeviceCapabilities();

  if (prefersReducedMotion || (capabilities.hasMounted && !capabilities.canHandle3D)) {
    return <Static3DFallback />;
  }

  const lightweight = !capabilities.hasDiscreteGPU;

  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      dpr={[1, lightweight ? 1.2 : 1.5]}
      frameloop="always"
      gl={{ antialias: false, alpha: true, powerPreference: lightweight ? 'default' : 'high-performance' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={lightweight ? 0.35 : 0.5} />
        <directionalLight position={[4, 6, 5]} intensity={lightweight ? 0.75 : 1} color="#292966" />
        <pointLight position={[-4, -3, -4]} intensity={lightweight ? 0.45 : 0.65} color="#2682D9" />
        <DynamicLight lightweight={lightweight} />
        <RibbonSculpture visibleRef={visibleRef} lightweight={lightweight} />
        <OrbitControls enablePan={false} enableZoom={!lightweight} enableDamping dampingFactor={0.08} autoRotate={lightweight} autoRotateSpeed={0.8} />
      </Suspense>
    </Canvas>
  );
}
