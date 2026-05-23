/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function AmbientBackground() {
  return (
    <div 
      className="fixed top-0 bottom-0 right-0 left-0 md:left-[25%] lg:left-[20%] pointer-events-none overflow-hidden select-none bg-transparent"
      style={{ zIndex: -1 }}
    >
      {/* 
        HIGH PERFORMANCE GPU BLUR COMPOSITOR:
        Applying the heavy blur filter ONCE to the parent container wrapper.
        The animating child bands are kept sharp so the browser only performs 
        highly-optimized transform compositions instead of costly filter repaints.
      */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none aurora-blur-container"
        style={{ 
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          perspective: 1000
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .aurora-blur-container {
            filter: blur(110px);
          }
          @keyframes auroraFlowPrimary {
            0% {
              transform: translate3d(-10%, 4%, 0) rotate(-1deg) scaleY(0.95);
            }
            50% {
              transform: translate3d(10%, -6%, 0) rotate(3deg) scaleY(1.05);
            }
            100% {
              transform: translate3d(-10%, 4%, 0) rotate(-1deg) scaleY(0.95);
            }
          }
          @keyframes auroraFlowSecondary {
            0% {
              transform: translate3d(8%, -3%, 0) rotate(2.5deg) scaleY(1.1);
            }
            50% {
              transform: translate3d(-12%, 6%, 0) rotate(-2.5deg) scaleY(0.9);
            }
            100% {
              transform: translate3d(8%, -3%, 0) rotate(2.5deg) scaleY(1.1);
            }
          }
          @keyframes auroraFlowTertiary {
            0% {
              transform: translate3d(-6%, -5%, 0) rotate(-2deg) scale(0.95);
            }
            50% {
              transform: translate3d(8%, 5%, 0) rotate(1.5deg) scale(1.05);
            }
            100% {
              transform: translate3d(-6%, -5%, 0) rotate(-2deg) scale(0.95);
            }
          }
          @keyframes auroraFlowCore {
            0% {
              transform: translate3d(-8%, 3%, 0) scale(0.95);
            }
            50% {
              transform: translate3d(10%, -4%, 0) scale(1.1);
            }
            100% {
              transform: translate3d(-8%, 3%, 0) scale(0.95);
            }
          }
          .aurora-layer {
            position: absolute;
            width: 155%;
            left: -27%;
            height: 38vh;
            border-radius: 50% 50% 0 0 / 100% 100% 0 0;
            backface-visibility: hidden;
            transform-style: preserve-3d;
            will-change: transform;
          }
          .aurora-layer-1 {
            bottom: -12vh;
            background: linear-gradient(
              90deg,
              rgba(10, 24, 76, 0.45) 0%,
              rgba(116, 45, 225, 0.55) 35%,
              rgba(223, 55, 162, 0.4) 65%,
              rgba(14, 30, 80, 0.45) 100%
            );
            animation: auroraFlowPrimary 20s infinite ease-in-out;
            opacity: 0.8;
          }
          .aurora-layer-2 {
            bottom: -8vh;
            background: linear-gradient(
              -90deg,
              rgba(116, 45, 225, 0.3) 0%,
              rgba(255, 255, 255, 0.25) 40%,
              rgba(116, 45, 225, 0.5) 75%,
              rgba(10, 24, 76, 0.2) 100%
            );
            animation: auroraFlowSecondary 26s infinite ease-in-out;
            opacity: 0.9;
            mix-blend-mode: screen;
          }
          .aurora-layer-3 {
            bottom: -18vh;
            background: linear-gradient(
              110deg,
              rgba(14, 36, 120, 0.55) 0%,
              rgba(223, 55, 162, 0.35) 50%,
              rgba(116, 45, 225, 0.45) 100%
            );
            animation: auroraFlowTertiary 23s infinite ease-in-out;
            opacity: 0.75;
          }
          .aurora-layer-core {
            position: absolute;
            bottom: -4vh;
            left: 15%;
            width: 70%;
            height: 15vh;
            border-radius: 50%;
            background: radial-gradient(
              ellipse at center,
              rgba(255, 255, 255, 0.45) 0%,
              rgba(116, 45, 225, 0.18) 50%,
              rgba(0, 0, 0, 0) 80%
            );
            animation: auroraFlowCore 16s infinite ease-in-out;
            opacity: 0.9;
            mix-blend-mode: plus-lighter;
            backface-visibility: hidden;
            transform-style: preserve-3d;
            will-change: transform;
          }
          
          /* RESPONSIVE OPTIMIZATION FOR MOBILE PORTPORTS: Ensure 60FPS scrolling */
          @media (max-width: 768px) {
            .aurora-blur-container {
              filter: blur(60px);
            }
            /* Hide multi-layered blend blends to reduce browser overdraw repaints */
            .aurora-layer-2, .aurora-layer-3 {
              display: none !important;
            }
            .aurora-layer-1 {
              height: 25vh;
              bottom: -5vh;
              opacity: 0.7;
              animation-duration: 15s;
            }
            .aurora-layer-core {
              height: 10vh;
              bottom: 0px;
              opacity: 0.75;
              animation-duration: 12s;
            }
          }
        ` }} />

        {/* 
          Layered horizontally stretched, flowing aurora bands 
          perfectly blending with our high-perf CSS engine 
        */}
        <div className="aurora-layer aurora-layer-3 pointer-events-none" />
        <div className="aurora-layer aurora-layer-1 pointer-events-none" />
        <div className="aurora-layer aurora-layer-2 pointer-events-none" />
        
        {/* Soft white-luminous core blended directly inside the main violet flow */}
        <div className="aurora-layer-core pointer-events-none" />
      </div>
    </div>
  );
}
