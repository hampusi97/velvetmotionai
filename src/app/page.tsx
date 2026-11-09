"use client";

import React, { useState, useRef, useEffect } from "react";
import { VIPModal, CryptoAdBanner } from "../components/Monetization";
import { 
  Upload, Sparkles, Play, Download, Wand2, RefreshCw, Zap, Film, Eye, 
  Volume2, VolumeX, Heart, Compass, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Maximize2, RotateCw, Flame, Share2
} from "lucide-react";

interface KissStamp {
  id: number;
  x: number;
  y: number;
}

interface CursorParticle {
  id: number;
  x: number;
  y: number;
}

export default function Home() {
  // Intro Kiss State
  const [showIntro, setShowIntro] = useState(true);
  const [isVIPOpen, setIsVIPOpen] = useState(false);
  const [kissTriggered, setKissTriggered] = useState(false);
  const [kissImpact, setKissImpact] = useState(false);

  // Interactive Screen Tap-to-Kiss Stamping
  const [kissStamps, setKissStamps] = useState<KissStamp[]>([]);
  const [cursorParticles, setCursorParticles] = useState<CursorParticle[]>([]);

  // Ambient Audio Player State
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<any[]>([]);

  // Studio State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [motionIntensity, setMotionIntensity] = useState(70);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Vibe Pills & Director Presets
  const presetVibes = [
    "✨ Gentle Smile & Wink",
    "🌪️ Slow Motion Wind Blowing Hair",
    "🎥 360 Cinematic Orbit",
    "⚡ Cyberpunk Neon Reflections",
    "💋 Lips Parting & Soft Gaze",
    "🔥 Hyper-Realistic Camera Push-In"
  ];

  // Community Showcase Items
  const showcaseFeed = [
    {
      id: 1,
      title: "Neon Rain Cyber-Girl",
      creator: "@velvet_aura",
      views: "18.4K",
      img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      prompt: "Cyberpunk girl standing under rain, neon pink hair, slow motion camera orbit, soft eye contact, 60fps"
    },
    {
      id: 2,
      title: "Tokyo Sakura Bloom",
      creator: "@sakura_ai",
      views: "24.9K",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      prompt: "Portrait in blooming cherry blossoms, wind blowing petals, gentle smile, camera push-in cinematic 4k"
    },
    {
      id: 3,
      title: "Midnight Runway Gaze",
      creator: "@noir_motion",
      views: "31.2K",
      img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      prompt: "High-fashion model walking towards camera in slow-motion, sunglasses flash, hair flowing in wind"
    }
  ];

  // Neon Cursor Trail
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.6) {
        const newParticle = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
        setCursorParticles((prev) => [...prev.slice(-12), newParticle]);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Tap anywhere on screen to leave a kiss stamp
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Avoid stamping when clicking buttons, inputs, or interactive controls
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("input") || target.closest("textarea") || target.closest("a")) {
      return;
    }

    const newKiss: KissStamp = { id: Date.now(), x: e.clientX, y: e.clientY };
    setKissStamps((prev) => [...prev.slice(-10), newKiss]);

    // Clean up stamp after animation
    setTimeout(() => {
      setKissStamps((prev) => prev.filter((k) => k.id !== newKiss.id));
    }, 1400);
  };

  // Ambient Synth Pad (Web Audio API - 100% Free, zero external files)
  const toggleAmbientMusic = () => {
    if (isMusicPlaying) {
      synthNodesRef.current.forEach((n) => {
        try { n.stop(); n.disconnect(); } catch (e) {}
      });
      synthNodesRef.current = [];
      setIsMusicPlaying(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      // Chord frequencies for a dreamy ambient synthwave pad (F minor9)
      const freqs = [174.61, 220.00, 261.63, 311.13, 392.00];
      const nodes: any[] = [];

      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(600, ctx.currentTime);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        nodes.push(osc);
      });

      synthNodesRef.current = nodes;
      setIsMusicPlaying(true);
    } catch (err) {
      console.log("Audio not supported", err);
    }
  };

  // Intro Welcome Sequence
  const handleEnterExperience = () => {
    setKissTriggered(true);

    setTimeout(() => {
      setKissImpact(true);
      // Play pop sound
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.12);
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.16);
        }
      } catch (e) {}

      // AI voice
      if ("speechSynthesis" in window) {
        setTimeout(() => {
          const u = new SpeechSynthesisUtterance("Welcome to Velvet Motion");
          u.rate = 0.9;
          u.pitch = 1.2;
          window.speechSynthesis.speak(u);
        }, 350);
      }
    }, 450);

    setTimeout(() => {
      setShowIntro(false);
      toggleAmbientMusic(); // Auto-start ambient synth on enter
    }, 2400);
  };

  // Camera Director Buttons
  const applyCameraMotion = (motionType: string) => {
    const motionTags: { [key: string]: string } = {
      up: "[Camera: Slow Tilt Up ⬆️]",
      down: "[Camera: Slow Tilt Down ⬇️]",
      left: "[Camera: Pan Left ⬅️]",
      right: "[Camera: Pan Right ➡️]",
      zoom: "[Camera: Cinematic Push-In 🔍]",
      orbit: "[Camera: 360° Circular Orbit 🔄]"
    };
    const tag = motionTags[motionType] || "";
    setPrompt((prev) => (prev ? `${prev}, ${tag}` : tag));
  };

  // Remix Community Card
  const handleRemix = (item: typeof showcaseFeed[0]) => {
    setImagePreview(item.img);
    setPrompt(item.prompt);
    setVideoUrl(null);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setVideoUrl(null);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a motion prompt or select a vibe tag!");
      return;
    }

    setIsGenerating(true);
    setVideoUrl(null);

    const steps = [
      "Analyzing facial vectors & lighting...",
      "Simulating prompt physics...",
      "Generating neural motion frames...",
      "Polishing 60fps MP4 video..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setStatusMessage(steps[i]);
      await new Promise((r) => setTimeout(r, 550));
    }

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      if (selectedFile) formData.append("file", selectedFile);

      const res = await fetch("/api/generate-video", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
      }
    } catch (err) {
      console.error(err);
      alert("Generation failed, please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      onClick={handleScreenClick}
      className="min-h-screen flex flex-col bg-[#09090D] text-white relative overflow-x-hidden cursor-default select-none"
    >
      {/* Dynamic Cursor Sparkles */}
      {cursorParticles.map((p) => (
        <div
          key={p.id}
          style={{ left: `${p.x}px`, top: `${p.y}px` }}
          className="fixed pointer-events-none w-2 h-2 rounded-full bg-neonPink/70 blur-[1px] animate-ping z-50 transform -translate-x-1/2 -translate-y-1/2"
        />
      ))}

      {/* Floating Lipstick Stamps from Clicks */}
      {kissStamps.map((kiss) => (
        <div
          key={kiss.id}
          style={{ left: `${kiss.x - 28}px`, top: `${kiss.y - 20}px` }}
          className="fixed pointer-events-none z-40 animate-float-kiss"
        >
          <svg viewBox="0 0 100 70" className="w-14 h-auto text-neonPink fill-current filter drop-shadow-[0_0_12px_#FF007F]">
            <path d="M50 15 C40 5, 20 5, 10 20 C18 24, 30 22, 50 30 C70 22, 82 24, 90 20 C80 5, 60 5, 50 15 Z" />
            <path d="M10 28 C25 35, 38 33, 50 38 C62 33, 75 35, 90 28 C75 55, 65 65, 50 60 C35 65, 25 55, 10 28 Z" />
          </svg>
        </div>
      ))}

      {/* 💋 Intro Kiss Overlay */}
      {showIntro && (
        <div
          onClick={handleEnterExperience}
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer transition-opacity duration-1000 ${
            kissImpact ? "bg-black/85 backdrop-blur-3xl" : "bg-black/95 backdrop-blur-2xl"
          }`}
        >
          <div className="absolute h-96 w-96 rounded-full bg-neonPink/25 blur-[150px] pointer-events-none" />
          <div className="absolute h-96 w-96 rounded-full bg-neonPurple/20 blur-[160px] pointer-events-none" />

          {!kissTriggered ? (
            <div className="text-center z-10 px-6 animate-pulse flex flex-col items-center gap-5">
              <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-neonPink via-neonFuchsia to-neonPurple shadow-2xl shadow-neonPink/50">
                <div className="w-full h-full rounded-full bg-[#09090D] flex items-center justify-center">
                  <Heart className="w-10 h-10 text-neonPink animate-bounce" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  VELVET<span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPink to-neonPurple">MOTION</span>
                </h2>
                <p className="text-sm text-zinc-400 mt-2 tracking-widest uppercase font-medium">
                  Tap anywhere to enter studio
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-zinc-300">
                <Volume2 className="w-3.5 h-3.5 text-neonPink" />
                <span>Turn audio on for welcome kiss</span>
              </div>
            </div>
          ) : (
            <div className="relative flex flex-col items-center justify-center z-20">
              <div className={`transition-all duration-300 transform flex flex-col items-center ${kissImpact ? "scale-100 opacity-100 rotate-[-8deg]" : "scale-150 opacity-0 rotate-0"}`}>
                <svg viewBox="0 0 100 70" className="w-48 sm:w-60 h-auto filter drop-shadow-[0_0_35px_#FF007F] text-neonPink fill-current">
                  <path d="M50 15 C40 5, 20 5, 10 20 C18 24, 30 22, 50 30 C70 22, 82 24, 90 20 C80 5, 60 5, 50 15 Z" />
                  <path d="M10 28 C25 35, 38 33, 50 38 C62 33, 75 35, 90 28 C75 55, 65 65, 50 60 C35 65, 25 55, 10 28 Z" />
                </svg>
                <div className="absolute inset-0 rounded-full border-2 border-neonPink/60 animate-ping pointer-events-none" />
                <div className="mt-8 text-center">
                  <p className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neonPink via-neonFuchsia to-white">
                    "Welcome to VelvetMotion"
                  </p>
                  <p className="text-xs text-zinc-400 mt-2 uppercase tracking-widest">Entering AI Studio...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090D]/80 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-neonPink via-neonFuchsia to-neonPurple p-[2px] shadow-lg shadow-neonPink/30">
            <div className="h-full w-full bg-[#09090D] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-neonPink" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              VELVET<span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPink to-neonPurple">MOTION</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">AI Motion Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* VIP Bitcoin Button */}
          <button
            onClick={() => setIsVIPOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-neonPink/20 border border-amber-500/40 text-xs text-amber-300 hover:scale-105 transition-all shadow-lg shadow-amber-500/10 font-bold"
          >
            <span>⚡</span> VIP / Tip (BTC)
          </button>

          <button
            onClick={() => { setShowIntro(true); setKissTriggered(false); setKissImpact(false); }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-zinc-300 hover:border-neonPink transition-all"
          >
            <span>💋</span> Replay Intro
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-neonPink font-bold">Free Access</span>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-5 py-2 rounded-full font-semibold text-xs tracking-wide bg-gradient-to-r from-neonPink via-neonFuchsia to-neonPurple hover:opacity-95 shadow-lg shadow-neonPink/25 transition-all"
          >
            Create
          </button>
        </div>
      </header>

      {/* Main Studio Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Controls */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Upload Box */}
          <div className="p-6 rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 hover:border-neonPurple/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Film className="w-4 h-4 text-neonPink" /> 1. Upload Character or Photo
              </label>
              {imagePreview && (
                <button
                  onClick={() => { setImagePreview(null); setSelectedFile(null); }}
                  className="text-xs text-zinc-400 hover:text-rose-400 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Remove
                </button>
              )}
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl cursor-pointer p-6 flex flex-col items-center justify-center transition-all ${
                imagePreview ? "border-neonPink/50 bg-black/40" : "border-white/15 hover:border-neonPink hover:bg-white/[0.02]"
              }`}
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

              {imagePreview ? (
                <div className="relative group w-full flex items-center justify-center">
                  <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg object-contain shadow-2xl border border-white/10" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-lg text-xs font-semibold text-white">
                    Click to replace
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-neonPurple/20 flex items-center justify-center text-neonFuchsia mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-white mb-1">Click or drag & drop photo here</p>
                  <p className="text-xs text-zinc-400">JPG, PNG, WEBP (Portraits recommended)</p>
                </div>
              )}
            </div>
          </div>

          {/* Prompt + 3D Camera Director Pad */}
          <div className="p-6 rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 hover:border-neonPink/40 transition-all">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 mb-3">
              <Wand2 className="w-4 h-4 text-neonPurple" /> 2. Motion Prompt & Virtual Director
            </label>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the motion... or click the Director Pad arrows below!"
              rows={3}
              className="w-full rounded-xl bg-black/40 border border-white/10 p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-neonPink focus:ring-1 focus:ring-neonPink transition-all"
            />

            {/* 🕹️ 3D Virtual Director Camera Pad */}
            <div className="mt-5 p-4 rounded-xl bg-black/30 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-neonFuchsia" /> Camera Director Pad
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Click directions to inject cinematic motion angles</p>
              </div>

              {/* D-Pad Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => applyCameraMotion("left")}
                  className="p-2 rounded-lg bg-white/[0.05] hover:bg-neonPink/20 hover:border-neonPink/50 border border-white/10 text-zinc-300 transition-all active:scale-95"
                  title="Pan Left"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyCameraMotion("up")}
                    className="p-2 rounded-lg bg-white/[0.05] hover:bg-neonPink/20 hover:border-neonPink/50 border border-white/10 text-zinc-300 transition-all active:scale-95"
                    title="Tilt Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyCameraMotion("down")}
                    className="p-2 rounded-lg bg-white/[0.05] hover:bg-neonPink/20 hover:border-neonPink/50 border border-white/10 text-zinc-300 transition-all active:scale-95"
                    title="Tilt Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => applyCameraMotion("right")}
                  className="p-2 rounded-lg bg-white/[0.05] hover:bg-neonPink/20 hover:border-neonPink/50 border border-white/10 text-zinc-300 transition-all active:scale-95"
                  title="Pan Right"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyCameraMotion("zoom")}
                  className="p-2 rounded-lg bg-white/[0.05] hover:bg-neonFuchsia/20 hover:border-neonFuchsia/50 border border-white/10 text-zinc-300 transition-all active:scale-95"
                  title="Push-In Zoom"
                >
                  <Maximize2 className="w-4 h-4 text-neonFuchsia" />
                </button>
                <button
                  type="button"
                  onClick={() => applyCameraMotion("orbit")}
                  className="p-2 rounded-lg bg-white/[0.05] hover:bg-neonPurple/20 hover:border-neonPurple/50 border border-white/10 text-zinc-300 transition-all active:scale-95"
                  title="360° Orbit"
                >
                  <RotateCw className="w-4 h-4 text-neonPurple" />
                </button>
              </div>
            </div>

            {/* Vibe Chips */}
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Click inspiration vibe tags:
              </p>
              <div className="flex flex-wrap gap-2">
                {presetVibes.map((vibe, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt((prev) => (prev ? `${prev}, ${vibe}` : vibe))}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-zinc-300 hover:text-white hover:border-neonPink hover:bg-neonPink/10 transition-all active:scale-95"
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders & Aspect Ratio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/10">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2 text-zinc-300">
                  <span>Motion Intensity</span>
                  <span className="text-neonPink">{motionIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={motionIntensity}
                  onChange={(e) => setMotionIntensity(Number(e.target.value))}
                  className="w-full accent-neonPink bg-zinc-800 rounded-lg cursor-pointer h-1.5"
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-zinc-300 block mb-2">Aspect Ratio</span>
                <div className="grid grid-cols-3 gap-2">
                  {["9:16", "16:9", "1:1"].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`text-xs py-1.5 rounded-lg border font-medium transition-all ${
                        aspectRatio === ratio
                          ? "bg-neonFuchsia/20 border-neonFuchsia text-white"
                          : "border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 ${
                isGenerating
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-neonPink via-neonFuchsia to-neonPurple hover:opacity-95 shadow-neonPink/30 hover:scale-[1.01] active:scale-[0.99]"
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-neonPink" />
                  Generating Motion Video...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Generate Video
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Column (5 cols): Preview Studio */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 relative overflow-hidden flex flex-col min-h-[460px]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-neonFuchsia" /> Real-time Video Studio
            </h2>

            <div className="flex-1 rounded-xl bg-black/60 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden p-4">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-white/10 border-t-neonPink animate-spin" />
                    <Sparkles className="w-7 h-7 text-neonFuchsia absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{statusMessage}</p>
                    <p className="text-xs text-zinc-500 mt-1">Applying prompt motion vectors</p>
                  </div>
                </div>
              ) : videoUrl ? (
                <div className="w-full h-full flex flex-col items-center justify-between">
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full max-h-[380px] rounded-lg shadow-2xl object-cover border border-white/10"
                  />
                  <div className="w-full flex items-center justify-between gap-3 mt-4">
                    <a
                      href={videoUrl}
                      download="velvetmotion.mp4"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <Download className="w-4 h-4 text-neonPink" /> Download MP4
                    </a>
                    <button
                      onClick={handleGenerate}
                      className="py-2.5 px-4 rounded-xl bg-neonPurple/20 hover:bg-neonPurple/30 border border-neonPurple/40 text-xs font-semibold text-neonPurple flex items-center justify-center gap-2 transition-all"
                    >
                      <RefreshCw className="w-4 h-4" /> Re-roll
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/10 mx-auto flex items-center justify-center text-zinc-500">
                    <Play className="w-6 h-6 ml-1 text-zinc-600" />
                  </div>
                  <p className="text-sm font-medium text-zinc-400">Ready to generate</p>
                  <p className="text-xs text-zinc-600 max-w-xs">
                    Upload an image or pick a trending community style below!
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* A-Ads & BTC Support Banner */}
      <CryptoAdBanner />

      {/* 🔥 Community Inspiration Feed with 1-Click Remix */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-neonPink" /> Trending Inspiration Feed
            </h2>
            <p className="text-xs text-zinc-400">Click &ldquo;Remix&rdquo; on any video to load its style into your studio</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300">
            🔥 34k renders today
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {showcaseFeed.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl bg-white/[0.02] border border-white/10 hover:border-neonPink/50 overflow-hidden backdrop-blur-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[9/12] w-full overflow-hidden bg-black">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-zinc-300 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-neonPink" /> {item.views}
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-neonPink/20 backdrop-blur-md border border-neonPink/40 text-[10px] font-bold text-neonPink">
                  HOT
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white group-hover:text-neonPink transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-[11px] text-zinc-500">{item.creator}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2 italic">
                    &ldquo;{item.prompt}&rdquo;
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemix(item)}
                  className="w-full py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase bg-white/[0.04] hover:bg-gradient-to-r hover:from-neonPink hover:to-neonPurple border border-white/10 hover:border-transparent text-white transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-98"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Remix This Style
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🎵 Floating Ambient Synthwave Music Widget */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={toggleAmbientMusic}
          className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#12101C]/90 border border-white/15 hover:border-neonPink/50 backdrop-blur-2xl shadow-2xl transition-all group"
        >
          <div className="w-7 h-7 rounded-full bg-neonPurple/20 flex items-center justify-center text-neonFuchsia group-hover:scale-105 transition-transform">
            {isMusicPlaying ? <Volume2 className="w-4 h-4 text-neonPink" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
          </div>

          <div className="text-left hidden sm:block">
            <p className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <span>Cyberpunk Ambient</span>
              {isMusicPlaying && (
                <span className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 bg-neonPink rounded-full animate-eq-1" />
                  <span className="w-0.5 bg-neonFuchsia rounded-full animate-eq-2" />
                  <span className="w-0.5 bg-neonPurple rounded-full animate-eq-3" />
                  <span className="w-0.5 bg-neonPink rounded-full animate-eq-4" />
                </span>
              )}
            </p>
            <p className="text-[9px] text-zinc-400 uppercase tracking-wider">
              {isMusicPlaying ? "Audio Live (Playing)" : "Click to Play Ambient Pad"}
            </p>
          </div>
        </button>
      </div>

      {/* VIP Bitcoin Modal */}
      <VIPModal isOpen={isVIPOpen} onClose={() => setIsVIPOpen(false)} />

    </div>
  );
}
