#!/usr/bin/env bash
set -e

echo "========================================================"
echo "  VelvetMotion AI — Candy.ai Style Build & Drop Packager"
echo "========================================================"

echo ""
echo "1. Building Next.js production bundle..."
npm run build

echo ""
echo "2. Packaging velvet-motion-ai-deploy.zip for instant free hosting..."
zip -rq velvet-motion-ai-deploy.zip \
  package.json \
  package-lock.json \
  next.config.ts \
  tsconfig.json \
  netlify.toml \
  .env.example \
  DEPLOYMENT_GUIDE.md \
  public \
  src

echo ""
echo "========================================================"
echo "  SUCCESS! Project is ready to deploy for $0/month:"
echo "  - Project Path: /Users/lars/.gemini/antigravity/scratch/velvet-motion-ai"
echo "  - Deploy Zip:   /Users/lars/.gemini/antigravity/scratch/velvet-motion-ai/velvet-motion-ai-deploy.zip"
echo "========================================================"
echo ""
echo "Instant Free Hosting Options:"
echo "  Option A (Vercel CLI / Web):"
echo "    -> npx vercel deploy --prod"
echo "  Option B (Netlify CLI / Web):"
echo "    -> npx netlify deploy --prod"
echo "  Option C (Local Development):"
echo "    -> npm run dev -- --port 3070"
echo ""
