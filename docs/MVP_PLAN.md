# MVP of the Day — 2026-07-27

## AdPilot — AI ad-creative variants for TikTok Shop sellers

**Source signal:** TrustMRR Daily Radar 2026-07-27 → #2 fastest grower **Dropkiller** (+37% MoM, $51,349 MRR). Dropkiller validates paid demand for e-commerce product/ad-creative intelligence.

**One-liner:** Paste a product URL. Get 10 TikTok-ready ad scripts + hooks in 30 seconds — test them tonight, kill what flops by morning.

**Why this, not another LLM-cost tool:** Yesterday's build (SpendGuard) already owns the AI-dev cost lane off the #1 signal. Building a second LLM-cost product would cannibalize it. Dropkiller (#2) opens a *different* lane — e-commerce operators, not AI developers — so you build a portfolio, not duplicates.

## Problem
TikTok Shop sellers run 5–20 ad variants per product per week. Writing hooks/scripts is the bottleneck — most solo sellers copy whatever worked last week and leave money on the table. Agencies charge $2k+/mo to do this manually.

## Target user
TikTok Shop / Shopify DTC sellers doing $10k–$200k/mo with no in-house copywriter.

## MVP scope

**In (week 1):**
- Paste a product URL → scrape title/bullets/images
- Generate 10 ad variants: hook + 15s script + caption + 3 hashtags
- Style presets: "UGC unboxing", "problem-solution", "listicle", "founder POV"
- Per-variant "hook strength" score (gpt-4o-mini rates virality 1–10)
- Export to TikTok Ads library CSV
- Dashboard: variants generated, top hooks, avg score

**Out (later):**
- Auto-post to TikTok via API
- Performance feedback loop (import CTR, auto-double-down)
- Video generation (Veo/Seedance) from script
- Multi-platform (Reels, Shorts)

## Tech stack
Next.js 14 (App Router) · TypeScript · Tailwind · Postgres (Neon) · Drizzle ORM · Clerk · OpenAI (gpt-4o for scripts, gpt-4o-mini for scoring) · Firecrawl (product scrape) · Stripe · Vercel

## Architecture
```
seller pastes product URL
   ↓
Firecrawl scrape → {title, bullets, images, price}
   ↓
prompt gpt-4o with 4 style presets → 10 variants
   ↓
gpt-4o-mini scores each hook 1-10
   ↓
save to Postgres; dashboard + CSV export
```

## Data model
- `variants(id, org_id, product_url, style, hook, script, caption, hashtags, score, ts)`
- `products(id, org_id, url, title, bullets)`
- `orgs(id, clerk_org_id, plan)`

## 7-day roadmap
1. Scaffold Next.js + Clerk + Neon/Drizzle, schema
2. `/api/generate` — Firecrawl scrape + gpt-4o 10-variant prompt
3. Hook scoring (gpt-4o-mini) + sort by score
4. Dashboard: variant list + CSV export
5. Stripe ($29/$99/$249) + usage limits
6. Landing page + free "5 free variants" no-signup teaser
7. Ship on Product Hunt + X; post in TikTok Shop seller FB/Slack groups

## Pricing
- **Starter — $29/mo:** 50 products/mo, 10 variants each, CSV export
- **Growth — $99/mo:** 200 products, style presets, hook scoring, priority gen
- **Scale — $249/mo:** unlimited, performance feedback loop (v2), API access

## Launch checklist
- [ ] Landing page live + 5-free-variants teaser
- [ ] 60s Loom: paste URL → 10 scripts in 30s
- [ ] Product Hunt (Tue/Wed) + X thread
- [ ] Post in 3 TikTok Shop seller communities (FB/Slack)
- [ ] Outreach to 20 DTC operators for free beta feedback
- [ ] Add to TrustMRR at $1k MRR

## Distribution wedge
Free **"TikTok hook generator"** — one hook, no signup, captures "TikTok ad script" / "TikTok hook" search intent. Email-gate the 2nd hook. Funnel into AdPilot paid.
