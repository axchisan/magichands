"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Producto } from "@/lib/catalogo";
import { negocio } from "@/lib/config";
import { enlaceWhatsApp, mensajeEncargo, nuevoCodigo, type Encargo } from "@/lib/whatsapp";
import { crearEncargo } from "@/app/acciones/pedidos";
import { IconoWhatsApp } from "./Iconos";
import estilos from "./FormularioEncargo.module.css";

type Opcion = Pick<Producto, "slug" | "nombre" | "categoria">;

export function FormularioEncargo({ productos }: { productos: Opcion[] }) {
  const formulario = useRef<HTMLFormElement>(null);
  const [enviado, setEnviado] = useState<{ codigo: string; enlace: string; guardado: boolean } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState("");

  // Producto preseleccionado desde la ficha (/encargo?producto=slug). Se lee al montar para que el
  // formulario se pinte completo en el servidor (sin salto de diseño al hidratar).
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("producto");
    const select = formulario.current?.elements.namedItem("producto") as HTMLSelectElement | null;
    if (select && slug && productos.some((p) => p.slug === slug)) select.value = slug;
  }, [productos]);

  // Mantiene aria-invalid en sincronía con el estado visual :user-invalid (lectores de pantalla).
  useEffect(() => {
    const f = formulario.current;
    if (!f) return;
    const sync = (e: Event) => {
      const el = e.target as HTMLElement;
      if (!el.matches?.("input, select, textarea")) return;
      if (el.matches(":user-invalid")) el.setAttribute("aria-invalid", "true");
      else el.removeAttribute("aria-invalid");
    };
    f.addEventListener("blur", sync, true);
    f.addEventListener("input", sync);
    return () => {
      f.removeEventListener("blur", sync, true);
      f.removeEventListener("input", sync);
    };
  }, [enviado]);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Solo llega aquí si el formulario es válido: el navegador bloquea el envío y marca los campos
    // con error (:user-invalid) en caso contrario. El servidor vuelve a validar.
    if (enviando) return;
    const d = new FormData(e.currentTarget);
    setEnviando(true);
    setAviso("");
    let codigo = "";
    let guardado = false;
    try {
      const r = await crearEncargo(d);
      if (!r.ok) {
        setAviso(r.errores ? Object.values(r.errores).join(" ") : r.mensaje);
        setEnviando(false);
        return;
      }
      codigo = r.codigo;
      guardado = true;
    } catch {
      // Sin conexión con el servidor: el encargo igual puede salir por WhatsApp.
      codigo = nuevoCodigo();
    }
    const slug = String(d.get("producto") ?? "");
    const encargo: Encargo = {
      codigo,
      producto: productos.find((p) => p.slug === slug)?.nombre,
      detalle: String(d.get("detalle")),
      colores: String(d.get("colores") ?? ""),
      tamano: String(d.get("tamano") ?? ""),
      fecha: String(d.get("fecha") ?? ""),
      urgente: d.get("urgente") === "si",
      nombre: String(d.get("nombre")),
      ciudad: String(d.get("ciudad")),
    };
    setEnviado({ codigo, enlace: enlaceWhatsApp(mensajeEncargo(encargo), negocio.whatsapp), guardado });
    setEnviando(false);
  }

  if (enviado) {
    return (
      <div className={estilos.listo} role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <p className={estilos.paso}>Último paso</p>
        <h2>Envíalo por WhatsApp para que te cotice</h2>
        <p>
          {enviado.guardado ? "Tu encargo quedó guardado con el código " : "Tu código de pedido es "}
          <strong className={estilos.codigo}>{enviado.codigo}</strong>. Al tocar el botón se abre WhatsApp con todos
          los detalles: envía el mensaje y adjunta tus fotos de referencia en el chat.
        </p>
        <a className={`boton boton-whatsapp ${estilos.grande}`} href={enviado.enlace} target="_blank" rel="noopener noreferrer">
          <IconoWhatsApp /> Enviar por WhatsApp
        </a>
        <div className={estilos.acciones}>
          {enviado.guardado && (
            <Link className="boton boton-borde" href={`/pedido?codigo=${enviado.codigo}`}>
              Ver el estado del pedido
            </Link>
          )}
          <button type="button" className={estilos.otro} onClick={() => setEnviado(null)}>
            Hacer otro encargo
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formulario}
      className={estilos.form}
      onSubmit={enviar}
      onInvalidCapture={(e) => {
        // Sin el globo nativo del navegador (duplica nuestro mensaje y sale en su idioma):
        // se marca el campo y se lleva el foco al primero con error.
        e.preventDefault();
        const campo = e.target as HTMLElement;
        campo.setAttribute("aria-invalid", "true");
        if (!formulario.current?.querySelector(":focus:invalid")) campo.focus();
      }}
    >
      <fieldset className={estilos.bloque}>
        <legend>Qué quieres</legend>
        <div className="campo">
          <label htmlFor="producto">Producto</label>
          <span className="pista" id="producto-pista">
            Si es una idea nueva, deja “Otro diseño” y cuéntanosla abajo.
          </span>
          <select id="producto" name="producto" defaultValue="" aria-describedby="producto-pista">
            <option value="">Otro diseño</option>
            {productos.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="detalle">
            Cuéntanos tu idea <span className="requerido" aria-hidden="true">*</span>
          </label>
          <span className="pista" id="detalle-pista">
            Para quién es, qué personaje o persona, detalles de la ropa o accesorios.
          </span>
          <textarea
            id="detalle"
            name="detalle"
            required
            minLength={10}
            aria-describedby="detalle-pista"
            aria-errormessage="detalle-error"
          />
          <span className="error" id="detalle-error">
            Escribe al menos una frase con lo que quieres (10 letras o más).
          </span>
        </div>
        <div className={estilos.dos}>
          <div className="campo">
            <label htmlFor="colores">Colores</label>
            <input id="colores" name="colores" placeholder="Rosado y blanco" enterKeyHint="next" />
          </div>
          <div className="campo">
            <label htmlFor="tamano">Tamaño o talla</label>
            <input id="tamano" name="tamano" placeholder="20 cm, talla S…" enterKeyHint="next" />
          </div>
        </div>
        <div className={estilos.dos}>
          <div className="campo">
            <label htmlFor="fecha">¿Para cuándo lo necesitas?</label>
            <input id="fecha" name="fecha" type="date" aria-describedby="fecha-pista" />
            <span className="pista" id="fecha-pista">
              Normalmente tarda {negocio.plazo}.
            </span>
          </div>
          <div className={`campo ${estilos.check}`}>
            <input id="urgente" name="urgente" type="checkbox" value="si" aria-describedby="urgente-pista" />
            <label htmlFor="urgente">Es urgente</label>
            <span className="pista" id="urgente-pista">
              Con un 10 % adicional se le da prioridad.
            </span>
          </div>
        </div>
      </fieldset>

      <fieldset className={estilos.bloque}>
        <legend>Tus datos</legend>
        <div className={estilos.dos}>
          <div className="campo">
            <label htmlFor="nombre">
              Nombre <span className="requerido" aria-hidden="true">*</span>
            </label>
            <input id="nombre" name="nombre" required autoComplete="name" enterKeyHint="next" aria-errormessage="nombre-error" />
            <span className="error" id="nombre-error">
              Escribe tu nombre.
            </span>
          </div>
          <div className="campo">
            <label htmlFor="ciudad">
              Ciudad <span className="requerido" aria-hidden="true">*</span>
            </label>
            <input
              id="ciudad"
              name="ciudad"
              required
              autoComplete="address-level2"
              enterKeyHint="next"
              aria-errormessage="ciudad-error"
            />
            <span className="error" id="ciudad-error">
              Escribe la ciudad a la que enviamos.
            </span>
          </div>
        </div>
        <div className="campo">
          <label htmlFor="telefono">
            Celular <span className="requerido" aria-hidden="true">*</span>
          </label>
          <span className="pista" id="telefono-pista">
            10 dígitos. Con los últimos 4 puedes seguir tu pedido.
          </span>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            inputMode="numeric"
            required
            pattern="3[0-9]{9}"
            autoComplete="tel-national"
            enterKeyHint="send"
            maxLength={10}
            aria-describedby="telefono-pista"
            aria-errormessage="telefono-error"
          />
          <span className="error" id="telefono-error">
            Escribe un celular colombiano de 10 dígitos que empiece por 3.
          </span>
        </div>
      </fieldset>

      {/* Trampa para bots: oculta para personas y lectores de pantalla */}
      <div className={estilos.trampa} aria-hidden="true">
        <label htmlFor="sitio_web">Sitio web</label>
        <input id="sitio_web" name="sitio_web" tabIndex={-1} autoComplete="off" />
      </div>

      {aviso && (
        <p className={estilos.aviso} role="alert">
          {aviso}
        </p>
      )}
      <div className={estilos.enviar}>
        <button type="submit" className="boton boton-principal" disabled={enviando} aria-busy={enviando}>
          {enviando ? "Guardando tu encargo…" : "Continuar"}
        </button>
        <p className="pista">
          En el siguiente paso lo envías por WhatsApp, con tus fotos de referencia. Nada se cobra hasta que confirmes la cotización.
        </p>
      </div>
    </form>
  );
}
