/* =========================================================
   Imports
========================================================= */

import React, { useState, useRef, useMemo } from 'react';
import { motion, PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../types';

/* =========================================================
   Types
========================================================= */

interface InstagramCarouselProps {
  key?: string;
  title: string;
  slides: MediaItem[];
  onSlideClick: (slideIndex: number) => void;
}

/* =========================================================
   Constants
========================================================= */

// Each slide occupies this % of the viewport width
const SLIDE_WIDTH_PCT = 43.48;

/* =========================================================
   Component
========================================================= */

export default function InstagramCarousel({
  title,
  slides,
  onSlideClick,
}: InstagramCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelLockRef = useRef(false);

  // Clamp max translation so the track ends at the last slide (no empty black space)
  const maxIndex = useMemo(() => {
    // The viewport shows ~2.3 slides. We want the last slide to sit at the
    // right edge of the viewport, not the left. So the furthest we translate
    // is: (totalSlides * slideWidth - 100%) / slideWidth  →  simplified:
    const maxTranslateSlides = Math.max(0, slides.length - Math.floor(100 / SLIDE_WIDTH_PCT));
    return maxTranslateSlides;
  }, [slides.length]);

  const goToSlide = (index: number) => {
    const validIndex = Math.max(0, Math.min(maxIndex, index));
    setCurrentIndex(validIndex);
  };

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      goToSlide(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const swipeThreshold = 30;
    const velocityThreshold = 150;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      handlePrev();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrev();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 25) {
      if (wheelLockRef.current) return;
      wheelLockRef.current = true;
      if (e.deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 350);
    }
  };

  // Compute clamped translateX so the track never overscrolls past the last slide
  const translatePct = useMemo(() => {
    const rawTranslate = currentIndex * SLIDE_WIDTH_PCT;
    const totalTrackWidth = slides.length * SLIDE_WIDTH_PCT;
    // Never translate further than (totalTrack - 100% viewport)
    const maxTranslate = Math.max(0, totalTrackWidth - 100);
    return Math.min(rawTranslate, maxTranslate);
  }, [currentIndex, slides.length]);

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= maxIndex;

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      tabIndex={0}
      className="w-full max-w-6xl mx-auto focus:outline-none group/carousel select-none"
    >
      {/* SECTION LABEL */}
      <div className="mb-5">
        <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-zinc-400 uppercase">
          {title}
        </span>
      </div>

      {/* CAROUSEL VIEWER FRAME */}
      <div
        className="relative w-full overflow-hidden rounded-lg bg-[#0a0a0a]"
        style={{
          boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 64px -16px rgba(0,0,0,0.85), inset 0 1px 0 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* HORIZONTAL SLIDING TRACK */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragEnd={handleDragEnd}
          animate={{
            x: `-${translatePct}%`,
          }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-stretch gap-0 cursor-grab active:cursor-grabbing will-change-transform"
          style={{ touchAction: 'pan-y' }}
        >
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={slide.id}
                onClick={() => {
                  if (isActive) {
                    onSlideClick(idx);
                  } else if (idx === currentIndex + 1) {
                    handleNext();
                  } else if (idx === currentIndex - 1) {
                    handlePrev();
                  }
                }}
                className={`flex-shrink-0 aspect-[4/5] overflow-hidden bg-[#070707] ${
                  isActive ? 'cursor-zoom-in' : 'cursor-pointer'
                }`}
                style={{ width: `${SLIDE_WIDTH_PCT}%` }}
              >
                <img
                  src={slide.url}
                  alt={`${title} - Slide ${idx + 1}`}
                  className="w-full h-full object-cover block pointer-events-none select-none"
                />
              </div>
            );
          })}
        </motion.div>

        {/* RIGHT EDGE GRADIENT FADE MASK */}
        <div className="absolute right-0 top-0 bottom-0 w-[15%] bg-gradient-to-r from-transparent to-[#0a0a0a] pointer-events-none z-20" />

        {/* OVERLAY NAV — PREV (inside viewport, vertically centered) */}
        {!isAtStart && (
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 hover:border-white/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
        )}

        {/* OVERLAY NAV — NEXT (inside viewport, vertically centered) */}
        {!isAtEnd && (
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 hover:border-white/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <ChevronRight size={18} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* PAGINATION DOTS */}
      <div className="flex items-center justify-center gap-1.5 mt-5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-[5px] rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentIndex
                ? 'w-5 bg-[#FF205A]'
                : 'w-[5px] bg-zinc-800 hover:bg-zinc-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
