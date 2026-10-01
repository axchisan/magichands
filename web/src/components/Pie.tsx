import Image from "next/image";
import Link from "next/link";
import { categorias } from "@/lib/catalogo";
import { negocio, esDemo } from "@/lib/config";
import { IconoInstagram } from "./Iconos";
import estilos from "./Pie.module.css";

export function Pie() {
  return (
    <footer className={estilos.pie}>
      <div className={`envoltura ${estilos.rejilla}`}>
        <div className={estilos.marca}>
          <Image src="/img/marca/logo-completo.webp" alt="Logo de Magic H4nds" width={180} height={180} unoptimized />
          <p>
            Tejido a mano en {negocio.ciudad}.<br />
            Bajo pedido y con envíos a todo Colombia.
          </p>
          <a className={estilos.ig} href={negocio.instagram} target="_blank" rel="noopener noreferrer">
            <IconoInstagram /> @magic.h4nds
          </a>
        </div>
        <nav aria-label="Categorías">
          <h2 className={estilos.titulo}>Catálogo</h2>
          <ul>
            {categorias.map((c) => (
              <li key={c.slug}>
                <Link href={`/catalogo/${c.slug}`}>{c.nombre}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Ayuda">
          <h2 className={estilos.titulo}>Comprar</h2>
          <ul>
            <li><Link href="/encargo">Hacer un encargo</Link></li>
            <li><Link href="/como-comprar">Cómo comprar</Link></li>
            <li><Link href="/pedido">Seguir mi pedido</Link></li>
            <li><Link href="/sobre-mi">Quién teje</Link></li>
            <li><Link href="/privacidad">Privacidad</Link></li>
            <li><Link href="/terminos">Condiciones</Link></li>
          </ul>
        </nav>
      </div>
      {esDemo && (
        <p className={`envoltura ${estilos.demo}`}>
          Versión de muestra preparada para Magic H4nds. Las fotos y los textos de productos son suyos, tomados
          de su Instagram; los pedidos de ejemplo son ficticios.
        </p>
      )}
    </footer>
  );
}
