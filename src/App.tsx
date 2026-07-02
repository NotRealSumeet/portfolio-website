/* =========================================================
   Imports
========================================================= */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { PROJECTS_DATA } from './data';
import Sidebar from './components/Sidebar';
import MasonryGrid from './components/MasonryGrid';
import ProjectDetail from './components/ProjectDetail';
import AboutPage from './components/AboutPage';
import AmbientBackground from './components/AmbientBackground';
import BlackMarketPage from './components/BlackMarketPage';
import BlackMarketDetail from './components/BlackMarketDetail';
import { BLACK_MARKET_SERVICES } from './blackMarketData';
import { preloadProjectMedia } from './utils/preload';

/* =========================================================
   Component: PortfolioView
========================================================= */

function PortfolioView() {
  const { projectId, serviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Real-time UTC/IST clock ticker
  const [currentLocalTime, setCurrentLocalTime] = useState<Date>(new Date());

  // State for currency (USD vs INR)
  const [currency, setCurrency] = useState<'USD' | 'INR'>(() => {
    return (sessionStorage.getItem('currency') as 'USD' | 'INR') || 'USD';
  });

  const handleCurrencyChange = (newCurrency: 'USD' | 'INR') => {
    setCurrency(newCurrency);
    sessionStorage.setItem('currency', newCurrency);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLocalTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine active project id based on params and path
  let activeProjectId: string | null = null;
  if (location.pathname === '/about') {
    activeProjectId = 'about';
  } else if (location.pathname === '/black-market' || location.pathname.startsWith('/black-market/')) {
    activeProjectId = 'black-market';
  } else if (projectId) {
    activeProjectId = projectId;
  }

  const isBlackMarketIndex = location.pathname === '/black-market';
  const isBlackMarketDetail = !!serviceId && location.pathname.startsWith('/black-market/');
  const activeService = BLACK_MARKET_SERVICES.find((s) => s.id === serviceId) || null;

  // Retrieve active project details
  const activeProject = PROJECTS_DATA.find((p) => p.id === activeProjectId) || null;

  // Redirect to home if path doesn't match any project or page
  useEffect(() => {
    if (activeProjectId && activeProjectId !== 'about' && activeProjectId !== 'black-market' && !activeProject) {
      navigate('/', { replace: true });
    }
  }, [activeProjectId, activeProject, navigate]);

  // Redirect invalid service subpaths to main black market list
  useEffect(() => {
    if (isBlackMarketDetail && !activeService) {
      navigate('/black-market', { replace: true });
    }
  }, [isBlackMarketDetail, activeService, navigate]);

  // Handle page scrolling reset when navigating
  const selectProject = (id: string | null) => {
    if (id && id !== 'about' && id !== 'black-market') {
      const targetProj = PROJECTS_DATA.find((p) => p.id === id);
      if (targetProj) {
        preloadProjectMedia(targetProj);
      }
    }

    if (id === null) {
      navigate('/');
    } else if (id === 'about') {
      navigate('/about');
    } else if (id === 'black-market') {
      navigate('/black-market');
    } else {
      navigate(`/${id}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper selectors for Next/Prev buttons
  const selectNextProject = () => {
    if (!activeProjectId || activeProjectId === 'about') return;
    const currentIndex = PROJECTS_DATA.findIndex((p) => p.id === activeProjectId);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % PROJECTS_DATA.length;
    selectProject(PROJECTS_DATA[nextIndex].id);
  };

  const selectPrevProject = () => {
    if (!activeProjectId || activeProjectId === 'about') return;
    const currentIndex = PROJECTS_DATA.findIndex((p) => p.id === activeProjectId);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length;
    selectProject(PROJECTS_DATA[prevIndex].id);
  };

  return (
    <div id="portfolio-root" className="min-h-screen bg-black text-zinc-100 flex flex-col md:flex-row selection:bg-[#FF205A] selection:text-white antialiased">

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
            ) : isBlackMarketDetail && activeService ? (
              /* BLACK MARKET DETAIL VIEW */
              <motion.div
                key={`service-${activeService.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <BlackMarketDetail
                  service={activeService}
                  currency={currency}
                  onCurrencyChange={handleCurrencyChange}
                  onBack={() => selectProject('black-market')}
                />
              </motion.div>
            ) : isBlackMarketIndex ? (
              /* BLACK MARKET INDEX VIEW */
              <motion.div
                key="black-market-index"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <BlackMarketPage
                  currency={currency}
                  onCurrencyChange={handleCurrencyChange}
                  onSelectService={(id) => {
                    navigate(`/black-market/${id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
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
                  currentLocalTime={currentLocalTime}
                />
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* BOTTOM DECORATIVE STAMP: Minimal Evolving Design Archive Coming Soon */}
        {activeProjectId === null && (
          <div className="w-full max-w-7xl mx-auto border-t border-[#111111] mt-12 pt-10 pb-6 flex flex-col items-center justify-center text-center relative z-10">
            <div className="max-w-[440px] flex flex-col items-center select-none">
              {/* Quiet editorial divider label */}
              <div className="flex items-center gap-2.5 justify-center mb-3">
                <span className="h-[2px] w-5 bg-[#FF205A] shrink-0" />
                <span className="font-mono text-[11px] tracking-[0.15em] text-white/80 uppercase font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                  More Projects
                </span>
              </div>
              
              <h2 className="font-sans font-extrabold text-2xl sm:text-3xl tracking-tighter text-white uppercase hover:text-[#FF205A] transition-colors duration-700 mt-0">
                Coming Soon
              </h2>
              
              <p className="font-mono text-[10px] text-zinc-300 uppercase tracking-[0.15em] leading-relaxed mt-5 px-4">
                This visual journal is a constantly evolving chromatic file archive. Updates committed build-by-build.
              </p>
            </div>
          </div>
        )}

        {/* BACK TO TOP BUTTON: Centered inline in page flow */}
        {activeProjectId !== 'about' && (
          <div className="w-full max-w-7xl mx-auto mt-6 mb-4 flex justify-center items-center relative z-10">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group font-mono text-zinc-400 hover:text-[#FF205A] cursor-pointer flex flex-col items-center gap-1 transition-all duration-300 uppercase select-none hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(255,32,90,0.45)]"
            >
              <span className="text-2xl font-light leading-none transform group-hover:scale-110 transition-transform duration-300">↑</span>
              <span className="text-[10px] tracking-[0.3em] font-medium">Back to Top</span>
            </button>
          </div>
        )}

        {/* Graced portfolio closing gradient overlay */}
        {activeProjectId === null && (
          <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#FF205A]/[0.025] via-transparent to-transparent pointer-events-none z-0" />
        )}

      </main>

    </div>
  );
}

/* =========================================================
   Export
========================================================= */

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioView />} />
      <Route path="/projects" element={<PortfolioView />} />
      <Route path="/about" element={<PortfolioView />} />
      <Route path="/black-market" element={<PortfolioView />} />
      <Route path="/black-market/:serviceId" element={<PortfolioView />} />
      <Route path="/:projectId" element={<PortfolioView />} />
    </Routes>
  );
}
