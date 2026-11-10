"use client";

import React, { useState, useEffect } from "react";
import { 
  X, Image as ImageIcon, Video, Heart, Download, ExternalLink, 
  Sparkles, Filter, Play, Check, MessageCircle, Lock, Crown, Share2
} from "lucide-react";

export interface GalleryMediaItem {
  id: string;
  companionId: string;
  companionName: string;
  type: "image" | "video";
  url: string;
  thumbnail: string;
  title: string;
  category: string;
  resolution: string;
  isVaultExclusive?: boolean;
  likes: number;
}

interface MediaGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCompanion: (companionId: string) => void;
}

const GALLERY_ITEMS: GalleryMediaItem[] = [
  {
    id: "m_chloe_1",
    companionId: "chloe",
    companionName: "Chloe",
    type: "image",
    url: "/portraits/chloe.jpg",
    thumbnail: "/portraits/chloe.jpg",
    title: "Soft Knit Morning Light",
    category: "Sweetheart",
    resolution: "4K UHD",
    isVaultExclusive: false,
    likes: 842
  },
  {
    id: "m_chloe_2",
    companionId: "chloe",
    companionName: "Chloe",
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumbnail: "/portraits/chloe.jpg",
    title: "Midnight Study Break Motion",
    category: "Sweetheart",
    resolution: "60 FPS Motion",
    isVaultExclusive: true,
    likes: 1240
  },
  {
    id: "m_elena_1",
    companionId: "elena",
    companionName: "Elena",
    type: "image",
    url: "/portraits/elena.jpg",
    thumbnail: "/portraits/elena.jpg",
    title: "Rainy Tokyo Neon Rider",
    category: "Cyberpunk",
    resolution: "4K UHD",
    isVaultExclusive: false,
    likes: 1095
  },
  {
    id: "m_elena_2",
    companionId: "elena",
    companionName: "Elena",
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "/portraits/elena.jpg",
    title: "Tokyo Midnight Speed Loop",
    category: "Cyberpunk",
    resolution: "60 FPS Motion",
    isVaultExclusive: true,
    likes: 1840
  },
  {
    id: "m_aria_1",
    companionId: "aria",
    companionName: "Aria",
    type: "image",
    url: "/portraits/aria.jpg",
    thumbnail: "/portraits/aria.jpg",
    title: "Streamer Cat-Ear Oversized Hoodie",
    category: "Anime Streamer",
    resolution: "4K UHD",
    isVaultExclusive: false,
    likes: 2150
  },
  {
    id: "m_aria_2",
    companionId: "aria",
    companionName: "Aria",
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail: "/portraits/aria.jpg",
    title: "Private Streamer Room Motion",
    category: "Anime Streamer",
    resolution: "60 FPS Motion",
    isVaultExclusive: true,
    likes: 2490
  },
  {
    id: "m_sienna_1",
    companionId: "sienna",
    companionName: "Sienna",
    type: "image",
    url: "/portraits/sienna.jpg",
    thumbnail: "/portraits/sienna.jpg",
    title: "Monaco Sunset Silk Gown",
    category: "Luxury Muse",
    resolution: "4K UHD",
    isVaultExclusive: true,
    likes: 980
  },
  {
    id: "m_sienna_2",
    companionId: "sienna",
    companionName: "Sienna",
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "/portraits/sienna.jpg",
    title: "Private Yacht Evening Breeze",
    category: "Luxury Muse",
    resolution: "60 FPS Motion",
    isVaultExclusive: true,
    likes: 1450
  },
  {
    id: "m_raven_1",
    companionId: "raven",
    companionName: "Raven",
    type: "image",
    url: "/portraits/raven.jpg",
    thumbnail: "/portraits/raven.jpg",
    title: "Midnight Oil Painting Studio",
    category: "Goth Artist",
    resolution: "4K UHD",
    isVaultExclusive: false,
    likes: 1330
  },
  {
    id: "m_raven_2",
    companionId: "raven",
    companionName: "Raven",
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumbnail: "/portraits/raven.jpg",
    title: "Shadow Velvet Studio Motion",
    category: "Goth Artist",
    resolution: "60 FPS Motion",
    isVaultExclusive: true,
    likes: 1620
  },
  {
    id: "m_yuki_1",
    companionId: "yuki",
    companionName: "Yuki",
    type: "image",
    url: "/portraits/yuki.jpg",
    thumbnail: "/portraits/yuki.jpg",
    title: "Cherry Blossom Kitsune Shrine",
    category: "Fox Spirit",
    resolution: "4K UHD",
    isVaultExclusive: false,
    likes: 2890
  },
  {
    id: "m_yuki_2",
    companionId: "yuki",
    companionName: "Yuki",
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail: "/portraits/yuki.jpg",
    title: "Supernatural Shrine Whispers",
    category: "Fox Spirit",
    resolution: "60 FPS Motion",
    isVaultExclusive: true,
    likes: 3120
  },
  {
    id: "m_scarlett_1",
    companionId: "scarlett",
    companionName: "Scarlett",
    type: "image",
    url: "/portraits/scarlett.jpg",
    thumbnail: "/portraits/scarlett.jpg",
    title: "Crimson Velvet Jazz Booth",
    category: "Velvet Noir",
    resolution: "4K UHD",
    isVaultExclusive: false,
    likes: 1120
  },
  {
    id: "m_mia_1",
    companionId: "mia",
    companionName: "Mia",
    type: "image",
    url: "/portraits/mia.jpg",
    thumbnail: "/portraits/mia.jpg",
    title: "Sunlit Balcony Morning Stretch",
    category: "Athletic Neighbor",
    resolution: "4K UHD",
    isVaultExclusive: false,
    likes: 1540
  },
  {
    id: "m_genevieve_1",
    companionId: "genevieve",
    companionName: "Genevieve",
    type: "image",
    url: "/portraits/genevieve.jpg",
    thumbnail: "/portraits/genevieve.jpg",
    title: "Monaco Royal Penthouse Sovereign",
    category: "Royalty VIP",
    resolution: "4K Ultra-Res",
    isVaultExclusive: true,
    likes: 4210
  }
];

export function MediaGalleryModal({ isOpen, onClose, onSelectCompanion }: MediaGalleryModalProps) {
  const [filterType, setFilterType] = useState<"all" | "image" | "video" | "vault">("all");
  const [selectedCompanion, setSelectedCompanion] = useState<string>("all");
  const [activeItem, setActiveItem] = useState<GalleryMediaItem | null>(null);
  const [likedMap, setLikedMap] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load liked items from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("velvet_gallery_likes");
      if (raw) setLikedMap(JSON.parse(raw));
    } catch {}
  }, []);

  const toggleLike = (item: GalleryMediaItem) => {
    const nextState = !likedMap[item.id];
    const updated = { ...likedMap, [item.id]: nextState };
    setLikedMap(updated);
    try {
      localStorage.setItem("velvet_gallery_likes", JSON.stringify(updated));
    } catch {}
  };

  const handleShareLink = (item: GalleryMediaItem) => {
    navigator.clipboard.writeText(`${window.location.origin}/?girl=${item.companionId}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (filterType === "image" && item.type !== "image") return false;
    if (filterType === "video" && item.type !== "video") return false;
    if (filterType === "vault" && !item.isVaultExclusive) return false;
    if (selectedCompanion !== "all" && item.companionId !== selectedCompanion) return false;
    return true;
  });

  const companionNames = Array.from(new Set(GALLERY_ITEMS.map((i) => ({ id: i.companionId, name: i.companionName }))));

  return (
    <div className="fixed inset-0 z-[180] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-3 sm:p-6 select-none animate-fade-in overflow-hidden">
      <div className="relative w-full max-w-5xl h-[90vh] rounded-3xl bg-[#0D0B14] border border-pink-500/30 p-4 sm:p-6 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-600/30">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                Velvet Media Vault
                <span className="text-[10px] uppercase font-bold text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/20">
                  {filteredItems.length} Unlocked
                </span>
              </h2>
              <p className="text-xs text-zinc-400">Official companion portraits, motion clips, and high-resolution vault scenes.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-3 border-b border-white/[0.06] shrink-0">
          
          {/* Media Type Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {[
              { id: "all", label: "All Media", icon: Sparkles },
              { id: "image", label: "Portraits", icon: ImageIcon },
              { id: "video", label: "Motion Clips", icon: Video },
              { id: "vault", label: "Vault Exclusives", icon: Crown }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = filterType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/20"
                      : "bg-white/[0.03] text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Companion Filter Pill Scroller */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSelectedCompanion("all")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 ${
                selectedCompanion === "all" ? "bg-white/15 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              All Companions
            </button>
            {companionNames.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCompanion(c.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 ${
                  selectedCompanion === c.id ? "bg-pink-600/30 text-pink-300 border border-pink-500/40" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto pt-3 pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 scrollbar-thin">
          {filteredItems.map((item) => {
            const isLiked = !!likedMap[item.id];
            const displayLikes = item.likes + (isLiked ? 1 : 0);

            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 hover:border-pink-500/60 bg-black/60 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                {/* Media Image / Video Thumbnail */}
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 group-hover:via-transparent transition-colors" />

                {/* Badges on Top */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-mono text-zinc-300 border border-white/10 flex items-center gap-1">
                    {item.type === "video" ? <Video className="w-2.5 h-2.5 text-purple-400" /> : <ImageIcon className="w-2.5 h-2.5 text-pink-400" />}
                    {item.resolution}
                  </span>

                  {item.isVaultExclusive && (
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold flex items-center gap-0.5">
                      <Crown className="w-2.5 h-2.5" /> VIP
                    </span>
                  )}
                </div>

                {/* Center Play Icon for Videos */}
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-pink-600/80 backdrop-blur-md flex items-center justify-center shadow-lg shadow-pink-600/40 group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Bottom Metadata */}
                <div className="absolute inset-x-0 bottom-0 p-2.5 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-pink-400 truncate">{item.companionName}</span>
                  <h4 className="text-xs font-bold text-white truncate leading-tight">{item.title}</h4>

                  <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-white/10 text-[10px] text-zinc-400">
                    <span className="text-[9px] text-zinc-500 truncate">{item.category}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(item);
                      }}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      <Heart className={`w-3 h-3 ${isLiked ? "fill-pink-500 text-pink-500" : "text-zinc-400"}`} />
                      <span>{displayLikes}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* FULLSCREEN LIGHTBOX PREVIEW */}
      {activeItem && (
        <div 
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-[220] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 sm:p-8 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-3xl bg-[#120E1C] border border-pink-500/40 overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Display Area */}
            <div className="relative w-full md:w-3/5 bg-black flex items-center justify-center aspect-[3/4] md:aspect-auto">
              {activeItem.type === "video" ? (
                <video
                  src={activeItem.url}
                  autoPlay
                  loop
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeItem.url}
                  alt={activeItem.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Metadata & Direct Actions */}
            <div className="p-6 md:w-2/5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                    {activeItem.category}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">{activeItem.resolution}</span>
                </div>

                <h3 className="text-xl font-black text-white">{activeItem.title}</h3>
                <p className="text-xs text-zinc-400 mt-1">Starring <span className="text-pink-300 font-bold">{activeItem.companionName}</span></p>

                <div className="mt-4 p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Vault Exclusivity</span>
                    <span className="font-bold text-emerald-400">{activeItem.isVaultExclusive ? "VIP Exclusive" : "Public Gallery"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Community Likes</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                      {activeItem.likes + (likedMap[activeItem.id] ? 1 : 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCompanion(activeItem.companionId);
                    setActiveItem(null);
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 hover:opacity-95 active:scale-98 transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> Chat with {activeItem.companionName}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => toggleLike(activeItem)}
                    className="py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedMap[activeItem.id] ? "fill-pink-500 text-pink-500" : ""}`} />
                    {likedMap[activeItem.id] ? "Favorited" : "Favorite"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareLink(activeItem)}
                    className="py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 flex items-center justify-center gap-1.5 transition-all"
                  >
                    {copiedId === activeItem.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    {copiedId === activeItem.id ? "Link Copied" : "Share"}
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
