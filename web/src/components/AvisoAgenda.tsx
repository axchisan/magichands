import { negocio } from "@/lib/config";

// Se muestra en toda la web cuando ella cierra la agenda desde el panel.
export function AvisoAgenda() {
  if (negocio.agenda.abierta) return null;
  return (
    <p role="status" style={{ background: "var(--crema)", textAlign: "center", padding: "0.6rem 1rem", fontWeight: 600 }}>
      {negocio.agenda.mensaje}
    </p>
  );
}
