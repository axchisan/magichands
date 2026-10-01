import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { headers } from "next/headers";
import { db, schema } from "@/db";
import { enviarCorreo } from "./correo";
import { correoCodigo } from "./correos/codigo";

// Login de la propia web (docs/05-arquitectura.md): Google o código de 6 dígitos por correo.
// El dominio sale de variables (docs/09-dominio-portable.md); nada de URLs fijas.

const origenes = [
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_SITE_URL,
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "").split(","),
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.NODE_ENV !== "production" ? "http://localhost:3000" : undefined,
]
  .map((o) => o?.trim())
  .filter((o): o is string => Boolean(o));

export const auth = betterAuth({
  appName: "Magic H4nds",
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [...new Set(origenes)],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      rateLimit: schema.rateLimit,
    },
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "select_account",
    },
  },
  account: {
    // Si alguien entra primero con código y luego con Google (mismo correo), es la misma cuenta.
    accountLinking: { enabled: true, trustedProviders: ["google", "email-otp"] },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 días
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 30,
    customRules: {
      "/email-otp/send-verification-otp": { window: 60, max: 3 },
      "/sign-in/email-otp": { window: 60, max: 6 },
      // Leer la sesión pasa en cada página: no cuenta para el límite (ni escribe en la base de datos).
      "/get-session": false,
    },
  },
  advanced: {
    // Cookies solo del host (sin Domain): funcionan igual en el subdominio, en *.vercel.app y en su dominio.
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 10 * 60,
      allowedAttempts: 5,
      storeOTP: "hashed",
      async sendVerificationOTP({ email, otp }) {
        const { asunto, html, texto } = correoCodigo(otp);
        await enviarCorreo({ para: email, asunto, html, texto });
      },
    }),
    nextCookies(), // debe ir de último
  ],
});

export type Sesion = typeof auth.$Infer.Session;

/** Correos con acceso al panel (ADMIN_EMAILS, separados por coma). */
export function esAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const lista = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return lista.includes(email.toLowerCase());
}

/** Sesión actual en un componente de servidor o acción (null si no hay). */
export async function sesionActual(): Promise<Sesion | null> {
  return auth.api.getSession({ headers: await headers() });
}
