import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, getSql, Esito } from "@/lib/db";

export const dynamic = "force-dynamic";

const VALID_ESITI: Esito[] = ["verde", "giallo", "rosso", "no_risposta"];

export async function GET() {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM calls
    ORDER BY data_chiamata DESC, created_at DESC;
  `;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  const sql = getSql();
  const body = await req.json();

  const studio = (body.studio ?? "").trim();
  if (!studio) {
    return NextResponse.json(
      { error: "Il nome dello studio è obbligatorio." },
      { status: 400 }
    );
  }

  const esito: Esito = VALID_ESITI.includes(body.esito) ? body.esito : "no_risposta";
  const citta = body.citta?.trim() || null;
  const contatto = body.contatto?.trim() || null;
  const telefono = body.telefono?.trim() || null;
  const data_chiamata = body.data_chiamata || new Date().toISOString().slice(0, 10);
  const titolare_raggiunto = Boolean(body.titolare_raggiunto);
  const data_demo = body.data_demo || null;
  const richiamare_il = body.richiamare_il || null;
  const note = body.note?.trim() || null;

  const rows = await sql`
    INSERT INTO calls (
      studio, citta, contatto, telefono, data_chiamata,
      titolare_raggiunto, esito, data_demo, richiamare_il, note
    ) VALUES (
      ${studio}, ${citta}, ${contatto}, ${telefono}, ${data_chiamata},
      ${titolare_raggiunto}, ${esito}, ${data_demo}, ${richiamare_il}, ${note}
    )
    RETURNING *;
  `;

  return NextResponse.json(rows[0], { status: 201 });
}
