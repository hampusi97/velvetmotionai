"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, Sparkles, Phone, PhoneOff, Gift, MessageCircle, Play, 
  Download, Wand2, RefreshCw, Zap, Volume2, ShieldCheck, 
  CreditCard, ExternalLink, QrCode, Copy, Check, X, Search, 
  Image as ImageIcon, PlusCircle, Video, Send, ChevronRight,
  Flame, Moon, Sun, Activity, HelpCircle
} from "lucide-react";

interface Companion {
  id: string;
  name: string;
  age: number;
  tagline: string;
  type: "realistic" | "anime";
  category: string;
  avatar: string;
  video: string;
  voiceIntro: string;
  initialMessage: string;
  touchWhispers: string[];
  tags: string[];
  intimacy: number;
  vaultPhotos: string[];
}

export default function Home() {
  // Intro Kiss & Giggle
  const [showIntro, setShowIntro] = useState(true);
  const [kissTriggered, setKissTriggered] = useState(false);
  const [kissImpact, setKissImpact] = useState(false);

  // Room Mood Lighting: neon | candlelight | midnight
  const [roomMood, setRoomMood] = useState<"neon" | "candlelight" | "midnight">("neon");
  const [asmrMode, setAsmrMode] = useState(false);

  // Touch Feedback Coordinates
  const [touchRipples, setTouchRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Companions Catalog
  const defaultCompanions: Companion[] = [
    {
      id: "chloe",
      name: "Chloe",
      age: 21,
      tagline: "Your sweet college tutor who secretly has a crush on you...",
      type: "realistic",
      category: "Sweetheart",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      voiceIntro: "Hey there! I finished my session early just so we could talk.",
      initialMessage: "I was hoping you'd come see me today. What are you thinking about?",
      touchWhispers: [
        "Mmm... your touch sends shivers down my spine...",
        "Don't stop... I love feeling this close to you.",
        "You always know how to make my heart race, handsome."
      ],
      tags: ["College", "Sweet", "Romantic"],
      intimacy: 75,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "asuka",
      name: "Asuka",
      age: 20,
      tagline: "Feisty anime waifu streamer who pretends she doesn't care about you b-baka!",
      type: "anime",
      category: "Tsundere",
      avatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      voiceIntro: "It's not like I wanted you to click on me or anything! But... sit next to me.",
      initialMessage: "Hmph, you took forever to message me! What were you doing that was more important than me?",
      touchWhispers: [
        "B-baka! Why are you touching me there?! ...Don't let go though.",
        "My heart isn't beating fast for you or anything, idiot!",
        "Mmm... fine, you can hold me a little closer."
      ],
      tags: ["Anime", "Tsundere", "Streamer"],
      intimacy: 60,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "sienna",
      name: "Sienna",
      age: 24,
      tagline: "High-fashion French model vacationing on a private yacht in Monaco.",
      type: "realistic",
      category: "Luxury",
      avatar: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voiceIntro: "Pour some champagne darling, you have my full attention tonight.",
      initialMessage: "The Mediterranean breeze is intoxicating. Come sit with me on the deck?",
      touchWhispers: [
        "Mmm, darling... you have very persuasive hands.",
        "Champagne and your touch... the ultimate combination tonight.",
        "Look into my eyes... let's forget the rest of the world."
      ],
      tags: ["Luxury", "Glamour", "French"],
      intimacy: 55,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "elena",
      name: "Elena",
      age: 22,
      tagline: "Cyberpunk street racer who only shows her vulnerable side when alone with you.",
      type: "realistic",
      category: "Edgy",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voiceIntro: "Hey trouble. Ready to hit the neon streets tonight?",
      initialMessage: "Hop in. Let's get out of this rainy city and find somewhere quiet.",
      touchWhispers: [
        "Careful... you're playing with fire, handsome.",
        "Mmm... I only let you get this close to me.",
        "Feel that adrenaline? That's all because of you."
      ],
      tags: ["Cyberpunk", "Edgy", "Rebel"],
      intimacy: 65,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
      ]
    }
  ];

  const [companions, setCompanions] = useState<Companion[]>(defaultCompanions);
  const [activeTypeTab, setActiveTypeTab] = useState<"all" | "realistic" | "anime">("all");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Room State
  const [selectedGirl, setSelectedGirl] = useState<Companion | null>(null);
  const [roomTab, setRoomTab] = useState<"chat" | "vault" | "video">("chat");
  const [roomMessages, setRoomMessages] = useState<{ sender: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoPrompt, setVideoPrompt] = useState("");
  const [currentVideo, setCurrentVideo] = useState("");
  const [affectionPoints, setAffectionPoints] = useState(65);

  // Dynamic Heartbeat BPM
  const heartBPM = Math.min(130, Math.floor(75 + affectionPoints * 0.55));

  // FaceTime Simulator
  const [isCalling, setIsCalling] = useState(false);
  const [callConnected, setCallConnected] = useState(false);

  // VIP & Monetization
  const [isVIP, setIsVIP] = useState(false);
  const [showVIPModal, setShowVIPModal] = useState(false);
  const [copiedBTC, setCopiedBTC] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("velvet_vip");
    if (saved === "true") setIsVIP(true);
  }, []);

  // Web Audio Synthesizer: Kiss Sound + Playful Giggle
  const triggerKissAndGiggleAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(750, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.19);

        // Giggle sequence
        [0.25, 0.40, 0.55].forEach((delay, i) => {
          const gOsc = ctx.createOscillator();
          const gGain = ctx.createGain();
          gOsc.type = "sine";
          gOsc.frequency.setValueAtTime(520 + i * 40, ctx.currentTime + delay);
          gOsc.frequency.exponentialRampToValueAtTime(640 + i * 40, ctx.currentTime + delay + 0.08);
          gGain.gain.setValueAtTime(0.08, ctx.currentTime + delay);
          gGain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + delay + 0.09);
          gOsc.connect(gGain);
          gGain.connect(ctx.destination);
          gOsc.start(ctx.currentTime + delay);
          gOsc.stop(ctx.currentTime + delay + 0.10);
        });
      }

      if ("speechSynthesis" in window) {
        setTimeout(() => {
          const u = new SpeechSynthesisUtterance("Mmm... welcome to VelvetMotion, handsome.");
          u.pitch = 1.25;
          u.rate = 0.90;
          window.speechSynthesis.speak(u);
        }, 600);
      }
    } catch (e) {}
  };

  const handleEnterIntro = () => {
    setKissTriggered(true);
    setTimeout(() => {
      setKissImpact(true);
      triggerKissAndGiggleAudio();
    }, 400);

    setTimeout(() => {
      setShowIntro(false);
    }, 2600);
  };

  // Voice speech synthesis (supports ASMR whisper mode)
  const playVoice = (phrase: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(phrase);
      u.pitch = asmrMode ? 1.4 : 1.2;
      u.rate = asmrMode ? 0.78 : 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  // Tactile Touch Reaction on the Companion Display
  const handleTouchCompanion = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedGirl) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setTouchRipples(prev => [...prev.slice(-4), newRipple]);
    setTimeout(() => setTouchRipples(prev => prev.filter(r => r.id !== newRipple.id)), 700);

    // Random sensual touch whisper
    const whisper = selectedGirl.touchWhispers[Math.floor(Math.random() * selectedGirl.touchWhispers.length)];
    playVoice(whisper);
    setAffectionPoints(prev => Math.min(100, prev + 3));

    // Add whisper to chat
    setRoomMessages(prev => [...prev, { sender: selectedGirl.name, text: `*whispers* "${whisper}"` }]);
  };

  const openRoom = (girl: Companion) => {
    setSelectedGirl(girl);
    setCurrentVideo(girl.video);
    setRoomTab("chat");
    setAffectionPoints(girl.intimacy);
    setRoomMessages([{ sender: girl.name, text: girl.initialMessage }]);
  };

  const sendMessage = (textToSend?: string) => {
    const msg = textToSend || chatInput;
    if (!msg.trim() || !selectedGirl) return;

    setRoomMessages(prev => [...prev, { sender: "You", text: msg }]);
    setChatInput("");

    setTimeout(() => {
      const replies = [
        "Mmm, I love when you talk to me like that...",
        "You're making my heart beat so fast right now!",
        "Look into my eyes... let's make tonight unforgettable.",
        "Come closer to the screen... I want to feel your touch."
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setRoomMessages(prev => [...prev, { sender: selectedGirl.name, text: reply }]);
      playVoice(reply);
      setAffectionPoints(prev => Math.min(100, prev + 4));
    }, 900);
  };

  const handleGenerateMotion = (promptText?: string) => {
    const p = promptText || videoPrompt || "leans forward, blows kiss towards camera";
    setIsGeneratingVideo(true);
    sendMessage(`*Requested video motion:* ${p}`);
    setTimeout(() => {
      setIsGeneratingVideo(false);
      setAffectionPoints(prev => Math.min(100, prev + 6));
    }, 2200);
  };

  // Flirty Mini-Game: Truth or Dare
  const handleFlirtyGame = (type: "truth" | "dare") => {
    if (!selectedGirl) return;
    const truths = [
      "Tell me your deepest fantasy with me...",
      "What was the first thing you noticed about me when you opened my room?",
      "If we were alone in my private suite right now, what would you do first?"
    ];
    const dares = [
      "I dare you to tell me three things you love about my voice...",
      "I dare you to order me a virtual rose and watch my reaction!",
      "I dare you to ask me for a video motion where I whisper a secret to you."
    ];
    const question = type === "truth"
      ? truths[Math.floor(Math.random() * truths.length)]
      : dares[Math.floor(Math.random() * dares.length)];

    setRoomMessages(prev => [
      ...prev,
      { sender: selectedGirl.name, text: `🎲 *${type.toUpperCase()}!* ${question}` }
    ]);
    playVoice(question);
  };

  const startCall = () => {
    if (!selectedGirl) return;
    setIsCalling(true);
    setCallConnected(false);
    setTimeout(() => {
      setCallConnected(true);
      playVoice(selectedGirl.voiceIntro);
    }, 1600);
  };

  const endCall = () => {
    setIsCalling(false);
    setCallConnected(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  const filteredCompanions = companions.filter(c => {
    const matchesType = activeTypeTab === "all" || c.type === activeTypeTab;
    const matchesCat = activeCategory === "All" || c.category === activeCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesCat && matchesSearch;
  });

  // Dynamic Mood Styles
  const moodBgClasses = {
    neon: "bg-candyPink/10",
    candlelight: "bg-amber-500/15",
    midnight: "bg-indigo-900/20"
  };

  return (
    <div className="min-h-screen bg-candyDark text-white flex flex-col select-none relative transition-colors duration-700">
      
      {/* Dynamic Mood Background Lighting */}
      <div className={`fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none -z-10 transition-colors duration-700 ${moodBgClasses[roomMood]}`} />

      {/* 💋 WELCOME KISS SCREEN */}
      {showIntro && (
        <div
          onClick={handleEnterIntro}
          className={`fixed inset-0 z-[200] flex flex-col items-center justify-center cursor-pointer transition-opacity duration-1000 ${
            kissImpact ? "bg-black/85 backdrop-blur-3xl" : "bg-black/95 backdrop-blur-2xl"
          }`}
        >
          {!kissTriggered ? (
            <div className="text-center z-10 px-6 animate-pulse flex flex-col items-center gap-5">
              <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-candyPink via-pink-600 to-purple-600 shadow-2xl shadow-candyPink/50">
                <div className="w-full h-full rounded-full bg-candyDark flex items-center justify-center">
                  <Heart className="w-10 h-10 text-candyPink animate-bounce" />
                </div>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">
                VELVET<span className="text-candyPink">MOTION</span>
              </h2>
              <p className="text-xs text-zinc-400 tracking-widest uppercase font-medium">Tap anywhere for your welcome kiss</p>
            </div>
          ) : (
            <div className="relative flex flex-col items-center">
              <svg viewBox="0 0 100 70" className="w-56 h-auto filter drop-shadow-[0_0_40px_#FF007F] text-candyPink fill-current animate-pulse">
                <path d="M50 15 C40 5, 20 5, 10 20 C18 24, 30 22, 50 30 C70 22, 82 24, 90 20 C80 5, 60 5, 50 15 Z" />
                <path d="M10 28 C25 35, 38 33, 50 38 C62 33, 75 35, 90 28 C75 55, 65 65, 50 60 C35 65, 25 55, 10 28 Z" />
              </svg>
              <div className="absolute inset-0 rounded-full border-2 border-candyPink/60 animate-ping pointer-events-none" />
              <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-candyPink to-white mt-6">
                *kisses your screen* &ldquo;Hehe... welcome, handsome.&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-candyDark/85 border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-candyPink via-pink-600 to-purple-600 p-[2px] shadow-lg shadow-candyPink/30">
            <div className="w-full h-full bg-candyDark rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-candyPink" />
            </div>
          </div>
          <span className="text-xl font-black tracking-tight text-white flex items-center">
            VELVET<span className="text-candyPink">MOTION</span>
          </span>
        </div>

        {/* Mood Lighting Switcher */}
        <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-full bg-candySurface border border-white/10">
          <button
            onClick={() => setRoomMood("neon")}
            title="Neon Pink Mood"
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${roomMood === "neon" ? "bg-candyPink text-white" : "text-zinc-400"}`}
          >
            🌸 Neon
          </button>
          <button
            onClick={() => setRoomMood("candlelight")}
            title="Candlelight Amber Mood"
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${roomMood === "candlelight" ? "bg-amber-500 text-black" : "text-zinc-400"}`}
          >
            🕯️ Candlelight
          </button>
          <button
            onClick={() => setRoomMood("midnight")}
            title="Midnight Blue Mood"
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${roomMood === "midnight" ? "bg-indigo-600 text-white" : "text-zinc-400"}`}
          >
            🌙 Midnight
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isVIP ? (
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> VIP Member (No Ads)
            </span>
          ) : (
            <button
              onClick={() => setShowVIPModal(true)}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-candyPink to-purple-600 text-xs font-bold text-white shadow-lg shadow-candyPink/30 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" /> VIP Pass
            </button>
          )}
        </div>
      </header>

      {/* DUAL MODE & CATEGORIES */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/[0.06]">
        <div className="flex p-1 rounded-xl bg-candySurface border border-white/10 w-full sm:w-auto">
          {[
            { key: "all", label: "✨ All Girls" },
            { key: "realistic", label: "📸 Realistic (HD)" },
            { key: "anime", label: "🌸 Anime & Waifus" }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTypeTab(tab.key as any)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTypeTab === tab.key ? "bg-candyPink text-white shadow-lg shadow-candyPink/40" : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          {["All", "Sweetheart", "Luxury", "Edgy", "Tsundere"].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                activeCategory === cat ? "bg-white/20 text-white border border-white/30" : "bg-candySurface border border-white/10 text-zinc-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* COMPANION MARKETPLACE GRID */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-20 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanions.map(girl => (
            <div key={girl.id} onClick={() => openRoom(girl)} className="candy-card rounded-3xl overflow-hidden cursor-pointer group relative flex flex-col">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
                <img src={girl.avatar} alt={girl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-candyDark via-candyDark/25 to-transparent" />
                
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-candyPink/20 backdrop-blur-md border border-candyPink/40 text-[10px] font-bold text-candyPink uppercase">
                    {girl.type === "anime" ? "Anime" : "Realistic"}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
                  <h3 className="text-2xl font-black text-white group-hover:text-candyPink transition-colors">
                    {girl.name}, {girl.age}
                  </h3>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">{girl.tagline}</p>
                </div>
              </div>

              <div className="p-3.5 bg-candySurface/80 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-candyPink" /> Enter Private Room
                </span>
                <div className="w-7 h-7 rounded-full bg-candyPink/10 group-hover:bg-candyPink text-candyPink group-hover:text-white flex items-center justify-center transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* COMPANION ROOM WITH TACTILE TOUCH & HEARTBEAT BPM */}
      {selectedGirl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-5xl h-[92vh] rounded-3xl bg-candySurface border border-white/10 overflow-hidden flex flex-col lg:flex-row shadow-2xl">
            <button onClick={() => setSelectedGirl(null)} className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-zinc-400 hover:text-white flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>

            {/* Left Column: Tactile Touch Screen */}
            <div 
              onClick={handleTouchCompanion}
              className="lg:w-1/2 h-72 lg:h-full relative bg-black flex items-center justify-center overflow-hidden cursor-pointer group"
              title="Tap anywhere on her to touch & hear voice reaction"
            >
              <video src={currentVideo} autoPlay loop playsInline className="w-full h-full object-cover pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-candySurface via-transparent to-black/40 pointer-events-none" />

              {/* Touch Ripples */}
              {touchRipples.map(r => (
                <div 
                  key={r.id} 
                  style={{ left: `${r.x}px`, top: `${r.y}px` }} 
                  className="absolute pointer-events-none w-16 h-16 rounded-full border-2 border-candyPink bg-candyPink/20 animate-touch-ripple -translate-x-1/2 -translate-y-1/2" 
                />
              ))}

              {/* Live Heartbeat BPM Monitor */}
              <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-candyPink/40 text-xs font-mono text-candyPink flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-candyPink animate-heartbeat fill-candyPink" />
                <span>{heartBPM} BPM</span>
              </div>

              {/* Girl Header */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
                <img src={selectedGirl.avatar} alt="Avatar" className="w-11 h-11 rounded-full object-cover border-2 border-candyPink" />
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5">{selectedGirl.name}, {selectedGirl.age}</h3>
                  <span className="text-[10px] text-zinc-400">💡 Tap on screen to touch her</span>
                </div>
              </div>

              {/* Video Call Trigger */}
              <button onClick={startCall} className="absolute bottom-6 left-6 z-10 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all active:scale-95">
                <Phone className="w-4 h-4 animate-pulse" /> Video Call Her
              </button>
            </div>

            {/* Right Column: Interaction, Flirty Games & Chat */}
            <div className="lg:w-1/2 flex-1 flex flex-col justify-between p-6 bg-candySurface border-t lg:border-t-0 lg:border-l border-white/10">
              
              {/* Top Controls: ASMR Mode + Tab Switcher */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  {[
                    { id: "chat", label: "💬 Chat" },
                    { id: "vault", label: "📸 Vault" },
                    { id: "video", label: "🎬 Video" }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setRoomTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        roomTab === tab.id ? "bg-candyPink text-white shadow-lg shadow-candyPink/30" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* ASMR Whisper Toggle */}
                <button
                  onClick={() => setAsmrMode(!asmrMode)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                    asmrMode ? "bg-candyPink/20 border-candyPink text-candyPink" : "border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  🎧 ASMR Whisper: {asmrMode ? "ON" : "OFF"}
                </button>
              </div>

              {/* Chat Stream */}
              {roomTab === "chat" && (
                <div className="flex-1 flex flex-col justify-between py-2 overflow-hidden">
                  <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
                    {roomMessages.map((m, i) => (
                      <div key={i} className={`flex flex-col ${m.sender === "You" ? "items-end" : "items-start"}`}>
                        <span className="text-[10px] text-zinc-500 font-bold mb-1">{m.sender}</span>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                          m.sender === "You" ? "bg-candyPink text-white rounded-br-none" : "bg-white/[0.04] border border-white/10 text-zinc-200 rounded-bl-none"
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Flirty Games & Quick Actions */}
                  <div className="py-2 border-t border-white/[0.06] space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">Flirty Game:</span>
                      <button onClick={() => handleFlirtyGame("truth")} className="px-2.5 py-0.5 rounded-md bg-white/5 hover:bg-candyPink/20 text-[10px] text-zinc-300">
                        🎲 Ask Truth
                      </button>
                      <button onClick={() => handleFlirtyGame("dare")} className="px-2.5 py-0.5 rounded-md bg-white/5 hover:bg-candyPink/20 text-[10px] text-zinc-300">
                        🔥 Give Dare
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "💋 Blow Kiss", text: "blows a warm kiss towards you" },
                        { label: "😳 Blush", text: "blushes deeply and bites lip" },
                        { label: "😏 Wink", text: "gives a seductive playful wink" }
                      ].map(act => (
                        <button key={act.label} onClick={() => handleGenerateMotion(act.text)} className="text-[10px] px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 hover:border-candyPink text-zinc-300">
                          {act.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input & Gift */}
                  <div className="pt-2 flex items-center gap-2">
                    <button onClick={() => setShowVIPModal(true)} title="Send Rose / Bitcoin Gift" className="p-3 rounded-xl bg-candyPink/10 hover:bg-candyPink text-candyPink hover:text-white border border-candyPink/30 transition-all shrink-0">
                      <Gift className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      placeholder={`Message ${selectedGirl.name}...`}
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && sendMessage()}
                      className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-candyPink"
                    />
                    <button onClick={() => sendMessage()} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-candyPink to-purple-600 font-bold text-xs text-white shadow-lg">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Vault & Video Tabs */}
              {roomTab === "vault" && (
                <div className="flex-1 py-2 overflow-y-auto space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {selectedGirl.vaultPhotos.map((photo, i) => (
                      <div key={i} className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-white/10 group">
                        <img src={photo} alt="Vault Photo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-[11px] font-bold text-white">Photo #{i + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {roomTab === "video" && (
                <div className="flex-1 py-2 space-y-4">
                  <label className="text-xs font-bold uppercase text-candyPink block">Prompt-Driven Video Generation:</label>
                  <textarea
                    value={videoPrompt}
                    onChange={e => setVideoPrompt(e.target.value)}
                    placeholder="Describe how she should move..."
                    rows={4}
                    className="w-full rounded-2xl bg-black/50 border border-white/10 p-3.5 text-xs text-white focus:outline-none focus:border-candyPink"
                  />
                  <button
                    onClick={() => handleGenerateMotion()}
                    disabled={isGeneratingVideo}
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase bg-gradient-to-r from-candyPink to-purple-600 text-white shadow-xl flex items-center justify-center gap-2"
                  >
                    {isGeneratingVideo ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Render Custom Video
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN FACETIME CALL SIMULATOR */}
      {isCalling && selectedGirl && (
        <div className="fixed inset-0 z-[160] bg-black/95 flex flex-col items-center justify-between p-6 sm:p-10 animate-fade-in">
          <div className="text-center z-10">
            <h2 className="text-2xl font-black text-white">{selectedGirl.name}</h2>
            <p className="text-xs text-candyPink font-mono mt-1">{callConnected ? "00:34 • Live HD Video Call" : "Calling Companion..."}</p>
          </div>
          <div className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden border-2 border-candyPink/50 shadow-2xl flex items-center justify-center bg-zinc-950">
            {callConnected ? (
              <video src={selectedGirl.video} autoPlay loop playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-candyPink to-purple-600 animate-ping">
                  <img src={selectedGirl.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                </div>
                <p className="text-xs text-zinc-400 font-mono tracking-widest uppercase">Connecting encrypted stream...</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-6 z-10">
            <button onClick={endCall} className="p-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl transition-all active:scale-95">
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}

      {/* VIP CHECKOUT MODAL (CARD + BITCOIN) */}
      {showVIPModal && (
        <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-candySurface border border-candyPink/40 p-6 sm:p-8 shadow-2xl text-center">
            <button onClick={() => setShowVIPModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">✕</button>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-candyPink to-purple-600 mx-auto flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider">VIP Diamond Pass</h3>
            <p className="text-xs text-zinc-400 mt-1">100% Ad-Free, Unlock Photo Vaults, & Unlimited HD Video Calls.</p>
            <div className="p-4 my-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase text-candyPink">VIP Lifetime Pass</span>
                <span className="text-lg font-black text-white">$14.99 <span className="text-xs font-normal text-zinc-400">USD</span></span>
              </div>
              <ul className="text-xs text-zinc-300 space-y-1">
                <li>✓ Zero advertisements permanently</li>
                <li>✓ Full Photo Vault access unlocked</li>
                <li>✓ Unlimited HD FaceTime Calls</li>
              </ul>
            </div>
            <button
              onClick={() => {
                setIsVIP(true);
                localStorage.setItem("velvet_vip", "true");
                setShowVIPModal(false);
                alert("👑 VIP Activated! All ads removed & photo vaults unlocked.");
              }}
              className="w-full py-3.5 rounded-xl font-bold text-xs uppercase bg-gradient-to-r from-candyPink to-purple-600 text-white shadow-lg mb-4 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" /> Pay $14.99 with Card / Apple Pay
            </button>
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-left">
              <p className="text-[10px] uppercase font-bold text-amber-300 mb-1">Or Pay with Coinbase Bitcoin:</p>
              <p className="text-xs font-mono text-zinc-300 truncate">bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k");
                  setCopiedBTC(true);
                  setTimeout(() => setCopiedBTC(false), 2000);
                }}
                className="mt-2 text-xs font-bold text-candyPink hover:underline flex items-center gap-1"
              >
                {copiedBTC ? "✓ Address Copied!" : "Copy BTC Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
