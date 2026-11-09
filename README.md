# 💋 VelvetMotion AI

> **Turn Still Photos into Cinematic AI Videos guided by Prompts — Designed with Candy.ai Dark-Neon Aesthetics.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhampusi97%2Fvelvetmotionai)

---

## ✨ Features

- **💋 Interactive Welcome Kiss Overlay**:
  - Fullscreen dark frosted glass overlay with glowing radial neon blobs.
  - SVG glowing lipstick kiss mark stamped on glass with a shockwave ripple (`animate-ping`).
  - Web Audio API kiss synthesizer + AI voice greeting (*"Welcome to Velvet Motion"*).
  - "Replay Kiss" header control to trigger the sequence anytime.
- **📸 Character & Photo Uploader**:
  - Drag-and-drop or file picker with instant client-side preview.
  - One-click replace or remove.
- **🎬 Virtual Director Controls**:
  - Natural-language motion prompt textarea.
  - Quick-preset inspiration vibe chips (*"✨ Gentle Smile & Wink"*, *"🌪️ Slow Motion Wind Blowing Hair"*, *"🎥 360 Cinematic Orbit"*, *"⚡ Cyberpunk Neon Reflections"*, etc.).
  - Motion intensity slider (`10% - 100%`).
  - Aspect ratio switcher (`9:16` Reel/TikTok, `16:9` Cinematic Landscape, `1:1` Square).
- **🎥 Real-Time Video Studio**:
  - Realistic multi-stage neural rendering progress indicators.
  - HTML5 video player with loop, playback controls, and direct **Download MP4** button.
  - Instant **Re-roll** button to regenerate with different prompt dynamics.
- **🪙 Native Bitcoin VIP Monetization & A-Ads**:
  - Hardcoded Native SegWit Bech32 Bitcoin address: `bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k`.
  - VIP modal with high-contrast neon QR code, instant copy button, and direct `bitcoin:` Coinbase Wallet app deep link.
  - Supporter Tier (`0.00005 BTC` / ~$5) and VIP Lifetime Tier (`0.0002 BTC` / ~$20).
  - Responsive banner slot configured for A-Ads banner advertising.

---

## 🎨 Visual Identity (Candy.ai Style)

- **Obsidian Dark Canvas**: Deep midnight tones (`#09090D`, `#12101C`).
- **Neon Accents**: Electric magenta (`#FF007F`), vivid violet (`#8B5CF6`), and radiant fuchsia (`#D946EF`).
- **Frosted Glassmorphism**: `backdrop-blur-2xl bg-white/[0.02] border border-white/10`.
- **Pill UI Components**: High-glow rounded chips and smooth hover micro-interactions.

---

## 🚀 Instant Free Deployment

### Option 1: Deploy with Vercel (Recommended)

1. Go to **[vercel.com/new](https://vercel.com/new)**.
2. Connect your GitHub account and import **`hampusi97/velvetmotionai`**.
3. Keep default settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Click **Deploy**. Your live URL will be ready in under 60 seconds!

### Option 2: Deploy with Netlify

1. Go to **[app.netlify.com](https://app.netlify.com)**.
2. Click **Add new site** ➔ **Import an existing project** ➔ **GitHub**.
3. Select **`hampusi97/velvetmotionai`**.
4. The included `netlify.toml` automatically configures the Next.js runtime.
5. Click **Deploy velvetmotionai**.

---

## 💻 Local Development

Clone the repository and run locally:

```bash
git clone https://github.com/hampusi97/velvetmotionai.git
cd velvetmotionai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Architecture

```text
velvetmotionai/
├── .github/
│   └── copilot-instructions.md   # AI Copilot styling & architectural guidelines
├── public/                       # Static public assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate-video/
│   │   │       └── route.ts      # Serverless video generation API route
│   │   ├── globals.css           # Custom scrollbar, animations & neon styles
│   │   ├── layout.tsx            # Radial neon background glow layers & metadata
│   │   └── page.tsx              # Main VelvetMotion Studio & interactive kiss overlay
│   └── components/
│       └── Monetization.tsx      # Bitcoin VIP checkout modal & A-Ads banner
├── apply_btc_wallet.py           # Automated Bitcoin address integration script
├── netlify.toml                  # Netlify deployment configuration
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 🪙 Connecting Ad Revenue with A-Ads

1. Visit **[a-ads.com](https://a-ads.com)**.
2. Click **Earn** ➔ **Create Ad Unit**.
3. Enter your Native SegWit payout address:
   ```text
   bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k
   ```
4. All daily ad impressions and clicks will pay out directly to your Coinbase Bitcoin Wallet.

---

## 📄 License

MIT © [hampusi97](https://github.com/hampusi97)
