import type { Metadata } from "next";
import { CatalogoFiltrable } from "@/components/CatalogoFiltrable";
import { ocasiones } from "@/lib/catalogo";
import { catalogo } from "@/lib/catalogo-db";
import estilos from "./catalogo.module.css";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Amigurumis, personalizados, flores, ropa, bolsos y más, tejidos a mano bajo pedido.",
};

export default async function Catalogo() {
  const { categorias, productos } = await catalogo();
  return (
    <div className={`envoltura ${estilos.pagina}`}>
      <h1 className={estilos.titulo}>Catálogo</h1>
      <p className={estilos.intro}>
        Todo se teje bajo pedido y casi todo se puede personalizar: colores, tamaño, talla o el personaje que quieras.
      </p>
      <CatalogoFiltrable productos={productos} categorias={categorias} ocasiones={ocasiones} />
    </div>
  );
}
