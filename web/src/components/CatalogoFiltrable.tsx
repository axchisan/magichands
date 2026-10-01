"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Categoria, Ocasion, Producto } from "@/lib/catalogo";
import { filtrar } from "@/lib/filtros";
import { RejillaProductos } from "./TarjetaProducto";
import estilos from "./CatalogoFiltrable.module.css";

export function CatalogoFiltrable({
  productos,
  categorias,
  ocasiones,
}: {
  productos: Producto[];
  categorias: Categoria[];
  ocasiones: Ocasion[];
}) {
  const [categoria, setCategoria] = useState<string>();
  const [ocasion, setOcasion] = useState<string>();
  const [texto, setTexto] = useState("");
  const lista = useMemo(() => filtrar(productos, { categoria, ocasion, texto }), [productos, categoria, ocasion, texto]);

  const limpiar = () => {
    setCategoria(undefined);
    setOcasion(undefined);
    setTexto("");
  };

  return (
    <div className={estilos.contenedor}>
      <div className={estilos.filtros}>
        <div className={estilos.buscar}>
          <label htmlFor="buscar">Buscar</label>
          <input
            id="buscar"
            type="search"
            placeholder="Abejita, ramo, Harry Potter…"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            autoComplete="off"
          />
        </div>
        <fieldset className={estilos.grupo}>
          <legend>Categoría</legend>
          <div className={estilos.chips}>
            <Chip activo={!categoria} onClick={() => setCategoria(undefined)}>
              Todas
            </Chip>
            {categorias.map((c) => (
              <Chip key={c.slug} activo={categoria === c.slug} onClick={() => setCategoria(c.slug)}>
                {c.nombre}
              </Chip>
            ))}
          </div>
        </fieldset>
        <fieldset className={estilos.grupo}>
          <legend>Ocasión</legend>
          <div className={estilos.chips}>
            <Chip activo={!ocasion} onClick={() => setOcasion(undefined)}>
              Cualquiera
            </Chip>
            {ocasiones.map((o) => (
              <Chip key={o.slug} activo={ocasion === o.slug} onClick={() => setOcasion(o.slug)}>
                {o.nombre}
              </Chip>
            ))}
          </div>
        </fieldset>
      </div>

      <p className={estilos.resultado} role="status" aria-live="polite">
        {lista.length === 1 ? "1 producto" : `${lista.length} productos`}
      </p>

      <h2 className="visualmente-oculto">Productos</h2>
      {lista.length > 0 ? (
        <RejillaProductos productos={lista} prioridad={4} />
      ) : (
        <div className={estilos.vacio}>
          <p>No encontramos productos con esos filtros.</p>
          <p>
            Prueba con otra palabra, <button type="button" onClick={limpiar}>quita los filtros</button> o{" "}
            <Link href="/encargo">cuéntanos tu idea</Link>: casi todo se puede tejer por encargo.
          </p>
        </div>
      )}
    </div>
  );
}

function Chip({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className={estilos.chip} aria-pressed={activo} onClick={onClick}>
      {children}
    </button>
  );
}
