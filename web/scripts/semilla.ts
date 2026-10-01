// Carga inicial (idempotente) del catálogo en la base de datos desde src/data/catalogo.json.
//   npm run db:semilla                         -> rama dev (web/.env.local)
//   DATABASE_URL=<rama main> npm run db:semilla -> producción
// Solo agrega lo que falta: nunca pisa lo que ella cambió en el panel (productos, fotos, ajustes).
// `--forzar` vuelve a escribir categorías, productos y fotos estáticas desde el JSON (pierde sus cambios).
// No toca clientes ni pedidos.
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import datos from "../src/data/catalogo.json";

config({ path: ".env.local" });
const forzar = process.argv.includes("--forzar");
const db = drizzle(neon(process.env.DATABASE_URL!), { schema, casing: "snake_case" });
const { categoria, producto, foto, ajustes } = schema;

async function main() {
  const host = new URL(process.env.DATABASE_URL!).host.split(".")[0];
  console.log(`Base de datos: ${host}${forzar ? " (forzado: se reescribe el catálogo)" : ""}`);

  // Categorías
  for (const [i, c] of datos.categorias.entries()) {
    await db
      .insert(categoria)
      .values({ slug: c.slug, nombre: c.nombre, descripcion: c.descripcion, orden: i })
      .onConflictDoUpdate({
        target: categoria.slug,
        set: forzar ? { nombre: c.nombre, descripcion: c.descripcion, orden: i } : { slug: c.slug },
      });
  }
  const cats = new Map((await db.select().from(categoria)).map((c) => [c.slug, c.id]));

  // Productos y fotos
  for (const [i, p] of datos.productos.entries()) {
    const valores = {
      slug: p.slug,
      categoriaId: cats.get(p.categoria)!,
      nombre: p.nombre,
      descripcion: p.descripcion,
      personalizacion: p.personalizacion,
      tamano: p.tamano,
      plazo: p.plazo,
      ocasiones: p.ocasiones,
      precioReferencia: p.precioReferencia,
      destacado: p.destacado,
      orden: i,
    };
    const existente = (await db.select({ id: producto.id }).from(producto).where(eq(producto.slug, p.slug)))[0];
    if (existente && !forzar) continue;
    const [fila] = existente
      ? await db.update(producto).set({ ...valores, actualizado: new Date() }).where(eq(producto.id, existente.id)).returning({ id: producto.id })
      : await db.insert(producto).values(valores).returning({ id: producto.id });
    // Fotos de la carga inicial (estáticas). Las subidas desde el panel (r2) se respetan.
    await db.delete(foto).where(and(eq(foto.productoId, fila.id), eq(foto.origen, "estatica")));
    await db.insert(foto).values(
      p.fotos.map((f, j) => ({
        productoId: fila.id,
        clave: f.src,
        origen: "estatica",
        alt: f.alt ?? p.nombre,
        ancho: f.ancho,
        alto: f.alto,
        mejoradaIa: Boolean(f.ia),
        orden: j,
      })),
    );
  }

  // Ajustes por defecto (no sobrescribe lo que ella haya cambiado)
  const porDefecto: Record<string, unknown> = {
    agenda: { abierta: true, mensaje: "Agenda cerrada por ahora: los pedidos ya agendados siguen en proceso." },
    mostrarPrecios: false,
  };
  for (const [clave, valor] of Object.entries(porDefecto))
    await db.insert(ajustes).values({ clave, valor }).onConflictDoNothing();

  const [{ n: nProductos }] = await db.$count(producto).then((n) => [{ n }]);
  const nFotos = await db.$count(foto);
  console.log(`Listo: ${cats.size} categorías, ${nProductos} productos, ${nFotos} fotos.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
