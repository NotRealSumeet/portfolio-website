/* =========================================================
   Imports
========================================================= */

import { useState, useEffect, SyntheticEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, FileText, Download } from 'lucide-react';
import resumePdf from '../assets/Resume/Sumit_Shah_Resume.pdf';
import DitherBackground from './DitherBackground';

/* =========================================================
   Types
========================================================= */

interface SpotifyTrack {
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  playedAt: number;
  currentlyPlaying?: boolean;
}

interface AboutPageProps {
  onBack: () => void;
}

/* =========================================================
   Constants
========================================================= */

const LASTFM_USERNAME = import.meta.env.VITE_LASTFM_USERNAME || 'Sumit_shah';
const LASTFM_API_KEY = import.meta.env.VITE_LASTFM_API_KEY || '2bed1944f3a074be318fed728e990ffe';
const FALLBACK_IMAGE_URL = '/spotify/bully.png';

/* =========================================================
   Official Software Icons (Vector SVGs)
========================================================= */

function PhotoshopIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect width="24" height="24" rx="4.5" fill="#001E36" />
      <rect x="0.5" y="0.5" width="23" height="23" rx="4" stroke="#31A8FF" strokeWidth="1" strokeOpacity="0.3" />
      <path
        d="M6 7h4.8c2.2 0 3.6 1.2 3.6 3s-1.4 3-3.6 3H8.2v4H6V7zm2.2 1.8v2.4h2.5c1 0 1.6-.5 1.6-1.2s-.6-1.2-1.6-1.2H8.2zM15 14.8c.3.9 1.1 1.5 2.3 1.5 1.1 0 1.9-.6 1.9-1.5 0-1.7-3.9-1.3-3.9-3.2 0-1.2 1-2.1 2.4-2.1 1.2 0 2.1.6 2.3 1.5h-1.5c-.2-.5-.7-.8-1.3-.8-.8 0-1.2.5-1.2 1 0 1.5 3.9 1.2 3.9 3.3 0 1.6-1.3 2.5-2.9 2.5-1.6 0-2.7-.9-3-2.2h1.5z"
        fill="#31A8FF"
      />
    </svg>
  );
}

function IllustratorIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect width="24" height="24" rx="4.5" fill="#261300" />
      <rect x="0.5" y="0.5" width="23" height="23" rx="4" stroke="#FF9A00" strokeWidth="1" strokeOpacity="0.3" />
      <path
        d="M5.5 17L9.4 6.8h1.8L15.1 17h-1.8l-.9-2.7H8.2L7.3 17H5.5zm3.3-4.3h3.2L10.4 8.7 8.8 12.7zM17.2 6.8h1.9v1.9h-1.9V6.8zm0 3.2h1.9V17h-1.9v-7z"
        fill="#FF9A00"
      />
    </svg>
  );
}

function AfterEffectsIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect width="24" height="24" rx="4.5" fill="#1F143D" />
      <rect x="0.5" y="0.5" width="23" height="23" rx="4" stroke="#9999FF" strokeWidth="1" strokeOpacity="0.3" />
      <path
        d="M5 17L8.9 6.8h1.8L14.6 17h-1.8l-.9-2.7H7.7L6.8 17H5zm3.3-4.3h3.2L9.9 8.7 8.3 12.7zM15.8 13.5c0-2.1 1.2-3.6 3.1-3.6 1.9 0 3 1.3 3 3.3 0 .4 0 .7-.1.9H17.4c.1 1.2.9 2 2.1 2 .9 0 1.5-.5 1.8-1.1h1.5c-.4 1.4-1.7 2.3-3.4 2.3-2.1 0-3.6-1.5-3.6-3.8zm1.6-.7h3.1c0-.9-.6-1.6-1.5-1.6-.9 0-1.5.7-1.6 1.6z"
        fill="#9999FF"
      />
    </svg>
  );
}

function FigmaIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 38 57" className={className} fill="none" aria-hidden="true">
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
      <path d="M0 47.5a9.5 9.5 0 0 1 9.5-9.5H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
    </svg>
  );
}

/* =========================================================
   Helper Components & Functions
========================================================= */

const formatRelativeTime = (timestamp: number) => {
  if (!timestamp) return 'RECENTLY';
  const diff = Date.now() - timestamp;
  if (diff < 0) return 'JUST NOW';
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'JUST NOW';
  if (mins < 60) return `${mins}M AGO`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}H AGO`;
  const days = Math.floor(hours / 24);
  return `${days}D AGO`;
};

/**
 * Authentic 20-column stepped pixel spectrogram (Inspired by Reference 7 CRT Monitor)
 * Composed of discrete stacked micro-pixel blocks with simulated harmonics & peak accents.
 */
function PixelSpectrogram({ isPlaying = false }: { isPlaying?: boolean }) {
  const columns = [
    { height: 8, delay: '0ms', dur: '0.95s' },
    { height: 15, delay: '120ms', dur: '0.85s' },
    { height: 6, delay: '240ms', dur: '1.1s' },
    { height: 12, delay: '60ms', dur: '0.9s' },
    { height: 16, delay: '180ms', dur: '1.2s' },
    { height: 7, delay: '300ms', dur: '0.8s' },
    { height: 14, delay: '90ms', dur: '1.05s' },
    { height: 5, delay: '210ms', dur: '0.95s' },
    { height: 11, delay: '330ms', dur: '1.15s' },
    { height: 16, delay: '150ms', dur: '1.0s' },
    { height: 8, delay: '270ms', dur: '1.3s' },
    { height: 15, delay: '40ms', dur: '0.8s' },
    { height: 6, delay: '190ms', dur: '1.05s' },
    { height: 13, delay: '310ms', dur: '1.25s' },
    { height: 9, delay: '100ms', dur: '0.85s' },
    { height: 14, delay: '230ms', dur: '0.95s' },
    { height: 7, delay: '80ms', dur: '1.1s' },
    { height: 12, delay: '200ms', dur: '0.9s' },
    { height: 5, delay: '320ms', dur: '1.15s' },
    { height: 10, delay: '140ms', dur: '1.0s' }
  ];

  return (
    <div
      className="flex items-end gap-[2px] h-[16px] px-0.5 select-none"
      aria-hidden="true"
      title={isPlaying ? "Audio stream active" : "Audio stream idle"}
    >
      {columns.map((col, i) => (
        <span
          key={i}
          className={`w-[2px] rounded-[0.5px] transition-all duration-300 ${
            isPlaying
              ? col.height >= 14
                ? 'bg-[#FF205A] animate-pulse'
                : 'bg-zinc-200 animate-pulse'
              : 'h-[2px] bg-zinc-800'
          }`}
          style={
            isPlaying
              ? {
                  height: `${col.height}px`,
                  animationDelay: col.delay,
                  animationDuration: col.dur
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}

/**
 * Structural 1-Bit Bayer Dither Rail (Inspired by Reference 1 Synthopsis)
 * A tactile horizontal strip of discrete 1-bit pixel halftone separating tiers.
 */
function DitherRail() {
  return (
    <div className="w-full flex items-center gap-2 py-2 select-none pointer-events-none opacity-40 overflow-hidden" aria-hidden="true">
      <span className="font-mono text-[9px] text-zinc-500 shrink-0 uppercase tracking-widest">[ + ]</span>
      <div 
        className="flex-1 h-[4px] opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '4px 4px',
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}
      />
      <span className="font-mono text-[9px] text-zinc-600 shrink-0 select-none">✕</span>
      <div 
        className="w-20 h-[4px] opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '4px 4px'
        }}
      />
      <span className="font-mono text-[9px] text-zinc-500 shrink-0 uppercase tracking-widest">[ + ]</span>
    </div>
  );
}

/* =========================================================
   Main Component: Concept 2 — Interlocking Monument (Refined)
========================================================= */

export default function AboutPage({ onBack }: AboutPageProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time IST clock ticker
  const [currentTime, setCurrentTime] = useState<string>(() => {
    return new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata'
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText("sumeetshah24@gmail.com");
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_IMAGE_URL;
  };

  const fetchRecentlyPlayed = async () => {
    try {
      const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=12&cb=${Date.now()}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.recenttracks && data.recenttracks.track) {
          const rawTracks = data.recenttracks.track;
          const mappedTracks = rawTracks.map((track: any) => {
            const isNowPlaying = track['@attr']?.nowplaying === 'true' || track['@attr']?.currentlyplaying === 'true';
            
            let albumImageUrl = FALLBACK_IMAGE_URL;
            if (track.image && track.image.length > 0) {
              const xlImage = track.image.find((img: any) => img.size === 'extralarge');
              if (xlImage && xlImage['#text']) {
                albumImageUrl = xlImage['#text'];
              } else {
                const lgImage = track.image.find((img: any) => img.size === 'large');
                if (lgImage && lgImage['#text']) {
                  albumImageUrl = lgImage['#text'];
                } else {
                  const anyImage = track.image.find((img: any) => img['#text']);
                  if (anyImage) albumImageUrl = anyImage['#text'];
                }
              }
            }

            return {
              title: track.name || 'UNKNOWN TRACK',
              artist: track.artist?.['#text'] || 'UNKNOWN ARTIST',
              album: track.album?.['#text'] || 'UNKNOWN ALBUM',
              albumImageUrl,
              songUrl: track.url || 'https://www.last.fm',
              playedAt: isNowPlaying ? Date.now() : (track.date?.uts ? parseInt(track.date.uts) * 1000 : Date.now()),
              currentlyPlaying: isNowPlaying
            };
          });

          // Deduplicate scrobbles
          const uniqueTracks: SpotifyTrack[] = [];
          const seen = new Set<string>();

          for (const track of mappedTracks) {
            const key = `${track.title.toLowerCase().trim()} - ${track.artist.toLowerCase().trim()}`;
            if (uniqueTracks.length === 0) {
              uniqueTracks.push(track);
              seen.add(key);
            } else if (!seen.has(key)) {
              uniqueTracks.push(track);
              seen.add(key);
            }
          }

          if (uniqueTracks.length > 0) {
            setTracks(uniqueTracks);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching Last.fm recently played:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentlyPlayed();
    const pollInterval = setInterval(fetchRecentlyPlayed, 15000);
    return () => clearInterval(pollInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6 sm:space-y-7 pb-12 relative select-none w-full min-h-[calc(100vh-6rem)]"
    >
      {/* Dossier Procedural Film Grain Overlay */}
      <div className="dossier-grain" />

      {/* Interactive 1-Bit Bayer Dither Canvas (Masked to peripheral negative space & artwork atmosphere, leaving text in 100% quiet zone) */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        style={{
          maskImage: 'radial-gradient(ellipse 65% 60% at 82% 28%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 60% at 82% 28%, black 20%, transparent 75%)'
        }}
      >
        <DitherBackground cellSize={7} influenceRadius={190} baseIntensity={0.045} />
      </div>

      {/* TOP HORIZON: Architectural Drafting Header with Return to Index Archive Button (Reused from ProjectDetail) */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 select-none relative z-10 font-mono text-xs">
        {/* Exact Return to Index Archive Button from ProjectDetail */}
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2.5 font-mono text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer py-1.5 pr-3 pl-1.5 rounded-full border border-zinc-800/80 bg-[#0c0c0e] hover:border-[#FF205A]/50"
        >
          <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-[#FF205A] group-hover:border-[#FF205A]/60 group-hover:bg-[#FF205A]/10 transition-colors shrink-0">
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
          </span>
          <span className="tracking-wider uppercase text-[11px] font-medium hidden sm:inline">
            RETURN TO INDEX ARCHIVE
          </span>
          <span className="tracking-wider uppercase text-[11px] font-medium inline sm:hidden">
            INDEX ARCHIVE
          </span>
        </button>

        <div className="flex items-center gap-4 text-zinc-500 uppercase tracking-widest text-[11px]">
          <span className="hidden sm:inline-block">NAVI MUMBAI, IN</span>
          <span className="text-[#FF205A] font-semibold flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 bg-[#FF205A] rounded-full animate-pulse" />
            IST {currentTime}
          </span>
          <span className="hidden md:inline-block font-sans text-zinc-700">|</span>
          <span className="hidden md:inline-block font-mono text-zinc-400 font-bold">PLAYER INFO</span>
        </div>
      </div>

      {/* =========================================================
          ASYMMETRIC EDITORIAL SPREAD (Identity Anchor + Unified Audio Player)
      ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 relative z-10 items-start">
        
        {/* =========================================================
            LEFT CANVASES (7 cols lg, 8 cols xl): IDENTITY, MANIFESTO, ACTIONS, TOOLS
        ========================================================= */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          {/* Integrated Typographic Identity Block */}
          <div className="space-y-4 sm:space-y-4.5">
            
            {/* Monumental Stacked Headline */}
            <div>
              <h1 className="font-sans font-black text-6xl sm:text-7xl lg:text-[82px] xl:text-[90px] tracking-[-0.045em] text-white uppercase leading-[0.84] select-none">
                Sumit<br />Shah
              </h1>
              
              {/* Restored Pink Rectangular Role Badge (Ref 1 inspired) */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#FF205A] text-white font-mono text-[11px] sm:text-xs uppercase tracking-widest font-bold mt-3 sm:mt-3.5 shadow-sm select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>GRAPHIC DESIGNER</span>
              </div>
            </div>

            {/* Editorial Bio Statement */}
            <p className="font-sans text-sm sm:text-[15px] text-zinc-300 font-normal leading-[1.65] max-w-[460px] pt-1">
              I design across different formats, from posters and cover art to digital visuals. I enjoy experimenting with typography, imagery and layouts, and seeing where an idea can go.
            </p>

            {/* Hardware Keycap Actions (Visually secondary, preserved functionality) */}
            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              {/* View Resume */}
              <a
                href={resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Sumit Shah's Resume in a new browser tab"
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-black hover:bg-zinc-200 transition-all font-mono text-xs uppercase tracking-wider font-semibold cursor-pointer select-none active:translate-y-0.5"
                style={{ minHeight: '38px' }}
              >
                <FileText size={12} className="text-black" />
                <span>VIEW RESUME</span>
                <ArrowUpRight size={12} className="opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* Download Resume */}
              <a
                href={resumePdf}
                download="Sumit_Shah_Resume.pdf"
                aria-label="Download Sumit Shah's Resume PDF directly"
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 bg-black border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition-all font-mono text-xs uppercase tracking-wider font-semibold cursor-pointer select-none active:translate-y-0.5"
                style={{ minHeight: '38px' }}
              >
                <Download size={12} className="text-zinc-400 group-hover:text-white transition-colors" />
                <span>DOWNLOAD</span>
              </a>

              {/* Email Click-to-Copy */}
              <button
                onClick={copyEmail}
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 bg-black border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition-all font-mono text-xs uppercase tracking-wider font-semibold cursor-pointer select-none active:translate-y-0.5"
                style={{ minHeight: '38px' }}
              >
                <span>{copyStatus === 'copied' ? '[ COPIED! ]' : 'EMAIL'}</span>
                {copyStatus !== 'copied' && (
                  <ArrowUpRight size={11} className="text-[#FF205A] opacity-60 group-hover:opacity-100 transition-opacity" />
                )}
              </button>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/sumeetism/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 bg-black border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition-all font-mono text-xs uppercase tracking-wider font-semibold cursor-pointer select-none active:translate-y-0.5"
                style={{ minHeight: '38px' }}
              >
                <span>INSTAGRAM</span>
                <ArrowUpRight size={11} className="text-[#FF205A] opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* STRUCTURAL 1-BIT DITHER RAIL */}
          <DitherRail />

          {/* CORE TOOLS: Engineered Graphic Specimen Matrix with Official Recognizable Application Icons */}
          <div className="space-y-2.5 pt-1">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.22em] font-semibold block">
              CORE TOOLS // SPECIALIZATION
            </span>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Tool 01: Photoshop */}
              <div className="border border-zinc-900 bg-zinc-950/40 p-2.5 space-y-2 hover:border-zinc-700 transition-colors group cursor-default">
                <div className="flex items-center justify-between font-mono text-[9px]">
                  <span className="text-[#FF205A] font-bold">01</span>
                  <span className="text-zinc-600 font-semibold group-hover:text-zinc-400 transition-colors">PS</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhotoshopIcon className="w-4 h-4 shrink-0 rounded-[3px]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-zinc-200 group-hover:text-white font-medium block truncate">
                    Photoshop
                  </span>
                </div>
              </div>

              {/* Tool 02: Illustrator */}
              <div className="border border-zinc-900 bg-zinc-950/40 p-2.5 space-y-2 hover:border-zinc-700 transition-colors group cursor-default">
                <div className="flex items-center justify-between font-mono text-[9px]">
                  <span className="text-[#FF205A] font-bold">02</span>
                  <span className="text-zinc-600 font-semibold group-hover:text-zinc-400 transition-colors">AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <IllustratorIcon className="w-4 h-4 shrink-0 rounded-[3px]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-zinc-200 group-hover:text-white font-medium block truncate">
                    Illustrator
                  </span>
                </div>
              </div>

              {/* Tool 03: After Effects */}
              <div className="border border-zinc-900 bg-zinc-950/40 p-2.5 space-y-2 hover:border-zinc-700 transition-colors group cursor-default">
                <div className="flex items-center justify-between font-mono text-[9px]">
                  <span className="text-[#FF205A] font-bold">03</span>
                  <span className="text-zinc-600 font-semibold group-hover:text-zinc-400 transition-colors">AE</span>
                </div>
                <div className="flex items-center gap-2">
                  <AfterEffectsIcon className="w-4 h-4 shrink-0 rounded-[3px]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-zinc-200 group-hover:text-white font-medium block truncate">
                    After Effects
                  </span>
                </div>
              </div>

              {/* Tool 04: Figma */}
              <div className="border border-zinc-900 bg-zinc-950/40 p-2.5 space-y-2 hover:border-zinc-700 transition-colors group cursor-default">
                <div className="flex items-center justify-between font-mono text-[9px]">
                  <span className="text-[#FF205A] font-bold">04</span>
                  <span className="text-zinc-600 font-semibold group-hover:text-zinc-400 transition-colors">FG</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    <FigmaIcon className="h-4 w-auto shrink-0" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider text-zinc-200 group-hover:text-white font-medium block truncate">
                    Figma
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* =========================================================
            RIGHT CANVAS (5 cols lg, 4 cols xl): THE COHESIVE MUSIC PLAYER
        ========================================================= */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          
          {loading ? (
            /* Loading Skeleton */
            <div className="border border-zinc-900 bg-zinc-950/40 p-3.5 space-y-3 animate-pulse">
              <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
                <span>CONNECTING STREAM...</span>
                <span>♫ LAST.FM</span>
              </div>
              <div className="w-full aspect-square bg-zinc-950 border border-zinc-900" />
            </div>
          ) : tracks.length > 0 ? (
            /* Cohesive Music Player (Ref 6 & Ref 7 inspired) */
            <div className="border border-zinc-900/90 bg-zinc-950/40 p-3 sm:p-3.5 space-y-3.5 shadow-xl relative">
              
              {/* Player Top Header: Status & Source */}
              <div className="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase select-none pb-2 border-b border-zinc-900">
                {tracks[0].currentlyPlaying ? (
                  <div className="flex items-center gap-2 text-[#2B8252] font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B8252] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2B8252]"></span>
                    </span>
                    <span>NOW STREAMING LIVE</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-zinc-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                    <span>LATEST ROTATION</span>
                  </div>
                )}
                <span className="text-zinc-500 font-light text-[9px]">
                  ♫ LAST.FM
                </span>
              </div>

              {/* The Physical Vinyl Album Sleeve with CD Sheen & Interactive Hover Frame */}
              <div className="relative group">
                <a
                  href={tracks[0].songUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative aspect-square w-full overflow-hidden border border-zinc-800/80 group-hover:border-zinc-600 transition-all duration-500 shadow-2xl cursor-pointer"
                >
                  <img 
                    src={tracks[0].albumImageUrl} 
                    alt={tracks[0].album} 
                    onError={handleImageError}
                    className="w-full h-full object-cover transform group-hover:scale-[1.02] transition-transform duration-700 select-none"
                  />
                  <div className="cd-sheen" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {tracks[0].currentlyPlaying && (
                    <div className="absolute top-2.5 left-2.5 bg-emerald-500 text-black font-mono text-[9px] font-bold tracking-widest px-2 py-0.5 shadow z-20 flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-black"></span>
                      </span>
                      LIVE
                    </div>
                  )}

                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/70 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white/30 transition-all z-20">
                    <ArrowUpRight size={12} />
                  </div>
                </a>
              </div>

              {/* Current Track Caption & 20-Column Stepped Spectrogram */}
              <div className="pt-0.5 flex items-end justify-between gap-3 border-b border-zinc-900 pb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-sans font-bold text-sm sm:text-base text-white tracking-tight leading-snug truncate">
                    {tracks[0].title}
                  </h3>
                  <p className="font-mono text-[11px] text-zinc-400 uppercase tracking-wider truncate mt-0.5">
                    {tracks[0].artist}
                  </p>
                </div>
                
                {/* Stepped Pixel Equalizer (Ref 7 inspired) */}
                <div className="shrink-0 flex items-center gap-2 pb-0.5">
                  <PixelSpectrogram isPlaying={tracks[0].currentlyPlaying} />
                </div>
              </div>

              {/* Connected Recent Rotation Ledger */}
              <div className="space-y-2 pt-0.5">
                <div className="flex items-center justify-between font-mono text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-semibold">
                  <span>RECENT ROTATION</span>
                  <span className="text-zinc-600">[ ARCHIVE ]</span>
                </div>
                
                <div className="space-y-1.5">
                  {tracks.slice(1, 4).map((track, idx) => (
                    <a
                      key={idx}
                      href={track.songUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 py-1 px-1.5 rounded hover:bg-zinc-900/40 transition-colors cursor-pointer"
                    >
                      {/* Small Album Thumb */}
                      <div className="w-7 h-7 shrink-0 overflow-hidden bg-zinc-950 border border-zinc-900 relative">
                        <img 
                          src={track.albumImageUrl} 
                          alt={track.album} 
                          onError={handleImageError}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Track Meta */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-sans text-xs text-zinc-300 group-hover:text-white font-medium truncate transition-colors">
                            {track.title}
                          </span>
                          <span className="font-mono text-[8px] text-[#FF205A] tracking-wider shrink-0 uppercase select-none">
                            {formatRelativeTime(track.playedAt)}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-500 truncate block mt-0.5">
                          {track.artist}
                        </span>
                      </div>

                      <ArrowUpRight size={10} className="text-zinc-600 group-hover:text-[#FF205A] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Stream Offline */
            <div className="border border-zinc-900 bg-zinc-950/40 p-6 text-center space-y-2">
              <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest block">
                ♫ STREAM OFFLINE
              </span>
              <p className="font-mono text-xs text-zinc-500">
                Unable to connect to Last.fm stream.
              </p>
            </div>
          )}

        </div>

      </div>
    </motion.div>
  );
}
