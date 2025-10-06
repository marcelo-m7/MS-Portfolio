import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";

function Model({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  return <primitive object={scene} dispose={null} />;
}

export default function ModelViewer({ src }: { src: string }) {
  const [isVisible, setIsVisible] = useState(() => (typeof document !== "undefined" ? !document.hidden : true));

  useEffect(() => {
    if (typeof document === "undefined") return;
    const handleVisibility = () => setIsVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (typeof (useGLTF as any).preload === "function") {
      try {
        (useGLTF as any).preload(src);
      } catch (error) {
        // ignore preload errors
      }
    }
  }, [src]);

  return (
    <Canvas camera={{ position: [2.5, 1.8, 2.5], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
      <color attach="background" args={["transparent"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} color="#a855f7" />
      <directionalLight position={[-3, -4, -5]} intensity={0.6} color="#38bdf8" />
      <Suspense fallback={null}>
        <Environment preset="studio" />
        {isVisible ? <Model src={src} /> : null}
        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.8} />
      </Suspense>
    </Canvas>
  );
}
