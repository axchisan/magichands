import { IconoWhatsApp } from "./Iconos";
import { negocio } from "@/lib/config";
import { enlaceWhatsApp } from "@/lib/whatsapp";

export function BotonWhatsApp({
  texto,
  children = "Escribir por WhatsApp",
  className = "",
}: {
  texto: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={`boton boton-whatsapp ${className}`}
      href={enlaceWhatsApp(texto, negocio.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconoWhatsApp />
      {children}
    </a>
  );
}
