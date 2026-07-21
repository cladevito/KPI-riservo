type Metric = {
  label: string;
  value: string | number;
  sub?: string;
  tone?: "default" | "verde" | "warn";
};

function Card({ metric }: { metric: Metric }) {
  const toneClass =
    metric.tone === "verde"
      ? "text-gate-verde"
      : metric.tone === "warn"
      ? "text-gate-giallo"
      : "text-teal-950";
  return (
    <div className="flex-1 rounded-xl2 border border-teal-900/10 bg-white p-4 shadow-card">
      <p className="font-body text-xs font-medium uppercase tracking-wide text-teal-600/80">
        {metric.label}
      </p>
      <p className={`mt-1.5 font-display text-2xl font-medium tabular ${toneClass}`}>
        {metric.value}
      </p>
      {metric.sub && <p className="mt-1 text-[11px] text-teal-600/70">{metric.sub}</p>}
    </div>
  );
}

export default function KpiCards({
  totale,
  pctVerde,
  demoFissate,
  daRichiamare,
}: {
  totale: number;
  pctVerde: number;
  demoFissate: number;
  daRichiamare: number;
}) {
  const metrics: Metric[] = [
    { label: "Chiamate totali", value: totale, sub: "da sempre" },
    { label: "Tasso Verde", value: `${pctVerde}%`, sub: "sul totale chiamate", tone: "verde" },
    { label: "Demo in calendario", value: demoFissate, sub: "future, esito Verde" },
    {
      label: "Da richiamare",
      value: daRichiamare,
      sub: "oggi o scadute",
      tone: daRichiamare > 0 ? "warn" : "default",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {metrics.map((m) => (
        <Card key={m.label} metric={m} />
      ))}
    </div>
  );
}
