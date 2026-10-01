"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { negocio, panelAbierto } from "@/lib/config";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import { IconoInstagram, IconoWhatsApp } from "./Iconos";
import { EnlaceCuenta } from "./EnlaceCuenta";
import estilos from "./Cabecera.module.css";

export const enlaces = [
  { href: "/catalogo", texto: "Catálogo" },
  { href: "/catalogo/personalizados", texto: "Personalizados" },
  { href: "/encargo", texto: "Hacer un encargo" },
  { href: "/pedido", texto: "Seguir mi pedido", soloMenu: true },
  { href: "/como-comprar", texto: "Cómo comprar" },
  { href: "/sobre-mi", texto: "Quién teje" },
];

function useActivo() {
  const ruta = usePathname();
  // El enlace más específico que coincide es el activo (Personalizados gana a Catálogo).
  return enlaces
    .filter((e) => ruta === e.href || ruta.startsWith(e.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

/** Navegación en línea para pantallas anchas. */
export function Navegacion() {
  const activo = useActivo();
  return (
    <nav aria-label="Principal" className={estilos.nav}>
      <ul>
        {enlaces
          .filter((e) => !e.soloMenu)
          .map((e) => (
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

/** Botón "Menú" y panel lateral para celular (diálogo modal nativo: foco atrapado, Esc cierra). */
export function MenuMovil() {
  const activo = useActivo();
  const ruta = usePathname();
  const dialogo = useRef<HTMLDialogElement>(null);

  // Al navegar, se cierra el panel.
  useEffect(() => {
    dialogo.current?.close();
  }, [ruta]);

  return (
    <>
      <button
        type="button"
        className={estilos.botonMenu}
        aria-haspopup="dialog"
        aria-controls="menu-movil"
        onClick={() => dialogo.current?.showModal()}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
        Menú
      </button>
      <dialog
        id="menu-movil"
        ref={dialogo}
        className={estilos.panel}
        aria-label="Menú"
        // Tocar fuera del panel (el fondo oscuro) lo cierra.
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      >
        <div className={estilos.panelContenido}>
          <div className={estilos.panelCabeza}>
            <span className={estilos.panelMarca}>Magic H4nds</span>
            <button type="button" className={estilos.cerrar} onClick={() => dialogo.current?.close()} aria-label="Cerrar menú">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav aria-label="Principal (menú)">
            <ul className={estilos.panelLista}>
              {enlaces.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} aria-current={e.href === activo ? "page" : undefined}>
                    {e.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={estilos.panelPie}>
            {panelAbierto && (
              <Link href="/admin/pedidos" className={estilos.menuCuenta}>
                Panel de pedidos
              </Link>
            )}
            <EnlaceCuenta variante="menu" />
            <a
              className="boton boton-whatsapp"
              href={enlaceWhatsApp("Hola Magic H4nds 💗 Tengo una pregunta.", negocio.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconoWhatsApp /> Escribir por WhatsApp
            </a>
            <a className={estilos.panelIg} href={negocio.instagram} target="_blank" rel="noopener noreferrer">
              <IconoInstagram /> @magic.h4nds
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
