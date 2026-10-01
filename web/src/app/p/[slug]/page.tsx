import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Galeria } from "@/components/Galeria";
import { BotonWhatsApp } from "@/components/BotonWhatsApp";
import { RejillaProductos } from "@/components/TarjetaProducto";
import { catalogo, categoriaPorSlug, productoPorSlug, relacionados } from "@/lib/catalogo-db";
import { ajustes } from "@/lib/ajustes";
import { mensajeProducto } from "@/lib/whatsapp";
import estilos from "./ficha.module.css";

// Los productos nuevos del panel se generan en su primera visita.
export async function generateStaticParams() {
  return (await catalogo()).productos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/p/[slug]">): Promise<Metadata> {
  const p = await productoPorSlug((await params).slug);
  if (!p) return {};
  return {
    title: p.nombre,
    description: p.descripcion,
    openGraph: {
      title: `${p.nombre} · Magic H4nds`,
      description: p.descripcion,
      siteName: "Magic H4nds",
      locale: "es_CO",
      type: "website",
      images: [imagenParaCompartir(p)],
    },
    twitter: { card: "summary_large_image", images: [imagenParaCompartir(p).url] },
  };
}

/** Productos del catálogo inicial: tarjeta 1200x630 en JPG (scripts/og_imagen.py). Los creados en el
 *  panel usan su foto de portada (JPEG si se subió desde iPhone, si no WebP). */
function imagenParaCompartir(p: { slug: string; nombre: string; fotos: { src: string }[] }) {
  const src = p.fotos[0].src;
  if (src.startsWith("/img/p/")) return { url: `/img/p/${p.slug}/og.jpg`, width: 1200, height: 630, alt: p.nombre };
  return { url: src.endsWith("~jpg") ? `${src.slice(0, -4)}-960.jpg` : `${src}-960.webp`, alt: p.nombre };
}

const precio = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default async function Ficha({ params }: PageProps<"/p/[slug]">) {
  const p = await productoPorSlug((await params).slug);
  if (!p) notFound();
  const cat = (await categoriaPorSlug(p.categoria))!;
  const otros = await relacionados(p);
  const { mostrarPrecios } = await ajustes();

  return (
    <div className="envoltura">
      <nav aria-label="Ruta" className={estilos.migas}>
        <ol>
          <li><Link href="/catalogo">Catálogo</Link></li>
          <li><Link href={`/catalogo/${cat.slug}`}>{cat.nombre}</Link></li>
          <li aria-current="page">{p.nombre}</li>
        </ol>
      </nav>

      <div className={estilos.ficha}>
        <Galeria fotos={p.fotos} nombre={p.nombre} />

        <div className={estilos.info}>
          <h1 className={estilos.nombre}>{p.nombre}</h1>
          <p className={estilos.descripcion}>{p.descripcion}</p>

          <dl className={estilos.datos}>
            {p.tamano && (
              <div>
                <dt>Tamaño</dt>
                <dd>{p.tamano}</dd>
              </div>
            )}
            <div>
              <dt>Tiempo de elaboración</dt>
              <dd>{p.plazo}</dd>
            </div>
            <div>
              <dt>Envío</dt>
              <dd>A todo Colombia, se paga al recibir</dd>
            </div>
            <div>
              <dt>Precio</dt>
              <dd>
                {mostrarPrecios && p.precio ? (
                  <>
                    Desde {precio.format(p.precio)}
                    <span className={estilos.nota}>El precio final depende de tu diseño y se confirma al cotizar.</span>
                  </>
                ) : (
                  "Se cotiza según tu diseño"
                )}
              </dd>
            </div>
          </dl>

          {p.personalizacion.length > 0 && (
            <div className={estilos.personalizacion}>
              <h2>Puedes elegir</h2>
              <ul>
                {p.personalizacion.map((x) => (
                  <li key={x}>{x.charAt(0).toUpperCase() + x.slice(1)}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={estilos.acciones}>
            <Link href={`/encargo?producto=${p.slug}`} className="boton boton-principal">
              Encargar este producto
            </Link>
            <BotonWhatsApp texto={mensajeProducto(p.nombre)}>Preguntar por WhatsApp</BotonWhatsApp>
          </div>
          {/* En celular, las mismas acciones quedan fijas abajo mientras se ve la ficha */}
          <div className={estilos.barra}>
            <Link href={`/encargo?producto=${p.slug}`} className="boton boton-principal">
              Encargar
            </Link>
            <BotonWhatsApp texto={mensajeProducto(p.nombre)} className={estilos.barraWa}>
              <span className="visualmente-oculto">WhatsApp</span>
            </BotonWhatsApp>
          </div>
          <p className={estilos.pagos}>
            Separas con el 50 % y pagas el resto cuando esté listo, o en 3 cuotas.{" "}
            <Link href="/como-comprar">Cómo comprar</Link>
          </p>
        </div>
      </div>

      {otros.length > 0 && (
        <section className={estilos.relacionados} aria-labelledby="relacionados">
          <h2 id="relacionados">Más de {cat.nombre.toLowerCase()}</h2>
          <RejillaProductos productos={otros} />
        </section>
      )}
    </div>
  );
}
