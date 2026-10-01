// Tipos del catálogo y fotos fijas de la marca (portada y "Quién teje").
// Los productos y categorías se leen de la base de datos: ver catalogo-db.ts.
import datos from "@/data/catalogo.json";

export type Foto = {
  src: string;
  ancho: number;
  alto: number;
  alt?: string;
  ia?: boolean;
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
  /** Precio que ella confirmó en el panel (solo se muestra si activa "Mostrar precios"). */
  precio: number | null;
  ocasiones: string[];
  fotos: Foto[];
};

export type Categoria = { slug: string; nombre: string; descripcion: string; total: number };
export type Ocasion = { slug: string; nombre: string };

export const ocasiones = datos.ocasiones as Ocasion[];
export const fotosHero = datos.hero as (Foto & { producto: string; nombre: string })[];
export const fotosMarca = datos.marca as Record<string, Foto[]>;
