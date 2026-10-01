import Image from "next/image";
import Link from "next/link";
import { MenuMovil, Navegacion } from "./Navegacion";
import { BotonWhatsApp } from "./BotonWhatsApp";
import estilos from "./Cabecera.module.css";

export function Cabecera() {
  return (
    <header className={estilos.cabecera}>
      <div className={`envoltura ${estilos.fila}`}>
        <Link href="/" className={estilos.logo} aria-label="Magic H4nds, inicio">
          <Image src="/img/marca/mh4-oscuro.webp" alt="" width={140} height={67} loading="eager" unoptimized />
        </Link>
        <Navegacion />
        <div className={estilos.acciones}>
          <BotonWhatsApp texto="Hola Magic H4nds 💗 Tengo una pregunta." className={estilos.wa}>
            <span className={estilos.waTexto}>Escríbenos</span>
          </BotonWhatsApp>
          <MenuMovil />
        </div>
      </div>
    </header>
  );
}
