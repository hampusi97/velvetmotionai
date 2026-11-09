"use client";

import React, { useState } from "react";
import { X, Sparkles, Trophy, RefreshCw } from "lucide-react";

interface GachaModalProps {
  isOpen: boolean;
  onClose: () => void;
  gemsCount: number;
  onSpendGems: (amount: number) => boolean;
  onWinPrize: (prizeName: string) => void;
}

export function GachaMachineModal({ isOpen, onClose, gemsCount, onSpendGems, onWinPrize }: GachaModalProps) {
  const [spinning, setSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<{ title: string; rarity: string; color: string } | null>(null);

  if (!isOpen) return null;

  const prizes = [
    { title: "🎁 +50 Free Intimacy XP", rarity: "Common (50%)", color: "text-zinc-300" },
    { title: "🎀 Unlocked Silk Robe Outfit", rarity: "Rare (30%)", color: "text-pink-400 font-bold" },
    { title: "💎 1-Day Free 4K Render Token", rarity: "Epic (15%)", color: "text-purple-400 font-bold" },
    { title: "👑 50% VIP Pass Discount Voucher", rarity: "Legendary (5%)", color: "text-amber-300 font-black" }
  ];

  const handlePullLever = () => {
    if (gemsCount < 15) {
      alert("You need at least 15 Gems to spin the Gacha Capsule! Invite a friend to earn free gems.");
      return;
    }

    if (onSpendGems(15)) {
      setSpinning(true);
      setWonPrize(null);

      // Play lever audio
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(300, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.36);
        }
      } catch {
        // Audio error ignored safely
      }

      setTimeout(() => {
        setSpinning(false);
        const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
        setWonPrize(randomPrize);
        onWinPrize(randomPrize.title);
      }, 1600);
    }
  };

  return (
    <div className="fixed inset-0 z-[190] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#120E1C] border border-purple-500/40 p-6 sm:p-8 shadow-2xl text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 mx-auto flex items-center justify-center mb-3 shadow-lg shadow-purple-600/30">
          <Trophy className="w-7 h-7 text-white" />
        </div>

        <h3 className="text-2xl font-black text-white uppercase tracking-wider">
          Cyberpunk Mystery Gacha
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Spin the capsule machine to win rare outfits, free 4K render passes, and VIP discounts.
        </p>

        {/* Machine Screen */}
        <div className="my-6 p-6 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
          {spinning ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-pink-500 animate-spin" />
              <p className="text-xs font-bold text-pink-400 animate-pulse tracking-widest uppercase">Opening Capsule...</p>
            </div>
          ) : wonPrize ? (
            <div className="space-y-2 animate-bounce">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300">
                {wonPrize.rarity}
              </span>
              <h4 className={`text-lg ${wonPrize.color}`}>{wonPrize.title}</h4>
              <p className="text-[11px] text-emerald-400">Claimed & Added to your Inventory!</p>
            </div>
          ) : (
            <div className="text-center space-y-1">
              <span className="text-3xl block">🎰</span>
              <p className="text-xs font-bold text-white">Machine Ready</p>
              <p className="text-[10px] text-zinc-500">Pull the lever to drop a mystery capsule</p>
            </div>
          )}
        </div>

        {/* Gems Balance & Spin Button */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs px-2">
            <span className="text-zinc-400">Cost: <strong className="text-pink-400">15 Gems</strong></span>
            <span className="text-zinc-300">Your Gems: <strong className="text-emerald-400">💎 {gemsCount}</strong></span>
          </div>

          <button
            onClick={handlePullLever}
            disabled={spinning}
            className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 ${
              spinning
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-purple-600/30 hover:opacity-95 active:scale-95"
            }`}
          >
            {spinning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Pull Lever (15 Gems)
          </button>
        </div>
      </div>
    </div>
  );
}
