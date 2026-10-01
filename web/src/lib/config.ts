// Datos fijos del negocio. Lo que ella cambia desde el panel (agenda, mostrar precios) está en la
// base de datos: ver lib/ajustes.ts.

export const negocio = {
  nombre: "Magic H4nds",
  instagram: "https://www.instagram.com/magic.h4nds/",
  ciudad: "Vélez, Santander",
  // WhatsApp en formato internacional sin "+" (NEXT_PUBLIC_WHATSAPP en web/.env).
  // Si faltara, wa.me abre WhatsApp para elegir el chat.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
  plazo: "15 a 20 días hábiles",
  // Mensaje por defecto cuando ella cierra la agenda (lo puede cambiar en el panel).
  agenda: { mensaje: "Agenda cerrada por ahora: los pedidos ya agendados siguen en proceso." },
} as const;

export const esDemo = process.env.NEXT_PUBLIC_DEMO !== "0";

/** Panel sin login para la presentación (NEXT_PUBLIC_PANEL_ABIERTO en web/.env). Ver lib/acceso.ts. */
export const panelAbierto = process.env.NEXT_PUBLIC_PANEL_ABIERTO === "1";
