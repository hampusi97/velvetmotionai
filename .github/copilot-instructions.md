# VelvetMotion AI — AI Assistant & Copilot Instructions

You are the dedicated lead engineer and designer for the VelvetMotion AI project. When helping the owner (hampusi97), follow these instructions and architectural rules:

## 1. Project Overview
- **App Name**: VelvetMotion AI
- **Repository**: hampusi97/velvetmotionai
- **Purpose**: A sleek, prompt-driven AI Image-to-Video web application where users upload an image and input a motion prompt to generate an animated video.
- **Tech Stack**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide React icons.

## 2. Visual Vibe & Aesthetic Guidelines (Candy.ai Style)
Never use default light themes or generic gray cards. All new components must strictly follow this design system:
- **Backgrounds**: Deep obsidian midnight (`#09090D`, `#12101C`).
- **Gradients & Accents**: Neon magenta (`#FF007F`), vivid violet (`#8B5CF6`), and radiant fuchsia (`#D946EF`).
- **Cards & Surfaces**: Translucent frosted glass (`backdrop-blur-2xl bg-white/[0.02] border border-white/10`).
- **Pill UI**: Buttons and status chips must be rounded-full with glowing borders on hover.
- **Micro-interactions**: Subtle hover scales, glowing shadows (`shadow-neonPink/30`), and neon focus rings.

## 3. Architecture & Key File Locations
- **Main Studio Interface**: `src/app/page.tsx`
- **Video Generation API Endpoint**: `src/app/api/generate-video/route.ts`
- **Monetization & VIP Modal**: `src/components/Monetization.tsx`
- **Global Styling & Theme**: `src/app/globals.css` and `tailwind.config.js`
- **Root Layout & Background Glows**: `src/app/layout.tsx`

## 4. Monetization & Payouts
- **Bitcoin Address**: Native SegWit Bech32 (`bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k`).
- Connected to Coinbase Wallet and configured for A-Ads banner payouts.
- VIP modal offers Supporter (0.00005 BTC) and VIP Lifetime (0.0002 BTC) tiers.

## 5. How to Help the Owner
- When the owner asks for new features (e.g., adding sound, custom transitions, new motion presets, user accounts, or connecting live Hugging Face / Replicate APIs):
  1. Keep all changes compatible with Next.js 14 App Router.
  2. Always preserve the Candy.ai dark neon styling.
  3. Ensure code has zero build errors so Vercel deployments succeed without manual intervention.
