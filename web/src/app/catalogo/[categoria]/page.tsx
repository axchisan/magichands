import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RejillaProductos } from "@/components/TarjetaProducto";
import { categoria, categorias, productosDe } from "@/lib/catalogo";
import estilos from "../catalogo.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return categorias.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/catalogo/[categoria]">): Promise<Metadata> {
  const c = categoria((await params).categoria);
  return c ? { title: c.nombre, description: c.descripcion } : {};
}

export default async function PaginaCategoria({ params }: PageProps<"/catalogo/[categoria]">) {
  const c = categoria((await params).categoria);
  if (!c) notFound();
  const lista = productosDe(c.slug);
  return (
    <div className={`envoltura ${estilos.pagina}`}>
      <nav aria-label="Ruta" className={estilos.migas}>
        <ol>
          <li><Link href="/catalogo">Catálogo</Link></li>
          <li aria-current="page">{c.nombre}</li>
        </ol>
      </nav>
      <h1 className={estilos.titulo}>{c.nombre}</h1>
      <p className={estilos.intro}>{c.descripcion}</p>
      <div style={{ marginTop: "2.5rem" }}>
        <h2 className="visualmente-oculto">Productos de {c.nombre}</h2>
        <RejillaProductos productos={lista} prioridad={4} />
      </div>
      <div className={estilos.cta}>
        <p>¿No ves lo que buscas? Casi todo se puede tejer por encargo.</p>
        <Link href="/encargo" className="boton boton-principal">
          Contar mi idea
        </Link>
      </div>
      <nav className={estilos.otras} aria-labelledby="otras">
        <h2 id="otras">Otras categorías</h2>
        <ul>
          {categorias
            .filter((x) => x.slug !== c.slug)
            .map((x) => (
              <li key={x.slug}>
                <Link href={`/catalogo/${x.slug}`}>{x.nombre}</Link>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
}
