import "server-only";
import { unstable_cache } from "next/cache";
import { db, schema } from "@/db";
import { negocio } from "./config";

// Ajustes que ella cambia desde el panel (tabla `ajustes`), en caché con la etiqueta "ajustes".
export const ETIQUETA_AJUSTES = "ajustes";

export type Ajustes = {
  agenda: { abierta: boolean; mensaje: string };
  mostrarPrecios: boolean;
};

export const AJUSTES_POR_DEFECTO: Ajustes = {
  agenda: { abierta: true, mensaje: negocio.agenda.mensaje },
  mostrarPrecios: false,
};

export const ajustes = unstable_cache(
  async (): Promise<Ajustes> => {
    const filas = await db.select().from(schema.ajustes);
    const valor = Object.fromEntries(filas.map((f) => [f.clave, f.valor]));
    return {
      agenda: { ...AJUSTES_POR_DEFECTO.agenda, ...(valor.agenda as Partial<Ajustes["agenda"]> | undefined) },
      mostrarPrecios: valor.mostrarPrecios === true,
    };
  },
  ["ajustes-v1"],
  { tags: [ETIQUETA_AJUSTES] },
);
