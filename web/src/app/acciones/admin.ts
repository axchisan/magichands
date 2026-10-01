"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { ESTADOS_PEDIDO, type EstadoPedido } from "@/db/schema";
import { exigirAdmin } from "@/lib/admin";
import { enviarCorreo } from "@/lib/correo";
import { correoCambioEstado } from "@/lib/correos/pedido";

const { pedido, pedidoEvento, cliente, user } = schema;

const entero = (v: FormDataEntryValue | null) => {
  const n = Number(String(v ?? "").replace(/\D/g, ""));
  return String(v ?? "").trim() === "" || !Number.isFinite(n) ? null : n;
};

export type RespuestaGuardar = { ok: boolean; mensaje: string; vez: number } | null;

/** Cambia el estado (queda en el historial que ve el cliente) y guarda los datos de la cotización.
 *  Si el cliente tiene cuenta, le avisa por correo del nuevo estado. */
export async function actualizarPedido(codigo: string, _previo: RespuestaGuardar, f: FormData): Promise<RespuestaGuardar> {
  try {
    await exigirAdmin();
  } catch {
    return { ok: false, mensaje: "No tienes permiso para cambiar pedidos.", vez: Date.now() };
  }
  const [actual] = await db
    .select({ pedido, correo: user.email, nombre: cliente.nombre })
    .from(pedido)
    .innerJoin(cliente, eq(pedido.clienteId, cliente.id))
    .leftJoin(user, eq(cliente.userId, user.id))
    .where(eq(pedido.codigo, codigo));
  if (!actual) return { ok: false, mensaje: "No encontramos el pedido.", vez: Date.now() };

  const estado = String(f.get("estado") ?? actual.pedido.estado) as EstadoPedido;
  if (!ESTADOS_PEDIDO.includes(estado)) return { ok: false, mensaje: "Estado no válido.", vez: Date.now() };
  const fechaEstimada = String(f.get("fechaEstimada") ?? "").trim();
  const fechaValida = /^\d{4}-\d{2}-\d{2}$/.test(fechaEstimada) ? fechaEstimada : null;

  await db
    .update(pedido)
    .set({
      estado,
      total: entero(f.get("total")),
      anticipo: entero(f.get("anticipo")),
      fechaEstimada: fechaValida,
      notasInternas: String(f.get("notasInternas") ?? "").slice(0, 4000),
    })
    .where(eq(pedido.id, actual.pedido.id));

  const cambio = estado !== actual.pedido.estado;
  if (cambio) {
    await db.insert(pedidoEvento).values({ pedidoId: actual.pedido.id, estado, nota: String(f.get("nota") ?? "").slice(0, 500) });
    const para = actual.correo;
    if (para) {
      const detalle = actual.pedido.detalle as { producto?: string | null };
      after(async () => {
        try {
          await enviarCorreo({
            para,
            ...correoCambioEstado({ codigo, nombre: actual.nombre, producto: detalle.producto, estado, fechaEstimada: fechaValida }),
          });
        } catch (e) {
          console.error(`[correo] cambio de estado ${codigo}:`, e);
        }
      });
    }
  }

  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${codigo}`);
  revalidatePath("/mi-cuenta");
  return {
    ok: true,
    mensaje: cambio && actual.correo ? "Cambios guardados. Le avisamos al cliente por correo." : "Cambios guardados.",
    vez: Date.now(),
  };
}
