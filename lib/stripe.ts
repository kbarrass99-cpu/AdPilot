// AdPilot — Stripe Payment Links (live)
// Flat pricing, no credits. Monthly + annual (annual ≈ 30% off).
//   Starter  $29/mo   |  $249/yr   (save 28%)
//   Growth   $99/mo   |  $839/yr   (save 29%)  ← Most Popular
//   Scale    $199/mo  |  $1,690/yr (save 29%)
export const PAYMENT_LINKS = {
  starter_monthly: "https://buy.stripe.com/6oU3cxblJ7K3gzKbADeAg04", // $29/mo
  starter_annual:  "https://buy.stripe.com/eVqbJ3ahFfcv97ibADeAg05", // $249/yr
  growth_monthly:  "https://buy.stripe.com/6oU8wR4Xle8r97idILeAg02", // $99/mo
  growth_annual:   "https://buy.stripe.com/4gM3cxblJe8r1EQfQTeAg03", // $839/yr
  scale_monthly:   "https://buy.stripe.com/9B65kF1L93tN97i6gjeAg00", // $199/mo
  scale_annual:    "https://buy.stripe.com/eVqfZjblJ2pJabm48beAg01", // $1,690/yr
} as const;

export type PlanKey = keyof typeof PAYMENT_LINKS;
export const checkoutUrl = (k: PlanKey) => PAYMENT_LINKS[k];

