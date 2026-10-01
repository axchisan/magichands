import { expect, test, type Page } from "@playwright/test";

const PAGINAS = ["/", "/catalogo", "/catalogo/personalizados", "/p/funko-personalizado", "/encargo", "/pedido", "/como-comprar", "/sobre-mi", "/privacidad", "/terminos"];

/** Abre la página y espera a que React termine de hidratarse (sin peticiones pendientes) antes de interactuar. */
async function abrir(page: Page, ruta: string) {
  const r = await page.goto(ruta);
  await page.waitForLoadState("networkidle");
  return r;
}

/** Desplaza la página para que carguen las imágenes diferidas y comprueba que ninguna esté rota. */
async function imagenesRotas(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
  return page.evaluate(() =>
    // Rota = terminó de cargar sin contenido, o una imagen no diferida que no cargó.
    // (Las diferidas fuera de la vista, como las fotos siguientes de un carrusel, aún no se piden.)
    [...document.images]
      .filter((i) => (i.complete && i.naturalWidth === 0) || (!i.complete && i.loading !== "lazy"))
      .map((i) => i.currentSrc || i.src),
  );
}

for (const ruta of PAGINAS) {
  test(`${ruta}: carga, un solo h1, sin imágenes rotas ni desbordes`, async ({ page }) => {
    const errores: string[] = [];
    page.on("pageerror", (e) => errores.push(e.message));
    const r = await page.goto(ruta);
    expect(r?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", "es-CO");
    expect(await imagenesRotas(page)).toEqual([]);
    // Ninguna página debe desplazarse en horizontal (sobre todo en móvil).
    const desborde = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(desborde).toBeLessThanOrEqual(1);
    // Toda imagen tiene atributo alt (vacío si es decorativa).
    expect(await page.locator("img:not([alt])").count()).toBe(0);
    expect(errores).toEqual([]);
  });
}

test("la demo no se indexa", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
});

test("portada: 8 fotos alrededor del titular y 8 destacados", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lo que imaginas, tejido punto por punto");
  await expect(page.locator("section[aria-labelledby=hero-titulo] li")).toHaveCount(8);
  await expect(page.locator("section[aria-labelledby=destacados] li")).toHaveCount(8);
});

test("catálogo: filtros por ocasión, categoría y búsqueda sin tildes", async ({ page }) => {
  await abrir(page, "/catalogo");
  const estado = page.getByRole("status");
  await expect(estado).toHaveText("73 productos");
  await page.getByRole("button", { name: "Navidad", exact: true }).click();
  await expect(estado).toHaveText("5 productos");
  await page.getByRole("button", { name: "Cualquiera" }).click();
  await page.getByRole("button", { name: "Flores y ramos" }).click();
  await expect(estado).toHaveText("6 productos");
  await page.getByRole("button", { name: "Todas" }).click();
  await page.getByLabel("Buscar").fill("pinguino");
  await expect(estado).toHaveText("1 producto");
  await page.getByLabel("Buscar").fill("zzzz");
  await expect(page.getByText("No encontramos productos con esos filtros.")).toBeVisible();
  await page.getByRole("button", { name: "quita los filtros" }).click();
  await expect(estado).toHaveText("73 productos");
});

test("ficha: la galería cambia de foto y el encargo llega con el producto elegido", async ({ page, isMobile }) => {
  await abrir(page, "/p/abejita");
  const contador = page.getByText("1 / 6");
  await expect(contador).toBeVisible();
  if (isMobile) {
    // En celular se desliza: se simula moviendo la tira una foto a la derecha.
    await page.getByRole("list", { name: "Fotos de Abejita" }).evaluate((ul) => ul.scrollBy({ left: ul.clientWidth }));
  } else {
    await page.getByRole("button", { name: "Ver foto 2 de 6" }).click();
    await expect(page.getByRole("button", { name: "Ver foto 2 de 6" })).toHaveAttribute("aria-current", "true");
  }
  await expect(page.getByText("2 / 6")).toBeVisible();
  // Los precios antiguos no se muestran en la demo.
  await expect(page.getByText("Se cotiza según tu diseño")).toBeVisible();
  await page.getByRole("link", { name: isMobile ? "Encargar" : "Encargar este producto", exact: true }).first().click();
  await expect(page).toHaveURL(/\/encargo\?producto=abejita/);
  await expect(page.getByLabel("Producto")).toHaveValue("abejita");
});

test("celular: menú lateral abre, navega y se cierra", async ({ page, isMobile }) => {
  test.skip(!isMobile, "solo en celular");
  await abrir(page, "/");
  await expect(page.getByRole("navigation", { name: "Principal", exact: true })).toBeHidden();
  await page.getByRole("button", { name: "Menú" }).click();
  const panel = page.getByRole("dialog", { name: "Menú" });
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await page.getByRole("button", { name: "Menú" }).click();
  await panel.getByRole("link", { name: "Quién teje" }).click();
  await expect(page).toHaveURL(/\/sobre-mi/);
  await expect(panel).toBeHidden();
});

test("encargo: valida, arma el mensaje de WhatsApp y permite seguir el pedido", async ({ page }) => {
  await abrir(page, "/encargo?producto=ramo-de-tulipanes");
  await page.evaluate(() => {
    (window as unknown as { abiertos: string[] }).abiertos = [];
    window.open = (u?: string | URL) => {
      (window as unknown as { abiertos: string[] }).abiertos.push(String(u));
      return null;
    };
  });

  // Enviar vacío: el navegador bloquea y marca los campos obligatorios.
  await page.getByRole("button", { name: "Enviar encargo por WhatsApp" }).click();
  await expect(page.getByLabel(/Cuéntanos tu idea/)).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Escribe al menos una frase")).toBeVisible();
  await expect(page.getByLabel(/Cuéntanos tu idea/)).toBeFocused();

  await page.getByLabel(/Cuéntanos tu idea/).fill("Un ramo de tulipanes rosados para mi mamá");
  await page.getByLabel("Colores").fill("Rosado");
  await page.getByLabel(/Nombre/).fill("Prueba");
  await page.getByLabel(/Ciudad/).fill("Bogotá");
  await page.getByLabel(/Celular/).fill("3101112233");
  await page.getByRole("button", { name: "Enviar encargo por WhatsApp" }).click();

  await expect(page.getByRole("heading", { name: "Tu encargo está listo para enviar" })).toBeVisible();
  const codigo = await page.locator("strong").filter({ hasText: /^MH4-/ }).textContent();
  expect(codigo).toMatch(/^MH4-[2-9A-HJ-NP-Z]{4}$/);
  const enlace = await page.evaluate(() => (window as unknown as { abiertos: string[] }).abiertos[0]);
  expect(enlace).toMatch(/^https:\/\/wa\.me\/573115685168\?text=/);
  const texto = decodeURIComponent(enlace.split("text=")[1]);
  expect(texto).toContain(`Pedido: ${codigo}`);
  expect(texto).toContain("Producto: Ramo de tulipanes");
  expect(texto).toContain("Ciudad: Bogotá");

  await page.getByRole("link", { name: "Ver el estado del pedido" }).click();
  await expect(page.getByLabel("Código de pedido")).toHaveValue(codigo!);
  await page.getByLabel("Últimos 4 dígitos de tu celular").fill("2233");
  await page.getByRole("button", { name: "Ver mi pedido" }).click();
  await expect(page.getByRole("heading", { name: `${codigo}: Ramo de tulipanes` })).toBeVisible();
});

test("seguimiento: pedido de ejemplo y error de teléfono", async ({ page }) => {
  await abrir(page, "/pedido");
  await page.getByLabel("Código de pedido").fill("MH4-3RQT");
  await page.getByLabel("Últimos 4 dígitos de tu celular").fill("5678");
  await page.getByRole("button", { name: "Ver mi pedido" }).click();
  await expect(page.locator("[aria-current=step]")).toContainText("Enviado");
  await page.getByLabel("Últimos 4 dígitos de tu celular").fill("0000");
  await page.getByRole("button", { name: "Ver mi pedido" }).click();
  // (Next.js añade su propio role=alert para anunciar rutas; se busca el aviso por su texto)
  await expect(page.getByText(/no coinciden/)).toBeVisible();
});

test("navegación: el enlace activo se marca y la página 404 orienta", async ({ page, isMobile }) => {
  await page.goto("/catalogo/personalizados");
  if (isMobile) await page.getByRole("button", { name: "Menú" }).click();
  await expect(page.getByRole("navigation", { name: /^Principal/ }).first().getByRole("link", { name: "Personalizados" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  const r = await page.goto("/p/no-existe");
  expect(r?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Esta página no existe" })).toBeVisible();
});

test("capturas para revisión visual", async ({ page }, info) => {
  for (const ruta of ["/", "/catalogo", "/p/funko-personalizado", "/encargo", "/sobre-mi"]) {
    await page.goto(ruta);
    await imagenesRotas(page);
    const nombre = ruta === "/" ? "inicio" : ruta.replaceAll("/", "_").slice(1);
    await page.screenshot({ path: `test-results/capturas/${info.project.name}-${nombre}.png`, fullPage: true });
  }
});
