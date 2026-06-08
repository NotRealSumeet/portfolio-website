import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface SpotifyTrack {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  previewUrl: string;
  progressMs: number;
  durationMs: number;
  timestamp: number;
}

const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const formatTimeAgo = (timestamp: number) => {
  if (!timestamp) return 'OFFLINE';
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'JUST NOW';
  if (mins < 60) return `${mins}M AGO`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}H AGO`;
  return 'RECENTLY';
};

const BACKUP_PLAYLIST: SpotifyTrack[] = [
  {
    isPlaying: false,
    title: "BEAUTY AND THE BEAST",
    artist: "Kanye West",
    album: "BULLY",
    albumImageUrl: "https://i.scdn.co/image/ab67616d0000b27395184f6a953569b683ca9a0d",
    songUrl: "https://open.spotify.com/album/5poA9SAx0Xiz1cf17fWBLS",
    previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    progressMs: 0,
    durationMs: 192000,
    timestamp: Date.now()
  },
  {
    isPlaying: false,
    title: "NIGHTCALL",
    artist: "Kavinsky",
    album: "Outrun",
    albumImageUrl: "https://i.scdn.co/image/ab67616d0000b273616a2b8e3a34a36fcfb839ef",
    songUrl: "https://open.spotify.com/track/0mt02gJ425X5zI743g3Iuu",
    previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    progressMs: 0,
    durationMs: 258000,
    timestamp: Date.now()
  },
  {
    isPlaying: false,
    title: "STARBOY",
    artist: "The Weeknd",
    album: "Starboy",
    albumImageUrl: "https://i.scdn.co/image/ab67616d0000b2734718dec6954e4477c7f215b6",
    songUrl: "https://open.spotify.com/track/7i5i5VzK82I27V0pE33W6X",
    previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    progressMs: 0,
    durationMs: 230000,
    timestamp: Date.now()
  },
  {
    isPlaying: false,
    title: "MIDNIGHT CITY",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    albumImageUrl: "https://i.scdn.co/image/ab67616d0000b2730b2e2d0f5e173e6cf1e4a113",
    songUrl: "https://open.spotify.com/track/1eyZp2GMQI27JbpZ78jLci",
    previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    progressMs: 0,
    durationMs: 243000,
    timestamp: Date.now()
  }
];

interface AboutPageProps {
  onBack: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [spotifyData, setSpotifyData] = useState<SpotifyTrack | null>(null);
  
  // Playlist / Playback Queue State
  const [playlist, setPlaylist] = useState<SpotifyTrack[]>(BACKUP_PLAYLIST);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(30);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const copyEmail = () => {
    navigator.clipboard.writeText("sumeetshah24@gmail.com");
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const fetchNowPlaying = async () => {
    try {
      const res = await fetch('/api/spotify/now-playing');
      if (res.ok) {
        const data = await res.json() as SpotifyTrack;
        setSpotifyData(data);
        // Sync progress only if local audio is not playing (so they don't fight)
        if (!isAudioPlaying && currentTrackIndex === 0) {
          setCurrentProgress(data.progressMs);
        }
      }
    } catch (err) {
      console.error('Error fetching Spotify now playing:', err);
    }
  };

  // Poll Spotify status
  useEffect(() => {
    fetchNowPlaying();
    const pollInterval = setInterval(fetchNowPlaying, 10000);
    return () => clearInterval(pollInterval);
  }, [isAudioPlaying, currentTrackIndex]);

  // Sync API song progress ticker (when local preview is NOT playing and showing the live song)
  useEffect(() => {
    if (currentTrackIndex !== 0 || !spotifyData || !spotifyData.isPlaying || isAudioPlaying) return;

    const tickInterval = setInterval(() => {
      setCurrentProgress((prev) => {
        if (prev >= spotifyData.durationMs) {
          clearInterval(tickInterval);
          fetchNowPlaying();
          return spotifyData.durationMs;
        }
        return prev + 1000;
      });
    }, 1000);

    return () => clearInterval(tickInterval);
  }, [spotifyData, isAudioPlaying, currentTrackIndex]);

  // Sync playlist[0] when live spotifyData changes
  useEffect(() => {
    if (spotifyData) {
      setPlaylist(prev => {
        const exists = prev.some(t => t.title.toLowerCase() === spotifyData.title.toLowerCase() && t.artist.toLowerCase() === spotifyData.artist.toLowerCase());
        if (exists) {
          return prev.map((t, idx) => {
            if (t.title.toLowerCase() === spotifyData.title.toLowerCase() && t.artist.toLowerCase() === spotifyData.artist.toLowerCase()) {
              return { ...t, isPlaying: spotifyData.isPlaying, progressMs: spotifyData.progressMs };
            }
            return t;
          });
        } else {
          // Keep API song at index 0 and clear duplicate back-up instances
          const filtered = BACKUP_PLAYLIST.filter(t => t.title.toLowerCase() !== spotifyData.title.toLowerCase());
          return [spotifyData, ...filtered];
        }
      });
    }
  }, [spotifyData]);

  // Sync audio source when track changes
  useEffect(() => {
    const activeTrack = playlist[currentTrackIndex];
    if (audioRef.current && activeTrack?.previewUrl) {
      const wasPlaying = isAudioPlaying;
      audioRef.current.src = activeTrack.previewUrl;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(() => setIsAudioPlaying(false));
      } else {
        setAudioProgress(0);
      }
    }
  }, [currentTrackIndex, playlist]);

  // Handle local audio time updates
  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setAudioProgress(audioRef.current.currentTime);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration || 30);
    }
  };

  // Toggle local playback preview audio
  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!audioRef.current) return;

    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsAudioPlaying(true))
        .catch((err) => {
          console.error("Local audio playback blocked/failed:", err);
          setIsAudioPlaying(false);
        });
    }
  };

  // Next Track
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAudioProgress(0);
    setIsAudioPlaying(true);
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  // Previous Track
  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAudioProgress(0);
    setIsAudioPlaying(true);
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  // Seek Progress
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newPercentage = clickX / width;
    const newTime = newPercentage * audioDuration;
    
    audioRef.current.currentTime = newTime;
    setAudioProgress(newTime);
    
    if (!isAudioPlaying) {
      audioRef.current.play()
        .then(() => setIsAudioPlaying(true))
        .catch(() => setIsAudioPlaying(false));
    }
  };

  const activeTrack = playlist[currentTrackIndex] || BACKUP_PLAYLIST[0];

  // Select progress and duration dynamically based on whether preview is playing
  const isCurrentlyShowingLive = currentTrackIndex === 0 && spotifyData?.isPlaying && !isAudioPlaying;
  const displayProgress = isAudioPlaying ? audioProgress : (isCurrentlyShowingLive ? currentProgress / 1000 : 0);
  const displayDuration = isAudioPlaying ? audioDuration : (activeTrack.durationMs || 1000) / 1000;
  const progressPercent = Math.min(100, Math.max(0, (displayProgress / displayDuration) * 100));

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

      {/* Hidden HTML5 Audio Element for track preview playback */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleAudioTimeUpdate}
        onLoadedMetadata={handleAudioLoadedMetadata}
        onPlay={() => setIsAudioPlaying(true)}
        onPause={() => setIsAudioPlaying(false)}
        onEnded={() => {
          setIsAudioPlaying(false);
          setAudioProgress(0);
        }}
        preload="metadata"
      />

      {/* Dynamic Background Atmospheric Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 0.95, 1],
          opacity: [0.05, 0.1, 0.07, 0.05],
          x: [0, 15, -20, 0],
          y: [0, -25, 15, 0]
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-10 left-10 w-[450px] h-[450px] rounded-full bg-[#742DE1] blur-[130px] pointer-events-none select-none z-0" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 0.88, 1.12, 1],
          opacity: [0.02, 0.05, 0.03, 0.02],
          x: [0, -20, 20, 0],
          y: [0, 15, -20, 0]
        }}
        transition={{ 
          duration: 22, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-32 right-10 w-[400px] h-[400px] rounded-full bg-[#1DB954] blur-[125px] pointer-events-none select-none z-0" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.08, 0.92, 1],
          opacity: [0.03, 0.07, 0.04, 0.03],
          x: [15, -15, 10, 15],
          y: [-15, 20, -10, -15]
        }}
        transition={{ 
          duration: 25, 
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
          
          {/* Cyber Dossier Corner Mark */}
          <div className="hidden sm:block absolute -left-12 top-14 font-mono text-[9px] text-zinc-700 rotate-90 origin-left tracking-[0.3em] select-none">
            INDEX // 02_ABOUT_DOSSIER
          </div>

          {/* Identity Title */}
          <div className="space-y-4">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] block select-none">
              [ SECTION 02 // DOSSIER ]
            </span>
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

        {/* RIGHT COLUMN: Interactive Spotify Status Widget */}
        <div className="lg:col-span-5 h-full">
          <div className={`luxury-glass-panel relative h-full flex flex-col justify-between p-6 rounded-2xl transition-all duration-500 shadow-2xl overflow-hidden min-h-[460px] ${
            isAudioPlaying 
              ? 'luxury-glow-green border-[#1DB954]/45 shadow-[0_0_35px_rgba(29,185,84,0.18)]' 
              : 'luxury-glow-purple border-zinc-800/80 hover:border-zinc-700/80'
          }`}>
            
            {/* Cyber Glow background orb */}
            <div className={`absolute -right-24 -top-24 w-52 h-52 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
              isAudioPlaying ? 'bg-[#1DB954]/18' : 'bg-[#742DE1]/12'
            }`} />

            {/* Top Header Badge */}
            <div className="flex items-center justify-between z-10 relative select-none">
              {currentTrackIndex === 0 && spotifyData?.isPlaying ? (
                <div className="flex items-center gap-2 bg-[#1DB954]/10 border border-[#1DB954]/30 px-2.5 py-1 rounded-full text-[9px] font-mono text-[#1DB954] tracking-widest uppercase shadow-[0_0_10px_rgba(29,185,84,0.15)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] shadow-[0_0_8px_#1DB954] animate-pulse" />
                  LIVE NOW
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800/80 px-2.5 py-1 rounded-full text-[9px] font-mono text-zinc-400 tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-650" />
                  {currentTrackIndex === 0 ? "LAST PLAYED" : "PREVIEW PLAYER"}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                {/* Animated Equalizer when local audio or spotify is actively playing */}
                {(isAudioPlaying || (currentTrackIndex === 0 && spotifyData?.isPlaying)) && (
                  <div className="flex items-end gap-[2px] h-3 w-4 select-none">
                    <div className="w-[2px] bg-[#1DB954] rounded-t-sm animate-[eq-bar-1_0.8s_ease-in-out_infinite] shadow-[0_0_4px_rgba(29,185,84,0.4)]" />
                    <div className="w-[2px] bg-[#1DB954] rounded-t-sm animate-[eq-bar-2_0.6s_ease-in-out_infinite] shadow-[0_0_4px_rgba(29,185,84,0.4)]" />
                    <div className="w-[2px] bg-[#1DB954] rounded-t-sm animate-[eq-bar-3_0.7s_ease-in-out_infinite] shadow-[0_0_4px_rgba(29,185,84,0.4)]" />
                    <div className="w-[2px] bg-[#1DB954] rounded-t-sm animate-[eq-bar-4_0.5s_ease-in-out_infinite] shadow-[0_0_4px_rgba(29,185,84,0.4)]" />
                  </div>
                )}
                <span className="font-mono text-[9px] text-[#1DB954] uppercase tracking-widest font-semibold">
                  SPOTIFY
                </span>
              </div>
            </div>

            {/* Center Album Art with hover interactive overlay */}
            <div className="my-6 aspect-square w-full rounded-xl overflow-hidden border border-zinc-900/80 relative shadow-inner z-10 select-none group">
              <img 
                src={activeTrack.albumImageUrl} 
                alt={activeTrack.album} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 select-none"
              />
              
              {/* CD Metallic Sheen Reflection layer */}
              <div className={`cd-sheen ${isAudioPlaying ? 'animate-spin-slow' : ''}`} />

              {/* Visual playing state gradient overlay */}
              <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                isAudioPlaying ? 'bg-black/35 bg-gradient-to-t from-black/60 to-[#1DB954]/8' : 'bg-gradient-to-t from-black/60 via-transparent to-transparent'
              }`} />

              {/* Center Play/Pause Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <button
                  onClick={handlePlayPause}
                  className={`pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(116,45,225,0.4)] hover:shadow-[0_0_25px_rgba(29,185,84,0.6)] backdrop-blur-md ${
                    isAudioPlaying 
                      ? 'bg-zinc-950/85 border border-[#1DB954] text-[#1DB954] opacity-90 scale-95 hover:scale-100' 
                      : 'bg-black/75 border border-[#742DE1] text-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 hover:bg-zinc-950/90'
                  }`}
                  title={isAudioPlaying ? "Pause Preview" : "Play Preview"}
                >
                  {isAudioPlaying ? (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 fill-current translate-x-[2px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Metadata & Controls */}
            <div className="space-y-5 z-10 relative">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <a
                    href={activeTrack.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block max-w-full font-sans font-bold text-xl text-zinc-100 tracking-tight leading-tight hover:text-[#1DB954] transition-colors line-clamp-1 cursor-pointer"
                  >
                    {activeTrack.title}
                  </a>
                  <p className="font-mono text-xs text-zinc-400 tracking-wide uppercase mt-1 line-clamp-1">
                    {activeTrack.artist}
                  </p>
                  <p className="font-sans text-[10px] text-zinc-500 mt-1.5 uppercase tracking-wider line-clamp-1 select-none">
                    {activeTrack.album}
                  </p>
                </div>
                
                {/* External Link Out to Spotify */}
                <a
                  href={activeTrack.songUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700/80 text-zinc-400 hover:text-[#1DB954] transition-all duration-300"
                  title="Open on Spotify"
                >
                  <ArrowUpRight size={16} />
                </a>
              </div>

              {/* Dynamic Interactive Progress Bar (either Spotify live or local audio playback) */}
              <div className="space-y-2">
                <div 
                  onClick={handleProgressClick}
                  className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden relative border border-zinc-900/40 cursor-pointer group/progress-bar"
                  title={isAudioPlaying ? "Click to seek" : "Preview playback to seek"}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-[#742DE1] via-[#a78bfa] to-[#1DB954] rounded-full shadow-[0_0_8px_rgba(29,185,84,0.45)] transition-all duration-100"
                    style={{ width: `${progressPercent}%` }}
                  />
                  {isAudioPlaying && (
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border border-[#1DB954] opacity-0 group-hover/progress-bar:opacity-100 transition-opacity duration-150 shadow-[0_0_6px_#1DB954]"
                      style={{ left: `calc(${progressPercent}% - 6px)` }}
                    />
                  )}
                </div>
                <div className="flex justify-between font-mono text-[9px] text-zinc-500 select-none">
                  <span>{formatTime(displayProgress)}</span>
                  <span>{formatTime(displayDuration)}</span>
                </div>
              </div>

              {/* Brushed-Metal Deck Audio Controls */}
              <div className="flex items-center justify-center gap-6 py-1 select-none">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-lg border border-transparent hover:border-zinc-800/80 bg-transparent hover:bg-zinc-900/50 text-zinc-400 hover:text-[#1DB954] transition-all cursor-pointer hover:scale-105 active:scale-95 duration-200"
                  title="Previous Track"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                  </svg>
                </button>

                <button
                  onClick={handlePlayPause}
                  className={`p-3.5 rounded-full transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-center ${
                    isAudioPlaying 
                      ? 'bg-[#1DB954] text-black hover:bg-[#1DB954] hover:shadow-[0_4px_20px_rgba(29,185,84,0.5)]' 
                      : 'bg-white text-black hover:bg-white hover:shadow-[0_4px_20px_rgba(255,255,255,0.3)]'
                  }`}
                  title={isAudioPlaying ? "Pause Preview" : "Play Preview"}
                >
                  {isAudioPlaying ? (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 fill-current translate-x-[1px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-lg border border-transparent hover:border-zinc-800/80 bg-transparent hover:bg-zinc-900/50 text-zinc-400 hover:text-[#1DB954] transition-all cursor-pointer hover:scale-105 active:scale-95 duration-200"
                  title="Next Track"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18l8.5-6L6 6zm9-12v12h2V6z"/>
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
