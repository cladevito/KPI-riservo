"use client";

import { useMemo, useState } from "react";
import { Call, Esito } from "@/lib/types";
import StatusBadge from "./StatusBadge";

const FILTERS: { value: Esito | "tutti" | "da_richiamare"; label: string }[] = [
  { value: "tutti", label: "Tutte" },
  { value: "verde", label: "Verde" },
  { value: "giallo", label: "Giallo" },
  { value: "rosso", label: "Rosso" },
  { value: "no_risposta", label: "Non risponde" },
  { value: "da_richiamare", label: "Da richiamare" },
];

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export default function CallsTable({
  calls,
  onEdit,
  onDelete,
}: {
  calls: Call[];
  onEdit: (call: Call) => void;
  onDelete: (call: Call) => void;
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("tutti");
  const [query, setQuery] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  const filtered = useMemo(() => {
    let list = calls;
    if (filter === "da_richiamare") {
      list = list.filter((c) => c.richiamare_il && c.richiamare_il <= today);
    } else if (filter !== "tutti") {
      list = list.filter((c) => c.esito === filter);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.studio.toLowerCase().includes(q) ||
          (c.citta ?? "").toLowerCase().includes(q) ||
          (c.contatto ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [calls, filter, query, today]);

  return (
    <div className="rounded-xl2 border border-teal-900/10 bg-white shadow-card">
      <div className="flex flex-col gap-3 border-b border-teal-900/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                filter === f.value
                  ? "bg-teal-800 text-ivory"
                  : "bg-teal-50 text-teal-800 hover:bg-teal-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca studio, città, contatto…"
          className="w-full rounded-lg border border-teal-100 bg-ivory px-3 py-1.5 text-sm placeholder:text-teal-600/40 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 sm:w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-teal-900/10 text-xs uppercase tracking-wide text-teal-600/80">
              <th className="px-4 py-2.5 font-medium">Studio</th>
              <th className="px-4 py-2.5 font-medium">Città</th>
              <th className="px-4 py-2.5 font-medium">Contatto</th>
              <th className="px-4 py-2.5 font-medium">Chiamata</th>
              <th className="px-4 py-2.5 font-medium">Esito</th>
              <th className="px-4 py-2.5 font-medium">Demo</th>
              <th className="px-4 py-2.5 font-medium">Richiamare</th>
              <th className="px-4 py-2.5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-teal-600/60">
                  Nessuna chiamata in questa vista.
                </td>
              </tr>
            )}
            {filtered.map((c) => {
              const overdue = c.richiamare_il && c.richiamare_il <= today;
              return (
                <tr
                  key={c.id}
                  className="border-b border-teal-900/5 last:border-0 hover:bg-ivory-dim/60"
                >
                  <td className="px-4 py-2.5 font-medium text-teal-950">{c.studio}</td>
                  <td className="px-4 py-2.5 text-teal-800">{c.citta ?? "—"}</td>
                  <td className="px-4 py-2.5 text-teal-800">{c.contatto ?? "—"}</td>
                  <td className="px-4 py-2.5 tabular text-teal-800">
                    {formatDate(c.data_chiamata)}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge esito={c.esito} />
                  </td>
                  <td className="px-4 py-2.5 tabular text-teal-800">{formatDate(c.data_demo)}</td>
                  <td className="px-4 py-2.5 tabular">
                    <span className={overdue ? "font-semibold text-gate-rosso" : "text-teal-800"}>
                      {formatDate(c.richiamare_il)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex justify-end gap-3 text-xs font-medium">
                      <button
                        onClick={() => onEdit(c)}
                        className="text-teal-700 hover:text-teal-950"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => onDelete(c)}
                        className="text-gate-rosso/80 hover:text-gate-rosso"
                      >
                        Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
