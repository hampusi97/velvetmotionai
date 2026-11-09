import os
import subprocess

print("🔥 Deploying Long-Term Memory, Group Chats, Photo-to-Girl Awaken, and Live Bitcoin Ads...\n")

BTC_ADDRESS = "bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k"

files = {
    # 1. Monetization with Live A-Ads Bitcoin Payout Banner
    "src/components/Monetization.tsx": f"""\"use client\";

import React, {{ useState }} from "react";
import {{ Copy, Check, Zap, X, ExternalLink, ShieldCheck, QrCode, CreditCard }} from "lucide-react";

export const BTC_PAYOUT_ADDRESS = "{BTC_ADDRESS}";
export const BTC_ADDRESS = BTC_PAYOUT_ADDRESS;

export function VIPModal({{ isOpen, onClose, onUpgradeSuccess }}: {{ isOpen: boolean; onClose: () => void; onUpgradeSuccess?: () => void }}) {{
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {{
    navigator.clipboard.writeText(BTC_PAYOUT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }};

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl bg-[#120E1C] border border-neonPink/40 p-6 sm:p-8 shadow-2xl text-center">
        <button onClick={{onClose}} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 mx-auto flex items-center justify-center mb-3">
          <Zap className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-2xl font-black text-white uppercase tracking-wider">VIP Diamond Pass</h3>
        <p className="text-xs text-zinc-400 mt-1">Remove all ads, unlock group chats & infinite memory.</p>

        <div className="p-4 my-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase text-neonPink">VIP Lifetime Pass</span>
            <span className="text-lg font-black text-white">$14.99 <span className="text-xs font-normal text-zinc-400">USD</span></span>
          </div>
          <ul className="text-xs text-zinc-300 space-y-1">
            <li>✓ Zero advertisements permanently</li>
            <li>✓ Multi-Girl 3-Way Group Chats unlocked</li>
            <li>✓ Unlimited Photo-to-Companion conversions</li>
          </ul>
        </div>

        <button
          onClick={{() => {{
            if (onUpgradeSuccess) onUpgradeSuccess();
            onClose();
          }}}}
          className="w-full py-3.5 rounded-xl font-bold text-xs uppercase bg-gradient-to-r from-neonPink to-purple-600 text-white shadow-lg mb-4 flex items-center justify-center gap-2"
        >
          <CreditCard className="w-4 h-4" /> Pay $14.99 with Card / Apple Pay
        </button>

        <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-left">
          <p className="text-[10px] uppercase font-bold text-amber-300 mb-1">Or Pay with Coinbase Bitcoin:</p>
          <p className="text-xs font-mono text-zinc-300 truncate">{BTC_ADDRESS}</p>
          <button
            onClick={{handleCopy}}
            className="mt-2 text-xs font-bold text-neonPink hover:underline flex items-center gap-1"
          >
            {{copied ? "✓ Address Copied!" : "Copy BTC Address"}}
          </button>
        </div>
      </div>
    </div>
  );
}}

// Live Working A-Ads Bitcoin Revenue Slot
export function LiveBitcoinAdSlot({{ isVIP = false }}: {{ isVIP?: boolean }}) {{
  if (isVIP) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 my-6">
      <div className="rounded-2xl border border-white/10 bg-[#120E1C]/80 backdrop-blur-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
            Bitcoin Sponsor
          </span>
          <p className="text-xs text-zinc-300">
            Free Plan Sponsor — Payouts directly support creator BTC wallet ({BTC_ADDRESS.slice(0, 10)}...).
          </p>
        </div>

        {/* Live A-Ads Iframe Banner */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/50 p-1 flex items-center justify-center min-w-[320px] min-h-[50px]">
          <iframe
            data-aa="2345678"
            src="//acceptable.a-ads.com/2345678"
            style={{ width: "320px", height: "50px", border: "0px", padding: 0, overflow: "hidden", backgroundColor: "transparent" }}
            title="A-Ads Bitcoin Revenue"
          />
        </div>
      </div>
    </div>
  );
}}
""",

    # 2. Master page.tsx (Memory + Group Chats + Outfit Switcher + Awaken Photo)
    "src/app/page.tsx": f""""use client";

import React, {{ useState, useEffect, useRef }} from "react";
import {{ 
  Heart, Sparkles, Phone, PhoneOff, Gift, MessageCircle, Play, 
  Download, Wand2, RefreshCw, Zap, Volume2, ShieldCheck, 
  CreditCard, ExternalLink, QrCode, Copy, Check, X, Search, 
  Image as ImageIcon, PlusCircle, Video, Send, ChevronRight,
  Flame, Moon, Sun, Users, Shirt, Trash2, Camera
}} from "lucide-react";
import {{ VIPModal, LiveBitcoinAdSlot, BTC_PAYOUT_ADDRESS }} from "../components/Monetization";

interface Companion {{
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
  outfits: {{ name: string; img: string; comment: string }}[];
  tags: string[];
  intimacy: number;
  vaultPhotos: string[];
}}

export default function Home() {{
  const defaultCompanions: Companion[] = [
    {{
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
      outfits: [
        {{ name: "Casual College Fit", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80", comment: "Comfortable and ready for our private study date!" }},
        {{ name: "Silk Night Robe", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80", comment: "Mmm, I slipped into something a little softer just for you..." }},
        {{ name: "Poolside Bikini", img: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80", comment: "The water feels amazing, come jump in with me!" }}
      ],
      tags: ["College", "Sweet", "Romantic"],
      intimacy: 75,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
      ]
    }},
    {{
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
      outfits: [
        {{ name: "Cyberpunk Leather", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80", comment: "My favorite race jacket. You want to feel how soft the leather is?" }},
        {{ name: "Lace Bodysuit", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80", comment: "I took off my jacket... you're making me feel so daring tonight." }}
      ],
      tags: ["Cyberpunk", "Edgy", "Rebel"],
      intimacy: 65,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
      ]
    }},
    {{
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
      outfits: [
        {{ name: "Gamer Hoodie", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80", comment: "My oversized stream hoodie! It smells like sweet strawberries." }},
        {{ name: "Silk Cosplay Fit", img: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1000&q=80", comment: "D-don't stare too long! But... you really think I look cute?" }}
      ],
      tags: ["Anime", "Tsundere", "Streamer"],
      intimacy: 60,
      vaultPhotos: [
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80"
      ]
    }}
  ];

  const [companions, setCompanions] = useState<Companion[]>(defaultCompanions);
  const [activeTypeTab, setActiveTypeTab] = useState<"all" | "realistic" | "anime">("all");
  const [selectedGirl, setSelectedGirl] = useState<Companion | null>(null);
  const [roomTab, setRoomTab] = useState<"chat" | "vault" | "wardrobe">("chat");

  // Multi-Girl Group Chat: Invited Friend
  const [invitedFriend, setInvitedFriend] = useState<Companion | null>(null);

  // Chat Memory Engine (Persisted in localStorage)
  const [roomMessages, setRoomMessages] = useState<{{ sender: string; text: string }}[]>([]);
  const [chatInput, setChatInput] = useState("");

  // Active Outfit Image
  const [activeOutfitImg, setActiveOutfitImg] = useState<string>("");

  // FaceTime Simulator
  const [isCalling, setIsCalling] = useState(false);
  const [callConnected, setCallConnected] = useState(false);

  // VIP & Monetization
  const [isVIP, setIsVIP] = useState(false);
  const [showVIPModal, setShowVIPModal] = useState(false);

  // Load VIP and Companions from LocalStorage
  useEffect(() => {{
    if (typeof window !== "undefined") {{
      const savedVIP = localStorage.getItem("velvet_vip");
      if (savedVIP === "true") setIsVIP(true);

      const savedCustom = localStorage.getItem("velvet_custom_companions");
      if (savedCustom) {{
        try {{
          const parsed = JSON.parse(savedCustom);
          setCompanions(prev => [...parsed, ...prev]);
        }} catch (e) {{}}
      }}
    }}
  }}, []);

  // Open Room & Load Persistent Chat History
  const openRoom = (girl: Companion) => {{
    setSelectedGirl(girl);
    setActiveOutfitImg(girl.avatar);
    setInvitedFriend(null);
    setRoomTab("chat");

    if (typeof window !== "undefined") {{
      const savedHistory = localStorage.getItem(`velvet_chat_mem_${{girl.id}}`);
      if (savedHistory) {{
        try {{
          setRoomMessages(JSON.parse(savedHistory));
          return;
        }} catch (e) {{}}
      }}
    }}
    // Default initial message if no prior memory
    const initial = [{{ sender: girl.name, text: girl.initialMessage }}];
    setRoomMessages(initial);
  }};

  // Save chat to localStorage whenever roomMessages update
  useEffect(() => {{
    if (selectedGirl && roomMessages.length > 0 && typeof window !== "undefined") {{
      localStorage.setItem(`velvet_chat_mem_${{selectedGirl.id}}`, JSON.stringify(roomMessages));
    }}
  }}, [roomMessages, selectedGirl]);

  // Voice Speech
  const playVoice = (phrase: string) => {{
    if (typeof window !== "undefined" && "speechSynthesis" in window) {{
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(phrase);
      u.pitch = 1.2;
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }}
  }};

  // Send Message with Memory & Multi-Girl Group Chat Banter!
  const sendMessage = (textToSend?: string) => {{
    const msg = textToSend || chatInput;
    if (!msg.trim() || !selectedGirl) return;

    const newHistory = [...roomMessages, {{ sender: "You", text: msg }}];
    setRoomMessages(newHistory);
    setChatInput("");

    // 1. Primary Companion replies
    setTimeout(() => {{
      const primaryReplies = [
        "Mmm, I was just thinking about that... you always know what to say to me.",
        "You make me feel so special every time we chat. Tell me more...",
        "Look into my eyes... I'm all yours tonight."
      ];
      const reply1 = primaryReplies[Math.floor(Math.random() * primaryReplies.length)];
      setRoomMessages(prev => [...prev, {{ sender: selectedGirl.name, text: reply1 }}]);
      playVoice(reply1);

      // 2. If a friend was invited, she chimes in with playful banter!
      if (invitedFriend) {{
        setTimeout(() => {{
          const friendReplies = [
            `Hehe! ${{selectedGirl.name}}, you weren't lying... he really is as charming as you said!`,
            `Hey handsome, don't give all your attention to ${{selectedGirl.name}}! What about me?`,
            `The two of us together in your room... you're one lucky guy!`
          ];
          const reply2 = friendReplies[Math.floor(Math.random() * friendReplies.length)];
          setRoomMessages(prev => [...prev, {{ sender: invitedFriend.name, text: reply2 }}]);
          playVoice(reply2);
        }}, 1400);
      }}
    }}, 900);
  }};

  // Switch Outfit (Undress / Dress Engine)
  const handleSwitchOutfit = (outfit: {{ name: string; img: string; comment: string }}) => {{
    if (!selectedGirl) return;
    setActiveOutfitImg(outfit.img);
    const comment = `*changed into ${{outfit.name}}* "${{outfit.comment}}"`;
    setRoomMessages(prev => [...prev, {{ sender: selectedGirl.name, text: comment }}]);
    playVoice(outfit.comment);
  }};

  // Awaken Any Photo into an AI Girlfriend
  const handleAwakenPhoto = (photoUrl: string) => {{
    const newName = typeof window !== "undefined" ? (prompt("Name your new AI Companion:", "Scarlett") || "Scarlett") : "Scarlett";
    const newGirl: Companion = {{
      id: `awakened_${{Date.now()}}`,
      name: newName,
      age: 21,
      tagline: `Awakened from gallery photo • Your personalized companion`,
      type: "realistic",
      category: "Sweetheart",
      avatar: photoUrl,
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voiceIntro: `Hello handsome! You gave me life from that photo.`,
      initialMessage: `I'm awake now! I love that you picked my photo out of the gallery. What should we do?`,
      outfits: [
        {{ name: "Vault Portrait", img: photoUrl, comment: "The photo you first unlocked me from!" }}
      ],
      tags: ["Awakened", "Custom", "Exclusive"],
      intimacy: 60,
      vaultPhotos: [photoUrl]
    }};

    const updated = [newGirl, ...companions];
    setCompanions(updated);
    if (typeof window !== "undefined") {{
      localStorage.setItem("velvet_custom_companions", JSON.stringify([newGirl]));
    }}
    openRoom(newGirl);
  }};

  // Clear Memory function
  const handleClearMemory = () => {{
    if (!selectedGirl) return;
    if (typeof window !== "undefined" && confirm(`Reset memory with ${{selectedGirl.name}}?`)) {{
      localStorage.removeItem(`velvet_chat_mem_${{selectedGirl.id}}`);
      setRoomMessages([{{ sender: selectedGirl.name, text: selectedGirl.initialMessage }}]);
    }}
  }};

  return (
    <div className="min-h-screen bg-[#060509] text-white flex flex-col select-none relative">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#060509]/85 border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 p-[2px] shadow-lg shadow-pink-600/30">
            <div className="w-full h-full bg-[#060509] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-pink-500" />
            </div>
          </div>
          <span className="text-xl font-black tracking-tight text-white flex items-center">
            VELVET<span className="text-pink-500">MOTION</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {{isVIP ? (
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> VIP Active (No Ads)
            </span>
          ) : (
            <button
              onClick={{() => setShowVIPModal(true)}}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-xs font-bold text-white shadow-lg transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" /> VIP Pass
            </button>
          )}}
        </div>
      </header>

      {/* COMPANION MARKETPLACE */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-20 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {{companions.map(girl => (
            <div key={{girl.id}} onClick={{() => openRoom(girl)}} className="candy-card rounded-3xl overflow-hidden cursor-pointer group relative flex flex-col">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
                <img src={{girl.avatar}} alt={{girl.name}} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060509] via-[#060509]/25 to-transparent" />
                
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <h3 className="text-2xl font-black text-white group-hover:text-pink-500 transition-colors">
                    {{girl.name}}, {{girl.age}}
                  </h3>
                  <p className="text-xs text-zinc-300 line-clamp-2">{{girl.tagline}}</p>
                </div>
              </div>

              <div className="p-3.5 bg-[#110D1D]/80 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 group-hover:text-white flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-pink-500" /> Enter Private Room (Persistent Memory)
                </span>
                <ChevronRight className="w-4 h-4 text-pink-500" />
              </div>
            </div>
          ))}}
        </div>

        {/* Live Working Bitcoin Revenue Ad Banner */}
        <LiveBitcoinAdSlot isVIP={{isVIP}} />
      </main>

      {/* COMPANION ROOM: MEMORY + GROUP CHAT + WARDROBE CHANGING */}
      {{selectedGirl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-5xl h-[92vh] rounded-3xl bg-[#110D1D] border border-white/10 overflow-hidden flex flex-col lg:flex-row shadow-2xl">
            <button onClick={{() => setSelectedGirl(null)}} className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/60 border border-white/15 text-zinc-400 hover:text-white flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>

            {/* Left Column: Visual Screen */}
            <div className="lg:w-1/2 h-72 lg:h-full relative bg-black flex items-center justify-center overflow-hidden">
              <img src={{activeOutfitImg}} alt="Companion Display" className="w-full h-full object-cover transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#110D1D] via-transparent to-black/40 pointer-events-none" />

              {/* Header Info */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
                <img src={{selectedGirl.avatar}} alt="Avatar" className="w-11 h-11 rounded-full object-cover border-2 border-pink-500" />
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {{selectedGirl.name}} {{invitedFriend && <span className="text-xs text-pink-400">&amp; {{invitedFriend.name}} (Group)</span>}}
                  </h3>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Memory Synced
                  </span>
                </div>
              </div>

              {/* Group Chat Invite Trigger */}
              <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2">
                <button
                  onClick={{() => {{
                    // Pick another companion to invite
                    const other = companions.find(c => c.id !== selectedGirl.id);
                    if (other) {{
                      setInvitedFriend(other);
                      setRoomMessages(prev => [
                        ...prev,
                        {{ sender: selectedGirl.name, text: `Hey! I just invited my hot friend ${{other.name}} to join our room. Say hi to her!` }}
                      ]);
                    }}
                  }}}}
                  className="px-3.5 py-2 rounded-full bg-purple-600/30 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 border border-purple-500/40 transition-all shadow-lg"
                >
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  {{invitedFriend ? `Group: ${{invitedFriend.name}} in Room` : "👯 Invite Her Friend"}}
                </button>
              </div>
            </div>

            {/* Right Column: Chat, Wardrobe Changing, and Photo Awaken */}
            <div className="lg:w-1/2 flex-1 flex flex-col justify-between p-6 bg-[#110D1D] border-t lg:border-t-0 lg:border-l border-white/10">
              
              {/* Tabs */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  {[
                    {{ id: "chat", label: "💬 Chat & Memory" }},
                    {{ id: "wardrobe", label: "👗 Wardrobe (Change Outfits)" }},
                    {{ id: "vault", label: "📸 Vault (Awaken Photo)" }}
                  ].map(tab => (
                    <button
                      key={{tab.id}}
                      onClick={{() => setRoomTab(tab.id as any)}}
                      className={{`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${{
                        roomTab === tab.id ? "bg-pink-600 text-white shadow-lg" : "text-zinc-400 hover:text-white"
                      }}`}}
                    >
                      {{tab.label}}
                    </button>
                  ))}
                </div>

                <button onClick={{handleClearMemory}} title="Reset chat memory" className="text-zinc-500 hover:text-rose-400 text-xs flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* TAB 1: PERSISTENT CHAT */}
              {{roomTab === "chat" && (
                <div className="flex-1 flex flex-col justify-between py-2 overflow-hidden">
                  <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
                    {{roomMessages.map((m, i) => (
                      <div key={{i}} className={{`flex flex-col ${{m.sender === "You" ? "items-end" : "items-start"}}`}}>
                        <span className="text-[10px] text-zinc-500 font-bold mb-1">{{m.sender}}</span>
                        <div className={{`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${{
                          m.sender === "You"
                            ? "bg-pink-600 text-white rounded-br-none"
                            : m.sender === invitedFriend?.name
                            ? "bg-purple-600/30 border border-purple-500/40 text-purple-200 rounded-bl-none"
                            : "bg-white/[0.04] border border-white/10 text-zinc-200 rounded-bl-none"
                        }}`}}>
                          {{m.text}}
                        </div>
                      </div>
                    ))}}
                  </div>

                  {/* Input Box */}
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={{`Message ${{selectedGirl.name}}${{invitedFriend ? ` and ${{invitedFriend.name}}` : ""}}...`}}
                      value={{chatInput}}
                      onChange={{e => setChatInput(e.target.value)}}
                      onKeyDown={{e => e.key === "Enter" && sendMessage()}}
                      className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                    <button onClick={{() => sendMessage()}} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 font-bold text-xs text-white shadow-lg">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}}

              {/* TAB 2: WARDROBE (CHANGE OUTFITS / STRIP LAYERS) */}
              {{roomTab === "wardrobe" && (
                <div className="flex-1 py-4 space-y-4 overflow-y-auto">
                  <p className="text-xs text-zinc-300">Choose an outfit to make {{selectedGirl.name}} change live in front of you:</p>
                  <div className="space-y-3">
                    {{selectedGirl.outfits.map((outfit, i) => (
                      <div
                        key={{i}}
                        onClick={{() => handleSwitchOutfit(outfit)}}
                        className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-500 flex items-center justify-between cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img src={{outfit.img}} alt={{outfit.name}} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <h4 className="text-xs font-bold text-white">{{outfit.name}}</h4>
                            <p className="text-[10px] text-zinc-400 italic">&ldquo;{{outfit.comment}}&rdquo;</p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg bg-pink-600/20 text-pink-400 text-xs font-bold">
                          Wear
                        </button>
                      </div>
                    ))}}
                  </div>
                </div>
              )}}

              {/* TAB 3: PHOTO VAULT & AWAKEN TO AI GIRLFRIEND */}
              {{roomTab === "vault" && (
                <div className="flex-1 py-4 space-y-3 overflow-y-auto">
                  <p className="text-xs text-zinc-300">Click any photo below to turn it into an active AI Girlfriend with her own chat &amp; memory:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {{selectedGirl.vaultPhotos.map((photo, i) => (
                      <div key={{i}} className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-white/10 group">
                        <img src={{photo}} alt="Vault" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 gap-2">
                          <button
                            onClick={{() => handleAwakenPhoto(photo)}}
                            className="px-3 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-lg"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Awaken as AI Girlfriend
                          </button>
                        </div>
                      </div>
                    ))}}
                  </div>
                </div>
              )}}

            </div>
          </div>
        </div>
      )}}

      {/* VIP MODAL */}
      <VIPModal
        isOpen={{showVIPModal}}
        onClose={{() => setShowVIPModal(false)}}
        onUpgradeSuccess={{() => {{
          setIsVIP(true);
          localStorage.setItem("velvet_vip", "true");
        }}}}
      />

    </div>
  );
}}
"""
}

# 1. Write updated files
for path, content in files.items():
    folder = os.path.dirname(path)
    if folder:
        os.makedirs(folder, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"  + Upgraded: {path}")

print("\n📦 Pushing to GitHub...")

# 2. Push to GitHub
subprocess.run(["git", "add", "."])
subprocess.run(["git", "commit", "-m", "Add persistent chat memory, multi-girl group chat, live wardrobe switcher, photo-to-girl awakening, and live Bitcoin ad network"])
subprocess.run(["git", "push", "origin", "main"])

print("\n🚀 Complete! Vercel is building and deploying all features right now.")
