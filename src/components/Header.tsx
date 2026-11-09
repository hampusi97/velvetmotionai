'use client';

import React from 'react';
import { Sparkles, Gift, Lock, Key, Film, PlaySquare, Heart } from 'lucide-react';

interface HeaderProps {
  vipCredits: number;
  onOpenRewardedModal: () => void;
  onOpenVault: () => void;
  onOpenApiKey: () => void;
  hasCustomKey: boolean;
  vaultCount: number;
}

export function Header({
  vipCredits,
  onOpenRewardedModal,
  onOpenVault,
  onOpenApiKey,
  hasCustomKey,
  vaultCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#08070c]/90 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo & Candy.ai Vibe Name */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-600 via-fuchsia-600 to-violet-600 p-0.5 shadow-lg shadow-pink-900/40">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#08070c]">
              <Film className="h-5 w-5 text-pink-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-white sm:text-lg">
                VelvetMotion <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">AI</span>
              </h1>
              <span className="rounded-full border border-pink-500/40 bg-pink-500/15 px-2 py-0.5 text-[10px] font-bold text-pink-300">
                100% Free
              </span>
            </div>
            <p className="hidden text-[11px] text-zinc-400 sm:block">
              Candy.ai Style Image-to-Video Engine • Turn Photos into Sensual Motion Clips
            </p>
          </div>
        </div>

        {/* Right Navigation & Credit Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Credit Balance Pill */}
          <div className="flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-950/40 px-3 py-1 text-xs font-bold text-pink-300">
            <Sparkles className="h-3.5 w-3.5 text-pink-400 animate-pulse" />
            <span>{vipCredits} VIP Credits</span>
          </div>

          {/* Watch Ad for Free Credits Button */}
          <button
            type="button"
            onClick={onOpenRewardedModal}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-pink-600 to-fuchsia-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-lg shadow-pink-950/50 hover:brightness-110 transition cursor-pointer"
            title="Watch a quick 5s offer for +50 Free VIP Credits"
          >
            <Gift className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">+50 Free Credits</span>
            <span className="sm:hidden">+50</span>
          </button>

          {/* Private Vault / History */}
          <button
            type="button"
            onClick={onOpenVault}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/[0.08] hover:text-white transition cursor-pointer"
            title="Open Private Vault of Generated Videos"
          >
            <Lock className="h-3.5 w-3.5 text-pink-400" />
            <span className="hidden md:inline">Vault</span>
            {vaultCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-[10px] font-bold text-white">
                {vaultCount}
              </span>
            )}
          </button>

          {/* API Key Modal Button */}
          <button
            type="button"
            onClick={onOpenApiKey}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
              hasCustomKey
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white'
            }`}
            title="Configure Hugging Face CogVideoX Token"
          >
            <Key className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
