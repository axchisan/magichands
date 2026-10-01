"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { ESTADOS_PEDIDO, type EstadoPedido } from "@/db/schema";
import { exigirAdmin } from "@/lib/admin";

const { pedido, pedidoEvento } = schema;

const entero = (v: FormDataEntryValue | null) => {
  const n = Number(String(v ?? "").replace(/\D/g, ""));
  return String(v ?? "").trim() === "" || !Number.isFinite(n) ? null : n;
};

/** Cambia el estado (queda en el historial que ve el cliente) y guarda los datos de la cotización. */
export async function actualizarPedido(codigo: string, f: FormData) {
  await exigirAdmin();
  const [actual] = await db.select().from(pedido).where(eq(pedido.codigo, codigo));
  if (!actual) throw new Error("Pedido no encontrado");

  const estado = String(f.get("estado") ?? actual.estado) as EstadoPedido;
  if (!ESTADOS_PEDIDO.includes(estado)) throw new Error("Estado no válido");
  const fechaEstimada = String(f.get("fechaEstimada") ?? "").trim();

  await db
    .update(pedido)
    .set({
      estado,
      total: entero(f.get("total")),
      anticipo: entero(f.get("anticipo")),
      fechaEstimada: /^\d{4}-\d{2}-\d{2}$/.test(fechaEstimada) ? fechaEstimada : null,
      notasInternas: String(f.get("notasInternas") ?? "").slice(0, 4000),
    })
    .where(eq(pedido.id, actual.id));

  if (estado !== actual.estado)
    await db.insert(pedidoEvento).values({ pedidoId: actual.id, estado, nota: String(f.get("nota") ?? "").slice(0, 500) });

  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${codigo}`);
}
