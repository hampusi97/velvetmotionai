"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Upload, Sparkles, Play, Download, Wand2, RefreshCw, Zap, Film, Eye, 
  Volume2, VolumeX, Heart, Compass, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Maximize2, RotateCw, Flame, Gift, Phone, PhoneOff, BookOpen, User, Smile, MessageCircle
} from "lucide-react";
import { VIPModal, CryptoAdBanner } from "../components/Monetization";

interface Persona {
  id: string;
  name: string;
  title: string;
  avatar: string;
  video: string;
  voicePhrase: string;
  diary: string;
  outfits: string[];
  scenes: string[];
}

export default function Home() {
  // Intro State
  const [showIntro, setShowIntro] = useState(true);
  const [kissTriggered, setKissTriggered] = useState(false);
  const [kissImpact, setKissImpact] = useState(false);

  // Screen Tap-to-Kiss Stamps & Particles
  const [kissStamps, setKissStamps] = useState<{ id: number; x: number; y: number }[]>([]);
  const [cursorParticles, setCursorParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Personas Hub
  const personas: Persona[] = [
    {
      id: "elena",
      name: "Elena",
      title: "Cyberpunk Rebel",
      avatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voicePhrase: "Hey trouble. Ready to break some rules tonight?",
      diary: "He called me again. Under the neon rain, everything felt electric. I wonder if he feels the same way...",
      outfits: ["Cyberpunk Leather", "Combat Harness", "Neon Mesh Top", "Oversized Bomber"],
      scenes: ["Tokyo Rain Alley", "Underground Club VIP", "Cyber Rooftop", "Hacker Den"]
    },
    {
      id: "aria",
      name: "Aria",
      title: "Tokyo Gamer & Sweetheart",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      voicePhrase: "You're finally here! I was waiting for you to play together...",
      diary: "I blushed so hard when he looked at me today! He makes my heart flutter every time we talk...",
      outfits: ["Pastel Cozy Hoodie", "Anime School Uniform", "Silk Pajamas", "Cat-Ear Headset Fit"],
      scenes: ["Sakura Garden", "RGB Gaming Room", "Cozy Bedroom", "Akihabara Arcade"]
    },
    {
      id: "chloe",
      name: "Chloe",
      title: "Luxury Glamour Muse",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      voicePhrase: "Good evening handsome. Pour some champagne and sit with me.",
      diary: "A gentleman who knows what he wants. He sent me roses today and my heart completely melted...",
      outfits: ["Silk Evening Dress", "Diamond Choker & Blazer", "Satin Corset", "Golden Bikini"],
      scenes: ["Penthouse Terrace", "Monaco Yacht Deck", "VIP Champagne Lounge", "Grand Piano Room"]
    }
  ];

  const [activePersona, setActivePersona] = useState<Persona>(personas[0]);
  const [activeTab, setActiveTab] = useState<"studio" | "diary">("studio");

  // Affection & Intimacy System
  const [affectionPoints, setAffectionPoints] = useState(65);
  const getIntimacyLevel = (pts: number) => {
    if (pts < 25) return { level: 1, name: "Stranger" };
    if (pts < 50) return { level: 2, name: "Crush" };
    if (pts < 75) return { level: 3, name: "Intimate Lover" };
    return { level: 5, name: "Soulmate (VIP)" };
  };

  // FaceTime Simulator State
  const [isCalling, setIsCalling] = useState(false);
  const [callConnected, setCallConnected] = useState(false);

  // VIP Bitcoin Modal State
  const [isVIPOpen, setIsVIPOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<{ name: string; amount: string } | null>(null);

  // Ambient Music State
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<any[]>([]);

  // Studio Generator State
  const [imagePreview, setImagePreview] = useState<string | null>(personas[0].avatar);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("Gentle smile, camera slow push-in, cinematic lighting");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [motionIntensity, setMotionIntensity] = useState(70);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(personas[0].video);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reaction Moods
  const reactionMoods = [
    { label: "💋 Blow Kiss", text: "subject leans forward, gently blows a kiss towards the camera, lips part softly, warm glow" },
    { label: "😳 Blush & Look Down", text: "subject blushes deeply, looks down shyly, bites lip gently, looks back up smiling" },
    { label: "😏 Playful Wink", text: "subject winks playfully with one eye, tilted head, smirk, sparkling eyes" },
    { label: "💃 360 Turn", text: "slow cinematic 360 degree spin showcasing outfit, hair swirling, elegant posture" }
  ];

  // Neon Cursor Trail
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.6) {
        setCursorParticles((prev) => [...prev.slice(-10), { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY }]);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Screen Tap-to-Kiss
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("input") || target.closest("textarea") || target.closest("a")) return;
    const newKiss = { id: Date.now(), x: e.clientX, y: e.clientY };
    setKissStamps((prev) => [...prev.slice(-8), newKiss]);
    setTimeout(() => setKissStamps((prev) => prev.filter((k) => k.id !== newKiss.id)), 1400);
  };

  // Ambient Synthwave Music
  const toggleAmbientMusic = () => {
    if (isMusicPlaying) {
      synthNodesRef.current.forEach((n) => { try { n.stop(); n.disconnect(); } catch (e) {} });
      synthNodesRef.current = [];
      setIsMusicPlaying(false);
      return;
    }
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;
      const freqs = [174.61, 220.00, 261.63, 311.13, 392.00];
      const nodes: any[] = [];
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(650, ctx.currentTime);
        gain.gain.setValueAtTime(0.035, ctx.currentTime);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        nodes.push(osc);
      });
      synthNodesRef.current = nodes;
      setIsMusicPlaying(true);
    } catch (e) {}
  };

  // FaceTime Simulator Trigger
  const startFaceTimeCall = () => {
    setIsCalling(true);
    setCallConnected(false);

    // Call ring sound synthesis
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      }
    } catch (e) {}

    // Answer call after 1.6s
    setTimeout(() => {
      setCallConnected(true);
      if ("speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(activePersona.voicePhrase);
        u.pitch = 1.2;
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      }
    }, 1600);
  };

  const endFaceTimeCall = () => {
    setIsCalling(false);
    setCallConnected(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  // Send Bitcoin Gift
  const handleSendGift = (giftName: string, amount: string, pts: number) => {
    setSelectedGift({ name: giftName, amount });
    setIsVIPOpen(true);
    setAffectionPoints((prev) => Math.min(100, prev + pts));
  };

  // D-Pad Camera Controller
  const applyCameraMotion = (motionType: string) => {
    const motionTags: { [key: string]: string } = {
      up: "[Camera: Slow Tilt Up ⬆️]",
      down: "[Camera: Slow Tilt Down ⬇️]",
      left: "[Camera: Pan Left ⬅️]",
      right: "[Camera: Pan Right ➡️]",
      zoom: "[Camera: Cinematic Push-In 🔍]",
      orbit: "[Camera: 360° Circular Orbit 🔄]"
    };
    setPrompt((prev) => `${prev}, ${motionTags[motionType]}`);
  };

  // Switch Active Companion
  const handleSelectPersona = (p: Persona) => {
    setActivePersona(p);
    setImagePreview(p.avatar);
    setVideoUrl(p.video);
    setPrompt(`Gentle smile and look towards camera, in ${p.scenes[0]}, wearing ${p.outfits[0]}`);
  };

  // Handle Generate
  const handleGenerate = async () => {
    if (!prompt.trim()) return alert("Please enter a motion prompt!");
    setIsGenerating(true);
    setVideoUrl(null);
    setAffectionPoints((prev) => Math.min(100, prev + 5));

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
      const res = await fetch("/api/generate-video", { method: "POST", body: new FormData() });
      const data = await res.json();
      setVideoUrl(data.videoUrl || activePersona.video);
    } catch (e) {
      setVideoUrl(activePersona.video);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentLevel = getIntimacyLevel(affectionPoints);

  return (
    <div onClick={handleScreenClick} className="min-h-screen flex flex-col bg-[#09090D] text-white relative overflow-x-hidden cursor-default select-none">
      
      {/* Dynamic Cursor Particles */}
      {cursorParticles.map((p) => (
        <div key={p.id} style={{ left: `${p.x}px`, top: `${p.y}px` }} className="fixed pointer-events-none w-2 h-2 rounded-full bg-neonPink/70 blur-[1px] animate-ping z-50 transform -translate-x-1/2 -translate-y-1/2" />
      ))}

      {/* Floating Lipstick Stamps */}
      {kissStamps.map((kiss) => (
        <div key={kiss.id} style={{ left: `${kiss.x - 28}px`, top: `${kiss.y - 20}px` }} className="fixed pointer-events-none z-40 animate-float-kiss">
          <svg viewBox="0 0 100 70" className="w-14 h-auto text-neonPink fill-current filter drop-shadow-[0_0_12px_#FF007F]">
            <path d="M50 15 C40 5, 20 5, 10 20 C18 24, 30 22, 50 30 C70 22, 82 24, 90 20 C80 5, 60 5, 50 15 Z" />
            <path d="M10 28 C25 35, 38 33, 50 38 C62 33, 75 35, 90 28 C75 55, 65 65, 50 60 C35 65, 25 55, 10 28 Z" />
          </svg>
        </div>
      ))}

      {/* 📞 FULL-SCREEN FACETIME / VIDEO CALL SIMULATOR */}
      {isCalling && (
        <div className="fixed inset-0 z-[150] bg-black/95 flex flex-col items-center justify-between p-6 sm:p-10 animate-fade-in">
          {/* Top Bar */}
          <div className="text-center z-10">
            <h2 className="text-2xl font-black text-white">{activePersona.name}</h2>
            <p className="text-xs text-neonPink font-mono mt-1">
              {callConnected ? "00:24 • Live HD Video Call" : "Calling Companion..."}
            </p>
          </div>

          {/* Video Container */}
          <div className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden border-2 border-neonPink/50 shadow-2xl shadow-neonPink/30 flex items-center justify-center bg-zinc-950">
            {callConnected ? (
              <video src={activePersona.video} autoPlay loop playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-neonPink to-neonPurple animate-call-ring">
                  <img src={activePersona.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                </div>
                <p className="text-xs text-zinc-400 font-mono tracking-widest uppercase">Connecting live stream...</p>
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="flex items-center gap-6 z-10">
            <button
              onClick={() => handleSendGift("🌹 Virtual Rose", "0.00005", 10)}
              className="p-4 rounded-full bg-white/10 hover:bg-neonPink/20 text-white border border-white/10 transition-all"
            >
              <Heart className="w-6 h-6 text-neonPink" />
            </button>
            <button
              onClick={endFaceTimeCall}
              className="p-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/40 transition-all active:scale-95"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}

      {/* 💋 Intro Kiss Overlay */}
      {showIntro && (
        <div
          onClick={() => {
            setKissTriggered(true);
            setTimeout(() => setKissImpact(true), 400);
            setTimeout(() => { setShowIntro(false); toggleAmbientMusic(); }, 2200);
          }}
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer transition-opacity duration-1000 ${
            kissImpact ? "bg-black/85 backdrop-blur-3xl" : "bg-black/95 backdrop-blur-2xl"
          }`}
        >
          {!kissTriggered ? (
            <div className="text-center z-10 px-6 animate-pulse flex flex-col items-center gap-5">
              <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-neonPink via-neonFuchsia to-neonPurple shadow-2xl shadow-neonPink/50">
                <div className="w-full h-full rounded-full bg-[#09090D] flex items-center justify-center">
                  <Heart className="w-10 h-10 text-neonPink animate-bounce" />
                </div>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">
                VELVET<span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPink to-neonPurple">MOTION</span>
              </h2>
              <p className="text-xs text-zinc-400 tracking-widest uppercase font-medium">Tap to Enter AI Companion Studio</p>
            </div>
          ) : (
            <div className="relative flex flex-col items-center">
              <svg viewBox="0 0 100 70" className="w-48 sm:w-60 h-auto filter drop-shadow-[0_0_35px_#FF007F] text-neonPink fill-current animate-pulse">
                <path d="M50 15 C40 5, 20 5, 10 20 C18 24, 30 22, 50 30 C70 22, 82 24, 90 20 C80 5, 60 5, 50 15 Z" />
                <path d="M10 28 C25 35, 38 33, 50 38 C62 33, 75 35, 90 28 C75 55, 65 65, 50 60 C35 65, 25 55, 10 28 Z" />
              </svg>
              <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neonPink to-white mt-6">
                &ldquo;Welcome to VelvetMotion&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090D]/80 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-neonPink to-neonPurple p-[2px] shadow-lg shadow-neonPink/30">
            <div className="h-full w-full bg-[#09090D] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-neonPink" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-1.5">
              VELVET<span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPink to-neonPurple">MOTION</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">AI Companion Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* FaceTime Simulator Button */}
          <button
            onClick={startFaceTimeCall}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all shadow-lg shadow-emerald-500/10"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Call {activePersona.name}</span>
          </button>

          {/* VIP Bitcoin Button */}
          <button
            onClick={() => { setSelectedGift(null); setIsVIPOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-neonPink/20 border border-amber-500/40 text-xs text-amber-300 font-bold hover:scale-105 transition-all shadow-lg shadow-amber-500/10"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" /> VIP (BTC)
          </button>
        </div>
      </header>

      {/* Sub-Header: Persona Selector & Intimacy Bar */}
      <div className="bg-[#12101C]/80 border-b border-white/5 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Personas Quick-Switch Dock */}
          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold shrink-0">Companions:</span>
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPersona(p)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  activePersona.id === p.id
                    ? "bg-gradient-to-r from-neonPink to-neonPurple text-white shadow-lg shadow-neonPink/30"
                    : "bg-white/[0.03] border border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                <img src={p.avatar} alt={p.name} className="w-5 h-5 rounded-full object-cover" />
                <span>{p.name}</span>
              </button>
            ))}
          </div>

          {/* Affection Bar & Bitcoin Gifts */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                Affection: <span className="text-neonPink">{currentLevel.name}</span>
              </p>
              <div className="w-36 h-2 rounded-full bg-white/10 mt-1 overflow-hidden">
                <div
                  style={{ width: `${affectionPoints}%` }}
                  className="h-full bg-gradient-to-r from-neonPink to-neonPurple rounded-full transition-all duration-500"
                />
              </div>
            </div>

            {/* Quick Gifts */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSendGift("🌹 Virtual Rose", "0.00005", 10)}
                title="Send Rose (0.00005 BTC)"
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-neonPink/20 border border-white/10 text-xs transition-all flex items-center gap-1"
              >
                <span>🌹</span> <span className="text-[10px] text-zinc-400">Rose</span>
              </button>
              <button
                onClick={() => handleSendGift("🍾 Champagne", "0.0001", 20)}
                title="Send Champagne (0.0001 BTC)"
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-neonFuchsia/20 border border-white/10 text-xs transition-all flex items-center gap-1"
              >
                <span>🍾</span> <span className="text-[10px] text-zinc-400">VIP</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Studio Controls */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Tabs: Studio vs Secret Diary */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <button
              onClick={() => setActiveTab("studio")}
              className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all ${
                activeTab === "studio"
                  ? "bg-neonPink/20 text-neonPink border border-neonPink/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Studio Controls
            </button>
            <button
              onClick={() => setActiveTab("diary")}
              className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === "diary"
                  ? "bg-neonPurple/20 text-neonPurple border border-neonPurple/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Secret Diary of {activePersona.name}
            </button>
          </div>

          {activeTab === "diary" ? (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span>📖</span> Dear Diary...
              </h3>
              <p className="text-sm text-zinc-300 italic leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">
                &ldquo;{activePersona.diary}&rdquo;
              </p>
              <p className="text-[11px] text-zinc-500 mt-3 text-right">Written 2 hours ago • Affection: {affectionPoints}%</p>
            </div>
          ) : (
            <>
              {/* 1. Wardrobe & Atmosphere Switcher */}
              <div className="p-6 rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/10">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2.5">
                  👗 Wardrobe Customizer ({activePersona.name}):
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {activePersona.outfits.map((outfit) => (
                    <button
                      key={outfit}
                      onClick={() => setPrompt((prev) => `${prev}, wearing ${outfit}`)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-zinc-300 hover:border-neonPink hover:text-white transition-all"
                    >
                      {outfit}
                    </button>
                  ))}
                </div>

                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2.5">
                  🌆 Atmosphere Scene Switcher:
                </label>
                <div className="flex flex-wrap gap-2">
                  {activePersona.scenes.map((scene) => (
                    <button
                      key={scene}
                      onClick={() => setPrompt((prev) => `${prev}, located in ${scene}`)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-zinc-300 hover:border-neonPurple hover:text-white transition-all"
                    >
                      {scene}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Reaction Mood Wheel */}
              <div className="p-6 rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/10">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 mb-3">
                  <Smile className="w-4 h-4 text-neonPink" /> 1-Click Reaction Moods:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {reactionMoods.map((m) => (
                    <button
                      key={m.label}
                      onClick={() => setPrompt((prev) => `${prev}, ${m.text}`)}
                      className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-neonPink text-xs font-semibold text-zinc-200 hover:text-white transition-all text-center active:scale-95"
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Prompt & Camera Director */}
              <div className="p-6 rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/10">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 mb-3">
                  <Wand2 className="w-4 h-4 text-neonPurple" /> Custom Prompt & Camera Director:
                </label>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl bg-black/40 border border-white/10 p-3.5 text-sm text-white focus:outline-none focus:border-neonPink transition-all"
                />

                {/* D-Pad Buttons */}
                <div className="mt-4 p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-neonFuchsia" /> Director Angle:
                    </p>
                    <p className="text-[10px] text-zinc-500">Inject cinematic camera motion</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => applyCameraMotion("left")} className="p-2 rounded-lg bg-white/5 hover:bg-neonPink/20 border border-white/10 text-zinc-300">
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => applyCameraMotion("up")} className="p-2 rounded-lg bg-white/5 hover:bg-neonPink/20 border border-white/10 text-zinc-300">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => applyCameraMotion("down")} className="p-2 rounded-lg bg-white/5 hover:bg-neonPink/20 border border-white/10 text-zinc-300">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => applyCameraMotion("right")} className="p-2 rounded-lg bg-white/5 hover:bg-neonPink/20 border border-white/10 text-zinc-300">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => applyCameraMotion("zoom")} className="p-2 rounded-lg bg-white/5 hover:bg-neonFuchsia/20 border border-white/10 text-neonFuchsia">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => applyCameraMotion("orbit")} className="p-2 rounded-lg bg-white/5 hover:bg-neonPurple/20 border border-white/10 text-neonPurple">
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`w-full mt-5 py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 ${
                    isGenerating
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-neonPink via-neonFuchsia to-neonPurple hover:opacity-95 shadow-neonPink/30"
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin text-neonPink" />
                      Rendering {activePersona.name}&apos;s Motion...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" /> Generate Video
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </section>

        {/* Right Column (5 cols): Live Companion Showcase */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Eye className="w-4 h-4 text-neonFuchsia" /> {activePersona.name} • Live Screen
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono">
                Online & Listening
              </span>
            </div>

            <div className="flex-1 rounded-2xl bg-black/70 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden p-2">
              {isGenerating ? (
                <div className="text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-neonPink animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-white">{statusMessage}</p>
                </div>
              ) : videoUrl ? (
                <div className="w-full h-full flex flex-col justify-between">
                  <video src={videoUrl} controls autoPlay loop playsInline className="w-full max-h-[400px] rounded-xl object-cover shadow-2xl border border-white/10" />
                  <div className="flex gap-2 mt-3">
                    <a
                      href={videoUrl}
                      download="velvetmotion.mp4"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-neonPink" /> Download MP4
                    </a>
                    <button
                      onClick={handleGenerate}
                      className="py-2 px-3 rounded-xl bg-neonPurple/20 border border-neonPurple/40 text-xs font-semibold text-neonPurple flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Re-roll
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      {/* Crypto & Bitcoin Ad Banner */}
      <CryptoAdBanner />

      {/* Floating Ambient Synthwave Widget */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={toggleAmbientMusic}
          className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#12101C]/90 border border-white/15 hover:border-neonPink/50 backdrop-blur-2xl shadow-2xl transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-neonPurple/20 flex items-center justify-center text-neonFuchsia">
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
              {isMusicPlaying ? "Playing Ambient Pad" : "Click to Play Music"}
            </p>
          </div>
        </button>
      </div>

      {/* VIP Bitcoin Modal */}
      <VIPModal
        isOpen={isVIPOpen}
        onClose={() => setIsVIPOpen(false)}
        giftName={selectedGift?.name}
        giftAmount={selectedGift?.amount}
      />
    </div>
  );
}
