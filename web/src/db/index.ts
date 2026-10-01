import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Conexión por HTTP a Neon: sin conexiones abiertas, ideal para funciones serverless.
// DATABASE_URL: rama main en producción, rama dev en vistas previas y en local.
const url = process.env.DATABASE_URL;
if (!url) throw new Error("Falta DATABASE_URL (ver web/README.md, sección Base de datos).");

export const db = drizzle(neon(url), { schema, casing: "snake_case" });
export { schema };
