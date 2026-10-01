import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { accesoActual } from "@/lib/admin";
import { ocultarCelular } from "@/lib/acceso";
import { ESTADOS } from "@/lib/pedidos";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import { guardarNotasCliente } from "@/app/acciones/clientes";
import { FormularioGestion } from "@/components/FormularioGestion";
import { IconoWhatsApp } from "@/components/Iconos";
import estilos from "../../admin.module.css";

export const metadata = { title: "Cliente" };

const nombreEstado = (id: string) => (id === "cancelado" ? "Cancelado" : (ESTADOS.find((e) => e.id === id)?.nombre ?? id));
const pesos = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default async function Cliente({ params }: PageProps<"/admin/clientes/[id]">) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [[fila], pedidos, { acceso }] = await Promise.all([
    db.select({ c: schema.cliente, correo: schema.user.email }).from(schema.cliente).leftJoin(schema.user, eq(schema.cliente.userId, schema.user.id)).where(eq(schema.cliente.id, id)),
    db.select().from(schema.pedido).where(eq(schema.pedido.clienteId, id)).orderBy(desc(schema.pedido.creado)),
    accesoActual(),
  ]);
  if (!fila) notFound();
  const { c } = fila;
  const completo = acceso === "completo";
  const pagado = pedidos.filter((p) => p.estado === "entregado").reduce((a, p) => a + (p.total ?? 0), 0);

  return (
    <div className={estilos.contenido}>
      <p>
        <Link href="/admin/clientes">‹ Clientes</Link>
      </p>
      <h1>{c.nombre}</h1>
      <div className={estilos.detalle}>
        <section className={estilos.tarjeta} aria-labelledby="datos-cliente">
          <h2 id="datos-cliente">Datos</h2>
          <dl className={estilos.datos}>
            <dt>Ciudad</dt>
            <dd>{c.ciudad || "—"}</dd>
            <dt>Celular</dt>
            <dd>{completo ? c.whatsapp : ocultarCelular(c.whatsapp)}</dd>
            {fila.correo && completo && (
              <>
                <dt>Correo</dt>
                <dd>{fila.correo}</dd>
              </>
            )}
            <dt>Pedidos</dt>
            <dd>
              {pedidos.length}
              {pagado > 0 && ` · ${pesos.format(pagado)} en pedidos entregados`}
            </dd>
          </dl>
          {completo && (
            <a className="boton boton-whatsapp" href={enlaceWhatsApp(`Hola ${c.nombre.split(" ")[0]} 💗 Te escribo de Magic H4nds.`, `57${c.whatsapp}`)} target="_blank" rel="noopener noreferrer">
              <IconoWhatsApp /> Escribirle por WhatsApp
            </a>
          )}
        </section>

        <section className={estilos.tarjeta} aria-labelledby="notas-cliente">
          <h2 id="notas-cliente">Notas</h2>
          <FormularioGestion accion={guardarNotasCliente.bind(null, c.id)} version={c.notas} soloLectura={!completo} textoBoton="Guardar notas" className={estilos.form}>
            <div className="campo">
              <label htmlFor="notas">Solo las ves tú</label>
              <textarea id="notas" name="notas" rows={5} maxLength={4000} placeholder="Gustos, tallas, cómo prefiere pagar…" defaultValue={c.notas} />
            </div>
          </FormularioGestion>
        </section>

        <section className={`${estilos.tarjeta} ${estilos.ancho}`} aria-labelledby="pedidos-cliente">
          <h2 id="pedidos-cliente">Pedidos</h2>
          <ul className={estilos.lista} role="list">
            {pedidos.map((p) => {
              const d = p.detalle as { producto?: string | null; detalle?: string };
              return (
                <li key={p.id}>
                  <Link href={`/admin/pedidos/${p.codigo}`} className={estilos.fila}>
                    <span className={estilos.codigo}>{p.codigo}</span>
                    <span className={estilos.estado} data-estado={p.estado}>
                      {nombreEstado(p.estado)}
                    </span>
                    <span className={estilos.resumen}>
                      <strong>{d.producto ?? "Otro diseño"}:</strong> {d.detalle}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
