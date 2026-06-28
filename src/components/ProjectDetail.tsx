/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Project } from '../types';
import Lightbox from './Lightbox';

// Hook to track the active columns count responsively (mimicking media queries)
function useColumnCount() {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) {
        setColumns(3);
      } else if (window.innerWidth >= 640) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  return columns;
}

interface LazyMediaProps {
  url: string;
  type: 'image' | 'gif';
  aspectRatioNumber?: number;
  alt?: string;
  className?: string;
  onClick?: () => void;
  priority?: boolean;
}

function LazyMedia({ url, type, aspectRatioNumber, alt = '', className = '', onClick, priority = false }: LazyMediaProps) {
  const [isIntersected, setIsIntersected] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsIntersected(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px' } // Preload images 600px before they scroll into view
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  // Remove aspectRatio style once image is loaded to collapse any subpixel rendering discrepancies
  const style: React.CSSProperties = aspectRatioNumber && !isLoaded
    ? { aspectRatio: String(aspectRatioNumber) }
    : {};

  return (
    <div
      ref={ref}
      style={style}
      onClick={onClick}
      className={`w-full relative overflow-hidden ${className}`}
    >
      {/* Subtle dark skeleton placeholder that cross-fades */}
      <div
        className={`absolute inset-0 bg-[#070707] transition-opacity duration-700 ease-in-out pointer-events-none z-10 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/10 to-transparent bg-[length:200%_100%] animate-pulse" />
      </div>
      {isIntersected && (
        <img
          src={url}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          decoding="async"
          className={`w-full h-auto block transition-opacity duration-700 ease-in-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
}

interface LazyVideoProps {
  url: string;
  aspectRatioNumber?: number;
  className?: string;
  onClick?: () => void;
  autoPlay?: boolean;
  priority?: boolean;
}

function LazyVideo({ url, aspectRatioNumber = 1.77777778, className = '', onClick, autoPlay = true, priority = false }: LazyVideoProps) {
  const [isIntersected, setIsIntersected] = useState(priority);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Defer mounting of video until close to viewport
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsIntersected(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  // Viewport observer to play when visible, pause when offscreen
  useEffect(() => {
    if (!autoPlay || !isIntersected) return;

    const handleTimeUpdate = () => {
      const video = videoRef.current;
      if (video && video.duration && !isNaN(video.duration)) {
        // Seek to 0 just slightly before the video ends (e.g. 0.08 seconds)
        // to prevent the browser from stalling or unloading the buffer.
        if (video.currentTime >= video.duration - 0.08) {
          video.currentTime = 0;
          video.play().catch((err) => {
            console.log('timeupdate loop playback failed:', err.message);
          });
        }
      }
    };

    const playbackObserver = new IntersectionObserver(
      (entries) => {
        const video = videoRef.current;
        if (!video) return;

        if (entries[0].isIntersecting) {
          video.addEventListener('timeupdate', handleTimeUpdate);
          video.play()
            .catch((err) => {
              console.log('Autoplay play interrupted or blocked:', err.message);
            });
        } else {
          video.removeEventListener('timeupdate', handleTimeUpdate);
          video.pause();
        }
      },
      { threshold: 0.05 }
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      playbackObserver.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        playbackObserver.unobserve(currentContainer);
      }
      // Clean up timeupdate listener
      const video = videoRef.current;
      if (video) {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [isIntersected, autoPlay]);

  const style: React.CSSProperties = {
    aspectRatio: String(aspectRatioNumber),
    contain: 'paint' // Isolate video layout and painting
  };

  return (
    <div
      ref={containerRef}
      style={style}
      onClick={onClick}
      className={`w-full relative overflow-hidden ${className}`}
    >
      {/* Subtle dark skeleton placeholder that cross-fades */}
      <div
        className={`absolute inset-0 bg-[#070707] transition-opacity duration-700 ease-in-out pointer-events-none z-10 ${
          isVideoLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/10 to-transparent bg-[length:200%_100%] animate-pulse" />
      </div>
      {isIntersected && (
        <video
          ref={videoRef}
          src={url}
          autoPlay
          preload="auto"
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          onCanPlay={() => setIsVideoLoaded(true)}
          onEnded={() => {
            const video = videoRef.current;
            if (video) {
              video.currentTime = 0;
              video.play().catch((err) => {
                console.log('onEnded loop play failed:', err.message);
              });
            }
          }}
          className={`w-full h-full object-cover block transition-opacity duration-700 ease-in-out ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: 'translate3d(0, 0, 0)', // Promotion to GPU layer
            backfaceVisibility: 'hidden',
          }}
        />
      )}
    </div>
  );
}

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onNextProject: () => void;
  onPrevProject: () => void;
}

export default function ProjectDetail({
  project,
  onBack,
  onNextProject,
  onPrevProject
}: ProjectDetailProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(13);
  const columnCount = useColumnCount();

  // Progressive infinite scroll loading for Thumbnail Archive and Poster Design projects
  useEffect(() => {
    if (project.id !== 'thumbnail-project' && project.id !== 'experimental-poster-design') return;
    
    // Reset visible count when project changes
    setVisibleCount(13);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 12, project.media.length));
        }
      },
      { rootMargin: '400px' }
    );

    const target = document.getElementById('infinite-scroll-trigger');
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [project.id, project.media.length]);

  // Distribute items round-robin for the masonry view
  const slicedMedia = project.media.slice(1, visibleCount).map((item, idx) => ({
    item,
    originalIdx: idx + 1
  }));
  const cols = Array.from({ length: columnCount }, () => [] as typeof slicedMedia);
  slicedMedia.forEach((val, idx) => {
    cols[idx % columnCount].push(val);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-12 pb-24"
    >
      {/* HEADER: Nav Actions */}
      <div className="flex items-center justify-between border-b border-[#111111] pb-6">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 font-mono text-xs text-[#666666] hover:text-[#742DE1] transition-colors cursor-pointer py-2 px-1"
          style={{ minHeight: '44px' }}
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-[#742DE1]" />
          <span className="hidden sm:inline">[ RETURN TO INDEX ARCHIVE ]</span>
          <span className="inline sm:hidden">[ BACK ]</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onPrevProject}
            className="font-mono text-[10px] text-[#666666] hover:text-[#742DE1] transition-colors p-2"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            ← PREV
          </button>
          <span className="font-mono text-[10px] text-[#333333]">/</span>
          <button
            onClick={onNextProject}
            className="font-mono text-[10px] text-[#666666] hover:text-[#742DE1] transition-colors p-2"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            NEXT →
          </button>
        </div>
      </div>

      {/* 1. PROJECT TITLE AND INTRO SECTION FIRST AT TOP */}
      <div className="space-y-4 sm:space-y-6 max-w-4xl pt-2">
        <div className="space-y-2">
          <h2 className="font-sans font-extrabold text-2xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-tight text-white uppercase leading-none break-words">
            {project.title}
          </h2>
          <p className="font-mono text-[#666666] text-xs sm:text-sm tracking-tight uppercase">
            {project.subtitle}
          </p>
        </div>
        
        <div className="space-y-3 sm:space-y-4 pt-1">
          <p className="font-sans text-base sm:text-lg lg:text-xl text-zinc-300 leading-relaxed font-light">
            {project.summary}
          </p>
          <p className="font-sans text-xs sm:text-sm text-zinc-500 leading-relaxed">
            {project.about}
          </p>
        </div>
      </div>

      {/* 2. PROJECT IMAGES FLOW (HERO + GALLERY STREAM) */}
      {project.id === 'thumbnail-project' ? (
        /* SPECIAL PINTEREST-STYLE SHOWCASE FOR THUMBNAIL ARCHIVE */
        <div className="w-full flex flex-col pt-2">
          {/* HERO IMAGE: Cinematic showcase style */}
          <div 
            onClick={() => setLightboxIndex(0)}
            className="w-full overflow-hidden cursor-zoom-in relative border border-[#1a1a1a] bg-[#0d0d0d] mb-4 lg:mb-6"
          >
            <LazyMedia
              url={project.thumbnailUrl}
              type="image"
              aspectRatioNumber={project.media[0]?.aspectRatioNumber}
              alt={project.title}
              className="w-full h-auto block transform hover:scale-[1.005] transition-transform duration-700"
              priority={true}
            />
          </div>

          {/* 2-COLUMN MASONRY GRID (Pinterest style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 w-full items-start">
            {project.media.slice(1, visibleCount).map((item, idx) => (
              <div 
                key={item.id} 
                onClick={() => setLightboxIndex(idx + 1)}
                className="overflow-hidden bg-[#0d0d0d] border border-[#1a1a1a] relative cursor-zoom-in group transition-[border-color] duration-300 hover:border-[#333]"
              >
                <div className="w-full text-left">
                  {(item.type === 'image' || item.type === 'gif') && (
                    <LazyMedia
                      url={item.url}
                      type={item.type}
                      aspectRatioNumber={item.aspectRatioNumber}
                      className="transform group-hover:scale-[1.01] transition-transform duration-500 will-change-transform"
                    />
                  )}

                  {item.type === 'video' && (
                    <LazyVideo
                      url={item.url}
                      aspectRatioNumber={item.aspectRatioNumber}
                      className="transform group-hover:scale-[1.01] transition-transform duration-500 will-change-transform"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Scroll trigger for infinite scroll loading */}
          {visibleCount < project.media.length && (
            <div id="infinite-scroll-trigger" className="h-16 w-full flex items-center justify-center font-mono text-[9px] text-[#444444] uppercase tracking-[0.25em] py-12">
              [ LOADING ARCHIVE SEGMENTS... ]
            </div>
          )}
        </div>
      ) : project.id === 'experimental-poster-design' ? (
        /* SPECIAL MIXED-MEDIA MASONRY LAYOUT FOR EXPERIMENTAL POSTER DESIGN */
        <div className="w-full flex flex-col pt-2">
          {/* HERO VIDEO: Cinematic motion opener */}
          {project.media[0] && (
            <div 
              onClick={() => setLightboxIndex(0)}
              className="w-full overflow-hidden cursor-zoom-in relative border border-[#1a1a1a] bg-[#0d0d0d] mb-4 lg:mb-6"
            >
              {project.media[0].type === 'video' ? (
                <LazyVideo
                  url={project.media[0].url}
                  aspectRatioNumber={project.media[0].aspectRatioNumber}
                  className="transform hover:scale-[1.005] transition-transform duration-700"
                  priority={true}
                />
              ) : (
                <LazyMedia
                  url={project.media[0].url}
                  type="image"
                  aspectRatioNumber={project.media[0].aspectRatioNumber}
                  alt={project.title}
                  className="transform hover:scale-[1.005] transition-transform duration-700"
                  priority={true}
                />
              )}
            </div>
          )}

          {/* Stable responsive CSS grid utilizing react-controlled flex columns */}
          <div 
            className="grid gap-6 lg:gap-8 items-start w-full"
            style={{
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`
            }}
          >
            {cols.map((colItems, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-6 lg:gap-8">
                {colItems.map(({ item, originalIdx }) => (
                  <div 
                    key={item.id} 
                    onClick={() => setLightboxIndex(originalIdx)}
                    className="overflow-hidden bg-[#0d0d0d] border border-[#1a1a1a] relative cursor-zoom-in group transition-[border-color] duration-300 hover:border-[#333]"
                  >
                    <div className="w-full text-left">
                      {(item.type === 'image' || item.type === 'gif') && (
                        <LazyMedia
                          url={item.url}
                          type={item.type}
                          aspectRatioNumber={item.aspectRatioNumber}
                          className="transform group-hover:scale-[1.01] transition-transform duration-500 will-change-transform"
                        />
                      )}

                      {item.type === 'video' && (
                        <LazyVideo
                          url={item.url}
                          aspectRatioNumber={item.aspectRatioNumber}
                          className="transform group-hover:scale-[1.01] transition-transform duration-500 will-change-transform"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Scroll trigger for infinite scroll loading */}
          {visibleCount < project.media.length && (
            <div id="infinite-scroll-trigger" className="h-16 w-full flex items-center justify-center font-mono text-[9px] text-[#444444] uppercase tracking-[0.25em] py-12">
              [ LOADING ARCHIVE SEGMENTS... ]
            </div>
          )}
        </div>
      ) : (project.id === 'music-cover-art' || project.id === '2tone-ep') ? (
        /* SPECIAL SEAMLESS BEHANCE-STYLE STACKED GALLERY FOR MUSIC COVER ART (excludes THUMB, renders all media continuously) */
        <div className="w-full flex flex-col pt-2 gap-0">
          {project.media.map((item, idx) => (
            <div 
              key={item.id} 
              onClick={() => setLightboxIndex(idx)}
              className="w-full relative cursor-zoom-in overflow-hidden"
            >
              <div className="w-full text-left">
                {(item.type === 'image' || item.type === 'gif') && (
                  <LazyMedia
                    url={item.url}
                    type={item.type}
                    aspectRatioNumber={item.aspectRatioNumber}
                    className="w-full h-auto block"
                    priority={idx === 0}
                  />
                )}

                {item.type === 'video' && (
                  <LazyVideo
                    url={item.url}
                    aspectRatioNumber={item.aspectRatioNumber}
                    className="w-full h-auto block"
                    priority={idx === 0}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* DEFAULT BEHANCE-STYLE SEAMLESS STACKED GALLERY */
        <div className="w-full flex flex-col pt-2 gap-0">
          {/* HERO IMAGE */}
          <div 
            onClick={() => setLightboxIndex(0)}
            className="w-full overflow-hidden cursor-zoom-in relative"
          >
            <LazyMedia
              url={project.thumbnailUrl}
              type="image"
              aspectRatioNumber={project.media[0]?.aspectRatioNumber}
              alt={project.title}
              className="w-full h-auto block"
              priority={true}
            />
          </div>

          {/* GALLERY IMAGES */}
          {project.media.slice(1).map((item, idx) => (
            <div 
              key={item.id} 
              onClick={() => setLightboxIndex(idx + 1)}
              className="w-full relative cursor-zoom-in overflow-hidden"
            >
              <div className="w-full text-left">
                {(item.type === 'image' || item.type === 'gif') && (
                  <LazyMedia
                    url={item.url}
                    type={item.type}
                    aspectRatioNumber={item.aspectRatioNumber}
                    className="w-full h-auto block"
                  />
                )}

                {item.type === 'video' && (
                  <LazyVideo
                    url={item.url}
                    aspectRatioNumber={item.aspectRatioNumber}
                    className="w-full h-auto block"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER NAV CONTROLS FOR DIRECT CATALOG EXPLORING */}
      <div className="h-[1px] bg-[#111111] w-full pt-1" />
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 sm:pt-6">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 font-mono text-xs text-[#666666] hover:text-[#742DE1] transition-colors cursor-pointer w-full sm:w-auto justify-center py-3 sm:py-2 border border-[#111111] sm:border-transparent"
          style={{ minHeight: '44px' }}
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-[#742DE1]" />
          <span className="hidden sm:inline">[ RETURN TO ALL WORKS ]</span>
          <span className="inline sm:hidden">[ BACK TO ARCHIVE ]</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onPrevProject}
            className="group flex items-center justify-center gap-2 font-mono text-xs text-[#666666] hover:text-[#742DE1] transition-colors cursor-pointer py-3 px-4 border border-[#111111] sm:border-transparent flex-1 sm:flex-initial"
            style={{ minHeight: '44px' }}
          >
            <span>[ ← PREV ]</span>
          </button>
          
          <button
            onClick={onNextProject}
            className="group flex items-center justify-center gap-2 font-mono text-xs text-[#666666] hover:text-[#742DE1] transition-colors cursor-pointer py-3 px-4 border border-[#111111] sm:border-transparent flex-1 sm:flex-initial"
            style={{ minHeight: '44px' }}
          >
            <span>[ NEXT → ]</span>
          </button>
        </div>
      </div>

      <Lightbox
        isOpen={lightboxIndex !== null}
        mediaList={project.media}
        initialIndex={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
      />
    </motion.div>
  );
}
