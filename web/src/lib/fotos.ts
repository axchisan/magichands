// Fotos subidas desde el panel: el navegador genera 3 versiones WebP y las sube a Vercel Blob como
// productos/<slug>/<id>-{480,960,1440}.webp. En la base se guarda la URL sin el sufijo (como las
// estáticas: /img/p/<slug>/01), y el cargador de imágenes le agrega -<ancho>.webp.
// Safari (iPhone) no genera WebP desde el navegador: ahí se suben JPEG y la clave termina en "~jpg".
export const ANCHOS_FOTO = [480, 960, 1440] as const;

export const RUTA_FOTO = /^productos\/[a-z0-9-]{1,80}\/[a-z0-9]{12}-(480|960|1440)\.(webp|jpg)$/;

/** Archivos de una foto subida a partir de su clave. */
export function archivosDeFoto(clave: string): string[] {
  const jpg = clave.endsWith("~jpg");
  const base = jpg ? clave.slice(0, -4) : clave;
  return ANCHOS_FOTO.map((a) => `${base}-${a}.${jpg ? "jpg" : "webp"}`);
}

/** URL base válida de una foto subida para ese producto (evita guardar URLs ajenas). */
export function esClaveDeBlob(clave: string, slug: string): boolean {
  return new RegExp(`^https://[a-z0-9]+\\.public\\.blob\\.vercel-storage\\.com/productos/${slug}/[a-z0-9]{12}(~jpg)?$`).test(clave);
}
