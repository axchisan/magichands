/** Solo rutas internas como destino tras entrar (evita redirecciones abiertas). */
export function destinoSeguro(v: string | null | undefined): string {
  return v && v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : "/mi-cuenta";
}
