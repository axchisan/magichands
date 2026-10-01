import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { esAdmin, sesionActual } from "@/lib/auth";
import { misPedidos } from "@/app/acciones/pedidos";
import { ESTADOS } from "@/lib/pedidos";
import { BotonSalir } from "@/components/BotonSalir";
import estilos from "./mi-cuenta.module.css";

export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false } };

const nombreEstado = (id: string) => (id === "cancelado" ? "Cancelado" : (ESTADOS.find((e) => e.id === id)?.nombre ?? id));
const fecha = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

export default async function MiCuenta() {
  const sesion = await sesionActual();
  if (!sesion) redirect("/entrar?volver=/mi-cuenta");
  const pedidos = await misPedidos();
  const admin = esAdmin(sesion.user.email);

  return (
    <div className={`envoltura ${estilos.pagina}`}>
      <header className={estilos.cabeza}>
        <div>
          <h1>Hola, {sesion.user.name.split(" ")[0]}</h1>
          <p className={estilos.correo}>{sesion.user.email}</p>
        </div>
        <div className={estilos.acciones}>
          {admin && (
            <Link href="/admin" className="boton boton-principal">
              Ir al panel
            </Link>
          )}
          <BotonSalir />
        </div>
      </header>

      <section aria-labelledby="mis-pedidos">
        <h2 id="mis-pedidos">Mis pedidos</h2>
        {pedidos.length === 0 ? (
          <div className={estilos.vacio}>
            <p>Todavía no tienes pedidos con esta cuenta.</p>
            <p className="pista">
              Los encargos que hagas con la sesión iniciada aparecen aquí. Si hiciste uno sin entrar, puedes seguirlo con
              su código en <Link href="/pedido">Seguir mi pedido</Link>.
            </p>
            <Link href="/encargo" className="boton boton-principal">
              Hacer un encargo
            </Link>
          </div>
        ) : (
          <ul className={estilos.lista} role="list">
            {pedidos.map((p) => (
              <li key={p.codigo}>
                <Link href={`/pedido?codigo=${p.codigo}`} className={estilos.pedido}>
                  <span className={estilos.codigo}>{p.codigo}</span>
                  <span className={estilos.producto}>{p.producto}</span>
                  <span className={estilos.estado} data-estado={p.estado}>
                    {nombreEstado(p.estado)}
                  </span>
                  <span className={estilos.fecha}>Pedido el {fecha(p.creado)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
