import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
export const metadata = { title: "AdPilot — 10 TikTok ad variants in 30 seconds", description: "Paste a product URL. Get 10 TikTok-ready ad scripts." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en"><body className="min-h-screen bg-[#0b1020] text-[#e6eaf5] antialiased">{children}</body></html>
    </ClerkProvider>
  );
}
