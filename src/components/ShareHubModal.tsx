"use client";

import React, { useState } from "react";
import { Link2, Copy, Check, X, Sparkles, ExternalLink, Share2, Flame, Gift } from "lucide-react";

interface ShareHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareHubModal({ isOpen, onClose }: ShareHubModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://velvetmotionai.vercel.app";

  const shareLinks = [
    {
      key: "main",
      title: "VelvetMotion",
      desc: "Opens the portrait list.",
      url: `${origin}/`,
      badge: "Home"
    },
    {
      key: "chloe",
      title: "Chloe",
      desc: "Opens Chloe.",
      url: `${origin}/?girl=chloe`,
      badge: "Room"
    },
    {
      key: "elena",
      title: "Elena",
      desc: "Opens Elena.",
      url: `${origin}/?girl=elena`,
      badge: "Room"
    },
    {
      key: "aria",
      title: "Aria",
      desc: "Opens Aria.",
      url: `${origin}/?girl=aria`,
      badge: "Room"
    }
  ];

  const handleCopy = (key: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#120E1C] border border-pink-500/40 p-6 sm:p-8 shadow-2xl text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 mx-auto flex items-center justify-center mb-3 shadow-lg shadow-pink-500/30">
          <Link2 className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-2xl font-black text-white uppercase tracking-wider">
          Shareable Link Hub
        </h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
          Copy any of these tailored links to share on Telegram, WhatsApp, Discord, or X.
        </p>

        {/* Link Cards List */}
        <div className="my-5 space-y-3 text-left max-h-[50vh] overflow-y-auto pr-1">
          {shareLinks.map((item) => (
            <div key={item.key} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-500/40 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">{item.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-600/20 text-pink-400 font-semibold">
                  {item.badge}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-2">{item.desc}</p>
              
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/50 border border-white/10">
                <input
                  type="text"
                  readOnly
                  value={item.url}
                  className="bg-transparent text-[11px] font-mono text-zinc-300 flex-1 px-1.5 focus:outline-none truncate"
                />
                <button
                  onClick={() => handleCopy(item.key, item.url)}
                  className="px-3 py-1 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold flex items-center gap-1 transition-all shrink-0"
                >
                  {copiedKey === item.key ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === item.key ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-zinc-500">
          A copied link opens that person. Nothing is charged.
        </p>
      </div>
    </div>
  );
}
