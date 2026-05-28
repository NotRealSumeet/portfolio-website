import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

interface MasonryGridProps {
  projects: Project[];
  onSelectProject: (id: string) => void;
}

export default function MasonryGrid({ projects, onSelectProject }: MasonryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Extract all unique categories
  const categories = ['ALL', ...Array.from(new Set(projects.map((p) => p.category.toUpperCase())))];

  // Filter projects based on choice
  const filteredProjects = selectedCategory === 'ALL'
    ? projects
    : projects.filter((p) => p.category.toUpperCase() === selectedCategory);

  return (
    <div className="space-y-12">
      {/* FILTER BUTTONS: Swiss Minimal Tab/Button system */}
      <div className="border-b border-[#1a1a1a] pb-6 flex flex-wrap gap-x-6 gap-y-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-mono text-xs uppercase cursor-pointer py-1 px-3 border border-transparent hover:border-[#333] transition-all ${
                  isSelected
                    ? 'bg-white text-black font-semibold'
                    : 'text-[#666666] hover:text-white'
                }`}
              >
                [ {cat} ]
              </button>
            );
          })}
        </div>
      </div>

      {/* RHYTHMIC ASYMMETRIC GRID: Curated Editorial CSS Grid System */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 lg:gap-x-8 lg:gap-y-16 items-start">
        {filteredProjects.map((proj, idx) => (
          <motion.div
            layout
            key={proj.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            onClick={() => onSelectProject(proj.id)}
            className="group cursor-pointer flex flex-col w-full"
          >
            {/* Image Frame with different aspect ratios for rhythm */}
            <div className={`cinematic-container bg-[#0d0d0d] border border-[#1a1a1a] relative w-full ${proj.aspectRatio}`}>
              <motion.img
                src={proj.thumbnailUrl}
                alt={proj.title}
                className="cinematic-image"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              
              {/* Modern Editorial Hover Overlay: Title and [Category] at top-left */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                <div className="space-y-1.5 text-left">
                  <h4 className="font-sans font-bold text-white text-base lg:text-lg tracking-tight uppercase leading-none">
                    {proj.title}
                  </h4>
                  <span className="font-mono text-[9px] text-[#742DE1] uppercase tracking-widest block">
                    [{proj.category}]
                  </span>
                </div>
                
                <div className="mt-auto self-end">
                  <span className="font-mono text-[9px] text-white/50 border border-white/20 px-2 py-0.5 bg-black/60 flex items-center gap-1.5">
                    VIEW RECORD <ArrowUpRight size={10} className="text-[#742DE1]" />
                  </span>
                </div>
              </div>

              {/* Index badge and stamp inside bottom right corner */}
              <div className="absolute bottom-3 left-3 bg-black/80 border border-[#1a1a1a] text-white font-mono text-[8px] px-2 py-0.5 select-none">
                [ {(idx + 1).toString().padStart(2, '0')} // {proj.category} ]
              </div>
            </div>

            {/* Title Block: Stark Swiss Typesetting */}
            <div className="mt-3.5 flex items-start justify-between">
              <div>
                <h3 className="font-sans font-bold text-sm lg:text-base tracking-tight text-white group-hover:text-[#742DE1] transition-colors uppercase leading-tight">
                  {proj.title}
                </h3>
                <p className="font-mono text-[#666666] text-[9px] mt-0.5 tracking-tight">
                  {proj.subtitle}
                </p>
              </div>
              
              <div className="text-right">
                <span className="font-mono text-[9px] text-zinc-400 bg-[#0d0d0d] border border-[#1a1a1a] px-1.5 py-0.5 rounded-none block">
                  {proj.year}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State warning for extreme filters */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-20 border border-[#1a1a1a]">
          <p className="font-mono text-xs text-[#666666] uppercase tracking-widest">
            NO RECORDS CLASSIFIED UNDER THIS TYPE
          </p>
        </div>
      )}
    </div>
  );
}


