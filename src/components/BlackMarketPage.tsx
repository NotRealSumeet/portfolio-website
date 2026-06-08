import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { BLACK_MARKET_SERVICES } from '../blackMarketData';
import CurrencyToggle from './CurrencyToggle';
import { formatPrice } from './PriceFormatter';

interface BlackMarketPageProps {
  currency: 'USD' | 'INR';
  onCurrencyChange: (currency: 'USD' | 'INR') => void;
  onSelectService: (id: string) => void;
}

export default function BlackMarketPage({
  currency,
  onCurrencyChange,
  onSelectService
}: BlackMarketPageProps) {
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  const handleScroll = () => {
    if (showSwipeHint) {
      setShowSwipeHint(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="space-y-16 pb-24"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-900 pb-10 pt-4">
        <div className="space-y-4 max-w-2xl">
          <span className="font-mono text-xs text-[#742DE1] uppercase tracking-[0.25em] block font-semibold">
            COMMISSION ARCHIVE
          </span>
          <h2 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase leading-none">
            BLACK MARKET
          </h2>
          <p className="font-sans text-base sm:text-lg text-zinc-400 tracking-tight leading-relaxed font-light">
            Underground creative contracts & visual commissions archive. Select a blueprint to inspect pricing, process guidelines, and terms.
          </p>
        </div>
        
        {/* Currency Switcher */}
        <div className="shrink-0 pb-1">
          <CurrencyToggle currency={currency} onChange={onCurrencyChange} />
        </div>
      </div>

      {/* PREMIUM CARDS GRID */}
      {/* 
        On mobile: Horizontal flexbox with CSS snap scrolling and scrollbar hidden.
        On tablet/desktop: Spaced, premium grid.
      */}
      <div className="relative">
        <AnimatePresence>
          {showSwipeHint && (
            <motion.div
              key="swipe-hint"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
              className="md:hidden absolute right-6 top-[45%] -translate-y-1/2 z-20 pointer-events-none"
            >
              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="bg-black/90 backdrop-blur-md border border-[#742DE1]/40 px-3.5 py-2 flex items-center gap-2 rounded-full shadow-[0_0_20px_rgba(116,45,225,0.25)]"
              >
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-300 font-medium">Swipe</span>
                <ArrowRight size={10} className="text-[#742DE1] animate-pulse" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div 
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-10 md:pb-0 px-4 md:px-0 -mx-4 md:mx-0 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}} />

        {BLACK_MARKET_SERVICES.map((service, index) => {
          const price = currency === 'USD' ? service.startingPriceUsd : service.startingPriceInr;
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onSelectService(service.id)}
              className="snap-center shrink-0 w-[88vw] sm:w-[350px] md:w-auto flex flex-col justify-between bg-gradient-to-b from-[#0a0a0f] to-[#040406] border border-zinc-900/60 hover:border-[#742DE1]/40 hover:shadow-[0_0_35px_rgba(116,45,225,0.15)] p-8 lg:p-10 rounded-2xl cursor-pointer transition-all duration-500 group relative overflow-hidden"
            >
              {/* Glossy top-right radial gradient glow bubble */}
              <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-[#742DE1]/10 blur-[50px] pointer-events-none group-hover:bg-[#742DE1]/20 transition-all duration-500" />
              
              {/* Glossy sweeping glare overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              
              <div className="space-y-8">
                {/* Service Title */}
                <div>
                  <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight leading-none group-hover:text-purple-400 transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  {/* Big bold Price display */}
                  <div className="mt-5">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">STARTING RATE</span>
                    <span className="block mt-1">
                      {formatPrice(price, true)}
                    </span>
                  </div>
                </div>

                <div className="h-[1px] bg-zinc-900/60 w-full" />

                {/* Short description */}
                <p className="font-sans text-sm text-zinc-400 leading-relaxed font-light line-clamp-3">
                  {service.description}
                </p>

                {/* Included features preview */}
                <div className="space-y-3 pt-1">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">INCLUSIONS</span>
                  <ul className="space-y-2.5">
                    {service.includes.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-zinc-300 font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#742DE1] shrink-0" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-10">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectService(service.id);
                  }}
                  className="w-full py-4 px-6 bg-zinc-950/80 border border-zinc-800/80 hover:border-purple-500/80 hover:shadow-[0_0_20px_rgba(116,45,225,0.25)] text-zinc-200 hover:text-white font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-lg relative overflow-hidden group/btn"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-out" />
                  View Details
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </motion.div>
  );
}
