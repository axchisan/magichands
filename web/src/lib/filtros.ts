import type { Producto } from "./catalogo";

/** Quita tildes y pasa a minúsculas para comparar búsquedas ("pinguino" encuentra "Pingüino"). */
export function normalizar(t: string): string {
  return t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function filtrar(productos: Producto[], f: { categoria?: string; ocasion?: string; texto?: string }) {
  const q = normalizar(f.texto?.trim() ?? "");
  return productos.filter(
    (p) =>
      (!f.categoria || p.categoria === f.categoria) &&
      (!f.ocasion || p.ocasiones.includes(f.ocasion)) &&
      (!q || normalizar(`${p.nombre} ${p.descripcion}`).includes(q)),
  );
}
