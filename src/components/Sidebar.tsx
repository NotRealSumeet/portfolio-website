/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Menu, X, Mail, Globe, Clock } from 'lucide-react';
import { Project } from '../types';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  currentLocalTime: Date;
}

export default function Sidebar({
  projects,
  activeProjectId,
  onSelectProject,
  currentLocalTime
}: SidebarProps) {
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Preload project thumbnails on mount to avoid hover preview lag
  useEffect(() => {
    projects.forEach((proj) => {
      if (proj.thumbnailUrl) {
        const img = new Image();
        img.src = proj.thumbnailUrl;
      }
    });
  }, [projects]);

  // Format as Indian Standard Time (Asia/Kolkata timezone)
  const formattedTime = currentLocalTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });

  return (
    <>
      {/* MOBILE HEADER: Minimal, modern, and aligned with Swiss grid principles */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-md border-b border-[#111111] z-50 flex items-center justify-between px-6 select-none">
        <button
          onClick={() => {
            onSelectProject(null);
            setMobileMenuOpen(false);
          }}
          className="font-neue font-bold text-base tracking-tight text-white hover:text-[#742DE1] active:opacity-75 transition-all uppercase"
        >
          SUMIT SHAH
        </button>
        
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white hover:text-zinc-400 p-2 cursor-pointer transition-colors flex items-center justify-center"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* MOBILE DRAWER MENU: Cinematic slide-in with rich backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0.95 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.95 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-black/98 backdrop-blur-lg z-40 overflow-y-auto px-6 py-8 flex flex-col justify-between"
          >
            <div className="space-y-8">
              {/* Category label */}
              <div>
                <span className="font-mono text-[9px] uppercase text-[#555555] tracking-[0.25em] block mb-2 select-none">
                  QUEST LOG INDEX
                </span>
                
                <nav className="flex flex-col">
                  {/* Show all / reset trigger */}
                  <button
                    onClick={() => {
                      onSelectProject(null);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left font-sans text-lg font-bold tracking-tight uppercase py-4 border-b border-[#111111] flex items-center justify-between transition-colors ${
                      activeProjectId === null ? 'text-[#742DE1]' : 'text-[#666666] active:text-white'
                    }`}
                    style={{ minHeight: '48px' }}
                  >
                    <span>— SHOW ALL CATALOG</span>
                    <span className="text-[10px] font-mono text-[#444444]">INDEX</span>
                  </button>

                  {/* Projects List with seamless mobile design */}
                  {projects.map((proj, idx) => {
                    const isActive = activeProjectId === proj.id;
                    return (
                      <button
                        key={proj.id}
                        onClick={() => {
                          onSelectProject(proj.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left font-sans text-lg font-bold tracking-tight uppercase flex items-start justify-between py-4 border-b border-[#111111] transition-colors ${
                          isActive ? 'text-[#742DE1]' : 'text-[#666666] active:text-white'
                        }`}
                        style={{ minHeight: '48px' }}
                      >
                        <span className="flex items-start gap-3 min-w-0">
                          <span className="font-mono text-[10px] text-[#444444] mt-[5px] shrink-0">
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <span className="whitespace-normal break-words text-balance leading-tight">{proj.title}</span>
                        </span>
                        <span className="text-[10px] font-mono text-[#555555] mt-[5px] shrink-0 ml-4">
                          {proj.year}
                        </span>
                      </button>
                    );
                  })}

                  {/* Black Market Page trigger */}
                  <button
                    onClick={() => {
                      onSelectProject('black-market');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left font-sans text-lg font-bold tracking-tight uppercase flex items-center justify-between py-4 border-b border-[#111111] transition-colors ${
                      activeProjectId === 'black-market' ? 'text-[#742DE1]' : 'text-[#666666] active:text-white'
                    }`}
                    style={{ minHeight: '48px' }}
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-[#444444]">
                        —
                      </span>
                      <span>BLACK MARKET</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#555555]">
                      MARKET
                    </span>
                  </button>

                  {/* Integrated About Page trigger as part of the primary menu list */}
                  <button
                    onClick={() => {
                      onSelectProject('about');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left font-sans text-lg font-bold tracking-tight uppercase flex items-center justify-between py-4 border-b border-[#111111] transition-colors ${
                      activeProjectId === 'about' ? 'text-[#742DE1]' : 'text-[#666666] active:text-white'
                    }`}
                    style={{ minHeight: '48px' }}
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-[#444444]">
                        —
                      </span>
                      <span>PLAYER INFO</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#555555]">
                      INFO
                    </span>
                  </button>
                </nav>
              </div>

              {/* Connected Links grid for easy mobile activation */}
              <div className="space-y-3">
                <span className="font-mono text-[9px] uppercase text-[#555555] tracking-[0.25em] block select-none">
                  COMMUNICATION CHANNELS
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="mailto:sumeetshah24@gmail.com"
                    className="flex items-center justify-center text-center py-3.5 bg-[#050505] border border-[#111111] font-mono text-xs text-zinc-400 active:text-white active:bg-zinc-950 hover:text-white transition-all select-none"
                    style={{ minHeight: '44px' }}
                  >
                    <Mail size={12} className="mr-2" /> EMAIL DIRECT
                  </a>
                  <a
                    href="https://www.instagram.com/sumeetism/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center text-center py-3.5 bg-[#050505] border border-[#111111] font-mono text-xs text-zinc-400 active:text-white active:bg-zinc-950 hover:text-white transition-all select-none flex-nowrap"
                    style={{ minHeight: '44px' }}
                  >
                    <Globe size={12} className="mr-2" /> @SUMEETISM
                  </a>
                </div>
              </div>
            </div>

            {/* Micro branding stamp and time */}
            <div className="mt-12 border-t border-[#111111] pt-6 flex flex-col sm:flex-row gap-2 justify-between items-center font-mono text-[9px] text-[#444444] select-none uppercase">
              <span>CREATED IN NAVI MUMBAI</span>
              <span className="flex items-center gap-1.5">
                <Clock size={10} /> INDIAN TIME {formattedTime}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR: Sticky, Left aligned */}
      <aside className="hidden md:flex flex-col justify-between w-[25%] lg:w-[20%] h-screen fixed top-0 left-0 bg-black border-r border-[#1a1a1a] z-30 p-8 pt-10 select-none">
        {/* TOP SECTION: Logo & Role */}
        <div className="space-y-6">
          <div>
            <button
              onClick={() => onSelectProject(null)}
              className="group text-left block cursor-pointer"
            >
              <h1 className="font-neue font-bold text-3xl lg:text-4xl tracking-tighter text-white uppercase leading-none transition-colors group-hover:text-[#742DE1]">
                SUMIT<br/>SHAH
              </h1>
              <p className="font-mono text-[10px] text-[#666666] mt-2 tracking-[0.2em] uppercase group-hover:text-white transition-colors">
                Graphic Designer
              </p>
            </button>
          </div>

          <div className="h-[1px] bg-[#1a1a1a] w-full" />

          {/* MID SECTION: Interactive Project Lists with nested previews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] uppercase text-[#666666] tracking-wider">
                QUEST LOG
              </span>
              <button
                onClick={() => onSelectProject(null)}
                className={`font-mono text-[9px] hover:underline uppercase transition-colors ${
                  activeProjectId === null ? 'text-white' : 'text-[#666666] hover:text-white'
                }`}
              >
                [ RESET ALL ]
              </button>
            </div>

            <nav className="flex flex-col space-y-[4px]">
              {projects.map((proj, idx) => {
                const isActive = activeProjectId === proj.id;
                const isHovered = hoveredProjectId === proj.id;

                return (
                  <div
                    key={proj.id}
                    onMouseEnter={() => setHoveredProjectId(proj.id)}
                    onMouseLeave={() => setHoveredProjectId(null)}
                    className="relative flex items-center"
                  >
                    {/* Thumbnail preview beside the title (sliding & scale effect) */}
                    <AnimatePresence>
                      {(isHovered || isActive) && (
                        <motion.div
                          initial={{ opacity: 0, x: -10, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -10, scale: 0.8 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="absolute -left-12 lg:-left-16 w-10 h-10 lg:w-12 lg:h-12 border border-[#1a1a1a] bg-[#0d0d0d] overflow-hidden pointer-events-none rounded-none hidden xl:block"
                        >
                          <img
                            src={proj.thumbnailUrl}
                            alt=""
                            className="w-full h-full object-cover scale-105 active:scale-110"
                            referrerPolicy="no-referrer"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Left padding offset for thumbnails on desktop */}
                    <button
                      onClick={() => onSelectProject(proj.id)}
                      className={`group w-full text-left font-sans text-sm xl:text-base font-bold tracking-tight uppercase py-2 flex items-start justify-between transition-all duration-300 relative ${
                        isActive
                          ? 'text-[#742DE1] pl-0 xl:pl-2'
                          : 'text-[#666666] hover:text-[#742DE1] hover:pl-2'
                      }`}
                    >
                      <span className="flex items-start gap-2 min-w-0">
                        <span className="font-mono text-[10px] text-[#444444] group-hover:text-[#666666] transition-colors mt-[3px] xl:mt-[4px] shrink-0">
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="whitespace-normal break-words text-balance leading-tight">{proj.title}</span>
                      </span>

                      {/* Accent marker for active status */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="w-[5px] h-[5px] bg-[#742DE1] rounded-full ml-2 mt-[6px] xl:mt-[8px] shrink-0"
                        />
                      )}
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* BOTTOM SECTION: Switzerland clock, bio and email */}
        <div className="space-y-6">
          <div className="h-[1px] bg-[#1a1a1a] w-full" />
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <button
                  onClick={() => onSelectProject('black-market')}
                  className={`w-full py-2.5 px-4 font-mono text-[10px] uppercase tracking-widest text-center border cursor-pointer transition-all ${
                    activeProjectId === 'black-market'
                      ? 'bg-white text-black border-white'
                      : 'bg-black text-[#666666] border-[#1a1a1a] hover:border-white hover:text-[#742DE1] hover:bg-[#070707]'
                  }`}
                >
                  [ BLACK MARKET ]
                </button>
              </div>

              <div>
                <button
                  onClick={() => onSelectProject('about')}
                  className={`w-full py-2.5 px-4 font-mono text-[10px] uppercase tracking-widest text-center border cursor-pointer transition-all ${
                    activeProjectId === 'about'
                      ? 'bg-white text-black border-white'
                      : 'bg-black text-[#666666] border-[#1a1a1a] hover:border-white hover:text-[#742DE1] hover:bg-[#070707]'
                  }`}
                >
                  [ PLAYER INFO ]
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <a
                href="mailto:sumeetshah24@gmail.com"
                className="group flex items-center justify-between font-mono text-[10px] text-[#666666] hover:text-white transition-colors py-1"
              >
                <span className="flex items-center gap-1.5">
                  <Mail size={10} /> sumeetshah24@gmail.com
                </span>
                <ArrowUpRight size={10} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>

              <a
                href="https://www.instagram.com/sumeetism/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between font-mono text-[10px] text-[#666666] hover:text-white transition-colors py-1"
              >
                <span className="flex items-center gap-1.5">
                  <Globe size={10} /> INSTAGRAM
                </span>
                <ArrowUpRight size={10} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            </div>
          </div>

          {/* Absolute time track and branding stamp */}
          <div className="flex items-center justify-between font-mono text-[9px] text-[#444444]">
            <span>© 2026 // NAVI MUMBAI</span>
            <span className="flex items-center gap-1 text-[9px] uppercase tabular-nums">
              <Clock size={9} /> Indian Time {formattedTime}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
