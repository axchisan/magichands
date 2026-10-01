import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { accesoActual } from "@/lib/admin";
import type { PrecioReferencia } from "@/lib/catalogo-semilla";
import { guardarProducto } from "@/app/acciones/productos";
import { EditorProducto } from "@/components/EditorProducto";
import { FotosProducto } from "@/components/FotosProducto";
import estilos from "../../admin.module.css";

export async function generateMetadata({ params }: PageProps<"/admin/productos/[slug]">) {
  return { title: `Producto: ${(await params).slug}` };
}

export default async function EditarProducto({ params, searchParams }: PageProps<"/admin/productos/[slug]">) {
  const { slug } = await params;
  const recienCreado = (await searchParams).nuevo === "1";
  const [fila] = await db
    .select({ p: schema.producto, cat: schema.categoria.slug })
    .from(schema.producto)
    .innerJoin(schema.categoria, eq(schema.producto.categoriaId, schema.categoria.id))
    .where(eq(schema.producto.slug, slug));
  if (!fila) notFound();
  const { p } = fila;
  const [cats, fotos, { acceso }] = await Promise.all([
    db.select({ slug: schema.categoria.slug, nombre: schema.categoria.nombre }).from(schema.categoria).orderBy(asc(schema.categoria.orden)),
    db.select().from(schema.foto).where(eq(schema.foto.productoId, p.id)).orderBy(asc(schema.foto.orden), asc(schema.foto.id)),
    accesoActual(),
  ]);
  const soloLectura = acceso !== "completo";

  return (
    <div className={estilos.contenido}>
      <p>
        <Link href="/admin/productos">‹ Productos</Link>
      </p>
      <header className={estilos.detalleCabeza}>
        <h1>{p.nombre}</h1>
        {!p.activo && <span className={estilos.estado}>Oculto</span>}
        {p.activo && fotos.length > 0 && (
          <Link href={`/p/${p.slug}`} target="_blank" className={estilos.verWeb}>
            Ver en la web ↗
          </Link>
        )}
      </header>
      {recienCreado && (
        <p className={estilos.vistaPrevia} role="status">
          <strong>Producto creado.</strong> Ahora sube sus fotos: sin fotos no se muestra en la web.
        </p>
      )}

      <FotosProducto slug={p.slug} nombre={p.nombre} fotos={fotos} soloLectura={soloLectura} />

      <EditorProducto
        accion={guardarProducto.bind(null, p.slug)}
        categorias={cats}
        soloLectura={soloLectura}
        valores={{
          nombre: p.nombre,
          categoria: fila.cat,
          descripcion: p.descripcion,
          personalizacion: p.personalizacion,
          tamano: p.tamano,
          plazo: p.plazo,
          ocasiones: p.ocasiones,
          precio: p.precioConfirmado,
          precioReferencia: p.precioReferencia as PrecioReferencia | null,
          destacado: p.destacado,
          activo: p.activo,
        }}
      />
    </div>
  );
}
