import { NextResponse } from "next/server";
import crypto from "crypto";

// Stripe webhook — verifies signature with built-in crypto (no stripe SDK needed),
// then sends a welcome email on checkout.session.completed via Resend's REST API.
//
// Register this endpoint in Stripe:
//   Dashboard → Developers → Webhooks → Add endpoint
//   URL: https://<your-adpilot-domain>/api/stripe/webhook
//   Events: checkout.session.completed
//   Copy the Signing Secret → set as STRIPE_WEBHOOK_SECRET env var.

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";
  const raw = await req.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET not set" }, { status: 500 });

  // Parse t=... and all v1=... values from the header
  const parts = sig.split(",");
  const tPart = parts.find((p) => p.startsWith("t="));
  const v1Parts = parts.filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  if (!tPart || v1Parts.length === 0) return NextResponse.json({ error: "malformed signature" }, { status: 400 });

  const t = parseInt(tPart.slice(2), 10);
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) {
    return NextResponse.json({ error: "stale timestamp" }, { status: 400 });
  }

  const expected = crypto.createHmac("sha256", secret).update(`${t}.${raw}`).digest("hex");
  const valid = v1Parts.some((s) => {
    if (s.length !== expected.length) return false;
    try {
      return crypto.timingSafeEqual(Buffer.from(s, "hex"), Buffer.from(expected, "hex"));
    } catch {
      return false;
    }
  });
  if (!valid) return NextResponse.json({ error: "invalid signature" }, { status: 400 });

  let event: { type: string; data: { object: any } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    const email: string | undefined = s.customer_email || s.customer_details?.email;
    const plan: string = s.metadata?.plan || "starter";

    // Send welcome email via Resend REST API (no SDK → no package.json change).
    if (email && process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.MAIL_FROM || "AdPilot <hello@adpilot.ai>",
            to: email,
            subject: "Welcome to AdPilot 🎬 — here's your next step",
            text: [
              `Thanks for subscribing to AdPilot (${plan})!`,
              "",
              "Reply to this email and I'll set up your account + API key within a few hours.",
              "",
              "— The AdPilot team",
            ].join("\n"),
          }),
        });
      } catch {
        // Email failure shouldn't fail the webhook (Stripe would retry forever).
      }
    }

    // TODO (once you have paying customers): insert into the orgs table.
    // Add `email` and `stripe_customer_id` columns to lib/db.ts orgs schema,
    // re-run `pnpm db:push`, then:
    //   await db.insert(orgs).values({ clerk_org_id: s.customer, plan, email, stripe_customer_id: s.customer });
    // For the first ~10 customers, manual provisioning is fine and lets you learn what they need.
  }

  return NextResponse.json({ received: true });
}
