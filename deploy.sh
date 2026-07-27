#!/usr/bin/env bash
# AdPilot — one-click deploy helper. Run from repo root: bash deploy.sh
set -euo pipefail
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok(){ echo -e "${GREEN}✅ $1${NC}"; } warn(){ echo -e "${YELLOW}⚠️  $1${NC}"; } err(){ echo -e "${RED}❌ $1${NC}"; exit 1; }

echo "🎬 AdPilot deploy script"; echo "------------------------------"
command -v node >/dev/null || err "Node.js not installed — https://nodejs.org (LTS)"
command -v pnpm >/dev/null || { warn "pnpm not found — installing..."; npm i -g pnpm; }
[[ -f package.json ]] || err "Run this from the AdPilot repo root."
ok "Preflight passed"

if [[ ! -f .env.local ]]; then cp .env.example .env.local; warn ".env.local created — fill the keys before deploying."; else ok ".env.local exists"; fi

echo "📦 Installing dependencies..."; pnpm install; ok "Dependencies installed"

if grep -qE "NEON_DATABASE_URL=https?://" .env.local 2>/dev/null; then
  echo "🗄️  Pushing Drizzle schema to Neon..."; pnpm db:push && ok "Schema pushed (variants + products + orgs)" || warn "Schema push failed — check NEON_DATABASE_URL"
else warn "NEON_DATABASE_URL not set — skipping schema. Set it then run: pnpm db:push"; fi

if ! command -v vercel >/dev/null; then warn "Vercel CLI not found — installing..."; pnpm i -g vercel; fi

echo ""; echo "🚀 Ready to deploy!"
echo "   1. vercel link"
echo "   2. Add env keys:  vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY / CLERK_SECRET_KEY / NEON_DATABASE_URL / OPENAI_API_KEY / FIRECRAWL_API_KEY / ADPILOT_API_KEY"
echo "   3. vercel --prod"
echo ""
echo "📋 Service setup:"
echo "   Neon (Postgres):  https://neon.tech"
echo "   Clerk (auth):     https://clerk.com"
echo "   OpenAI:           https://platform.openai.com/api-keys"
echo "   Firecrawl:        https://firecrawl.dev   (for product URL scraping)"
echo "   Stripe:           https://dashboard.stripe.com  → $29/$99/$249 recurring products"
echo ""
ok "AdPilot deploy prep complete"
