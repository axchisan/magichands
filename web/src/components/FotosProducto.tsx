"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { upload } from "@vercel/blob/client";
import { borrarFoto, ordenarFotos, registrarFoto } from "@/app/acciones/fotos";
import { ANCHOS_FOTO } from "@/lib/fotos";
import estilos from "@/app/admin/admin.module.css";

type FotoFila = { id: number; clave: string; ancho: number; alto: number; origen: string };

const LETRAS = "abcdefghijklmnopqrstuvwxyz0123456789";
const idAleatorio = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => LETRAS[b % LETRAS.length]).join("");

/** Redimensiona en el navegador (sin agrandar) y codifica en WebP; si el navegador no sabe (Safari), en JPEG. */
async function versiones(archivo: File) {
  const imagen = await createImageBitmap(archivo, { imageOrientation: "from-image" });
  const lienzo = document.createElement("canvas");
  const salida: { ancho: number; blob: Blob }[] = [];
  let formato: "webp" | "jpg" = "webp";
  for (const ancho of ANCHOS_FOTO) {
    const w = Math.min(ancho, imagen.width);
    const h = Math.round((imagen.height * w) / imagen.width);
    lienzo.width = w;
    lienzo.height = h;
    lienzo.getContext("2d")!.drawImage(imagen, 0, 0, w, h);
    let blob = await new Promise<Blob | null>((r) => lienzo.toBlob(r, "image/webp", 0.8));
    if (!blob || blob.type !== "image/webp") {
      formato = "jpg";
      blob = await new Promise<Blob | null>((r) => lienzo.toBlob(r, "image/jpeg", 0.85));
    }
    if (!blob) throw new Error("No se pudo procesar la foto");
    salida.push({ ancho, blob });
  }
  // Si el primer tamaño salió en WebP y otro no, todos deben ir en el mismo formato.
  if (formato === "jpg" && salida.some((s) => s.blob.type !== "image/jpeg")) {
    for (const s of salida) {
      const w = Math.min(s.ancho, imagen.width);
      lienzo.width = w;
      lienzo.height = Math.round((imagen.height * w) / imagen.width);
      lienzo.getContext("2d")!.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
      s.blob = (await new Promise<Blob | null>((r) => lienzo.toBlob(r, "image/jpeg", 0.85)))!;
    }
  }
  const final = Math.min(1440, imagen.width);
  return { salida, formato, ancho: final, alto: Math.round((imagen.height * final) / imagen.width) };
}

export function FotosProducto({ slug, nombre, fotos, soloLectura }: { slug: string; nombre: string; fotos: FotoFila[]; soloLectura: boolean }) {
  const router = useRouter();
  const [estado, setEstado] = useState("");
  const [error, setError] = useState("");
  const [confirmar, setConfirmar] = useState<number | null>(null);
  const [ocupado, iniciar] = useTransition();
  const [subiendo, setSubiendo] = useState(false);

  async function subir(archivos: FileList | null) {
    if (!archivos?.length) return;
    setError("");
    setSubiendo(true);
    const lista = [...archivos].filter((a) => a.type.startsWith("image/"));
    try {
      for (const [i, archivo] of lista.entries()) {
        setEstado(`Preparando foto ${i + 1} de ${lista.length}…`);
        const { salida, formato, ancho, alto } = await versiones(archivo);
        const id = idAleatorio();
        setEstado(`Subiendo foto ${i + 1} de ${lista.length}…`);
        let base = "";
        for (const v of salida) {
          const r = await upload(`productos/${slug}/${id}-${v.ancho}.${formato}`, v.blob, {
            access: "public",
            handleUploadUrl: "/api/fotos",
            contentType: formato === "webp" ? "image/webp" : "image/jpeg",
          });
          base = r.url.replace(/-\d+\.(webp|jpg)$/, "");
        }
        const r = await registrarFoto(slug, formato === "jpg" ? `${base}~jpg` : base, ancho, alto);
        if (!r.ok) throw new Error(r.mensaje);
      }
      setEstado(lista.length === 1 ? "Foto subida." : `${lista.length} fotos subidas.`);
      router.refresh();
    } catch (e) {
      setEstado("");
      setError(e instanceof Error && e.message ? `No se pudo subir: ${e.message}` : "No se pudo subir la foto. Inténtalo de nuevo.");
    } finally {
      setSubiendo(false);
    }
  }

  function accion(fn: () => Promise<{ ok: boolean; mensaje?: string }>, hecho: string) {
    setError("");
    iniciar(async () => {
      const r = await fn();
      if (!r.ok) setError(r.mensaje ?? "No se pudo guardar.");
      else {
        setEstado(hecho);
        router.refresh();
      }
    });
  }

  const mover = (desde: number, hasta: number) => {
    const ids = fotos.map((f) => f.id);
    const [x] = ids.splice(desde, 1);
    ids.splice(hasta, 0, x);
    accion(() => ordenarFotos(slug, ids), hasta === 0 ? "Portada cambiada." : "Orden guardado.");
  };

  const bloqueado = soloLectura || subiendo || ocupado;

  return (
    <section className={estilos.tarjeta} aria-labelledby="fotos-producto">
      <div className={estilos.encabezado}>
        <h2 id="fotos-producto">Fotos {fotos.length > 0 && <span className={estilos.etiquetaSuave}>{fotos.length}</span>}</h2>
        <label className={`boton boton-principal ${estilos.subir}`} aria-disabled={bloqueado}>
          {subiendo ? "Subiendo…" : "+ Subir fotos"}
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={bloqueado}
            className="sr-only"
            onChange={(e) => {
              void subir(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <p className="pista">
        La primera es la portada en el catálogo. Se suben optimizadas para que la web cargue rápido.
        {soloLectura && " En la vista previa no se pueden subir ni cambiar."}
      </p>
      {fotos.length === 0 ? (
        <p className={estilos.vacio}>Aún no tiene fotos. Sin fotos, el producto no aparece en la web.</p>
      ) : (
        <ol className={estilos.fotos}>
          {fotos.map((f, i) => (
            <li key={f.id}>
              <Image src={f.clave} alt={`${nombre}, foto ${i + 1}`} width={f.ancho} height={f.alto} sizes="(max-width: 40rem) 45vw, 200px" />
              {i === 0 && <span className={estilos.portada}>Portada</span>}
              <div className={estilos.fotoAcciones}>
                <button type="button" disabled={bloqueado || i === 0} onClick={() => mover(i, i - 1)} aria-label={`Mover la foto ${i + 1} antes`}>
                  ‹
                </button>
                <button type="button" disabled={bloqueado || i === fotos.length - 1} onClick={() => mover(i, i + 1)} aria-label={`Mover la foto ${i + 1} después`}>
                  ›
                </button>
                {i > 0 && (
                  <button type="button" disabled={bloqueado} onClick={() => mover(i, 0)}>
                    Portada
                  </button>
                )}
                {confirmar === f.id ? (
                  <button
                    type="button"
                    className={estilos.peligro}
                    disabled={bloqueado}
                    onClick={() => {
                      setConfirmar(null);
                      accion(() => borrarFoto(slug, f.id), "Foto borrada.");
                    }}
                  >
                    ¿Borrar? Sí
                  </button>
                ) : (
                  <button type="button" disabled={bloqueado} onClick={() => setConfirmar(f.id)} aria-label={`Borrar la foto ${i + 1}`}>
                    Borrar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
      <p role="status" aria-live="polite" className={estilos.estadoFotos}>
        {error ? <span className={estilos.textoError}>{error}</span> : estado}
      </p>
    </section>
  );
}
