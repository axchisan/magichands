import Link from "next/link";
import { numerosVisibles } from "@/lib/paginacion";
import estilos from "./RejillaPaginada.module.css";

// Paginador con enlaces (?pagina=N) para listas que se cargan en el servidor, como las del panel.
export function PaginadorEnlaces({
  actual,
  total,
  cantidad,
  porPagina,
  href,
}: {
  actual: number;
  total: number;
  cantidad: number;
  porPagina: number;
  href: (n: number) => string;
}) {
  if (total <= 1) return null;
  const desde = (actual - 1) * porPagina + 1;
  const hasta = Math.min(actual * porPagina, cantidad);
  const flecha = (n: number, texto: React.ReactNode, activa: boolean) =>
    activa ? (
      <Link className={estilos.flecha} href={href(n)}>
        {texto}
      </Link>
    ) : (
      <span className={estilos.flecha} aria-disabled="true">
        {texto}
      </span>
    );
  return (
    <nav className={estilos.paginador} aria-label="Páginas">
      <p className={estilos.rango}>
        {desde}–{hasta} de {cantidad}
      </p>
      <div className={estilos.controles}>
        {flecha(actual - 1, <><span aria-hidden="true">‹</span> Anterior</>, actual > 1)}
        <ul>
          {numerosVisibles(actual, total).map((n, i) =>
            n === null ? (
              <li key={`s${i}`} aria-hidden="true" className={estilos.salto}>
                …
              </li>
            ) : (
              <li key={n}>
                <Link
                  className={estilos.numero}
                  href={href(n)}
                  aria-current={n === actual ? "page" : undefined}
                  aria-label={`Página ${n}`}
                >
                  {n}
                </Link>
              </li>
            ),
          )}
        </ul>
        {flecha(actual + 1, <>Siguiente <span aria-hidden="true">›</span></>, actual < total)}
      </div>
    </nav>
  );
}
