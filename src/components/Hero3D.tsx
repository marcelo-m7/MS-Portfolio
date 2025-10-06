import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float32BufferAttribute, BufferGeometry, Mesh } from "three";
import type { Points } from "three";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function useThrottledFrame(callback: (state: Parameters<typeof useFrame>[0], delta: number) => void) {
  const isVisible = useRef(true);
  const accumulator = useRef(0);
  const frameInterval = 1 / 45;

  useEffect(() => {
    const handleVisibility = () => {
      isVisible.current = document.visibilityState === "visible";
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useFrame((state, delta) => {
    if (!isVisible.current) return;
    accumulator.current += delta;
    if (accumulator.current < frameInterval) return;
    accumulator.current = 0;
    callback(state, frameInterval);
  });
}

function Particles() {
  const pointsRef = useRef<Points>(null);

  const geometry = useMemo(() => {
    const buffer = new BufferGeometry();
    const count = 1200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 12;
    }
    buffer.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return buffer;
  }, []);

  useThrottledFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.08;
    pointsRef.current.rotation.x = Math.sin(time * 0.12) * 0.18;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.018}
        transparent
        opacity={0.6}
        depthWrite={false}
        color="#38bdf8"
        sizeAttenuation
      />
    </points>
  );
}

function DistortedSphere() {
  const meshRef = useRef<Mesh>(null);

  useThrottledFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.25;
    meshRef.current.rotation.y = time * 0.35;
  });

  return (
    <Sphere ref={meshRef} args={[1, 96, 96]} scale={2.8} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color="#7C3AED"
        emissive="#312e81"
        emissiveIntensity={0.4}
        roughness={0.25}
        metalness={0.75}
        distort={0.5}
        speed={2}
      />
    </Sphere>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 52 }}
        dpr={[1, 1.6]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <color attach="background" args={["transparent"]} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[6, 6, 8]} intensity={1.2} color="#93c5fd" />
          <directionalLight position={[-6, -4, -6]} intensity={0.6} color="#f472b6" />
          <Particles />
          <DistortedSphere />
          <EffectComposer disableNormalPass>
            <Bloom intensity={0.4} luminanceThreshold={0.15} luminanceSmoothing={0.9} height={300} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
