// Estados del pedido y pedidos de ejemplo de la demo. Los pedidos reales están en la base de datos
// (tablas pedido y pedido_evento) y se consultan con app/acciones/pedidos.ts.

export const ESTADOS = [
  { id: "solicitud", nombre: "Solicitud recibida", texto: "Recibimos tu encargo y lo estamos revisando." },
  { id: "cotizado", nombre: "Cotizado", texto: "Te enviamos precio y fecha de entrega por WhatsApp." },
  { id: "anticipo_recibido", nombre: "Anticipo recibido", texto: "Recibimos el 50 % y tu pedido entró a la agenda." },
  { id: "en_proceso", nombre: "Tejiendo", texto: "Tu pedido se está tejiendo." },
  { id: "listo", nombre: "Listo", texto: "Está terminado. Pagas el 50 % restante y lo enviamos." },
  { id: "enviado", nombre: "Enviado", texto: "Va en camino. El envío se paga al recibir." },
  { id: "entregado", nombre: "Entregado", texto: "¡Ya está contigo! Gracias por confiar en Magic H4nds." },
] as const;

export type Estado = (typeof ESTADOS)[number]["id"] | "cancelado";

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

export type ResultadoBusqueda =
  | { ok: true; pedido: Pedido }
  | { ok: false; motivo: "no-existe" | "telefono" };

export function buscarPedido(codigo: string, telefonoFinal: string, extra: Pedido[] = []): ResultadoBusqueda {
  const c = codigo.trim().toUpperCase().replace(/^MH4(?!-)/, "MH4-");
  const p = [...extra, ...pedidosEjemplo].find((x) => x.codigo === c);
  if (!p) return { ok: false, motivo: "no-existe" };
  if (p.telefonoFinal !== telefonoFinal.trim()) return { ok: false, motivo: "telefono" };
  return { ok: true, pedido: p };
}
