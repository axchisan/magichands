// Correo con el código de acceso. HTML sencillo en tablas para que se vea bien en Gmail y Outlook.

const escapar = (t: string) => t.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function correoCodigo(otp: string) {
  const codigo = escapar(otp);
  const asunto = `Tu código para entrar a Magic H4nds: ${otp}`;
  const texto = `Tu código para entrar a Magic H4nds es: ${otp}\n\nVence en 10 minutos. Si no lo pediste, ignora este correo.`;
  const html = `<!doctype html>
<html lang="es"><body style="margin:0;background:#fbf6f1;font-family:Arial,Helvetica,sans-serif;color:#3b2a24">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbf6f1;padding:32px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:440px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0e0c0b;color:#f2d2b6;padding:22px 28px;font-family:Georgia,serif;font-size:22px">Magic H4nds</td></tr>
<tr><td style="padding:28px">
<p style="margin:0 0 12px;font-size:16px">Tu código para entrar es:</p>
<p style="margin:0 0 20px;font-size:36px;letter-spacing:8px;font-weight:bold;color:#0e0c0b">${codigo}</p>
<p style="margin:0 0 6px;font-size:14px;color:#8a5a47">Vence en 10 minutos.</p>
<p style="margin:0;font-size:14px;color:#8a5a47">Si no lo pediste, ignora este correo.</p>
</td></tr>
</table>
<p style="font-size:12px;color:#8a5a47;margin:16px 0 0">Tejido a mano en Vélez, Santander</p>
</td></tr></table></body></html>`;
  return { asunto, html, texto };
}
