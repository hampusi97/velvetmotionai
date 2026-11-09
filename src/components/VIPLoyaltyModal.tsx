"use client";

import React, { useState } from "react";
import { 
  Crown, Trophy, Sparkles, Zap, ShieldCheck, CheckCircle2, 
  Lock, X, ChevronRight, Gift, CreditCard, Copy, Check 
} from "lucide-react";

interface VIPLoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userTotalSpent: number;
  onSimulateDeposit: (amount: number) => void;
}

export function VIPLoyaltyModal({ isOpen, onClose, userTotalSpent, onSimulateDeposit }: VIPLoyaltyModalProps) {
  const [copiedBTC, setCopiedBTC] = useState(false);
  const [activeTab, setActiveTab] = useState<"tiers" | "leaderboard">("tiers");

  if (!isOpen) return null;

  // Determine Current Tier
  const getTier = (spent: number) => {
    if (spent >= 100) return { name: "Diamond Whale", color: "from-cyan-400 to-blue-500", badge: "💎 Diamond Whale", next: null };
    if (spent >= 50) return { name: "Gold Patron", color: "from-amber-400 to-yellow-500", badge: "👑 Gold Patron", next: 100 - spent };
    if (spent >= 15) return { name: "Bronze Supporter", color: "from-rose-400 to-pink-500", badge: "⚡ Bronze Supporter", next: 50 - spent };
    return { name: "Standard Member", color: "from-zinc-500 to-zinc-400", badge: "Guest", next: 15 - spent };
  };

  const currentTier = getTier(userTotalSpent);

  // Top 5 Spenders "Hall of Fame" Leaderboard
  const leaderboard = [
    { rank: 1, name: "CryptoKing_99", spent: "$280.00", btc: "0.0028 BTC", tier: "💎 Diamond Whale" },
    { rank: 2, name: "Satoshi_Baron", spent: "$175.00", btc: "0.0017 BTC", tier: "💎 Diamond Whale" },
    { rank: 3, name: "Lord_Alexander", spent: "$95.00", btc: "0.0009 BTC", tier: "👑 Gold Patron" },
    { rank: 4, name: "Vance_VIP", spent: "$60.00", btc: "0.0006 BTC", tier: "👑 Gold Patron" },
    { rank: 5, name: "VelvetWhale_01", spent: "$35.00", btc: "0.0003 BTC", tier: "⚡ Bronze Supporter" }
  ];

  return (
    <div className="fixed inset-0 z-[160] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#120E1C] border border-amber-500/40 p-6 sm:p-8 shadow-2xl text-center">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all">
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-pink-600 mx-auto flex items-center justify-center mb-3 shadow-lg shadow-amber-500/30">
          <Crown className="w-8 h-8 text-black font-black" />
        </div>

        <h3 className="text-2xl font-black text-white uppercase tracking-wider">
          High-Roller VIP Royalty &amp; Rewards
        </h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
          The more you support VelvetMotion, the more exclusive privileges, hidden companions, and rewards you unlock.
        </p>

        {/* Tab Switcher: Tiers vs Leaderboard */}
        <div className="grid grid-cols-2 gap-2 my-5 p-1 rounded-xl bg-black/50 border border-white/10">
          <button
            onClick={() => setActiveTab("tiers")}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "tiers" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Crown className="w-4 h-4" /> Royalty Tiers &amp; Perks
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "leaderboard" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Trophy className="w-4 h-4" /> Top Supporters (Hall of Fame)
          </button>
        </div>

        {/* TAB 1: VIP TIERS & BENEFITS */}
        {activeTab === "tiers" && (
          <div className="space-y-4 text-left max-h-[50vh] overflow-y-auto pr-1">
            
            {/* User Current Tier Status Banner */}
            <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Your Current Status</span>
                <span className="text-sm font-black text-amber-300 flex items-center gap-1 mt-0.5">
                  <Crown className="w-4 h-4 text-amber-400" /> {currentTier.badge}
                </span>
                <p className="text-[11px] text-zinc-400 mt-1">Total Contributed: <strong className="text-white">${userTotalSpent.toFixed(2)} USD</strong></p>
              </div>

              {currentTier.next !== null && (
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Next Tier Upgrade</span>
                  <span className="text-xs font-bold text-emerald-400">+${currentTier.next.toFixed(2)} needed</span>
                </div>
              )}
            </div>

            {/* Tier 1: Bronze ($15) */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-pink-500/40 transition-all">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-pink-400 flex items-center gap-1">
                  ⚡ Bronze Supporter ($15+)
                </span>
                {userTotalSpent >= 15 ? (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Unlocked</span>
                ) : (
                  <span className="text-[10px] text-zinc-500">Locked</span>
                )}
              </div>
              <ul className="text-[11px] text-zinc-300 space-y-1">
                <li>• 100% Ad-Free across the entire platform</li>
                <li>• 1.2x Gem Refill Bonus on all purchases</li>
                <li>• Unlocks all base companion photo vaults</li>
              </ul>
            </div>

            {/* Tier 2: Gold ($50) */}
            <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/30">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  👑 Gold Patron ($50+)
                </span>
                {userTotalSpent >= 50 ? (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Unlocked</span>
                ) : (
                  <span className="text-[10px] text-zinc-500">Locked</span>
                )}
              </div>
              <ul className="text-[11px] text-zinc-300 space-y-1">
                <li className="text-amber-200 font-semibold">• Unlocks Exclusive Royalty Companion: Genevieve</li>
                <li>• Priority 4K 60FPS Video Rendering (Jumps queue)</li>
                <li>• Golden Crown badge displayed on all chats</li>
              </ul>
            </div>

            {/* Tier 3: Diamond Whale ($100+) */}
            <div className="p-3.5 rounded-2xl bg-cyan-500/5 border border-cyan-500/40">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                  💎 Diamond Whale ($100+)
                </span>
                {userTotalSpent >= 100 ? (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Unlocked</span>
                ) : (
                  <span className="text-[10px] text-zinc-500">Locked</span>
                )}
              </div>
              <ul className="text-[11px] text-zinc-300 space-y-1">
                <li className="text-cyan-200 font-semibold">• Instant Level 5 Soulmate intimacy with all companions</li>
                <li>• 2x Gems multiplier permanently</li>
                <li>• 5% Bitcoin / PayPal Cash-Back credited to your wallet</li>
                <li>• Top spot featured on the Hall of Fame Leaderboard</li>
              </ul>
            </div>

            {/* Quick Deposit Options */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-2">Deposit to Increase VIP Rank:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSimulateDeposit(25)}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs shadow-lg active:scale-95"
                >
                  Deposit +$25.00
                </button>
                <button
                  onClick={() => onSimulateDeposit(50)}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-xs shadow-lg active:scale-95"
                >
                  Deposit +$50.00 (Instant Gold)
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: HALL OF FAME LEADERBOARD */}
        {activeTab === "leaderboard" && (
          <div className="space-y-3 text-left max-h-[50vh] overflow-y-auto pr-1">
            <p className="text-xs text-zinc-400">Weekly Top Supporters honored for powering the VelvetMotion platform:</p>
            {leaderboard.map((item) => (
              <div key={item.rank} className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                    item.rank === 1 ? "bg-amber-400 text-black shadow-lg shadow-amber-400/30" :
                    item.rank === 2 ? "bg-zinc-300 text-black" :
                    item.rank === 3 ? "bg-amber-700 text-white" : "bg-white/10 text-zinc-400"
                  }`}>
                    #{item.rank}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {item.name}
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-zinc-300 font-normal">
                        {item.tier}
                      </span>
                    </h4>
                    <p className="text-[10px] font-mono text-zinc-400 mt-0.5">{item.btc}</p>
                  </div>
                </div>

                <span className="text-xs font-black text-amber-300 font-mono">{item.spent}</span>
              </div>
            ))}

            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center mt-3">
              <p className="text-xs text-zinc-400">Want your name honored as #1 on the Hall of Fame?</p>
              <button
                onClick={() => onSimulateDeposit(100)}
                className="mt-2 text-xs font-bold text-amber-400 hover:underline"
              >
                Deposit $100+ to take the Crown ➔
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
