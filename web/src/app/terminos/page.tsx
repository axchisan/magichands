import type { Metadata } from "next";
import Link from "next/link";
import { negocio } from "@/lib/config";
import { legal } from "@/lib/legal";
import estilos from "../legal.module.css";

export const metadata: Metadata = {
  title: "Condiciones del servicio",
  description: "Condiciones para hacer encargos en la web de Magic H4nds.",
};

export default function Terminos() {
  return (
    <article className={`envoltura ${estilos.pagina}`}>
      <h1>Condiciones del servicio</h1>
      <p className={estilos.fecha}>Última actualización: {legal.actualizado}</p>

      <h2>Qué es este sitio</h2>
      <p>
        Un catálogo de productos tejidos a mano por Magic H4nds en {negocio.ciudad} y un formulario para pedirlos por
        encargo. El sitio no cobra ni procesa pagos: la cotización, el pago y el envío se acuerdan directamente por
        WhatsApp. {legal.operador}
      </p>

      <h2>Encargos</h2>
      <ul>
        <li>Cada pieza se hace bajo pedido; las fotos del catálogo muestran trabajos ya realizados.</li>
        <li>El precio y la fecha de entrega se confirman al cotizar, antes de empezar.</li>
        <li>Tiempo habitual de elaboración: {negocio.plazo}.</li>
        <li>
          Pago: 50 % para empezar y 50 % cuando esté listo, antes del envío, o en 3 cuotas. Los pedidos urgentes tienen
          un recargo del 10 %.
        </li>
        <li>El envío se paga al recibir.</li>
        <li>Como cada pieza se hace para ti, no hay devolución del dinero una vez empieza el tejido.</li>
      </ul>
      <p>
        Más detalles en <Link href="/como-comprar">Cómo comprar</Link>.
      </p>

      <h2>Cuentas</h2>
      <p>
        Puedes usar el sitio sin crear una cuenta. Si entras con Google o con un código por correo, eres responsable del
        uso de tu cuenta. El tratamiento de tus datos se explica en la <Link href="/privacidad">política de privacidad</Link>.
      </p>

      <h2>Contenido</h2>
      <p>
        Las fotos, textos y diseños son de Magic H4nds. Los personajes de películas, series o marcas que aparecen en
        algunos productos pertenecen a sus dueños; se tejen como piezas personalizadas a pedido.
      </p>

      <h2>Contacto</h2>
      <p>
        Por <a href={negocio.instagram}>Instagram</a> o por correo a <a href={`mailto:${legal.correo}`}>{legal.correo}</a>.
      </p>
    </article>
  );
}
