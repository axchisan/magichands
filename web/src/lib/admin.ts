import "server-only";
import { cache } from "react";
import { esAdmin, sesionActual } from "./auth";
import { accesoPanel } from "./acceso";
import { panelAbierto } from "./config";

/** Acceso al panel de quien hace la petición (una sola consulta de sesión por petición). */
export const accesoActual = cache(async () => {
  const sesion = await sesionActual();
  const acceso = accesoPanel({ abierto: panelAbierto, conSesion: !!sesion, admin: esAdmin(sesion?.user.email) });
  return { sesion, acceso };
});

/** Corta la acción si quien la llama no puede usar el panel (verificación en el servidor, siempre). */
export async function exigirAdmin() {
  const { sesion, acceso } = await accesoActual();
  if (acceso !== "completo" && acceso !== "vista-previa") throw new Error("No autorizado");
  return sesion;
}
