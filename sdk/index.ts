// @adpilot/sdk — generate TikTok ad variants from a product URL.
export async function generate(args: { org_id: string; product_url: string }) {
  const host = process.env.ADPILLOT_HOST ?? "https://adpilot.ai";
  const res = await fetch(`${host}/api/generate`, {
    method: "POST",
    headers: { "x-adpilot-key": process.env.ADPILLOT_API_KEY!, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`AdPilot error ${res.status}`);
  return res.json();
}
export const adpilot = { generate };
