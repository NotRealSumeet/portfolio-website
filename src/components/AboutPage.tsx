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
}

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

const DEFAULT_TRACKS: SpotifyTrack[] = [
  {
    title: "BEAUTY AND THE BEAST",
    artist: "Kanye West",
    album: "BULLY",
    albumImageUrl: "/spotify/bully.png",
    songUrl: "https://open.spotify.com/album/5poA9SAx0Xiz1cf17fWBLS",
    playedAt: Date.now() - 120000
  },
  {
    title: "NIGHTCALL",
    artist: "Kavinsky",
    album: "Outrun",
    albumImageUrl: "/spotify/nightcall.png",
    songUrl: "https://open.spotify.com/track/0mt02gJ425X5zI743g3Iuu",
    playedAt: Date.now() - 3600000
  },
  {
    title: "STARBOY",
    artist: "The Weeknd",
    album: "Starboy",
    albumImageUrl: "/spotify/starboy.png",
    songUrl: "https://open.spotify.com/track/7i5i5VzK82I27V0pE33W6X",
    playedAt: Date.now() - 14400000
  },
  {
    title: "MIDNIGHT CITY",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    albumImageUrl: "/spotify/midnightcity.png",
    songUrl: "https://open.spotify.com/track/1eyZp2GMQI27JbpZ78jLci",
    playedAt: Date.now() - 86400000
  }
];

interface AboutPageProps {
  onBack: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [tracks, setTracks] = useState<SpotifyTrack[]>(DEFAULT_TRACKS);

  const copyEmail = () => {
    navigator.clipboard.writeText("sumeetshah24@gmail.com");
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const fetchRecentlyPlayed = async () => {
    try {
      const res = await fetch('/api/spotify/now-playing');
      if (res.ok) {
        const data = await res.json() as { tracks: SpotifyTrack[] };
        if (data.tracks && data.tracks.length > 0) {
          setTracks(data.tracks);
        }
      }
    } catch (err) {
      console.error('Error fetching Spotify recently played:', err);
    }
  };

  // Poll Spotify status every 30 seconds
  useEffect(() => {
    fetchRecentlyPlayed();
    const pollInterval = setInterval(fetchRecentlyPlayed, 30000);
    return () => clearInterval(pollInterval);
  }, []);

  const latestTrack = tracks[0] || DEFAULT_TRACKS[0];
  const historyTracks = tracks.slice(1, 4);

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
        <div className="lg:col-span-7 space-y-12 relative">
          
          {/* Identity Title */}
          <div className="space-y-4">
            <h1 className="font-sans text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-none">
              I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8c47e8] via-[#ab76f2] to-[#c084fc] drop-shadow-[0_2px_15px_rgba(140,71,232,0.35)] relative font-black">Sumit Shah</span>
            </h1>
          </div>

          {/* Biography Paragraphs */}
          <div className="space-y-6 text-zinc-200 font-sans text-lg sm:text-xl leading-relaxed font-light tracking-wide max-w-2xl border-l border-zinc-800/50 pl-6">
            <p>
              A graphic designer focused on thumbnails, posters, cover art, and visual storytelling. 
              My work combines Swiss typography principles with experimental layouts, texture-heavy compositions, and modern internet visual culture.
            </p>
            <p className="text-zinc-400 text-base sm:text-lg">
              I enjoy balancing structured design systems with raw expressive visuals, constructing interactive experiences, and developing atmospheric digital systems.
            </p>
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

        {/* RIGHT COLUMN: Authentic Recently Played Soundtrack Archive */}
        <div className="lg:col-span-5 h-full">
          <div className="luxury-glass-panel relative h-full flex flex-col justify-between p-6 rounded-2xl transition-all duration-500 shadow-2xl overflow-hidden min-h-[480px] border-zinc-800/80 hover:border-zinc-700/80">
            
            {/* Cyber Glow background orb */}
            <div className="absolute -right-24 -top-24 w-52 h-52 rounded-full blur-3xl pointer-events-none bg-[#742DE1]/12" />

            <div className="space-y-6 w-full">
              {/* Top Header Badge */}
              <div className="flex items-center justify-between z-10 relative select-none">
                <div className="flex items-center gap-2 bg-[#1DB954]/10 border border-[#1DB954]/25 px-2.5 py-1 rounded-full text-[9px] font-mono text-[#1DB954] tracking-widest uppercase shadow-[0_0_8px_rgba(29,185,84,0.08)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] shadow-[0_0_6px_#1DB954]" />
                  CONNECTED // SUMEETISM
                </div>
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                  MUSIC DOSSIER
                </span>
              </div>

              {/* LATEST ROTATION: Showcasing the single most recent track sleeve */}
              <div className="space-y-4 z-10 relative">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block select-none">
                  // LATEST ROTATION
                </span>
                
                <a
                  href={latestTrack.songUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block relative aspect-square w-full rounded-xl overflow-hidden border border-zinc-900/80 shadow-2xl cursor-pointer"
                >
                  <img 
                    src={latestTrack.albumImageUrl} 
                    alt={latestTrack.album} 
                    className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-700 select-none"
                  />
                  
                  {/* CD Metallic Sheen Reflection layer */}
                  <div className="cd-sheen" />

                  {/* Gradient bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Dynamic absolute text overlay inside the cover */}
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <span className="font-mono text-[8px] text-[#1DB954] tracking-widest uppercase bg-black/60 border border-[#1DB954]/30 px-2 py-0.5 rounded backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                      LATEST // {formatRelativeTime(latestTrack.playedAt)}
                    </span>
                    <h3 className="font-sans font-bold text-lg sm:text-xl text-white tracking-tight leading-tight mt-2 drop-shadow-md truncate">
                      {latestTrack.title}
                    </h3>
                    <p className="font-mono text-[10px] text-zinc-300 tracking-wide uppercase drop-shadow-md truncate">
                      {latestTrack.artist}
                    </p>
                  </div>
                  
                  {/* Tiny Hover Indicator icon */}
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/65 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-[#1DB954] group-hover:border-[#1DB954]/45 group-hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                    <ArrowUpRight size={14} />
                  </div>
                </a>
              </div>

              {/* RECENT MUSIC ARCHIVE LOG FEED */}
              <div className="space-y-3 z-10 relative">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block select-none">
                  // RECENT LISTEN HISTORY
                </span>

                <div className="divide-y divide-zinc-900/80 border border-zinc-900/60 rounded-xl bg-zinc-950/20 overflow-hidden">
                  {historyTracks.map((track, idx) => (
                    <a
                      key={idx}
                      href={track.songUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/row flex items-center gap-3.5 py-3.5 px-4 hover:bg-white/[0.02] transition-all duration-300 relative overflow-hidden block cursor-pointer"
                    >
                      {/* Left glowing slider indicator */}
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-[2.5px] bg-[#1DB954] scale-y-0 group-hover/row:scale-y-100 transition-transform duration-300 origin-center rounded-r shadow-[0_0_8px_#1DB954]" />

                      {/* Small thumbnail artwork */}
                      <div className="w-10 h-10 rounded overflow-hidden shrink-0 border border-zinc-900 bg-zinc-950 relative">
                        <img 
                          src={track.albumImageUrl} 
                          alt={track.album} 
                          className="w-full h-full object-cover transform group-hover/row:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-sans font-semibold text-sm text-zinc-200 truncate group-hover/row:text-white transition-colors">
                            {track.title}
                          </h4>
                          <span className="font-mono text-[8px] text-zinc-500 group-hover/row:text-zinc-400 tracking-wider shrink-0 uppercase select-none">
                            {formatRelativeTime(track.playedAt)}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-zinc-400 truncate mt-0.5 group-hover/row:text-zinc-300 transition-colors">
                          {track.artist}
                        </p>
                      </div>

                      {/* External Arrow hover reveal */}
                      <div className="text-zinc-600 group-hover/row:text-[#1DB954] transition-colors shrink-0">
                        <ArrowUpRight size={13} />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="border-t border-zinc-900/60 pt-4 flex justify-between items-center text-[8px] font-mono text-zinc-600 z-10 relative select-none">
              <span>STATUS // API COMPLIANT</span>
              <span>SYNCHRONIZED WITH SPOTIFY</span>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
}
