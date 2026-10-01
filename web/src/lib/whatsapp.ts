// Construcción del mensaje de pedido y del enlace de WhatsApp (wa.me).

export type Encargo = {
  codigo: string;
  producto?: string;
  detalle: string;
  colores?: string;
  tamano?: string;
  fecha?: string;
  urgente?: boolean;
  nombre: string;
  ciudad: string;
};

/** Código corto y legible para el pedido: MH4- + 4 caracteres sin ambiguos (sin 0/O, 1/I). */
export function nuevoCodigo(aleatorio: () => number = Math.random): string {
  const letras = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let s = "";
  for (let i = 0; i < 4; i++) s += letras[Math.floor(aleatorio() * letras.length)];
  return `MH4-${s}`;
}

export function mensajeEncargo(e: Encargo): string {
  const lineas = [
    `Hola Magic H4nds 💗 Quiero hacer un encargo.`,
    ``,
    `Pedido: ${e.codigo}`,
    e.producto ? `Producto: ${e.producto}` : null,
    `Lo que quiero: ${e.detalle.trim()}`,
    e.colores?.trim() ? `Colores: ${e.colores.trim()}` : null,
    e.tamano?.trim() ? `Tamaño o talla: ${e.tamano.trim()}` : null,
    e.fecha ? `Lo necesito para: ${formatearFecha(e.fecha)}` : null,
    e.urgente ? `Es urgente (entiendo que tiene un recargo del 10 %)` : null,
    ``,
    `Mi nombre: ${e.nombre.trim()}`,
    `Ciudad: ${e.ciudad.trim()}`,
    ``,
    `Te envío las fotos de referencia por aquí.`,
  ];
  return lineas.filter((l) => l !== null).join("\n");
}

export function mensajeProducto(nombre: string, url?: string): string {
  return `Hola Magic H4nds 💗 Me interesa: ${nombre}.${url ? `\n${url}` : ""}\n¿Me cuentas cómo encargarlo?`;
}

export function enlaceWhatsApp(texto: string, numero = ""): string {
  const n = numero.replace(/\D/g, "");
  return `https://wa.me/${n}?text=${encodeURIComponent(texto)}`;
}

function formatearFecha(iso: string): string {
  const [a, m, d] = iso.split("-").map(Number);
  if (!a || !m || !d) return iso;
  return new Date(Date.UTC(a, m - 1, d)).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
