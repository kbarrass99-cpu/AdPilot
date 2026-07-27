import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: { extend: { colors: { bg:"#0b1020", card:"#131a2e", muted:"#94a0c0", accent:"#6366f1", accent2:"#22d3ee", border:"#26314f" } } },
  plugins: [],
};
export default config;
