import { esDemo } from "./config";

// Datos de las páginas legales (/privacidad y /terminos).
// Mientras el sitio es una demo lo opera el desarrollador; al traspasarlo a Magic H4nds se cambian
// responsable y correo (docs/09-dominio-portable.md, paso "Demo → producción").
export const legal = {
  actualizado: "1 de octubre de 2026",
  correo: process.env.NEXT_PUBLIC_CONTACTO_DATOS ?? "axchisan923@gmail.com",
  responsable: esDemo
    ? "Durante esta versión de demostración, el sitio lo opera su desarrollador (axchisan) como propuesta para Magic H4nds, Vélez, Santander, Colombia"
    : "Magic H4nds, Vélez, Santander, Colombia",
  operador: esDemo
    ? "Esta es una versión de demostración preparada para Magic H4nds."
    : "",
};
