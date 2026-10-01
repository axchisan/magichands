import Link from "next/link";
import { count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { accesoActual } from "@/lib/admin";
import { ocultarCelular } from "@/lib/acceso";
import { normalizar } from "@/lib/filtros";
import { totalPaginas } from "@/lib/paginacion";
import { PaginadorEnlaces } from "@/components/PaginadorEnlaces";
import estilos from "../admin.module.css";

export const metadata = { title: "Clientes" };

const { cliente, pedido, user } = schema;
const POR_PAGINA = 20;

export default async function Clientes({ searchParams }: PageProps<"/admin/clientes">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 60) : "";
  const digitos = q.replace(/\D/g, "");
  const donde = q
    ? or(
        ilike(sql`translate(lower(${cliente.nombre}), 'áéíóúüñ', 'aeiouun')`, `%${normalizar(q)}%`),
        ilike(cliente.ciudad, `%${q}%`),
        digitos.length >= 3 ? ilike(cliente.whatsapp, `%${digitos}%`) : undefined,
      )
    : undefined;
  const [[{ total }], { acceso }] = await Promise.all([db.select({ total: count() }).from(cliente).where(donde), accesoActual()]);
  const paginas = totalPaginas(total, POR_PAGINA);
  const actual = Math.min(Math.max(1, Number.parseInt(String(params.pagina ?? "1"), 10) || 1), paginas);
  const ultimo = sql<Date | null>`max(${pedido.creado})`;
  const filas = await db
    .select({ id: cliente.id, nombre: cliente.nombre, ciudad: cliente.ciudad, whatsapp: cliente.whatsapp, correo: user.email, pedidos: count(pedido.id), ultimo })
    .from(cliente)
    .leftJoin(pedido, eq(pedido.clienteId, cliente.id))
    .leftJoin(user, eq(cliente.userId, user.id))
    .where(donde)
    .groupBy(cliente.id, user.email)
    .orderBy(desc(ultimo), desc(cliente.id))
    .limit(POR_PAGINA)
    .offset((actual - 1) * POR_PAGINA);
  const completo = acceso === "completo";

  return (
    <div className={estilos.contenido}>
      <h1>Clientes</h1>
      <form className={estilos.buscador} role="search" action="/admin/clientes">
        <label htmlFor="q" className="sr-only">
          Buscar cliente
        </label>
        <input id="q" name="q" type="search" placeholder="Nombre, ciudad o celular" defaultValue={q} enterKeyHint="search" />
        <button type="submit" className="boton boton-borde">
          Buscar
        </button>
      </form>
      {filas.length === 0 ? (
        <p className={estilos.vacio}>{q ? `Ningún cliente coincide con “${q}”.` : "Aún no hay clientes: aparecen con su primer encargo."}</p>
      ) : (
        <ul className={estilos.lista} role="list">
          {filas.map((c) => (
            <li key={c.id}>
              <Link href={`/admin/clientes/${c.id}`} className={estilos.fila}>
                <span className={estilos.codigo}>{c.nombre}</span>
                <span className={estilos.etiqueta}>{c.pedidos === 1 ? "1 pedido" : `${c.pedidos} pedidos`}</span>
                <span className={estilos.cliente}>
                  {c.ciudad} · {completo ? c.whatsapp : ocultarCelular(c.whatsapp)}
                  {c.correo && " · con cuenta"}
                </span>
                {c.ultimo && (
                  <span className={estilos.fecha}>
                    {new Date(c.ultimo).toLocaleDateString("es-CO", { day: "numeric", month: "short", timeZone: "America/Bogota" })}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <PaginadorEnlaces
        actual={actual}
        total={paginas}
        cantidad={total}
        porPagina={POR_PAGINA}
        href={(n) => `/admin/clientes?${new URLSearchParams({ ...(q && { q }), ...(n > 1 && { pagina: String(n) }) })}`}
      />
    </div>
  );
}
