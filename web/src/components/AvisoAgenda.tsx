import { ajustes } from "@/lib/ajustes";

// Se muestra en toda la web cuando ella cierra la agenda desde el panel.
export async function AvisoAgenda() {
  const { agenda } = await ajustes();
  if (agenda.abierta) return null;
  return (
    <p role="status" style={{ background: "var(--crema)", textAlign: "center", padding: "0.6rem 1rem", fontWeight: 600 }}>
      {agenda.mensaje}
    </p>
  );
}
