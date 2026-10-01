"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authCliente } from "@/lib/auth-cliente";

export function BotonSalir({ className = "boton boton-borde" }: { className?: string }) {
  const [saliendo, setSaliendo] = useState(false);
  const router = useRouter();
  return (
    <button
      type="button"
      className={className}
      disabled={saliendo}
      onClick={async () => {
        setSaliendo(true);
        await authCliente.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      {saliendo ? "Cerrando sesión…" : "Cerrar sesión"}
    </button>
  );
}
