import { useEffect, useRef } from 'react';

// 4x4 Bayer ordered dithering threshold matrix
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface DitherBackgroundProps {
  cellSize?: number;
  influenceRadius?: number;
  baseIntensity?: number;
  className?: string;
}

export default function DitherBackground({
  cellSize = 7,
  influenceRadius = 200,
  baseIntensity = 0.045,
  className = ''
}: DitherBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    let rAFId = 0;
    let isRunning = false;
    let width = 0;
    let height = 0;

    // Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Animation & cursor state
    let targetX = -9999;
    let targetY = -9999;
    let currentX = -9999;
    let currentY = -9999;
    let targetInfluence = 0;
    let currentInfluence = 0;
    let time = 0;

    // Click shockwaves
    const shockwaves: Shockwave[] = [];

    const CELL_SIZE = cellSize;
    const INFLUENCE_RADIUS = influenceRadius;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, window.innerWidth);
      height = Math.max(rect.height, window.innerHeight);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Render immediately
      renderFrame();
    };

    const renderFrame = () => {
      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / CELL_SIZE) + 1;
      const rows = Math.ceil(height / CELL_SIZE) + 1;

      for (let r = 0; r < rows; r++) {
        const y = r * CELL_SIZE;
        const bayerRow = BAYER_4X4[r % 4];

        for (let c = 0; c < cols; c++) {
          const x = c * CELL_SIZE;
          const bayerThreshold = (bayerRow[c % 4] + 0.5) / 16;

          let intensity = baseIntensity;
          let drawX = x;
          let drawY = y;
          let isCoreSpark = false;

          // 1. Mouse Proximity & Magnetic Liquid Dither Wave
          if (currentInfluence > 0.001) {
            const dx = x - currentX;
            const dy = y - currentY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < INFLUENCE_RADIUS) {
              const normDist = dist / INFLUENCE_RADIUS;
              const falloff = Math.pow(1 - normDist, 1.4);

              // Organic fluid wave modulation
              const wave = prefersReducedMotion
                ? 0.5
                : Math.sin(dist * 0.08 - time * 2.5) * 0.5 + 0.5;

              const densityShift = falloff * (0.65 + 0.35 * wave);
              intensity += densityShift * currentInfluence;

              // Core epicenter accent sparks (brand #FF205A accent within 35px radius)
              if (dist < 35 && (bayerRow[c % 4] === 0 || bayerRow[c % 4] === 2)) {
                isCoreSpark = true;
              }

              // Subtle magnetic grid displacement
              if (!prefersReducedMotion) {
                const angle = Math.atan2(dy, dx);
                const disp = Math.sin(dist * 0.09 - time * 2.0) * falloff * 2.8 * currentInfluence;
                drawX += Math.cos(angle) * disp;
                drawY += Math.sin(angle) * disp;
              }
            }
          }

          // 2. Click Shockwave Wavefront
          for (let s = 0; s < shockwaves.length; s++) {
            const sw = shockwaves[s];
            const dx = x - sw.x;
            const dy = y - sw.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const waveWidth = 28;

            if (Math.abs(dist - sw.radius) < waveWidth) {
              const wavePower = (1 - Math.abs(dist - sw.radius) / waveWidth) * sw.alpha;
              intensity += wavePower * 0.55;
            }
          }

          // 3. Evaluate Bayer Ordered Dither Threshold
          if (intensity > bayerThreshold) {
            if (isCoreSpark) {
              // Signature Brand Accent Pink Spark (#FF205A)
              ctx.fillStyle = 'rgba(255, 32, 90, 0.90)';
              ctx.fillRect(Math.round(drawX), Math.round(drawY), 2.0, 2.0);
            } else if (intensity > baseIntensity + 0.07) {
              // Active responsive monochrome zone: Controlled, crisp 1-bit white pixels
              const alpha = Math.min(0.40 + (intensity - bayerThreshold) * 0.65, 0.85);
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
              ctx.fillRect(Math.round(drawX), Math.round(drawY), 2.0, 2.0);
            } else {
              // Rest state ambient dot: Ultra-fine, subtle 1-bit halftone texture
              ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
              ctx.fillRect(Math.round(drawX), Math.round(drawY), 1.4, 1.4);
            }
          }
        }
      }
    };

    const loop = () => {
      // Smooth interpolation towards cursor
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      currentInfluence += (targetInfluence - currentInfluence) * 0.12;
      time += 0.03;

      // Update shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 5.0;
        sw.alpha *= 0.92;
        if (sw.radius >= sw.maxRadius || sw.alpha < 0.02) {
          shockwaves.splice(i, 1);
        }
      }

      renderFrame();

      // Pause loop if settled, no shockwaves, and mouse has left
      if (targetInfluence === 0 && currentInfluence < 0.005 && shockwaves.length === 0) {
        currentInfluence = 0;
        renderFrame(); // draw clean rest state
        isRunning = false;
        return;
      }

      rAFId = requestAnimationFrame(loop);
    };

    const wakeUp = () => {
      if (!isRunning) {
        isRunning = true;
        rAFId = requestAnimationFrame(loop);
      }
    };

    const updateCoords = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      targetX = x;
      targetY = y;
      targetInfluence = 1;

      if (currentX < -1000) {
        currentX = targetX;
        currentY = targetY;
      }

      wakeUp();
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateCoords(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      shockwaves.push({
        x,
        y,
        radius: 0,
        maxRadius: 300,
        alpha: 0.85
      });

      wakeUp();
    };

    const handleMouseLeave = () => {
      targetInfluence = 0;
    };

    // Initialize dimensions
    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    // Global listeners on window to ensure smooth cursor tracking
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rAFId) cancelAnimationFrame(rAFId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cellSize, influenceRadius, baseIntensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 select-none ${className}`}
      aria-hidden="true"
    />
  );
}

export { DitherBackground as FooterDitherBackground };
