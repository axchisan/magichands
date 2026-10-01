import { describe, expect, it } from "vitest";
import imageLoader, { elegirAncho } from "@/lib/image-loader";
import { enlaceWhatsApp, mensajeEncargo, mensajeProducto, nuevoCodigo } from "@/lib/whatsapp";
import { buscarPedido, ESTADOS, pedidosEjemplo, type Pedido } from "@/lib/pedidos";
import { filtrar, normalizar } from "@/lib/filtros";
import { productos } from "@/lib/catalogo";

describe("cargador de imágenes", () => {
  it("elige la variante más pequeña que cubre el ancho pedido", () => {
    expect(elegirAncho(240)).toBe(480);
    expect(elegirAncho(480)).toBe(480);
    expect(elegirAncho(481)).toBe(960);
    expect(elegirAncho(1440)).toBe(1440);
    expect(elegirAncho(3000)).toBe(1440);
  });

  it("construye la ruta del WebP y respeta rutas con extensión", () => {
    expect(imageLoader({ src: "/img/p/abejita/01", width: 960 })).toBe("/img/p/abejita/01-960.webp");
    expect(imageLoader({ src: "/img/marca/logo.webp", width: 960 })).toBe("/img/marca/logo.webp");
  });
});

describe("WhatsApp", () => {
  it("genera códigos MH4- con 4 caracteres sin ambiguos", () => {
    for (let i = 0; i < 200; i++) expect(nuevoCodigo()).toMatch(/^MH4-[2-9A-HJ-NP-Z]{4}$/);
    expect(nuevoCodigo(() => 0)).toBe("MH4-2222");
  });

  it("arma el mensaje del encargo y omite los campos vacíos", () => {
    const m = mensajeEncargo({
      codigo: "MH4-ABCD",
      producto: "Abejita",
      detalle: "  Una abejita gigante  ",
      colores: "",
      fecha: "2026-12-05",
      urgente: true,
      nombre: "Ana",
      ciudad: "Vélez",
    });
    expect(m).toContain("Pedido: MH4-ABCD");
    expect(m).toContain("Producto: Abejita");
    expect(m).toContain("Lo que quiero: Una abejita gigante");
    expect(m).toContain("5 de diciembre de 2026");
    expect(m).toContain("recargo del 10 %");
    expect(m).not.toContain("Colores:");
    expect(m).not.toContain("Tamaño");
  });

  it("codifica el texto y deja solo dígitos en el número", () => {
    const url = enlaceWhatsApp("Hola & más", "+57 300 123 4567");
    expect(url).toBe("https://wa.me/573001234567?text=Hola%20%26%20m%C3%A1s");
    expect(enlaceWhatsApp("x")).toBe("https://wa.me/?text=x");
    expect(mensajeProducto("Coraline")).toContain("Me interesa: Coraline.");
  });
});

describe("seguimiento de pedidos", () => {
  it("encuentra un pedido de ejemplo con código y teléfono", () => {
    const r = buscarPedido("MH4-7K2P", "1234", []);
    expect(r.ok && r.pedido.estado).toBe("en_proceso");
  });

  it("acepta el código en minúsculas o sin guion", () => {
    expect(buscarPedido("mh47k2p", "1234", []).ok).toBe(true);
  });

  it("distingue código inexistente de teléfono incorrecto", () => {
    expect(buscarPedido("MH4-ZZZZ", "1234", [])).toEqual({ ok: false, motivo: "no-existe" });
    expect(buscarPedido("MH4-7K2P", "0000", [])).toEqual({ ok: false, motivo: "telefono" });
  });

  it("incluye los encargos guardados en el navegador", () => {
    const local: Pedido = {
      codigo: "MH4-NUEV",
      producto: "Ramo",
      telefonoFinal: "9876",
      estado: "solicitud",
      creado: "2026-10-01",
      historial: [{ estado: "solicitud", fecha: "2026-10-01" }],
    };
    expect(buscarPedido("MH4-NUEV", "9876", [local]).ok).toBe(true);
  });

  it("los pedidos de ejemplo usan estados válidos en orden", () => {
    const orden = ESTADOS.map((e) => e.id as string);
    for (const p of pedidosEjemplo) {
      const idx = p.historial.map((h) => orden.indexOf(h.estado));
      expect(idx.every((i) => i >= 0)).toBe(true);
      expect([...idx].sort((a, b) => a - b)).toEqual(idx);
      expect(p.historial.at(-1)?.estado).toBe(p.estado);
    }
  });
});

describe("filtros del catálogo", () => {
  it("normaliza tildes y mayúsculas", () => {
    expect(normalizar("Pingüino Vélez")).toBe("pinguino velez");
  });

  it("busca sin tildes", () => {
    expect(filtrar(productos, { texto: "pinguino" }).map((p) => p.slug)).toContain("mini-amigurumis-llavero");
  });

  it("combina categoría y ocasión", () => {
    const r = filtrar(productos, { categoria: "flores", ocasion: "dia-de-la-madre" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.categoria === "flores" && p.ocasiones.includes("dia-de-la-madre"))).toBe(true);
  });

  it("devuelve vacío cuando nada coincide", () => {
    expect(filtrar(productos, { texto: "zzzz-no-existe" })).toEqual([]);
  });
});

