import type { Metadata } from "next";
import Link from "next/link";
import { FormularioEntrar } from "@/components/FormularioEntrar";
import { destinoSeguro } from "@/lib/destino";
import { panelAbierto } from "@/lib/config";
import estilos from "./entrar.module.css";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Entra con Google o con un código a tu correo para ver tus pedidos.",
  robots: { index: false },
};

export default async function Entrar({ searchParams }: PageProps<"/entrar">) {
  const p = await searchParams;
  return (
    <div className={`envoltura ${estilos.pagina}`}>
      <div className={estilos.tarjeta}>
        <h1>Entrar</h1>
        <p className={estilos.intro}>Para ver tus pedidos en un solo lugar. No necesitas cuenta para hacer un encargo.</p>
        <FormularioEntrar destino={destinoSeguro(typeof p.volver === "string" ? p.volver : undefined)} errorGoogle={Boolean(p.error)} />
        {panelAbierto && (
          <Link href="/admin/pedidos" className={estilos.atajoPanel}>
            <strong>¿Eres Magic H4nds?</strong> Mira tu panel de pedidos sin entrar <span aria-hidden="true">›</span>
          </Link>
        )}
        <p className={estilos.legal}>
          Al entrar aceptas las <Link href="/terminos">condiciones</Link> y la{" "}
          <Link href="/privacidad">política de privacidad</Link>.
        </p>
      </div>
    </div>
  );
}
