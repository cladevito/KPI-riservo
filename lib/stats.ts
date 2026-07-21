import { Call } from "./types";

export function computeStats(calls: Call[]) {
  const totale = calls.length;
  const titolari = calls.filter((c) => c.titolare_raggiunto).length;
  const verdi = calls.filter((c) => c.esito === "verde").length;
  const gialli = calls.filter((c) => c.esito === "giallo").length;
  const rossi = calls.filter((c) => c.esito === "rosso").length;
  const noRisposta = calls.filter((c) => c.esito === "no_risposta").length;

  const today = new Date().toISOString().slice(0, 10);

  const demoFissate = calls.filter(
    (c) => c.esito === "verde" && c.data_demo && c.data_demo >= today
  ).length;

  const daRichiamare = calls.filter(
    (c) => c.richiamare_il && c.richiamare_il <= today
  ).length;

  const pct = (n: number) => (totale === 0 ? 0 : Math.round((n / totale) * 100));

  return {
    totale,
    titolari,
    verdi,
    gialli,
    rossi,
    noRisposta,
    demoFissate,
    daRichiamare,
    pctVerde: pct(verdi),
    pctGiallo: pct(gialli),
    pctRosso: pct(rossi),
  };
}

export function weeklySeries(calls: Call[]) {
  // Group by ISO week (Mon-Sun), last 8 weeks including current.
  const weekKey = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    const day = (d.getDay() + 6) % 7; // Mon=0
    const monday = new Date(d);
    monday.setDate(d.getDate() - day);
    return monday.toISOString().slice(0, 10);
  };

  const counts = new Map<string, number>();
  for (const c of calls) {
    const key = weekKey(c.data_chiamata);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const sortedWeeks = Array.from(counts.keys()).sort();
  const last8 = sortedWeeks.slice(-8);

  return last8.map((week) => {
    const d = new Date(week + "T00:00:00");
    const label = d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" });
    return { settimana: label, chiamate: counts.get(week) ?? 0 };
  });
}
