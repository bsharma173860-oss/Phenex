#!/bin/bash
# ══════════════════════════════════════════
# PHENEXAI — Push to GitHub in one command
# ══════════════════════════════════════════

echo "🚀 PhenexAi — Pushing to GitHub..."
echo ""

# Init git if not already
if [ ! -d ".git" ]; then
  git init
  echo "✅ Git initialized"
fi

# Set remote
git remote remove origin 2>/dev/null
git remote add origin https://github.com/bsharma173860-oss/Phenex.ai.git
echo "✅ Remote set to GitHub"

# Stage all files
git add .
echo "✅ All files staged"

# Commit
git commit -m "🚀 Initial PhenexAi build — Full CRM + AI Agent + Backend

Features:
- 14 frontend pages (Dashboard, CRM, Pipeline, Calendar, Conversations, AI Agent, Payments, Analytics, Workflows, Campaigns, Settings, Login, Onboarding)
- Node.js + Express backend
- Claude AI agent (chat, email writing, lead scoring, account builder)
- Supabase database (10 tables)
- Stripe payments + invoices
- Twilio SMS + WhatsApp
- JWT authentication
- Vercel deployment config
- GitHub Actions CI/CD"

echo "✅ Committed"

# Push to main
git branch -M main
git push -u origin main

echo ""
echo "══════════════════════════════════════"
echo "✅ PhenexAi pushed to GitHub!"
echo "🔗 https://github.com/bsharma173860-oss/Phenex.ai"
echo "══════════════════════════════════════"
