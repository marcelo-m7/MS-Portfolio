import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { color_frag, face_vert } from './shaders';
import { createFullScreenQuad, createShaderMaterial } from './utils';

interface FluidRendererProps {
  renderer: THREE.WebGLRenderer;
  velocityTexture: THREE.Texture | undefined;
  paletteTexture: THREE.DataTexture;
  bgColor: THREE.Vector4;
}

export function useFluidRenderer({
  renderer,
  velocityTexture,
  paletteTexture,
  bgColor,
}: FluidRendererProps) {
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.Camera());
  const outputMeshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.RawShaderMaterial | null>(null);

  useEffect(() => {
    materialRef.current = createShaderMaterial(
      face_vert,
      color_frag,
      {
        velocity: { value: velocityTexture || new THREE.Texture() },
        boundarySpace: { value: new THREE.Vector2() }, // Not used in color_frag, but common uniform
        palette: { value: paletteTexture },
        bgColor: { value: bgColor },
      },
      THREE.NormalBlending,
      false,
      true,
    );
    outputMeshRef.current = createFullScreenQuad(materialRef.current);
    sceneRef.current.add(outputMeshRef.current);

    return () => {
      outputMeshRef.current?.geometry.dispose();
      materialRef.current?.dispose();
      sceneRef.current.clear();
    };
  }, [paletteTexture, bgColor]);

  useEffect(() => {
    if (materialRef.current && velocityTexture) {
      materialRef.current.uniforms.velocity.value = velocityTexture;
    }
  }, [velocityTexture]);

  const renderFluid = useCallback(() => {
    if (renderer && sceneRef.current && cameraRef.current) {
      renderer.setRenderTarget(null);
      renderer.render(sceneRef.current, cameraRef.current);
    }
  }, [renderer]);

  return { renderFluid };
}