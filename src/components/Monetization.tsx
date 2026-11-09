"use client";

import React, { useState } from "react";
import { Copy, Check, Zap, X, ExternalLink, ShieldCheck, QrCode, Gift } from "lucide-react";

export const BTC_PAYOUT_ADDRESS = "bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k";
export const BTC_ADDRESS = BTC_PAYOUT_ADDRESS;

export function VIPModal({ 
  isOpen, 
  onClose,
  giftName,
  giftAmount 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  giftName?: string;
  giftAmount?: string;
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(BTC_PAYOUT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-[#12101C] border border-neonPink/40 p-6 shadow-2xl shadow-neonPink/25 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-neonPink to-neonPurple mx-auto flex items-center justify-center mb-3 shadow-lg shadow-neonPink/30">
          {giftName ? <Gift className="w-6 h-6 text-white" /> : <Zap className="w-6 h-6 text-white" />}
        </div>

        <h3 className="text-xl font-black text-white uppercase tracking-wider">
          {giftName ? `Send ${giftName}` : "Unlock VIP Soulmate Access"}
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Direct instant payout to creator Coinbase Bitcoin Wallet.
        </p>

        {giftAmount ? (
          <div className="p-3 my-4 rounded-xl bg-neonPink/10 border border-neonPink/40">
            <span className="text-[10px] font-bold text-neonFuchsia uppercase">Gift Amount</span>
            <p className="text-lg font-black text-amber-300">{giftAmount} BTC</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-left">
              <span className="text-[10px] font-bold text-amber-400 uppercase">Supporter</span>
              <p className="text-base font-black text-white mt-0.5">0.00005 BTC</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Priority 4K Renders</p>
            </div>
            <div className="p-3 rounded-xl bg-neonPink/10 border border-neonPink/40 text-left">
              <span className="text-[10px] font-bold text-neonFuchsia uppercase">VIP Lifetime</span>
              <p className="text-base font-black text-white mt-0.5">0.0002 BTC</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Unlimited Soulmate</p>
            </div>
          </div>
        )}

        <div className="p-3 rounded-xl bg-black/70 border border-white/10 inline-block mb-3">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=bitcoin:bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k&bgcolor=000000&color=FF007F"
            alt="Coinbase BTC QR"
            className="w-28 h-28 rounded-lg mx-auto"
          />
          <p className="text-[10px] text-zinc-400 mt-1.5 font-mono flex items-center justify-center gap-1">
            <QrCode className="w-3 h-3 text-neonPink" /> Scan in Coinbase Wallet
          </p>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-black/50 border border-white/10 text-left mb-4">
          <div className="overflow-hidden mr-2">
            <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-semibold">BTC Address:</p>
            <p className="text-xs font-mono text-amber-300 truncate">{BTC_ADDRESS}</p>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-neonPink/20 hover:bg-neonPink/30 border border-neonPink/40 text-xs font-semibold text-neonPink flex items-center gap-1 transition-all shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <a
          href="bitcoin:bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k"
          className="w-full py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-amber-500 via-neonPink to-neonPurple hover:opacity-95 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-neonPink/25 active:scale-98"
        >
          <ExternalLink className="w-4 h-4" /> Open in Coinbase App
        </a>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified Native SegWit Bitcoin Payouts</span>
        </div>
      </div>
    </div>
  );
}

export function CryptoAdBanner() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 my-6">
      <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
            BTC Powered
          </span>
          <p className="text-xs text-zinc-300">
            Support VelvetMotion AI with Bitcoin micropayments and crypto ads.
          </p>
        </div>

        <div className="h-10 px-4 rounded-lg bg-black/60 border border-amber-500/20 flex items-center justify-center text-[11px] text-zinc-400 font-mono">
          <span>A-Ads BTC Slot (Active)</span>
        </div>
      </div>
    </div>
  );
}
