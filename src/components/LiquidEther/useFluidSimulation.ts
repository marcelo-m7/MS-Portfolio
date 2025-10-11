import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import {
  advection_frag,
  divergence_frag,
  externalForce_frag,
  face_vert,
  poisson_frag,
  pressure_frag,
  viscous_frag,
} from './shaders';
import {
  createFBO,
  createFullScreenQuad,
  createMouseMesh,
  createShaderMaterial,
  getFloatType,
  createBoundaryLine,
} from './utils';
import { MouseState } from './useMouseInput';

interface SimulationOptions {
  iterations_poisson: number;
  iterations_viscous: number;
  mouse_force: number;
  resolution: number;
  cursor_size: number;
  viscous: number;
  isBounce: boolean;
  dt: number;
  isViscous: boolean;
  BFECC: boolean;
}

interface FluidSimulationProps {
  renderer: THREE.WebGLRenderer;
  width: number;
  height: number;
  options: SimulationOptions;
}

export function useFluidSimulation({
  renderer,
  width,
  height,
  options,
}: FluidSimulationProps) {
  const fbosRef = useRef<{ [key: string]: THREE.WebGLRenderTarget | null }>({});
  const materialsRef = useRef<{ [key: string]: THREE.RawShaderMaterial | null }>({});
  const fullScreenQuadRef = useRef<THREE.Mesh | null>(null);
  const mouseMeshRef = useRef<THREE.Mesh | null>(null);
  const boundaryLineRef = useRef<THREE.LineSegments | null>(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.Camera());

  const fboSize = useRef(new THREE.Vector2());
  const cellScale = useRef(new THREE.Vector2());
  const boundarySpace = useRef(new THREE.Vector2());

  const getFBOType = useCallback(() => getFloatType(), []);

  const initFBOs = useCallback(() => {
    const type = getFBOType();
    const currentFboSize = fboSize.current;

    fbosRef.current = {
      vel_0: createFBO(currentFboSize.x, currentFboSize.y, type),
      vel_1: createFBO(currentFboSize.x, currentFboSize.y, type),
      vel_viscous0: createFBO(currentFboSize.x, currentFboSize.y, type),
      vel_viscous1: createFBO(currentFboSize.x, currentFboSize.y, type),
      div: createFBO(currentFboSize.x, currentFboSize.y, type),
      pressure_0: createFBO(currentFboSize.x, currentFboSize.y, type),
      pressure_1: createFBO(currentFboSize.x, currentFboSize.y, type),
    };
  }, [getFBOType]);

  const initMaterials = useCallback(() => {
    const currentCellScale = cellScale.current;
    const currentFboSize = fboSize.current;
    const currentBoundarySpace = boundarySpace.current;

    const commonUniforms = {
      boundarySpace: { value: currentBoundarySpace },
      px: { value: currentCellScale },
      dt: { value: options.dt },
    };

    materialsRef.current = {
      advection: createShaderMaterial(face_vert, advection_frag, {
        ...commonUniforms,
        fboSize: { value: currentFboSize },
        velocity: { value: fbosRef.current.vel_0!.texture },
        isBFECC: { value: options.BFECC },
      }),
      externalForce: createShaderMaterial(face_vert, externalForce_frag, {
        ...commonUniforms,
        force: { value: new THREE.Vector2(0.0, 0.0) },
        center: { value: new THREE.Vector2(0.0, 0.0) },
        scale: { value: new THREE.Vector2(options.cursor_size, options.cursor_size) },
      }, THREE.AdditiveBlending, false, true),
      viscous: createShaderMaterial(face_vert, viscous_frag, {
        ...commonUniforms,
        velocity: { value: fbosRef.current.vel_1!.texture },
        velocity_new: { value: fbosRef.current.vel_viscous0!.texture },
        v: { value: options.viscous },
      }),
      divergence: createShaderMaterial(face_vert, divergence_frag, {
        ...commonUniforms,
        velocity: { value: fbosRef.current.vel_viscous0!.texture },
      }),
      poisson: createShaderMaterial(face_vert, poisson_frag, {
        ...commonUniforms,
        pressure: { value: fbosRef.current.pressure_0!.texture },
        divergence: { value: fbosRef.current.div!.texture },
      }),
      pressure: createShaderMaterial(face_vert, pressure_frag, {
        ...commonUniforms,
        pressure: { value: fbosRef.current.pressure_0!.texture },
        velocity: { value: fbosRef.current.vel_viscous0!.texture },
      }),
    };

    fullScreenQuadRef.current = createFullScreenQuad(materialsRef.current.advection!); // Use advection material as a placeholder for the quad
    sceneRef.current.add(fullScreenQuadRef.current);

    // Create boundary line for advection
    boundaryLineRef.current = createBoundaryLine(materialsRef.current.advection!.uniforms);
    sceneRef.current.add(boundaryLineRef.current);

    // Create mouse mesh for external force
    mouseMeshRef.current = createMouseMesh(
      { cellScale: currentCellScale, cursor_size: options.cursor_size },
      externalForce_frag,
    );
    sceneRef.current.add(mouseMeshRef.current);
  }, [options]);

  const calcSize = useCallback(() => {
    const newWidth = Math.max(1, Math.round(options.resolution * width));
    const newHeight = Math.max(1, Math.round(options.resolution * height));
    const px_x = 1.0 / newWidth;
    const px_y = 1.0 / newHeight;
    cellScale.current.set(px_x, px_y);
    fboSize.current.set(newWidth, newHeight);
  }, [options.resolution, width, height]);

  const resizeFBOs = useCallback(() => {
    calcSize();
    const currentFboSize = fboSize.current;
    for (const key in fbosRef.current) {
      fbosRef.current[key]?.setSize(currentFboSize.x, currentFboSize.y);
    }
    // Update uniforms that depend on fboSize or cellScale
    if (materialsRef.current.advection) {
      materialsRef.current.advection.uniforms.fboSize.value.copy(currentFboSize);
      materialsRef.current.advection.uniforms.px.value.copy(cellScale.current);
    }
    if (materialsRef.current.externalForce) {
      materialsRef.current.externalForce.uniforms.px.value.copy(cellScale.current);
    }
    if (materialsRef.current.viscous) {
      materialsRef.current.viscous.uniforms.px.value.copy(cellScale.current);
    }
    if (materialsRef.current.divergence) {
      materialsRef.current.divergence.uniforms.px.value.copy(cellScale.current);
    }
    if (materialsRef.current.poisson) {
      materialsRef.current.poisson.uniforms.px.value.copy(cellScale.current);
    }
    if (materialsRef.current.pressure) {
      materialsRef.current.pressure.uniforms.px.value.copy(cellScale.current);
    }
  }, [calcSize]);

  useEffect(() => {
    calcSize();
    initFBOs();
    initMaterials();

    return () => {
      // Dispose of Three.js resources
      for (const key in fbosRef.current) {
        fbosRef.current[key]?.dispose();
      }
      for (const key in materialsRef.current) {
        materialsRef.current[key]?.dispose();
      }
      fullScreenQuadRef.current?.geometry.dispose();
      mouseMeshRef.current?.geometry.dispose();
      boundaryLineRef.current?.geometry.dispose();
      sceneRef.current.clear();
    };
  }, [calcSize, initFBOs, initMaterials]);

  useEffect(() => {
    // Handle resolution changes
    const oldResolution = fboSize.current.x / width; // Approximate old resolution
    if (options.resolution !== oldResolution) {
      resizeFBOs();
    }
  }, [options.resolution, width, resizeFBOs]);

  const updateSimulation = useCallback(
    (mouseState: MouseState) => {
      const {
        advection,
        externalForce,
        viscous,
        divergence,
        poisson,
        pressure,
      } = materialsRef.current;
      const fbos = fbosRef.current;
      const quad = fullScreenQuadRef.current;
      const mouseMesh = mouseMeshRef.current;
      const boundaryLine = boundaryLineRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;

      if (!advection || !externalForce || !viscous || !divergence || !poisson || !pressure || !quad || !mouseMesh || !boundaryLine) return;

      // Update boundary space
      if (options.isBounce) {
        boundarySpace.current.set(0, 0);
      } else {
        boundarySpace.current.copy(cellScale.current);
      }
      advection.uniforms.boundarySpace.value.copy(boundarySpace.current);
      viscous.uniforms.boundarySpace.value.copy(boundarySpace.current);
      divergence.uniforms.boundarySpace.value.copy(boundarySpace.current);
      poisson.uniforms.boundarySpace.value.copy(boundarySpace.current);
      pressure.uniforms.boundarySpace.value.copy(boundarySpace.current);

      // Advection
      advection.uniforms.velocity.value = fbos.vel_0!.texture;
      advection.uniforms.dt.value = options.dt;
      advection.uniforms.isBFECC.value = options.BFECC;
      boundaryLine.visible = options.isBounce;
      quad.material = advection;
      renderer.setRenderTarget(fbos.vel_1);
      renderer.render(scene, camera);

      // External Force
      const forceX = (mouseState.diff.x / 2) * options.mouse_force;
      const forceY = (mouseState.diff.y / 2) * options.mouse_force;
      const cursorSizeX = options.cursor_size * cellScale.current.x;
      const cursorSizeY = options.cursor_size * cellScale.current.y;
      const centerX = Math.min(
        Math.max(mouseState.coords.x, -1 + cursorSizeX + cellScale.current.x * 2),
        1 - cursorSizeX - cellScale.current.x * 2,
      );
      const centerY = Math.min(
        Math.max(mouseState.coords.y, -1 + cursorSizeY + cellScale.current.y * 2),
        1 - cursorSizeY - cellScale.current.y * 2,
      );

      const mouseUniforms = (mouseMesh.material as THREE.RawShaderMaterial).uniforms;
      mouseUniforms.force.value.set(forceX, forceY);
      mouseUniforms.center.value.set(centerX, centerY);
      mouseUniforms.scale.value.set(options.cursor_size, options.cursor_size);

      renderer.setRenderTarget(fbos.vel_1);
      renderer.render(scene, camera); // Render mouse force on top of advected velocity

      let currentVelFBO = fbos.vel_1;

      // Viscous
      if (options.isViscous) {
        viscous.uniforms.v.value = options.viscous;
        viscous.uniforms.dt.value = options.dt;
        for (let i = 0; i < options.iterations_viscous; i++) {
          const fbo_in = i % 2 === 0 ? fbos.vel_viscous0 : fbos.vel_viscous1;
          const fbo_out = i % 2 === 0 ? fbos.vel_viscous1 : fbos.vel_viscous0;
          viscous.uniforms.velocity.value = currentVelFBO!.texture; // Input from previous step
          viscous.uniforms.velocity_new.value = fbo_in!.texture; // Input for iteration
          quad.material = viscous;
          renderer.setRenderTarget(fbo_out);
          renderer.render(scene, camera);
          currentVelFBO = fbo_out;
        }
      }

      // Divergence
      divergence.uniforms.velocity.value = currentVelFBO!.texture;
      quad.material = divergence;
      renderer.setRenderTarget(fbos.div);
      renderer.render(scene, camera);

      // Poisson
      poisson.uniforms.divergence.value = fbos.div!.texture;
      for (let i = 0; i < options.iterations_poisson; i++) {
        const p_in = i % 2 === 0 ? fbos.pressure_0 : fbos.pressure_1;
        const p_out = i % 2 === 0 ? fbos.pressure_1 : fbos.pressure_0;
        poisson.uniforms.pressure.value = p_in!.texture;
        quad.material = poisson;
        renderer.setRenderTarget(p_out);
        renderer.render(scene, camera);
        fbos.pressure_0 = p_out; // Update reference for next iteration or pressure pass
      }

      // Pressure
      pressure.uniforms.velocity.value = currentVelFBO!.texture;
      pressure.uniforms.pressure.value = fbos.pressure_0!.texture;
      pressure.uniforms.dt.value = options.dt;
      quad.material = pressure;
      renderer.setRenderTarget(fbos.vel_0);
      renderer.render(scene, camera);

      renderer.setRenderTarget(null); // Reset render target
    },
    [renderer, options],
  );

  return {
    updateSimulation,
    velocityTexture: fbosRef.current.vel_0?.texture,
    resizeFBOs,
  };
}