/**
 * Performance monitoring utilities for development and debugging
 * Helps identify slow components and operations
 */

import { useEffect, useRef } from 'react';

// Performance thresholds (in milliseconds)
const SLOW_RENDER_THRESHOLD = 16; // One frame at 60fps
const SLOW_ASYNC_THRESHOLD = 100; // 100ms for async operations

/**
 * Hook to measure component render time
 * Only active when enabled parameter is true
 */
export function useRenderTime(componentName: string, enabled = false) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(0);
  const startTime = performance.now();

  useEffect(() => {
    // Skip if not enabled (allow runtime control)
    if (!enabled) return;

    const endTime = performance.now();
    const renderTime = endTime - startTime;
    renderCountRef.current += 1;

    // Only log if render took longer than threshold
    if (renderTime > SLOW_RENDER_THRESHOLD) {
      console.warn(
        `⚠️ Slow render: ${componentName} took ${renderTime.toFixed(2)}ms (render #${renderCountRef.current})`
      );
    }

    // Track cumulative time
    lastRenderTimeRef.current = renderTime;
  }, [enabled, componentName, startTime]);
}

/**
 * Measure time for an async operation
 * @param operation - The async operation to measure
 * @param label - Label for the operation
 * @param threshold - Optional custom threshold (defaults to 100ms)
 */
export async function measureAsync<T>(
  operation: () => Promise<T>,
  label: string,
  threshold = SLOW_ASYNC_THRESHOLD
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const duration = performance.now() - startTime;
    
    if (import.meta.env.DEV && duration > threshold) {
      console.warn(`⚠️ Slow async operation: ${label} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`❌ Failed operation: ${label} failed after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
}

/**
 * Create a performance marker for tracking operations
 * Uses Performance API when available
 */
export function createPerformanceMarker(name: string) {
  if (typeof performance === 'undefined' || !performance.mark) {
    return {
      start: () => {},
      end: () => {},
    };
  }

  return {
    start: () => {
      try {
        performance.mark(`${name}-start`);
      } catch (error) {
        // Silently fail if mark already exists
      }
    },
    end: () => {
      try {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        const measure = performance.getEntriesByName(name, 'measure')[0];
        if (measure && import.meta.env.DEV && measure.duration > 100) {
          console.warn(`⚠️ Slow operation: ${name} took ${measure.duration.toFixed(2)}ms`);
        }
        
        // Clean up marks and measures
        performance.clearMarks(`${name}-start`);
        performance.clearMarks(`${name}-end`);
        performance.clearMeasures(name);
      } catch (error) {
        // Silently fail
      }
    },
  };
}

/**
 * Monitor bundle size in development
 * Warns if a component's dependencies are too large
 */
export function warnLargeDependencies(
  componentName: string,
  dependencies: unknown[],
  maxSize = 10
) {
  if (!import.meta.env.DEV) return;

  if (dependencies.length > maxSize) {
    console.warn(
      `⚠️ Large dependency array: ${componentName} has ${dependencies.length} dependencies (max recommended: ${maxSize}). Consider splitting into smaller hooks or using useMemo.`
    );
  }
}

/**
 * Log memory usage in development
 * Only works in browsers that support performance.memory (Chrome/Edge)
 */
export function logMemoryUsage(label?: string) {
  if (!import.meta.env.DEV) return;

  const memory = (performance as Performance & {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }).memory;

  if (memory) {
    const used = (memory.usedJSHeapSize / 1048576).toFixed(2);
    const total = (memory.totalJSHeapSize / 1048576).toFixed(2);
    const limit = (memory.jsHeapSizeLimit / 1048576).toFixed(2);
    
    const prefix = label ? `[${label}] ` : '';
    console.log(`${prefix}Memory: ${used}MB / ${total}MB (limit: ${limit}MB)`);
  }
}

/**
 * Debounced version of a function for performance optimization
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Throttled version of a function for performance optimization
 * @param fn - Function to throttle
 * @param limit - Minimum time between calls in milliseconds
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
