import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface SpotifyTrack {
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  playedAt: number;
  currentlyPlaying?: boolean;
}

const LASTFM_USERNAME = import.meta.env.VITE_LASTFM_USERNAME || 'Sumit_shah';
const LASTFM_API_KEY = import.meta.env.VITE_LASTFM_API_KEY || '2bed1944f3a074be318fed728e990ffe';
const FALLBACK_IMAGE_URL = '/spotify/bully.png';

const Equalizer = () => (
  <div className="flex items-end gap-[2px] h-3 w-3.5 shrink-0" aria-hidden="true">
    <div className="w-[2px] bg-[#1DB954] rounded-t-xs h-[3px] animate-eq-bar-1" />
    <div className="w-[2px] bg-[#1DB954] rounded-t-xs h-[4px] animate-eq-bar-2" />
    <div className="w-[2px] bg-[#1DB954] rounded-t-xs h-[2px] animate-eq-bar-3" />
    <div className="w-[2px] bg-[#1DB954] rounded-t-xs h-[3px] animate-eq-bar-4" />
  </div>
);

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



interface AboutPageProps {
  onBack: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);

  const copyEmail = () => {
    navigator.clipboard.writeText("sumeetshah24@gmail.com");
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_IMAGE_URL;
  };

  const fetchRecentlyPlayed = async () => {
    try {
      // Limit to 12 tracks to ensure we have enough unique tracks after deduplication
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

          // Deduplicate scrobbles to avoid showing the same song multiple times in the history list
          const uniqueTracks: SpotifyTrack[] = [];
          const seen = new Set<string>();

          for (const track of mappedTracks) {
            const key = `${track.title.toLowerCase().trim()} - ${track.artist.toLowerCase().trim()}`;
            // Always keep the first track (current or most recent)
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

  // Poll Last.fm status every 15 seconds to keep it highly dynamic and responsive
  useEffect(() => {
    fetchRecentlyPlayed();
    const pollInterval = setInterval(fetchRecentlyPlayed, 15000);
    return () => clearInterval(pollInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-12 pb-24 relative"
    >
      {/* Dossier Procedural Film Grain Overlay */}
      <div className="dossier-grain" />

      {/* Dynamic Background Atmospheric Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.12, 0.95, 1],
          opacity: [0.05, 0.09, 0.07, 0.05],
          x: [0, 10, -15, 0],
          y: [0, -20, 10, 0]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-10 left-10 w-[450px] h-[450px] rounded-full bg-[#742DE1] blur-[130px] pointer-events-none select-none z-0" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 0.9, 1.1, 1],
          opacity: [0.02, 0.04, 0.03, 0.02],
          x: [0, -15, 15, 0],
          y: [0, 10, -15, 0]
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-32 right-10 w-[400px] h-[400px] rounded-full bg-[#1DB954] blur-[125px] pointer-events-none select-none z-0" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 0.95, 1],
          opacity: [0.03, 0.06, 0.04, 0.03],
          x: [10, -10, 5, 10],
          y: [-10, 15, -5, -10]
        }}
        transition={{ 
          duration: 28, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute bottom-10 left-1/3 w-[350px] h-[350px] rounded-full bg-[#1e1b4b] blur-[110px] pointer-events-none select-none z-0" 
      />

      {/* HEADER: Return action */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-6 select-none relative z-10">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer py-1"
          style={{ minHeight: '44px' }}
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
          <span>[ BACK TO INDEX ARCHIVE ]</span>
        </button>
        <span className="font-mono text-xs text-[#742DE1] uppercase tracking-widest font-bold flex items-center gap-1.5">
          <span className="inline-block w-1 h-1 bg-[#742DE1] rounded-full" />
          PLAYER INFO
        </span>
      </div>

      {/* 2-COLUMN PREMIUM EDITORIAL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-4 relative z-10">
        
        {/* LEFT COLUMN: Main identity / Biography / Info Table */}
        <div className="lg:col-span-7 space-y-10 relative">
          
          {/* Hero Intro Section (Cohesive Headline + Summary) */}
          <div className="space-y-6 max-w-xl">
            {/* Identity Title */}
            <div className="space-y-2">
              <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight">
                I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8c47e8] via-[#ab76f2] to-[#c084fc] drop-shadow-[0_2px_12px_rgba(140,71,232,0.3)] relative font-extrabold">Sumit Shah</span>
              </h1>
            </div>

            {/* Biography Paragraphs */}
            <div className="space-y-5">
              <p className="text-base sm:text-lg text-zinc-300/95 font-light leading-[1.7] tracking-wide">
                A graphic designer focused on thumbnails, posters, cover art, and visual storytelling. 
                My work combines Swiss typography principles with experimental layouts, texture-heavy compositions, and modern internet visual culture.
              </p>
              <p className="text-sm sm:text-base text-zinc-400/90 font-light leading-[1.65] tracking-wide">
                I enjoy balancing structured design systems with raw expressive visuals, constructing interactive experiences, and developing atmospheric digital systems.
              </p>
            </div>
          </div>

          {/* Premium Glassmorphic Info Table Card (Luxury SaaS Panel) */}
          <div className="luxury-glass-panel luxury-glow-purple rounded-xl relative overflow-hidden group/card transition-all duration-500 hover:border-zinc-700/40">
            {/* Ambient background glows inside card */}
            <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full bg-[#742DE1]/8 blur-3xl pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-[#1DB954]/[0.02] blur-3xl pointer-events-none" />
            
            <div className="divide-y divide-zinc-900/90 relative z-10">
              {/* Header Title Row */}
              <div className="flex justify-between items-center py-5 px-6 bg-white/[0.01]">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.25em] font-semibold">
                  CONTACT & INFO
                </span>
                <span className="font-sans text-xs text-zinc-500 uppercase tracking-widest font-mono select-none">
                  DOSSIER // SM-01
                </span>
              </div>

              {/* Based In Row */}
              <div className="group/row flex justify-between items-center py-5 px-6 hover:bg-white/[0.02] transition-colors duration-300 relative overflow-hidden">
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-gradient-to-b from-[#8c47e8] to-[#ab76f2] scale-y-0 group-hover/row:scale-y-100 transition-transform duration-300 origin-center rounded-r" />
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-medium transition-colors group-hover/row:text-zinc-400">
                  BASED IN
                </span>
                <span className="font-sans text-sm font-medium text-zinc-100">
                  Navi Mumbai, IN
                </span>
              </div>

              {/* Tools Badges Row */}
              <div className="group/row flex justify-between items-center py-5 px-6 hover:bg-white/[0.02] transition-colors duration-300 relative overflow-hidden">
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-gradient-to-b from-[#8c47e8] to-[#ab76f2] scale-y-0 group-hover/row:scale-y-100 transition-transform duration-300 origin-center rounded-r" />
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-medium transition-colors group-hover/row:text-zinc-400">
                  TOOLS
                </span>
                <div className="flex items-center gap-3">
                  {/* Photoshop Badge */}
                  <div 
                    title="Photoshop" 
                    className="relative p-0.5 rounded-lg bg-zinc-950/40 border border-zinc-900/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] hover:border-[#00C8FF]/60 hover:shadow-[0_0_15px_rgba(0,200,255,0.25)] transition-all duration-300 group/tool overflow-hidden cursor-help hover:-translate-y-0.5"
                  >
                    <div className="absolute inset-0 bg-[#00C8FF]/10 opacity-0 group-hover/tool:opacity-100 transition-opacity duration-300 blur-sm" />
                    <svg className="w-7 h-7 relative z-10 transform group-hover/tool:scale-105 transition-transform duration-300" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="32" height="32" rx="6" fill="#001C2A" stroke="#00C8FF" strokeWidth="1.2" />
                      <text x="6" y="21" fill="#00C8FF" fontSize="12" fontFamily="var(--font-sans)" fontWeight="bold">P</text>
                      <text x="15" y="21" fill="#00C8FF" fontSize="12" fontFamily="var(--font-sans)" fontWeight="bold">s</text>
                    </svg>
                  </div>

                  {/* Illustrator Badge */}
                  <div 
                    title="Illustrator" 
                    className="relative p-0.5 rounded-lg bg-zinc-950/40 border border-zinc-900/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] hover:border-[#FF9C00]/60 hover:shadow-[0_0_15px_rgba(255,156,0,0.25)] transition-all duration-300 group/tool overflow-hidden cursor-help hover:-translate-y-0.5"
                  >
                    <div className="absolute inset-0 bg-[#FF9C00]/10 opacity-0 group-hover/tool:opacity-100 transition-opacity duration-300 blur-sm" />
                    <svg className="w-7 h-7 relative z-10 transform group-hover/tool:scale-105 transition-transform duration-300" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="32" height="32" rx="6" fill="#261300" stroke="#FF9C00" strokeWidth="1.2" />
                      <text x="6" y="21" fill="#FF9C00" fontSize="12" fontFamily="var(--font-sans)" fontWeight="bold">A</text>
                      <text x="16" y="21" fill="#FF9C00" fontSize="12" fontFamily="var(--font-sans)" fontWeight="bold">i</text>
                    </svg>
                  </div>

                  {/* After Effects Badge */}
                  <div 
                    title="After Effects" 
                    className="relative p-0.5 rounded-lg bg-zinc-950/40 border border-zinc-900/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] hover:border-[#D126FF]/60 hover:shadow-[0_0_15px_rgba(209,38,255,0.25)] transition-all duration-300 group/tool overflow-hidden cursor-help hover:-translate-y-0.5"
                  >
                    <div className="absolute inset-0 bg-[#D126FF]/10 opacity-0 group-hover/tool:opacity-100 transition-opacity duration-300 blur-sm" />
                    <svg className="w-7 h-7 relative z-10 transform group-hover/tool:scale-105 transition-transform duration-300" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="32" height="32" rx="6" fill="#1C002A" stroke="#D126FF" strokeWidth="1.2" />
                      <text x="6" y="21" fill="#D126FF" fontSize="12" fontFamily="var(--font-sans)" fontWeight="bold">A</text>
                      <text x="15" y="21" fill="#D126FF" fontSize="12" fontFamily="var(--font-sans)" fontWeight="bold">e</text>
                    </svg>
                  </div>

                  {/* Figma Badge */}
                  <div 
                    title="Figma" 
                    className="relative p-0.5 rounded-lg bg-zinc-950/40 border border-zinc-900/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] hover:border-[#F24E1E]/60 hover:shadow-[0_0_15px_rgba(242,78,30,0.25)] transition-all duration-300 group/tool overflow-hidden cursor-help hover:-translate-y-0.5"
                  >
                    <div className="absolute inset-0 bg-[#F24E1E]/10 opacity-0 group-hover/tool:opacity-100 transition-opacity duration-300 blur-sm" />
                    <svg className="w-7 h-7 relative z-10 transform group-hover/tool:scale-105 transition-transform duration-300" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="32" height="32" rx="6" fill="#1E1E1E" stroke="#F24E1E" strokeWidth="1.2" />
                      <g transform="translate(8, 4)">
                        <path d="M0 4C0 1.8 1.8 0 4 0C6.2 0 8 1.8 8 4V8H4C1.8 8 0 6.2 0 4Z" fill="#F24E1E"/>
                        <path d="M0 12C0 9.8 1.8 8 4 8H8V16H4C1.8 16 0 14.2 0 12Z" fill="#A259FF"/>
                        <path d="M8 4C8 1.8 9.8 0 12 0C14.2 0 16 1.8 16 4C16 6.2 14.2 8 12 8H8V4Z" fill="#F24E1E"/>
                        <path d="M8 8H12C14.2 8 16 9.8 16 12C16 14.2 14.2 16 12 16C9.8 16 8 14.2 8 12V8Z" fill="#0ACF83"/>
                        <path d="M0 20C0 17.8 1.8 16 4 16H8V20C8 22.2 6.2 24 4 24C1.8 24 0 22.2 0 20Z" fill="#1ABC9C"/>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Available For Row */}
              <div className="group/row flex justify-between items-center py-5 px-6 hover:bg-white/[0.02] transition-colors duration-300 relative overflow-hidden">
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-gradient-to-b from-[#8c47e8] to-[#ab76f2] scale-y-0 group-hover/row:scale-y-100 transition-transform duration-300 origin-center rounded-r" />
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-medium transition-colors group-hover/row:text-zinc-400">
                  AVAILABLE FOR
                </span>
                <span className="font-sans text-sm font-medium text-zinc-100">
                  Freelance • Collaborations
                </span>
              </div>

              {/* Mail Copy Row */}
              <div className="group/row flex justify-between items-center py-5 px-6 hover:bg-white/[0.02] transition-colors duration-300 relative overflow-hidden">
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-gradient-to-b from-[#8c47e8] to-[#ab76f2] scale-y-0 group-hover/row:scale-y-100 transition-transform duration-300 origin-center rounded-r" />
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-medium transition-colors group-hover/row:text-zinc-400">
                  MAIL
                </span>
                <button
                  onClick={copyEmail}
                  className="font-sans text-sm font-medium text-zinc-100 hover:text-[#a78bfa] transition-colors flex items-center gap-1.5 group/link cursor-pointer"
                >
                  <span>sumeetshah24@gmail.com</span>
                  {copyStatus === 'copied' ? (
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider ml-1">[ COPIED ]</span>
                  ) : (
                    <ArrowUpRight size={13} className="text-[#742DE1] opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-300" />
                  )}
                </button>
              </div>

              {/* Instagram Row */}
              <div className="group/row flex justify-between items-center py-5 px-6 hover:bg-white/[0.02] transition-colors duration-300 relative overflow-hidden">
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-gradient-to-b from-[#8c47e8] to-[#ab76f2] scale-y-0 group-hover/row:scale-y-100 transition-transform duration-300 origin-center rounded-r" />
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-medium transition-colors group-hover/row:text-zinc-400">
                  INSTAGRAM
                </span>
                <a
                  href="https://www.instagram.com/sumeetism/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-sans text-sm font-medium text-zinc-100 hover:text-[#a78bfa] transition-colors flex items-center gap-1.5 group/link cursor-pointer"
                >
                  <span>@sumeetism</span>
                  <ArrowUpRight size={13} className="text-[#742DE1] opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Music Presence System */}
        <div className="lg:col-span-5 h-full">
          {loading ? (
            /* SKELETON LOADING CARD */
            <div className="luxury-glass-panel relative h-full flex flex-col justify-between p-6 rounded-2xl shadow-2xl overflow-hidden min-h-[480px] border-zinc-800/80 animate-pulse">
              {/* Glows */}
              <div className="absolute -right-24 -top-24 w-60 h-60 rounded-full blur-[100px] pointer-events-none bg-[#742DE1]/4" />
              
              <div className="space-y-6 w-full relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-950 pb-4 select-none">
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-600"></span>
                    </span>
                    <span>LOADING LIVE SYSTEM...</span>
                  </div>
                  <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest font-light">
                    ♫ LIVE PRESENCE
                  </span>
                </div>

                {/* Cover Skeleton */}
                <div className="w-full relative aspect-square rounded-xl overflow-hidden border border-zinc-900/80 bg-zinc-950/40 shadow-2xl flex flex-col justify-end p-5">
                  <div className="cd-sheen" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-shimmer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                  
                  <div className="relative z-10 space-y-3">
                    <div className="h-5 w-24 bg-zinc-900/80 border border-zinc-800/50 rounded-md" />
                    <div className="h-7 w-2/3 bg-zinc-900/80 rounded" />
                    <div className="h-3.5 w-1/3 bg-zinc-900/40 rounded" />
                  </div>
                </div>

                {/* History Skeleton */}
                <div className="space-y-4 w-full">
                  <div className="divide-y divide-zinc-900/40 border border-zinc-900/30 rounded-xl bg-zinc-950/15 overflow-hidden">
                    {[1, 2, 3].map((val) => (
                      <div key={val} className="flex items-center gap-4 py-4 px-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.015] to-transparent -translate-x-full animate-shimmer" />
                        <div className="w-11 h-11 rounded bg-zinc-950 border border-zinc-900/50 shrink-0 relative overflow-hidden">
                          <div className="absolute inset-0 bg-zinc-900/20" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="h-4 w-28 bg-zinc-900/60 rounded" />
                            <div className="h-2 w-10 bg-zinc-900/40 rounded" />
                          </div>
                          <div className="h-3 w-20 bg-zinc-900/30 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Disclaimer */}
              <div className="border-t border-zinc-950 pt-4 flex justify-between items-center text-[10px] font-mono text-zinc-600 z-10 relative select-none">
                <div className="h-3.5 w-20 bg-zinc-900/30 rounded" />
                <span>♫</span>
              </div>
            </div>
          ) : tracks.length > 0 ? (
            /* REAL MUSIC CARD (Only after data is fetched successfully) */
            <div className={`luxury-glass-panel relative h-full flex flex-col justify-between p-6 rounded-2xl transition-all duration-1000 shadow-2xl overflow-hidden min-h-[480px] ${
              tracks[0].currentlyPlaying 
                ? 'shadow-[0_0_50px_-12px_rgba(29,185,84,0.12)] border-emerald-900/30' 
                : 'border-zinc-800/80'
            } hover:border-zinc-700/50`}>
              
              {/* Ambient background glows inside card */}
              <div className={`absolute -right-24 -top-24 w-60 h-60 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ${
                tracks[0].currentlyPlaying 
                  ? 'bg-[#1DB954]/8' 
                  : 'bg-[#742DE1]/6'
              }`} />
              <div className={`absolute -left-24 -bottom-24 w-60 h-60 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ${
                tracks[0].currentlyPlaying 
                  ? 'bg-[#742DE1]/5' 
                  : 'bg-[#1DB954]/1'
              }`} />

              <div className="space-y-6 w-full relative z-10">
                {/* Top Header Badge */}
                <div className="flex items-center justify-between border-b border-zinc-950 pb-4 select-none">
                  {tracks[0].currentlyPlaying ? (
                    <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#1DB954] uppercase">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DB954] shadow-[0_0_6px_#1DB954]"></span>
                      </span>
                      <span>LISTENING IN REAL-TIME</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                      <span>RECENTLY PLAYED</span>
                    </div>
                  )}
                  <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest font-light">
                    ♫ LIVE PRESENCE
                  </span>
                </div>

                {/* LATEST ROTATION */}
                <div className="w-full relative">
                  <a
                    href={tracks[0].songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group block relative aspect-square w-full rounded-xl overflow-hidden border transition-all duration-700 shadow-2xl cursor-pointer ${
                      tracks[0].currentlyPlaying 
                        ? 'border-emerald-500/25 shadow-[0_0_35px_-5px_rgba(29,185,84,0.15)] hover:shadow-[0_0_40px_-2px_rgba(29,185,84,0.25)]' 
                        : 'border-zinc-900/80 hover:border-zinc-800'
                    }`}
                  >
                    <img 
                      src={tracks[0].albumImageUrl} 
                      alt={tracks[0].album} 
                      onError={handleImageError}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 select-none"
                    />
                    <div className="cd-sheen" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                    {tracks[0].currentlyPlaying && (
                      <div className="absolute top-4 left-4 bg-emerald-500/90 text-black font-mono text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded shadow-[0_4px_12px_rgba(0,0,0,0.5)] z-20 flex items-center gap-1.5 animate-pulse">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-black"></span>
                        </span>
                        LIVE NOW
                      </div>
                    )}

                    <div className="absolute bottom-5 left-5 right-5 text-left z-10">
                      <span className={`font-mono text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-md backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.5)] inline-flex items-center gap-2 transition-colors duration-500 ${
                        tracks[0].currentlyPlaying 
                          ? 'text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/25' 
                          : 'text-zinc-400 bg-zinc-950/60 border border-zinc-800/30'
                      }`}>
                        {tracks[0].currentlyPlaying ? (
                          <>
                            <Equalizer />
                            <span className="font-semibold tracking-widest">NOW PLAYING</span>
                          </>
                        ) : (
                          <span>LATEST // {formatRelativeTime(tracks[0].playedAt)}</span>
                        )}
                      </span>
                      <h3 className="font-sans font-bold text-xl sm:text-2xl text-white tracking-tight leading-snug mt-3 drop-shadow-lg truncate">
                        {tracks[0].title}
                      </h3>
                      <p className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase mt-1 drop-shadow-md truncate">
                        {tracks[0].artist}
                      </p>
                    </div>
                    
                    <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/65 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-[#1DB954] group-hover:border-[#1DB954]/45 group-hover:scale-105 transition-all duration-300 backdrop-blur-sm z-20">
                      <ArrowUpRight size={14} />
                    </div>

                    {tracks[0].currentlyPlaying && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-zinc-950/60 overflow-hidden z-20">
                        <motion.div 
                          animate={{ 
                            x: ['-100%', '100%']
                          }}
                          transition={{ 
                            duration: 3.5, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                          className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#1DB954] to-transparent opacity-90" 
                        />
                      </div>
                    )}
                  </a>
                </div>

                {/* RECENT MUSIC ARCHIVE LOG FEED */}
                <div className="space-y-4 w-full">
                  <div className="divide-y divide-zinc-900/40 border border-zinc-900/30 rounded-xl bg-zinc-950/15 overflow-hidden">
                    {tracks.slice(1, 4).map((track, idx) => (
                      <a
                        key={idx}
                        href={track.songUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/row flex items-center gap-4 py-4 px-4 hover:bg-white/[0.015] transition-all duration-300 relative overflow-hidden block cursor-pointer"
                      >
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-[2.5px] bg-[#1DB954] scale-y-0 group-hover/row:scale-y-100 transition-transform duration-300 origin-center rounded-r shadow-[0_0_8px_#1DB954]" />
                        <div className="w-11 h-11 rounded overflow-hidden shrink-0 border border-zinc-900/50 bg-zinc-950 relative">
                          <img 
                            src={track.albumImageUrl} 
                            alt={track.album} 
                            onError={handleImageError}
                            className="w-full h-full object-cover transform group-hover/row:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="font-sans font-medium text-sm text-zinc-200 truncate group-hover/row:text-white transition-colors">
                              {track.title}
                            </h4>
                            <span className="font-mono text-[8px] text-[#742DE1] group-hover/row:text-[#a78bfa] tracking-wider shrink-0 uppercase select-none transition-colors">
                              {formatRelativeTime(track.playedAt)}
                            </span>
                          </div>
                          <p className="font-mono text-[10px] text-zinc-500 truncate mt-1 group-hover/row:text-zinc-400 transition-colors tracking-wide">
                            {track.artist}
                          </p>
                        </div>
                        <div className="text-zinc-700 group-hover/row:text-[#1DB954] transition-colors shrink-0 duration-300">
                          <ArrowUpRight size={13} />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-950 pt-4 flex justify-between items-center text-[10px] font-mono text-zinc-500 z-10 relative select-none">
                <span>LIVE SOUNDTRACK</span>
                <span>♫</span>
              </div>
            </div>
          ) : (
            /* EMPTY/OFFLINE STATE */
            <div className="luxury-glass-panel relative h-full flex flex-col justify-between p-6 rounded-2xl border-zinc-800/80 shadow-2xl overflow-hidden min-h-[480px]">
              <div className="absolute -right-24 -top-24 w-60 h-60 rounded-full blur-[100px] pointer-events-none bg-[#742DE1]/3" />
              
              <div className="space-y-6 w-full relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-950 pb-4 select-none">
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
                    <span>SYSTEM OFFLINE</span>
                  </div>
                  <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest font-light">
                    ♫ LIVE PRESENCE
                  </span>
                </div>

                {/* Centered Offline Message */}
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 my-auto">
                  <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-900/60 flex items-center justify-center text-zinc-500 shadow-inner">
                    ♫
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-sans font-medium text-sm text-zinc-300">Live Soundfeed Offline</h3>
                    <p className="font-mono text-[10px] text-zinc-500 max-w-[200px] leading-relaxed mx-auto">
                      Unable to connect to Last.fm stream. Check back later.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Disclaimer */}
              <div className="border-t border-zinc-950 pt-4 flex justify-between items-center text-[10px] font-mono text-zinc-600 z-10 relative select-none">
                <span>OFFLINE</span>
                <span>♫</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
