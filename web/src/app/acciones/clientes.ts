"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { exigirAdminCompleto } from "@/lib/admin";
import type { RespuestaGuardar } from "./admin";

/** Notas internas sobre el cliente (gustos, talla, cómo prefiere pagar…). */
export async function guardarNotasCliente(id: number, _previo: RespuestaGuardar, f: FormData): Promise<RespuestaGuardar> {
  try {
    await exigirAdminCompleto();
  } catch {
    return { ok: false, mensaje: "En la vista previa las notas no se guardan.", vez: Date.now() };
  }
  await db.update(schema.cliente).set({ notas: String(f.get("notas") ?? "").slice(0, 4000) }).where(eq(schema.cliente.id, id));
  revalidatePath(`/admin/clientes/${id}`);
  return { ok: true, mensaje: "Notas guardadas.", vez: Date.now() };
}
