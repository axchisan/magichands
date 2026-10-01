import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Migraciones versionadas en ./drizzle. Por defecto apuntan a la rama dev (web/.env.local);
// para producción: DATABASE_URL=<rama main> npm run db:migrate
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: { url: process.env.DATABASE_URL! },
  strict: true,
});
