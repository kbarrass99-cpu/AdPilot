import OpenAI from "openai";

const oai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export type Style = "ugc" | "problem_solution" | "listicle" | "founder";

const STYLE_BRIEFS: Record<Style, string> = {
  ugc: "UGC unboxing — casual, first-person, 'I just got this and...'",
  problem_solution: "Problem → agitate → product as the fix",
  listicle: "'3 reasons this...' / 'top 5...' list format",
  founder: "Founder POV — why I built this, the origin story",
};

export async function generateVariants(product: { title: string; bullets: string[]; price?: string }, count = 10) {
  const sys = `You are a TikTok Shop ad copywriter. Output ${count} ad variants as a JSON array. Each variant: {style, hook (first 3 seconds, scroll-stopping), script (15s spoken, ~40 words), caption, hashtags (space-separated, 3-5)}. Mix styles across these presets: ${Object.entries(STYLE_BRIEFS).map(([k,v])=>`${k}: ${v}`).join("; ")}. Product: ${product.title}. Features: ${product.bullets.join(", ")}. Price: ${product.price ?? "n/a"}.`;
  const res = await oai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: sys }, { role: "user", content: "Generate the variants as JSON only." }],
    response_format: { type: "json_object" },
    temperature: 0.9,
  });
  const raw = res.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(raw);
  return (parsed.variants ?? parsed.array ?? parsed) as { style: string; hook: string; script: string; caption: string; hashtags: string }[];
}

export async function scoreHook(hook: string): Promise<number> {
  const res = await oai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: "Rate this TikTok hook's scroll-stopping virality 0-10. Reply with ONLY the number." }, { role: "user", content: hook }],
    max_tokens: 4, temperature: 0,
  });
  const n = parseFloat(res.choices[0]?.message?.content || "5");
  return Math.max(0, Math.min(10, isNaN(n) ? 5 : n));
}
