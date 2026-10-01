// Quién puede ver y usar el panel. Es la única regla de acceso: la usan el layout de /admin
// y las acciones del servidor.
//
// - "completo": administrador (correo en ADMIN_EMAILS) con sesión. Ve todo.
// - "vista-previa": panel abierto para la presentación (NEXT_PUBLIC_PANEL_ABIERTO=1) y quien mira no es
//   administrador. Puede probarlo, pero no ve los celulares de los clientes.
// - "entrar": panel cerrado y sin sesión: se pide entrar.
// - "denegado": panel cerrado y la sesión no es de un administrador.
export type AccesoPanel = "completo" | "vista-previa" | "entrar" | "denegado";

export function accesoPanel({ abierto, conSesion, admin }: { abierto: boolean; conSesion: boolean; admin: boolean }): AccesoPanel {
  if (conSesion && admin) return "completo";
  if (abierto) return "vista-previa";
  return conSesion ? "denegado" : "entrar";
}

/** "3105222290" -> "••• ••• 2290" (para la vista previa). */
export function ocultarCelular(cel: string): string {
  return `••• ••• ${cel.slice(-4)}`;
}
