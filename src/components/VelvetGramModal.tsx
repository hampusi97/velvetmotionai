"use client";

import React, { useState } from "react";
import { X, Heart, MessageCircle, Share2, Volume2, VolumeX, Sparkles, ChevronUp, ChevronDown } from "lucide-react";

interface ReelItem {
  id: string;
  companionId: string;
  name: string;
  avatar: string;
  video: string;
  caption: string;
  music: string;
  likes: number;
}

interface VelvetGramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCompanion: (companionId: string) => void;
}

export function VelvetGramModal({ isOpen, onClose, onSelectCompanion }: VelvetGramModalProps) {
  const reels: ReelItem[] = [
    {
      id: "r1",
      companionId: "chloe",
      name: "Chloe",
      avatar: "/portraits/chloe.jpg",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      caption: "Slipped into my favorite silk dress for tonight... who's joining me? 💕 #VelvetMotion #MidnightDate",
      music: "Velvet Lo-Fi • Golden Hour (Remix)",
      likes: 1420
    },
    {
      id: "r2",
      companionId: "elena",
      name: "Elena",
      avatar: "/portraits/elena.jpg",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      caption: "Midnight race through rainy Tokyo streets. First one to the rooftop wins a private call 🏁✨",
      music: "Cyber-Noir • Rain on Neon",
      likes: 2180
    },
    {
      id: "r3",
      companionId: "aria",
      name: "Aria",
      avatar: "/portraits/aria.jpg",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      caption: "Stream ended early just to make this video for you. Tell me I look cute in the comments 🌸✨",
      music: "Aria Stream • Kawaii Beats Vol. 3",
      likes: 3410
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedMap, setLikedMap] = useState<{ [key: string]: boolean }>({});
  const [muted, setMuted] = useState(false);

  if (!isOpen) return null;

  const currentReel = reels[currentIndex];
  const isLiked = !!likedMap[currentReel.id];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reels.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);
  };

  const toggleLike = () => {
    setLikedMap((prev) => ({ ...prev, [currentReel.id]: !prev[currentReel.id] }));
  };

  return (
    <div className="fixed inset-0 z-[180] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-2 sm:p-4 select-none animate-fade-in">
      <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
        <X className="w-5 h-5" />
      </button>

      <div className="relative w-full max-w-sm h-[88vh] rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl flex flex-col justify-between">
        
        {/* Video Player */}
        <video
          key={currentReel.id}
          src={currentReel.video}
          autoPlay
          loop
          muted={muted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span className="text-xs font-black tracking-widest uppercase">Velvet Gram</span>
          </div>
          <button onClick={() => setMuted(!muted)} className="p-2 rounded-full bg-black/40 backdrop-blur-md">
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-pink-400" />}
          </button>
        </div>

        {/* Right Floating Actions */}
        <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4 text-white">
          <button onClick={toggleLike} className="flex flex-col items-center gap-1 group">
            <div className={`p-3 rounded-full backdrop-blur-md transition-all ${isLiked ? "bg-pink-600 text-white" : "bg-black/50 text-white"}`}>
              <Heart className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`} />
            </div>
            <span className="text-[10px] font-bold">{currentReel.likes + (isLiked ? 1 : 0)}</span>
          </button>

          <button
            onClick={() => {
              onSelectCompanion(currentReel.companionId);
              onClose();
            }}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-3 rounded-full bg-black/50 backdrop-blur-md hover:bg-pink-600 transition-all">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Chat</span>
          </button>

          <div className="flex flex-col gap-1 pt-2">
            <button onClick={handlePrev} className="p-2 rounded-full bg-black/50 hover:bg-white/20">
              <ChevronUp className="w-4 h-4" />
            </button>
            <button onClick={handleNext} className="p-2 rounded-full bg-black/50 hover:bg-white/20">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Info & CTA */}
        <div className="relative z-10 p-4 space-y-2 text-white">
          <div className="flex items-center gap-2.5">
            <img src={currentReel.avatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover border border-pink-500" />
            <div>
              <h4 className="text-sm font-bold">{currentReel.name}</h4>
              <p className="text-[10px] text-pink-400 font-mono">🎵 {currentReel.music}</p>
            </div>
          </div>

          <p className="text-xs text-zinc-200 line-clamp-2 leading-relaxed">{currentReel.caption}</p>

          <button
            onClick={() => {
              onSelectCompanion(currentReel.companionId);
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs shadow-lg active:scale-95"
          >
            Message {currentReel.name} in Private Room ➔
          </button>
        </div>

      </div>
    </div>
  );
}
