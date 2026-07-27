import { NextResponse } from "next/server";
import { z } from "zod";
import { db, variants, products } from "@/lib/db";
import { scrapeProduct } from "@/lib/scrape";
import { generateVariants, scoreHook } from "@/lib/generate";

const Body = z.object({ org_id: z.string(), product_url: z.string().url() });

export async function POST(req: Request) {
  if (req.headers.get("x-adpilot-key") !== process.env.ADPILLOT_API_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { org_id, product_url } = parsed.data;

  const product = await scrapeProduct(product_url);
  const [prodRow] = await db.insert(products).values({ org_id, url: product_url, title: product.title, bullets: product.bullets.join(" | ") }).returning();

  const gen = await generateVariants(product, 10);
  const scored = await Promise.all(gen.map(async (v) => ({ ...v, score: await scoreHook(v.hook) })));
  scored.sort((a, b) => b.score - a.score);

  await db.insert(variants).values(scored.map((v) => ({
    org_id, product_url, style: v.style, hook: v.hook, script: v.script,
    caption: v.caption, hashtags: v.hashtags, score: v.score,
  })));

  return NextResponse.json({ product_id: prodRow?.id, variants: scored });
}
