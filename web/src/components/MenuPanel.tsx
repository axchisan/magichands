"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import estilos from "@/app/admin/admin.module.css";

const SECCIONES = [
  { href: "/admin/pedidos", texto: "Pedidos" },
  { href: "/admin/productos", texto: "Productos" },
  { href: "/admin/clientes", texto: "Clientes" },
  { href: "/admin/ajustes", texto: "Ajustes" },
];

export function MenuPanel() {
  const ruta = usePathname();
  return (
    <nav aria-label="Secciones del panel" className={estilos.secciones}>
      {SECCIONES.map((s) => (
        <Link key={s.href} href={s.href} aria-current={ruta === s.href || ruta.startsWith(s.href + "/") ? "page" : undefined}>
          {s.texto}
        </Link>
      ))}
    </nav>
  );
}
