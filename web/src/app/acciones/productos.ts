"use server";

import { redirect } from "next/navigation";
import { eq, like, max } from "drizzle-orm";
import { db, schema } from "@/db";
import { exigirAdminCompleto } from "@/lib/admin";
import { ocasiones } from "@/lib/catalogo";
import { revalidarCatalogo } from "@/lib/revalidar";
import { aSlug, validarProducto } from "@/lib/validacion";
import type { RespuestaGuardar } from "./admin";

const { producto, categoria } = schema;
const vez = () => Date.now();

/** Crea (slugOriginal = null) o edita un producto. Al crear, lleva al editor para subir las fotos. */
export async function guardarProducto(slugOriginal: string | null, _previo: RespuestaGuardar, f: FormData): Promise<RespuestaGuardar> {
  try {
    await exigirAdminCompleto();
  } catch {
    return { ok: false, mensaje: "En la vista previa los cambios del catálogo no se guardan.", vez: vez() };
  }
  const cats = await db.select({ id: categoria.id, slug: categoria.slug }).from(categoria);
  const v = validarProducto(f, { categorias: cats.map((c) => c.slug), ocasiones: ocasiones.map((o) => o.slug) });
  if (!v.ok) return { ok: false, mensaje: Object.values(v.errores).join(" "), vez: vez() };
  const d = v.datos;
  const valores = {
    nombre: d.nombre,
    categoriaId: cats.find((c) => c.slug === d.categoria)!.id,
    descripcion: d.descripcion,
    personalizacion: d.personalizacion,
    tamano: d.tamano,
    plazo: d.plazo,
    ocasiones: d.ocasiones,
    precioConfirmado: d.precio,
    destacado: d.destacado,
    activo: d.activo,
    actualizado: new Date(),
  };

  if (slugOriginal) {
    const filas = await db.update(producto).set(valores).where(eq(producto.slug, slugOriginal)).returning({ id: producto.id });
    if (!filas.length) return { ok: false, mensaje: "No encontramos el producto.", vez: vez() };
    revalidarCatalogo();
    return { ok: true, mensaje: d.activo ? "Producto guardado. Ya se ve así en la web." : "Producto guardado (oculto en la web).", vez: vez() };
  }

  // Nuevo: slug a partir del nombre, sin repetir. El slug no cambia después (los enlaces siguen sirviendo).
  const base = aSlug(d.nombre) || "producto";
  const usados = new Set((await db.select({ slug: producto.slug }).from(producto).where(like(producto.slug, `${base}%`))).map((p) => p.slug));
  let slug = base;
  for (let n = 2; usados.has(slug); n++) slug = `${base}-${n}`;
  const [{ ultimo }] = await db.select({ ultimo: max(producto.orden) }).from(producto);
  await db.insert(producto).values({ ...valores, slug, orden: (ultimo ?? 0) + 1 });
  revalidarCatalogo();
  redirect(`/admin/productos/${slug}?nuevo=1`);
}
