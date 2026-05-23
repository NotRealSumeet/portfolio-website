/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS_DATA } from './data';
import Sidebar from './components/Sidebar';
import MasonryGrid from './components/MasonryGrid';
import ProjectDetail from './components/ProjectDetail';
import AboutPage from './components/AboutPage';
import AmbientBackground from './components/AmbientBackground';

export default function App() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  
  // Real-time UTC/IST clock ticker
  const [currentLocalTime, setCurrentLocalTime] = useState<string>('2026-05-22T12:08:52Z');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLocalTime((prev) => {
        const d = new Date(prev);
        d.setSeconds(d.getSeconds() + 1);
        return d.toISOString();
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Retrieve active project details
  const activeProject = PROJECTS_DATA.find((p) => p.id === activeProjectId) || null;

  // Handle page scrolling reset when navigating
  const selectProject = (id: string | null) => {
    setActiveProjectId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper selectors for Next/Prev buttons
  const selectNextProject = () => {
    if (!activeProjectId || activeProjectId === 'about') return;
    const currentIndex = PROJECTS_DATA.findIndex((p) => p.id === activeProjectId);
    const nextIndex = (currentIndex + 1) % PROJECTS_DATA.length;
    selectProject(PROJECTS_DATA[nextIndex].id);
  };

  const selectPrevProject = () => {
    if (!activeProjectId || activeProjectId === 'about') return;
    const currentIndex = PROJECTS_DATA.findIndex((p) => p.id === activeProjectId);
    const prevIndex = (currentIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length;
    selectProject(PROJECTS_DATA[prevIndex].id);
  };

  return (
    <div id="portfolio-root" className="min-h-screen bg-black text-zinc-100 flex flex-col md:flex-row selection:bg-[#742DE1] selection:text-white antialiased">
      
      {/* LEFT COLUMN: Fixed Sticky Sidebar */}
      <Sidebar
        projects={PROJECTS_DATA}
        activeProjectId={activeProjectId}
        onSelectProject={selectProject}
        currentLocalTime={currentLocalTime}
      />

      {/* RIGHT COLUMN: Asymmetric Responsive Page Content */}
      <main className="relative z-10 overflow-hidden w-full md:ml-[25%] lg:ml-[20%] md:w-[75%] lg:w-[80%] min-h-screen pt-20 md:pt-10 pb-20 px-6 sm:px-8 lg:px-12 xl:px-16 flex flex-col justify-between">
        
        {/* Animated Cinematic Ambient Background Background ONLY behind projects */}
        <AmbientBackground />

        {/* UPPER ANCHOR: Interactive Container */}
        <div className="w-full max-w-7xl mx-auto space-y-10 relative z-10">
          
          <AnimatePresence mode="wait">
            {activeProjectId === 'about' ? (
              /* ABOUT PROFILE VIEW */
              <motion.div
                key="about-page-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <AboutPage onBack={() => selectProject(null)} />
              </motion.div>
            ) : activeProject ? (
              /* DETAILED STATE VIEW */
              <motion.div
                key={`project-${activeProject.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectDetail
                   project={activeProject}
                   onBack={() => selectProject(null)}
                   onNextProject={selectNextProject}
                   onPrevProject={selectPrevProject}
                />
              </motion.div>
            ) : (
              /* GRID OVERVIEW INDEX STATE */
              <motion.div
                key="projects-index"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <MasonryGrid
                  projects={PROJECTS_DATA}
                  onSelectProject={(id) => selectProject(id)}
                />
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* BOTTOM DECORATIVE STAMP: Minimal Evolving Design Archive Coming Soon */}
        <div className="w-full max-w-7xl mx-auto border-t border-[#111111] mt-32 pt-20 pb-10 flex flex-col items-center justify-center text-center relative z-10">
          <div className="space-y-3 max-w-md">
            <span className="font-mono text-[9px] tracking-[0.35em] text-zinc-600 block uppercase select-none">
              — More Projects
            </span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tighter text-zinc-800 select-none uppercase hover:text-white transition-colors duration-700">
              Coming Soon
            </h2>
            <div className="h-[1px] w-8 bg-zinc-900 mx-auto my-4" />
            <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest max-w-xs mx-auto leading-relaxed select-none">
              This visual journal is a constantly evolving chromatic file archive. Updates committed build-by-build.
            </p>
          </div>
        </div>

      </main>

    </div>
  );
}
