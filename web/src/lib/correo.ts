import "server-only";

// Envío de correos con Resend (API REST, sin dependencias). Remitente en EMAIL_FROM.
export async function enviarCorreo({ para, asunto, html, texto }: { para: string; asunto: string; html: string; texto: string }) {
  const clave = process.env.RESEND_API_KEY;
  const de = process.env.EMAIL_FROM ?? "Magic H4nds <magichands@axchisan.com>";
  // CORREO_SIMULADO=1 (pruebas e2e): nunca se envía, solo se registra.
  if (process.env.CORREO_SIMULADO === "1") {
    console.info(`[correo simulado] para=${para} asunto="${asunto}"\n${texto}`);
    return;
  }
  if (!clave) {
    // En desarrollo sin clave: se muestra en la consola en vez de enviarse.
    if (process.env.NODE_ENV !== "production") {
      console.info(`[correo sin enviar] para=${para} asunto="${asunto}"\n${texto}`);
      return;
    }
    throw new Error("Falta RESEND_API_KEY");
  }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${clave}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: de, to: [para], subject: asunto, html, text: texto }),
  });
  if (!r.ok) throw new Error(`Resend respondió ${r.status}: ${await r.text()}`);
}
