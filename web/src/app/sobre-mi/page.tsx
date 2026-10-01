import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fotosMarca } from "@/lib/catalogo";
import { negocio } from "@/lib/config";
import estilos from "./sobre-mi.module.css";

export const metadata: Metadata = {
  title: "Quién teje",
  description: "Magic H4nds nace en Vélez, Santander: amigurumis, flores y ropa tejidos a mano desde 2021.",
};

export default function SobreMi() {
  const proceso = fotosMarca["proceso-tejiendo"];
  const velez = fotosMarca["hecho-en-velez"];
  const base = fotosMarca["base-grabada"];
  return (
    <div className={`envoltura ${estilos.pagina}`}>
      <section className={estilos.intro}>
        <div className={estilos.texto}>
          <h1>Manos que tejen en Vélez</h1>
          <p>
            Magic H4nds empezó en 2021 en Vélez, Santander, con llaveros, tops y abejitas. Hoy tejemos personas,
            mascotas, personajes, flores y ropa, todo a mano y punto por punto.
          </p>
          <p>
            Cada pedido se hace para alguien en particular: por eso preguntamos todos los detalles y cuidamos el
            empaque de cada envío.
          </p>
        </div>
        <Image
          className={estilos.principal}
          src={proceso[0].src}
          alt="Manos tejiendo a crochet la blusa Orquídea en hilo rosado"
          width={proceso[0].ancho}
          height={proceso[0].alto}
          sizes="(max-width: 48rem) 100vw, 28rem"
          loading="eager"
          fetchPriority="high"
        />
      </section>

      <section className={estilos.bloque} aria-labelledby="proceso">
        <h2 id="proceso">Del ovillo a la pieza</h2>
        <ul className={estilos.fotos} role="list">
          {proceso.slice(1).map((f, i) => (
            <li key={f.src}>
              <Image
                src={f.src}
                alt={["Tejiendo una de las piezas", "La pieza tomando forma", "La blusa casi terminada"][i] ?? ""}
                width={f.ancho}
                height={f.alto}
                sizes="(max-width: 48rem) 45vw, 18rem"
              />
            </li>
          ))}
        </ul>
      </section>

      <section className={estilos.bloque} aria-labelledby="base">
        <h2 id="base">Con su base grabada</h2>
        <p className={estilos.parrafo}>
          Los personalizados se entregan sobre una base de madera con el nombre de la marca. Si quieres protegerlos del
          polvo, también los hacemos en cúpula de vidrio.
        </p>
        <ul className={estilos.fotos} role="list">
          {base.map((f) => (
            <li key={f.src}>
              <Image src={f.src} alt="" width={f.ancho} height={f.alto} sizes="(max-width: 48rem) 45vw, 18rem" />
            </li>
          ))}
        </ul>
      </section>

      <section className={estilos.bloque} aria-labelledby="pueblo">
        <h2 id="pueblo">Orgullo veleño</h2>
        <p className={estilos.parrafo}>
          Vélez es la capital folclórica de Colombia. Para sus ferias tejemos bolsos que se lucen con el traje típico, y
          muchas de nuestras fotos tienen de fondo sus tejados y su cielo.
        </p>
        <ul className={estilos.fotos} role="list">
          {velez.slice(0, 4).map((f) => (
            <li key={f.src}>
              <Image src={f.src} alt="" width={f.ancho} height={f.alto} sizes="(max-width: 48rem) 45vw, 18rem" />
            </li>
          ))}
        </ul>
      </section>

      <p className={estilos.cierre}>
        Síguenos en <a href={negocio.instagram}>Instagram @magic.h4nds</a> o{" "}
        <Link href="/encargo">haz tu encargo</Link>.
      </p>
    </div>
  );
}
