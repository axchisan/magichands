// Plantilla común de los correos con la identidad de Magic H4nds.
// HTML en tablas con estilos en línea: es lo único que respetan Gmail, Outlook y Apple Mail por igual.
// Las imágenes salen de la web publicada (NEXT_PUBLIC_SITE_URL), en PNG/JPG para que todos las muestren.

export const color = {
  tinta: "#0e0c0b",
  cacao: "#3b2a24",
  canela: "#8a5a47",
  crema: "#f2d2b6",
  lino: "#fbf6f1",
  rosaProfundo: "#a33c4e",
  whatsapp: "#0f7a40",
  linea: "#eadfd6",
};

const serif = "Georgia,'Times New Roman',serif";
const sans = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export const escapar = (t: string) => t.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** URL absoluta dentro del sitio (portable: sale de NEXT_PUBLIC_SITE_URL). */
export function urlSitio(ruta = "/") {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return base + ruta;
}

export type Boton = { texto: string; url: string; estilo?: "principal" | "whatsapp" | "borde" };

export function boton({ texto, url, estilo = "principal" }: Boton) {
  const fondo = estilo === "whatsapp" ? color.whatsapp : estilo === "borde" ? "#ffffff" : color.rosaProfundo;
  const letra = estilo === "borde" ? color.cacao : "#ffffff";
  const borde = estilo === "borde" ? `border:1.5px solid ${color.cacao};` : "";
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 10px"><tr><td style="border-radius:999px;background:${fondo};${borde}">
<a href="${escapar(url)}" style="display:inline-block;padding:14px 26px;font:bold 16px ${sans};color:${letra};text-decoration:none;border-radius:999px">${escapar(texto)}</a>
</td></tr></table>`;
}

export function parrafo(html: string, opciones: { suave?: boolean; tamano?: number } = {}) {
  return `<p style="margin:0 0 16px;font:${opciones.tamano ?? 16}px/1.6 ${sans};color:${opciones.suave ? color.canela : color.cacao}">${html}</p>`;
}

/** Tabla de datos "etiqueta: valor" (los valores llegan sin escapar: se escapan aquí). */
export function datos(filas: [string, string | null | undefined][]) {
  const visibles = filas.filter(([, v]) => v && String(v).trim());
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 20px;border-collapse:collapse">
${visibles
  .map(
    ([e, v]) => `<tr><td style="padding:10px 0;border-top:1px solid ${color.linea};font:13px/1.4 ${sans};color:${color.canela};width:34%;vertical-align:top">${escapar(e)}</td>
<td style="padding:10px 0;border-top:1px solid ${color.linea};font:15px/1.5 ${sans};color:${color.cacao};vertical-align:top">${escapar(String(v)).replace(/\n/g, "<br>")}</td></tr>`,
  )
  .join("\n")}
</table>`;
}

/** Recuadro crema para destacar algo (código de pedido, aviso). */
export function destacado(html: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px"><tr>
<td style="background:${color.lino};border:1px solid ${color.crema};border-radius:14px;padding:16px 18px;font:15px/1.55 ${sans};color:${color.cacao}">${html}</td>
</tr></table>`;
}

export function plantilla({
  preencabezado,
  antetitulo,
  titulo,
  cuerpo,
  botones = [],
  nota,
}: {
  /** Texto que se ve en la bandeja de entrada junto al asunto. */
  preencabezado: string;
  antetitulo?: string;
  titulo: string;
  cuerpo: string;
  botones?: Boton[];
  /** Línea pequeña al final de la tarjeta (p. ej. "si no lo pediste, ignora este correo"). */
  nota?: string;
}) {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${escapar(titulo)}</title></head>
<body style="margin:0;padding:0;background:${color.lino};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapar(preencabezado)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${color.lino}">
<tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">

<tr><td align="center" style="background:${color.tinta};border-radius:20px 20px 0 0;padding:26px 24px 22px">
<a href="${escapar(urlSitio("/"))}" style="text-decoration:none"><img src="${escapar(urlSitio("/img/correo/logo-claro.png"))}" width="120" height="59" alt="Magic H4nds" style="display:block;border:0;width:120px;height:auto;color:${color.crema};font:bold 22px ${serif}"></a>
<p style="margin:10px 0 0;font:12px/1.4 ${sans};letter-spacing:2px;text-transform:uppercase;color:${color.crema}">Tejido a mano · Vélez, Santander</p>
</td></tr>

<tr><td style="background:#ffffff;border-radius:0 0 20px 20px;padding:32px 28px 26px">
${antetitulo ? `<p style="margin:0 0 6px;font:bold 12px/1.4 ${sans};letter-spacing:1.5px;text-transform:uppercase;color:${color.rosaProfundo}">${escapar(antetitulo)}</p>` : ""}
<h1 style="margin:0 0 18px;font:normal 28px/1.2 ${serif};color:${color.cacao}">${escapar(titulo)}</h1>
${cuerpo}
${botones.length ? `<div style="padding-top:6px">${botones.map(boton).join("\n")}</div>` : ""}
${nota ? `<p style="margin:18px 0 0;padding-top:16px;border-top:1px solid ${color.linea};font:13px/1.5 ${sans};color:${color.canela}">${nota}</p>` : ""}
</td></tr>

<tr><td align="center" style="padding:22px 12px 8px">
<p style="margin:0 0 6px;font:13px/1.5 ${sans};color:${color.canela}">Amigurumis, flores y ropa tejida a mano, bajo pedido y con envíos a todo Colombia.</p>
<p style="margin:0;font:13px/1.5 ${sans}"><a href="https://www.instagram.com/magic.h4nds/" style="color:${color.cacao};font-weight:bold">@magic.h4nds</a>
&nbsp;·&nbsp; <a href="${escapar(urlSitio("/"))}" style="color:${color.cacao}">${escapar(urlSitio("/").replace(/^https?:\/\//, "").replace(/\/$/, ""))}</a></p>
</td></tr>

</table>
</td></tr></table>
</body></html>`;
}
