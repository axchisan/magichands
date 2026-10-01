// Validación de los datos del encargo (se usa en el servidor; el navegador ya valida con HTML).

export type DatosEncargo = {
  producto: string;
  detalle: string;
  colores: string;
  tamano: string;
  fecha: string;
  urgente: boolean;
  nombre: string;
  ciudad: string;
  telefono: string;
};

export type ResultadoValidacion = { ok: true; datos: DatosEncargo } | { ok: false; errores: Partial<Record<keyof DatosEncargo, string>> };

const limpiar = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

export function validarEncargo(f: FormData): ResultadoValidacion {
  const datos: DatosEncargo = {
    producto: limpiar(f.get("producto"), 80),
    detalle: limpiar(f.get("detalle"), 2000),
    colores: limpiar(f.get("colores"), 200),
    tamano: limpiar(f.get("tamano"), 120),
    fecha: limpiar(f.get("fecha"), 10),
    urgente: f.get("urgente") === "si",
    nombre: limpiar(f.get("nombre"), 120),
    ciudad: limpiar(f.get("ciudad"), 120),
    telefono: limpiar(f.get("telefono"), 20).replace(/\D/g, ""),
  };
  const errores: Partial<Record<keyof DatosEncargo, string>> = {};
  if (datos.detalle.length < 10) errores.detalle = "Escribe al menos una frase con lo que quieres (10 letras o más).";
  if (!datos.nombre) errores.nombre = "Escribe tu nombre.";
  if (!datos.ciudad) errores.ciudad = "Escribe la ciudad a la que enviamos.";
  if (!/^3\d{9}$/.test(datos.telefono)) errores.telefono = "Escribe un celular colombiano de 10 dígitos que empiece por 3.";
  if (datos.fecha && !/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha)) errores.fecha = "Fecha no válida.";
  if (datos.producto && !/^[a-z0-9-]+$/.test(datos.producto)) errores.producto = "Producto no válido.";
  return Object.keys(errores).length ? { ok: false, errores } : { ok: true, datos };
}

// ---------------------------------------------------------------- Productos (panel)

export type DatosProducto = {
  nombre: string;
  categoria: string;
  descripcion: string;
  personalizacion: string[];
  tamano: string | null;
  plazo: string;
  ocasiones: string[];
  precio: number | null;
  destacado: boolean;
  activo: boolean;
};

export type ResultadoProducto = { ok: true; datos: DatosProducto } | { ok: false; errores: Partial<Record<keyof DatosProducto, string>> };

export function validarProducto(f: FormData, validos: { categorias: string[]; ocasiones: string[] }): ResultadoProducto {
  const precioCrudo = limpiar(f.get("precio"), 20).replace(/\D/g, "");
  const datos: DatosProducto = {
    nombre: limpiar(f.get("nombre"), 80),
    categoria: limpiar(f.get("categoria"), 60),
    descripcion: limpiar(f.get("descripcion"), 1500),
    personalizacion: String(f.get("personalizacion") ?? "")
      .split("\n")
      .map((l) => l.trim().replace(/^[-•·]\s*/, ""))
      .filter(Boolean)
      .slice(0, 12)
      .map((l) => l.slice(0, 80)),
    tamano: limpiar(f.get("tamano"), 120) || null,
    plazo: limpiar(f.get("plazo"), 60) || "15 a 20 días hábiles",
    ocasiones: f.getAll("ocasiones").map(String).filter((o) => validos.ocasiones.includes(o)),
    precio: precioCrudo ? Number(precioCrudo) : null,
    destacado: f.get("destacado") === "si",
    activo: f.get("activo") === "si",
  };
  const errores: Partial<Record<keyof DatosProducto, string>> = {};
  if (datos.nombre.length < 3) errores.nombre = "Escribe el nombre del producto.";
  if (!validos.categorias.includes(datos.categoria)) errores.categoria = "Elige una categoría.";
  if (datos.descripcion.length < 10) errores.descripcion = "Escribe una descripción corta (10 letras o más).";
  if (datos.precio !== null && (datos.precio < 1000 || datos.precio > 50_000_000)) errores.precio = "Escribe el precio en pesos, sin puntos (ej.: 85000).";
  return Object.keys(errores).length ? { ok: false, errores } : { ok: true, datos };
}

/** "Ramo de Tulipanes Rosados" -> "ramo-de-tulipanes-rosados" */
export function aSlug(t: string): string {
  return t
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}
