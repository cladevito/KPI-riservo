import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, getSql, Esito } from "@/lib/db";

export const dynamic = "force-dynamic";

const VALID_ESITI: Esito[] = ["verde", "giallo", "rosso", "no_risposta"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await ensureSchema();
  const sql = getSql();
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "ID non valido." }, { status: 400 });
  }

  const body = await req.json();
  const esito: Esito | undefined = VALID_ESITI.includes(body.esito) ? body.esito : undefined;

  const rows = await sql`
    UPDATE calls SET
      studio = COALESCE(${body.studio ?? null}, studio),
      citta = ${body.citta ?? null},
      contatto = ${body.contatto ?? null},
      telefono = ${body.telefono ?? null},
      data_chiamata = COALESCE(${body.data_chiamata ?? null}, data_chiamata),
      titolare_raggiunto = COALESCE(${body.titolare_raggiunto ?? null}, titolare_raggiunto),
      esito = COALESCE(${esito ?? null}, esito),
      data_demo = ${body.data_demo ?? null},
      richiamare_il = ${body.richiamare_il ?? null},
      note = ${body.note ?? null}
    WHERE id = ${id}
    RETURNING *;
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Chiamata non trovata." }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await ensureSchema();
  const sql = getSql();
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "ID non valido." }, { status: 400 });
  }

  await sql`DELETE FROM calls WHERE id = ${id};`;
  return NextResponse.json({ ok: true });
}
