import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, Mesh, Points, PointsMaterial } from 'three';
import { useReducedMotion } from 'framer-motion';

function NeonParticles({ isActive }: { isActive: () => boolean }) {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<PointsMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const count = 2500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorPalette = [new Color('#7C3AED'), new Color('#38BDF8'), new Color('#F472B6')];

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 6 + 1.5;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 4;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      const color = colorPalette[i % colorPalette.length];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new Float32BufferAttribute(colors, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (!isActive() || !pointsRef.current || !materialRef.current) return;
    const elapsed = state.clock.getElapsedTime();

    pointsRef.current.rotation.y = elapsed * 0.05;
    pointsRef.current.rotation.x = Math.sin(elapsed * 0.15) * 0.1;
    materialRef.current.size = 0.06 + Math.sin(elapsed * 0.8) * 0.015;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        size={0.06}
        vertexColors
        transparent
        opacity={0.6}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function NeonTorus({ isActive }: { isActive: () => boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (!isActive() || !meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.35;
    meshRef.current.rotation.y += delta * 0.25;
    const elapsed = state.clock.getElapsedTime();
    meshRef.current.scale.setScalar(1.6 + Math.sin(elapsed * 0.6) * 0.05);
  });

  return (
    <mesh ref={meshRef} scale={1.6} position={[0, 0, 0]}>
      <torusKnotGeometry args={[1, 0.32, 320, 32, 2, 5]} />
      <meshStandardMaterial
        color="#8B5CF6"
        metalness={0.9}
        roughness={0.2}
        emissive="#7C3AED"
        emissiveIntensity={1.25}
      />
    </mesh>
  );
}

function AuroraRibbon({ isActive }: { isActive: () => boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!isActive() || !meshRef.current) return;
    const elapsed = state.clock.getElapsedTime();
    meshRef.current.rotation.z = Math.sin(elapsed * 0.2) * 0.4;
    meshRef.current.position.y = Math.sin(elapsed * 0.5) * 0.4;
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
      <torusGeometry args={[2.8, 0.08, 16, 220]} />
      <meshBasicMaterial
        color="#38BDF8"
        transparent
        opacity={0.25}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}

export default function Hero3D() {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibility = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const isActive = () => !prefersReducedMotion && isVisible;

  if (prefersReducedMotion) {
    return <div className="absolute inset-0 hero-aurora" aria-hidden />;
  }

  return (
    <div className="w-full h-full absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }} dpr={[1, 1.8]}>
        <Suspense fallback={null}>
          <color attach="background" args={[0x050716]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} color={0x9f7aea} />
          <pointLight position={[-6, -4, -6]} intensity={0.5} color={0x38bdf8} />
          <pointLight position={[6, -3, 5]} intensity={0.4} color={0xf472b6} />

          <NeonParticles isActive={isActive} />
          <NeonTorus isActive={isActive} />
          <AuroraRibbon isActive={isActive} />

          <EffectComposer multisampling={0}>
            <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.9} kernelSize={3} />
          </EffectComposer>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            makeDefault
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
