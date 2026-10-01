import "server-only";
import { unstable_cache } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import type { Categoria, Foto, Producto } from "./catalogo";

// Lectura del catálogo desde la base de datos, en caché con la etiqueta "catalogo".
// Las páginas siguen siendo estáticas: cuando ella guarda un cambio en el panel se llama a
// revalidarCatalogo() (lib/revalidar.ts) y las páginas se regeneran en la siguiente visita.

export const ETIQUETA_CATALOGO = "catalogo";
const { categoria, producto, foto } = schema;

const fotoPublica = (f: typeof foto.$inferSelect): Foto => ({
  src: f.clave,
  ancho: f.ancho,
  alto: f.alto,
  alt: f.alt || undefined,
  ia: f.mejoradaIa || undefined,
});

const leer = unstable_cache(
  async () => {
    const [cats, prods, fotos] = await Promise.all([
      db.select().from(categoria).orderBy(asc(categoria.orden), asc(categoria.id)),
      db
        .select({ p: producto, cat: categoria.slug })
        .from(producto)
        .innerJoin(categoria, eq(producto.categoriaId, categoria.id))
        .where(eq(producto.activo, true))
        .orderBy(asc(producto.orden), asc(producto.id)),
      db.select().from(foto).orderBy(asc(foto.orden), asc(foto.id)),
    ]);
    const fotosDe = new Map<number, Foto[]>();
    for (const f of fotos) fotosDe.set(f.productoId, [...(fotosDe.get(f.productoId) ?? []), fotoPublica(f)]);
    // Un producto sin fotos no se muestra (la tarjeta y la ficha las necesitan).
    const productos: Producto[] = prods
      .filter(({ p }) => fotosDe.has(p.id))
      .map(({ p, cat }) => ({
        slug: p.slug,
        categoria: cat,
        nombre: p.nombre,
        descripcion: p.descripcion,
        personalizacion: p.personalizacion,
        tamano: p.tamano,
        plazo: p.plazo,
        destacado: p.destacado,
        precio: p.precioConfirmado,
        ocasiones: p.ocasiones,
        fotos: fotosDe.get(p.id)!,
      }));
    const categorias: Categoria[] = cats
      .map((c) => ({ slug: c.slug, nombre: c.nombre, descripcion: c.descripcion, total: productos.filter((p) => p.categoria === c.slug).length }))
      .filter((c) => c.total > 0);
    return { categorias, productos };
  },
  ["catalogo-v1"],
  { tags: [ETIQUETA_CATALOGO] },
);

export async function catalogo() {
  return leer();
}

export async function productoPorSlug(slug: string) {
  return (await leer()).productos.find((p) => p.slug === slug);
}

export async function categoriaPorSlug(slug: string) {
  return (await leer()).categorias.find((c) => c.slug === slug);
}

export async function productosDe(categoriaSlug: string) {
  return (await leer()).productos.filter((p) => p.categoria === categoriaSlug);
}

/** Otros productos de la misma categoría, sin repetir el actual. */
export async function relacionados(p: Producto, max = 4) {
  return (await leer()).productos.filter((x) => x.categoria === p.categoria && x.slug !== p.slug).slice(0, max);
}
