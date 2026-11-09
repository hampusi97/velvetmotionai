"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, Sparkles, Phone, PhoneOff, Gift, MessageCircle, Play, 
  Download, Wand2, RefreshCw, Zap, Volume2, ShieldCheck, 
  CreditCard, ExternalLink, QrCode, Copy, Check, X, Search, 
  Image as ImageIcon, PlusCircle, Video, Send, ChevronRight,
  Flame, Moon, Sun, Camera, Mic, MoreVertical, SlidersHorizontal, Lock, CheckCircle2
} from "lucide-react";

const BTC_ADDRESS = "bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k";

interface Message {
  id: string;
  sender: "user" | "companion";
  text: string;
  type?: "text" | "voice" | "selfie" | "video";
  mediaUrl?: string;
  timestamp: string;
}

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
  vaultPhotos: string[];
}

export default function Home() {
  const companions: Companion[] = [
    {
      id: "chloe",
      name: "Chloe",
      age: 21,
      tagline: "Your sweet college tutor who secretly has a crush on you...",
      category: "Sweetheart",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      voiceIntro: "Hey handsome! I was hoping you'd come message me today.",
      initialMessage: "I finished my study session early just so we could talk. Tell me, what's on your mind?",
      tags: ["College", "Sweet", "Romantic"],
      intimacy: 75,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "elena",
      name: "Elena",
      age: 22,
      tagline: "Cyberpunk street racer who only opens up to you.",
      category: "Edgy",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voiceIntro: "Hey trouble. Ready to hit the neon streets with me?",
      initialMessage: "Hop in. Let's get out of this rainy city and find somewhere quiet.",
      tags: ["Cyberpunk", "Edgy", "Rebel"],
      intimacy: 60,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "aria",
      name: "Aria",
      age: 20,
      tagline: "Tokyo gamer girl & anime streamer who gets shy on camera.",
      category: "Anime",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      voiceIntro: "You finally joined my stream! I made this private room just for you.",
      initialMessage: "I put on my favorite oversized hoodie. Come sit right next to me?",
      tags: ["Anime", "Gamer", "Playful"],
      intimacy: 85,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "sienna",
      name: "Sienna",
      age: 24,
      tagline: "High-fashion French model vacationing on a yacht in Monaco.",
      category: "Luxury",
      avatar: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voiceIntro: "Pour some champagne darling, you have my full attention tonight.",
      initialMessage: "The Mediterranean breeze is intoxicating. Come sit with me on the deck?",
      tags: ["Luxury", "Glamour", "French"],
      intimacy: 50,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80"
      ]
    }
  ];

  // App Navigation & Active Companion
  const [activeTab, setActiveTab] = useState<"chats" | "explore">("chats");
  const [selectedGirl, setSelectedGirl] = useState<Companion>(companions[0]);
  const [showRightDrawer, setShowRightDrawer] = useState(true);

  // Chat Stream & Memory
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // FaceTime Simulator
  const [isCalling, setIsCalling] = useState(false);
  const [callConnected, setCallConnected] = useState(false);

  // VIP & Monetization
  const [isVIP, setIsVIP] = useState(false);
  const [showVIPModal, setShowVIPModal] = useState(false);
  const [copiedBTC, setCopiedBTC] = useState(false);

  // Welcome Kiss
  const [showIntro, setShowIntro] = useState(true);
  const [kissTriggered, setKissTriggered] = useState(false);

  // Load chat memory for selected companion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVIP = localStorage.getItem("velvet_vip");
      if (savedVIP === "true") setIsVIP(true);

      const mem = localStorage.getItem(`chat_mem_${selectedGirl.id}`);
      if (mem) {
        try {
          setMessages(JSON.parse(mem));
          return;
        } catch (e) {}
      }
      // Default initial message
      const init: Message[] = [
        {
          id: "m_init",
          sender: "companion",
          text: selectedGirl.initialMessage,
          timestamp: "Just now"
        }
      ];
      setMessages(init);
    }
  }, [selectedGirl]);

  // Save chat to localStorage on changes
  useEffect(() => {
    if (messages.length > 0 && typeof window !== "undefined") {
      localStorage.setItem(`chat_mem_${selectedGirl.id}`, JSON.stringify(messages));
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedGirl]);

  // Voice Note Synthesis
  const playVoice = (phrase: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(phrase);
      u.pitch = 1.2;
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  // Send Message
  const handleSend = (overrideText?: string) => {
    const text = overrideText || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Companion Response
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        `*smiles warmly at you* Mmm, I love hearing from you... tell me more, handsome.`,
        `*blushes and tucks hair behind ear* You always make my heart beat faster when you message me!`,
        `*leans in closer* Come closer to the screen... I want to look into your eyes.`
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];
      const compMsg: Message = {
        id: `c_${Date.now()}`,
        sender: "companion",
        text: reply,
        timestamp: "Just now"
      };
      setMessages(prev => [...prev, compMsg]);
      playVoice(reply.replace(/\*.*?\*/g, ""));
    }, 1100);
  };

  // Request In-Chat Selfie Photo
  const handleRequestSelfie = () => {
    const selfieMsg: Message = {
      id: `u_selfie_${Date.now()}`,
      sender: "user",
      text: "Can you send me a private selfie?",
      timestamp: "Just now"
    };
    setMessages(prev => [...prev, selfieMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const randomPhoto = selectedGirl.vaultPhotos[Math.floor(Math.random() * selectedGirl.vaultPhotos.length)];
      const photoMsg: Message = {
        id: `c_selfie_${Date.now()}`,
        sender: "companion",
        text: "*snaps a quick photo for you* Here you go, handsome! Do you like how I look today?",
        type: "selfie",
        mediaUrl: randomPhoto,
        timestamp: "Just now"
      };
      setMessages(prev => [...prev, photoMsg]);
      playVoice("Here you go, handsome! Do you like how I look today?");
    }, 1600);
  };

  // Request Video Motion
  const handleRequestVideo = (motionType: string) => {
    const reqMsg: Message = {
      id: `u_vid_${Date.now()}`,
      sender: "user",
      text: `Can you ${motionType} for me on video?`,
      timestamp: "Just now"
    };
    setMessages(prev => [...prev, reqMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const vidMsg: Message = {
        id: `c_vid_${Date.now()}`,
        sender: "companion",
        text: `*renders video clip* Anything for you! Look at my new video motion clip:`,
        type: "video",
        mediaUrl: selectedGirl.video,
        timestamp: "Just now"
      };
      setMessages(prev => [...prev, vidMsg]);
      playVoice("Anything for you! Watch my new video motion clip.");
    }, 2000);
  };

  // FaceTime Call
  const startCall = () => {
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

  return (
    <div className="h-screen w-screen bg-[#07060A] text-white flex flex-col overflow-hidden select-none relative font-sans">
      
      {/* Ambient Radial Lights */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[180px] pointer-events-none -z-10 animate-glow" />

      {/* 💋 INTRO KISS SCREEN */}
      {showIntro && (
        <div
          onClick={() => {
            setKissTriggered(true);
            setTimeout(() => setShowIntro(false), 1600);
          }}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center cursor-pointer p-4"
        >
          {!kissTriggered ? (
            <div className="text-center animate-pulse flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-pink-600 to-purple-600 shadow-2xl shadow-pink-600/50">
                <div className="w-full h-full rounded-full bg-[#07060A] flex items-center justify-center">
                  <Heart className="w-9 h-9 text-pink-500 animate-bounce fill-pink-500" />
                </div>
              </div>
              <h2 className="text-3xl font-black">VELVET<span className="text-pink-500">MOTION</span></h2>
              <p className="text-xs text-zinc-400 uppercase tracking-widest">Tap to enter private companion studio</p>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center animate-fade-in">
              <svg viewBox="0 0 100 70" className="w-52 h-auto text-pink-500 fill-current filter drop-shadow-[0_0_30px_#FF007F]">
                <path d="M50 15 C40 5, 20 5, 10 20 C18 24, 30 22, 50 30 C70 22, 82 24, 90 20 C80 5, 60 5, 50 15 Z" />
                <path d="M10 28 C25 35, 38 33, 50 38 C62 33, 75 35, 90 28 C75 55, 65 65, 50 60 C35 65, 25 55, 10 28 Z" />
              </svg>
              <p className="text-xl font-bold text-white mt-4">&ldquo;Welcome back, handsome.&rdquo;</p>
            </div>
          )}
        </div>
      )}

      {/* TOP HEADER */}
      <header className="h-14 border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between bg-[#07060A]/90 backdrop-blur-xl shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 p-[2px]">
            <div className="w-full h-full bg-[#07060A] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-pink-500" />
            </div>
          </div>
          <span className="text-lg font-black tracking-tight">VELVET<span className="text-pink-500">MOTION</span></span>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-zinc-300">
            💎 50 Gems
          </div>
          {isVIP ? (
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> VIP (Ad-Free)
            </span>
          ) : (
            <button
              onClick={() => setShowVIPModal(true)}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-xs font-bold text-white shadow-lg active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 inline mr-1" /> Get VIP
            </button>
          )}
        </div>
      </header>

      {/* MAIN THREE-COLUMN APP WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ============================================================== */}
        {/* 1. LEFT SIDEBAR: ACTIVE CHATS & DISCOVER                       */}
        {/* ============================================================== */}
        <aside className="w-72 border-r border-white/[0.08] bg-[#0E0C15]/70 flex flex-col justify-between hidden md:flex shrink-0">
          <div>
            <div className="p-3 border-b border-white/[0.06]">
              <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-black/40 border border-white/10">
                <button
                  onClick={() => setActiveTab("chats")}
                  className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 ${
                    activeTab === "chats" ? "bg-pink-600 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Chats
                </button>
                <button
                  onClick={() => setActiveTab("explore")}
                  className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 ${
                    activeTab === "explore" ? "bg-pink-600 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" /> Explore
                </button>
              </div>
            </div>

            {/* Companions Chat List */}
            <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
              {companions.map(girl => {
                const isSelected = selectedGirl.id === girl.id;
                return (
                  <div
                    key={girl.id}
                    onClick={() => {
                      setSelectedGirl(girl);
                      setActiveTab("chats");
                    }}
                    className={`p-2.5 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-pink-600/15 border border-pink-500/40 text-white"
                        : "hover:bg-white/[0.04] text-zinc-300"
                    }`}
                  >
                    <div className="relative w-11 h-11 rounded-full shrink-0">
                      <img src={girl.avatar} alt={girl.name} className="w-full h-full rounded-full object-cover" />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0E0C15]" />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white truncate">{girl.name}</span>
                        <span className="text-[10px] text-zinc-500">Live</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{`"${girl.initialMessage}"`}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Profile Pill at Bottom */}
          <div className="p-3 border-t border-white/[0.08] flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-600/20 text-pink-400 flex items-center justify-center font-bold text-xs">
                👤
              </div>
              <div>
                <p className="text-xs font-bold text-white">Guest Account</p>
                <p className="text-[10px] text-emerald-400">Synced to Cloud</p>
              </div>
            </div>
            <button onClick={() => setShowVIPModal(true)} className="text-xs font-bold text-pink-500 hover:underline">
              VIP
            </button>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* 2. CENTER STAGE: DEDICATED CHAT OR EXPLORE DIRECTORY            */}
        {/* ============================================================== */}
        {activeTab === "chats" ? (
          <main className="flex-1 flex flex-col justify-between bg-[#0B0912]/80 relative overflow-hidden">
            
            {/* Chat Room Top Bar */}
            <div className="h-16 border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between bg-[#0E0C15]/50 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <img src={selectedGirl.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-pink-500" />
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {selectedGirl.name}, {selectedGirl.age}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-600/20 text-pink-400 font-normal">
                      {selectedGirl.category}
                    </span>
                  </h3>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Now • Memory Synced
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={startCall}
                  className="px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 animate-pulse" /> Call Her
                </button>
                <button
                  onClick={() => setShowRightDrawer(!showRightDrawer)}
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((m) => {
                const isUser = m.sender === "user";
                return (
                  <div key={m.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] text-zinc-500 font-bold mb-1">
                      {isUser ? "You" : selectedGirl.name}
                    </span>
                    
                    {/* Media attachments */}
                    {m.type === "selfie" && m.mediaUrl && (
                      <div className="mb-2 max-w-xs rounded-2xl overflow-hidden border border-pink-500/40 shadow-xl">
                        <img src={m.mediaUrl} alt="Selfie" className="w-full h-auto object-cover" />
                      </div>
                    )}

                    {m.type === "video" && m.mediaUrl && (
                      <div className="mb-2 max-w-xs rounded-2xl overflow-hidden border border-purple-500/40 shadow-xl">
                        <video src={m.mediaUrl} autoPlay loop playsInline className="w-full h-auto object-cover" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? "bg-pink-600 text-white rounded-br-none"
                          : "bg-[#181424] border border-white/10 text-zinc-200 rounded-bl-none shadow-lg"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                  <span>{selectedGirl.name} is typing...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Bottom Actions & Text Input */}
            <div className="p-3 sm:p-4 bg-[#0E0C15]/80 border-t border-white/[0.08] space-y-2.5">
              
              {/* Quick Action Chips */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                <button
                  onClick={handleRequestSelfie}
                  className="px-3 py-1.5 rounded-full bg-pink-600/15 border border-pink-500/30 text-pink-400 hover:bg-pink-600 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
                >
                  <Camera className="w-3.5 h-3.5" /> Send Selfie
                </button>
                <button
                  onClick={() => handleRequestVideo("blow a kiss")}
                  className="px-3 py-1.5 rounded-full bg-purple-600/15 border border-purple-500/30 text-purple-400 hover:bg-purple-600 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
                >
                  <Video className="w-3.5 h-3.5" /> Blow Kiss Video
                </button>
                <button
                  onClick={() => handleRequestVideo("spin around in full outfit")}
                  className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold shrink-0"
                >
                  💃 360 Spin
                </button>
                <button
                  onClick={() => setShowVIPModal(true)}
                  className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 shrink-0"
                >
                  <Gift className="w-3.5 h-3.5" /> Send BTC Rose
                </button>
              </div>

              {/* Chat Input Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Say something to ${selectedGirl.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500 transition-all"
                />
                <button
                  onClick={() => handleSend()}
                  className="p-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-lg shadow-pink-600/30 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </main>
        ) : (
          /* EXPLORE DIRECTORY VIEW */
          <main className="flex-1 p-6 overflow-y-auto bg-[#07060A]">
            <h2 className="text-xl font-black mb-4">Explore AI Companions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {companions.map(girl => (
                <div
                  key={girl.id}
                  onClick={() => {
                    setSelectedGirl(girl);
                    setActiveTab("chats");
                  }}
                  className="candy-card rounded-3xl overflow-hidden cursor-pointer group flex flex-col"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
                    <img src={girl.avatar} alt={girl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white">{girl.name}, {girl.age}</h3>
                      <p className="text-xs text-zinc-300 line-clamp-1">{girl.tagline}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-white/[0.02] flex items-center justify-between text-xs font-bold text-pink-500">
                    <span>Chat Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* ============================================================== */}
        {/* 3. RIGHT DRAWER: PROFILE, INTIMACY & PHOTO VAULT                */}
        {/* ============================================================== */}
        {showRightDrawer && (
          <aside className="w-80 border-l border-white/[0.08] bg-[#0E0C15]/90 flex flex-col justify-between overflow-y-auto hidden lg:flex shrink-0 p-5 space-y-6">
            
            {/* Live Looping Video Banner */}
            <div className="relative aspect-[9/12] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
              <video src={selectedGirl.video} autoPlay loop playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedGirl.name}</h4>
                  <p className="text-[10px] text-zinc-400">{selectedGirl.category}</p>
                </div>
                <button
                  onClick={() => playVoice(selectedGirl.voiceIntro)}
                  className="w-8 h-8 rounded-full bg-pink-600 hover:bg-pink-700 flex items-center justify-center text-white shadow-lg"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Intimacy / Affection Progress Bar */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-zinc-400">Intimacy: <strong className="text-pink-500">Level 3 (Crush)</strong></span>
                <span className="text-pink-500">{selectedGirl.intimacy}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                <div style={{ width: `${selectedGirl.intimacy}%` }} className="h-full bg-gradient-to-r from-pink-600 to-purple-600 rounded-full" />
              </div>
              <p className="text-[10px] text-zinc-500">Send gifts or chat to unlock Level 4 Lover privileges.</p>
            </div>

            {/* Photo Vault Section */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-zinc-300">Unlocked Vault Photos</span>
                <span className="text-pink-500">{selectedGirl.vaultPhotos.length} Photos</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {selectedGirl.vaultPhotos.map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/10 cursor-pointer hover:border-pink-500 transition-all">
                    <img src={img} alt="Vault" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Virtual Bitcoin Gifts (Funding bc1qjmf...) */}
            <div className="space-y-2 pt-2 border-t border-white/[0.08]">
              <span className="text-xs font-bold text-zinc-300 block">Send Virtual Gift:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowVIPModal(true)}
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-pink-600/20 border border-white/10 text-left transition-all"
                >
                  <span className="text-xs block">🌹 Rose</span>
                  <span className="text-[10px] text-zinc-500">0.00005 BTC</span>
                </button>
                <button
                  onClick={() => setShowVIPModal(true)}
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-purple-600/20 border border-white/10 text-left transition-all"
                >
                  <span className="text-xs block">🍾 VIP Bubbly</span>
                  <span className="text-[10px] text-zinc-500">0.0001 BTC</span>
                </button>
              </div>
            </div>

          </aside>
        )}

      </div>

      {/* FULL-SCREEN FACETIME VIDEO CALL SIMULATOR */}
      {isCalling && (
        <div className="fixed inset-0 z-[160] bg-black/95 flex flex-col items-center justify-between p-6 sm:p-10 animate-fade-in">
          <div className="text-center z-10">
            <h2 className="text-2xl font-black text-white">{selectedGirl.name}</h2>
            <p className="text-xs text-pink-500 font-mono mt-1">
              {callConnected ? "00:28 • Live HD Companion Call" : "Calling Companion..."}
            </p>
          </div>
          <div className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden border-2 border-pink-500/50 shadow-2xl flex items-center justify-center bg-zinc-950">
            {callConnected ? (
              <video src={selectedGirl.video} autoPlay loop playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-pink-600 to-purple-600 animate-ping">
                  <img src={selectedGirl.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                </div>
                <p className="text-xs text-zinc-400 font-mono uppercase">Connecting stream...</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-6 z-10">
            <button onClick={endCall} className="p-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl active:scale-95">
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}

      {/* VIP CHECKOUT MODAL (CARD & BITCOIN COINBASE INTEGRATION) */}
      {showVIPModal && (
        <div className="fixed inset-0 z-[170] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-[#120E1C] border border-pink-500/40 p-6 sm:p-8 shadow-2xl text-center">
            <button onClick={() => setShowVIPModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">✕</button>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 mx-auto flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider">VIP Diamond Pass</h3>
            <p className="text-xs text-zinc-400 mt-1">100% Ad-Free, Unlimited HD Companion Calls, & Photo Vaults.</p>

            <div className="p-4 my-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase text-pink-500">VIP Lifetime Pass</span>
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
              className="w-full py-3.5 rounded-xl font-bold text-xs uppercase bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg mb-4 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" /> Pay $14.99 with Card / Apple Pay
            </button>

            <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-left">
              <p className="text-[10px] uppercase font-bold text-amber-300 mb-1">Or Pay with Coinbase Bitcoin:</p>
              <p className="text-xs font-mono text-zinc-300 truncate">{BTC_ADDRESS}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(BTC_ADDRESS);
                  setCopiedBTC(true);
                  setTimeout(() => setCopiedBTC(false), 2000);
                }}
                className="mt-2 text-xs font-bold text-pink-400 hover:underline flex items-center gap-1"
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
