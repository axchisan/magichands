import { chromium } from "@playwright/test";
const B = "http://localhost:3313";
const nav = await chromium.launch();
const p = await nav.newPage();
await p.goto(B + "/admin/pedidos/MH4-YUDZ"); await p.waitForLoadState("networkidle");
const leer = async (t) => console.log(t, {
  select: await p.locator("#estado").inputValue(),
  insignia: await p.locator("header span[data-estado]").textContent(),
  historial: await p.locator("ol li").count(),
  total: await p.locator("#total").inputValue(),
});
await leer("antes");
const nuevo = (await p.locator("#estado").inputValue()) === "en_proceso" ? "listo" : "en_proceso";
await p.selectOption("#estado", nuevo);
await p.fill("#total", "85000");
await p.getByRole("button", { name: "Guardar cambios" }).click();
await p.getByRole("status").filter({ hasText: "guardados" }).waitFor(); console.log("mensaje:", await p.getByRole("status").filter({ hasText: "guardados" }).textContent());
await leer("después de guardar (" + nuevo + ")");
await p.reload(); await p.waitForLoadState("networkidle");
await leer("tras recargar");
await nav.close();
