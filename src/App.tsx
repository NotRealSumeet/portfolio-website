/* =========================================================
   Imports
========================================================= */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS_DATA } from './data';
import Sidebar from './components/Sidebar';
import MasonryGrid from './components/MasonryGrid';
import ProjectDetail from './components/ProjectDetail';
import AboutPage from './components/AboutPage';
import AmbientBackground from './components/AmbientBackground';
import BlackMarketPage from './components/BlackMarketPage';
import BlackMarketDetail from './components/BlackMarketDetail';
import FooterDitherBackground from './components/FooterDitherBackground';
import FooterTicker from './components/FooterTicker';
import { BLACK_MARKET_SERVICES } from './blackMarketData';
import { preloadProjectMedia } from './utils/preload';

/* =========================================================
   Component: PortfolioView
========================================================= */

function PortfolioView() {
  const { projectId, serviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // State for currency (USD vs INR)
  const [currency, setCurrency] = useState<'USD' | 'INR'>(() => {
    return (sessionStorage.getItem('currency') as 'USD' | 'INR') || 'USD';
  });

  const handleCurrencyChange = (newCurrency: 'USD' | 'INR') => {
    setCurrency(newCurrency);
    sessionStorage.setItem('currency', newCurrency);
  };

  // Category filter state for gallery and sidebar
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = useMemo(
    () => ['ALL', ...Array.from(new Set(PROJECTS_DATA.map((p) => p.category.toUpperCase())))],
    []
  );

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
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* RIGHT COLUMN: Asymmetric Responsive Page Content with Disciplined Spacing */}
      <main className="relative z-10 overflow-x-hidden w-full md:ml-[25%] lg:ml-[20%] md:w-[75%] lg:w-[80%] min-h-screen pt-16 md:pt-8 flex flex-col justify-between">

        {/* Animated Cinematic Ambient Background Background ONLY behind projects */}
        {activeProjectId !== 'about' && <AmbientBackground />}

        {/* UPPER ANCHOR: Interactive Container */}
        <div className="w-full max-w-7xl mx-auto space-y-6 relative z-10 px-4 sm:px-6 lg:px-8 xl:px-10 flex-1 pb-16 sm:pb-20">

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
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* HOMEPAGE FOOTER: Full-bleed Editorial Closing Section */}
        {activeProjectId === null && (
          <footer className="w-full border-t-2 border-zinc-900 bg-black relative z-10 select-none overflow-hidden">
            {/* Interactive Monochrome Dither Background */}
            <FooterDitherBackground />

            {/* Main Editorial Content Row: Subtly narrowed and centered within available content area */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8 lg:gap-12">
              {/* Left Column: Heading and Supporting Copy */}
              <div className="max-w-xl">
                <h2 className="font-sans font-bold text-2xl sm:text-3xl lg:text-[32px] tracking-tight text-white uppercase leading-[1.15]">
                  GOT AN <span className="text-[#FF205A]">IDEA</span>?<br className="hidden sm:inline" /> LET&apos;S PUT IT ON DISPLAY.
                </h2>
                <p className="font-sans text-sm sm:text-base text-zinc-400 font-normal tracking-wide mt-3">
                  Let&apos;s turn your idea into something worth showing off.
                </p>
              </div>

              {/* Right Column: CTA Action */}
              <div className="shrink-0">
                <a
                  href="mailto:sumeetshah24@gmail.com"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#FF205A] hover:bg-[#e0164b] text-white font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>GET IN TOUCH</span>
                  <ArrowUpRight size={15} className="text-white shrink-0" />
                </a>
              </div>
            </div>

            {/* Bottom Moving Text Ticker */}
            <FooterTicker />
          </footer>
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
