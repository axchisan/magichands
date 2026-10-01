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
