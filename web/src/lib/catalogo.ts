import datos from "@/data/catalogo.json";

export type Foto = {
  src: string;
  ancho: number;
  alto: number;
  alt?: string;
  ia?: boolean;
};

export type PrecioReferencia = {
  valor: number;
  texto: string;
  producto: string;
  fuente: string;
  anio: string;
};

export type Producto = {
  slug: string;
  categoria: string;
  nombre: string;
  descripcion: string;
  personalizacion: string[];
  tamano: string | null;
  plazo: string;
  destacado: boolean;
  precioReferencia: PrecioReferencia | null;
  ocasiones: string[];
  fotos: Foto[];
};

export type Categoria = { slug: string; nombre: string; descripcion: string; total: number };
export type Ocasion = { slug: string; nombre: string };

export const categorias = datos.categorias as Categoria[];
export const ocasiones = datos.ocasiones as Ocasion[];
export const productos = datos.productos as Producto[];
export const fotosHero = datos.hero as (Foto & { producto: string; nombre: string })[];
export const fotosMarca = datos.marca as Record<string, Foto[]>;

export function producto(slug: string): Producto | undefined {
  return productos.find((p) => p.slug === slug);
}

export function categoria(slug: string): Categoria | undefined {
  return categorias.find((c) => c.slug === slug);
}

export function productosDe(categoriaSlug: string): Producto[] {
  return productos.filter((p) => p.categoria === categoriaSlug);
}

export const destacados = productos.filter((p) => p.destacado);

/** Otros productos de la misma categoría, sin repetir el actual. */
export function relacionados(p: Producto, max = 4): Producto[] {
  return productos.filter((x) => x.categoria === p.categoria && x.slug !== p.slug).slice(0, max);
}
