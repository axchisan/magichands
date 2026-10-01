import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { ESTADOS_PEDIDO } from "@/db/schema";
import { ESTADOS } from "@/lib/pedidos";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import { accesoActual } from "@/lib/admin";
import { ocultarCelular } from "@/lib/acceso";
import { actualizarPedido } from "@/app/acciones/admin";
import { IconoWhatsApp } from "@/components/Iconos";
import { FormularioGestion } from "@/components/FormularioGestion";
import estilos from "../../admin.module.css";

const { pedido, cliente, pedidoEvento } = schema;
const nombre = (id: string) => (id === "cancelado" ? "Cancelado" : (ESTADOS.find((e) => e.id === id)?.nombre ?? id));
const fechaHora = (d: Date) =>
  d.toLocaleString("es-CO", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "America/Bogota" });

export default async function DetallePedido({ params }: PageProps<"/admin/pedidos/[codigo]">) {
  const { codigo } = await params;
  const [p] = await db
    .select({ pedido, cliente })
    .from(pedido)
    .innerJoin(cliente, eq(pedido.clienteId, cliente.id))
    .where(eq(pedido.codigo, codigo));
  if (!p) notFound();
  const eventos = await db.select().from(pedidoEvento).where(eq(pedidoEvento.pedidoId, p.pedido.id)).orderBy(pedidoEvento.creado);
  const d = p.pedido.detalle as { producto?: string | null; detalle?: string; colores?: string; tamano?: string };
  const guardar = actualizarPedido.bind(null, codigo);
  const completo = (await accesoActual()).acceso === "completo";
  const saludo = `Hola ${p.cliente.nombre.split(" ")[0]} 💗 Te escribo de Magic H4nds por tu pedido ${codigo}.`;

  return (
    <div className={estilos.contenido}>
      <p>
        <Link href="/admin/pedidos">‹ Pedidos</Link>
      </p>
      <header className={estilos.detalleCabeza}>
        <h1>
          {codigo} {p.pedido.urgente && <span className={estilos.urgente}>Urgente</span>}
        </h1>
        <span className={estilos.estado} data-estado={p.pedido.estado}>
          {nombre(p.pedido.estado)}
        </span>
      </header>

      <div className={estilos.detalle}>
        <section className={estilos.tarjeta} aria-labelledby="encargo">
          <h2 id="encargo">Encargo</h2>
          <dl className={estilos.datos}>
            <dt>Producto</dt>
            <dd>{d.producto ?? "Otro diseño"}</dd>
            <dt>Idea</dt>
            <dd className={estilos.texto}>{d.detalle}</dd>
            {d.colores && (
              <>
                <dt>Colores</dt>
                <dd>{d.colores}</dd>
              </>
            )}
            {d.tamano && (
              <>
                <dt>Tamaño o talla</dt>
                <dd>{d.tamano}</dd>
              </>
            )}
            {p.pedido.fechaDeseada && (
              <>
                <dt>Lo necesita para</dt>
                <dd>{p.pedido.fechaDeseada}</dd>
              </>
            )}
            <dt>Recibido</dt>
            <dd>{fechaHora(p.pedido.creado)}</dd>
          </dl>
        </section>

        <section className={estilos.tarjeta} aria-labelledby="cliente">
          <h2 id="cliente">Cliente</h2>
          <dl className={estilos.datos}>
            <dt>Nombre</dt>
            <dd>{p.cliente.nombre}</dd>
            <dt>Ciudad</dt>
            <dd>{p.cliente.ciudad}</dd>
            <dt>Celular</dt>
            <dd>{completo ? p.cliente.whatsapp : ocultarCelular(p.cliente.whatsapp)}</dd>
          </dl>
          {completo ? (
            <a className="boton boton-whatsapp" href={enlaceWhatsApp(saludo, `57${p.cliente.whatsapp}`)} target="_blank" rel="noopener noreferrer">
              <IconoWhatsApp /> Escribirle por WhatsApp
            </a>
          ) : (
            <p className="pista">Con tu cuenta, aquí tocas un botón y se abre el chat de WhatsApp con este cliente.</p>
          )}
        </section>

        <section className={`${estilos.tarjeta} ${estilos.ancho}`} aria-labelledby="gestion">
          <h2 id="gestion">Gestionar</h2>
          <FormularioGestion
            version={[p.pedido.estado, p.pedido.total, p.pedido.anticipo, p.pedido.fechaEstimada, p.pedido.notasInternas, eventos.length].join("|")}
            accion={guardar}
            className={estilos.form}
          >
            <div className="campo">
              <label htmlFor="estado">Estado</label>
              <select id="estado" name="estado" defaultValue={p.pedido.estado}>
                {ESTADOS_PEDIDO.map((e) => (
                  <option key={e} value={e}>
                    {nombre(e)}
                  </option>
                ))}
              </select>
              <span className="pista">El cliente ve cada cambio en “Seguir mi pedido” y, si hizo el encargo con su cuenta, le llega un correo.</span>
            </div>
            <div className="campo">
              <label htmlFor="nota">Nota del cambio (opcional, interna)</label>
              <input id="nota" name="nota" placeholder="Ej.: anticipo por Nequi" />
            </div>
            <div className={estilos.tres}>
              <div className="campo">
                <label htmlFor="total">Total cotizado</label>
                <input id="total" name="total" inputMode="numeric" defaultValue={p.pedido.total ?? ""} placeholder="$" />
              </div>
              <div className="campo">
                <label htmlFor="anticipo">Anticipo recibido</label>
                <input id="anticipo" name="anticipo" inputMode="numeric" defaultValue={p.pedido.anticipo ?? ""} placeholder="$" />
              </div>
              <div className="campo">
                <label htmlFor="fechaEstimada">Entrega estimada</label>
                <input id="fechaEstimada" name="fechaEstimada" type="date" defaultValue={p.pedido.fechaEstimada ?? ""} />
              </div>
            </div>
            <div className="campo">
              <label htmlFor="notasInternas">Notas internas</label>
              <textarea id="notasInternas" name="notasInternas" defaultValue={p.pedido.notasInternas} />
            </div>
          </FormularioGestion>
        </section>

        <section className={`${estilos.tarjeta} ${estilos.ancho}`} aria-labelledby="historial">
          <h2 id="historial">Historial</h2>
          <ol className={estilos.historial}>
            {eventos.map((e) => (
              <li key={e.id}>
                <strong>{nombre(e.estado)}</strong> · {fechaHora(e.creado)}
                {e.nota && <span> · {e.nota}</span>}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
