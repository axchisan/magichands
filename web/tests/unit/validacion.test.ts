import { describe, expect, it } from "vitest";
import { destinoSeguro } from "@/lib/destino";
import { validarEncargo } from "@/lib/validacion";

function formulario(campos: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(campos)) f.set(k, v);
  return f;
}

const valido = { detalle: "Un ramo de tulipanes rosados", nombre: "Ana", ciudad: "Vélez", telefono: "3101112233" };

describe("validarEncargo", () => {
  it("acepta un encargo completo y limpia espacios", () => {
    const r = validarEncargo(formulario({ ...valido, nombre: "  Ana  " }));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.datos.nombre).toBe("Ana");
  });

  it("marca cada campo obligatorio que falta", () => {
    const r = validarEncargo(formulario({}));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errores).sort()).toEqual(["ciudad", "detalle", "nombre", "telefono"]);
  });

  it("exige una idea de al menos 10 caracteres", () => {
    const r = validarEncargo(formulario({ ...valido, detalle: "corto" }));
    expect(r.ok).toBe(false);
  });

  it("acepta el celular con espacios o guiones", () => {
    const r = validarEncargo(formulario({ ...valido, telefono: "310 111-2233" }));
    expect(r.ok && r.datos.telefono).toBe("3101112233");
  });

  it.each(["2101112233", "310111223", "31011122334"])("rechaza el celular %s", (telefono) => {
    expect(validarEncargo(formulario({ ...valido, telefono })).ok).toBe(false);
  });
});

describe("destinoSeguro", () => {
  it("deja pasar rutas internas y descarta las externas", () => {
    expect(destinoSeguro("/admin/pedidos")).toBe("/admin/pedidos");
    for (const v of [null, "", "https://evil.example", "//evil.example", "/\\evil.example"]) expect(destinoSeguro(v)).toBe("/mi-cuenta");
  });
});
