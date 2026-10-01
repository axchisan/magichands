// Recorrido de una clienta en celular: menú, filtros, ficha, encargo. Guarda capturas de cada paso.
//   node tests/visual/interaccion-movil.mjs <url-base> <carpeta>
import { chromium, devices } from "@playwright/test";
import { mkdirSync } from "node:fs";

const [base = "http://localhost:3311", salida = "test-results/interaccion"] = process.argv.slice(2);
mkdirSync(salida, { recursive: true });
const navegador = await chromium.launch();
const ctx = await navegador.newContext({ ...devices["iPhone 13"], locale: "es-CO" });
const page = await ctx.newPage();
let n = 0;
const foto = async (nombre) => page.screenshot({ path: `${salida}/${String(++n).padStart(2, "0")}-${nombre}.png` });
const medir = async (sel) => page.locator(sel).first().evaluate((e) => { const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; });

// 1. Menú
await page.goto(base + "/", { waitUntil: "networkidle" });
await foto("inicio");
await page.getByRole("button", { name: "Menú" }).click();
await page.waitForTimeout(400);
await foto("menu-abierto");
console.log("menú: botón", await medir("text=Menú"), "enlace", await medir("#menu-movil nav a"));
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
console.log("menú cerrado con Esc:", !(await page.locator("#menu-movil").evaluate((d) => d.open)));
await page.getByRole("button", { name: "Menú" }).click();
await page.locator("#menu-movil").getByRole("link", { name: "Catálogo" }).click();
await page.waitForURL("**/catalogo");
console.log("menú navega y se cierra:", !(await page.locator("#menu-movil").evaluate((d) => d.open)));

// 2. Filtros
await page.waitForLoadState("networkidle");
await foto("catalogo");
await page.getByRole("button", { name: "Flores y ramos" }).click();
await page.waitForTimeout(300);
await foto("catalogo-flores");
console.log("chip:", await medir("[aria-pressed=true]"));

// 3. Ficha y barra fija
await page.getByRole("link", { name: /Ramo de tulipanes/ }).first().click();
await page.waitForLoadState("networkidle");
await foto("ficha");
await page.mouse.wheel(0, 900);
await page.waitForTimeout(400);
await foto("ficha-scroll");

// 4. Encargo con teclado
await page.locator("[class*=barra]").getByRole("link", { name: "Encargar" }).click();
await page.waitForURL("**/encargo**");
await page.waitForLoadState("networkidle");
await page.getByLabel(/Cuéntanos tu idea/).tap();
await page.waitForTimeout(300);
await foto("encargo-idea");
const campos = await page.locator("form input, form select, form textarea").evaluateAll((els) =>
  els.map((e) => ({ id: e.id, fuente: getComputedStyle(e).fontSize, alto: Math.round(e.getBoundingClientRect().height), modo: e.getAttribute("inputmode"), tecla: e.getAttribute("enterkeyhint"), auto: e.getAttribute("autocomplete") })),
);
console.table(campos);
await page.getByRole("button", { name: "Enviar encargo por WhatsApp" }).click();
await page.waitForTimeout(400);
await foto("encargo-errores");

await navegador.close();
