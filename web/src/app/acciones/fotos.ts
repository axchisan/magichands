"use server";

import { and, eq, max } from "drizzle-orm";
import { del } from "@vercel/blob";
import { db, schema } from "@/db";
import { exigirAdminCompleto } from "@/lib/admin";
import { archivosDeFoto, esClaveDeBlob } from "@/lib/fotos";
import { revalidarCatalogo } from "@/lib/revalidar";

const { foto, producto } = schema;
type Resultado = { ok: true } | { ok: false; mensaje: string };

async function permiso(): Promise<Resultado | null> {
  try {
    await exigirAdminCompleto();
    return null;
  } catch {
    return { ok: false, mensaje: "En la vista previa las fotos no se guardan." };
  }
}

async function productoId(slug: string) {
  return (await db.select({ id: producto.id, nombre: producto.nombre }).from(producto).where(eq(producto.slug, slug)))[0];
}

/** Registra una foto ya subida a Blob (al final de la galería). */
export async function registrarFoto(slug: string, clave: string, ancho: number, alto: number): Promise<Resultado> {
  const sin = await permiso();
  if (sin) return sin;
  const p = await productoId(slug);
  if (!p) return { ok: false, mensaje: "No encontramos el producto." };
  if (!esClaveDeBlob(clave, slug) || !(ancho > 0 && alto > 0)) return { ok: false, mensaje: "Foto no válida." };
  const [{ ultimo }] = await db.select({ ultimo: max(foto.orden) }).from(foto).where(eq(foto.productoId, p.id));
  await db.insert(foto).values({
    productoId: p.id,
    clave,
    origen: "blob",
    alt: p.nombre,
    ancho: Math.round(ancho),
    alto: Math.round(alto),
    orden: (ultimo ?? -1) + 1,
  });
  revalidarCatalogo();
  return { ok: true };
}

/** Borra una foto (y sus archivos si se subieron desde el panel). */
export async function borrarFoto(slug: string, id: number): Promise<Resultado> {
  const sin = await permiso();
  if (sin) return sin;
  const p = await productoId(slug);
  if (!p) return { ok: false, mensaje: "No encontramos el producto." };
  const [f] = await db.delete(foto).where(and(eq(foto.id, id), eq(foto.productoId, p.id))).returning();
  if (f?.origen === "blob") await del(archivosDeFoto(f.clave)).catch(() => undefined);
  revalidarCatalogo();
  return { ok: true };
}

/** Cambia el orden de las fotos (la primera es la portada). */
export async function ordenarFotos(slug: string, ids: number[]): Promise<Resultado> {
  const sin = await permiso();
  if (sin) return sin;
  const p = await productoId(slug);
  if (!p) return { ok: false, mensaje: "No encontramos el producto." };
  for (const [i, id] of ids.entries()) await db.update(foto).set({ orden: i }).where(and(eq(foto.id, id), eq(foto.productoId, p.id)));
  revalidarCatalogo();
  return { ok: true };
}
