/* =========================================================
   Imports
========================================================= */

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { preloadProjectMedia } from '../utils/preload';

/* =========================================================
   Types
========================================================= */

interface MasonryGridProps {
  projects: Project[];
  onSelectProject: (id: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

/* =========================================================
   Component
========================================================= */

export default function MasonryGrid({
  projects,
  onSelectProject,
  selectedCategory = 'ALL',
  onSelectCategory
}: MasonryGridProps) {
  // Filter projects based on selected category (memoized)
  const filteredProjects = useMemo(
    () => selectedCategory === 'ALL'
      ? projects
      : projects.filter((p) => p.category.toUpperCase() === selectedCategory),
    [projects, selectedCategory]
  );

  return (
    <div className="space-y-5">
      {/* Category active indicator (shown only when a filter is active) */}
      {selectedCategory !== 'ALL' && (
        <div className="flex items-center justify-between pb-3 border-b-2 border-zinc-900 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Filter:</span>
            <span className="text-white uppercase font-medium">{selectedCategory}</span>
            <span className="text-zinc-500 text-[10px]">({filteredProjects.length})</span>
          </div>
          {onSelectCategory && (
            <button
              onClick={() => onSelectCategory('ALL')}
              className="text-zinc-500 hover:text-[#FF205A] text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
            >
              [ Show All ]
            </button>
          )}
        </div>
      )}

      {/* RHYTHMIC ASYMMETRIC GRID: Curated Editorial CSS Grid System with Disciplined Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8 sm:gap-x-7 sm:gap-y-10 lg:gap-x-8 lg:gap-y-12 xl:gap-x-10 xl:gap-y-14 items-start">
        {filteredProjects.map((proj, idx) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: idx * 0.04 }}
            onClick={() => onSelectProject(proj.id)}
            onMouseEnter={() => preloadProjectMedia(proj)}
            className="group cursor-pointer flex flex-col w-full"
          >
            {/* Image Frame with different aspect ratios for rhythm */}
            <div className={`cinematic-container bg-[#0d0d0d] border border-[#1a1a1a] relative w-full ${proj.aspectRatio}`}>
              <motion.img
                src={proj.thumbnailUrl}
                alt={proj.title}
                className="cinematic-image"
                referrerPolicy="no-referrer"
                loading={idx < 2 ? "eager" : "lazy"}
                decoding={idx < 2 ? "sync" : "async"}
                {...({ fetchPriority: idx < 2 ? "high" : undefined } as any)}
              />
              
              {/* Modern Editorial Hover Overlay: Title and [Category] at top-left */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-start p-5">
                <div className="space-y-1.5 text-left">
                  <h4 className="font-sans font-bold text-white text-base lg:text-lg tracking-tight uppercase leading-none">
                    {proj.title}
                  </h4>
                  <span className="font-mono text-[12px] font-semibold text-[#FF6B8A] uppercase tracking-wider block opacity-0 translate-y-1.5 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0 delay-75">
                    [{proj.category}]
                  </span>
                </div>
              </div>
            </div>

            {/* Title Block: Stark Swiss Typesetting */}
            <div className="mt-2.5">
              <h3 className="font-sans font-bold text-sm lg:text-base tracking-tight text-white group-hover:text-[#FF205A] transition-colors uppercase leading-tight">
                {proj.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State warning for extreme filters */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16 border border-zinc-900 rounded">
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-3">
            No projects classified under {selectedCategory}
          </p>
          {onSelectCategory && (
            <button
              onClick={() => onSelectCategory('ALL')}
              className="font-mono text-xs text-[#FF205A] hover:underline uppercase tracking-wider cursor-pointer"
            >
              [ Reset Filter ]
            </button>
          )}
        </div>
      )}
    </div>
  );
}
