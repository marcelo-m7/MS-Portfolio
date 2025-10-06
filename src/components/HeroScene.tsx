import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { TorusKnot, Points } from "@react-three/drei";
import { BufferGeometry, Float32BufferAttribute, Color, Mesh, Points as PointsMesh } from "three";

interface AnimatedProps {
  paused: boolean;
}

function AuroraTorus({ paused }: AnimatedProps) {
  const meshRef = useRef<Mesh>(null);
  const lastFrame = useRef(0);
  useFrame((state) => {
    if (!meshRef.current || paused) return;
    const elapsed = state.clock.getElapsedTime();
    if (elapsed - lastFrame.current < 1 / 30) return;
    lastFrame.current = elapsed;

    meshRef.current.rotation.x = elapsed * 0.25;
    meshRef.current.rotation.y = elapsed * 0.35;
    meshRef.current.scale.setScalar(1.2 + Math.sin(elapsed * 0.6) * 0.05);
  });

  return (
    <TorusKnot ref={meshRef} args={[1, 0.34, 220, 24]} rotation={[Math.PI / 4, 0, 0]}>
      <meshStandardMaterial
        color={new Color("#7c3aed").lerp(new Color("#0ea5e9"), 0.25)}
        metalness={0.65}
        roughness={0.2}
        emissive={new Color("#6d28d9").lerp(new Color("#22d3ee"), 0.4)}
        emissiveIntensity={0.4}
      />
    </TorusKnot>
  );
}

function StarHalo({ paused }: AnimatedProps) {
  const pointsRef = useRef<PointsMesh>(null);
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const count = 900;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 3 + Math.random() * 2.8;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2.2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  const lastFrame = useRef(0);
  useFrame((state) => {
    if (!pointsRef.current || paused) return;
    const elapsed = state.clock.getElapsedTime();
    if (elapsed - lastFrame.current < 1 / 24) return;
    lastFrame.current = elapsed;

    pointsRef.current.rotation.y = elapsed * 0.08;
    pointsRef.current.rotation.x = Math.sin(elapsed * 0.4) * 0.1;
  });

  return (
    <Points
      ref={pointsRef}
      geometry={geometry}
      rotation={[Math.PI / 6, 0, 0]}
      scale={1.4}
    >
      <pointsMaterial
        size={0.035}
        color="#38bdf8"
        depthWrite={false}
        transparent
        opacity={0.42}
      />
    </Points>
  );
}

const useVisibilityState = () => {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const handleVisibility = () => setPaused(document.hidden);
    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return paused;
};

const HeroScene = () => {
  const paused = useVisibilityState();

  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[6, 6, 6]} intensity={1} color="#a855f7" />
        <directionalLight position={[-4, -6, -6]} intensity={0.6} color="#38bdf8" />
        <StarHalo paused={paused} />
        <AuroraTorus paused={paused} />
        <EffectComposer multisampling={0} disableNormalPass>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.85}
            radius={0.85}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default HeroScene;
