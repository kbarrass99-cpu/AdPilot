// AdPilot — Stripe Payment Link integration
export const PAYMENT_LINKS = {
  starter: "https://buy.stripe.com/REPLACE_STARTER", // $29/mo
  growth:  "https://buy.stripe.com/REPLACE_GROWTH",  // $99/mo
  scale:   "https://buy.stripe.com/REPLACE_SCALE",   // $249/mo
} as const;
export type Tier = keyof typeof PAYMENT_LINKS;
export const checkoutUrl = (t: Tier) => PAYMENT_LINKS[t];
