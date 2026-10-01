"use client";

import Image from "next/image";
import { useState } from "react";
import type { Foto } from "@/lib/catalogo";
import estilos from "./Galeria.module.css";

export function Galeria({ fotos, nombre }: { fotos: Foto[]; nombre: string }) {
  const [actual, setActual] = useState(0);
  const foto = fotos[actual];
  return (
    <div className={estilos.galeria}>
      <div className={estilos.principal}>
        <Image
          key={foto.src}
          src={foto.src}
          alt={foto.alt ?? nombre}
          width={foto.ancho}
          height={foto.alto}
          sizes="(max-width: 52rem) 100vw, 40rem"
          loading="eager"
          fetchPriority={actual === 0 ? "high" : undefined}
        />
      </div>
      {fotos.length > 1 && (
        <ul className={estilos.miniaturas} aria-label={`Fotos de ${nombre}`}>
          {fotos.map((f, i) => (
            <li key={f.src}>
              <button
                type="button"
                aria-label={`Ver foto ${i + 1} de ${fotos.length}`}
                aria-current={i === actual ? "true" : undefined}
                onClick={() => setActual(i)}
              >
                <Image src={f.src} alt="" width={f.ancho} height={f.alto} sizes="6rem" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
