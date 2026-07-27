// Product scraping via Firecrawl. Sign up at firecrawl.dev, set FIRECRAWL_API_KEY.
export async function scrapeProduct(url: string): Promise<{ title: string; bullets: string[]; price?: string }> {
  const r = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ url, formats: ["json"], jsonOptions: { prompt: "Extract product title, bullet-point features, and price as JSON {title, bullets[], price}." } }),
  });
  const j = await r.json();
  const d = j?.data?.json ?? {};
  return { title: d.title ?? url, bullets: d.bullets ?? [], price: d.price };
}
