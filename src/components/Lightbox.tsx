/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../types';

interface LightboxProps {
  isOpen: boolean;
  mediaList: MediaItem[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({
  isOpen,
  mediaList,
  initialIndex,
  onClose
}: LightboxProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  // Sync activeIndex with initialIndex when lightbox opens
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const handleNext = useCallback(() => {
    if (mediaList.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % mediaList.length);
  }, [mediaList]);

  const handlePrev = useCallback(() => {
    if (mediaList.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  }, [mediaList]);

  // Preload adjacent images for performance
  useEffect(() => {
    if (mediaList.length === 0) return;
    
    // Preload next
    const nextIdx = (activeIndex + 1) % mediaList.length;
    const nextItem = mediaList[nextIdx];
    if (nextItem && (nextItem.type === 'image' || nextItem.type === 'gif')) {
      const img = new Image();
      img.src = nextItem.url;
    }

    // Preload prev
    const prevIdx = (activeIndex - 1 + mediaList.length) % mediaList.length;
    const prevItem = mediaList[prevIdx];
    if (prevItem && (prevItem.type === 'image' || prevItem.type === 'gif')) {
      const img = new Image();
      img.src = prevItem.url;
    }
  }, [activeIndex, mediaList]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleNext, handlePrev, onClose]);

  const activeMedia = mediaList[activeIndex];

  return (
    <AnimatePresence>
      {isOpen && activeMedia && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-99 flex items-center justify-center select-none"
        >
          {/* Subtle Click-to-close Backdrop zone */}
          <div className="absolute inset-0 z-10" onClick={onClose} />

          {/* TOP BAR UI */}
          <div className="absolute top-0 inset-x-0 h-20 px-6 sm:px-10 flex items-center justify-between z-20 pointer-events-none">
            <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest pointer-events-auto">
              [ {activeIndex + 1} / {mediaList.length} ]
            </div>
            <button
              onClick={onClose}
              className="group p-2 cursor-pointer border border-white/10 hover:border-[#742DE1] hover:bg-[#742DE1] transition-all bg-black/50 hover:text-white text-zinc-400 z-30 pointer-events-auto"
              title="Close Gallery (Esc)"
            >
              <X size={14} className="transition-transform group-hover:rotate-90" />
            </button>
          </div>

          {/* MAIN MEDIA FRAME AND SWIPE ZONE */}
          <div className="relative w-full max-w-[95vw] sm:max-w-4xl md:max-w-5xl h-[70vh] sm:h-[80vh] flex items-center justify-center z-15">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={(event, info) => {
                  const swipeThreshold = 50;
                  if (info.offset.x < -swipeThreshold) {
                    handleNext();
                  } else if (info.offset.x > swipeThreshold) {
                    handlePrev();
                  }
                }}
                className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                {activeMedia.type === 'video' ? (
                  <video
                    src={activeMedia.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="max-w-full max-h-full object-contain pointer-events-none"
                  />
                ) : (
                  <img
                    src={activeMedia.url}
                    alt=""
                    className="max-w-full max-h-full object-contain pointer-events-none shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* NAVIGATION BUTTONS */}
          <div className="absolute inset-y-0 left-0 w-1/4 sm:w-16 flex items-center justify-start pl-4 sm:pl-8 z-20 pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="p-3 border border-white/10 hover:border-[#742DE1] hover:bg-[#742DE1]/20 backdrop-blur-sm transition-all bg-black/40 text-white cursor-pointer hover:scale-105 active:scale-95 pointer-events-auto"
              title="Previous Image (Left Arrow)"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          <div className="absolute inset-y-0 right-0 w-1/4 sm:w-16 flex items-center justify-end pr-4 sm:pr-8 z-20 pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="p-3 border border-white/10 hover:border-[#742DE1] hover:bg-[#742DE1]/20 backdrop-blur-sm transition-all bg-black/40 text-white cursor-pointer hover:scale-105 active:scale-95 pointer-events-auto"
              title="Next Image (Right Arrow)"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
