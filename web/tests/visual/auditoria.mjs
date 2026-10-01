// Auditoría visual: recorre cada página pantalla a pantalla (lo que ve un cliente al desplazarse)
// y guarda capturas por dispositivo. Uso:
//   node tests/visual/auditoria.mjs <url-base> <carpeta-salida> [rutas separadas por coma]
import { chromium, devices } from "@playwright/test";
import { mkdirSync } from "node:fs";

const [base = "http://localhost:3311", salida = "test-results/auditoria", soloRutas] = process.argv.slice(2);
const RUTAS = soloRutas
  ? soloRutas.split(",")
  : ["/", "/catalogo", "/catalogo/personalizados", "/p/funko-personalizado", "/encargo", "/pedido", "/como-comprar", "/sobre-mi", "/privacidad"];
const DISPOSITIVOS = {
  iphone: { ...devices["iPhone 13"] },
  android: { ...devices["Galaxy S9+"], viewport: { width: 360, height: 740 } },
  escritorio: { viewport: { width: 1440, height: 900 } },
};

mkdirSync(salida, { recursive: true });
const navegador = await chromium.launch();
for (const [nombre, opciones] of Object.entries(DISPOSITIVOS)) {
  const contexto = await navegador.newContext({ ...opciones, locale: "es-CO" });
  const page = await contexto.newPage();
  for (const ruta of RUTAS) {
    await page.goto(base + ruta, { waitUntil: "networkidle" });
    const alto = await page.evaluate(() => document.documentElement.scrollHeight);
    const visor = page.viewportSize().height;
    const pantallas = Math.min(Math.ceil(alto / visor), 14);
    const slug = ruta === "/" ? "inicio" : ruta.slice(1).replaceAll("/", "_");
    for (let i = 0; i < pantallas; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), i * visor);
      await page.waitForTimeout(250);
      await page.screenshot({ path: `${salida}/${nombre}__${slug}__${String(i + 1).padStart(2, "0")}.png` });
    }
    console.log(`${nombre} ${ruta}: ${pantallas} pantallas (${alto}px)`);
  }
  await contexto.close();
}
await navegador.close();
