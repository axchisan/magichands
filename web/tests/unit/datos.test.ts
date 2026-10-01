import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ANCHOS } from "@/lib/image-loader";
import { fotosHero, fotosMarca, ocasiones } from "@/lib/catalogo";
import { categoriasSemilla as categorias, productosSemilla as productos } from "@/lib/catalogo-semilla";

const PUBLIC = path.resolve(__dirname, "../../public");
const existe = (src: string, ancho: number) => existsSync(path.join(PUBLIC, `${src}-${ancho}.webp`));

describe("integridad del catálogo (src/data/catalogo.json)", () => {
  it("tiene 73 productos con slugs únicos", () => {
    expect(productos).toHaveLength(73);
    expect(new Set(productos.map((p) => p.slug)).size).toBe(productos.length);
  });

  it("cada producto pertenece a una categoría existente y las ocasiones son válidas", () => {
    const cats = new Set(categorias.map((c) => c.slug));
    const ocs = new Set(ocasiones.map((o) => o.slug));
    for (const p of productos) {
      expect(cats.has(p.categoria), p.slug).toBe(true);
      for (const o of p.ocasiones) expect(ocs.has(o), `${p.slug}: ${o}`).toBe(true);
    }
  });

  it("los totales por categoría cuadran", () => {
    for (const c of categorias) expect(c.total).toBe(productos.filter((p) => p.categoria === c.slug).length);
  });

  it("cada foto existe en los tres anchos y tiene dimensiones y texto alternativo", () => {
    for (const p of productos) {
      expect(p.fotos.length, p.slug).toBeGreaterThan(0);
      for (const f of p.fotos) {
        expect(f.ancho > 0 && f.alto > 0, f.src).toBe(true);
        expect(f.alt, f.src).toBeTruthy();
        for (const a of ANCHOS) expect(existe(f.src, a), `${f.src}-${a}`).toBe(true);
      }
    }
  });

  it("las 8 fotos de la portada y las de marca existen", () => {
    expect(fotosHero).toHaveLength(8);
    for (const f of [...fotosHero, ...Object.values(fotosMarca).flat()])
      for (const a of ANCHOS) expect(existe(f.src, a), `${f.src}-${a}`).toBe(true);
  });

  it("hay entre 1 y 8 destacados para la portada", () => {
    const n = productos.filter((p) => p.destacado).length;
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThanOrEqual(8);
  });

  it("los precios guardados vienen con su fuente y año", () => {
    for (const p of productos.filter((x) => x.precioReferencia)) {
      expect(p.precioReferencia!.fuente).toBeTruthy();
      expect(p.precioReferencia!.anio).toBeTruthy();
    }
  });
});
