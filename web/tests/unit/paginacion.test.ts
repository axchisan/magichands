import { describe, expect, it } from "vitest";
import { numerosVisibles, pagina, totalPaginas } from "@/lib/paginacion";

describe("paginación", () => {
  const lista = Array.from({ length: 73 }, (_, i) => i + 1);

  it("calcula páginas de 12", () => {
    expect(totalPaginas(73)).toBe(7);
    expect(totalPaginas(12)).toBe(1);
    expect(totalPaginas(0)).toBe(1);
  });

  it("corta la página pedida y acota los límites", () => {
    expect(pagina(lista, 1)).toEqual(lista.slice(0, 12));
    expect(pagina(lista, 7)).toEqual([73]);
    expect(pagina(lista, 99)).toEqual([73]);
    expect(pagina(lista, 0)).toEqual(lista.slice(0, 12));
  });

  it("muestra primera, última y vecinas con saltos", () => {
    expect(numerosVisibles(1, 3)).toEqual([1, 2, 3]);
    expect(numerosVisibles(1, 7)).toEqual([1, 2, null, 7]);
    expect(numerosVisibles(4, 7)).toEqual([1, null, 3, 4, 5, null, 7]);
    expect(numerosVisibles(7, 7)).toEqual([1, null, 6, 7]);
  });
});
