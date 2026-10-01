import { FormularioGestion } from "./FormularioGestion";
import type { RespuestaGuardar } from "@/app/acciones/admin";
import { ocasiones } from "@/lib/catalogo";
import type { PrecioReferencia } from "@/lib/catalogo-semilla";
import estilos from "@/app/admin/admin.module.css";

export type ValoresProducto = {
  nombre: string;
  categoria: string;
  descripcion: string;
  personalizacion: string[];
  tamano: string | null;
  plazo: string;
  ocasiones: string[];
  precio: number | null;
  precioReferencia: PrecioReferencia | null;
  destacado: boolean;
  activo: boolean;
};

const pesos = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

/** Formulario de producto (crear y editar). */
export function EditorProducto({
  accion,
  valores,
  categorias,
  soloLectura,
  textoBoton,
}: {
  accion: (previo: RespuestaGuardar, f: FormData) => Promise<RespuestaGuardar>;
  valores: ValoresProducto;
  categorias: { slug: string; nombre: string }[];
  soloLectura: boolean;
  textoBoton?: string;
}) {
  const ref = valores.precioReferencia;
  return (
    <FormularioGestion accion={accion} version={JSON.stringify(valores)} soloLectura={soloLectura} textoBoton={textoBoton} className={estilos.form}>
      <section className={estilos.tarjeta} aria-labelledby="datos-producto">
        <h2 id="datos-producto">Datos</h2>
        <div className="campo">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" name="nombre" required minLength={3} maxLength={80} defaultValue={valores.nombre} />
        </div>
        <div className="campo">
          <label htmlFor="categoria">Categoría</label>
          <select id="categoria" name="categoria" required defaultValue={valores.categoria}>
            <option value="" disabled>
              Elige una
            </option>
            {categorias.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="descripcion">Descripción</label>
          <textarea id="descripcion" name="descripcion" required minLength={10} maxLength={1500} rows={4} defaultValue={valores.descripcion} />
        </div>
        <div className="campo">
          <label htmlFor="personalizacion">Qué se puede elegir (uno por línea)</label>
          <textarea
            id="personalizacion"
            name="personalizacion"
            rows={4}
            placeholder={"colores\ntamaño\nnombre bordado"}
            defaultValue={valores.personalizacion.join("\n")}
          />
        </div>
        <div className={estilos.tres}>
          <div className="campo">
            <label htmlFor="tamano">Tamaño (opcional)</label>
            <input id="tamano" name="tamano" maxLength={120} placeholder="Ej.: 25 cm" defaultValue={valores.tamano ?? ""} />
          </div>
          <div className="campo">
            <label htmlFor="plazo">Tiempo de elaboración</label>
            <input id="plazo" name="plazo" maxLength={60} defaultValue={valores.plazo} />
          </div>
          <div className="campo">
            <label htmlFor="precio">Precio desde (opcional)</label>
            <input id="precio" name="precio" inputMode="numeric" placeholder="$" defaultValue={valores.precio ?? ""} />
          </div>
        </div>
        <p className="pista">
          El precio solo se ve en la web si activas “Mostrar precios” en Ajustes. Vacío: “Se cotiza según tu diseño”.
          {ref && (
            <>
              {" "}
              Como referencia, en {ref.anio} publicaste {pesos.format(ref.valor)} para “{ref.producto}”.
            </>
          )}
        </p>
      </section>

      <section className={estilos.tarjeta} aria-labelledby="ocasiones-producto">
        <h2 id="ocasiones-producto">Ocasiones</h2>
        <p className="pista">Sirven para los filtros del catálogo.</p>
        <div className={estilos.opciones}>
          {ocasiones.map((o) => (
            <label key={o.slug}>
              <input type="checkbox" name="ocasiones" value={o.slug} defaultChecked={valores.ocasiones.includes(o.slug)} /> {o.nombre}
            </label>
          ))}
        </div>
      </section>

      <section className={estilos.tarjeta} aria-labelledby="visibilidad-producto">
        <h2 id="visibilidad-producto">En la web</h2>
        <label className={estilos.interruptor}>
          <input type="checkbox" name="activo" value="si" defaultChecked={valores.activo} />
          <span>
            <strong>Visible en el catálogo</strong>
            <span className="pista">Apágalo para ocultarlo sin borrarlo (los pedidos que lo tienen no se pierden).</span>
          </span>
        </label>
        <label className={estilos.interruptor}>
          <input type="checkbox" name="destacado" value="si" defaultChecked={valores.destacado} />
          <span>
            <strong>Destacado en la portada</strong>
            <span className="pista">Aparece en “Lo que más piden”.</span>
          </span>
        </label>
      </section>
    </FormularioGestion>
  );
}
