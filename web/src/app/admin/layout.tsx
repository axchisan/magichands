import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { accesoActual } from "@/lib/admin";
import estilos from "./admin.module.css";

export const metadata: Metadata = { title: "Panel", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const { sesion, acceso } = await accesoActual();
  if (acceso === "entrar") redirect("/entrar?volver=/admin");
  if (acceso === "denegado")
    return (
      <div className="envoltura" style={{ padding: "4rem 0", display: "grid", gap: "1rem", justifyItems: "start" }}>
        <h1 style={{ fontSize: "var(--t-5)" }}>Esta sección es solo para Magic H4nds</h1>
        <p>Entraste como {sesion?.user.email}. Tus pedidos están en tu cuenta.</p>
        <Link href="/mi-cuenta" className="boton boton-principal">
          Ir a mi cuenta
        </Link>
      </div>
    );
  return (
    <div className={`envoltura ${estilos.panel}`}>
      <nav aria-label="Panel" className={estilos.menu}>
        <span className={estilos.titulo}>Panel</span>
        <Link href="/admin/pedidos">Pedidos</Link>
      </nav>
      {acceso === "vista-previa" && (
        <p className={estilos.vistaPrevia} role="note">
          <strong>Vista previa del panel.</strong> Así llegan y se gestionan los encargos. Cuando la página sea tuya, solo
          tú entras aquí con tu cuenta; por ahora los celulares de los clientes se ven ocultos.
        </p>
      )}
      {children}
    </div>
  );
}
