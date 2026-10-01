"use client";

import { useFormStatus } from "react-dom";

export function BotonGuardar({ texto = "Guardar cambios" }: { texto?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="boton boton-principal" disabled={pending} aria-busy={pending}>
      {pending ? "Guardando…" : texto}
    </button>
  );
}
