import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

export interface MouseState {
  coords: THREE.Vector2;
  coords_old: THREE.Vector2;
  diff: THREE.Vector2;
  mouseMoved: boolean;
  isHoverInside: boolean;
  hasUserControl: boolean;
  isAutoActive: boolean;
  takeoverActive: boolean;
  takeoverStartTime: number;
  takeoverFrom: THREE.Vector2;
  takeoverTo: THREE.Vector2;
}

interface MouseInputProps {
  containerRef: React.RefObject<HTMLElement>;
  autoIntensity: number;
  takeoverDuration: number;
  autoDemo: boolean;
  autoSpeed: number;
  autoResumeDelay: number;
  autoRampDuration: number;
}

export function useMouseInput({
  containerRef,
  autoIntensity,
  takeoverDuration,
  autoDemo,
  autoSpeed,
  autoResumeDelay,
  autoRampDuration,
}: MouseInputProps) {
  const mouseStateRef = useRef<MouseState>({
    coords: new THREE.Vector2(),
    coords_old: new THREE.Vector2(),
    diff: new THREE.Vector2(),
    mouseMoved: false,
    isHoverInside: false,
    hasUserControl: false,
    isAutoActive: false,
    takeoverActive: false,
    takeoverStartTime: 0,
    takeoverFrom: new THREE.Vector2(),
    takeoverTo: new THREE.Vector2(),
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUserInteractionRef = useRef(performance.now());

  // AutoDriver state
  const autoDriverStateRef = useRef({
    active: false,
    current: new THREE.Vector2(0, 0),
    target: new THREE.Vector2(),
    lastTime: performance.now(),
    activationTime: 0,
    margin: 0.2,
    _tmpDir: new THREE.Vector2(),
  });

  const pickNewTarget = useCallback(() => {
    const state = autoDriverStateRef.current;
    const r = Math.random;
    state.target.set((r() * 2 - 1) * (1 - state.margin), (r() * 2 - 1) * (1 - state.margin));
  }, []);

  const forceAutoStop = useCallback(() => {
    const mouseState = mouseStateRef.current;
    const autoState = autoDriverStateRef.current;
    autoState.active = false;
    mouseState.isAutoActive = false;
  }, []);

  const setCoords = useCallback(
    (x: number, y: number) => {
      const state = mouseStateRef.current;
      if (!containerRef.current) return;
      if (timerRef.current) clearTimeout(timerRef.current);

      const rect = containerRef.current.getBoundingClientRect();
      const nx = (x - rect.left) / rect.width;
      const ny = (y - rect.top) / rect.height;
      state.coords.set(nx * 2 - 1, -(ny * 2 - 1));
      state.mouseMoved = true;
      timerRef.current = setTimeout(() => {
        state.mouseMoved = false;
      }, 100);
    },
    [containerRef],
  );

  const setNormalized = useCallback((nx: number, ny: number) => {
    const state = mouseStateRef.current;
    state.coords.set(nx, ny);
    state.mouseMoved = true;
  }, []);

  const onInteract = useCallback(() => {
    lastUserInteractionRef.current = performance.now();
    forceAutoStop();
  }, [forceAutoStop]);

  const onDocumentMouseMove = useCallback(
    (event: MouseEvent) => {
      const state = mouseStateRef.current;
      onInteract();

      if (state.isAutoActive && !state.hasUserControl && !state.takeoverActive) {
        const rect = containerRef.current!.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = (event.clientY - rect.top) / rect.height;
        state.takeoverFrom.copy(state.coords);
        state.takeoverTo.set(nx * 2 - 1, -(ny * 2 - 1));
        state.takeoverStartTime = performance.now();
        state.takeoverActive = true;
        state.hasUserControl = true;
        state.isAutoActive = false;
        return;
      }
      setCoords(event.clientX, event.clientY);
      state.hasUserControl = true;
    },
    [containerRef, onInteract, setCoords],
  );

  const onDocumentTouchStart = useCallback(
    (event: TouchEvent) => {
      const state = mouseStateRef.current;
      if (event.touches.length === 1) {
        const t = event.touches[0];
        onInteract();
        setCoords(t.pageX, t.pageY);
        state.hasUserControl = true;
      }
    },
    [onInteract, setCoords],
  );

  const onDocumentTouchMove = useCallback(
    (event: TouchEvent) => {
      if (event.touches.length === 1) {
        const t = event.touches[0];
        onInteract();
        setCoords(t.pageX, t.pageY);
      }
    },
    [onInteract, setCoords],
  );

  const onTouchEnd = useCallback(() => {
    mouseStateRef.current.isHoverInside = false;
  }, []);

  const onMouseEnter = useCallback(() => {
    mouseStateRef.current.isHoverInside = true;
  }, []);

  const onMouseLeave = useCallback(() => {
    mouseStateRef.current.isHoverInside = false;
  }, []);

  const updateMouseAndAuto = useCallback(() => {
    const mouseState = mouseStateRef.current;
    const autoState = autoDriverStateRef.current;

    // AutoDriver update
    if (autoDemo) {
      const now = performance.now();
      const idle = now - lastUserInteractionRef.current;
      if (idle < autoResumeDelay) {
        if (autoState.active) forceAutoStop();
      } else if (mouseState.isHoverInside) {
        if (autoState.active) forceAutoStop();
      } else {
        if (!autoState.active) {
          autoState.active = true;
          autoState.current.copy(mouseState.coords);
          autoState.lastTime = now;
          autoState.activationTime = now;
        }
        mouseState.isAutoActive = true;
        let dtSec = (now - autoState.lastTime) / 1000;
        autoState.lastTime = now;
        if (dtSec > 0.2) dtSec = 0.016; // Cap dt to prevent large jumps after tab switch

        const dir = autoState._tmpDir.subVectors(autoState.target, autoState.current);
        const dist = dir.length();
        if (dist < 0.01) {
          pickNewTarget();
        } else {
          dir.normalize();
          let ramp = 1;
          if (autoRampDuration > 0) {
            const t = Math.min(1, (now - autoState.activationTime) / (autoRampDuration * 1000));
            ramp = t * t * (3 - 2 * t);
          }
          const step = autoSpeed * dtSec * ramp;
          const move = Math.min(step, dist);
          autoState.current.addScaledVector(dir, move);
          setNormalized(autoState.current.x, autoState.current.y);
        }
      }
    } else {
      forceAutoStop();
    }

    // Mouse state update
    if (mouseState.takeoverActive) {
      const t = (performance.now() - mouseState.takeoverStartTime) / (takeoverDuration * 1000);
      if (t >= 1) {
        mouseState.takeoverActive = false;
        mouseState.coords.copy(mouseState.takeoverTo);
        mouseState.coords_old.copy(mouseState.coords);
        mouseState.diff.set(0, 0);
      } else {
        const k = t * t * (3 - 2 * t);
        mouseState.coords.copy(mouseState.takeoverFrom).lerp(mouseState.takeoverTo, k);
      }
    }
    mouseState.diff.subVectors(mouseState.coords, mouseState.coords_old);
    mouseState.coords_old.copy(mouseState.coords);
    if (mouseState.coords_old.x === 0 && mouseState.coords_old.y === 0) mouseState.diff.set(0, 0);
    if (mouseState.isAutoActive && !mouseState.takeoverActive)
      mouseState.diff.multiplyScalar(autoIntensity);
  }, [
    autoDemo,
    autoResumeDelay,
    autoRampDuration,
    autoSpeed,
    autoIntensity,
    takeoverDuration,
    forceAutoStop,
    pickNewTarget,
    setNormalized,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousemove', onDocumentMouseMove, false);
    container.addEventListener('touchstart', onDocumentTouchStart, false);
    container.addEventListener('touchmove', onDocumentTouchMove, false);
    container.addEventListener('mouseenter', onMouseEnter, false);
    container.addEventListener('mouseleave', onMouseLeave, false);
    container.addEventListener('touchend', onTouchEnd, false);

    // Initial pick for auto driver
    pickNewTarget();

    return () => {
      container.removeEventListener('mousemove', onDocumentMouseMove, false);
      container.removeEventListener('touchstart', onDocumentTouchStart, false);
      container.removeEventListener('touchmove', onDocumentTouchMove, false);
      container.removeEventListener('mouseenter', onMouseEnter, false);
      container.removeEventListener('mouseleave', onMouseLeave, false);
      container.removeEventListener('touchend', onTouchEnd, false);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    containerRef,
    onDocumentMouseMove,
    onDocumentTouchStart,
    onDocumentTouchMove,
    onMouseEnter,
    onMouseLeave,
    onTouchEnd,
    pickNewTarget,
  ]);

  return {
    mouseState: mouseStateRef.current,
    updateMouseAndAuto,
  };
}