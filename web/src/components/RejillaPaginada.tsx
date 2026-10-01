"use client";

import { useRef, useState } from "react";
import type { Producto } from "@/lib/catalogo";
import { numerosVisibles, pagina, POR_PAGINA, totalPaginas } from "@/lib/paginacion";
import { RejillaProductos } from "./TarjetaProducto";
import estilos from "./RejillaPaginada.module.css";

// Rejilla de productos con paginación (12 por página). Para reiniciar en la página 1 cuando cambian
// los filtros, el padre le pasa una `key` distinta.
export function RejillaPaginada({ productos, porPagina = POR_PAGINA }: { productos: Producto[]; porPagina?: number }) {
  const [actual, setActual] = useState(1);
  const inicio = useRef<HTMLDivElement>(null);
  const total = totalPaginas(productos.length, porPagina);
  const visibles = pagina(productos, actual, porPagina);

  function ir(n: number) {
    setActual(n);
    // Lleva al comienzo de la lista (respeta "reducir movimiento" vía CSS scroll-behavior).
    inicio.current?.scrollIntoView({ block: "start" });
  }

  const desde = (actual - 1) * porPagina + 1;
  const hasta = desde + visibles.length - 1;

  return (
    <div ref={inicio} className={estilos.contenedor}>
      <RejillaProductos productos={visibles} prioridad={actual === 1 ? 4 : 0} />
      {total > 1 && (
        <nav className={estilos.paginador} aria-label="Páginas del catálogo">
          <p className={estilos.rango}>
            {desde}–{hasta} de {productos.length}
          </p>
          <div className={estilos.controles}>
            <button type="button" className={estilos.flecha} onClick={() => ir(actual - 1)} disabled={actual === 1}>
              <span aria-hidden="true">‹</span> Anterior
            </button>
            <ul>
              {numerosVisibles(actual, total).map((n, i) =>
                n === null ? (
                  <li key={`s${i}`} aria-hidden="true" className={estilos.salto}>
                    …
                  </li>
                ) : (
                  <li key={n}>
                    <button
                      type="button"
                      className={estilos.numero}
                      aria-current={n === actual ? "page" : undefined}
                      aria-label={`Página ${n}`}
                      onClick={() => ir(n)}
                    >
                      {n}
                    </button>
                  </li>
                ),
              )}
            </ul>
            <button type="button" className={estilos.flecha} onClick={() => ir(actual + 1)} disabled={actual === total}>
              Siguiente <span aria-hidden="true">›</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
