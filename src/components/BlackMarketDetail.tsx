/* =========================================================
   Imports
========================================================= */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { BlackMarketService } from '../blackMarketData';
import CurrencyToggle from './CurrencyToggle';
import { formatPrice } from './PriceFormatter';

/* =========================================================
   Types
========================================================= */

interface BlackMarketDetailProps {
  service: BlackMarketService;
  currency: 'USD' | 'INR';
  onCurrencyChange: (currency: 'USD' | 'INR') => void;
  onBack: () => void;
}

/* =========================================================
   Component
========================================================= */

export default function BlackMarketDetail({
  service,
  currency,
  onCurrencyChange,
  onBack
}: BlackMarketDetailProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const startingPrice = currency === 'USD' ? service.startingPriceUsd : service.startingPriceInr;
  const portfolioEmail = "sumeetshah24@gmail.com";
  
  // Custom pre-filled mailto link
  const mailtoSubject = encodeURIComponent(`Contract Inquiry: Black Market - ${service.title}`);
  const mailtoBody = encodeURIComponent(`Hi Sumit,\n\nI am looking to commission a contract for "${service.title}".\n\nSelected Currency: ${currency}\nStarting Price: ${startingPrice}\n\nLet's coordinate on creative details.`);
  const mailtoUrl = `mailto:${portfolioEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

  const toggleFaq = (idx: number) => setOpenFaq(openFaq === idx ? null : idx);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="space-y-11 pb-24 relative"
    >
      {/* Ambient background glows */}
      <div className="bm-ambient-glow w-96 h-96 bg-[#FF205A]/[0.02] top-20 right-10" />
      <div className="bm-ambient-glow w-80 h-80 bg-[#2b8252]/[0.015] bottom-40 left-10" />

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 border-b border-zinc-900 pb-6 sm:pb-8 pt-4 relative z-10">
        <button
          onClick={onBack}
          className="group flex items-center gap-3 font-mono text-xs text-[#666666] hover:text-[#FF205A] transition-colors cursor-pointer py-1 self-start"
          style={{ minHeight: '44px' }}
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1.5 transition-transform text-[#FF205A]" />
          <span>[ RETURN TO BLACK MARKET ]</span>
        </button>

        <div className="self-start sm:self-auto">
          <CurrencyToggle currency={currency} onChange={onCurrencyChange} />
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="space-y-6 max-w-4xl relative z-10">
        <div className="space-y-3">
          <span className="font-mono text-xs text-[#FF205A] uppercase tracking-[0.25em] block font-semibold">
            SERVICE ARCHIVE
          </span>
          <h2 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase leading-none">
            {service.title}
          </h2>
          <div className="flex items-baseline gap-2.5 mt-4">
            <span className="text-zinc-500 text-sm font-sans font-light mr-1">Starting rate</span>
            <span className="block mt-1">
              {formatPrice(startingPrice, true)}
            </span>
          </div>
        </div>

        <p className="font-sans text-lg sm:text-xl text-zinc-300 leading-relaxed font-light">
          {service.description}
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/40 to-transparent relative z-10" />

      {/* ── INCLUDES ── */}
      <div className="bm-card p-8 sm:p-10 relative z-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF205A]/[0.015] blur-2xl pointer-events-none" />
        <h3 className="font-sans font-bold text-lg sm:text-xl text-zinc-400 uppercase tracking-wider mb-8">
          Includes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">
          {service.includes.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF205A] mt-2.5 shrink-0" />
              <span className="text-[17px] text-zinc-100 font-normal leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── AVAILABLE ADD-ONS ── */}
      <div className="bm-card p-8 sm:p-10 relative z-10">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#2b8252]/[0.01] blur-2xl pointer-events-none" />
        <h3 className="font-sans font-bold text-lg sm:text-xl text-zinc-400 uppercase tracking-wider mb-8">
          Available Add-Ons
        </h3>
        <div className="divide-y divide-zinc-900/60">
          {service.addOns.map((addon, idx) => {
            const price = currency === 'USD' ? addon.usd : addon.inr;
            return (
              <div key={idx} className="bm-addon-row flex items-center justify-between py-4.5 px-4 -mx-2">
                <span className="text-zinc-100 text-base sm:text-[18px] font-normal flex items-center gap-3">
                  <span className="text-[#FF205A]/60 text-lg font-light select-none">+</span>
                  {addon.name}
                </span>
                <span className="font-sans font-semibold text-base sm:text-[18px] text-white tabular-nums">
                  {formatPrice(price)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MY PROCESS & FAQ (Double-column Grid) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">

        {/* My Process */}
        <div className="bm-card p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-lg sm:text-xl text-zinc-400 uppercase tracking-wider mb-10">
              My Process
            </h3>
            <div className="space-y-8 pl-2 relative">
              {/* Timeline Connector Line */}
              <div className="absolute left-5 top-2 bottom-2 w-px bg-zinc-800" />

              {service.process.map((step, idx) => (
                <div key={idx} className="flex gap-6 items-start relative z-10">
                  <span className="font-mono text-xs w-6 h-6 rounded-full bg-zinc-950 border border-zinc-800 text-[#FF205A] flex items-center justify-center shrink-0 select-none">
                    {idx + 1}
                  </span>
                  <span className="text-[17px] text-zinc-100 font-light leading-relaxed pt-0.5">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ (Without payment terms) */}
        <div className="bm-card p-8 sm:p-10">
          <h3 className="font-sans font-bold text-lg sm:text-xl text-zinc-400 uppercase tracking-wider mb-8">
            FAQ
          </h3>
          <div className="divide-y divide-zinc-900/60">
            {service.faq.map((item, idx) => (
              <div key={idx} className="py-2">
                {/* Trigger */}
                <div
                  onClick={() => toggleFaq(idx)}
                  className="bm-accordion-trigger flex items-center justify-between gap-4 py-4 px-2 -mx-2"
                >
                  <h4 className="font-sans font-semibold text-base sm:text-[17px] text-zinc-100 leading-snug">
                    {item.question}
                  </h4>
                  <ChevronDown
                    size={16}
                    className={`bm-accordion-chevron text-zinc-500 ${openFaq === idx ? 'open text-[#FF205A]' : ''}`}
                  />
                </div>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-[15px] sm:text-base text-zinc-300 font-light leading-relaxed pb-4 px-2 -mx-2 pt-0.5">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── TERMS & CONDITIONS (ONE Premium Full-Width Card) ── */}
      <div className="space-y-6 relative z-10">
        <h3 className="font-sans font-bold text-lg sm:text-xl text-zinc-400 uppercase tracking-wider pl-1">
          Terms & Conditions
        </h3>
        <div className="bm-card p-8 sm:p-10 lg:p-12">
          <div className="divide-y divide-zinc-900/60">
            {service.terms.map((term, idx) => (
              <div key={idx} className="bm-term-row flex items-baseline gap-6 py-5 px-4 -mx-4">
                <span className="font-mono text-base sm:text-lg text-[#FF205A] font-bold shrink-0 w-12 text-left select-none">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <p className="text-zinc-100 text-base sm:text-[17px] font-light leading-relaxed" style={{ lineHeight: '1.75' }}>
                  {term}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bm-card-cta p-10 sm:p-12 lg:p-16 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
          {/* Left content */}
          <div className="space-y-3">
            <span className="font-mono text-xs text-[#FF205A] uppercase tracking-[0.25em] block font-semibold">
              Timeline — Estimated {service.deliveryTime}
            </span>
            <h3 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-none">
              Ready to Commission?
            </h3>
          </div>

          {/* CTA Button */}
          <div className="shrink-0 w-full lg:w-auto">
            <a
              href={mailtoUrl}
              className="bm-cta-btn flex items-center justify-center gap-2 py-4.5 px-10 sm:py-5 sm:px-12 bg-white text-black hover:bg-[#FF205A] hover:text-white font-sans text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300 rounded-lg cursor-pointer text-center whitespace-nowrap"
            >
              Initiate Contract
            </a>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
