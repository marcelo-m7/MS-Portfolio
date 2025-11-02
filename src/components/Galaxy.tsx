import { useEffect, useRef, useMemo, useCallback } from 'react';

interface GalaxyProps {
  mouseRepulsion?: boolean;
  mouseInteraction?: boolean;
  density?: number;
  glowIntensity?: number;
  saturation?: number;
  hueShift?: number;
  className?: string;
}

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  vx: number;
  vy: number;
}

export default function Galaxy({
  mouseRepulsion = true,
  mouseInteraction = true,
  density = 1.5,
  glowIntensity = 0.5,
  saturation = 0.8,
  hueShift = 240,
  className = '',
}: GalaxyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const starsRef = useRef<Star[]>([]);

  // Memoize star count based on density
  const starCount = useMemo(() => Math.floor(200 * density), [density]);

  // Initialize stars
  const initStars = useCallback((width: number, height: number) => {
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(),
        size: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
      });
    }
    starsRef.current = stars;
  }, [starCount]);

  // Handle mouse movement
  useEffect(() => {
    if (!mouseInteraction) return;

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseInteraction]);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      if (starsRef.current.length === 0) {
        initStars(rect.width, rect.height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw stars
      starsRef.current.forEach((star) => {
        // Update position with slow drift
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around edges
        if (star.x < 0) star.x = rect.width;
        if (star.x > rect.width) star.x = 0;
        if (star.y < 0) star.y = rect.height;
        if (star.y > rect.height) star.y = 0;

        // Mouse repulsion
        if (mouseRepulsion && mouseInteraction) {
          const dx = star.x - mouseRef.current.x;
          const dy = star.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            star.x += (dx / distance) * force * 2;
            star.y += (dy / distance) * force * 2;
          }
        }

        // Calculate color with hue shift and saturation
        const hue = (star.z * 60 + hueShift) % 360;
        const sat = Math.floor(saturation * 100);
        const lightness = Math.floor(50 + star.z * 30);
        
        // Draw star with glow
        const alpha = 0.5 + star.z * 0.5;
        const size = star.size * (0.5 + star.z * 0.5);

        // Outer glow
        if (glowIntensity > 0) {
          const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, size * 3 * glowIntensity);
          gradient.addColorStop(0, `hsla(${hue}, ${sat}%, ${lightness}%, ${alpha * glowIntensity})`);
          gradient.addColorStop(1, `hsla(${hue}, ${sat}%, ${lightness}%, 0)`);
          ctx.fillStyle = gradient;
          ctx.fillRect(
            star.x - size * 3 * glowIntensity,
            star.y - size * 3 * glowIntensity,
            size * 6 * glowIntensity,
            size * 6 * glowIntensity
          );
        }

        // Core star
        ctx.fillStyle = `hsla(${hue}, ${sat}%, ${lightness}%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mouseRepulsion, mouseInteraction, glowIntensity, saturation, hueShift, initStars]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  );
}
