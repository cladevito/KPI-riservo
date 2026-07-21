"use client";

import { useState } from "react";
import { Call, Esito } from "@/lib/types";

export type CallFormValues = {
  studio: string;
  citta: string;
  contatto: string;
  telefono: string;
  data_chiamata: string;
  titolare_raggiunto: boolean;
  esito: Esito;
  data_demo: string;
  richiamare_il: string;
  note: string;
};

const today = () => new Date().toISOString().slice(0, 10);

function toValues(call?: Call): CallFormValues {
  if (!call) {
    return {
      studio: "",
      citta: "",
      contatto: "",
      telefono: "",
      data_chiamata: today(),
      titolare_raggiunto: false,
      esito: "no_risposta",
      data_demo: "",
      richiamare_il: "",
      note: "",
    };
  }
  return {
    studio: call.studio,
    citta: call.citta ?? "",
    contatto: call.contatto ?? "",
    telefono: call.telefono ?? "",
    data_chiamata: call.data_chiamata,
    titolare_raggiunto: call.titolare_raggiunto,
    esito: call.esito,
    data_demo: call.data_demo ?? "",
    richiamare_il: call.richiamare_il ?? "",
    note: call.note ?? "",
  };
}

const ESITO_OPTIONS: { value: Esito; label: string; hint: string }[] = [
  { value: "verde", label: "Verde", hint: "Dolore reale + demo fissata" },
  { value: "giallo", label: "Giallo", hint: "Interesse ma nessun impegno" },
  { value: "rosso", label: "Rosso", hint: "Nessun dolore, no grazie" },
  { value: "no_risposta", label: "Non risponde", hint: "Segretaria filtra o non risponde" },
];

const inputClass =
  "w-full rounded-lg border border-teal-100 bg-ivory px-3 py-2 text-sm text-ink placeholder:text-teal-600/40 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600";
const labelClass = "mb-1 block text-xs font-semibold text-teal-800";

export default function CallForm({
  call,
  onSubmit,
  onCancel,
  submitting,
}: {
  call?: Call;
  onSubmit: (values: CallFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}) {
  const [values, setValues] = useState<CallFormValues>(toValues(call));
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof CallFormValues>(key: K, val: CallFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.studio.trim()) {
      setError("Il nome dello studio è obbligatorio.");
      return;
    }
    setError(null);
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl2 border border-teal-900/10 bg-white p-5 shadow-card"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-medium text-teal-950">
          {call ? "Modifica chiamata" : "Registra nuova chiamata"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-teal-600 hover:text-teal-900"
        >
          Annulla
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Studio / azienda *</label>
          <input
            className={inputClass}
            value={values.studio}
            onChange={(e) => set("studio", e.target.value)}
            placeholder="Studio Legale Rossi"
            autoFocus
          />
        </div>

        <div>
          <label className={labelClass}>Città</label>
          <input
            className={inputClass}
            value={values.citta}
            onChange={(e) => set("citta", e.target.value)}
            placeholder="Milano"
          />
        </div>

        <div>
          <label className={labelClass}>Contatto (titolare)</label>
          <input
            className={inputClass}
            value={values.contatto}
            onChange={(e) => set("contatto", e.target.value)}
            placeholder="Avv. Rossi"
          />
        </div>

        <div>
          <label className={labelClass}>Telefono</label>
          <input
            className={inputClass}
            value={values.telefono}
            onChange={(e) => set("telefono", e.target.value)}
            placeholder="02 1234567"
          />
        </div>

        <div>
          <label className={labelClass}>Data chiamata</label>
          <input
            type="date"
            className={inputClass}
            value={values.data_chiamata}
            onChange={(e) => set("data_chiamata", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-teal-800">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-teal-300 text-teal-800 focus:ring-teal-600"
              checked={values.titolare_raggiunto}
              onChange={(e) => set("titolare_raggiunto", e.target.checked)}
            />
            Ho parlato con il titolare/decisore (non solo segreteria)
          </label>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Esito</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ESITO_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => set("esito", opt.value)}
                className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                  values.esito === opt.value
                    ? "border-teal-800 bg-teal-800 text-ivory"
                    : "border-teal-100 bg-ivory text-teal-800 hover:border-teal-300"
                }`}
              >
                <span className="block font-semibold">{opt.label}</span>
                <span
                  className={`mt-0.5 block text-[10px] leading-snug ${
                    values.esito === opt.value ? "text-ivory/80" : "text-teal-600/70"
                  }`}
                >
                  {opt.hint}
                </span>
              </button>
            ))}
          </div>
        </div>

        {values.esito === "verde" && (
          <div>
            <label className={labelClass}>Data demo fissata</label>
            <input
              type="date"
              className={inputClass}
              value={values.data_demo}
              onChange={(e) => set("data_demo", e.target.value)}
            />
          </div>
        )}

        {(values.esito === "giallo" || values.esito === "no_risposta") && (
          <div>
            <label className={labelClass}>Richiamare il</label>
            <input
              type="date"
              className={inputClass}
              value={values.richiamare_il}
              onChange={(e) => set("richiamare_il", e.target.value)}
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <label className={labelClass}>Note</label>
          <textarea
            className={inputClass}
            rows={3}
            value={values.note}
            onChange={(e) => set("note", e.target.value)}
            placeholder="Cosa ha detto, obiezioni, con chi parlare la prossima volta…"
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-gate-rosso">{error}</p>}

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-teal-100 px-4 py-2 text-sm font-medium text-teal-800 hover:bg-teal-50"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-ivory hover:bg-teal-900 disabled:opacity-60"
        >
          {submitting ? "Salvataggio…" : call ? "Salva modifiche" : "Registra chiamata"}
        </button>
      </div>
    </form>
  );
}
