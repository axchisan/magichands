import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Galeria } from "@/components/Galeria";
import { BotonWhatsApp } from "@/components/BotonWhatsApp";
import { RejillaProductos } from "@/components/TarjetaProducto";
import { categoria, producto, productos, relacionados } from "@/lib/catalogo";
import { mensajeProducto } from "@/lib/whatsapp";
import { negocio } from "@/lib/config";
import estilos from "./ficha.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/p/[slug]">): Promise<Metadata> {
  const p = producto((await params).slug);
  if (!p) return {};
  return {
    title: p.nombre,
    description: p.descripcion,
    openGraph: { images: [`${p.fotos[0].src}-960.webp`] },
  };
}

const precio = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default async function Ficha({ params }: PageProps<"/p/[slug]">) {
  const p = producto((await params).slug);
  if (!p) notFound();
  const cat = categoria(p.categoria)!;
  const otros = relacionados(p);

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
                {negocio.mostrarPrecios && p.precioReferencia ? (
                  <>
                    {precio.format(p.precioReferencia.valor)}
                    <span className={estilos.nota}>
                      Precio publicado en {p.precioReferencia.anio} para: {p.precioReferencia.producto}. Se confirma
                      al cotizar.
                    </span>
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
