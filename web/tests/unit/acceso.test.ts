import { describe, expect, it } from "vitest";
import { accesoPanel, ocultarCelular } from "@/lib/acceso";

describe("accesoPanel", () => {
  it("el administrador con sesión ve todo, con el panel abierto o cerrado", () => {
    expect(accesoPanel({ abierto: true, conSesion: true, admin: true })).toBe("completo");
    expect(accesoPanel({ abierto: false, conSesion: true, admin: true })).toBe("completo");
  });
  it("panel abierto: los demás ven la vista previa", () => {
    expect(accesoPanel({ abierto: true, conSesion: false, admin: false })).toBe("vista-previa");
    expect(accesoPanel({ abierto: true, conSesion: true, admin: false })).toBe("vista-previa");
  });
  it("panel cerrado: sin sesión se pide entrar y un cliente no pasa", () => {
    expect(accesoPanel({ abierto: false, conSesion: false, admin: false })).toBe("entrar");
    expect(accesoPanel({ abierto: false, conSesion: true, admin: false })).toBe("denegado");
  });
  it("oculta el celular salvo los últimos 4 dígitos", () => {
    expect(ocultarCelular("3105222290")).toBe("••• ••• 2290");
  });
});
