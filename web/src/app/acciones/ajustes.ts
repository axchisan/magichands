"use server";

import { db, schema } from "@/db";
import { exigirAdminCompleto } from "@/lib/admin";
import { revalidarAjustes } from "@/lib/revalidar";
import type { RespuestaGuardar } from "./admin";

const vez = () => Date.now();

/** Agenda abierta/cerrada (con su aviso) y mostrar precios en la web. */
export async function guardarAjustes(_previo: RespuestaGuardar, f: FormData): Promise<RespuestaGuardar> {
  try {
    await exigirAdminCompleto();
  } catch {
    return { ok: false, mensaje: "En la vista previa los ajustes no se guardan.", vez: vez() };
  }
  const mensaje = String(f.get("mensajeAgenda") ?? "").trim().slice(0, 200);
  const abierta = f.get("agendaAbierta") === "si";
  if (!abierta && !mensaje) return { ok: false, mensaje: "Escribe el aviso que verán tus clientes con la agenda cerrada.", vez: vez() };
  const valores = [
    { clave: "agenda", valor: { abierta, mensaje } },
    { clave: "mostrarPrecios", valor: f.get("mostrarPrecios") === "si" },
  ];
  for (const v of valores)
    await db
      .insert(schema.ajustes)
      .values(v)
      .onConflictDoUpdate({ target: schema.ajustes.clave, set: { valor: v.valor, actualizado: new Date() } });
  revalidarAjustes();
  return { ok: true, mensaje: "Ajustes guardados. La web ya los muestra.", vez: vez() };
}
