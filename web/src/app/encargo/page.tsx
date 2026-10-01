import type { Metadata } from "next";
import { FormularioEncargo } from "@/components/FormularioEncargo";
import { productos } from "@/lib/catalogo";
import { negocio } from "@/lib/config";
import estilos from "./encargo.module.css";

export const metadata: Metadata = {
  title: "Hacer un encargo",
  description: "Cuéntanos qué quieres tejer: personaje, persona, mascota, colores y tamaño. Te cotizamos por WhatsApp.",
};

export default function Encargo() {
  const opciones = productos.map(({ slug, nombre, categoria }) => ({ slug, nombre, categoria }));
  return (
    <div className={`envoltura ${estilos.pagina}`}>
      <div className={estilos.texto}>
        <h1>Hacer un encargo</h1>
        <p>
          Cuéntanos tu idea y te respondemos por WhatsApp con el precio y la fecha de entrega. Normalmente tarda{" "}
          {negocio.plazo}.
        </p>
        <ul className={estilos.recordatorio}>
          <li>Para personalizados, ten a mano fotos de la persona o la mascota: las envías en el chat.</li>
          <li>Separas con el 50 % y pagas el resto cuando esté listo, o en 3 cuotas.</li>
          <li>Enviamos a todo Colombia; el envío se paga al recibir.</li>
        </ul>
      </div>
      <FormularioEncargo productos={opciones} />
    </div>
  );
}
