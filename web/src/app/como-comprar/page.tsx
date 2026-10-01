import type { Metadata } from "next";
import Link from "next/link";
import { PasosPedido } from "@/components/PasosPedido";
import { BotonWhatsApp } from "@/components/BotonWhatsApp";
import { negocio } from "@/lib/config";
import estilos from "./como-comprar.module.css";

export const metadata: Metadata = {
  title: "Cómo comprar",
  description: "Tiempos de elaboración, anticipo, cuotas, envíos y preguntas frecuentes de Magic H4nds.",
};

// Políticas tomadas de la destacada "Información" de su Instagram.
const condiciones = [
  { titulo: "Tiempo de elaboración", texto: `Los pedidos tardan ${negocio.plazo} en estar listos.` },
  {
    titulo: "Anticipo",
    texto: "Pagas el 50 % para empezar y el otro 50 % cuando esté listo, antes del envío. También se puede pagar en 3 cuotas.",
  },
  { titulo: "Pedidos urgentes", texto: "Si lo necesitas antes, con un 10 % adicional se le da prioridad." },
  { titulo: "Envíos", texto: "Enviamos a todo Colombia. El valor del envío lo pagas cuando te llega el pedido." },
  { titulo: "Formas de pago", texto: "Transferencia a Bancolombia o Nequi. Los datos te llegan por WhatsApp con la cotización." },
  { titulo: "Devoluciones", texto: "Como cada pieza se hace para ti, no hay devolución del dinero una vez empieza el tejido." },
];

const preguntas = [
  {
    p: "¿Pueden tejer a una persona o a mi mascota?",
    r: "Sí, es lo que más hacemos. Nos envías fotos por WhatsApp y la tejemos con su ropa, su peinado y sus detalles.",
  },
  {
    p: "¿Puedo elegir colores y tamaño?",
    r: "Casi todo se puede personalizar: colores, tamaño, talla en la ropa y detalles. Lo acordamos al cotizar.",
  },
  {
    p: "¿Tienen productos de entrega inmediata?",
    r: "A veces hay piezas ya tejidas. Pregunta por WhatsApp qué hay disponible.",
  },
  {
    p: "¿Y si no veo lo que quiero en el catálogo?",
    r: "Cuéntanos tu idea en el formulario de encargo: la mayoría de diseños se pueden tejer bajo pedido.",
  },
];

export default function ComoComprar() {
  return (
    <div className={`envoltura ${estilos.pagina}`}>
      <h1>Cómo comprar</h1>
      <p className={estilos.intro}>
        Todo se teje bajo pedido. Así funciona, de la idea a tu casa.
      </p>

      <h2 className="visualmente-oculto">Pasos del pedido</h2>
      <PasosPedido />

      <section className={estilos.bloque} aria-labelledby="condiciones">
        <h2 id="condiciones">Condiciones</h2>
        <dl className={estilos.condiciones}>
          {condiciones.map((c) => (
            <div key={c.titulo}>
              <dt>{c.titulo}</dt>
              <dd>{c.texto}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={estilos.bloque} aria-labelledby="preguntas">
        <h2 id="preguntas">Preguntas frecuentes</h2>
        <div className={estilos.preguntas}>
          {preguntas.map((x) => (
            <details key={x.p}>
              <summary>{x.p}</summary>
              <p>{x.r}</p>
            </details>
          ))}
        </div>
      </section>

      <div className={estilos.cta}>
        <Link href="/encargo" className="boton boton-principal">
          Hacer un encargo
        </Link>
        <BotonWhatsApp texto="Hola Magic H4nds 💗 Tengo una pregunta sobre un pedido.">Preguntar por WhatsApp</BotonWhatsApp>
      </div>
    </div>
  );
}
