import { describe, expect, it } from "vitest";
import { correoCodigo } from "@/lib/correos/codigo";
import { correoCambioEstado, correoEncargoRecibido, correoNuevoEncargo } from "@/lib/correos/pedido";

const pedido = {
  codigo: "MH4-7K2P",
  producto: "Ramo de tulipanes",
  detalle: `Quiero <script>alert("x")</script> & más`,
  nombre: "Laura <b>Gómez</b>",
  ciudad: "Bogotá",
  whatsapp: "3101112233",
};

describe("correos", () => {
  it("escapan lo que escribe el cliente (sin HTML inyectado)", () => {
    for (const c of [correoNuevoEncargo(pedido), correoEncargoRecibido(pedido)]) {
      expect(c.html).not.toContain("<script>");
      expect(c.html).not.toContain("<b>Gómez</b>");
      expect(c.html).toContain("&#60;script&#62;");
    }
  });

  it("el aviso a Magic H4nds enlaza al panel y al WhatsApp del cliente", () => {
    const c = correoNuevoEncargo(pedido);
    expect(c.asunto).toBe("Nuevo encargo MH4-7K2P: Ramo de tulipanes");
    expect(c.html).toContain("/admin/pedidos/MH4-7K2P");
    expect(c.html).toContain("https://wa.me/573101112233");
  });

  it("la confirmación al cliente lleva el código y el enlace de seguimiento", () => {
    const c = correoEncargoRecibido(pedido);
    expect(c.asunto).toContain("MH4-7K2P");
    expect(c.html).toContain("/pedido?codigo=MH4-7K2P");
    expect(c.texto).toContain("MH4-7K2P");
  });

  it("el cambio de estado nombra el estado y marca los pasos anteriores", () => {
    const c = correoCambioEstado({ codigo: "MH4-7K2P", nombre: "Laura", estado: "en_proceso", fechaEstimada: "2026-10-20" });
    expect(c.asunto).toBe("Tu pedido MH4-7K2P: Tejiendo");
    expect(c.html.match(/✓/g)).toHaveLength(3);
    expect(c.html).toContain("Entrega estimada");
    expect(correoCambioEstado({ codigo: "MH4-7K2P", nombre: "Laura", estado: "cancelado" }).asunto).toContain("Cancelado");
  });

  it("el código de acceso aparece en el asunto, el texto y el HTML", () => {
    const c = correoCodigo("482913");
    expect(c.asunto).toContain("482913");
    expect(c.texto).toContain("482913");
    expect(c.html).toContain("482913");
  });
});
