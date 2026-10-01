// Catálogo inicial curado de su Instagram (src/data/catalogo.json). Solo lo usan la carga inicial de la
// base de datos (scripts/semilla.ts) y las pruebas de integridad; la web lee de la base de datos.
import datos from "@/data/catalogo.json";
import type { Foto } from "./catalogo";

export type PrecioReferencia = { valor: number; texto: string; producto: string; fuente: string; anio: string };

export type ProductoSemilla = {
  slug: string;
  categoria: string;
  nombre: string;
  descripcion: string;
  personalizacion: string[];
  tamano: string | null;
  plazo: string;
  destacado: boolean;
  /** Lo que ella publicó (con fuente y año). Referencia interna: no se muestra en la web. */
  precioReferencia: PrecioReferencia | null;
  ocasiones: string[];
  fotos: Foto[];
};

export const categoriasSemilla = datos.categorias as { slug: string; nombre: string; descripcion: string; total: number }[];
export const productosSemilla = datos.productos as ProductoSemilla[];
