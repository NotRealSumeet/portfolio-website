import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Globe, 
  ArrowUpRight, 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Repeat, 
  Shuffle, 
  Volume2, 
  VolumeX,
  Sparkles
} from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

const TRACKS = [
  {
    title: "PREACHER MAN",
    artist: "Ye",
    album: "BULLY",
    duration: "2:48",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "BEAUTY AND THE BEAST",
    artist: "Ye",
    album: "BULLY",
    duration: "3:12",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "FATHER",
    artist: "Ye (feat. Travis Scott)",
    album: "BULLY",
    duration: "3:24",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    title: "DAMN",
    artist: "Ye",
    album: "BULLY",
    duration: "4:02",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  }
];

const TOOLS_DATA = [
  {
    name: "Photoshop",
    fullName: "Adobe Photoshop",
    glowColor: "rgba(0, 200, 255, 0.12)",
    icon: (
      <svg className="w-8 h-8 transition-transform" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="#001C2A" stroke="#00C8FF" strokeWidth="1.5" />
        <text x="10" y="26" fill="#00C8FF" fontSize="16" fontFamily="var(--font-sans)" fontWeight="bold">P</text>
        <text x="21" y="26" fill="#00C8FF" fontSize="16" fontFamily="var(--font-sans)" fontWeight="bold">s</text>
      </svg>
    )
  },
  {
    name: "Illustrator",
    fullName: "Adobe Illustrator",
    glowColor: "rgba(255, 156, 0, 0.12)",
    icon: (
      <svg className="w-8 h-8 transition-transform" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="#261300" stroke="#FF9C00" strokeWidth="1.5" />
        <text x="11" y="26" fill="#FF9C00" fontSize="16" fontFamily="var(--font-sans)" fontWeight="bold">A</text>
        <text x="22" y="26" fill="#FF9C00" fontSize="16" fontFamily="var(--font-sans)" fontWeight="bold">i</text>
      </svg>
    )
  },
  {
    name: "After Effects",
    fullName: "Adobe After Effects",
    glowColor: "rgba(209, 38, 255, 0.12)",
    icon: (
      <svg className="w-8 h-8 transition-transform" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="#1C002A" stroke="#D126FF" strokeWidth="1.5" />
        <text x="10" y="26" fill="#D126FF" fontSize="16" fontFamily="var(--font-sans)" fontWeight="bold">A</text>
        <text x="21" y="26" fill="#D126FF" fontSize="16" fontFamily="var(--font-sans)" fontWeight="bold">e</text>
      </svg>
    )
  },
  {
    name: "Figma",
    fullName: "Figma Design",
    glowColor: "rgba(242, 78, 30, 0.12)",
    icon: (
      <svg className="w-8 h-8 transition-transform" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="#1E1E1E" stroke="#F24E1E" strokeWidth="1.5" />
        <g transform="translate(12, 8)">
          <path d="M0 4C0 1.8 1.8 0 4 0C6.2 0 8 1.8 8 4V8H4C1.8 8 0 6.2 0 4Z" fill="#F24E1E"/>
          <path d="M0 12C0 9.8 1.8 8 4 8H8V16H4C1.8 16 0 14.2 0 12Z" fill="#A259FF"/>
          <path d="M8 4C8 1.8 9.8 0 12 0C14.2 0 16 1.8 16 4C16 6.2 14.2 8 12 8H8V4Z" fill="#F24E1E"/>
          <path d="M8 8H12C14.2 8 16 9.8 16 12C16 14.2 14.2 16 12 16C9.8 16 8 14.2 8 12V8Z" fill="#0ACF83"/>
          <path d="M0 20C0 17.8 1.8 16 4 16H8V20C8 22.2 6.2 24 4 24C1.8 24 0 22.2 0 20Z" fill="#1ABC9C"/>
        </g>
      </svg>
    )
  }
];

export default function AboutPage({ onBack }: AboutPageProps) {
  const [activeTab, setActiveTab] = useState<'deck' | 'stream'>('deck');
  
  // Media Player States
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(1); // Default to BEAUTY AND THE BEAST
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  // Handle Playback State Hooks
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = TRACKS[currentTrackIndex].url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log("Audio play blocked:", err));
      } else {
        setCurrentTime(0);
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.log("Audio play blocked by browser:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Sync initial settings & provide page cleanup
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    handleNextTrack();
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      audioRef.current.muted = newVol === 0;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.muted = newMuted;
  };

  const handleNextTrack = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => console.log(err));
      }
      return;
    }
    if (isShuffle) {
      const rand = Math.floor(Math.random() * TRACKS.length);
      setCurrentTrackIndex(rand);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    }
  };

  const handlePrevTrack = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    if (isShuffle) {
      const rand = Math.floor(Math.random() * TRACKS.length);
      setCurrentTrackIndex(rand);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    }
  };

  const selectTrack = (idx: number) => {
    setCurrentTrackIndex(idx);
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("sumeetshah24@gmail.com");
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-12 pb-24"
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        preload="metadata"
      />

      {/* HEADER: Return action */}
      <div className="flex items-center justify-between border-b border-[#111111] pb-6 select-none">
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

      {/* 2-COLUMN PREMIUM DASHBOARD LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-4">
        
        {/* LEFT COLUMN: Main identity / Biography / Info Panel */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-4">
            <span className="font-mono text-xs text-[#742DE1] uppercase tracking-[0.25em] block">
              // PLAYER DOSSIER
            </span>
            <h2 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase leading-none">
              I’M <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#742DE1] via-[#8c47e8] to-[#ab76f2] font-black relative drop-shadow-[0_0_15px_rgba(116,45,225,0.25)]">SUMIT SHAH</span>
            </h2>
          </div>

          <div className="h-[1px] bg-zinc-900 w-full" />

          {/* Redesigned Premium Editorial Typography about text */}
          <div className="space-y-6">
            <p className="font-sans text-lg sm:text-xl lg:text-2xl text-zinc-300 leading-relaxed font-light tracking-wide">
              A graphic designer focused on thumbnails, posters, cover art, and visual storytelling. 
              My work combines Swiss typography principles with experimental layouts, texture-heavy compositions, and modern internet visual culture. 
              I enjoy balancing structured design systems with raw expressive visuals.
            </p>
          </div>

          {/* Premium Glassmorphic Info Panel */}
          <div className="bg-[#050508]/40 backdrop-blur-xl border border-zinc-900 p-6 md:p-8 rounded-2xl relative overflow-hidden group shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-6">
            {/* Interactive soft ambient gradients */}
            <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full bg-[#742DE1]/5 blur-3xl pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#742DE1]/[0.005] to-[#742DE1]/[0.02] pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-sm relative z-10">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">Location</span>
                <span className="font-sans font-medium text-zinc-200 flex items-center gap-1.5">
                  <span className="text-[#742DE1] font-bold">IN</span> Navi Mumbai, India
                </span>
              </div>
              
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">Availability</span>
                <span className="flex items-center gap-2 font-sans font-medium text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                  Active // Open to Projects
                </span>
              </div>
              
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">Email</span>
                <button
                  onClick={copyEmail}
                  className="font-sans font-medium text-zinc-200 hover:text-[#742DE1] transition-colors flex items-center gap-1.5 group/link cursor-pointer text-left"
                >
                  <span>sumeetshah24@gmail.com</span>
                  {copyStatus === 'copied' ? (
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider">[ COPIED ]</span>
                  ) : (
                    <ArrowUpRight size={13} className="text-[#742DE1] opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                  )}
                </button>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">Instagram</span>
                <a
                  href="https://www.instagram.com/sumeetism/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-sans font-medium text-zinc-200 hover:text-[#742DE1] transition-colors flex items-center gap-1.5 group/link cursor-pointer"
                >
                  @sumeetism
                  <ArrowUpRight size={13} className="text-[#742DE1] opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                </a>
              </div>
            </div>

            {/* Tools Row inside panel */}
            <div className="border-t border-zinc-900/80 pt-6 mt-6 relative z-10 space-y-4">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">
                // CORE SOFTWARE ENVIRONMENT
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {TOOLS_DATA.map((tool) => (
                  <div 
                    key={tool.name} 
                    className="relative group/tool flex items-center gap-3 bg-[#0d0d12]/90 border border-zinc-900 hover:border-zinc-800 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.5)] overflow-hidden"
                  >
                    {/* Hover Glow Layer */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover/tool:opacity-100 transition-opacity duration-300 pointer-events-none" 
                      style={{ backgroundColor: tool.glowColor }}
                    />
                    
                    <div className="group-hover/tool:scale-105 group-hover/tool:-rotate-2 transition-transform duration-300 relative z-10 shrink-0">
                      {tool.icon}
                    </div>
                    
                    <div className="flex flex-col relative z-10">
                      <span className="text-xs font-bold text-zinc-300 group-hover/tool:text-white transition-colors">{tool.name}</span>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Expert</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Media / Music Player Card */}
        <div className="lg:col-span-5 h-full">
          <div className="bg-[#050508]/60 backdrop-blur-xl border border-zinc-900 p-6 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between group h-full">
            {/* Cyber Glow background orb */}
            <div className="absolute -right-24 -top-24 w-52 h-52 rounded-full bg-[#742DE1]/10 blur-3xl pointer-events-none group-hover:bg-[#742DE1]/15 transition-colors duration-500" />
            
            {/* Player Header with cyber label and Tabs */}
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#742DE1] animate-ping" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">MEDIA PLAYER v1.2</span>
                </div>
                <span className="font-mono text-[9px] text-[#742DE1] font-bold">CONNECTED</span>
              </div>
              
              {/* Tab Switcher */}
              <div className="grid grid-cols-2 bg-[#08080c] p-1 rounded-xl border border-zinc-900/80">
                <button
                  onClick={() => setActiveTab('deck')}
                  className={`relative py-2 text-center text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                    activeTab === 'deck' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {activeTab === 'deck' && (
                    <motion.div
                      layoutId="playerActiveTab"
                      className="absolute inset-0 bg-[#742DE1]/10 border border-[#742DE1]/25 rounded-lg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">SYSTEM DECK</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('stream')}
                  className={`relative py-2 text-center text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                    activeTab === 'stream' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {activeTab === 'stream' && (
                    <motion.div
                      layoutId="playerActiveTab"
                      className="absolute inset-0 bg-[#742DE1]/10 border border-[#742DE1]/25 rounded-lg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">SPOTIFY STREAM</span>
                </button>
              </div>
            </div>
            
            {/* Dynamic Card Content */}
            <div className="mt-5 relative z-10 flex-grow">
              <AnimatePresence mode="wait">
                {activeTab === 'deck' ? (
                  <motion.div
                    key="deck-content"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    {/* Generative Interactive Vinyl Cover */}
                    <div className="relative w-full h-40 flex items-center justify-center bg-[#07070b]/80 border border-zinc-900 rounded-xl overflow-hidden py-4">
                      {/* Grid background on cover container */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#08080c_1px,transparent_1px),linear-gradient(to_bottom,#08080c_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
                      
                      {/* Cover Art Box */}
                      <div className="absolute left-6 z-10 w-28 h-28 bg-gradient-to-br from-[#0c0c10] to-[#171720] border border-[#23232b] shadow-[0_8px_24px_rgba(0,0,0,0.8)] flex flex-col justify-between p-3 rounded-lg select-none">
                        <span className="font-mono text-[7px] text-[#742DE1] tracking-widest uppercase flex items-center gap-1">
                          <Sparkles size={8} className="animate-pulse" /> LP // STEREO
                        </span>
                        <div className="text-center my-auto">
                          <h3 className="font-sans font-black text-lg text-zinc-100 tracking-tighter uppercase leading-none">BULLY</h3>
                          <p className="font-mono text-[6px] text-zinc-500 tracking-[0.25em] mt-1 uppercase">BY YE</p>
                        </div>
                        <div className="flex justify-between items-center text-[5px] font-mono text-zinc-600">
                          <span>2026 // RELEASE</span>
                          <span>12TH ALBUM</span>
                        </div>
                      </div>
                      
                      {/* Rotating Vinyl Record */}
                      <motion.div
                        className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-[#141416] via-[#09090c] to-[#010101] border border-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.9)] flex items-center justify-center"
                        animate={{
                          x: isPlaying ? 40 : 0,
                          rotate: isPlaying ? 360 : 0
                        }}
                        transition={{
                          x: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                          rotate: isPlaying ? { duration: 8, repeat: Infinity, ease: 'linear' } : { duration: 0.6 }
                        }}
                        style={{ zIndex: 0 }}
                      >
                        {/* Vinyl Grooves */}
                        <div className="absolute inset-1 rounded-full border border-zinc-900/50 opacity-70" />
                        <div className="absolute inset-2 rounded-full border border-zinc-900/70 opacity-50" />
                        <div className="absolute inset-4 rounded-full border border-zinc-900/90 opacity-35" />
                        
                        {/* Center sticker */}
                        <div className="w-8 h-8 rounded-full bg-[#742DE1] border border-black flex items-center justify-center relative shadow-[inset_0_0_6px_rgba(0,0,0,0.7)]">
                          <div className="w-1.5 h-1.5 rounded-full bg-black" />
                          <span className="absolute text-[4px] font-mono text-white tracking-widest font-black bottom-0.5 select-none">BULLY</span>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Song Metadata Details */}
                    <div className="text-center space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#742DE1] font-bold">
                        // NOW DECRYPTING
                      </span>
                      <h4 className="font-sans font-black text-xl text-zinc-100 tracking-tight leading-tight">
                        {TRACKS[currentTrackIndex].title}
                      </h4>
                      <p className="font-mono text-xs text-zinc-400 tracking-wide uppercase">
                        {TRACKS[currentTrackIndex].artist} — {TRACKS[currentTrackIndex].album}
                      </p>
                    </div>
                    
                    {/* Animated Equalizer Waveform */}
                    <div className="h-9 flex items-end justify-center gap-[3px] bg-[#07070b]/60 rounded-xl p-2 border border-zinc-900/50">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-[3px] bg-[#742DE1] rounded-t-sm"
                          animate={isPlaying ? {
                            height: [4, Math.random() * 22 + 4, 4]
                          } : {
                            height: 4
                          }}
                          transition={isPlaying ? {
                            duration: 0.6 + Math.random() * 0.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.03
                          } : {
                            duration: 0.3
                          }}
                          style={{
                            backgroundColor: `rgba(116, 45, 225, ${0.45 + (i % 8) * 0.07})`
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Slider Timeline Progress */}
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleProgressChange}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#742DE1] focus:outline-none transition-all duration-300 hover:bg-zinc-700/80"
                      />
                      <div className="flex justify-between font-mono text-[9px] text-zinc-500 select-none">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                    
                    {/* Playback Button Actions & Vol Controls */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-center gap-6">
                        <button
                          onClick={() => setIsShuffle(!isShuffle)}
                          className={`text-zinc-500 hover:text-white transition-colors cursor-pointer p-1.5 ${isShuffle ? 'text-[#742DE1] drop-shadow-[0_0_6px_rgba(116,45,225,0.4)] font-bold' : ''}`}
                          title="Shuffle"
                        >
                          <Shuffle size={14} />
                        </button>
                        
                        <button
                          onClick={handlePrevTrack}
                          className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1.5"
                          title="Previous Track"
                        >
                          <SkipBack size={18} />
                        </button>
                        
                        <button
                          onClick={togglePlay}
                          className="w-12 h-12 rounded-full bg-[#742DE1] hover:bg-[#8543e8] text-white flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(116,45,225,0.4)] hover:shadow-[0_0_24px_rgba(116,45,225,0.6)] cursor-pointer"
                          title={isPlaying ? "Pause" : "Play"}
                        >
                          {isPlaying ? <Pause size={18} className="fill-white" /> : <Play size={18} className="fill-white translate-x-[1px]" />}
                        </button>
                        
                        <button
                          onClick={handleNextTrack}
                          className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1.5"
                          title="Next Track"
                        >
                          <SkipForward size={18} />
                        </button>
                        
                        <button
                          onClick={() => setIsRepeat(!isRepeat)}
                          className={`text-zinc-500 hover:text-white transition-colors cursor-pointer p-1.5 ${isRepeat ? 'text-[#742DE1] drop-shadow-[0_0_6px_rgba(116,45,225,0.4)] font-bold' : ''}`}
                          title="Repeat"
                        >
                          <Repeat size={14} />
                        </button>
                      </div>
                      
                      {/* Audio Level Volume control */}
                      <div className="flex items-center justify-center gap-2 max-w-xs mx-auto w-full">
                        <button onClick={toggleMute} className="text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer">
                          {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-24 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#742DE1] focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    {/* Integrated Playlist Directory */}
                    <div className="border-t border-zinc-900 pt-4 mt-1 space-y-3">
                      <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block select-none">
                        // TRACK ARCHIVE CATALOGUE
                      </span>
                      <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1 scrollbar-thin">
                        {TRACKS.map((track, idx) => {
                          const isActive = currentTrackIndex === idx;
                          return (
                            <button
                              key={track.title}
                              onClick={() => selectTrack(idx)}
                              className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs transition-all duration-300 group/item cursor-pointer ${
                                isActive
                                  ? 'bg-[#742DE1]/10 border-[#742DE1]/25 text-white shadow-[0_0_12px_rgba(116,45,225,0.08)] font-medium'
                                  : 'bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="font-mono text-[9px] text-zinc-600 group-hover/item:text-zinc-400 transition-colors w-4">
                                  {(idx + 1).toString().padStart(2, '0')}
                                </span>
                                <div className="min-w-0">
                                  <p className="font-medium truncate">{track.title}</p>
                                  <p className="text-[9px] font-mono text-zinc-500 uppercase truncate mt-[2px]">{track.artist}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0 ml-4">
                                {isActive && isPlaying ? (
                                  <span className="text-[8px] font-mono text-[#742DE1] tracking-wider uppercase font-bold animate-pulse">PLAYING</span>
                                ) : null}
                                <span className="font-mono text-[9px] text-zinc-500">{track.duration}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="stream-content"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    {/* Embedded Spotify IFrame Wrapped elegantly */}
                    <div className="w-full bg-[#050508]/80 rounded-2xl border border-zinc-900 p-3 shadow-2xl relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[#742DE1]/[0.01] pointer-events-none" />
                      <iframe 
                        src="https://open.spotify.com/embed/album/5poA9SAx0Xiz1cf17fWBLS?utm_source=generator&theme=0" 
                        width="100%" 
                        height="352" 
                        frameBorder="0" 
                        allowFullScreen={true}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy"
                        className="rounded-xl relative z-10 border border-zinc-900 bg-black/40 shadow-inner"
                      />
                    </div>
                    
                    <div className="text-center font-mono text-[9px] text-zinc-500 leading-relaxed uppercase select-none">
                      // SPOTIFY EMBED INTEGRATION. STREAM SOUND DIRECTLY ON WEB STAGE.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>

      <div className="h-[1px] bg-[#111111] w-full pt-1" />

      {/* RETURN BUTTON ACTION FOOTER */}
      <div className="flex justify-start select-none">
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
