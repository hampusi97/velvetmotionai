# VelvetMotion AI — Deployment & Free Hosting Guide

VelvetMotion AI is a dark-aesthetic, Candy.ai styled Image-to-Video web application designed for $0/month deployment on Vercel, Netlify, or Cloudflare Pages.

---

## ⚡ Option 1: Vercel (Recommended — 60 Seconds)

1. **Deploy via Vercel CLI**:
   ```bash
   cd /Users/lars/.gemini/antigravity/scratch/velvet-motion-ai
   npx vercel deploy --prod
   ```

2. **Deploy via Web**:
   - Push this directory to your GitHub account.
   - Go to [vercel.com/new](https://vercel.com/new).
   - Import your repo. Vercel automatically detects Next.js.
   - (Optional) Set `HF_TOKEN` in Environment Variables if you have a Hugging Face GPU token.
   - Click **Deploy**.

---

## 🚀 Option 2: Netlify (1-Click)

The repository includes `netlify.toml` pre-configured with `@netlify/plugin-nextjs`.

```bash
cd /Users/lars/.gemini/antigravity/scratch/velvet-motion-ai
npm run build
npx netlify deploy --prod
```

Or connect the GitHub repository in [app.netlify.com](https://app.netlify.com).

---

## 💻 Option 3: Local Development

```bash
cd /Users/lars/.gemini/antigravity/scratch/velvet-motion-ai
npm install
npm run dev -- --port 3070
# Open http://localhost:3070
```

---

## 🎨 Aesthetic & Engine Highlights

- **Visual Style**: Exact Candy.ai dark aesthetic (`#08070c`), electric neon magenta (`#ff007f`) & violet (`#8b5cf6`) accents, glassmorphic frosted cards (`bg-white/[0.02] backdrop-blur-2xl`), and glowing circular Stories bar.
- **Dual-Engine Motion**:
  - Built-in HTML5 Canvas + MediaRecorder client synthesizer (takes the user's uploaded photo, applies camera pan/zoom/breathing/floating particles, and outputs real `.mp4` video blobs with zero server cost).
  - Serverless route at `/api/generate-video` integrating Hugging Face CogVideoX-5B space.
- **100% Free Economy**: 50 starting VIP credits, 2 credits per generation, and a 5-second sponsor spotlight refill loop (+50 credits for free).
- **Private Vault**: Stores generated motion clips locally in the user's browser with 1-click replay and MP4 downloads.
