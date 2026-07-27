import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";

const Body = z.object({ description: z.string().min(5).max(500) });

// Simple in-memory rate limit (per serverless instance).
// For production abuse protection, upgrade to Upstash Redis (Vercel KV).
const hits = new Map<string, { count: number; reset: number }>();
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000; // 5 generations / hour / IP

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anon").trim();
  const now = Date.now();
  const r = hits.get(ip);
  if (!r || now > r.reset) hits.set(ip, { count: 1, reset: now + WINDOW_MS });
  else if (r.count >= LIMIT) {
    return NextResponse.json(
      { error: "rate_limit", message: "5 generations/hour max. Come back shortly — or sign up for AdPilot for unlimited variants." },
      { status: 429 }
    );
  } else {
    r.count++;
  }

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid", message: "Describe your product or service in 5–500 characters." }, { status: 400 });
  }
  const { description } = parsed.data;

  const oai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const res = await oai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You write viral TikTok ad hooks. Output 5 scroll-stopping first-3-seconds hooks for a TikTok ad about the product/service. Each hook must be under 15 words, punchy, curiosity-driven, no hashtags, no emojis. Return ONLY JSON: {\"hooks\": [\"...\",\"...\",\"...\",\"...\",\"...\"]}.",
      },
      { role: "user", content: description },
    ],
    response_format: { type: "json_object" },
    temperature: 0.9,
    max_tokens: 300,
  });
  const raw = res.choices[0]?.message?.content || "{}";
  let hooks: unknown;
  try {
    hooks = JSON.parse(raw).hooks;
  } catch {
    return NextResponse.json({ error: "parse", message: "Generation failed — try again." }, { status: 500 });
  }
  if (!Array.isArray(hooks) || hooks.length === 0) {
    return NextResponse.json({ error: "parse", message: "No hooks returned — try again." }, { status: 500 });
  }
  return NextResponse.json({ hooks });
}
