"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, Sparkles, Phone, PhoneOff, Gift, MessageCircle, Play, 
  Download, Wand2, RefreshCw, Zap, Volume2, ShieldCheck, 
  CreditCard, ExternalLink, QrCode, Copy, Check, X, Search, 
  Image as ImageIcon, PlusCircle, Video, Send, ChevronRight,
  Flame, Moon, Sun, Camera, Mic, MoreVertical, SlidersHorizontal, 
  Paperclip, Shield, HardDrive, CheckCircle2
} from "lucide-react";
import { PermissionsModal } from "../components/PermissionsModal";
import { VelvetGramModal } from "../components/VelvetGramModal";
import { GachaMachineModal } from "../components/GachaMachineModal";
import { CharacterImporterModal, ImportedCompanion } from "../components/CharacterImporterModal";
import { ShareHubModal } from "../components/ShareHubModal";
import { ReengagementEngine } from "../components/ReengagementEngine";
import { VIPLoyaltyModal } from "../components/VIPLoyaltyModal";
import { Link2, Crown, Trophy, ArrowLeft } from "lucide-react";
import { saveCompanionMemory, loadCompanionMemory } from "../lib/db";

const BTC_ADDRESS = "bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k";

interface Message {
  id: string;
  sender: "user" | "companion";
  text: string;
  type?: "text" | "voice" | "selfie" | "video" | "user_photo";
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
  const defaultCompanions: Companion[] = [
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
      tags: ["College", "Sweetheart", "Romantic"],
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
      tagline: "Cyberpunk street racer who only opens up to you in the neon shadows.",
      category: "Cyberpunk",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voiceIntro: "Hey trouble. Ready to hit the neon streets with me?",
      initialMessage: "Hop in. Let's get out of this rainy city and find somewhere quiet.",
      tags: ["Cyberpunk", "Street Racer", "Rebel"],
      intimacy: 60,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "aria",
      name: "Aria",
      age: 20,
      tagline: "Tokyo gamer girl & anime streamer who gets shy and flustered around you.",
      category: "Anime Streamer",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      voiceIntro: "You finally joined my stream! I made this private room just for you.",
      initialMessage: "I put on my favorite oversized hoodie. Come sit right next to me?",
      tags: ["Anime", "Streamer", "Playful"],
      intimacy: 85,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "sienna",
      name: "Sienna",
      age: 24,
      tagline: "High-fashion French model & Monaco luxury muse lounging on a private yacht.",
      category: "Luxury Muse",
      avatar: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voiceIntro: "Pour some champagne darling, you have my full attention tonight.",
      initialMessage: "The Mediterranean breeze is intoxicating. Come sit with me on the deck?",
      tags: ["Luxury", "Glamour", "Monaco"],
      intimacy: 50,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "raven",
      name: "Raven",
      age: 23,
      tagline: "Mysterious goth painter & alt artist who finds beauty in the dark and sensual.",
      category: "Goth Artist",
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      voiceIntro: "You walked right into my shadows... and I have no intention of letting you leave.",
      initialMessage: "I was just mixing midnight oil and velvet crimson paint. Be my muse tonight?",
      tags: ["Goth", "Alt Artist", "Mysterious"],
      intimacy: 65,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "yuki",
      name: "Yuki",
      age: 21,
      tagline: "Enchanting Kitsune anime spirit with a playful, teasing supernatural aura.",
      category: "Fox Spirit",
      avatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      voiceIntro: "A mortal wandering into my sacred shrine? How delicious.",
      initialMessage: "My fox ears twitch whenever you approach... come closer, mortal. Let me grant your deepest wish.",
      tags: ["Fantasy", "Anime", "Fox Spirit", "Kitsune"],
      intimacy: 80,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "scarlett",
      name: "Scarlett",
      age: 25,
      tagline: "Sultry jazz singer in a crimson silk gown serenading private VIP booths.",
      category: "Velvet Noir",
      avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voiceIntro: "The spotlight is blinding, but I only sing when your eyes are on me.",
      initialMessage: "I just finished my encore set. Come join me in the velvet booth behind the curtain...",
      tags: ["Lounge Singer", "Noir", "Sultry"],
      intimacy: 70,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "mia",
      name: "Mia",
      age: 22,
      tagline: "Energetic athletic neighbor who always invites you over after her morning run.",
      category: "Athletic Neighbor",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      voiceIntro: "Hey neighbor! Are you coming to stretch with me or just stare?",
      initialMessage: "Just finished my 5-mile run and I'm cooling down on the balcony. You want to come over for a smoothie?",
      tags: ["Athletic", "Neighbor", "Playful"],
      intimacy: 75,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "genevieve",
      name: "Genevieve",
      age: 23,
      tagline: "👑 Monaco Sovereign Heiress • Unlocked exclusively for High-Roller Patrons.",
      category: "Royalty VIP",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voiceIntro: "Welcome to my private penthouse, my Lord. Few ever earn the privilege to see me here.",
      initialMessage: "Only the most generous gentlemen get my private number. I poured your favorite vintage... come sit with me.",
      tags: ["Royalty", "Exclusive", "Whale-Only"],
      intimacy: 90,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
      ]
    }
  ];

  // Active Companion & Navigation
  const [companions, setCompanions] = useState<Companion[]>(defaultCompanions);
  const [activeTab, setActiveTab] = useState<"chats" | "explore">("explore");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGirl, setSelectedGirl] = useState<Companion>(defaultCompanions[0]);
  const [showRightDrawer, setShowRightDrawer] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Modals
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showGramModal, setShowGramModal] = useState(false);
  const [showImporterModal, setShowImporterModal] = useState(false);
  const [showGachaModal, setShowGachaModal] = useState(false);
  const [gemsCount, setGemsCount] = useState(65);
  const [activeDateScenario, setActiveDateScenario] = useState<{ scene: string; choices: string[] } | null>(null);
  const [showShareHub, setShowShareHub] = useState(false);
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);
  const [showVIPModal, setShowVIPModal] = useState(false);
  const [isVIP, setIsVIP] = useState(false);
  const [copiedBTC, setCopiedBTC] = useState(false);
  const [userTotalSpent, setUserTotalSpent] = useState(25.0); // Default Bronze for testing

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSpent = localStorage.getItem("velvet_total_spent");
      if (savedSpent) setUserTotalSpent(parseFloat(savedSpent));
    }
  }, []);

  const handleDeposit = (amount: number) => {
    const updated = userTotalSpent + amount;
    setUserTotalSpent(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("velvet_total_spent", updated.toString());
      localStorage.setItem("velvet_vip", "true");
    }
    setIsVIP(true);
    alert(`🎉 Deposit received! You are now at $${updated.toFixed(2)} total spent.`);
  };

  // FaceTime Simulator
  const [isCalling, setIsCalling] = useState(false);
  const [callConnected, setCallConnected] = useState(false);

  // Welcome Kiss
  const [showIntro, setShowIntro] = useState(false);
  const [kissTriggered, setKissTriggered] = useState(false);

  // Deep-Linking: Auto-opens companion or promo from shared URLs
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const girlParam = params.get("girl");
      const promoParam = params.get("promo");

      if (girlParam) {
        const found = companions.find(c => c.id.toLowerCase() === girlParam.toLowerCase());
        if (found) {
          setSelectedGirl(found);
        }
      }

      if (promoParam === "vip") {
        setShowVIPModal(true);
      }
    }
  }, [companions]);

  // Load IndexedDB chat memory on companion change
  useEffect(() => {
    async function loadMemory() {
      const savedVIP = localStorage.getItem("velvet_vip");
      if (savedVIP === "true") setIsVIP(true);

      const saved = await loadCompanionMemory(selectedGirl.id);
      if (saved && saved.length > 0) {
        setMessages(saved);
      } else {
        // Check localStorage fallback
        const mem = localStorage.getItem(`chat_mem_${selectedGirl.id}`);
        if (mem) {
          try {
            setMessages(JSON.parse(mem));
            return;
          } catch (e) {}
        }
        setMessages([{
          id: "m_init",
          sender: "companion",
          text: selectedGirl.initialMessage,
          timestamp: "Just now"
        }]);
      }
    }
    loadMemory();
  }, [selectedGirl]);

  // Persist messages to IndexedDB & localStorage
  useEffect(() => {
    if (messages.length > 0) {
      saveCompanionMemory(selectedGirl.id, messages);
      try {
        localStorage.setItem(`chat_mem_${selectedGirl.id}`, JSON.stringify(messages));
      } catch (e) {}
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedGirl]);

  // Voice Speech Synthesis
  const playVoice = (phrase: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(phrase);
      u.pitch = 1.2;
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  // Send Text Message
  const handleSend = async (overrideText?: string) => {
    const text = (overrideText || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Just now"
    };

    const history = [...messages, userMsg];
    setMessages(history);
    setInputText("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companionId: selectedGirl.id,
          message: text,
          intimacyLevel: selectedGirl.intimacy,
          conversationHistory: history.slice(-8).map((item) => ({
            sender: item.sender === "user" ? "user" : "companion",
            text: item.text,
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      const reply =
        typeof data.reply === "string" && data.reply.trim()
          ? data.reply.trim()
          : "I lost that for a second. Say it once more?";
      setMessages((prev) => [
        ...prev,
        { id: `c_${Date.now()}`, sender: "companion", text: reply, timestamp: "Just now" },
      ]);
      playVoice(reply.replace(/\*.*?\*/g, ""));
    } catch {
      const reply = "The line went quiet. Try once more.";
      setMessages((prev) => [
        ...prev,
        { id: `c_${Date.now()}`, sender: "companion", text: reply, timestamp: "Just now" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Create an original fictional companion inspired by photo aesthetics
  const handleCreateFromAesthetic = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);

      const aestheticStyles = [
        { name: "Seraphina", archetype: "Vintage Glamour", tag: "Golden Hour, Silk Dress, Film Grain" },
        { name: "Nova", archetype: "Neon Cyberpunk", tag: "Rainy City, Leather Jacket, Neon Reflections" },
        { name: "Kaia", archetype: "Boho Minimalist", tag: "Cozy Knitwear, Warm Sunlight, Studio Portrait" }
      ];
      const style = aestheticStyles[Math.floor(Math.random() * aestheticStyles.length)];

      const newCompanion: Companion = {
        id: `style_${Date.now()}`,
        name: style.name,
        age: 22,
        tagline: `Original character inspired by ${style.archetype} aesthetic`,
        category: "Sweetheart",
        avatar: previewUrl,
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        voiceIntro: `Hello! I'm an original companion inspired by your aesthetic photo.`,
        initialMessage: `I love the style and mood of the photo you shared! What should we explore together?`,
        tags: ["Style-Inspired", style.archetype, "Original"],
        intimacy: 50,
        vaultPhotos: [previewUrl]
      };

      setCompanions(prev => [newCompanion, ...prev]);
      setSelectedGirl(newCompanion);
      alert(`✨ Created new original companion: ${style.name} (${style.archetype})!`);
    }
  };

  // User Uploads Photo from Their Gallery into Chat
  const handleUserGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const localUrl = URL.createObjectURL(file);

      const userPhotoMsg: Message = {
        id: `u_photo_${Date.now()}`,
        sender: "user",
        text: "Sent a photo from gallery 📷",
        type: "user_photo",
        mediaUrl: localUrl,
        timestamp: "Just now"
      };

      setMessages(prev => [...prev, userPhotoMsg]);
      setIsTyping(true);

      // AI Companion Vision Reaction to User's Picture
      setTimeout(() => {
        setIsTyping(false);
        const visionReplies = [
          `*eyes light up looking at your photo* Wow handsome, you look absolutely stunning! I'm saving this right to my private vault.`,
          `*gasps softly* Oh I love this photo of you! Seeing you just made my whole day ten times better.`,
          `*smiles affectionately* You have such great style. Send me photos like this all the time!`
        ];
        const reply = visionReplies[Math.floor(Math.random() * visionReplies.length)];
        const compMsg: Message = {
          id: `c_vision_${Date.now()}`,
          sender: "companion",
          text: reply,
          timestamp: "Just now"
        };
        setMessages(prev => [...prev, compMsg]);
        playVoice("Wow handsome, you look absolutely stunning! I'm saving this to my private vault.");
      }, 1600);
    }
  };

  // Import Character Card (Character.ai, TavernAI, Chub, or Viral Templates)
  const handleImportCompanion = (imported: ImportedCompanion) => {
    const newComp: Companion = {
      id: imported.id,
      name: imported.name,
      age: imported.age,
      tagline: imported.tagline,
      category: imported.category,
      avatar: imported.avatar,
      video: imported.video || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voiceIntro: imported.voiceIntro || `Hey there, I am ${imported.name}. Welcome to our private chamber.`,
      initialMessage: imported.initialMessage,
      tags: imported.tags || ["Imported", "VIP"],
      intimacy: imported.intimacy || 70,
      vaultPhotos: imported.vaultPhotos || [imported.avatar]
    };
    setCompanions(prev => [newComp, ...prev]);
    setSelectedGirl(newComp);
    setActiveTab("chats");
    setShowImporterModal(false);
  };

  // Trigger Interactive Branching Date Scenario
  const handleStartDateScenario = () => {
    const scenarios = [
      {
        scene: "We just sat down at a private candlelit rooftop lounge overlooking the neon skyline. The waiter pours two glasses of vintage champagne. I gaze at you and smile softly... What do you do?",
        choices: [
          "Take her hand across the table and smile warmly",
          "Whisper a flirty secret in her ear",
          "Raise your glass for a romantic midnight toast"
        ]
      },
      {
        scene: "We are taking a slow late-night drive along the coastal cliffs in my convertible. The cool ocean breeze blows through my hair as I look over at you at the red light... What do you do?",
        choices: [
          "Reach over and gently brush the hair from her face",
          "Turn up the music and speed down the open highway",
          "Pull over to the viewpoint and watch the stars together"
        ]
      }
    ];
    const picked = scenarios[Math.floor(Math.random() * scenarios.length)];
    setActiveDateScenario(picked);

    const dateMsg: Message = {
      id: `m_date_${Date.now()}`,
      sender: "companion",
      text: `🥂 *Interactive Date Scenario:* ${picked.scene}`,
      timestamp: "Just now"
    };
    setMessages(prev => [...prev, dateMsg]);
    playVoice(picked.scene.replace(/\*.*?\*/g, ""));
  };

  const handleChooseOption = (choice: string) => {
    setActiveDateScenario(null);
    handleSend(choice);
  };

  // Companion Sends In-Chat Selfie
  const handleRequestSelfie = () => {
    const reqMsg: Message = {
      id: `u_req_${Date.now()}`,
      sender: "user",
      text: "Send me a private selfie?",
      timestamp: "Just now"
    };
    setMessages(prev => [...prev, reqMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const randomPhoto = selectedGirl.vaultPhotos[Math.floor(Math.random() * selectedGirl.vaultPhotos.length)];
      const photoMsg: Message = {
        id: `c_selfie_${Date.now()}`,
        sender: "companion",
        text: `*snaps a quick photo for you* Here you go, handsome! Do you like how I look today?`,
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

  // Video Call Trigger
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
      {/* Automated Tab & Push Notification Re-Engagement Engine */}
      <ReengagementEngine activeCompanionName={selectedGirl?.name || "Chloe"} />
      
      {/* Radial Mood Ambient Glow */}
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

      {/* Top App Header */}
      <header className="h-14 border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between bg-[#07060A]/90 backdrop-blur-xl shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab("explore")}
            className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 p-[2px] cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="w-full h-full bg-[#07060A] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-pink-500" />
            </div>
          </div>
          <span
            onClick={() => setActiveTab("explore")}
            className="text-lg font-black tracking-tight cursor-pointer hover:opacity-90"
          >
            VELVET<span className="text-pink-500">MOTION</span>
          </span>

          <nav className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 ml-2">
            <button
              onClick={() => setActiveTab("explore")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === "explore"
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              🔥 Explore
            </button>
            <button
              onClick={() => setActiveTab("chats")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === "chats"
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              💬 Private Room ({selectedGirl.name})
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* 👑 Hall of Fame & High-Roller Royalty Button */}
          <button
            onClick={() => setShowLoyaltyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:scale-105 text-xs font-bold transition-all shadow-lg shadow-amber-500/10"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Hall of Fame (${userTotalSpent.toFixed(0)})</span>
          </button>

          {/* 🔗 Shareable Links Generator */}
          <button
            onClick={() => setShowShareHub(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-600/15 border border-pink-500/40 text-pink-400 hover:bg-pink-600 hover:text-white text-xs font-bold transition-all"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Share Links</span>
          </button>

          {/* 📥 Import AI Girl Universal Character Importer Button */}
          <button
            onClick={() => setShowImporterModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/50 text-pink-300 hover:bg-pink-600 hover:text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <span>📥</span> Import AI Girl
          </button>

          {/* 🎬 Velvet Gram Vertical Reels Button */}
          <button
            onClick={() => setShowGramModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-600/15 border border-pink-500/40 text-pink-400 hover:bg-pink-600 hover:text-white text-xs font-bold transition-all"
          >
            <span>🎬</span> Reels
          </button>

          {/* 🎰 Gacha Capsule Machine Button */}
          <button
            onClick={() => setShowGachaModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600/15 border border-purple-500/40 text-purple-400 hover:bg-purple-600 hover:text-white text-xs font-bold transition-all"
          >
            <span>🎰</span> Gacha (💎{gemsCount})
          </button>

          {/* Permissions & Memory Files Center */}
          <button
            onClick={() => setShowPermissionsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-pink-500 text-xs text-zinc-300 transition-all active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Permissions &amp; Files</span>
          </button>

          <button
            onClick={() => setShowVIPModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-xs font-bold text-white shadow-lg active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 inline mr-1" /> VIP Pass
          </button>
        </div>
      </header>

      {/* Main 3-Column Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Companions List */}
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
              <button
                onClick={() => setShowImporterModal(true)}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-pink-600/10 hover:bg-pink-600/20 border border-pink-500/30 text-pink-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <span>📥</span> Import AI Character (.json)
              </button>
            </div>

            <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
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
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/15 text-pink-400 font-medium">{girl.category}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{`"${girl.initialMessage}"`}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 border-t border-white/[0.08] bg-black/40 text-xs flex justify-between items-center">
            <span className="text-zinc-400 flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-pink-500" /> IndexedDB Active</span>
            <span className="text-[10px] text-emerald-400 font-mono">Unlimited</span>
          </div>
        </aside>

        {/* Center: Explore Homescreen Grid OR Real-Time Chat Feed */}
        {activeTab === "explore" ? (
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#0B0912]/80">
            <div className="max-w-6xl mx-auto space-y-6 pb-12">
              {/* Homescreen Hero & Filter Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-black/60 border border-pink-500/20 backdrop-blur-xl shadow-2xl">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/20">
                      AI Companion Studio
                    </span>
                    <span className="text-xs text-emerald-400 font-mono">● {companions.length} Companions Online</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Choose Your <span className="text-pink-500">Dream Companion</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                    Browse all authentic companion archetypes, enter private rooms for 1-on-1 calls and chat, or import any custom character card.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setShowImporterModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all active:scale-95"
                  >
                    <span>📥</span> Import AI Girl (.json)
                  </button>
                  <button
                    onClick={() => setShowGramModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
                  >
                    <span>🎬</span> Reels Feed
                  </button>
                </div>
              </div>

              {/* Category Pills & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                  {["All", "Sweetheart", "Cyberpunk", "Anime", "Luxury", "Goth", "Fantasy", "Noir", "Athletic", "Royalty"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                        selectedCategory === cat
                          ? "bg-pink-600 text-white shadow-md shadow-pink-600/20"
                          : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/5"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search companions..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Character Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {companions
                  .filter((girl) => {
                    const matchesCat =
                      selectedCategory === "All" ||
                      girl.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                      girl.tags.some(t => t.toLowerCase().includes(selectedCategory.toLowerCase()));
                    const matchesSearch =
                      girl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      girl.tagline.toLowerCase().includes(searchQuery.toLowerCase());
                    return matchesCat && matchesSearch;
                  })
                  .map((girl) => (
                    <div
                      key={girl.id}
                      onClick={() => {
                        setSelectedGirl(girl);
                        setActiveTab("chats");
                      }}
                      className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-pink-500/60 bg-[#0E0C15] transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-600/10 cursor-pointer flex flex-col justify-between"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
                        <img
                          src={girl.avatar}
                          alt={girl.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C15] via-transparent to-black/30" />
                        
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-pink-400 border border-pink-500/30">
                            {girl.category}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 space-y-1">
                          <div className="flex items-baseline justify-between">
                            <h3 className="text-lg font-black text-white">{girl.name}, {girl.age}</h3>
                            <span className="text-[10px] text-pink-400 font-mono">Affection: {girl.intimacy}%</span>
                          </div>
                          <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                            {girl.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 bg-[#0E0C15] border-t border-white/[0.06] flex items-center justify-between">
                        <div className="flex gap-1 overflow-hidden max-w-[60%]">
                          {girl.tags.slice(0, 2).map((t, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-400 truncate">
                              #{t}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedGirl(girl);
                            setActiveTab("chats");
                          }}
                          className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1 shrink-0"
                        >
                          Enter Room ➔
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </main>
        ) : (
          <main className="flex-1 flex flex-col justify-between bg-[#0B0912]/80 relative overflow-hidden">
          
          {/* Room Header */}
          <div className="h-16 border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between bg-[#0E0C15]/50 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setActiveTab("explore")}
                aria-label="Back"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <img src={selectedGirl.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-pink-500" />
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  {selectedGirl.name}, {selectedGirl.age}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-600/20 text-pink-400">
                    {selectedGirl.category}
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Memory Synced • Online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={startCall}
                className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 animate-pulse" /> Video Call
              </button>
              <button
                onClick={() => setShowRightDrawer(!showRightDrawer)}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div key={m.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                  <span className="text-[10px] text-zinc-500 font-bold mb-1">{isUser ? "You" : selectedGirl.name}</span>
                  
                  {/* Photo Sent from User Gallery */}
                  {m.type === "user_photo" && m.mediaUrl && (
                    <div className="mb-2 max-w-xs rounded-2xl overflow-hidden border border-emerald-500/50 shadow-xl">
                      <img src={m.mediaUrl} alt="Your Gallery Photo" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  {/* Selfie Sent from Companion */}
                  {m.type === "selfie" && m.mediaUrl && (
                    <div className="mb-2 max-w-xs rounded-2xl overflow-hidden border border-pink-500/40 shadow-xl">
                      <img src={m.mediaUrl} alt="Selfie" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  {/* Video Motion Attachment */}
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

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                <span>{selectedGirl.name} is typing...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input with Gallery Attachment Button */}
          <div className="p-3 sm:p-4 bg-[#0E0C15]/80 border-t border-white/[0.08] space-y-2.5">
            
            {/* Interactive Branching Choice Buttons */}
            {activeDateScenario && (
              <div className="p-3 bg-black/70 rounded-2xl border border-amber-500/40 space-y-2 animate-fade-in">
                <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Choose your response:</p>
                <div className="space-y-1.5">
                  {activeDateScenario.choices.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => handleChooseOption(c)}
                      className="w-full text-left p-2.5 rounded-xl bg-white/[0.04] hover:bg-pink-600/20 hover:border-pink-500/50 border border-white/10 text-xs text-white transition-all"
                    >
                      👉 {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              <label className="px-3 py-1.5 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0">
                <span>🎨</span> Style to Companion
                <input type="file" accept="image/*" onChange={handleCreateFromAesthetic} className="hidden" />
              </label>
              <button
                onClick={() => galleryInputRef.current?.click()}
                className="px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
              >
                <Camera className="w-3.5 h-3.5" /> Send My Photo
              </button>
              <button
                onClick={handleStartDateScenario}
                className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-black text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                🥂 Start Date Scenario
              </button>
              <button
                onClick={handleRequestSelfie}
                className="px-3 py-1.5 rounded-full bg-pink-600/15 border border-pink-500/30 text-pink-400 hover:bg-pink-600 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" /> Request Her Selfie
              </button>
              <button
                onClick={() => handleRequestVideo("blow a kiss")}
                className="px-3 py-1.5 rounded-full bg-purple-600/15 border border-purple-500/30 text-purple-400 hover:bg-purple-600 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
              >
                <Video className="w-3.5 h-3.5" /> Blow Kiss Video
              </button>
              <button
                onClick={() => setShowVIPModal(true)}
                className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <Gift className="w-3.5 h-3.5" /> Send BTC Rose
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Native Gallery / Camera Input */}
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                onChange={handleUserGalleryUpload}
                className="hidden"
              />
              <button
                onClick={() => galleryInputRef.current?.click()}
                title="Upload Photo from Gallery"
                className="p-3 rounded-2xl bg-white/[0.05] hover:bg-white/10 text-zinc-300 border border-white/10 transition-all shrink-0"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder={`Message ${selectedGirl.name}...`}
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
        )}

        {/* Right Drawer: Live Screen & Vault Photos */}
        {showRightDrawer && activeTab === "chats" && (
          <aside className="w-80 border-l border-white/[0.08] bg-[#0E0C15]/90 flex flex-col justify-between overflow-y-auto hidden lg:flex shrink-0 p-5 space-y-6">
            <div className="relative aspect-[9/12] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
              <video src={selectedGirl.video} autoPlay loop playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedGirl.name}</h4>
                  <p className="text-[10px] text-zinc-400">{selectedGirl.category}</p>
                </div>
                <button onClick={() => playVoice(selectedGirl.voiceIntro)} className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white">
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

            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-zinc-300">Unlocked Vault Photos</span>
                <span className="text-pink-500">{selectedGirl.vaultPhotos.length} Photos</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {selectedGirl.vaultPhotos.map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/10">
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

      {/* FULL-SCREEN FACETIME CALL */}
      {isCalling && (
        <div className="fixed inset-0 z-[160] bg-black/95 flex flex-col items-center justify-between p-6 sm:p-10 animate-fade-in">
          <div className="text-center z-10">
            <h2 className="text-2xl font-black text-white">{selectedGirl.name}</h2>
            <p className="text-xs text-pink-500 font-mono mt-1">{callConnected ? "00:32 • Live HD Companion Call" : "Calling Companion..."}</p>
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

      {/* SHAREABLE LINKS HUB MODAL */}
      <ShareHubModal
        isOpen={showShareHub}
        onClose={() => setShowShareHub(false)}
      />

      {/* HIGH-ROLLER VIP LOYALTY & HALL OF FAME MODAL */}
      <VIPLoyaltyModal
        isOpen={showLoyaltyModal}
        onClose={() => setShowLoyaltyModal(false)}
        userTotalSpent={userTotalSpent}
        onSimulateDeposit={handleDeposit}
      />

      {/* UNIVERSAL AI CHARACTER IMPORTER MODAL */}
      <CharacterImporterModal
        isOpen={showImporterModal}
        onClose={() => setShowImporterModal(false)}
        onImport={handleImportCompanion}
      />

      {/* VELVET GRAM VERTICAL REELS MODAL */}
      <VelvetGramModal
        isOpen={showGramModal}
        onClose={() => setShowGramModal(false)}
        onSelectCompanion={(id) => {
          const found = companions.find(c => c.id === id);
          if (found) setSelectedGirl(found);
        }}
      />

      {/* CYBERPUNK MYSTERY GACHA CAPSULE MACHINE */}
      <GachaMachineModal
        isOpen={showGachaModal}
        onClose={() => setShowGachaModal(false)}
        gemsCount={gemsCount}
        onSpendGems={(amt) => {
          if (gemsCount >= amt) {
            setGemsCount(prev => prev - amt);
            return true;
          }
          return false;
        }}
        onWinPrize={(prize) => {
          alert(`🎉 Congratulations! You won: ${prize}`);
        }}
      />

      {/* PERMISSIONS & MEMORY FILE BACKUP MODAL */}
      <PermissionsModal
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
        currentMemories={{ messages, companion: selectedGirl }}
        onImportMemories={(data) => {
          if (data && data.messages) setMessages(data.messages);
        }}
      />

      {/* VIP MODAL */}
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
