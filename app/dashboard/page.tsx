export default function Dashboard() {
  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">AdPilot dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <Card label="Variants generated" value="240" />
        <Card label="Avg hook score" value="7.4 / 10" accent />
        <Card label="Top style" value="UGC unboxing" />
      </div>
    </main>
  );
}

function Card({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? "border-accent2" : "border-zinc-700"}`}>
      <div className="text-sm text-zinc-400">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${accent ? "text-accent2" : ""}`}>{value}</div>
    </div>
  );
}
