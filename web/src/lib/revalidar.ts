import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { ETIQUETA_CATALOGO } from "./catalogo-db";
import { ETIQUETA_AJUSTES } from "./ajustes";

// Tras un cambio en el panel: la web pública se regenera con lo nuevo en la siguiente visita
// ({ expire: 0 }: nadie ve la versión vieja después de guardar).
export function revalidarCatalogo() {
  revalidateTag(ETIQUETA_CATALOGO, { expire: 0 });
  revalidatePath("/", "layout");
}

export function revalidarAjustes() {
  revalidateTag(ETIQUETA_AJUSTES, { expire: 0 });
  revalidatePath("/", "layout");
}
