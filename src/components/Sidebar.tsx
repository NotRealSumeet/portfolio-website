/* =========================================================
   Imports
========================================================= */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Menu, X, Mail, Globe, SlidersHorizontal } from 'lucide-react';
import { Project } from '../types';
import { preloadProjectMedia } from '../utils/preload';

/* =========================================================
   Types
========================================================= */

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

/* =========================================================
   Component
========================================================= */

export default function Sidebar({
  projects,
  activeProjectId,
  onSelectProject,
  categories,
  selectedCategory,
  onSelectCategory
}: SidebarProps) {
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [popoverCoords, setPopoverCoords] = useState<{ top: number; left: number } | null>(null);

  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Calculate popover position to the right of the sidebar in the gallery area
  useEffect(() => {
    if (!filterOpen) return;

    const updatePosition = () => {
      if (filterButtonRef.current) {
        const btnRect = filterButtonRef.current.getBoundingClientRect();
        const aside = filterButtonRef.current.closest('aside');
        const sidebarRight = aside ? aside.getBoundingClientRect().right : btnRect.right;
        setPopoverCoords({
          top: Math.max(12, btnRect.top),
          left: sidebarRight + 12
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [filterOpen]);

  // Close floating popover when clicking outside or pressing Escape
  useEffect(() => {
    if (!filterOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (filterButtonRef.current && filterButtonRef.current.contains(target)) {
        return;
      }
      if (popoverRef.current && !popoverRef.current.contains(target)) {
        setFilterOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFilterOpen(false);
        filterButtonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [filterOpen]);

  return (
    <>
      {/* MOBILE HEADER: Clean, compact editorial bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-black/95 backdrop-blur-md border-b-2 border-zinc-900 z-50 flex items-center justify-between px-5 select-none">
        <button
          onClick={() => {
            onSelectCategory('ALL');
            onSelectProject(null);
            setMobileMenuOpen(false);
          }}
          className="text-left cursor-pointer"
        >
          <span className="font-sans font-bold text-sm tracking-tight text-white uppercase hover:text-[#FF205A] transition-colors block">
            SUMIT SHAH
          </span>
          <span className="font-mono text-[9px] text-zinc-400 tracking-wider uppercase block">
            Graphic Designer
          </span>
        </button>
        
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white hover:text-zinc-400 p-2 cursor-pointer transition-colors flex items-center justify-center"
          style={{ minWidth: '40px', minHeight: '40px' }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* MOBILE DRAWER MENU: Simplified, structured navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden fixed top-14 left-0 right-0 bottom-0 bg-black/98 backdrop-blur-lg z-40 overflow-y-auto px-5 py-6 flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Category Filter on Mobile */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-zinc-400 tracking-wider">
                    Category Filter
                  </span>
                  {selectedCategory !== 'ALL' && (
                    <button
                      onClick={() => onSelectCategory('ALL')}
                      className="font-mono text-[9px] text-[#FF205A] hover:underline uppercase"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          onSelectCategory(cat);
                          if (activeProjectId !== null) {
                            onSelectProject(null);
                          }
                          setMobileMenuOpen(false);
                        }}
                        className={`font-mono text-[10px] uppercase px-2.5 py-1 rounded transition-colors ${
                          isSelected
                            ? 'bg-white text-black font-semibold'
                            : 'bg-zinc-900 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Projects List */}
              <div className="space-y-2 pt-2 border-t border-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
                    <span>QUEST LOG</span>
                    <span className="text-zinc-500">[{projects.length.toString().padStart(2, '0')}]</span>
                  </span>
                  <button
                    onClick={() => {
                      onSelectCategory('ALL');
                      onSelectProject(null);
                      setMobileMenuOpen(false);
                    }}
                    className={`font-mono text-[9px] uppercase transition-colors ${
                      activeProjectId === null ? 'text-[#FF205A]' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    All Works
                  </button>
                </div>
                
                <nav className="flex flex-col divide-y divide-zinc-900/60">
                  {projects.map((proj, idx) => {
                    const isActive = activeProjectId === proj.id;
                    return (
                      <button
                        key={proj.id}
                        onClick={() => {
                          onSelectProject(proj.id);
                          setMobileMenuOpen(false);
                        }}
                        onMouseEnter={() => preloadProjectMedia(proj)}
                        className={`w-full text-left font-sans text-sm font-semibold tracking-tight uppercase flex items-center justify-between py-2.5 transition-colors ${
                          isActive ? 'text-[#FF205A]' : 'text-zinc-400 active:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <span className="font-mono text-[9px] text-zinc-400 shrink-0">
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <span className="truncate">{proj.title}</span>
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400 ml-3 shrink-0">
                          {proj.year}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Secondary Navigation & Hierarchy */}
              <div className="pt-3 border-t-2 border-zinc-900 space-y-3">
                {/* PLAYER INFO on its own row */}
                <div>
                  <button
                    onClick={() => {
                      onSelectProject('about');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full py-2 px-3 font-mono text-xs uppercase tracking-wider text-left rounded border transition-colors flex items-center justify-between ${
                      activeProjectId === 'about'
                        ? 'bg-white text-black border-white font-semibold'
                        : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <span>Player Info</span>
                    <ArrowUpRight size={12} className={activeProjectId === 'about' ? 'text-black' : 'text-zinc-500'} />
                  </button>
                </div>

                {/* Full-width Divider */}
                <div className="h-[2px] bg-zinc-900 w-full" />

                {/* COMMISSIONS EMAIL INSTAGRAM */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px] uppercase tracking-wider">
                  <button
                    onClick={() => {
                      onSelectProject('black-market');
                      setMobileMenuOpen(false);
                    }}
                    className={`py-2 px-1 rounded border transition-colors truncate ${
                      activeProjectId === 'black-market'
                        ? 'bg-white text-black border-white font-semibold'
                        : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:text-white'
                    }`}
                  >
                    Commissions
                  </button>
                  <a
                    href="mailto:sumeetshah24@gmail.com"
                    className="py-2 px-1 bg-zinc-950 border border-zinc-800 rounded text-zinc-300 hover:text-white transition-colors truncate flex items-center justify-center"
                  >
                    Email
                  </a>
                  <a
                    href="https://www.instagram.com/sumeetism/"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-1 bg-zinc-950 border border-zinc-800 rounded text-zinc-300 hover:text-white transition-colors truncate flex items-center justify-center"
                  >
                    Instagram
                  </a>
                </div>

                {/* Full-width Divider */}
                <div className="h-[2px] bg-zinc-900 w-full" />

                {/* Clean location and copyright stamp */}
                <div className="text-center font-mono text-[9px] text-zinc-400 uppercase tracking-widest pt-1">
                  © 2026 · NAVI MUMBAI
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR: Editorial, Compact, Left-aligned */}
      <aside className="hidden md:flex flex-col justify-between w-[25%] lg:w-[20%] h-screen fixed top-0 left-0 bg-black border-r-2 border-zinc-900 z-30 p-6 lg:p-7 select-none overflow-y-auto">
        {/* TOP SECTION: Identity, Filter & Project List */}
        <div>
          {/* Identity Section */}
          <div className="mb-5">
            <button
              onClick={() => {
                onSelectCategory('ALL');
                onSelectProject(null);
              }}
              className="text-left group cursor-pointer block"
            >
              <h1 className="font-sans font-bold text-xl lg:text-2xl tracking-tight text-white uppercase group-hover:text-[#FF205A] transition-colors leading-tight">
                SUMIT SHAH
              </h1>
              <p className="font-mono text-[10px] text-zinc-400 mt-1 tracking-[0.2em] uppercase">
                Graphic Designer
              </p>
            </button>
          </div>

          <div className="h-[2px] bg-zinc-900 w-full mb-4" />

          {/* SECTION HEADING & FILTER ROW */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-mono text-[10px] uppercase text-zinc-400 tracking-wider shrink-0 font-medium">
                QUEST LOG
              </span>
              <span className="font-mono text-[10px] text-zinc-500 shrink-0 tabular-nums">
                [{projects.length.toString().padStart(2, '0')}]
              </span>
            </div>

            <button
              ref={filterButtonRef}
              onClick={() => setFilterOpen((prev) => !prev)}
              aria-haspopup="dialog"
              aria-expanded={filterOpen}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded font-mono text-[10px] uppercase tracking-wider transition-all border cursor-pointer shrink-0 ${
                selectedCategory !== 'ALL'
                  ? 'bg-zinc-900 border-[#FF205A]/40 text-white'
                  : 'bg-zinc-950 border-zinc-800/80 text-zinc-300 hover:text-white hover:border-zinc-700'
              }`}
            >
              <SlidersHorizontal size={11} className={selectedCategory !== 'ALL' ? 'text-[#FF205A]' : 'text-zinc-400'} />
              <span className="font-medium">Filter</span>
              {selectedCategory !== 'ALL' && (
                <span className="text-[9px] text-[#FF205A] max-w-[70px] truncate">
                  [{selectedCategory}]
                </span>
              )}
            </button>
          </div>

          {/* FLOATING POPOVER: Extends horizontally to the RIGHT into the gallery area */}
          <AnimatePresence>
            {filterOpen && popoverCoords && (
              <motion.div
                ref={popoverRef}
                initial={{ opacity: 0, x: -8, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -8, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  top: popoverCoords.top,
                  left: popoverCoords.left,
                  zIndex: 50
                }}
                className="w-56 bg-[#0c0c0e] border border-zinc-800 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.95)] p-2 backdrop-blur-md"
                role="dialog"
                aria-label="Category filter"
              >
                <div className="flex items-center justify-between pb-1.5 px-2 border-b-2 border-zinc-900 mb-1 select-none">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                    Category Filter
                  </span>
                  {selectedCategory !== 'ALL' && (
                    <button
                      onClick={() => {
                        onSelectCategory('ALL');
                        if (activeProjectId !== null) onSelectProject(null);
                        setFilterOpen(false);
                      }}
                      className="font-mono text-[9px] uppercase text-[#FF205A] hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-0.5">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          onSelectCategory(cat);
                          if (activeProjectId !== null) {
                            onSelectProject(null);
                          }
                          setFilterOpen(false);
                        }}
                        className={`w-full text-left font-mono text-[10px] uppercase tracking-wider py-1.5 px-2 rounded transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-800 text-white font-semibold'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF205A] shrink-0 ml-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PROJECTS NAVIGATION: Preserved project list */}
          <div>
            <nav className="flex flex-col space-y-0.5">
              {projects.map((proj, idx) => {
                const isActive = activeProjectId === proj.id;
                const isHovered = hoveredProjectId === proj.id;
                const isMatch = selectedCategory === 'ALL' || proj.category.toUpperCase() === selectedCategory;

                return (
                  <div
                    key={proj.id}
                    onMouseEnter={() => {
                      setHoveredProjectId(proj.id);
                      preloadProjectMedia(proj);
                    }}
                    onMouseLeave={() => setHoveredProjectId(null)}
                    className="relative flex items-center"
                  >
                    {/* Tooltip thumbnail placed safely in main canvas margin to prevent clipping */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, x: -6, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -6, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-full ml-3 top-1/2 -translate-y-1/2 w-16 h-16 bg-zinc-950 border border-zinc-800 overflow-hidden pointer-events-none rounded shadow-2xl hidden xl:block z-50"
                        >
                          <img
                            src={proj.thumbnailUrl}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={() => onSelectProject(proj.id)}
                      className={`group w-full text-left font-sans text-xs font-semibold tracking-tight uppercase py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                        isActive
                          ? 'bg-zinc-900 text-[#FF205A]'
                          : isMatch
                          ? 'text-zinc-400 hover:text-white hover:bg-zinc-950'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[9px] text-zinc-400 group-hover:text-zinc-300 shrink-0">
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="truncate leading-tight">{proj.title}</span>
                      </span>

                      {/* Accent marker for active status */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="w-[5px] h-[5px] bg-[#FF205A] rounded-full ml-1.5 shrink-0"
                        />
                      )}
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* BOTTOM SECTION: Reorganized Secondary Navigation & Contact */}
        <div className="pt-4 border-t-2 border-zinc-900 mt-4 space-y-3">
          {/* PLAYER INFO on its own row */}
          <div>
            <button
              onClick={() => onSelectProject('about')}
              className={`w-full text-left font-mono text-[11px] uppercase tracking-wider py-1.5 px-2 rounded transition-colors flex items-center justify-between cursor-pointer ${
                activeProjectId === 'about'
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-950'
              }`}
            >
              <span>Player Info</span>
              <ArrowUpRight size={11} className="text-zinc-500" />
            </button>
          </div>

          {/* Full-width Divider */}
          <div className="h-[2px] bg-zinc-900 w-full" />

          {/* COMMISSIONS     EMAIL     INSTAGRAM */}
          <div className="flex items-center justify-between gap-1 px-1 font-mono text-[10px] uppercase tracking-wider">
            <button
              onClick={() => onSelectProject('black-market')}
              className={`hover:text-white transition-colors cursor-pointer truncate ${
                activeProjectId === 'black-market' ? 'text-white font-medium' : 'text-zinc-400'
              }`}
            >
              Commissions
            </button>
            <span className="text-zinc-700 text-[9px] select-none">·</span>
            <a
              href="mailto:sumeetshah24@gmail.com"
              className="text-zinc-400 hover:text-white transition-colors truncate"
            >
              Email
            </a>
            <span className="text-zinc-700 text-[9px] select-none">·</span>
            <a
              href="https://www.instagram.com/sumeetism/"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-white transition-colors truncate"
            >
              Instagram
            </a>
          </div>

          {/* Full-width Divider */}
          <div className="h-[2px] bg-zinc-900 w-full" />

          {/* Copyright location line */}
          <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest px-1">
            © 2026 · NAVI MUMBAI
          </div>
        </div>
      </aside>
    </>
  );
}
