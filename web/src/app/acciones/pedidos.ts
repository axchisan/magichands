"use server";

import { after } from "next/server";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { esAdmin, sesionActual } from "@/lib/auth";
import { enviarCorreo } from "@/lib/correo";
import { nuevoCodigo } from "@/lib/whatsapp";
import { validarEncargo } from "@/lib/validacion";
import { buscarPedido as buscarEjemplo, type Pedido } from "@/lib/pedidos";

const { cliente, pedido, pedidoEvento, producto } = schema;

export type RespuestaEncargo =
  | { ok: true; codigo: string }
  | { ok: false; mensaje: string; errores?: Record<string, string> };

/** Guarda el encargo (cliente + pedido + primer evento) y devuelve su código. */
export async function crearEncargo(formulario: FormData): Promise<RespuestaEncargo> {
  // Campo trampa: los bots lo llenan, las personas no lo ven.
  if (String(formulario.get("sitio_web") ?? "")) return { ok: true, codigo: nuevoCodigo() };

  const v = validarEncargo(formulario);
  if (!v.ok) return { ok: false, mensaje: "Revisa los campos marcados.", errores: v.errores };
  const d = v.datos;
  const sesion = await sesionActual();

  // Límite sencillo contra abusos: máximo 5 encargos por celular en una hora.
  const recientes = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(pedido)
    .innerJoin(cliente, eq(pedido.clienteId, cliente.id))
    .where(and(eq(cliente.whatsapp, d.telefono), gt(pedido.creado, sql`now() - interval '1 hour'`)));
  if ((recientes[0]?.n ?? 0) >= 5)
    return { ok: false, mensaje: "Ya recibimos varios encargos de este celular en la última hora. Escríbenos por WhatsApp." };

  const [cli] = await db
    .insert(cliente)
    .values({ nombre: d.nombre, whatsapp: d.telefono, ciudad: d.ciudad, userId: sesion?.user.id ?? null })
    .onConflictDoUpdate({
      target: cliente.whatsapp,
      set: { nombre: d.nombre, ciudad: d.ciudad, ...(sesion ? { userId: sesion.user.id } : {}) },
    })
    .returning({ id: cliente.id });

  const prod = d.producto
    ? (await db.select({ id: producto.id, nombre: producto.nombre }).from(producto).where(eq(producto.slug, d.producto)))[0]
    : undefined;

  // Código único: se reintenta en el improbable caso de choque.
  let codigo = "";
  let pedidoId = 0;
  for (let intento = 0; intento < 5 && !pedidoId; intento++) {
    codigo = nuevoCodigo();
    const filas = await db
      .insert(pedido)
      .values({
        codigo,
        clienteId: cli.id,
        productoId: prod?.id ?? null,
        detalle: { producto: prod?.nombre ?? null, detalle: d.detalle, colores: d.colores, tamano: d.tamano },
        urgente: d.urgente,
        fechaDeseada: d.fecha || null,
      })
      .onConflictDoNothing({ target: pedido.codigo })
      .returning({ id: pedido.id });
    pedidoId = filas[0]?.id ?? 0;
  }
  if (!pedidoId) return { ok: false, mensaje: "No pudimos guardar el encargo. Inténtalo de nuevo." };
  await db.insert(pedidoEvento).values({ pedidoId, estado: "solicitud" });

  // Aviso a los administradores, sin hacer esperar al cliente.
  after(async () => {
    const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);
    const texto = [
      `Nuevo encargo ${codigo}`,
      `Producto: ${prod?.nombre ?? "Otro diseño"}`,
      `Cliente: ${d.nombre} (${d.ciudad}) · WhatsApp ${d.telefono}`,
      `Idea: ${d.detalle}`,
      d.urgente ? "Urgente" : "",
    ].filter(Boolean).join("\n");
    await Promise.allSettled(
      admins.map((para) =>
        enviarCorreo({ para, asunto: `Nuevo encargo ${codigo}: ${prod?.nombre ?? "Otro diseño"}`, texto, html: `<pre style="font:15px/1.5 Arial,sans-serif;white-space:pre-wrap">${texto.replace(/[&<>]/g, (c) => `&#${c.charCodeAt(0)};`)}</pre>` }),
      ),
    );
  });

  return { ok: true, codigo };
}

export type RespuestaBusqueda = { ok: true; pedido: Pedido } | { ok: false; motivo: "no-existe" | "telefono" };

/** Seguimiento: código + últimos 4 dígitos del celular. Incluye los pedidos de ejemplo de la demo. */
export async function buscarPedido(codigoCrudo: string, ultimos4: string): Promise<RespuestaBusqueda> {
  const codigo = codigoCrudo.trim().toUpperCase().replace(/^MH4(?!-)/, "MH4-");
  const filas = await db
    .select({ id: pedido.id, codigo: pedido.codigo, estado: pedido.estado, creado: pedido.creado, fechaEstimada: pedido.fechaEstimada, detalle: pedido.detalle, whatsapp: cliente.whatsapp })
    .from(pedido)
    .innerJoin(cliente, eq(pedido.clienteId, cliente.id))
    .where(eq(pedido.codigo, codigo));
  const p = filas[0];
  if (!p) return buscarEjemplo(codigo, ultimos4, []);
  if (p.whatsapp.slice(-4) !== ultimos4.trim()) return { ok: false, motivo: "telefono" };
  return { ok: true, pedido: await aPedido(p) };
}

/** Pedidos de la persona con sesión iniciada (para /mi-cuenta). */
export async function misPedidos(): Promise<Pedido[]> {
  const sesion = await sesionActual();
  if (!sesion) return [];
  const filas = await db
    .select({ id: pedido.id, codigo: pedido.codigo, estado: pedido.estado, creado: pedido.creado, fechaEstimada: pedido.fechaEstimada, detalle: pedido.detalle, whatsapp: cliente.whatsapp })
    .from(pedido)
    .innerJoin(cliente, eq(pedido.clienteId, cliente.id))
    .where(eq(cliente.userId, sesion.user.id))
    .orderBy(desc(pedido.creado));
  return Promise.all(filas.map(aPedido));
}

export async function soyAdmin(): Promise<boolean> {
  const s = await sesionActual();
  return esAdmin(s?.user.email);
}

async function aPedido(p: {
  id: number;
  codigo: string;
  estado: string;
  creado: Date;
  fechaEstimada: string | null;
  detalle: unknown;
  whatsapp: string;
}): Promise<Pedido> {
  const eventos = await db
    .select({ estado: pedidoEvento.estado, creado: pedidoEvento.creado })
    .from(pedidoEvento)
    .where(eq(pedidoEvento.pedidoId, p.id))
    .orderBy(pedidoEvento.creado);
  const fecha = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
  const det = p.detalle as { producto?: string | null };
  return {
    codigo: p.codigo,
    producto: det.producto ?? "Diseño personalizado",
    telefonoFinal: p.whatsapp.slice(-4),
    estado: p.estado as Pedido["estado"],
    creado: fecha(p.creado),
    fechaEstimada: p.fechaEstimada ?? undefined,
    historial: eventos.map((e) => ({ estado: e.estado as Pedido["estado"], fecha: fecha(e.creado) })),
  };
}
