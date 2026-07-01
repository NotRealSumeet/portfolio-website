import { motion } from 'motion/react';

interface CurrencyToggleProps {
  currency: 'USD' | 'INR';
  onChange: (currency: 'USD' | 'INR') => void;
}

export default function CurrencyToggle({ currency, onChange }: CurrencyToggleProps) {
  return (
    <div className="flex items-center gap-3 select-none">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-medium">
        CURRENCY
      </span>
      <div className="relative flex items-center bg-[#07070a]/80 border border-zinc-800/80 p-[3px] rounded-full w-32 h-8 backdrop-blur-md shadow-inner">
        {/* Animated Sliding Background Capsule */}
        <motion.div
          className="absolute top-[2px] bottom-[2px] rounded-full bg-gradient-to-r from-[#FF205A] to-[#FF4D7A] shadow-[0_0_12px_rgba(255,32,90,0.35)]"
          initial={false}
          animate={{
            left: currency === 'USD' ? '3px' : '61px',
            width: '60px',
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        />
        
        {/* USD Button */}
        <button
          onClick={() => onChange('USD')}
          className={`relative z-10 w-1/2 text-[11px] font-sans font-bold tracking-wider uppercase transition-colors duration-300 ${
            currency === 'USD' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
          style={{ minHeight: '100%' }}
        >
          USD
        </button>

        {/* INR Button */}
        <button
          onClick={() => onChange('INR')}
          className={`relative z-10 w-1/2 text-[11px] font-sans font-bold tracking-wider uppercase transition-colors duration-300 ${
            currency === 'INR' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
          style={{ minHeight: '100%' }}
        >
          INR
        </button>
      </div>
    </div>
  );
}
