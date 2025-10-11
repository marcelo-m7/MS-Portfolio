import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import './LiquidEther.css';
import { makePaletteTexture } from './LiquidEther/utils';
import { useMouseInput } from './LiquidEther/useMouseInput';
import { useFluidSimulation } from './LiquidEther/useFluidSimulation';
import { useFluidRenderer } from './LiquidEther/useFluidRenderer';

interface LiquidEtherProps {
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  colors?: string[];
  style?: React.CSSProperties;
  className?: string;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

export default function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
  style = {},
  className = '',
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 3000,
  autoRampDuration = 0.6,
}: LiquidEtherProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const rafRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const isVisibleRef = useRef(true);
  const resizeRafRef = useRef<number | null>(null);

  const currentWidth = useRef(0);
  const currentHeight = useRef(0);

  const paletteTex = makePaletteTexture(colors);
  const bgVec4 = new THREE.Vector4(0, 0, 0, 0); // always transparent

  const { mouseState, updateMouseAndAuto } = useMouseInput({
    containerRef: mountRef,
    autoIntensity,
    takeoverDuration,
    autoDemo,
    autoSpeed,
    autoResumeDelay,
    autoRampDuration,
  });

  const simulationOptions = useRef<SimulationOptions>({
    iterations_poisson: iterationsPoisson,
    iterations_viscous: iterationsViscous,
    mouse_force: mouseForce,
    resolution: resolution,
    cursor_size: cursorSize,
    viscous: viscous,
    isBounce: isBounce,
    dt: dt,
    isViscous: isViscous,
    BFECC: BFECC,
  });

  // Update simulation options when props change
  useEffect(() => {
    simulationOptions.current = {
      iterations_poisson: iterationsPoisson,
      iterations_viscous: iterationsViscous,
      mouse_force: mouseForce,
      resolution: resolution,
      cursor_size: cursorSize,
      viscous: viscous,
      isBounce: isBounce,
      dt: dt,
      isViscous: isViscous,
      BFECC: BFECC,
    };
  }, [
    iterationsPoisson,
    iterationsViscous,
    mouseForce,
    resolution,
    cursorSize,
    viscous,
    isBounce,
    dt,
    BFECC,
    isViscous,
  ]);

  const { updateSimulation, velocityTexture, resizeFBOs } = useFluidSimulation({
    renderer: rendererRef.current!,
    width: currentWidth.current,
    height: currentHeight.current,
    options: simulationOptions.current,
  });

  const { renderFluid } = useFluidRenderer({
    renderer: rendererRef.current!,
    velocityTexture,
    paletteTexture: paletteTex,
    bgColor: bgVec4,
  });

  const resize = useCallback(() => {
    if (!mountRef.current || !rendererRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    currentWidth.current = Math.max(1, Math.floor(rect.width));
    currentHeight.current = Math.max(1, Math.floor(rect.height));
    rendererRef.current.setSize(currentWidth.current, currentHeight.current, false);
    resizeFBOs();
  }, [resizeFBOs]);

  const loop = useCallback(() => {
    if (!rendererRef.current || !isVisibleRef.current || document.hidden) {
      rafRef.current = null;
      return;
    }

    const delta = clockRef.current.getDelta();
    updateMouseAndAuto();
    updateSimulation(mouseState);
    renderFluid();

    rafRef.current = requestAnimationFrame(loop);
  }, [updateMouseAndAuto, updateSimulation, mouseState, renderFluid]);

  const start = useCallback(() => {
    if (rafRef.current) return; // Already running
    clockRef.current.start();
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const pause = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    container.style.position = container.style.position || 'relative';
    container.style.overflow = container.style.overflow || 'hidden';

    // Initialize renderer
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current.autoClear = false;
    rendererRef.current.setClearColor(new THREE.Color(0x000000), 0);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.prepend(rendererRef.current.domElement);

    // Initial resize
    resize();

    // IntersectionObserver to pause rendering when not visible
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0;
        isVisibleRef.current = isVisible;
        if (isVisible && !document.hidden) {
          start();
        } else {
          pause();
        }
      },
      { threshold: [0, 0.01, 0.1] },
    );
    io.observe(container);
    intersectionObserverRef.current = io;

    // ResizeObserver for container dimensions
    const ro = new ResizeObserver(() => {
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => {
        resize();
      });
    });
    ro.observe(container);
    resizeObserverRef.current = ro;

    // Start animation loop
    start();

    // Handle document visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pause();
      } else if (isVisibleRef.current) {
        start();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Cleanup
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      if (intersectionObserverRef.current) intersectionObserverRef.current.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (rendererRef.current) {
        const canvas = rendererRef.current.domElement;
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
        rendererRef.current.dispose();
      }
      rendererRef.current = null;
    };
  }, [resize, start, pause]); // Dependencies for useEffect

  return <div ref={mountRef} className={`liquid-ether-container ${className || ''}`} style={style} />;
}