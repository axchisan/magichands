import Image from "next/image";
import Link from "next/link";
import { fotosHero } from "@/lib/catalogo";
import { BotonWhatsApp } from "./BotonWhatsApp";
import estilos from "./CirculoManos.module.css";

// Portada: las fotos de producto sostenido en la mano rodean el titular,
// como las manos del logo rodean el "MH4".
export function CirculoManos() {
  return (
    <section className={estilos.hero} aria-labelledby="hero-titulo">
      <div className={estilos.escena}>
        <div className={estilos.centro}>
          <h1 id="hero-titulo" className={estilos.titulo}>
            Lo que imaginas, tejido punto por punto
          </h1>
          <p className={estilos.bajada}>
            Amigurumis personalizados, flores que no se marchitan y ropa tejida a mano en Vélez, Santander.
            Bajo pedido y con envíos a todo Colombia.
          </p>
          <div className={estilos.acciones}>
            <Link href="/catalogo" className="boton boton-principal">
              Ver el catálogo
            </Link>
            <BotonWhatsApp texto="Hola Magic H4nds 💗 Quiero hacer un pedido.">Pedir por WhatsApp</BotonWhatsApp>
          </div>
        </div>
        <ul className={estilos.manos} role="list">
          {fotosHero.map((f, i) => (
            <li key={f.producto} style={{ "--i": i } as React.CSSProperties}>
              <Link href={`/p/${f.producto}`} className={estilos.mano}>
                <Image
                  src={f.src}
                  alt={f.nombre}
                  width={f.ancho}
                  height={f.alto}
                  sizes="(max-width: 52rem) 40vw, 12rem"
                  // Todas están arriba de la página; la primera es la candidata a LCP en móvil.
                  loading="eager"
                  fetchPriority={i === 0 ? "high" : undefined}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
