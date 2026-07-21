import { neon, NeonQueryFunction } from "@neondatabase/serverless";

export type { Esito, Call } from "./types";

// DATABASE_URL is injected automatically by Vercel once a Neon/Postgres
// database is connected to the project under the Storage tab. The client
// is created lazily so that `next build` doesn't fail before that's set.
let _sql: NeonQueryFunction<false, false> | null = null;
export function getSql() {
  if (!_sql) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!url) {
      throw new Error(
        "Nessun database collegato. Aggiungi uno Storage Postgres al progetto Vercel (vedi README)."
      );
    }
    _sql = neon(url);
  }
  return _sql;
}

let schemaReady: Promise<void> | null = null;

/**
 * Creates the calls table if it doesn't exist yet. Safe to call on every
 * request — it's a cheap IF NOT EXISTS check and only runs once per
 * cold start thanks to the cached promise.
 */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    const sql = getSql();
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS calls (
        id SERIAL PRIMARY KEY,
        studio TEXT NOT NULL,
        citta TEXT,
        contatto TEXT,
        telefono TEXT,
        data_chiamata DATE NOT NULL DEFAULT CURRENT_DATE,
        titolare_raggiunto BOOLEAN NOT NULL DEFAULT FALSE,
        esito TEXT NOT NULL DEFAULT 'no_risposta',
        data_demo DATE,
        richiamare_il DATE,
        note TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `.then(() => undefined);
  }
  return schemaReady;
}
