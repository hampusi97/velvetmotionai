'use client';

import React, { useState, useEffect } from 'react';
import { X, Gift, Sparkles, ShieldCheck, ExternalLink, Play } from 'lucide-react';

interface RewardedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: (amount: number) => void;
}

export function RewardedModal({ isOpen, onClose, onReward }: RewardedModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(5);
      setCanClaim(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClaim(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaim = () => {
    onReward(50);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-pink-500/30 bg-[#0c0a12] p-6 shadow-2xl text-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-pink-400" />
            <h3 className="text-base font-bold text-white">Free VIP Credits Refill</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sponsor Banner Card */}
        <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-black p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-pink-300 font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Sponsor Spotlight
            </span>
            <span>{canClaim ? 'Ready!' : `${secondsLeft}s`}</span>
          </div>
          <h4 className="text-sm font-bold text-white">
            Velvet Live AI & Interactive Video Partner Network
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            VelvetMotion AI is 100% free with no monthly subscription paywall thanks to our verified interactive media sponsors.
          </p>
        </div>

        {/* Countdown Bar */}
        {!canClaim && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Watching sponsor spotlight…</span>
              <span className="font-bold text-pink-400">{secondsLeft}s remaining</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-fuchsia-500 transition-all duration-1000"
                style={{ width: `${((5 - secondsLeft) / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Claim Reward Button */}
        <button
          type="button"
          onClick={handleClaim}
          disabled={!canClaim}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-600 to-fuchsia-600 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-pink-950/50 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>{canClaim ? 'Claim +50 Free VIP Credits' : `Please wait (${secondsLeft}s)`}</span>
        </button>
      </div>
    </div>
  );
}
