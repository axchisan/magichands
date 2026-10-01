import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

// Panel abierto para la presentación (NEXT_PUBLIC_PANEL_ABIERTO en web/.env).
const PANEL_ABIERTO = /^NEXT_PUBLIC_PANEL_ABIERTO=1$/m.test(readFileSync(path.join(__dirname, "../../.env"), "utf8"));

const PAGINAS = ["/", "/entrar", "/catalogo", "/catalogo/personalizados", "/p/funko-personalizado", "/encargo", "/pedido", "/como-comprar", "/sobre-mi", "/privacidad", "/terminos"];

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
  // Paginación: 12 por página
  const tarjetas = page.locator("main article");
  await expect(tarjetas).toHaveCount(12);
  await expect(page.getByText("1–12 de 73")).toBeVisible();
  await page.getByRole("button", { name: "Página 7" }).click();
  await expect(page.getByText("73–73 de 73")).toBeVisible();
  await expect(tarjetas).toHaveCount(1);
  await page.getByRole("button", { name: /Anterior/ }).click();
  await expect(page.getByText("61–72 de 73")).toBeVisible();
  await page.getByRole("button", { name: "Navidad", exact: true }).click();
  // Cambiar el filtro vuelve a la página 1 y, con pocos resultados, no hay paginador
  await expect(page.getByRole("navigation", { name: "Páginas del catálogo" })).toHaveCount(0);
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

test("encargo: valida, se guarda, arma el mensaje de WhatsApp y permite seguir el pedido", async ({ page }) => {
  // Escribe en la base de datos: solo en local (rama dev), nunca contra la demo publicada.
  test.skip(!!process.env.E2E_URL, "crea pedidos reales");
  await abrir(page, "/encargo?producto=ramo-de-tulipanes");

  // Enviar vacío: el navegador bloquea y marca los campos obligatorios.
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByLabel(/Cuéntanos tu idea/)).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Escribe al menos una frase")).toBeVisible();
  await expect(page.getByLabel(/Cuéntanos tu idea/)).toBeFocused();

  // Celular distinto en cada corrida para no chocar con el límite de 5 encargos por hora.
  const celular = `310${String(Date.now()).slice(-7)}`;
  await page.getByLabel(/Cuéntanos tu idea/).fill("Un ramo de tulipanes rosados para mi mamá");
  await page.getByLabel("Colores").fill("Rosado");
  await page.getByLabel(/Nombre/).fill("Prueba automática");
  await page.getByLabel(/Ciudad/).fill("Bogotá");
  await page.getByLabel(/Celular/).fill(celular);
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(page.getByRole("heading", { name: "Envíalo por WhatsApp para que te cotice" })).toBeVisible();
  await expect(page.getByText("Tu encargo quedó guardado")).toBeVisible();
  const codigo = await page.locator("strong").filter({ hasText: /^MH4-/ }).textContent();
  expect(codigo).toMatch(/^MH4-[2-9A-HJ-NP-Z]{4}$/);
  const enlace = (await page.getByRole("link", { name: "Enviar por WhatsApp" }).getAttribute("href"))!;
  expect(enlace).toMatch(/^https:\/\/wa\.me\/573115685168\?text=/);
  const texto = decodeURIComponent(enlace.split("text=")[1]);
  expect(texto).toContain(`Pedido: ${codigo}`);
  expect(texto).toContain("Producto: Ramo de tulipanes");
  expect(texto).toContain("Ciudad: Bogotá");

  await page.getByRole("link", { name: "Ver el estado del pedido" }).click();
  await expect(page.getByLabel("Código de pedido")).toHaveValue(codigo!);
  await page.getByLabel("Últimos 4 dígitos de tu celular").fill(celular.slice(-4));
  await page.getByRole("button", { name: "Ver mi pedido" }).click();
  await expect(page.getByRole("heading", { name: `${codigo}: Ramo de tulipanes` })).toBeVisible();
  await expect(page.locator("[aria-current=step]")).toContainText("Solicitud recibida");
});

test("encargo: el campo trampa frena a los robots sin guardar nada", async ({ page }) => {
  test.skip(!!process.env.E2E_URL, "crea pedidos reales");
  await abrir(page, "/encargo");
  await page.getByLabel(/Cuéntanos tu idea/).fill("Mensaje automático de un robot cualquiera");
  await page.getByLabel(/Nombre/).fill("Robot");
  await page.getByLabel(/Ciudad/).fill("Ninguna");
  await page.getByLabel(/Celular/).fill("3000000000");
  await page.locator("input[name=sitio_web]").fill("http://spam.example", { force: true });
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByRole("heading", { name: "Envíalo por WhatsApp para que te cotice" })).toBeVisible();
  // El robot ve una respuesta normal, pero el pedido no existe en la base de datos.
  const codigo = await page.locator("strong").filter({ hasText: /^MH4-/ }).textContent();
  await abrir(page, `/pedido?codigo=${codigo}`);
  await page.getByLabel("Últimos 4 dígitos de tu celular").fill("0000");
  await page.getByRole("button", { name: "Ver mi pedido" }).click();
  await expect(page.getByText(/No encontramos un pedido/)).toBeVisible();
});

test("entrar: Google o código al correo, y las zonas privadas piden sesión", async ({ page, isMobile }) => {
  await abrir(page, "/mi-cuenta");
  await expect(page).toHaveURL(/\/entrar\?volver=(%2F|\/)mi-cuenta/);
  await expect(page.getByRole("heading", { name: "Entrar", level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: "Continuar con Google" })).toBeVisible();

  if (!PANEL_ABIERTO) {
    await abrir(page, "/admin/pedidos");
    await expect(page).toHaveURL(/\/entrar\?volver=(%2F|\/)admin/);
  }

  // Un destino externo en ?volver se ignora (sin redirecciones abiertas).
  await abrir(page, "/entrar?volver=//evil.example");
  await expect(page.getByRole("button", { name: "Continuar con Google" })).toBeVisible();

  // Pedir el código cuenta para el límite de 3 por minuto: solo en escritorio y en local.
  if (!process.env.E2E_URL && !isMobile) {
    await page.getByRole("button", { name: /entrar con mi correo/ }).click();
    await expect(page.getByLabel("Correo electrónico")).toBeFocused();
    await page.getByLabel("Correo electrónico").fill(`prueba+${Date.now()}@example.com`);
    await page.getByRole("button", { name: "Enviarme un código" }).click();
    await expect(page.getByLabel("Código de 6 números")).toBeFocused();
    await page.getByLabel("Código de 6 números").fill("000000");
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(page.getByText(/no es correcto o ya venció/)).toBeVisible();
  }
});

test("panel de presentación: botón visible, sin login y con los celulares ocultos", async ({ page, isMobile }) => {
  test.skip(!PANEL_ABIERTO, "el panel está cerrado (solo administradores)");
  await abrir(page, "/");
  await page.getByRole("banner").getByRole("link", { name: "Panel" }).click();
  await expect(page).toHaveURL(/\/admin\/pedidos/);
  await expect(page.getByRole("heading", { name: "Pedidos", level: 1 })).toBeVisible();
  await expect(page.getByText("Vista previa del panel.")).toBeVisible();
  if (isMobile) await expect(page.getByRole("banner").getByRole("link", { name: "Panel" })).toBeInViewport();

  const pedido = page.locator("a[href^='/admin/pedidos/MH4-']").first();
  if (await pedido.count()) {
    await pedido.click();
    await expect(page.getByText(/^••• ••• \d{4}$/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Escribirle por WhatsApp" })).toHaveCount(0);

    // Guardar un cambio de estado se refleja al instante (sin recargar). Solo en local: escribe en la base.
    if (!process.env.E2E_URL && !isMobile) {
      const nuevo = (await page.locator("#estado").inputValue()) === "en_proceso" ? "listo" : "en_proceso";
      const nombre = nuevo === "listo" ? "Listo" : "Tejiendo";
      await page.locator("#estado").selectOption(nuevo);
      await page.getByRole("button", { name: "Guardar cambios" }).click();
      await expect(page.getByRole("status").filter({ hasText: "Cambios guardados" })).toBeVisible();
      await expect(page.locator("#estado")).toHaveValue(nuevo);
      await expect(page.locator("header span[data-estado]")).toHaveText(nombre);
      await expect(page.locator("ol li").last()).toContainText(nombre);
    }
  }
});

test("panel: productos, clientes y ajustes en vista previa (se ven, no se guardan)", async ({ page, request }) => {
  test.skip(!PANEL_ABIERTO, "el panel está cerrado (solo administradores)");
  await abrir(page, "/admin/productos");
  await expect(page.getByRole("heading", { name: "Productos", level: 1 })).toBeVisible();
  await expect(page.locator("a[href^='/admin/productos/'] img").first()).toBeVisible();
  await page.getByRole("searchbox").fill("cupula");
  await page.getByRole("searchbox").press("Enter");
  await expect(page.getByText("Funko en cúpula de vidrio")).toBeVisible();
  await page.getByText("Funko en cúpula de vidrio").click();
  await expect(page.getByLabel("Nombre", { exact: true })).toHaveValue("Funko en cúpula de vidrio");
  await expect(page.getByRole("button", { name: "Guardar cambios" })).toBeDisabled();
  await expect(page.locator("input[type=file]")).toBeDisabled();

  await page.getByRole("navigation", { name: "Secciones del panel" }).getByRole("link", { name: "Ajustes" }).click();
  await expect(page.getByLabel(/Estoy recibiendo encargos/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Guardar cambios" })).toBeDisabled();

  await page.getByRole("navigation", { name: "Secciones del panel" }).getByRole("link", { name: "Clientes" }).click();
  await expect(page.getByRole("heading", { name: "Clientes", level: 1 })).toBeVisible();

  // La subida de fotos rechaza a quien no es administrador.
  const r = await request.post("/api/fotos", {
    data: { type: "blob.generate-client-token", payload: { pathname: "productos/ramo/abcdefghijkl-960.webp", clientPayload: null, multipart: false } },
  });
  expect(r.status()).toBe(400);
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
