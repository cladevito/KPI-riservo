export type Esito = "verde" | "giallo" | "rosso" | "no_risposta";

export type Call = {
  id: number;
  studio: string;
  citta: string | null;
  contatto: string | null;
  telefono: string | null;
  data_chiamata: string; // ISO date (yyyy-mm-dd)
  titolare_raggiunto: boolean;
  esito: Esito;
  data_demo: string | null;
  richiamare_il: string | null;
  note: string | null;
  created_at: string;
};

export const ESITO_LABELS: Record<Esito, string> = {
  verde: "Verde",
  giallo: "Giallo",
  rosso: "Rosso",
  no_risposta: "Non risponde",
};
