type Stage = {
  label: string;
  value: number;
  target: number;
  hint: string;
};

function StageCard({ stage }: { stage: Stage }) {
  const pct = Math.min(100, Math.round((stage.value / stage.target) * 100));
  const met = stage.value >= stage.target;
  return (
    <div className="relative flex-1 rounded-xl2 border border-teal-100 bg-white/70 p-4 shadow-card">
      <div className="flex items-baseline justify-between">
        <p className="font-body text-xs font-semibold uppercase tracking-wide text-teal-600">
          {stage.label}
        </p>
        {met && (
          <span className="rounded-full bg-gate-verde-bg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gate-verde">
            Raggiunto
          </span>
        )}
      </div>
      <p className="mt-1 font-display text-3xl font-medium tabular text-teal-950">
        {stage.value}
        <span className="text-lg text-teal-300"> / {stage.target}</span>
      </p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-teal-50">
        <div
          className="h-full rounded-full bg-teal-800 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] leading-snug text-teal-600/80">{stage.hint}</p>
    </div>
  );
}

export default function GateProgress({
  chiamate,
  titolari,
  verdi,
}: {
  chiamate: number;
  titolari: number;
  verdi: number;
}) {
  const stages: Stage[] = [
    {
      label: "Chiamate fatte",
      value: chiamate,
      target: 20,
      hint: "Obiettivo del round: 15–20 chiamate",
    },
    {
      label: "Titolari raggiunti",
      value: titolari,
      target: 6,
      hint: "Persone giuste al telefono, non segreteria",
    },
    {
      label: "Verdi (demo fissata)",
      value: verdi,
      target: 2,
      hint: "Bastano 1–2 per passare il gate",
    },
  ];

  const passed = verdi >= 1;

  return (
    <div className="rounded-xl2 border border-teal-900/10 bg-teal-50/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-medium text-teal-950">
          Gate A — verso il pilota
        </h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            passed
              ? "bg-gate-verde-bg text-gate-verde"
              : "bg-white text-teal-600 border border-teal-100"
          }`}
        >
          {passed ? "Gate superata → si punta alla demo" : "Round in corso"}
        </span>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        {stages.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-stretch gap-3">
            <StageCard stage={s} />
            {i < stages.length - 1 && (
              <div className="hidden select-none items-center text-2xl text-teal-300 sm:flex">
                →
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
