"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Copy, Check, Share2, DollarSign, Sparkles, X, 
  ExternalLink, TrendingUp, ShieldCheck, Gift, ArrowRight, CreditCard
} from "lucide-react";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  const [copied, setCopied] = useState(false);
  const [userRefCode, setUserRefCode] = useState("");
  const [payoutMethod, setPayoutMethod] = useState<"paypal" | "bitcoin">("paypal");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [payoutBtc, setPayoutBtc] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Live Stats
  const [stats, setStats] = useState({
    friendsInvited: 4,
    adViewsEarned: 184,
    earnedBtc: 0.00012,
    earnedUsd: 14.50
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      let code = localStorage.getItem("velvet_my_ref_code");
      if (!code) {
        code = "vip_" + Math.random().toString(36).substring(2, 7);
        localStorage.setItem("velvet_my_ref_code", code);
      }
      setUserRefCode(code);

      const savedPaypal = localStorage.getItem("velvet_payout_paypal");
      if (savedPaypal) setPaypalEmail(savedPaypal);

      const savedBtc = localStorage.getItem("velvet_payout_btc");
      if (savedBtc) setPayoutBtc(savedBtc);
    }
  }, []);

  if (!isOpen) return null;

  const originUrl = typeof window !== "undefined" ? window.location.origin : "https://velvetmotionai.vercel.app";
  const refLink = `${originUrl}/?ref=${userRefCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      if (payoutMethod === "paypal") {
        localStorage.setItem("velvet_payout_paypal", paypalEmail);
      } else {
        localStorage.setItem("velvet_payout_btc", payoutBtc);
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  const shareText = encodeURIComponent("Meet the hottest AI companions on VelvetMotion! Use my link for +50 free bonus gems:");
  const shareUrl = encodeURIComponent(refLink);

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#120E1C] border border-emerald-500/40 p-6 sm:p-8 shadow-2xl shadow-emerald-500/10 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 mx-auto flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/30">
          <DollarSign className="w-6 h-6 text-black font-black" />
        </div>

        <h3 className="text-2xl font-black text-white uppercase tracking-wider">
          Earn 30% Cash (PayPal or Bitcoin)
        </h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
          Invite friends. Earn a <strong className="text-emerald-400">30% lifetime cash cut</strong> on every VIP pass they purchase and every ad they view!
        </p>

        {/* Live Earnings Stats */}
        <div className="grid grid-cols-3 gap-2.5 my-5">
          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-center">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Invites Joined</span>
            <p className="text-lg font-black text-white mt-1">{stats.friendsInvited}</p>
          </div>
          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-center">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Ad Views</span>
            <p className="text-lg font-black text-white mt-1">{stats.adViewsEarned}</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Earned Cash</span>
            <p className="text-lg font-black text-emerald-300 mt-1">${stats.earnedUsd.toFixed(2)}</p>
            <p className="text-[9px] font-mono text-zinc-400 mt-0.5">{stats.earnedBtc} BTC</p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="text-left mb-4">
          <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-1.5">
            Your Viral Invite Link (+50 Gems for your friends):
          </label>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-black/60 border border-white/10">
            <input
              type="text"
              readOnly
              value={refLink}
              className="bg-transparent text-xs font-mono text-emerald-300 flex-1 px-2 focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* 1-Click Social Shares */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <a
            href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-[11px] font-bold text-sky-400 transition-all text-center"
          >
            Telegram
          </a>
          <a
            href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 transition-all text-center"
          >
            WhatsApp
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-zinc-300 transition-all text-center"
          >
            Twitter / X
          </a>
        </div>

        {/* Payout Method Selection (PayPal vs Bitcoin) */}
        <form onSubmit={handleSavePayout} className="text-left pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Receive 30% Payouts Via:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPayoutMethod("paypal")}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
                  payoutMethod === "paypal" ? "bg-sky-500 text-white" : "text-zinc-400 bg-white/5"
                }`}
              >
                PayPal (USD)
              </button>
              <button
                type="button"
                onClick={() => setPayoutMethod("bitcoin")}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
                  payoutMethod === "bitcoin" ? "bg-amber-500 text-black" : "text-zinc-400 bg-white/5"
                }`}
              >
                Bitcoin (BTC)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {payoutMethod === "paypal" ? (
              <input
                type="email"
                required
                placeholder="Enter your PayPal email address"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 flex-1"
              />
            ) : (
              <input
                type="text"
                required
                placeholder="Enter your Bitcoin address (bc1q...)"
                value={payoutBtc}
                onChange={(e) => setPayoutBtc(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 flex-1 font-mono"
              />
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/10 shrink-0"
            >
              {isSaved ? "Saved!" : "Save Payout"}
            </button>
          </div>
          <p className="text-[10px] text-zinc-500">
            Automatic PayPal or Bitcoin transfers sent every Friday once earnings reach $10.00.
          </p>
        </form>

      </div>
    </div>
  );
}

export function ReferralWelcomeBanner() {
  const [referrer, setReferrer] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref) {
        localStorage.setItem("velvet_referred_by", ref);
        setReferrer(ref);
      }
    }
  }, []);

  if (!referrer || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-900/60 via-teal-900/60 to-purple-900/60 border-b border-emerald-500/30 px-4 py-2 text-center text-xs flex items-center justify-center gap-3 animate-fade-in z-30 relative">
      <span className="flex items-center gap-1.5 font-bold text-emerald-300">
        <Gift className="w-4 h-4 text-emerald-400 animate-bounce" />
        🎉 Friend Invite Activated!
      </span>
      <span className="text-zinc-200 hidden sm:inline">
        You were invited by <strong className="text-white font-mono">{referrer}</strong>. +50 Free Gems &amp; 4K Render Unlocked!
      </span>
      <button onClick={() => setDismissed(true)} className="text-zinc-400 hover:text-white text-xs ml-2">
        ✕
      </button>
    </div>
  );
}
