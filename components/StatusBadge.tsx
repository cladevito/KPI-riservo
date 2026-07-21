import { Esito, ESITO_LABELS } from "@/lib/types";

const STYLES: Record<Esito, string> = {
  verde: "bg-gate-verde-bg text-gate-verde",
  giallo: "bg-gate-giallo-bg text-gate-giallo",
  rosso: "bg-gate-rosso-bg text-gate-rosso",
  no_risposta: "bg-gate-neutro-bg text-gate-neutro",
};

export default function StatusBadge({ esito }: { esito: Esito }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[esito]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {ESITO_LABELS[esito]}
    </span>
  );
}
