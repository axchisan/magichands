// Correos de los pedidos: aviso a Magic H4nds, confirmación al cliente y cambios de estado.
import { ESTADOS, type Estado } from "@/lib/pedidos";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import { color, datos, destacado, escapar, parrafo, plantilla, urlSitio } from "./plantilla";

export type DatosCorreoPedido = {
  codigo: string;
  producto?: string | null;
  detalle: string;
  colores?: string;
  tamano?: string;
  fechaDeseada?: string | null;
  urgente?: boolean;
  nombre: string;
  ciudad: string;
  whatsapp: string;
};

const fecha = (iso?: string | null) =>
  iso ? new Date(`${iso}T12:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" }) : null;

const filas = (p: DatosCorreoPedido): [string, string | null | undefined][] => [
  ["Producto", p.producto ?? "Otro diseño"],
  ["Lo que quiere", p.detalle],
  ["Colores", p.colores],
  ["Tamaño", p.tamano],
  ["Para cuándo", fecha(p.fechaDeseada)],
  ["Urgente", p.urgente ? "Sí" : null],
];

/** A Magic H4nds: entró un encargo nuevo. */
export function correoNuevoEncargo(p: DatosCorreoPedido) {
  const producto = p.producto ?? "Otro diseño";
  const asunto = `Nuevo encargo ${p.codigo}: ${producto}${p.urgente ? " (urgente)" : ""}`;
  const saludo = `Hola ${p.nombre.split(" ")[0]} 💗 Te escribo de Magic H4nds por tu encargo ${p.codigo}.`;
  const texto = [
    `Nuevo encargo ${p.codigo}`,
    `Producto: ${producto}`,
    `Cliente: ${p.nombre} (${p.ciudad}) · WhatsApp ${p.whatsapp}`,
    `Idea: ${p.detalle}`,
    p.urgente ? "Urgente" : "",
    `Panel: ${urlSitio(`/admin/pedidos/${p.codigo}`)}`,
  ]
    .filter(Boolean)
    .join("\n");
  const html = plantilla({
    preencabezado: `${p.nombre} (${p.ciudad}) quiere: ${p.detalle.slice(0, 90)}`,
    antetitulo: p.urgente ? "Encargo nuevo · urgente" : "Encargo nuevo",
    titulo: `${p.codigo}: ${producto}`,
    cuerpo:
      parrafo(`<strong>${escapar(p.nombre)}</strong> (${escapar(p.ciudad)}) acaba de hacer un encargo desde la web.`) +
      datos([...filas(p), ["Cliente", `${p.nombre} · ${p.ciudad}`], ["WhatsApp", p.whatsapp]]) +
      parrafo("Normalmente el cliente también te escribe por WhatsApp con sus fotos de referencia.", { suave: true, tamano: 14 }),
    botones: [
      { texto: "Ver en el panel", url: urlSitio(`/admin/pedidos/${p.codigo}`) },
      { texto: "Escribirle por WhatsApp", url: enlaceWhatsApp(saludo, `57${p.whatsapp}`), estilo: "whatsapp" },
    ],
  });
  return { asunto, html, texto };
}

/** Al cliente: recibimos tu encargo. */
export function correoEncargoRecibido(p: DatosCorreoPedido) {
  const producto = p.producto ?? "tu diseño";
  const asunto = `Recibimos tu encargo ${p.codigo} 💗`;
  const seguimiento = urlSitio(`/pedido?codigo=${p.codigo}`);
  const texto = [
    `¡Hola ${p.nombre.split(" ")[0]}! Recibimos tu encargo ${p.codigo} (${producto}).`,
    "",
    "Qué sigue:",
    "1. Si aún no lo hiciste, envíanos el mensaje por WhatsApp con tus fotos de referencia.",
    "2. Te respondemos con el precio y la fecha de entrega.",
    "3. Con el 50 % de anticipo tu pedido entra a la agenda.",
    "",
    `Sigue tu pedido: ${seguimiento} (código ${p.codigo} y los últimos 4 dígitos de tu celular).`,
  ].join("\n");
  const pasos = [
    ["Escríbenos por WhatsApp", "Si aún no lo hiciste, envía el mensaje del encargo y adjunta tus fotos de referencia."],
    ["Te cotizamos", "Te respondemos con el precio y la fecha estimada de entrega."],
    ["Anticipo y a tejer", "Con el 50 % de anticipo tu pedido entra a la agenda. El resto, al terminarlo."],
  ]
    .map(
      ([t, d], i) => `<tr><td style="width:36px;vertical-align:top;padding:0 0 14px">
<div style="width:28px;height:28px;border-radius:50%;background:${color.crema};color:${color.cacao};font:bold 14px/28px Arial,sans-serif;text-align:center">${i + 1}</div></td>
<td style="vertical-align:top;padding:2px 0 14px;font:15px/1.5 'Helvetica Neue',Helvetica,Arial,sans-serif;color:${color.cacao}"><strong>${t}</strong><br><span style="color:${color.canela}">${d}</span></td></tr>`,
    )
    .join("\n");
  const html = plantilla({
    preencabezado: `Tu código de pedido es ${p.codigo}. Te contamos qué sigue.`,
    antetitulo: "Encargo recibido",
    titulo: `¡Gracias, ${p.nombre.split(" ")[0]}!`,
    cuerpo:
      parrafo(`Recibimos tu encargo y ya está en nuestra lista. Guarda este código para seguirlo:`) +
      destacado(
        `<span style="font:13px Arial,sans-serif;color:${color.canela}">Código de pedido</span><br><strong style="font:bold 26px/1.3 Georgia,serif;letter-spacing:1px;color:${color.tinta}">${escapar(p.codigo)}</strong>`,
      ) +
      datos(filas(p)) +
      `<h2 style="margin:8px 0 14px;font:normal 20px/1.3 Georgia,serif;color:${color.cacao}">Qué sigue</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${pasos}</table>`,
    botones: [
      { texto: "Ver el estado de mi pedido", url: seguimiento },
      {
        texto: "Escribir por WhatsApp",
        url: enlaceWhatsApp(`Hola Magic H4nds 💗 Te escribo por mi encargo ${p.codigo}.`, process.env.NEXT_PUBLIC_WHATSAPP ?? ""),
        estilo: "whatsapp",
      },
    ],
    nota: `Para ver tu pedido te pedimos el código y los últimos 4 dígitos de tu celular. Recibes este correo porque hiciste un encargo con tu cuenta en Magic H4nds.`,
  });
  return { asunto, html, texto };
}

/** Al cliente: su pedido cambió de estado. */
export function correoCambioEstado(p: { codigo: string; nombre: string; producto?: string | null; estado: Estado; fechaEstimada?: string | null }) {
  const cancelado = p.estado === "cancelado";
  const actual = ESTADOS.findIndex((e) => e.id === p.estado);
  const info = ESTADOS[actual];
  const nombreEstado = cancelado ? "Cancelado" : (info?.nombre ?? p.estado);
  const textoEstado = cancelado ? "Tu pedido fue cancelado. Si tienes dudas, escríbenos por WhatsApp." : (info?.texto ?? "");
  const seguimiento = urlSitio(`/pedido?codigo=${p.codigo}`);
  const asunto = `Tu pedido ${p.codigo}: ${nombreEstado}`;
  const texto = `Hola ${p.nombre.split(" ")[0]}, tu pedido ${p.codigo} ahora está en: ${nombreEstado}.\n${textoEstado}\n\nSíguelo aquí: ${seguimiento}`;
  const linea = cancelado
    ? ""
    : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px">${ESTADOS.map((e, i) => {
        const hecho = i < actual;
        const ahora = i === actual;
        const punto = hecho ? `background:${color.cacao};color:#fff` : ahora ? `background:${color.rosaProfundo};color:#fff` : `background:#ffffff;border:1.5px solid ${color.linea};color:${color.canela}`;
        return `<tr><td style="width:34px;padding:0 0 8px;vertical-align:middle"><div style="width:24px;height:24px;border-radius:50%;${punto};font:bold 12px/24px Arial,sans-serif;text-align:center">${hecho ? "✓" : i + 1}</div></td>
<td style="padding:0 0 8px;vertical-align:middle;font:${ahora ? "bold " : ""}15px/1.4 'Helvetica Neue',Helvetica,Arial,sans-serif;color:${hecho || ahora ? color.cacao : color.canela}">${escapar(e.nombre)}</td></tr>`;
      }).join("\n")}</table>`;
  const estimada = p.fechaEstimada
    ? new Date(`${p.fechaEstimada}T12:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "long" })
    : null;
  const html = plantilla({
    preencabezado: `${nombreEstado}: ${textoEstado}`,
    antetitulo: `Pedido ${p.codigo}`,
    titulo: nombreEstado,
    cuerpo:
      parrafo(`Hola ${escapar(p.nombre.split(" ")[0])}, tu pedido${p.producto ? ` de <strong>${escapar(p.producto)}</strong>` : ""} avanzó:`) +
      destacado(escapar(textoEstado) + (estimada && !cancelado ? `<br><span style="color:${color.canela}">Entrega estimada: <strong style="color:${color.cacao}">${escapar(estimada)}</strong></span>` : "")) +
      linea,
    botones: [{ texto: "Ver mi pedido", url: seguimiento }],
    nota: "Recibes este correo porque hiciste un encargo con tu cuenta en Magic H4nds.",
  });
  return { asunto, html, texto };
}
