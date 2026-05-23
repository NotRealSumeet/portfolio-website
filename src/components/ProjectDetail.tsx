/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Project } from '../types';
import Lightbox from './Lightbox';

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

      {/* 2. MAIN HERO/COVER IMAGE BELOW IT */}
      <div 
        onClick={() => setLightboxIndex(0)}
        className="w-full overflow-hidden bg-[#0d0d0d] border border-[#111111] aspect-video relative cursor-zoom-in"
      >
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          className="w-full h-full object-cover grayscale transition-all duration-750 hover:grayscale-0 hover:scale-102"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
          <span className="font-mono text-[9px] sm:text-xs text-white tracking-widest uppercase border border-white/20 px-2 py-0.5 bg-black/60">
            {project.category}
          </span>
        </div>
      </div>

      {/* 3. PROJECT MEDIA GALLERY: PINTEREST MASONRY LAYOUT */}
      <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
        <h3 className="font-mono text-[9px] sm:text-xs text-[#555555] tracking-[0.2em] uppercase">
          DOCUMENTATION CAPTURES
        </h3>

        {/* Improved gallery flow to prevent crampiness on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {project.media.map((item, idx) => (
            <div 
              key={item.id} 
              onClick={() => setLightboxIndex(idx)}
              className="overflow-hidden w-full group relative cursor-zoom-in bg-[#080808] border border-[#111111]"
            >
              <div className="overflow-hidden w-full h-full text-left">
                {item.type === 'image' && (
                  <img
                    src={item.url}
                    alt=""
                    className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                )}

                {item.type === 'video' && (
                  <video
                    src={item.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}

                {item.type === 'gif' && (
                  <img
                    src={item.url}
                    alt=""
                    className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

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
