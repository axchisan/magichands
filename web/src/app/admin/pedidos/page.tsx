import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { ESTADOS_PEDIDO } from "@/db/schema";
import { ESTADOS } from "@/lib/pedidos";
import { totalPaginas } from "@/lib/paginacion";
import { PaginadorEnlaces } from "@/components/PaginadorEnlaces";
import estilos from "../admin.module.css";

const { pedido, cliente } = schema;
const nombre = (id: string) => (id === "cancelado" ? "Cancelado" : (ESTADOS.find((e) => e.id === id)?.nombre ?? id));
// Lo que requiere acción de ella primero
const ABIERTOS = ["solicitud", "cotizado", "anticipo_recibido", "en_proceso", "listo", "enviado"];
const POR_PAGINA = 20;

export default async function Pedidos({ searchParams }: PageProps<"/admin/pedidos">) {
  const params = await searchParams;
  const filtro = String(params.estado ?? "abiertos");
  const conteos = Object.fromEntries(
    (await db.select({ estado: pedido.estado, n: sql<number>`count(*)::int` }).from(pedido).groupBy(pedido.estado)).map((c) => [c.estado, c.n]),
  );
  const abiertos = ABIERTOS.reduce((a, e) => a + (conteos[e] ?? 0), 0);
  const todos = Object.values(conteos).reduce((a, b) => a + b, 0);
  const cantidad = filtro === "abiertos" ? abiertos : filtro === "todos" ? todos : (conteos[filtro] ?? 0);
  const paginas = totalPaginas(cantidad, POR_PAGINA);
  const actual = Math.min(Math.max(1, Number.parseInt(String(params.pagina ?? "1"), 10) || 1), paginas);
  const filas = await db
    .select({ codigo: pedido.codigo, estado: pedido.estado, creado: pedido.creado, urgente: pedido.urgente, detalle: pedido.detalle, nombre: cliente.nombre, ciudad: cliente.ciudad })
    .from(pedido)
    .innerJoin(cliente, eq(pedido.clienteId, cliente.id))
    .where(filtro === "abiertos" ? sql`${pedido.estado} in ${ABIERTOS}` : filtro === "todos" ? undefined : eq(pedido.estado, filtro as (typeof ESTADOS_PEDIDO)[number]))
    .orderBy(desc(pedido.creado))
    .limit(POR_PAGINA)
    .offset((actual - 1) * POR_PAGINA);
  const pestañas = [["abiertos", "En curso", abiertos], ...ESTADOS_PEDIDO.map((e) => [e, nombre(e), conteos[e] ?? 0]), ["todos", "Todos", todos]] as const;

  return (
    <div className={estilos.contenido}>
      <h1>Pedidos</h1>
      <nav aria-label="Filtrar por estado" className={estilos.pestanas}>
        {pestañas.map(([id, texto, n]) => (
          <Link key={id} href={`/admin/pedidos?estado=${id}`} aria-current={filtro === id ? "page" : undefined}>
            {texto} <span>{n}</span>
          </Link>
        ))}
      </nav>
      {filas.length === 0 ? (
        <p className={estilos.vacio}>No hay pedidos aquí.</p>
      ) : (
        <ul className={estilos.lista} role="list">
          {filas.map((p) => {
            const d = p.detalle as { producto?: string | null; detalle?: string };
            return (
              <li key={p.codigo}>
                <Link href={`/admin/pedidos/${p.codigo}`} className={estilos.fila}>
                  <span className={estilos.codigo}>
                    {p.codigo} {p.urgente && <span className={estilos.urgente}>Urgente</span>}
                  </span>
                  <span className={estilos.estado} data-estado={p.estado}>
                    {nombre(p.estado)}
                  </span>
                  <span className={estilos.cliente}>
                    {p.nombre} · {p.ciudad}
                  </span>
                  <span className={estilos.resumen}>
                    <strong>{d.producto ?? "Otro diseño"}:</strong> {d.detalle}
                  </span>
                  <span className={estilos.fecha}>
                    {p.creado.toLocaleDateString("es-CO", { day: "numeric", month: "short", timeZone: "America/Bogota" })}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <PaginadorEnlaces
        actual={actual}
        total={paginas}
        cantidad={cantidad}
        porPagina={POR_PAGINA}
        href={(n) => `/admin/pedidos?estado=${filtro}${n > 1 ? `&pagina=${n}` : ""}`}
      />
    </div>
  );
}
