import Image from "next/image";
import Link from "next/link";
import type { Producto } from "@/lib/catalogo";
import estilos from "./TarjetaProducto.module.css";

export function TarjetaProducto({ producto, prioridad = false }: { producto: Producto; prioridad?: boolean }) {
  const foto = producto.fotos[0];
  const detalle = [producto.tamano, producto.personalizacion.length > 0 ? "Personalizable" : null]
    .filter(Boolean)
    .join(", ");
  return (
    <article className={estilos.tarjeta}>
      <Link href={`/p/${producto.slug}`} className={estilos.enlace}>
        <div className={estilos.foto}>
          <Image
            src={foto.src}
            alt={foto.alt ?? producto.nombre}
            width={foto.ancho}
            height={foto.alto}
            sizes="(max-width: 40rem) 50vw, (max-width: 72rem) 33vw, 22rem"
            loading={prioridad ? "eager" : "lazy"}
          />
        </div>
        <h3 className={estilos.nombre}>{producto.nombre}</h3>
      </Link>
      {detalle && <p className={estilos.detalle}>{detalle}</p>}
    </article>
  );
}

export function RejillaProductos({ productos, prioridad = 0 }: { productos: Producto[]; prioridad?: number }) {
  return (
    <ul className={estilos.rejilla} role="list">
      {productos.map((p, i) => (
        <li key={p.slug}>
          <TarjetaProducto producto={p} prioridad={i < prioridad} />
        </li>
      ))}
    </ul>
  );
}
