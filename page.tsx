"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Call } from "@/lib/types";
import { computeStats, weeklySeries } from "@/lib/stats";
import GateProgress from "@/components/GateProgress";
import KpiCards from "@/components/KpiCards";
import WeeklyChart from "@/components/WeeklyChart";
import CallForm, { CallFormValues } from "@/components/CallForm";
import CallsTable from "@/components/CallsTable";

export default function Home() {
  const [calls, setCalls] = useState<Call[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Call | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/calls", { cache: "no-store" });
      if (!res.ok) throw new Error("Errore nel caricamento delle chiamate.");
      const data: Call[] = await res.json();
      setCalls(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore sconosciuto.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (call: Call) => {
    setEditing(call);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(undefined);
  };

  const cleanPayload = (values: CallFormValues) => ({
    studio: values.studio,
    citta: values.citta || null,
    contatto: values.contatto || null,
    telefono: values.telefono || null,
    data_chiamata: values.data_chiamata,
    titolare_raggiunto: values.titolare_raggiunto,
    esito: values.esito,
    data_demo: values.esito === "verde" ? values.data_demo || null : null,
    richiamare_il: values.richiamare_il || null,
    note: values.note || null,
  });

  const handleSubmit = async (values: CallFormValues) => {
    setSubmitting(true);
    try {
      const payload = cleanPayload(values);
      const res = await fetch(editing ? `/api/calls/${editing.id}` : "/api/calls", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Errore nel salvataggio.");
      }
      await load();
      closeForm();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore sconosciuto.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (call: Call) => {
    if (!confirm(`Eliminare la chiamata a "${call.studio}"? Non si può annullare.`)) return;
    try {
      const res = await fetch(`/api/calls/${call.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Errore nell'eliminazione.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore sconosciuto.");
    }
  };

  const stats = computeStats(calls ?? []);
  const chartData = weeklySeries(calls ?? []);

  return (
    <main className="min-h-screen bg-ivory pb-16">
      <header className="border-b border-teal-900/10 bg-ivory/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Image src="/riservo-mark.png" alt="Riservo" width={30} height={30} priority />
            <div>
              <p className="font-display text-base font-medium leading-tight text-teal-950">
                Riservo
              </p>
              <p className="text-[11px] leading-tight text-teal-600/80">KPI vendita — Gate A</p>
            </div>
          </div>
          <button
            onClick={openNew}
            className="rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-ivory shadow-card transition-colors hover:bg-teal-900"
          >
            + Nuova chiamata
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        {error && (
          <div className="mb-4 rounded-lg border border-gate-rosso/30 bg-gate-rosso-bg px-4 py-2.5 text-sm text-gate-rosso">
            {error}
          </div>
        )}

        {calls === null ? (
          <p className="py-16 text-center text-sm text-teal-600/70">Caricamento…</p>
        ) : (
          <div className="flex flex-col gap-5">
            <GateProgress
              chiamate={stats.totale}
              titolari={stats.titolari}
              verdi={stats.verdi}
            />

            <KpiCards
              totale={stats.totale}
              pctVerde={stats.pctVerde}
              demoFissate={stats.demoFissate}
              daRichiamare={stats.daRichiamare}
            />

            <WeeklyChart data={chartData} />

            {formOpen && (
              <CallForm
                call={editing}
                onSubmit={handleSubmit}
                onCancel={closeForm}
                submitting={submitting}
              />
            )}

            <CallsTable calls={calls} onEdit={openEdit} onDelete={handleDelete} />
          </div>
        )}
      </div>
    </main>
  );
}
