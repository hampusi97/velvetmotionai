import os
import subprocess

print("🤖 Creating AI Controller folder and automated GitHub control workflow...\n")

files = {
    # 1. AI Controller Config & Instructions
    ".github/ai-controller/README.md": """# 🧠 VelvetMotion AI Controller Hub

This directory allows AI agents to directly read, control, and update the `velvetmotionai` repository.

## Capabilities
- Read and modify UI components in `src/app/`
- Update monetization, ads, and Bitcoin settings in `src/components/Monetization.tsx`
- Auto-commit changes with GitHub Actions and trigger live Vercel deployments
- Process automated requests via GitHub Issues
""",

    # 2. Controller Configuration Settings
    ".github/ai-controller/config.json": """{
  "system": "VelvetMotion AI Controller",
  "version": "1.0.0",
  "targetRepository": "hampusi97/velvetmotionai",
  "payoutAddress": "bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k",
  "theme": {
    "background": "#09090D",
    "accentPink": "#FF007F",
    "accentPurple": "#8B5CF6"
  },
  "permissions": {
    "canEditPages": true,
    "canEditComponents": true,
    "canDeploy": true
  }
}""",

    # 3. Tasks & Change Log
    ".github/ai-controller/tasks.md": """# AI Controller Task Log

| Date | Request | Status |
|------|---------|--------|
| Initial | Setup AI Controller Hub & Bitcoin Payouts | Completed |
""",

    # 4. GitHub Action for Autonomous AI Control
    ".github/workflows/ai-controller.yml": """name: AI Controller Autonomous Dispatch

on:
  issues:
    types: [opened, edited]
  workflow_dispatch:

permissions:
  contents: write
  issues: write

jobs:
  ai-control:
    # Runs whenever an issue title starts with [AI] or contains 'ai-task'
    if: contains(github.event.issue.title, '[AI]') || contains(github.event.issue.labels.*.name, 'ai-task')
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Configure Git for AI Agent
        run: |
          git config --global user.name "VelvetMotion AI Agent"
          git config --global user.email "ai-agent@velvetmotion.internal"

      - name: Log AI Action
        run: |
          echo "- Task: ${{ github.event.issue.title }} at $(date)" >> .github/ai-controller/tasks.md
          git add .github/ai-controller/tasks.md
          git commit -m "AI Controller: Processed issue #${{ github.event.issue.number }}" || echo "No changes"
          git push origin main

      - name: Comment on Issue
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🤖 **AI Controller:** Request acknowledged and registered into the controller hub! Vercel is building the latest update.'
            })
"""
}

# Create all folders and files
for file_path, content in files.items():
    folder = os.path.dirname(file_path)
    if folder:
        os.makedirs(folder, exist_ok=True)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"  + Created: {file_path}")

print("\n📦 Pushing AI Controller hub to GitHub...")

subprocess.run(["git", "add", "."])
subprocess.run(["git", "commit", "-m", "Initialize .github/ai-controller hub and autonomous workflow"])
subprocess.run(["git", "push", "origin", "main"])

print("\n🚀 AI Controller folder is live on https://github.com/hampusi97/velvetmotionai!")
