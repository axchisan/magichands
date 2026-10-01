// Pedidos y su seguimiento. En la demo: pedidos de ejemplo + los encargos hechos en este navegador
// (localStorage). Con el panel, todo esto sale de las tablas `pedido` y `pedido_evento`
// (docs/05-arquitectura.md).
import type { Encargo } from "./whatsapp";

export const ESTADOS = [
  { id: "solicitud", nombre: "Solicitud recibida", texto: "Recibimos tu encargo y lo estamos revisando." },
  { id: "cotizado", nombre: "Cotizado", texto: "Te enviamos precio y fecha de entrega por WhatsApp." },
  { id: "anticipo_recibido", nombre: "Anticipo recibido", texto: "Recibimos el 50 % y tu pedido entró a la agenda." },
  { id: "en_proceso", nombre: "Tejiendo", texto: "Tu pedido se está tejiendo." },
  { id: "listo", nombre: "Listo", texto: "Está terminado. Pagas el 50 % restante y lo enviamos." },
  { id: "enviado", nombre: "Enviado", texto: "Va en camino. El envío se paga al recibir." },
  { id: "entregado", nombre: "Entregado", texto: "¡Ya está contigo! Gracias por confiar en Magic H4nds." },
] as const;

export type Estado = (typeof ESTADOS)[number]["id"];

export type Pedido = {
  codigo: string;
  producto: string;
  telefonoFinal: string; // últimos 4 dígitos, para validar la consulta
  estado: Estado;
  creado: string; // ISO
  fechaEstimada?: string; // ISO (fecha)
  historial: { estado: Estado; fecha: string }[];
  ejemplo?: boolean;
};

// Pedidos ficticios para mostrar el seguimiento en la demo.
export const pedidosEjemplo: Pedido[] = [
  {
    codigo: "MH4-7K2P",
    producto: "Funko personalizado (policía)",
    telefonoFinal: "1234",
    estado: "en_proceso",
    creado: "2026-09-15",
    fechaEstimada: "2026-10-08",
    historial: [
      { estado: "solicitud", fecha: "2026-09-15" },
      { estado: "cotizado", fecha: "2026-09-15" },
      { estado: "anticipo_recibido", fecha: "2026-09-16" },
      { estado: "en_proceso", fecha: "2026-09-22" },
    ],
    ejemplo: true,
  },
  {
    codigo: "MH4-3RQT",
    producto: "Ramo de 6 tulipanes",
    telefonoFinal: "5678",
    estado: "enviado",
    creado: "2026-09-01",
    fechaEstimada: "2026-09-26",
    historial: [
      { estado: "solicitud", fecha: "2026-09-01" },
      { estado: "cotizado", fecha: "2026-09-01" },
      { estado: "anticipo_recibido", fecha: "2026-09-02" },
      { estado: "en_proceso", fecha: "2026-09-08" },
      { estado: "listo", fecha: "2026-09-24" },
      { estado: "enviado", fecha: "2026-09-26" },
    ],
    ejemplo: true,
  },
];

const CLAVE = "mh4:encargos";

export function guardarEncargoLocal(e: Encargo, telefono: string, hoy = new Date()) {
  // Fecha local (no UTC): en Colombia, de noche, UTC ya es el día siguiente.
  const fecha = [hoy.getFullYear(), hoy.getMonth() + 1, hoy.getDate()].map((n) => String(n).padStart(2, "0")).join("-");
  const pedido: Pedido = {
    codigo: e.codigo,
    producto: e.producto ?? "Diseño personalizado",
    telefonoFinal: telefono.replace(/\D/g, "").slice(-4),
    estado: "solicitud",
    creado: fecha,
    historial: [{ estado: "solicitud", fecha }],
  };
  try {
    const lista = JSON.parse(localStorage.getItem(CLAVE) ?? "[]") as Pedido[];
    localStorage.setItem(CLAVE, JSON.stringify([pedido, ...lista].slice(0, 20)));
  } catch {
    // Sin almacenamiento (modo privado, bloqueado): el seguimiento solo mostrará los ejemplos.
  }
}

function pedidosLocales(): Pedido[] {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? "[]") as Pedido[];
  } catch {
    return [];
  }
}

export type ResultadoBusqueda =
  | { ok: true; pedido: Pedido }
  | { ok: false; motivo: "no-existe" | "telefono" };

export function buscarPedido(codigo: string, telefonoFinal: string, extra: Pedido[] = pedidosLocales()): ResultadoBusqueda {
  const c = codigo.trim().toUpperCase().replace(/^MH4(?!-)/, "MH4-");
  const p = [...extra, ...pedidosEjemplo].find((x) => x.codigo === c);
  if (!p) return { ok: false, motivo: "no-existe" };
  if (p.telefonoFinal !== telefonoFinal.trim()) return { ok: false, motivo: "telefono" };
  return { ok: true, pedido: p };
}
