"use client";

import Link from "next/link";
import { authCliente } from "@/lib/auth-cliente";
import estilos from "./Cabecera.module.css";

/** "Entrar" o la inicial/foto de la persona con sesión. Se resuelve en el navegador para que las
 *  páginas del catálogo sigan siendo estáticas. */
export function EnlaceCuenta({ variante = "cabecera" }: { variante?: "cabecera" | "menu" }) {
  const { data, isPending } = authCliente.useSession();
  const usuario = data?.user;
  // Quien entra con código no tiene nombre: se usa la parte del correo antes de la @.
  const nombre = usuario ? usuario.name.trim() || usuario.email.split("@")[0] : "";
  if (variante === "menu")
    return (
      <Link href={usuario ? "/mi-cuenta" : "/entrar"} className={estilos.menuCuenta}>
        {usuario ? `Mi cuenta (${nombre.split(" ")[0]})` : "Entrar"}
      </Link>
    );
  if (isPending) return <span className={estilos.cuentaVacia} aria-hidden="true" />;
  return usuario ? (
    <Link href="/mi-cuenta" className={estilos.avatar} aria-label={`Mi cuenta, ${nombre}`} title="Mi cuenta">
      {usuario.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- foto de Google, dominio externo y pequeña
        <img src={usuario.image} alt="" width={36} height={36} referrerPolicy="no-referrer" />
      ) : (
        <span aria-hidden="true">{nombre.charAt(0).toUpperCase()}</span>
      )}
    </Link>
  ) : (
    <Link href="/entrar" className={estilos.entrar}>
      Entrar
    </Link>
  );
}
