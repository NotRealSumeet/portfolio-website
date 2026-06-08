import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { BlackMarketService } from '../blackMarketData';
import CurrencyToggle from './CurrencyToggle';
import { formatPrice } from './PriceFormatter';

interface BlackMarketDetailProps {
  service: BlackMarketService;
  currency: 'USD' | 'INR';
  onCurrencyChange: (currency: 'USD' | 'INR') => void;
  onBack: () => void;
}

export default function BlackMarketDetail({
  service,
  currency,
  onCurrencyChange,
  onBack
}: BlackMarketDetailProps) {
  const startingPrice = currency === 'USD' ? service.startingPriceUsd : service.startingPriceInr;
  const portfolioEmail = "sumeetshah24@gmail.com";
  
  // Custom pre-filled mailto link
  const mailtoSubject = encodeURIComponent(`Contract Inquiry: Black Market - ${service.title}`);
  const mailtoBody = encodeURIComponent(`Hi Sumit,\n\nI am looking to commission a contract for "${service.title}".\n\nSelected Currency: ${currency}\nStarting Price: ${startingPrice}\n\nLet's coordinate on creative details.`);
  const mailtoUrl = `mailto:${portfolioEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="space-y-10 pb-24"
    >
      {/* HEADER ACTIONS: Return & Currency Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 border-b border-zinc-900 pb-6 sm:pb-8 pt-4">
        <button
          onClick={onBack}
          className="group flex items-center gap-3 font-mono text-xs text-[#666666] hover:text-[#742DE1] transition-colors cursor-pointer py-1 self-start"
          style={{ minHeight: '44px' }}
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1.5 transition-transform text-[#742DE1]" />
          <span>[ RETURN TO BLACK MARKET ]</span>
        </button>

        <div className="self-start sm:self-auto">
          <CurrencyToggle currency={currency} onChange={onCurrencyChange} />
        </div>
      </div>

      {/* SERVICE CORE DETAILS HERO */}
      <div className="space-y-6 max-w-4xl">
        <div className="space-y-3">
          <span className="font-mono text-xs text-[#742DE1] uppercase tracking-[0.25em] block font-semibold">
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

      <div className="h-[1px] bg-zinc-900/60 w-full" />

      {/* SECTION 2: INCLUDES (Full-Width, stretched horizontally) */}
      <div className="relative bg-[#07070a]/40 backdrop-blur-md border border-zinc-900/80 p-8 sm:p-10 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(116,45,225,0.02)] space-y-6">
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#742DE1]/5 blur-3xl rounded-full pointer-events-none" />
        <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-white uppercase tracking-tight">
          Includes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
          {service.includes.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 text-base text-zinc-300 font-light">
              <span className="w-2 h-2 rounded-full bg-[#742DE1] shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: AVAILABLE ADD-ONS (Full-Width, clean stretched section) */}
      <div className="relative bg-[#07070a]/40 backdrop-blur-md border border-zinc-900/80 p-8 sm:p-10 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(116,45,225,0.02)] space-y-6">
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#742DE1]/5 blur-3xl rounded-full pointer-events-none" />
        <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-white uppercase tracking-tight">
          Available Add-Ons
        </h3>
        <div className="space-y-1 divide-y divide-zinc-900/60 pt-2">
          {service.addOns.map((addon, idx) => {
            const price = currency === 'USD' ? addon.usd : addon.inr;
            return (
              <div key={idx} className="flex items-center justify-between py-4 sm:py-5 hover:bg-zinc-900/30 px-4 -mx-4 rounded-lg transition-colors duration-200">
                <span className="text-zinc-200 text-sm sm:text-base font-light flex items-center gap-3">
                  <span className="text-[#742DE1] text-lg font-light select-none">+</span>
                  {addon.name}
                </span>
                <span className="font-sans font-bold text-sm sm:text-base text-white">
                  {formatPrice(price)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: SMART 3-CARD LAYOUT (Process, FAQ, Terms) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Process Timeline Card */}
        <div className="relative bg-[#07070a]/40 backdrop-blur-md border border-zinc-900/80 p-8 sm:p-10 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(116,45,225,0.02)] space-y-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#742DE1]/5 blur-2xl rounded-full pointer-events-none" />
          <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-white uppercase tracking-tight">
            Our Process
          </h3>
          <div className="space-y-6 pt-2">
            {service.process.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <span className="font-mono text-xl sm:text-2xl text-[#742DE1]/60 font-light leading-none select-none">
                  0{idx + 1}
                </span>
                <span className="text-sm sm:text-base text-zinc-300 font-light leading-snug">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Card */}
        <div className="relative bg-[#07070a]/40 backdrop-blur-md border border-zinc-900/80 p-8 sm:p-10 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(116,45,225,0.02)] space-y-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#742DE1]/5 blur-2xl rounded-full pointer-events-none" />
          <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-white uppercase tracking-tight">
            FAQ
          </h3>
          <div className="space-y-6 pt-2">
            {service.faq.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="font-sans font-semibold text-sm sm:text-base text-zinc-200">
                  {item.question}
                </h4>
                <p className="font-sans font-light text-sm text-zinc-400 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Terms Card */}
        <div className="relative bg-[#07070a]/40 backdrop-blur-md border border-zinc-900/80 p-8 sm:p-10 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(116,45,225,0.02)] space-y-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#742DE1]/5 blur-2xl rounded-full pointer-events-none" />
          <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-white uppercase tracking-tight">
            Terms
          </h3>
          <ul className="space-y-3.5 text-xs sm:text-sm text-zinc-500 font-sans font-light pl-4 list-disc leading-relaxed pt-2">
            {service.terms.map((term, idx) => (
              <li key={idx}>
                {term}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* SECTION 5: DELIVERY TIMELINE & CTA (Full-Width Conversion Banner) */}
      <div className="relative bg-[#0a0a0f]/60 backdrop-blur-md border border-[#742DE1]/20 hover:border-[#742DE1]/40 hover:shadow-[0_0_35px_rgba(116,45,225,0.08)] p-8 sm:p-10 rounded-2xl overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-8 transition-all duration-500">
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#742DE1]/8 blur-2xl rounded-full pointer-events-none" />
        
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3 text-zinc-400">
            <span className="font-mono text-xs uppercase tracking-widest text-[#742DE1] font-semibold">Timeline & Milestones</span>
            <span className="text-zinc-600">—</span>
            <span className="text-sm font-semibold text-white">Estimated {service.deliveryTime}</span>
          </div>
          <p className="font-sans text-sm text-zinc-300 leading-relaxed font-light">
            Ready to commission this contract? Send an email inquiry below. We will coordinate on your creative brief, timelines, and establish the contract milestones.
          </p>
        </div>

        <div className="shrink-0 w-full md:w-auto relative z-10">
          <a
            href={mailtoUrl}
            className="flex items-center justify-center gap-2 py-4 px-8 bg-white text-black hover:bg-[#742DE1] hover:text-white hover:shadow-[0_0_30px_rgba(116,45,225,0.4)] font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-lg cursor-pointer text-center whitespace-nowrap"
          >
            Initiate Contract
          </a>
        </div>
      </div>

    </motion.div>
  );
}
