"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import estilos from "./Cabecera.module.css";

const enlaces = [
  { href: "/catalogo", texto: "Catálogo" },
  { href: "/catalogo/personalizados", texto: "Personalizados" },
  { href: "/encargo", texto: "Hacer un encargo" },
  { href: "/como-comprar", texto: "Cómo comprar" },
  { href: "/sobre-mi", texto: "Quién teje" },
];

export function Navegacion() {
  const ruta = usePathname();
  // El enlace más específico que coincide es el activo (Personalizados gana a Catálogo).
  const activo = enlaces
    .filter((e) => ruta === e.href || ruta.startsWith(e.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  return (
    <nav aria-label="Principal" className={estilos.nav}>
      <ul>
        {enlaces.map((e) => (
          <li key={e.href}>
            <Link href={e.href} aria-current={e.href === activo ? "page" : undefined}>
              {e.texto}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
