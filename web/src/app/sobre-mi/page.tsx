import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fotosMarca, type Foto } from "@/lib/catalogo";
import { negocio } from "@/lib/config";
import { BotonWhatsApp } from "@/components/BotonWhatsApp";
import estilos from "./sobre-mi.module.css";

export const metadata: Metadata = {
  title: "Quién teje",
  description: "Magic H4nds nace en Vélez, Santander: amigurumis, flores y ropa tejidos a mano desde 2021.",
};

function Foto({ f, alt, sizes, clase }: { f: Foto; alt: string; sizes: string; clase?: string }) {
  return <Image className={clase} src={f.src} alt={alt} width={f.ancho} height={f.alto} sizes={sizes} />;
}

export default function SobreMi() {
  const [retrato, conPieza, conBlusa] = fotosMarca["quien-teje"];
  const proceso = fotosMarca["proceso-tejiendo"];
  const base = fotosMarca["base-grabada"];
  const velez = fotosMarca["hecho-en-velez"];
  const orgullo = [velez[1], velez[5], velez[3], velez[6]];

  return (
    <div className={estilos.pagina}>
      <section className={`envoltura ${estilos.intro}`}>
        <div className={estilos.introTexto}>
          <h1>Manos que tejen en Vélez</h1>
          <p className={estilos.entrada}>
            Magic H4nds empezó en 2021 en Vélez, Santander, con llaveros, tops y abejitas. Hoy tejemos personas,
            mascotas, personajes, flores y ropa, todo a mano y punto por punto.
          </p>
          <p>
            Cada pedido se hace para alguien en particular: por eso preguntamos todos los detalles y cuidamos el empaque
            de cada envío.
          </p>
        </div>
        <Image
          className={estilos.retrato}
          src={retrato.src}
          alt="Sonriendo con traje típico veleño y un bolso tejido de Magic H4nds"
          width={retrato.ancho}
          height={retrato.alto}
          sizes="(max-width: 48rem) 100vw, 26rem"
          loading="eager"
          fetchPriority="high"
        />
      </section>

      <section className={estilos.proceso} aria-labelledby="proceso">
        <div className="envoltura">
          <h2 id="proceso">Del ovillo a la pieza</h2>
          <p className={estilos.parrafo}>
            Así nació la blusa Orquídea, una de nuestras piezas más queridas: primero cada pétalo por separado, luego
            el armado y al final, puesta.
          </p>
        </div>
        <ol className={estilos.tira}>
          <li>
            <Foto f={proceso[0]} alt="Manos tejiendo el primer pétalo en hilo rosado" sizes="(max-width: 48rem) 70vw, 17rem" />
            <span>Tejer cada pétalo</span>
          </li>
          <li>
            <Foto f={proceso[1]} alt="Los pétalos terminados, sostenidos frente a la cámara" sizes="(max-width: 48rem) 70vw, 17rem" />
            <span>Revisar las piezas</span>
          </li>
          <li>
            <Foto f={proceso[2]} alt="Manos uniendo las piezas de la blusa" sizes="(max-width: 48rem) 70vw, 17rem" />
            <span>Unir todo</span>
          </li>
          <li>
            <Foto f={conBlusa} alt="La blusa Orquídea terminada y puesta" sizes="(max-width: 48rem) 70vw, 17rem" />
            <span>¡Lista!</span>
          </li>
        </ol>
      </section>

      <section className={`envoltura ${estilos.dos}`} aria-labelledby="base">
        <div>
          <h2 id="base">Con su base grabada</h2>
          <p className={estilos.parrafo}>
            Los personalizados se entregan sobre una base de madera con el nombre de la marca. Si quieres protegerlos
            del polvo, también los hacemos en cúpula de vidrio.
          </p>
          <Link href="/catalogo/personalizados" className="boton boton-borde">
            Ver personalizados
          </Link>
        </div>
        <ul className={estilos.cuadricula} role="list">
          {base.map((f, i) => (
            <li key={f.src}>
              <Foto
                f={f}
                alt={["Funko de policía sobre su base grabada", "Papá e hija tejidos en una misma base", "Perrita tejida sobre base grabada", "Graduado tejido con su guitarra"][i] ?? ""}
                sizes="(max-width: 48rem) 45vw, 14rem"
              />
            </li>
          ))}
        </ul>
      </section>

      <section className={`envoltura ${estilos.velez}`} aria-labelledby="pueblo">
        <h2 id="pueblo">Orgullo veleño</h2>
        <p className={estilos.parrafo}>
          Vélez es la capital folclórica de Colombia. Para sus ferias tejemos bolsos que se lucen con el traje típico,
          y muchas de nuestras fotos tienen de fondo sus tejados y su cielo.
        </p>
        <ul className={estilos.mosaico} role="list">
          {orgullo.map((f, i) => (
            <li key={f.src}>
              <Foto
                f={f}
                alt={["Dos amigas con traje típico veleño y bolsos tejidos", "Bolso tejido con flor, sostenido con el traje típico", "Amigurumi de campesina veleña", "Detalle del bolso tejido con el traje típico"][i] ?? ""}
                sizes="(max-width: 48rem) 50vw, 18rem"
              />
            </li>
          ))}
        </ul>
      </section>

      <section className={`envoltura ${estilos.cierre}`}>
        <Image
          className={estilos.cierreFoto}
          src={conPieza.src}
          alt="Sonriendo mientras muestra un pétalo de la blusa Orquídea"
          width={conPieza.ancho}
          height={conPieza.alto}
          sizes="8rem"
        />
        <div>
          <h2>¿Tienes una idea?</h2>
          <p>Cuéntanosla y la tejemos para ti. También puedes seguirnos en Instagram.</p>
          <div className={estilos.acciones}>
            <Link href="/encargo" className="boton boton-principal">
              Hacer un encargo
            </Link>
            <BotonWhatsApp texto="Hola Magic H4nds 💗 Tengo una idea para un encargo.">Escribir por WhatsApp</BotonWhatsApp>
          </div>
          <a className={estilos.ig} href={negocio.instagram} target="_blank" rel="noopener noreferrer">
            @magic.h4nds en Instagram
          </a>
        </div>
      </section>
    </div>
  );
}
