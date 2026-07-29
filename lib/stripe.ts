// AdPilot — Stripe Payment Link integration
// Flat pricing, no credits. Monthly + annual (annual ≈ 30% off).
//   Starter  $29/mo   |  $249/yr   (save 28%)
//   Growth   $99/mo   |  $839/yr   (save 29%)  ← Most Popular
//   Scale    $199/mo  |  $1,690/yr (save 29%)
// Create 6 Payment Links in Stripe (one per price) and paste the URLs below.
export const PAYMENT_LINKS = {
  starter_monthly: "https://buy.stripe.com/REPLACE_STARTER_M", // $29/mo
  starter_annual:  "https://buy.stripe.com/REPLACE_STARTER_Y", // $249/yr
  growth_monthly:  "https://buy.stripe.com/REPLACE_GROWTH_M",  // $99/mo
  growth_annual:   "https://buy.stripe.com/REPLACE_GROWTH_Y",  // $839/yr
  scale_monthly:   "https://buy.stripe.com/REPLACE_SCALE_M",   // $199/mo
  scale_annual:    "https://buy.stripe.com/REPLACE_SCALE_Y",   // $1,690/yr
} as const;

export type PlanKey = keyof typeof PAYMENT_LINKS;
export const checkoutUrl = (k: PlanKey) => PAYMENT_LINKS[k];
