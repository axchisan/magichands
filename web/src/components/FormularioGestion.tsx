"use client";

import { useActionState } from "react";
import type { RespuestaGuardar } from "@/app/acciones/admin";

// Formulario del panel: muestra "Cambios guardados" (o el error) junto al botón.
// `soloLectura` (vista previa): se puede llenar, pero el botón no guarda y se explica por qué.
// `version` cambia con los valores guardados: los campos se rehacen con lo nuevo (si no, React los
// devuelve a su valor inicial al terminar la acción y parece que no se guardó).
export function FormularioGestion({
  accion,
  version,
  className,
  textoBoton = "Guardar cambios",
  soloLectura = false,
  children,
}: {
  textoBoton?: string;
  soloLectura?: boolean;
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
        <button type="submit" className="boton boton-principal" disabled={pendiente || soloLectura} aria-busy={pendiente}>
          {pendiente ? "Guardando…" : textoBoton}
        </button>
        {soloLectura && (
          <p style={{ margin: 0, color: "var(--canela)", fontSize: "0.92rem" }}>
            En la vista previa esto no se guarda. Con tu cuenta, sí.
          </p>
        )}
        <p role="status" aria-live="polite" style={{ margin: 0, fontWeight: 600, color: respuesta?.ok ? "var(--whatsapp)" : "var(--rosa-profundo)" }}>
          {!pendiente && respuesta ? (respuesta.ok ? `✓ ${respuesta.mensaje}` : respuesta.mensaje) : ""}
        </p>
      </div>
    </form>
  );
}
