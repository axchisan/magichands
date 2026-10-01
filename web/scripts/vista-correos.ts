// Genera los correos del sistema como HTML para revisarlos en el navegador:
//   npx tsx scripts/vista-correos.ts <carpeta>
import { mkdirSync, writeFileSync } from "node:fs";
import { config } from "dotenv";
config({ path: ".env" });
import { correoCodigo } from "../src/lib/correos/codigo";
import { correoCambioEstado, correoEncargoRecibido, correoNuevoEncargo } from "../src/lib/correos/pedido";

const carpeta = process.argv[2] ?? "test-results/correos";
mkdirSync(carpeta, { recursive: true });
const ejemplo = {
  codigo: "MH4-7K2P",
  producto: "Ramo de tulipanes",
  detalle: "Un ramo de tulipanes rosados para el cumpleaños de mi mamá, con una tarjetica.",
  colores: "Rosado y blanco",
  tamano: "Mediano",
  fechaDeseada: "2026-10-24",
  urgente: false,
  nombre: "Laura Gómez",
  ciudad: "Bogotá",
  whatsapp: "3101112233",
};
const correos = {
  codigo: correoCodigo("482913"),
  "nuevo-encargo": correoNuevoEncargo(ejemplo),
  "encargo-recibido": correoEncargoRecibido(ejemplo),
  "estado-tejiendo": correoCambioEstado({ codigo: "MH4-7K2P", nombre: "Laura Gómez", producto: "Ramo de tulipanes", estado: "en_proceso", fechaEstimada: "2026-10-20" }),
  "estado-cancelado": correoCambioEstado({ codigo: "MH4-7K2P", nombre: "Laura Gómez", producto: "Ramo de tulipanes", estado: "cancelado" }),
};
for (const [nombre, c] of Object.entries(correos)) {
  writeFileSync(`${carpeta}/${nombre}.html`, c.html);
  console.log(`${nombre}: ${c.asunto}`);
}
