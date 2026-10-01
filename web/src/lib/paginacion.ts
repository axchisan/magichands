// Paginación de listas largas (catálogo, categorías).

export const POR_PAGINA = 12;

export function totalPaginas(total: number, porPagina = POR_PAGINA): number {
  return Math.max(1, Math.ceil(total / porPagina));
}

export function pagina<T>(lista: T[], n: number, porPagina = POR_PAGINA): T[] {
  const p = Math.min(Math.max(1, n), totalPaginas(lista.length, porPagina));
  return lista.slice((p - 1) * porPagina, p * porPagina);
}

/**
 * Números a mostrar en el paginador: siempre la primera, la última y las vecinas de la actual;
 * los saltos se marcan con null ("…"). Ej.: actual 5 de 9 → [1, null, 4, 5, 6, null, 9].
 */
export function numerosVisibles(actual: number, total: number): (number | null)[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, actual - 1, actual, actual + 1].filter((n) => n >= 1 && n <= total));
  const orden = [...set].sort((a, b) => a - b);
  const salida: (number | null)[] = [];
  orden.forEach((n, i) => {
    if (i > 0 && n - orden[i - 1] > 1) salida.push(null);
    salida.push(n);
  });
  return salida;
}
