/* =========================================================
   Imports
========================================================= */

import { useEffect, useRef } from 'react';

/* =========================================================
   Component
========================================================= */

export default function AmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rAFId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let lastAppliedX = 0;
    let lastAppliedY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) - 0.5;
      targetY = (e.clientY / window.innerHeight) - 0.5;
    };

    const update = () => {
      currentX += (targetX - currentX) * 0.015;
      currentY += (targetY - currentY) * 0.015;

      // Only update DOM when delta is significant enough to be visible
      const dx = Math.abs(currentX - lastAppliedX);
      const dy = Math.abs(currentY - lastAppliedY);

      if ((dx > 0.0005 || dy > 0.0005) && containerRef.current) {
        containerRef.current.style.setProperty('--mx', `${currentX * 20}px`);
        containerRef.current.style.setProperty('--my', `${currentY * 20}px`);
        lastAppliedX = currentX;
        lastAppliedY = currentY;
      }

      rAFId = requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rAFId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rAFId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed top-0 bottom-0 right-0 left-0 md:left-[25%] lg:left-[20%] pointer-events-none overflow-hidden select-none bg-transparent"
      style={{ 
        zIndex: -1,
        transform: 'translate3d(0,0,0)',
        willChange: 'transform',
        contain: 'strict'
      }}
    >
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none aurora-blur-wrap"
        style={{ 
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          perspective: 1000
        }}
      >
        {/* Layer 3: Magenta accent — deepest, moves opposite */}
        <div 
          style={{ 
            transform: 'translate3d(calc(var(--mx, 0px) * -0.6), calc(var(--my, 0px) * -0.6), 0)',
            willChange: 'transform'
          }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="mesh-blob mesh-blob-3 pointer-events-none" />
        </div>

        {/* Layer 1: Large purple — mid-depth */}
        <div 
          style={{ 
            transform: 'translate3d(calc(var(--mx, 0px) * 0.8), calc(var(--my, 0px) * 0.8), 0)',
            willChange: 'transform'
          }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="mesh-blob mesh-blob-1 pointer-events-none" />
        </div>

        {/* Layer 2: Soft violet — foreground */}
        <div 
          style={{ 
            transform: 'translate3d(calc(var(--mx, 0px) * -1.0), calc(var(--my, 0px) * -1.0), 0)',
            willChange: 'transform'
          }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="mesh-blob mesh-blob-2 pointer-events-none" />
        </div>

        {/* Core: Luminous glow center — closest to user */}
        <div 
          style={{ 
            transform: 'translate3d(calc(var(--mx, 0px) * 1.2), calc(var(--my, 0px) * 1.2), 0)',
            willChange: 'transform'
          }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="mesh-blob-core pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
