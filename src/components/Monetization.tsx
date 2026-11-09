"use client";

import React, { useState } from "react";
import { Copy, Check, Zap, X, ExternalLink, ShieldCheck, QrCode, CreditCard } from "lucide-react";

export const BTC_PAYOUT_ADDRESS = "bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k";
export const BTC_ADDRESS = BTC_PAYOUT_ADDRESS;

export function VIPModal({ isOpen, onClose, onUpgradeSuccess }: { isOpen: boolean; onClose: () => void; onUpgradeSuccess?: () => void }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(BTC_PAYOUT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl bg-[#120E1C] border border-neonPink/40 p-6 sm:p-8 shadow-2xl text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
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
          onClick={() => {
            if (onUpgradeSuccess) onUpgradeSuccess();
            onClose();
          }}
          className="w-full py-3.5 rounded-xl font-bold text-xs uppercase bg-gradient-to-r from-neonPink to-purple-600 text-white shadow-lg mb-4 flex items-center justify-center gap-2"
        >
          <CreditCard className="w-4 h-4" /> Pay $14.99 with Card / Apple Pay
        </button>

        <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-left">
          <p className="text-[10px] uppercase font-bold text-amber-300 mb-1">Or Pay with Coinbase Bitcoin:</p>
          <p className="text-xs font-mono text-zinc-300 truncate">{BTC_ADDRESS}</p>
          <button
            onClick={handleCopy}
            className="mt-2 text-xs font-bold text-neonPink hover:underline flex items-center gap-1"
          >
            {copied ? "✓ Address Copied!" : "Copy BTC Address"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Live Working A-Ads Bitcoin Revenue Slot
export function LiveBitcoinAdSlot({ isVIP = false }: { isVIP?: boolean }) {
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
}
