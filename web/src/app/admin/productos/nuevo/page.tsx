import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, schema } from "@/db";
import { accesoActual } from "@/lib/admin";
import { guardarProducto } from "@/app/acciones/productos";
import { EditorProducto } from "@/components/EditorProducto";
import estilos from "../../admin.module.css";

export const metadata = { title: "Nuevo producto" };

export default async function NuevoProducto() {
  const [cats, { acceso }] = await Promise.all([
    db.select({ slug: schema.categoria.slug, nombre: schema.categoria.nombre }).from(schema.categoria).orderBy(asc(schema.categoria.orden)),
    accesoActual(),
  ]);
  return (
    <div className={estilos.contenido}>
      <p>
        <Link href="/admin/productos">‹ Productos</Link>
      </p>
      <h1>Nuevo producto</h1>
      <p className="pista">Primero los datos; en el siguiente paso subes las fotos. Sin fotos no se muestra en la web.</p>
      <EditorProducto
        accion={guardarProducto.bind(null, null)}
        categorias={cats}
        soloLectura={acceso !== "completo"}
        textoBoton="Crear y subir fotos"
        valores={{
          nombre: "",
          categoria: "",
          descripcion: "",
          personalizacion: [],
          tamano: null,
          plazo: "15 a 20 días hábiles",
          ocasiones: [],
          precio: null,
          precioReferencia: null,
          destacado: false,
          activo: true,
        }}
      />
    </div>
  );
}
