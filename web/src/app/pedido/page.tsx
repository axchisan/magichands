import type { Metadata } from "next";
import { Seguimiento } from "@/components/Seguimiento";
import { esDemo } from "@/lib/config";

export const metadata: Metadata = {
  title: "Seguir mi pedido",
  description: "Consulta el estado de tu pedido con tu código MH4 y los últimos dígitos de tu celular.",
};

export default function Pedido() {
  return (
    <div className="envoltura" style={{ paddingTop: "3rem", display: "grid", gap: "1rem" }}>
      <h1 style={{ fontSize: "var(--t-5)" }}>Seguir mi pedido</h1>
      <p style={{ maxWidth: "38rem" }}>
        Escribe el código que te dimos al hacer el encargo (empieza por MH4) y los últimos 4 dígitos de tu celular.
      </p>
      {esDemo && (
        <p style={{ maxWidth: "38rem", color: "var(--canela)" }}>
          Para probar la demo: código <strong>MH4-7K2P</strong> con <strong>1234</strong>, o <strong>MH4-3RQT</strong>{" "}
          con <strong>5678</strong>. Los encargos que hagas también aparecen aquí con su código.
        </p>
      )}
      <Seguimiento />
    </div>
  );
}
