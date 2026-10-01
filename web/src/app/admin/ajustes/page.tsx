import { sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { accesoActual } from "@/lib/admin";
import { ajustes } from "@/lib/ajustes";
import { guardarAjustes } from "@/app/acciones/ajustes";
import { FormularioGestion } from "@/components/FormularioGestion";
import estilos from "../admin.module.css";

export const metadata = { title: "Ajustes" };

export default async function Ajustes() {
  const [a, { acceso }, [{ conPrecio }]] = await Promise.all([
    ajustes(),
    accesoActual(),
    db
      .select({ conPrecio: sql<number>`count(*) filter (where ${schema.producto.precioConfirmado} is not null and ${schema.producto.activo})::int` })
      .from(schema.producto),
  ]);
  return (
    <div className={estilos.contenido}>
      <h1>Ajustes</h1>
      <FormularioGestion
        accion={guardarAjustes}
        version={JSON.stringify(a)}
        soloLectura={acceso !== "completo"}
        className={`${estilos.form} ${estilos.ajustes}`}
      >
        <fieldset className={estilos.tarjeta}>
          <legend className={estilos.leyenda}>Agenda</legend>
          <label className={estilos.interruptor}>
            <input type="checkbox" name="agendaAbierta" value="si" defaultChecked={a.agenda.abierta} />
            <span>
              <strong>Estoy recibiendo encargos</strong>
              <span className="pista">Si lo apagas, toda la web muestra el aviso de abajo. Los encargos se pueden seguir enviando.</span>
            </span>
          </label>
          <div className="campo">
            <label htmlFor="mensajeAgenda">Aviso con la agenda cerrada</label>
            <textarea id="mensajeAgenda" name="mensajeAgenda" rows={2} maxLength={200} defaultValue={a.agenda.mensaje} />
          </div>
        </fieldset>

        <fieldset className={estilos.tarjeta}>
          <legend className={estilos.leyenda}>Precios</legend>
          <label className={estilos.interruptor}>
            <input type="checkbox" name="mostrarPrecios" value="si" defaultChecked={a.mostrarPrecios} />
            <span>
              <strong>Mostrar precios en la web</strong>
              <span className="pista">
                Solo se muestran los precios que confirmes en cada producto (“Desde $…”). Hoy tienes{" "}
                {conPrecio === 1 ? "1 producto" : `${conPrecio} productos`} con precio confirmado; los demás siguen diciendo
                “Se cotiza según tu diseño”.
              </span>
            </span>
          </label>
        </fieldset>
      </FormularioGestion>
    </div>
  );
}
