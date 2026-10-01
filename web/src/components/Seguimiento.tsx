"use client";

import { useEffect, useRef, useState } from "react";
import { ESTADOS, buscarPedido, type ResultadoBusqueda } from "@/lib/pedidos";
import estilos from "./Seguimiento.module.css";

const fecha = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "long" });

export function Seguimiento() {
  const [resultado, setResultado] = useState<ResultadoBusqueda | null>(null);
  const codigoRef = useRef<HTMLInputElement>(null);

  // Código que llega desde el encargo (/pedido?codigo=MH4-XXXX); se lee al montar (ver FormularioEncargo).
  useEffect(() => {
    const codigo = new URLSearchParams(window.location.search).get("codigo");
    if (codigo && codigoRef.current) codigoRef.current.value = codigo;
  }, []);

  function consultar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setResultado(buscarPedido(String(d.get("codigo")), String(d.get("telefono"))));
  }

  return (
    <div className={estilos.contenedor}>
      <form className={estilos.form} onSubmit={consultar}>
        <div className="campo">
          <label htmlFor="codigo">Código de pedido</label>
          <input
            id="codigo"
            name="codigo"
            required
            ref={codigoRef}
            placeholder="MH4-7K2P"
            autoCapitalize="characters"
            pattern="[Mm][Hh]4-?[A-Za-z0-9]{4}"
            aria-errormessage="codigo-error"
          />
          <span className="error" id="codigo-error">
            El código tiene la forma MH4-XXXX.
          </span>
        </div>
        <div className="campo">
          <label htmlFor="telefono">Últimos 4 dígitos de tu celular</label>
          <input
            id="telefono"
            name="telefono"
            required
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            aria-errormessage="telefono-error"
          />
          <span className="error" id="telefono-error">
            Escribe 4 números.
          </span>
        </div>
        <button type="submit" className="boton boton-principal">
          Ver mi pedido
        </button>
      </form>

      <div aria-live="polite">
        {resultado && !resultado.ok && (
          <p className={estilos.aviso} role="alert">
            {resultado.motivo === "no-existe"
              ? "No encontramos un pedido con ese código. Revisa que esté bien escrito (MH4- y 4 caracteres)."
              : "El código existe, pero los dígitos del celular no coinciden. Usa el número con el que hiciste el encargo."}
          </p>
        )}
        {resultado?.ok && <Linea pedido={resultado.pedido} />}
      </div>
    </div>
  );
}

function Linea({ pedido }: { pedido: Extract<ResultadoBusqueda, { ok: true }>["pedido"] }) {
  const indice = ESTADOS.findIndex((e) => e.id === pedido.estado);
  const fechas = Object.fromEntries(pedido.historial.map((h) => [h.estado, h.fecha]));
  return (
    <section className={estilos.pedido} aria-labelledby="pedido-titulo">
      <h2 id="pedido-titulo">
        {pedido.codigo}: {pedido.producto}
      </h2>
      {pedido.fechaEstimada && <p>Entrega estimada: {fecha(pedido.fechaEstimada)}</p>}
      {pedido.ejemplo && <p className={estilos.ejemplo}>Pedido de ejemplo para la demostración.</p>}
      <ol className={estilos.linea}>
        {ESTADOS.map((e, i) => (
          <li
            key={e.id}
            className={i < indice ? estilos.hecho : i === indice ? estilos.actual : estilos.pendiente}
            aria-current={i === indice ? "step" : undefined}
          >
            <span className={estilos.nombreEstado}>{e.nombre}</span>
            {fechas[e.id] && <span className={estilos.fecha}>{fecha(fechas[e.id])}</span>}
            {i === indice && <span className={estilos.texto}>{e.texto}</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}
