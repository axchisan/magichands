// Correo con el código de acceso.
import { color, escapar, plantilla } from "./plantilla";

export function correoCodigo(otp: string) {
  const asunto = `Tu código para entrar a Magic H4nds: ${otp}`;
  const texto = `Tu código para entrar a Magic H4nds es: ${otp}\n\nVence en 10 minutos. Si no lo pediste, ignora este correo.`;
  const html = plantilla({
    preencabezado: `Tu código es ${otp}. Vence en 10 minutos.`,
    antetitulo: "Código de acceso",
    titulo: "Tu código para entrar",
    cuerpo: `<p style="margin:0 0 14px;font:16px/1.6 'Helvetica Neue',Helvetica,Arial,sans-serif;color:${color.cacao}">Escríbelo en la página donde lo pediste:</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px"><tr>
<td style="background:${color.lino};border:1.5px dashed ${color.crema};border-radius:14px;padding:16px 26px;font:bold 34px/1 'Courier New',Courier,monospace;letter-spacing:10px;color:${color.tinta}">${escapar(otp)}</td>
</tr></table>
<p style="margin:0;font:14px/1.6 'Helvetica Neue',Helvetica,Arial,sans-serif;color:${color.canela}">Vence en 10 minutos. No necesitas contraseña.</p>`,
    nota: "Si no pediste este código, ignora este correo: nadie puede entrar sin él.",
  });
  return { asunto, html, texto };
}
