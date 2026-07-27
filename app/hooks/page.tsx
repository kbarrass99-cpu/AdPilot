"use client";
import { useState } from "react";

export default function HookGenerator() {
  const [desc, setDesc] = useState("");
  const [hooks, setHooks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  async function gen(e: React.FormEvent) {
    e.preventDefault();
    if (desc.trim().length < 5) {
      setError("Describe your product in at least 5 characters.");
      return;
    }
    setLoading(true);
    setError("");
    setHooks([]);
    try {
      const r = await fetch("/api/hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: desc }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Generation failed.");
      setHooks(j.hooks);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Generation failed.");
    }
    setLoading(false);
  }

  function copy(i: number, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 mb-4 rounded-full border border-zinc-700 text-zinc-400 text-xs">
          🎬 Free · No signup
        </span>
        <h1 className="text-4xl font-bold mb-3">
          Free <span className="text-accent2">TikTok Hook</span> Generator
        </h1>
        <p className="text-muted">
          Describe your product. Get 5 scroll-stopping TikTok ad hooks in seconds — free, no account needed.
        </p>
      </div>

      <form onSubmit={gen} className="space-y-4">
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="e.g. A self-cleaning water bottle that uses UV-C light to kill 99% of bacteria in 60 seconds. $39, ships worldwide."
          rows={4}
          maxLength={500}
          className="w-full p-4 rounded-xl border border-zinc-700 bg-card text-text placeholder-zinc-500 focus:outline-none focus:border-accent resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">{desc.length}/500</span>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-accent text-white font-semibold disabled:opacity-50 hover:opacity-90 transition"
          >
            {loading ? "Generating…" : "Generate 5 hooks"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-sm">
          {error}
        </div>
      )}

      {hooks.length > 0 && (
        <div className="mt-8 space-y-3">
          <h2 className="text-sm uppercase tracking-wider text-zinc-500 mb-2">Your 5 hooks</h2>
          {hooks.map((h, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-4 p-4 rounded-xl border border-zinc-700 bg-card"
            >
              <p className="text-text">
                <span className="text-accent2 font-bold mr-2">{i + 1}.</span>
                {h}
              </p>
              <button
                onClick={() => copy(i, h)}
                className="shrink-0 text-xs px-3 py-1.5 rounded-md border border-zinc-700 text-zinc-300 hover:border-accent hover:text-accent transition"
              >
                {copied === i ? "✓ Copied" : "Copy"}
              </button>
            </div>
          ))}

          <div className="mt-8 p-6 rounded-xl border border-accent bg-card text-center">
            <h3 className="text-lg font-bold mb-1">Want 10 full ad scripts, not just hooks?</h3>
            <p className="text-muted text-sm mb-4">
              AdPilot turns your product URL into 10 TikTok-ready ad variants — hook + 15s script + caption + hashtags, scored for virality.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition"
            >
              Try AdPilot →
            </a>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-zinc-600 mt-10">
        Free TikTok Hook Generator · an AdPilot wedge · 5 generations/hour
      </p>
    </main>
  );
}
