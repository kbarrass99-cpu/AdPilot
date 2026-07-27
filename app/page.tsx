import Link from "next/link";
export default function Home() {
  return (
    <main className="max-w-2xl mx-auto p-12 text-center">
      <h1 className="text-4xl font-bold mb-4">AdPilot</h1>
      <p className="text-muted mb-8">Paste a product URL. Get 10 TikTok-ready ad scripts in 30 seconds.</p>
      <Link href="/dashboard" className="inline-block bg-accent text-white px-6 py-3 rounded-lg font-semibold">Open dashboard</Link>
    </main>
  );
}
