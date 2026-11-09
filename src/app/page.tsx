"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, Sparkles, Phone, PhoneOff, Gift, MessageCircle, Play, 
  Download, Wand2, RefreshCw, Zap, Volume2, VolumeX, ShieldCheck, 
  CreditCard, ExternalLink, QrCode, Copy, Check, X, Search, ChevronRight, Eye
} from "lucide-react";

const BTC_ADDRESS = "bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k";

interface Companion {
  id: string;
  name: string;
  age: number;
  tagline: string;
  category: string;
  avatar: string;
  video: string;
  voiceIntro: string;
  initialMessage: string;
  tags: string[];
  intimacy: number;
}

export default function Home() {
  // Roster of AI Girlfriends
  const companions: Companion[] = [
    {
      id: "chloe",
      name: "Chloe",
      age: 21,
      tagline: "Your sweet college tutor who secretly has a crush on you...",
      category: "Sweetheart",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      voiceIntro: "Hey there! I was hoping you'd come talk to me today...",
      initialMessage: "I finished my study session early just so we could talk. What are we doing tonight?",
      tags: ["Sweet", "College", "Romantic"],
      intimacy: 75
    },
    {
      id: "elena",
      name: "Elena",
      age: 22,
      tagline: "Cyberpunk street racer with an attitude who only trusts you.",
      category: "Edgy",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voiceIntro: "Hey trouble. Ready to hit the neon streets with me?",
      initialMessage: "Hop in. Let's get out of this rainy city and go somewhere private.",
      tags: ["Cyberpunk", "Rebel", "Edgy"],
      intimacy: 60
    },
    {
      id: "aria",
      name: "Aria",
      age: 20,
      tagline: "Tokyo gamer girl & anime streamer who gets shy on camera.",
      category: "Anime",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      voiceIntro: "You finally joined my stream! I made this private room just for you...",
      initialMessage: "I put on my favorite hoodie and set up the neon lights. Sit next to me?",
      tags: ["Anime", "Gamer", "Playful"],
      intimacy: 85
    },
    {
      id: "sienna",
      name: "Sienna",
      age: 24,
      tagline: "High-fashion French model vacationing on a yacht in Monaco.",
      category: "Luxury",
      avatar: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voiceIntro: "Pour some champagne darling, you have my full attention.",
      initialMessage: "The Mediterranean breeze is intoxicating tonight. Come hold my hand?",
      tags: ["Luxury", "Glamour", "Mature"],
      intimacy: 50
    },
    {
      id: "raven",
      name: "Raven",
      age: 22,
      tagline: "Mysterious goth artist with a soft spot for deep late-night talks.",
      category: "Goth",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      voiceIntro: "I was painting in the dark listening to rain. I'm glad you called.",
      initialMessage: "Everyone thinks I'm cold, but I'm only vulnerable when it's just the two of us.",
      tags: ["Goth", "Mysterious", "Deep"],
      intimacy: 40
    },
    {
      id: "mia",
      name: "Mia",
      age: 21,
      tagline: "Your athletic neighbor who loves playful teasing and gym sessions.",
      category: "Sweetheart",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      voiceIntro: "Hey neighbor! Were you watching me from across the hall?",
      initialMessage: "Just finished working out! Help me stretch or let's watch a movie together.",
      tags: ["Sporty", "Tease", "Neighbor"],
      intimacy: 65
    }
  ];

  // State Management
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedGirl, setSelectedGirl] = useState<Companion | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Companion Room State
  const [roomMessages, setRoomMessages] = useState<{ sender: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string>("");
  const [affectionPoints, setAffectionPoints] = useState(65);

  // FaceTime Simulator State
  const [isCalling, setIsCalling] = useState(false);
  const [callConnected, setCallConnected] = useState(false);

  // VIP & Monetization State
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
    const matchesCat = activeCategory === "All" || c.category === activeCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Open Room for a Companion
  const openCompanionRoom = (girl: Companion) => {
    setSelectedGirl(girl);
    setCurrentVideo(girl.video);
    setAffectionPoints(girl.intimacy);
    setRoomMessages([
      { sender: girl.name, text: girl.initialMessage }
    ]);
  };

  // Voice Speech Synthesis
  const playVoiceNote = (phrase: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(phrase);
      u.pitch = 1.2;
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  // Send Message in Room
  const sendMessage = (textToSend?: string) => {
    const msg = textToSend || chatInput;
    if (!msg.trim() || !selectedGirl) return;

    setRoomMessages(prev => [...prev, { sender: "You", text: msg }]);
    setChatInput("");

    // Companion replies
    setTimeout(() => {
      const replies = [
        "Mmm, I love when you talk like that to me...",
        "You're making my heart beat so fast right now!",
        "Let me make a private video just for you based on that...",
        "Come closer to the screen... I want to look into your eyes."
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setRoomMessages(prev => [...prev, { sender: selectedGirl.name, text: reply }]);
      playVoiceNote(reply);
      setAffectionPoints(prev => Math.min(100, prev + 5));
    }, 1000);
  };

  // Generate Motion Video in Room
  const triggerReactionMotion = (actionPrompt: string) => {
    if (!selectedGirl) return;
    setIsGeneratingVideo(true);
    sendMessage(`*Requested video:* ${actionPrompt}`);

    setTimeout(() => {
      setIsGeneratingVideo(false);
      setAffectionPoints(prev => Math.min(100, prev + 8));
    }, 2000);
  };

  // FaceTime Call
  const startCall = () => {
    if (!selectedGirl) return;
    setIsCalling(true);
    setCallConnected(false);
    setTimeout(() => {
      setCallConnected(true);
      playVoiceNote(selectedGirl.voiceIntro);
    }, 1600);
  };

  const endCall = () => {
    setIsCalling(false);
    setCallConnected(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleUpgrade = () => {
    setIsVIP(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("velvet_vip", "true");
    }
    setShowVIPModal(false);
  };

  return (
    <div className="min-h-screen bg-candyDark text-white flex flex-col select-none relative">
      
      {/* Background Neon Spotlights */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-candyPink/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-candyViolet/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* TOP NAVIGATION (Candy.ai Style) */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-candyDark/85 border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-candyPink via-pink-600 to-candyViolet p-[2px] shadow-lg shadow-candyPink/30">
            <div className="w-full h-full bg-candyDark rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-candyPink" />
            </div>
          </div>
          <span className="text-xl font-black tracking-tight text-white flex items-center">
            CANDY<span className="text-candyPink">MOTION</span>
          </span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-candySurface border border-white/10 w-72">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search AI girlfriends or tags..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white focus:outline-none w-full"
          />
        </div>

        {/* Right CTA / VIP Switch */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-zinc-300">
            <span>💎 50 Gems</span>
          </div>

          {isVIP ? (
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> VIP (Ad-Free)
            </span>
          ) : (
            <button
              onClick={() => setShowVIPModal(true)}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-candyPink to-candyViolet hover:opacity-90 text-xs font-bold text-white shadow-lg shadow-candyPink/30 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" /> Get VIP
            </button>
          )}
        </div>
      </header>

      {/* FILTER CATEGORY PILLS */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {["All", "Sweetheart", "Edgy", "Anime", "Luxury", "Goth"].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all shrink-0 ${
              activeCategory === cat
                ? "bg-candyPink text-white shadow-lg shadow-candyPink/40"
                : "bg-candySurface border border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MAIN MARKETPLACE: AI GIRLFRIEND GRID */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 pb-16 flex-1">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanions.map(girl => (
            <div
              key={girl.id}
              onClick={() => openCompanionRoom(girl)}
              className="candy-card rounded-3xl overflow-hidden cursor-pointer group relative flex flex-col"
            >
              {/* Full-bleed Portrait */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
                <img
                  src={girl.avatar}
                  alt={girl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100"
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-candyDark via-candyDark/25 to-transparent" />

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online
                  </span>
                </div>

                {/* Audio Voice Preview Button */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    playVoiceNote(girl.voiceIntro);
                  }}
                  title="Hear her voice"
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 hover:border-candyPink flex items-center justify-center text-white hover:text-candyPink transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                {/* Character Bio Info */}
                <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-white group-hover:text-candyPink transition-colors">
                      {girl.name}, {girl.age}
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    {girl.tagline}
                  </p>

                  {/* Character Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {girl.tags.map(t => (
                      <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-zinc-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Interactive Trigger Bar */}
              <div className="p-3.5 bg-candySurface/80 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-candyPink" /> Chat & Video Call
                </span>
                <div className="w-7 h-7 rounded-full bg-candyPink/10 group-hover:bg-candyPink text-candyPink group-hover:text-white flex items-center justify-center transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Crypto Ad Banner (Disappears for VIPs) */}
        {!isVIP && (
          <div className="mt-12 rounded-2xl border border-white/10 bg-candySurface/60 backdrop-blur-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                Sponsor
              </span>
              <p className="text-xs text-zinc-300">
                Support VelvetMotion — Trade crypto & Web3 companions with zero fees. Upgrade to VIP to remove ads!
              </p>
            </div>
            <button
              onClick={() => setShowVIPModal(true)}
              className="text-xs font-bold text-candyPink hover:underline"
            >
              Remove Ads ($14.99) ➔
            </button>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* 💖 FULL COMPANION ROOM MODAL (SLIDE-OVER / CHAT & VIDEO ROOM)  */}
      {/* ============================================================== */}
      {selectedGirl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-5xl h-[92vh] rounded-3xl bg-candySurface border border-white/10 overflow-hidden flex flex-col lg:flex-row shadow-2xl">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedGirl(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-zinc-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Column: Video & Visual Showcase */}
            <div className="lg:w-1/2 h-72 lg:h-full relative bg-black flex items-center justify-center overflow-hidden">
              <video
                src={currentVideo}
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-candySurface via-transparent to-black/40 pointer-events-none" />

              {/* Character Header Overlay */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
                <img src={selectedGirl.avatar} alt="Avatar" className="w-11 h-11 rounded-full object-cover border-2 border-candyPink" />
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                    {selectedGirl.name}, {selectedGirl.age}
                  </h3>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live in Room
                  </p>
                </div>
              </div>

              {/* FaceTime Call Button */}
              <button
                onClick={startCall}
                className="absolute bottom-6 left-6 z-10 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
              >
                <Phone className="w-4 h-4 animate-pulse" /> Video Call Her
              </button>
            </div>

            {/* Right Column: Interactive Chat & Actions */}
            <div className="lg:w-1/2 flex-1 flex flex-col justify-between p-6 bg-candySurface border-t lg:border-t-0 lg:border-l border-white/10">
              
              {/* Intimacy & Affection Bar */}
              <div className="border-b border-white/10 pb-4">
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-zinc-400">Intimacy Level: <strong className="text-candyPink">Level 3 (Sweethearts)</strong></span>
                  <span className="text-candyPink">{affectionPoints}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                  <div
                    style={{ width: `${affectionPoints}%` }}
                    className="h-full bg-gradient-to-r from-candyPink to-candyViolet rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
                {roomMessages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${m.sender === "You" ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] text-zinc-500 font-bold mb-1">{m.sender}</span>
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                        m.sender === "You"
                          ? "bg-candyPink text-white rounded-br-none"
                          : "bg-white/[0.04] border border-white/10 text-zinc-200 rounded-bl-none"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reaction Action Pills */}
              <div className="py-2">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Make {selectedGirl.name} React (Video Motion):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "💋 Blow Kiss", prompt: "leans forward and blows a warm kiss" },
                    { label: "😳 Blush Shyly", prompt: "blushes deeply and looks away shyly" },
                    { label: "😏 Playful Wink", prompt: "gives a seductive playful wink" },
                    { label: "💃 360 Spin", prompt: "spins around slowly in 360 degrees" }
                  ].map(act => (
                    <button
                      key={act.label}
                      onClick={() => triggerReactionMotion(act.prompt)}
                      disabled={isGeneratingVideo}
                      className="text-[11px] px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 hover:border-candyPink hover:text-candyPink text-zinc-300 transition-all active:scale-95"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input & Virtual Bitcoin Gift */}
              <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowVIPModal(true);
                  }}
                  title="Send Bitcoin Rose / Gift"
                  className="p-3 rounded-xl bg-candyPink/10 hover:bg-candyPink text-candyPink hover:text-white border border-candyPink/30 transition-all shrink-0"
                >
                  <Gift className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder={`Say something to ${selectedGirl.name}...`}
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-candyPink transition-all"
                />

                <button
                  onClick={() => sendMessage()}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-candyPink to-candyViolet font-bold text-xs text-white shadow-lg active:scale-95"
                >
                  Send
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN FACETIME / VIDEO CALL SIMULATOR */}
      {isCalling && selectedGirl && (
        <div className="fixed inset-0 z-[160] bg-black/95 flex flex-col items-center justify-between p-6 sm:p-10 animate-fade-in">
          <div className="text-center z-10">
            <h2 className="text-2xl font-black text-white">{selectedGirl.name}</h2>
            <p className="text-xs text-candyPink font-mono mt-1">
              {callConnected ? "00:28 • Live Encrypted Video Call" : "Calling Companion..."}
            </p>
          </div>

          <div className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden border-2 border-candyPink/50 shadow-2xl shadow-candyPink/30 flex items-center justify-center bg-zinc-950">
            {callConnected ? (
              <video src={selectedGirl.video} autoPlay loop playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-candyPink to-candyViolet animate-ping">
                  <img src={selectedGirl.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                </div>
                <p className="text-xs text-zinc-400 font-mono tracking-widest uppercase">Connecting live stream...</p>
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

      {/* VIP CHECKOUT MODAL (CARD & BITCOIN COINBASE INTEGRATION) */}
      {showVIPModal && (
        <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-candySurface border border-candyPink/40 p-6 sm:p-8 shadow-2xl text-center">
            <button
              onClick={() => setShowVIPModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-candyPink to-candyViolet mx-auto flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-white" />
            </div>

            <h3 className="text-2xl font-black text-white uppercase tracking-wider">VIP Soulmate Pass</h3>
            <p className="text-xs text-zinc-400 mt-1">100% Ad-Free, Unlimited HD Companion Calls, & Full Intimacy.</p>

            {/* Pricing Card */}
            <div className="p-4 my-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase text-candyPink">VIP Lifetime Pass</span>
                <span className="text-lg font-black text-white">$14.99 <span className="text-xs font-normal text-zinc-400">USD</span></span>
              </div>
              <ul className="text-xs text-zinc-300 space-y-1">
                <li>✓ Zero advertisements permanently</li>
                <li>✓ Unlimited 60FPS Video Generations</li>
                <li>✓ Uncensored FaceTime Video Calls with all girls</li>
              </ul>
            </div>

            {/* Card Checkout Button */}
            <button
              onClick={handleUpgrade}
              className="w-full py-3.5 rounded-xl font-bold text-xs uppercase bg-gradient-to-r from-candyPink to-candyViolet text-white shadow-lg shadow-candyPink/25 mb-4 flex items-center justify-center gap-2"
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
