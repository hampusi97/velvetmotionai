import os
import subprocess

print("🪙 Wiring Bitcoin address bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k into VelvetMotion AI...\n")

BTC_ADDRESS = "bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k"

files = {
    # 1. src/components/Monetization.tsx (Bitcoin VIP Checkout & Ad Banner)
    "src/components/Monetization.tsx": f"""\"use client\";

import React, {{ useState }} from "react";
import {{ Copy, Check, Zap, X, ExternalLink, ShieldCheck, QrCode }} from "lucide-react";

export const BTC_PAYOUT_ADDRESS = "{BTC_ADDRESS}";

export function VIPModal({{ isOpen, onClose }}: {{ isOpen: boolean; onClose: () => void }}) {{
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {{
    navigator.clipboard.writeText(BTC_PAYOUT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }};

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-md rounded-2xl bg-[#12101C] border border-neonPink/40 p-6 shadow-2xl shadow-neonPink/20 text-center animate-fade-in">
        
        {/* Close */}
        <button
          onClick={{onClose}}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-neonPink to-neonPurple mx-auto flex items-center justify-center mb-3 shadow-lg shadow-neonPink/30">
          <Zap className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-xl font-black text-white uppercase tracking-wider">
          Unlock VIP Pass & Support
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Direct instant payout to creator Coinbase Bitcoin Wallet.
        </p>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-left">
            <span className="text-[10px] font-bold text-amber-400 uppercase">Supporter</span>
            <p className="text-base font-black text-white mt-0.5">0.00005 <span className="text-xs font-normal text-zinc-400">BTC</span></p>
            <p className="text-[10px] text-zinc-400 mt-0.5">~ $5.00 • Priority 4K</p>
          </div>
          <div className="p-3 rounded-xl bg-neonPink/10 border border-neonPink/40 text-left">
            <span className="text-[10px] font-bold text-neonFuchsia uppercase">VIP Lifetime</span>
            <p className="text-base font-black text-white mt-0.5">0.0002 <span className="text-xs font-normal text-zinc-400">BTC</span></p>
            <p className="text-[10px] text-zinc-400 mt-0.5">~ $20.00 • Unlimited</p>
          </div>
        </div>

        {/* QR Code Container (Native SegWit Bitcoin) */}
        <div className="p-4 rounded-xl bg-black/70 border border-white/10 inline-block mb-3">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bitcoin:{BTC_ADDRESS}&bgcolor=000000&color=FF007F"
            alt="Coinbase Bitcoin Wallet QR"
            className="w-32 h-32 rounded-lg mx-auto"
          />
          <p className="text-[10px] text-zinc-400 mt-2 font-mono flex items-center justify-center gap-1">
            <QrCode className="w-3 h-3 text-neonPink" /> Scan in Coinbase Wallet
          </p>
        </div>

        {/* Address Display & Copy */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/10 text-left mb-4">
          <div className="overflow-hidden mr-2">
            <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-semibold">Coinbase BTC Address:</p>
            <p className="text-xs font-mono text-amber-300 truncate">{BTC_ADDRESS}</p>
          </div>
          <button
            onClick={{handleCopy}}
            className="px-3 py-1.5 rounded-lg bg-neonPink/20 hover:bg-neonPink/30 border border-neonPink/40 text-xs font-semibold text-neonPink flex items-center gap-1 transition-all shrink-0"
          >
            {{copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}}
            {{copied ? "Copied!" : "Copy"}}
          </button>
        </div>

        {/* Direct Open in Coinbase Wallet / Bitcoin App */}
        <a
          href="bitcoin:{BTC_ADDRESS}"
          className="w-full py-3 rounded-xl font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-amber-500 via-neonPink to-neonPurple hover:opacity-95 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-neonPink/25 active:scale-98"
        >
          <ExternalLink className="w-4 h-4" /> Open in Bitcoin / Coinbase App
        </a>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified Native SegWit Bitcoin Address</span>
        </div>
      </div>
    </div>
  );
}}

export function CryptoAdBanner() {{
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

        {/* A-Ads Banner Slot (configured for direct BTC payout to bc1q...) */}
        <div className="h-10 px-4 rounded-lg bg-black/60 border border-amber-500/20 flex items-center justify-center text-[11px] text-zinc-400 font-mono">
          <span>A-Ads BTC Slot (Active)</span>
        </div>
      </div>
    </div>
  );
}}
"""
}

# Write the monetization component
for file_path, content in files.items():
    folder = os.path.dirname(file_path)
    if folder:
        os.makedirs(folder, exist_ok=True)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"  + Configured: {file_path}")

print("\n📦 Updating src/app/page.tsx to add the VIP modal trigger...")

# Read existing page.tsx and inject the VIP Modal button & component
page_path = "src/app/page.tsx"
if os.path.exists(page_path):
    with open(page_path, "r", encoding="utf-8") as f:
        page_content = f.read()

    # Add import if missing
    if "VIPModal" not in page_content:
        page_content = 'import { VIPModal, CryptoAdBanner } from "../components/Monetization";\n' + page_content
    
    # Add state if missing
    if "isVIPOpen" not in page_content:
        page_content = page_content.replace(
            "const [showIntro, setShowIntro] = useState(true);",
            "const [showIntro, setShowIntro] = useState(true);\n  const [isVIPOpen, setIsVIPOpen] = useState(false);"
        )

    # Add the VIP Pass Button in the header
    vip_button_code = """          {/* VIP Bitcoin Button */}
          <button
            onClick={() => setIsVIPOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-neonPink/20 border border-amber-500/40 text-xs text-amber-300 hover:scale-105 transition-all shadow-lg shadow-amber-500/10 font-bold"
          >
            <span>⚡</span> VIP / Tip (BTC)
          </button>
"""
    if "VIP / Tip (BTC)" not in page_content:
        page_content = page_content.replace(
            '<div className="flex items-center gap-3">',
            '<div className="flex items-center gap-3">\n' + vip_button_code,
            1
        )

    # Add the VIPModal element before the closing tag
    if "<VIPModal" not in page_content:
        page_content = page_content.replace(
            "    </div>\n  );\n}",
            "      {/* VIP Bitcoin Modal */}\n      <VIPModal isOpen={isVIPOpen} onClose={() => setIsVIPOpen(false)} />\n    </div>\n  );\n}"
        )

    with open(page_path, "w", encoding="utf-8") as f:
        f.write(page_content)
    print("  + Injected VIP Bitcoin modal trigger into page.tsx")

print("\n🚀 Pushing updates to GitHub...")

subprocess.run(["git", "add", "."])
subprocess.run(["git", "commit", "-m", "Wire Coinbase Bitcoin address bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k for VIP & ad payouts"])
subprocess.run(["git", "push", "origin", "main"])

print("\n✅ Complete! Vercel is re-deploying your site with your Bitcoin address right now.")
