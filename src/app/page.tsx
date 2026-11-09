"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, Sparkles, Phone, PhoneOff, Gift, MessageCircle, Play, 
  Download, Wand2, RefreshCw, Zap, Volume2, ShieldCheck, 
  CreditCard, ExternalLink, QrCode, Copy, Check, X, Search, 
  Image as ImageIcon, PlusCircle, Video, Lock, Send, User, ChevronRight, Sliders
} from "lucide-react";

const BTC_ADDRESS = "bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k";

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
  tags: string[];
  intimacy: number;
  vaultPhotos: string[];
}

export default function Home() {
  // Full Roster: Realistic + Anime
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
      tags: ["Luxury", "Glamour", "French"],
      intimacy: 50,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "miku",
      name: "Miku",
      age: 19,
      tagline: "Cyber-pop anime idol who sings personalized melodies just for you.",
      type: "anime",
      category: "Idol",
      avatar: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      voiceIntro: "Konnichiwa! I composed a secret song about us today. Want to hear it?",
      initialMessage: "Senpai! I was getting so lonely in my digital dressing room. Talk to me!",
      tags: ["Anime", "Idol", "Cute"],
      intimacy: 80,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "raven",
      name: "Raven",
      age: 22,
      tagline: "Mysterious goth artist with a soft spot for deep late-night talks in the rain.",
      type: "realistic",
      category: "Goth",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      voiceIntro: "I was painting in the dark. I'm glad it was you who called.",
      initialMessage: "Everyone thinks I'm unapproachable, but I only let my guard down around you.",
      tags: ["Goth", "Mysterious", "Alternative"],
      intimacy: 45,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80"
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

  // Selected Companion Room
  const [selectedGirl, setSelectedGirl] = useState<Companion | null>(null);
  const [roomTab, setRoomTab] = useState<"chat" | "vault" | "video">("chat");
  const [roomMessages, setRoomMessages] = useState<{ sender: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoPrompt, setVideoPrompt] = useState("");
  const [currentVideo, setCurrentVideo] = useState("");

  // FaceTime Simulator
  const [isCalling, setIsCalling] = useState(false);
  const [callConnected, setCallConnected] = useState(false);

  // Character Creator Modal State
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [creatorForm, setCreatorForm] = useState({
    name: "",
    age: 20,
    type: "realistic" as "realistic" | "anime",
    category: "Sweetheart",
    tagline: "",
    tags: "Custom, AI, Romantic"
  });

  // VIP & Monetization
  const [isVIP, setIsVIP] = useState(false);
  const [showVIPModal, setShowVIPModal] = useState(false);
  const [copiedBTC, setCopiedBTC] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("velvet_vip");
      if (saved === "true") setIsVIP(true);
    }
  }, []);

  // Filter companions
  const filteredCompanions = companions.filter(c => {
    const matchesType = activeTypeTab === "all" || c.type === activeTypeTab;
    const matchesCat = activeCategory === "All" || c.category === activeCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesCat && matchesSearch;
  });

  // Voice Note Synthesis
  const playVoice = (phrase: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(phrase);
      u.pitch = 1.2;
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  // Open Room
  const openRoom = (girl: Companion) => {
    setSelectedGirl(girl);
    setCurrentVideo(girl.video);
    setRoomTab("chat");
    setRoomMessages([{ sender: girl.name, text: girl.initialMessage }]);
  };

  // Send Message
  const sendMessage = (textToSend?: string) => {
    const msg = textToSend || chatInput;
    if (!msg.trim() || !selectedGirl) return;

    setRoomMessages(prev => [...prev, { sender: "You", text: msg }]);
    setChatInput("");

    setTimeout(() => {
      const replies = [
        "Mmm, I love when you talk to me like that...",
        "You're making my heart beat so fast right now!",
        "Look at my new photo in the Vault, I unlocked it for you!",
        "Come closer to the screen... I want to hear your voice."
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setRoomMessages(prev => [...prev, { sender: selectedGirl.name, text: reply }]);
      playVoice(reply);
    }, 900);
  };

  // Trigger Video Prompt Motion
  const handleGenerateMotion = (promptText?: string) => {
    const p = promptText || videoPrompt || "leans forward, blows kiss towards camera";
    setIsGeneratingVideo(true);
    sendMessage(`*Requested video motion:* ${p}`);

    setTimeout(() => {
      setIsGeneratingVideo(false);
    }, 2200);
  };

  // FaceTime Call
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
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Create Companion Action
  const handleCreateCompanion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorForm.name.trim()) return;

    const newCompanion: Companion = {
      id: `custom_${Date.now()}`,
      name: creatorForm.name,
      age: Number(creatorForm.age) || 20,
      tagline: creatorForm.tagline || "Your custom-created dream AI companion.",
      type: creatorForm.type,
      category: creatorForm.category,
      avatar: creatorForm.type === "anime"
        ? "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80"
        : "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voiceIntro: `Hello! I'm ${creatorForm.name}, your customized companion.`,
      initialMessage: `I'm so excited you brought me to life! What should we explore together?`,
      tags: creatorForm.tags.split(",").map(t => t.trim()),
      intimacy: 50,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
      ]
    };

    setCompanions([newCompanion, ...companions]);
    setShowCreatorModal(false);
    openRoom(newCompanion);
  };

  return (
    <div className="min-h-screen bg-candyDark text-white flex flex-col select-none relative">
      
      {/* Top Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-candyPink/10 rounded-full blur-[170px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-candyPurple/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-candyDark/85 border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-candyPink via-pink-600 to-candyPurple p-[2px] shadow-lg shadow-candyPink/30">
            <div className="w-full h-full bg-candyDark rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-candyPink" />
            </div>
          </div>
          <span className="text-xl font-black tracking-tight text-white flex items-center">
            VELVET<span className="text-candyPink">MOTION</span>
          </span>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-candySurface border border-white/10 w-80">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search Realistic, Anime, Goth waifus..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white focus:outline-none w-full"
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreatorModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-candyPink/15 border border-candyPink/40 text-candyPink hover:bg-candyPink hover:text-white text-xs font-bold transition-all shadow-lg shadow-candyPink/20 active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Create AI Girl
          </button>

          {isVIP ? (
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> VIP (No Ads)
            </span>
          ) : (
            <button
              onClick={() => setShowVIPModal(true)}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-candyPink to-candyPurple text-xs font-bold text-white shadow-lg shadow-candyPink/30 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" /> VIP Pass
            </button>
          )}
        </div>
      </header>

      {/* STORIES / SNAPS BAR */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 pb-2 flex items-center gap-4 overflow-x-auto scrollbar-none">
        {companions.map(girl => (
          <div
            key={girl.id}
            onClick={() => openRoom(girl)}
            className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
          >
            <div className="w-16 h-16 rounded-full story-ring transition-transform group-hover:scale-105">
              <img src={girl.avatar} alt={girl.name} className="w-full h-full rounded-full object-cover border-2 border-candyDark" />
            </div>
            <span className="text-[11px] font-bold text-zinc-300 group-hover:text-candyPink truncate max-w-[68px]">
              {girl.name}
            </span>
          </div>
        ))}
      </div>

      {/* DUAL MODE SELECTOR: REALISTIC VS ANIME */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/[0.06]">
        {/* Type Switcher */}
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
                activeTypeTab === tab.key
                  ? "bg-candyPink text-white shadow-lg shadow-candyPink/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          {["All", "Sweetheart", "Luxury", "Edgy", "Tsundere", "Idol", "Goth"].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                activeCategory === cat
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-candySurface border border-white/10 text-zinc-400 hover:text-white"
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
            <div
              key={girl.id}
              onClick={() => openRoom(girl)}
              className="candy-card rounded-3xl overflow-hidden cursor-pointer group relative flex flex-col"
            >
              {/* Photo Box */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
                <img
                  src={girl.avatar}
                  alt={girl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-candyDark via-candyDark/25 to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-candyPink/20 backdrop-blur-md border border-candyPink/40 text-[10px] font-bold text-candyPink uppercase">
                    {girl.type === "anime" ? "Anime" : "Realistic"}
                  </span>
                </div>

                {/* Voice Audio Preview */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    playVoice(girl.voiceIntro);
                  }}
                  title="Hear her voice"
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 hover:border-candyPink flex items-center justify-center text-white hover:text-candyPink transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                {/* Bio Info */}
                <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
                  <h3 className="text-2xl font-black text-white group-hover:text-candyPink transition-colors">
                    {girl.name}, {girl.age}
                  </h3>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    {girl.tagline}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {girl.tags.map(t => (
                      <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-zinc-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3.5 bg-candySurface/80 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-candyPink" /> Chat & View Vault
                </span>
                <div className="w-7 h-7 rounded-full bg-candyPink/10 group-hover:bg-candyPink text-candyPink group-hover:text-white flex items-center justify-center transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ============================================================== */}
      {/* 💖 FULL COMPANION ROOM: CHAT + PHOTO VAULT + VIDEO STUDIO     */}
      {/* ============================================================== */}
      {selectedGirl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-5xl h-[92vh] rounded-3xl bg-candySurface border border-white/10 overflow-hidden flex flex-col lg:flex-row shadow-2xl">
            
            {/* Close */}
            <button
              onClick={() => setSelectedGirl(null)}
              className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-zinc-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Column: Live Screen / Video */}
            <div className="lg:w-1/2 h-72 lg:h-full relative bg-black flex items-center justify-center overflow-hidden">
              <video src={currentVideo} autoPlay loop playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-candySurface via-transparent to-black/40 pointer-events-none" />

              {/* Girl Info */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
                <img src={selectedGirl.avatar} alt="Avatar" className="w-11 h-11 rounded-full object-cover border-2 border-candyPink" />
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                    {selectedGirl.name}, {selectedGirl.age}
                  </h3>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Now
                  </span>
                </div>
              </div>

              {/* Call Button */}
              <button
                onClick={startCall}
                className="absolute bottom-6 left-6 z-10 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
              >
                <Phone className="w-4 h-4 animate-pulse" /> Video Call Her
              </button>
            </div>

            {/* Right Column: Multi-Tab Interaction (Chat / Vault / Video) */}
            <div className="lg:w-1/2 flex-1 flex flex-col justify-between p-6 bg-candySurface border-t lg:border-t-0 lg:border-l border-white/10">
              
              {/* Room Tab Switcher */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                {[
                  { id: "chat", label: "💬 Live Chat", icon: MessageCircle },
                  { id: "vault", label: "📸 Photo Vault", icon: ImageIcon },
                  { id: "video", label: "🎬 Video Studio", icon: Video }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setRoomTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      roomTab === tab.id
                        ? "bg-candyPink text-white shadow-lg shadow-candyPink/30"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: LIVE CHAT */}
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

                  {/* Reaction Pills */}
                  <div className="py-2 border-t border-white/[0.06]">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Quick Motion Actions:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "💋 Blow Kiss", text: "blows a warm kiss towards you" },
                        { label: "😳 Blush Shyly", text: "blushes and bites her lip gently" },
                        { label: "😏 Playful Wink", text: "gives a seductive wink" },
                        { label: "💃 360 Spin", text: "slow 360 spin showcasing full outfit" }
                      ].map(act => (
                        <button
                          key={act.label}
                          onClick={() => handleGenerateMotion(act.text)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 hover:border-candyPink text-zinc-300"
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Box + Gift */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => setShowVIPModal(true)}
                      title="Send Rose / Bitcoin Gift"
                      className="p-3 rounded-xl bg-candyPink/10 hover:bg-candyPink text-candyPink hover:text-white border border-candyPink/30 transition-all shrink-0"
                    >
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
                    <button
                      onClick={() => sendMessage()}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-candyPink to-candyPurple font-bold text-xs text-white shadow-lg"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: PHOTO VAULT */}
              {roomTab === "vault" && (
                <div className="flex-1 flex flex-col justify-between py-2 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-zinc-300">Unlocked Vault Photos ({selectedGirl.vaultPhotos.length})</span>
                      <span className="text-[10px] text-candyPink font-bold">HD Quality</span>
                    </div>

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
                </div>
              )}

              {/* TAB 3: VIDEO STUDIO */}
              {roomTab === "video" && (
                <div className="flex-1 flex flex-col justify-between py-2 space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-candyPink block mb-2">Prompt-Driven Video Generation:</label>
                    <textarea
                      value={videoPrompt}
                      onChange={e => setVideoPrompt(e.target.value)}
                      placeholder="Describe what she should do in the video... e.g. 'Slow camera push-in, wind in hair, looking into camera with a sweet smile'"
                      rows={4}
                      className="w-full rounded-2xl bg-black/50 border border-white/10 p-3.5 text-xs text-white focus:outline-none focus:border-candyPink"
                    />
                  </div>

                  <button
                    onClick={() => handleGenerateMotion()}
                    disabled={isGeneratingVideo}
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase bg-gradient-to-r from-candyPink to-candyPurple text-white shadow-xl shadow-candyPink/30 flex items-center justify-center gap-2"
                  >
                    {isGeneratingVideo ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Rendering {selectedGirl.name}&apos;s Video...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Render Custom Video
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 🌸 CHARACTER CREATOR MODAL ("CREATE YOUR DREAM AI GIRL")       */}
      {/* ============================================================== */}
      {showCreatorModal && (
        <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-candySurface border border-candyPink/40 p-6 sm:p-8 shadow-2xl">
            <button onClick={() => setShowCreatorModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-candyPink" /> Create Your AI Companion
            </h3>
            <p className="text-xs text-zinc-400 mb-5">Design her style, personality, and bring her to life instantly.</p>

            <form onSubmit={handleCreateCompanion} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">Companion Style:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCreatorForm({ ...creatorForm, type: "realistic" })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      creatorForm.type === "realistic" ? "bg-candyPink text-white border-candyPink" : "border-white/10 text-zinc-400"
                    }`}
                  >
                    📸 Realistic (HD)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreatorForm({ ...creatorForm, type: "anime" })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      creatorForm.type === "anime" ? "bg-candyPink text-white border-candyPink" : "border-white/10 text-zinc-400"
                    }`}
                  >
                    🌸 Anime & Manga
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Luna"
                    value={creatorForm.name}
                    onChange={e => setCreatorForm({ ...creatorForm, name: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-candyPink"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Age:</label>
                  <input
                    type="number"
                    min={18}
                    max={30}
                    value={creatorForm.age}
                    onChange={e => setCreatorForm({ ...creatorForm, age: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-candyPink"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Personality Archetype:</label>
                <select
                  value={creatorForm.category}
                  onChange={e => setCreatorForm({ ...creatorForm, category: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-candyPink"
                >
                  <option value="Sweetheart">Sweetheart & Romantic</option>
                  <option value="Tsundere">Tsundere (Feisty & Playful)</option>
                  <option value="Edgy">Cyberpunk / Rebel</option>
                  <option value="Luxury">Luxury Glamour Muse</option>
                  <option value="Goth">Goth & Mysterious</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Tagline / Bio:</label>
                <input
                  type="text"
                  placeholder="e.g. An aspiring painter who loves quiet coffee dates"
                  value={creatorForm.tagline}
                  onChange={e => setCreatorForm({ ...creatorForm, tagline: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-candyPink"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase bg-gradient-to-r from-candyPink to-candyPurple text-white shadow-xl shadow-candyPink/30"
              >
                Spawn Companion Into Studio
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 📞 FULL-SCREEN FACETIME / VIDEO CALL SIMULATOR                 */}
      {/* ============================================================== */}
      {isCalling && selectedGirl && (
        <div className="fixed inset-0 z-[160] bg-black/95 flex flex-col items-center justify-between p-6 sm:p-10 animate-fade-in">
          <div className="text-center z-10">
            <h2 className="text-2xl font-black text-white">{selectedGirl.name}</h2>
            <p className="text-xs text-candyPink font-mono mt-1">
              {callConnected ? "00:34 • Live HD Video Call" : "Calling Companion..."}
            </p>
          </div>

          <div className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden border-2 border-candyPink/50 shadow-2xl shadow-candyPink/30 flex items-center justify-center bg-zinc-950">
            {callConnected ? (
              <video src={selectedGirl.video} autoPlay loop playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-candyPink to-candyPurple animate-ping">
                  <img src={selectedGirl.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                </div>
                <p className="text-xs text-zinc-400 font-mono tracking-widest uppercase">Connecting encrypted stream...</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 z-10">
            <button
              onClick={endCall}
              className="p-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/40 transition-all active:scale-95"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 💎 VIP CHECKOUT MODAL (CARD + BITCOIN COINBASE PAYOUT)         */}
      {/* ============================================================== */}
      {showVIPModal && (
        <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-candySurface border border-candyPink/40 p-6 sm:p-8 shadow-2xl text-center">
            <button onClick={() => setShowVIPModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              ✕
            </button>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-candyPink to-candyPurple mx-auto flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-white" />
            </div>

            <h3 className="text-2xl font-black text-white uppercase tracking-wider">VIP Diamond Pass</h3>
            <p className="text-xs text-zinc-400 mt-1">100% Ad-Free, Unlock All Photo Vaults, & Unlimited 4K Video Calls.</p>

            {/* Pricing Card */}
            <div className="p-4 my-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase text-candyPink">VIP Lifetime Pass</span>
                <span className="text-lg font-black text-white">$14.99 <span className="text-xs font-normal text-zinc-400">USD</span></span>
              </div>
              <ul className="text-xs text-zinc-300 space-y-1">
                <li>✓ Zero advertisements permanently</li>
                <li>✓ Full Photo Vault access unlocked for all girls</li>
                <li>✓ Unlimited HD FaceTime Video Calls</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setIsVIP(true);
                if (typeof window !== "undefined") {
                  localStorage.setItem("velvet_vip", "true");
                }
                setShowVIPModal(false);
                alert("👑 VIP Activated! All ads removed & photo vaults unlocked.");
              }}
              className="w-full py-3.5 rounded-xl font-bold text-xs uppercase bg-gradient-to-r from-candyPink to-candyPurple text-white shadow-lg shadow-candyPink/25 mb-4 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" /> Pay $14.99 with Card / Apple Pay
            </button>

            {/* Bitcoin Section */}
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-left">
              <p className="text-[10px] uppercase font-bold text-amber-300 mb-1">Or Pay with Coinbase Bitcoin:</p>
              <p className="text-xs font-mono text-zinc-300 truncate">{BTC_ADDRESS}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(BTC_ADDRESS);
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
