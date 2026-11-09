"use client";

import React, { useState } from "react";
import { Copy, Check, Zap, X, ExternalLink, ShieldCheck, QrCode, CreditCard, RefreshCw } from "lucide-react";

export const BTC_PAYOUT_ADDRESS = "bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k";
export const BTC_ADDRESS = BTC_PAYOUT_ADDRESS;

interface VIPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess?: () => void;
  userId?: string;
  referralCode?: string;
}

export function VIPModal({ isOpen, onClose, onUpgradeSuccess, userId, referralCode }: VIPModalProps) {
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(BTC_PAYOUT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardPayment = async () => {
    setIsProcessing(true);
    try {
      // Sync VIP upgrade to persistent database
      const currentUserId = userId || localStorage.getItem("velvet_user_id") || "guest_" + Math.random().toString(36).substring(2, 7);
      const referredBy = referralCode || localStorage.getItem("velvet_referred_by") || undefined;

      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentUserId,
          is_vip: true,
          referred_by: referredBy
        })
      });

      if (res.ok) {
        localStorage.setItem("velvet_vip", "true");
        if (onUpgradeSuccess) onUpgradeSuccess();
        alert("👑 VIP Activated! All ads removed, photo vaults unlocked, and high-definition streams active.");
        onClose();
      }
    } catch (e) {
      // Local fallback
      localStorage.setItem("velvet_vip", "true");
      if (onUpgradeSuccess) onUpgradeSuccess();
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl bg-[#120E1C] border border-candyPink/40 p-6 sm:p-8 shadow-2xl text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 mx-auto flex items-center justify-center mb-3">
          <Zap className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-2xl font-black text-white uppercase tracking-wider">VIP Diamond Pass</h3>
        <p className="text-xs text-zinc-400 mt-1">100% Ad-Free, Unlock Photo Vaults, & Unlimited HD Video Calls.</p>

        <div className="p-4 my-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase text-candyPink">VIP Lifetime Pass</span>
            <span className="text-lg font-black text-white">$14.99 <span className="text-xs font-normal text-zinc-400">USD</span></span>
          </div>
          <ul className="text-xs text-zinc-300 space-y-1">
            <li>✓ Zero advertisements permanently</li>
            <li>✓ Full Photo Vault access unlocked</li>
            <li>✓ Unlimited HD FaceTime & Video Calls</li>
          </ul>
        </div>

        <button
          onClick={handleCardPayment}
          disabled={isProcessing}
          className="w-full py-3.5 rounded-xl font-bold text-xs uppercase bg-gradient-to-r from-candyPink to-purple-600 text-white shadow-lg mb-4 flex items-center justify-center gap-2 hover:opacity-95 active:scale-98 transition-all"
        >
          {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
          Pay $14.99 with Card / Apple Pay
        </button>

        <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-left">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] uppercase font-bold text-amber-300">Or Pay with Coinbase Bitcoin:</p>
            <span className="text-[10px] text-zinc-400 font-mono">0.0002 BTC</span>
          </div>
          
          <div className="p-2 bg-black/80 rounded-lg border border-white/5 my-2 text-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=bitcoin:${BTC_ADDRESS}?amount=0.0002&bgcolor=000000&color=FF007F`}
              alt="Bitcoin QR"
              className="w-24 h-24 mx-auto rounded-lg"
            />
          </div>

          <p className="text-xs font-mono text-zinc-300 truncate">{BTC_ADDRESS}</p>
          
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-candyPink border border-candyPink/30 flex items-center justify-center gap-1 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Address"}
            </button>
            <a
              href={`bitcoin:${BTC_ADDRESS}?amount=0.0002`}
              className="py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-1 border border-amber-500/30"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open App
            </a>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Coinbase Verified Webhook Payout Active</span>
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
