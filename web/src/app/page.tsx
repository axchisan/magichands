import Image from "next/image";
import Link from "next/link";
import { CirculoManos } from "@/components/CirculoManos";
import { RejillaProductos } from "@/components/TarjetaProducto";
import { PasosPedido } from "@/components/PasosPedido";
import { categorias, destacados, productosDe, fotosMarca } from "@/lib/catalogo";
import estilos from "./inicio.module.css";

export default function Inicio() {
  const velez = fotosMarca["hecho-en-velez"];
  return (
    <>
      <CirculoManos />

      <section className={`envoltura ${estilos.seccion}`} aria-labelledby="destacados">
        <div className={estilos.encabezado}>
          <h2 id="destacados">Lo que más piden</h2>
          <Link href="/catalogo">Ver todo el catálogo</Link>
        </div>
        <RejillaProductos productos={destacados} />
      </section>

      <section className={`envoltura ${estilos.seccion}`} aria-labelledby="categorias">
        <h2 id="categorias">Busca por lo que quieres tejer</h2>
        <ul className={estilos.categorias} role="list">
          {categorias.map((c) => {
            const portada = productosDe(c.slug)[0]?.fotos[0];
            return (
              <li key={c.slug}>
                <Link href={`/catalogo/${c.slug}`} className={estilos.categoria}>
                  {portada && (
                    <Image src={portada.src} alt="" width={portada.ancho} height={portada.alto} sizes="5rem" />
                  )}
                  <span className={estilos.catTexto}>
                    <span className={estilos.catNombre}>{c.nombre}</span>
                    <span className={estilos.catDesc}>{c.descripcion}</span>
                  </span>
                  <span className={estilos.catTotal} aria-label={`${c.total} productos`}>
                    {c.total}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={estilos.pasosFondo} aria-labelledby="como">
        <div className="envoltura">
          <h2 id="como">Así se hace tu encargo</h2>
          <PasosPedido />
          <p className={estilos.masInfo}>
            <Link href="/como-comprar">Formas de pago, envíos y preguntas frecuentes</Link>
          </p>
        </div>
      </section>

      <section className={`envoltura ${estilos.seccion} ${estilos.velez}`} aria-labelledby="velez">
        <div className={estilos.velezFotos}>
          {velez.slice(0, 3).map((f, i) => (
            <Image
              key={f.src}
              src={f.src}
              alt={i === 0 ? "Bolso tejido con girasol, lucido con el traje típico veleño" : ""}
              width={f.ancho}
              height={f.alto}
              sizes="(max-width: 48rem) 45vw, 22rem"
            />
          ))}
        </div>
        <div className={estilos.velezTexto}>
          <h2 id="velez">Hecho en Vélez, Santander</h2>
          <p>
            Cada pieza se teje a mano en Vélez, tierra de la Guabina y el Tiple. Por eso hay campesinas veleñas,
            bolsos para las ferias y muchas fotos con el cielo y los tejados del pueblo de fondo.
          </p>
          <p>
            Desde 2021 tejemos amigurumis, flores, ropa y accesorios por encargo y los enviamos a todo Colombia.
          </p>
          <Link href="/sobre-mi" className="boton boton-borde">
            Conoce quién teje
          </Link>
        </div>
      </section>
    </>
  );
}
