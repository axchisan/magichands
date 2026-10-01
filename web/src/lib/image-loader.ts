// Cargador de next/image: las fotos existen en /img/.../NN-{480,960,1440}.webp
// (las genera scripts/exportar_web.py). Se elige la variante más pequeña que cubre el ancho pedido.
export const ANCHOS = [480, 960, 1440] as const;

export function elegirAncho(ancho: number): number {
  return ANCHOS.find((a) => a >= ancho) ?? ANCHOS[ANCHOS.length - 1];
}

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  // Rutas que ya traen extensión (logos) se sirven tal cual.
  if (/\.(webp|png|jpe?g|svg)$/.test(src)) return src;
  // Fotos subidas desde un iPhone (JPEG en vez de WebP): clave terminada en "~jpg".
  if (src.endsWith("~jpg")) return `${src.slice(0, -4)}-${elegirAncho(width)}.jpg`;
  return `${src}-${elegirAncho(width)}.webp`;
}
