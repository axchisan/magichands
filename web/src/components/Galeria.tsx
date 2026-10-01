"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Foto } from "@/lib/catalogo";
import estilos from "./Galeria.module.css";

// Galería de la ficha: tira con scroll-snap (se desliza con el dedo en celular) + miniaturas.
export function Galeria({ fotos, nombre }: { fotos: Foto[]; nombre: string }) {
  const [actual, setActual] = useState(0);
  const tira = useRef<HTMLUListElement>(null);

  // La foto visible (≥ 60 %) es la actual: sincroniza miniaturas e indicador al deslizar.
  useEffect(() => {
    const ul = tira.current;
    if (!ul) return;
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setActual(Number((e.target as HTMLElement).dataset.i));
      },
      { root: ul, threshold: 0.6 },
    );
    ul.querySelectorAll("li").forEach((li) => obs.observe(li));
    return () => obs.disconnect();
  }, [fotos]);

  function ir(i: number) {
    const ul = tira.current;
    const li = ul?.children[i] as HTMLElement | undefined;
    if (ul && li) ul.scrollTo({ left: li.offsetLeft - ul.offsetLeft, behavior: "smooth" });
    setActual(i);
  }

  return (
    <div className={estilos.galeria}>
      <div className={estilos.marco}>
        <ul ref={tira} className={estilos.tira} aria-label={`Fotos de ${nombre}`}>
          {fotos.map((f, i) => (
            <li key={f.src} data-i={i} aria-label={`Foto ${i + 1} de ${fotos.length}`}>
              <Image
                src={f.src}
                alt={f.alt ?? nombre}
                width={f.ancho}
                height={f.alto}
                sizes="(max-width: 52rem) 100vw, 40rem"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : undefined}
              />
            </li>
          ))}
        </ul>
        {fotos.length > 1 && (
          <span className={estilos.contador} aria-hidden="true">
            {actual + 1} / {fotos.length}
          </span>
        )}
      </div>
      {fotos.length > 1 && (
        <ul className={estilos.miniaturas} aria-label="Elegir foto">
          {fotos.map((f, i) => (
            <li key={f.src}>
              <button
                type="button"
                aria-label={`Ver foto ${i + 1} de ${fotos.length}`}
                aria-current={i === actual ? "true" : undefined}
                onClick={() => ir(i)}
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
