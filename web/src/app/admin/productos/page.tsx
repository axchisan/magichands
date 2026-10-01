import Image from "next/image";
import Link from "next/link";
import { and, asc, count, eq, ilike, sql, type SQL } from "drizzle-orm";
import { db, schema } from "@/db";
import { totalPaginas } from "@/lib/paginacion";
import { normalizar } from "@/lib/filtros";
import { PaginadorEnlaces } from "@/components/PaginadorEnlaces";
import estilos from "../admin.module.css";

export const metadata = { title: "Productos" };

const { producto, categoria, foto } = schema;
const POR_PAGINA = 20;
const pesos = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default async function Productos({ searchParams }: PageProps<"/admin/productos">) {
  const params = await searchParams;
  const cat = typeof params.categoria === "string" ? params.categoria : "";
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 60) : "";
  const verOcultos = params.ocultos === "1";

  const condiciones: SQL[] = [eq(producto.activo, !verOcultos)];
  if (cat) condiciones.push(eq(categoria.slug, cat));
  // Búsqueda sin tildes ni mayúsculas ("pinguino" encuentra "Pingüino").
  if (q) condiciones.push(ilike(sql`translate(lower(${producto.nombre}), 'áéíóúüñ', 'aeiouun')`, `%${normalizar(q)}%`));
  const donde = and(...condiciones);

  const [cats, [{ total }], [{ ocultos }]] = await Promise.all([
    db
      .select({ slug: categoria.slug, nombre: categoria.nombre, n: count(producto.id) })
      .from(categoria)
      .leftJoin(producto, and(eq(producto.categoriaId, categoria.id), eq(producto.activo, true)))
      .groupBy(categoria.id)
      .orderBy(asc(categoria.orden)),
    db.select({ total: count() }).from(producto).innerJoin(categoria, eq(producto.categoriaId, categoria.id)).where(donde),
    db.select({ ocultos: count() }).from(producto).where(eq(producto.activo, false)),
  ]);
  const paginas = totalPaginas(total, POR_PAGINA);
  const actual = Math.min(Math.max(1, Number.parseInt(String(params.pagina ?? "1"), 10) || 1), paginas);
  const filas = await db
    .select({
      slug: producto.slug,
      nombre: producto.nombre,
      categoria: categoria.nombre,
      destacado: producto.destacado,
      precio: producto.precioConfirmado,
      portada: sql<string | null>`(select ${foto.clave} from ${foto} where ${foto.productoId} = ${producto.id} order by ${foto.orden}, ${foto.id} limit 1)`,
      fotos: sql<number>`(select count(*)::int from ${foto} where ${foto.productoId} = ${producto.id})`,
    })
    .from(producto)
    .innerJoin(categoria, eq(producto.categoriaId, categoria.id))
    .where(donde)
    .orderBy(asc(producto.orden), asc(producto.id))
    .limit(POR_PAGINA)
    .offset((actual - 1) * POR_PAGINA);

  const enlace = (cambios: Record<string, string>) => {
    const u = new URLSearchParams({ ...(cat && { categoria: cat }), ...(q && { q }), ...(verOcultos && { ocultos: "1" }), ...cambios });
    for (const [k, v] of [...u.entries()]) if (!v) u.delete(k);
    const s = u.toString();
    return `/admin/productos${s ? `?${s}` : ""}`;
  };
  const totalActivos = cats.reduce((a, c) => a + c.n, 0);

  return (
    <div className={estilos.contenido}>
      <div className={estilos.encabezado}>
        <h1>Productos</h1>
        <Link href="/admin/productos/nuevo" className="boton boton-principal">
          + Nuevo producto
        </Link>
      </div>

      <form className={estilos.buscador} role="search" action="/admin/productos">
        {cat && <input type="hidden" name="categoria" value={cat} />}
        {verOcultos && <input type="hidden" name="ocultos" value="1" />}
        <label htmlFor="q" className="sr-only">
          Buscar producto
        </label>
        <input id="q" name="q" type="search" placeholder="Buscar por nombre" defaultValue={q} enterKeyHint="search" />
        <button type="submit" className="boton boton-borde">
          Buscar
        </button>
      </form>

      <nav aria-label="Filtrar por categoría" className={estilos.pestanas}>
        <Link href={enlace({ categoria: "", ocultos: "", pagina: "" })} aria-current={!cat && !verOcultos ? "page" : undefined}>
          Todos <span>{totalActivos}</span>
        </Link>
        {cats.map((c) => (
          <Link key={c.slug} href={enlace({ categoria: c.slug, ocultos: "", pagina: "" })} aria-current={cat === c.slug && !verOcultos ? "page" : undefined}>
            {c.nombre} <span>{c.n}</span>
          </Link>
        ))}
        <Link href={enlace({ categoria: "", ocultos: "1", pagina: "" })} aria-current={verOcultos && !cat ? "page" : undefined}>
          Ocultos <span>{ocultos}</span>
        </Link>
      </nav>

      {filas.length === 0 ? (
        <p className={estilos.vacio}>{q ? `No hay productos que coincidan con “${q}”.` : "No hay productos aquí."}</p>
      ) : (
        <ul className={estilos.lista} role="list">
          {filas.map((p) => (
            <li key={p.slug}>
              <Link href={`/admin/productos/${p.slug}`} className={estilos.filaProducto}>
                {p.portada ? (
                  <Image src={p.portada} alt="" width={64} height={64} sizes="64px" className={estilos.miniatura} />
                ) : (
                  <span className={`${estilos.miniatura} ${estilos.sinFoto}`}>Sin foto</span>
                )}
                <span className={estilos.productoInfo}>
                  <strong>{p.nombre}</strong>
                  <span>{p.categoria}</span>
                </span>
                <span className={estilos.etiquetas}>
                  {p.destacado && <span className={estilos.etiqueta}>Destacado</span>}
                  {p.fotos === 0 && <span className={`${estilos.etiqueta} ${estilos.alerta}`}>Falta foto</span>}
                  <span className={estilos.etiquetaSuave}>{p.precio ? pesos.format(p.precio) : "Se cotiza"}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <PaginadorEnlaces actual={actual} total={paginas} cantidad={total} porPagina={POR_PAGINA} href={(n) => enlace({ pagina: n > 1 ? String(n) : "" })} />
    </div>
  );
}
