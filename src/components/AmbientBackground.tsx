/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

export default function AmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rAFId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) - 0.5;
      targetY = (e.clientY / window.innerHeight) - 0.5;
    };

    const update = () => {
      currentX += (targetX - currentX) * 0.015;
      currentY += (targetY - currentY) * 0.015;

      if (containerRef.current) {
        containerRef.current.style.setProperty('--mx', `${currentX * 20}px`);
        containerRef.current.style.setProperty('--my', `${currentY * 20}px`);
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
        <style dangerouslySetInnerHTML={{ __html: `
          .aurora-blur-wrap {
            filter: blur(100px);
          }

          /* ========== LAYER 1: Large purple glow — 25s ========== */
          @keyframes meshDrift1 {
            0% {
              transform: translate3d(-30%, 15%, 0) scale(1.0);
            }
            25% {
              transform: translate3d(20%, -10%, 0) scale(1.15);
            }
            50% {
              transform: translate3d(35%, 20%, 0) scale(0.95);
            }
            75% {
              transform: translate3d(-15%, -20%, 0) scale(1.1);
            }
            100% {
              transform: translate3d(-30%, 15%, 0) scale(1.0);
            }
          }

          /* ========== LAYER 2: Soft violet glow — 35s ========== */
          @keyframes meshDrift2 {
            0% {
              transform: translate3d(25%, -15%, 0) scale(1.1);
            }
            20% {
              transform: translate3d(-20%, 25%, 0) scale(0.9);
            }
            40% {
              transform: translate3d(-35%, -10%, 0) scale(1.05);
            }
            60% {
              transform: translate3d(15%, 30%, 0) scale(0.95);
            }
            80% {
              transform: translate3d(30%, -25%, 0) scale(1.1);
            }
            100% {
              transform: translate3d(25%, -15%, 0) scale(1.1);
            }
          }

          /* ========== LAYER 3: Magenta accent glow — 45s ========== */
          @keyframes meshDrift3 {
            0% {
              transform: translate3d(10%, 25%, 0) scale(0.95);
            }
            15% {
              transform: translate3d(-25%, -15%, 0) scale(1.1);
            }
            35% {
              transform: translate3d(30%, -25%, 0) scale(1.0);
            }
            55% {
              transform: translate3d(-35%, 10%, 0) scale(1.15);
            }
            75% {
              transform: translate3d(20%, 30%, 0) scale(0.9);
            }
            100% {
              transform: translate3d(10%, 25%, 0) scale(0.95);
            }
          }

          /* ========== CORE: Luminous center glow — 20s ========== */
          @keyframes meshDriftCore {
            0% {
              transform: translate3d(-15%, 8%, 0) scale(0.9);
              opacity: 0.6;
            }
            33% {
              transform: translate3d(18%, -12%, 0) scale(1.15);
              opacity: 1;
            }
            66% {
              transform: translate3d(-10%, -15%, 0) scale(1.05);
              opacity: 0.75;
            }
            100% {
              transform: translate3d(-15%, 8%, 0) scale(0.9);
              opacity: 0.6;
            }
          }

          /* ========== MOBILE SIMPLIFIED ========== */
          @keyframes meshDriftMobile {
            0% {
              transform: translate3d(-15%, 8%, 0) scale(1.0);
            }
            33% {
              transform: translate3d(15%, -8%, 0) scale(1.1);
            }
            66% {
              transform: translate3d(-10%, -12%, 0) scale(0.95);
            }
            100% {
              transform: translate3d(-15%, 8%, 0) scale(1.0);
            }
          }
          @keyframes meshDriftCoreMobile {
            0% {
              transform: translate3d(-8%, 4%, 0) scale(0.95);
            }
            50% {
              transform: translate3d(8%, -4%, 0) scale(1.1);
            }
            100% {
              transform: translate3d(-8%, 4%, 0) scale(0.95);
            }
          }

          /* ========== BLOB BASE SHAPE ========== */
          .mesh-blob {
            position: absolute;
            border-radius: 50%;
            backface-visibility: hidden;
            will-change: transform;
          }

          /* LAYER 1: Large purple */
          .mesh-blob-1 {
            width: 70vw;
            height: 70vw;
            max-width: 900px;
            max-height: 900px;
            bottom: -25vh;
            right: -10%;
            background: radial-gradient(
              ellipse at 40% 50%,
              rgba(116, 45, 225, 0.7) 0%,
              rgba(88, 28, 180, 0.4) 40%,
              rgba(60, 15, 120, 0.15) 70%,
              transparent 100%
            );
            animation: meshDrift1 25s infinite ease-in-out;
          }

          /* LAYER 2: Soft violet */
          .mesh-blob-2 {
            width: 60vw;
            height: 60vw;
            max-width: 800px;
            max-height: 800px;
            bottom: -20vh;
            left: -5%;
            background: radial-gradient(
              ellipse at 60% 40%,
              rgba(139, 92, 246, 0.6) 0%,
              rgba(116, 45, 225, 0.3) 45%,
              rgba(75, 25, 160, 0.1) 75%,
              transparent 100%
            );
            animation: meshDrift2 35s infinite ease-in-out;
            mix-blend-mode: screen;
          }

          /* LAYER 3: Magenta accent */
          .mesh-blob-3 {
            width: 55vw;
            height: 55vw;
            max-width: 750px;
            max-height: 750px;
            bottom: -15vh;
            left: 20%;
            background: radial-gradient(
              ellipse at 50% 60%,
              rgba(200, 40, 150, 0.5) 0%,
              rgba(160, 30, 130, 0.25) 40%,
              rgba(116, 45, 225, 0.1) 70%,
              transparent 100%
            );
            animation: meshDrift3 45s infinite ease-in-out;
          }

          /* CORE: Luminous white-violet center */
          .mesh-blob-core {
            position: absolute;
            bottom: -5vh;
            left: 25%;
            width: 50%;
            height: 20vh;
            border-radius: 50%;
            background: radial-gradient(
              ellipse at center,
              rgba(224, 200, 255, 0.35) 0%,
              rgba(139, 92, 246, 0.2) 40%,
              rgba(116, 45, 225, 0.08) 65%,
              transparent 90%
            );
            animation: meshDriftCore 20s infinite ease-in-out;
            mix-blend-mode: plus-lighter;
            backface-visibility: hidden;
            will-change: transform;
          }
          
          /* RESPONSIVE: Mobile performance optimization */
          @media (max-width: 768px) {
            .aurora-blur-wrap {
              filter: blur(50px);
            }
            .mesh-blob-2, .mesh-blob-3 {
              display: none !important;
            }
            .mesh-blob-1 {
              width: 80vw;
              height: 50vw;
              bottom: -8vh;
              right: -15%;
              opacity: 0.7;
              animation: meshDriftMobile 20s infinite ease-in-out;
            }
            .mesh-blob-core {
              height: 12vh;
              bottom: 0;
              opacity: 0.8;
              animation: meshDriftCoreMobile 15s infinite ease-in-out;
            }
          }
        ` }} />

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
