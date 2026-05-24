import { motion } from 'motion/react';
import { Mail, Globe, ArrowUpRight, ArrowLeft } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-12 pb-24"
    >
      {/* HEADER: Action Return button */}
      <div className="flex items-center justify-between border-b border-[#111111] pb-6">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 font-mono text-xs text-[#666666] hover:text-[#742DE1] transition-colors cursor-pointer py-1"
          style={{ minHeight: '44px' }}
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-[#742DE1]" />
          <span className="hidden sm:inline">[ RETURN TO INDEX ARCHIVE ]</span>
          <span className="inline sm:hidden">[ BACK ]</span>
        </button>
        <span className="font-mono text-[10px] text-[#444444] uppercase tracking-widest hidden sm:block">
          PROFILE DOSSIER // SM-01
        </span>
      </div>

      {/* COMPACT MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
        
        {/* LEFT & MID COLUMNS: Biography and Mission */}
         <div className="lg:col-span-2 space-y-10">
          <div className="space-y-4">
            <span className="font-mono text-xs text-[#666666] uppercase tracking-widest block">
              01 // BIOGRAPHY
            </span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tighter text-white uppercase leading-none">
              About
            </h2>
          </div>

          <div className="h-[1px] bg-[#111111] w-full" />

          {/* Large Introduction text */}
          <p className="font-sans text-lg sm:text-xl lg:text-2xl text-zinc-200 tracking-tight leading-snug font-light">
            I’m <span className="text-[#742DE1] font-normal">Sumit Shah</span>
          </p>

          <p className="font-sans text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
            A graphic designer focused on thumbnails, posters, cover art, and visual storytelling. My work combines Swiss typography principles with experimental layouts, texture-heavy compositions, and modern internet visual culture. I enjoy balancing structured design systems with raw expressive visuals.
          </p>
        </div>

        {/* RIGHT COLUMN: Contact Details with premium Dossier Table layout */}
        <div className="space-y-8">
          <div className="bg-[#050505] border border-[#111111] p-6 space-y-6">
            <h4 className="font-mono text-[9px] text-[#444444] uppercase tracking-widest border-b border-[#111111] pb-3">
              CONTACT & INFO
            </h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#111111] pb-2 text-xs">
                <span className="font-mono text-[#555555]">ROLE</span>
                <span className="font-sans font-semibold text-white uppercase tracking-tight">Graphic Designer</span>
              </div>

              <div className="flex items-center justify-between border-b border-[#111111] pb-2 text-xs">
                <span className="font-mono text-[#555555]">LOCATION</span>
                <span className="font-sans font-semibold text-white uppercase tracking-tight font-light text-zinc-200">Navi Mumbai, IN</span>
              </div>

              <div className="flex items-center justify-between border-b border-[#111111] pb-2 text-xs">
                <span className="font-mono text-[#555555]">EMAIL</span>
                <a
                  href="mailto:sumeetshah24@gmail.com"
                  className="font-sans font-semibold text-white hover:text-[#742DE1] transition-colors flex items-center gap-1 py-1"
                >
                  sumeetshah24@gmail.com <ArrowUpRight size={10} className="text-[#742DE1]" />
                </a>
              </div>

              <div className="flex items-center justify-between border-b border-[#111111] pb-2 text-xs">
                <span className="font-mono text-[#555555]">INSTAGRAM</span>
                <a
                  href="https://www.instagram.com/sumeetism/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-sans font-semibold text-white hover:text-[#742DE1] transition-colors flex items-center gap-1 py-1"
                >
                  @sumeetism <ArrowUpRight size={10} className="text-[#742DE1]" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="h-[1px] bg-[#111111] w-full pt-1" />

      {/* RETURN BUTTON ACTION FOOTER */}
      <div className="flex justify-start">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 font-mono text-xs text-[#666666] hover:text-white transition-colors cursor-pointer w-full sm:w-auto justify-center py-3 border border-[#111111] sm:border-transparent"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">[ BACK TO INDEX GRID ]</span>
          <span className="inline sm:hidden">[ BACK TO ARCHIVE ]</span>
        </button>
      </div>

    </motion.div>
  );
}
