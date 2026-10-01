"use client";

import { useActionState } from "react";
import type { RespuestaGuardar } from "@/app/acciones/admin";

// Formulario de gestión del pedido: muestra "Cambios guardados" (o el error) junto al botón.
// `version` cambia con los valores guardados: los campos se rehacen con lo nuevo (si no, React los
// devuelve a su valor inicial al terminar la acción y parece que no se guardó).
export function FormularioGestion({
  accion,
  version,
  className,
  children,
}: {
  accion: (previo: RespuestaGuardar, f: FormData) => Promise<RespuestaGuardar>;
  version: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [respuesta, enviar, pendiente] = useActionState(accion, null);
  return (
    <form action={enviar} className={className}>
      <div key={version} style={{ display: "contents" }}>
        {children}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem 1rem" }}>
        <button type="submit" className="boton boton-principal" disabled={pendiente} aria-busy={pendiente}>
          {pendiente ? "Guardando…" : "Guardar cambios"}
        </button>
        <p role="status" aria-live="polite" style={{ margin: 0, fontWeight: 600, color: respuesta?.ok ? "var(--whatsapp)" : "var(--rosa-profundo)" }}>
          {!pendiente && respuesta ? (respuesta.ok ? `✓ ${respuesta.mensaje}` : respuesta.mensaje) : ""}
        </p>
      </div>
    </form>
  );
}
