// Ajustes del negocio. En la versión con panel vienen de la base de datos (tabla `ajustes`);
// en la demo son constantes.

export const negocio = {
  nombre: "Magic H4nds",
  instagram: "https://www.instagram.com/magic.h4nds/",
  ciudad: "Vélez, Santander",
  // WhatsApp en formato internacional sin "+" (NEXT_PUBLIC_WHATSAPP en web/.env).
  // Si faltara, wa.me abre WhatsApp para elegir el chat.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
  plazo: "15 a 20 días hábiles",
  // Los únicos precios conocidos son los que ella publicó en 2021–2025 (precioReferencia en el catálogo).
  // No se muestran hasta que ella los confirme: un precio viejo junto a una foto reciente confunde.
  mostrarPrecios: false,
  agenda: {
    abierta: true,
    mensaje: "Agenda cerrada por ahora: los pedidos ya agendados siguen en proceso.",
  },
} as const;

export const esDemo = process.env.NEXT_PUBLIC_DEMO !== "0";

/** Panel sin login para la presentación (NEXT_PUBLIC_PANEL_ABIERTO en web/.env). Ver lib/acceso.ts. */
export const panelAbierto = process.env.NEXT_PUBLIC_PANEL_ABIERTO === "1";
