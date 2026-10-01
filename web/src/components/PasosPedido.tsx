import { negocio } from "@/lib/config";
import estilos from "./PasosPedido.module.css";

// Es un proceso real en orden, por eso va numerado.
const pasos = [
  {
    titulo: "Eliges y personalizas",
    texto: "Escoges un producto del catálogo o nos cuentas tu idea, con colores, tamaño y fotos de referencia.",
  },
  {
    titulo: "Te cotizamos por WhatsApp",
    texto: "Te confirmamos precio y fecha de entrega antes de empezar.",
  },
  {
    titulo: "Separas con el 50 %",
    texto: "Pagas la mitad para empezar a tejer y el resto cuando esté listo. También se puede en 3 cuotas.",
  },
  {
    titulo: "Lo tejemos y te lo enviamos",
    texto: `Tu pedido está listo en ${negocio.plazo}. Enviamos a todo el país y el envío se paga al recibir.`,
  },
];

export function PasosPedido() {
  return (
    <ol className={estilos.pasos}>
      {pasos.map((p) => (
        <li key={p.titulo}>
          <h3>{p.titulo}</h3>
          <p>{p.texto}</p>
        </li>
      ))}
    </ol>
  );
}
