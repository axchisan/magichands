import type { Metadata } from "next";
import { negocio } from "@/lib/config";
import { legal } from "@/lib/legal";
import estilos from "../legal.module.css";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo se tratan los datos personales en la web de Magic H4nds.",
};

export default function Privacidad() {
  return (
    <article className={`envoltura ${estilos.pagina}`}>
      <h1>Política de privacidad</h1>
      <p className={estilos.fecha}>Última actualización: {legal.actualizado}</p>

      <p>
        Esta política explica qué datos personales se recogen en este sitio, para qué se usan y cómo puedes
        ejercer tus derechos, de acuerdo con la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia.
      </p>

      <h2>Responsable</h2>
      <p>
        {legal.responsable}. Contacto para temas de datos personales: <a href={`mailto:${legal.correo}`}>{legal.correo}</a>.
      </p>

      <h2>Qué datos se recogen</h2>
      <ul>
        <li>
          <strong>Al hacer un encargo:</strong> nombre, ciudad, celular y la descripción de lo que quieres. Estos datos
          se usan para armar el mensaje que tú mismo envías por WhatsApp; la web no los envía a ningún otro lugar.
        </li>
        <li>
          <strong>En tu navegador:</strong> el código y el estado de tus encargos se guardan en el almacenamiento local de
          tu navegador para que puedas consultarlos en “Seguir mi pedido”. Puedes borrarlos limpiando los datos del sitio.
        </li>
        <li>
          <strong>Si inicias sesión con Google o con un código por correo:</strong> tu nombre, correo electrónico y foto de
          perfil, para identificarte, mostrarte tus pedidos y avisarte de su estado.
        </li>
        <li>
          <strong>Datos técnicos:</strong> el proveedor de alojamiento registra datos básicos de las visitas (dirección IP,
          navegador, páginas vistas) para el funcionamiento y la seguridad del sitio.
        </li>
      </ul>

      <h2>Para qué se usan</h2>
      <p>
        Solo para atender tus encargos (cotizar, confirmar, coordinar el envío y avisarte del estado) y para el
        funcionamiento del sitio. No se venden ni se ceden a terceros, ni se usan para publicidad.
      </p>

      <h2>Con quién se comparten</h2>
      <p>
        Con los proveedores que hacen funcionar el sitio, que tratan los datos por cuenta del responsable: alojamiento
        web (Vercel), base de datos (Neon), envío de correos (Resend) y, si eliges entrar con Google, Google. El mensaje
        del encargo lo envías tú por WhatsApp.
      </p>

      <h2>Datos de Google</h2>
      <p>
        Si entras con Google, solo se solicitan tu nombre, correo y foto de perfil. Su uso cumple la{" "}
        <a href="https://developers.google.com/terms/api-services-user-data-policy">
          Política de Datos del Usuario de los Servicios de las APIs de Google
        </a>
        , incluidos los requisitos de uso limitado.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes conocer, actualizar, rectificar y pedir que se supriman tus datos, así como revocar tu autorización,
        escribiendo a <a href={`mailto:${legal.correo}`}>{legal.correo}</a> o por{" "}
        <a href={negocio.instagram}>Instagram</a>. Se responde en un máximo de 15 días hábiles. También puedes acudir a
        la Superintendencia de Industria y Comercio.
      </p>

      <h2>Cuánto tiempo se guardan</h2>
      <p>
        Mientras sean necesarios para atender tus pedidos y cumplir obligaciones legales, o hasta que pidas que se
        borren.
      </p>
    </article>
  );
}
