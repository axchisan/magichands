# Cambio de dominio (de `magichands.axchisan.com` al de ella)

La web se construye para que el dominio sea una configuración, no código. Hoy:
`magichands.axchisan.com`. Si ella compra su dominio (por ejemplo `magich4nds.com`), esta es la lista.

## Qué depende del dominio

| Pieza | Dónde se configura | Hoy |
|---|---|---|
| URL pública (enlaces absolutos, Open Graph, sitemap) | `NEXT_PUBLIC_SITE_URL` | `https://magichands.axchisan.com` |
| Login: URL base | `BETTER_AUTH_URL` | igual |
| Login: orígenes permitidos | `BETTER_AUTH_TRUSTED_ORIGINS` (separados por coma) | subdominio, `*.vercel.app` del proyecto, `http://localhost:3000` |
| Login con Google | Google Cloud → cliente OAuth → URIs de redirección y orígenes autorizados | subdominio + localhost |
| Cookies de sesión | Solo del host (sin `Domain`), no hay que cambiar nada | — |
| Correo remitente | `EMAIL_FROM` + dominio verificado en Resend | `magichands@axchisan.com` |
| Indexación | `NEXT_PUBLIC_DEMO` | `1` (noindex) |
| DNS | Registro del dominio | CNAME `magichands` → `cname.vercel-dns.com` en Hostinger |

## Pasos

1. **Dominio**: ella lo compra a su nombre (recomendado Cloudflare Registrar, a precio de costo).
2. **Hosting**: añadir el dominio al proyecto (Vercel o Cloudflare, según la decisión de producción en `06`).
3. **Google OAuth**: añadir `https://<su-dominio>/api/auth/callback/google` y el origen
   `https://<su-dominio>`. Mantener el subdominio viejo unas semanas para que no se rompa nada.
4. **Resend**: verificar su dominio (registros SPF/DKIM) y cambiar `EMAIL_FROM`.
5. **Variables**: actualizar `NEXT_PUBLIC_SITE_URL`, `BETTER_AUTH_URL` y añadir el dominio nuevo a
   `BETTER_AUTH_TRUSTED_ORIGINS`. Las `NEXT_PUBLIC_*` se fijan al compilar: hay que volver a desplegar.
6. **Redirección**: `magichands.axchisan.com` → dominio nuevo (301), para no perder enlaces compartidos.
7. **Demo → producción**: `NEXT_PUBLIC_DEMO=0`, enviar el sitemap a Google Search Console.
8. **Comprobar**: login con Google y con código en el dominio nuevo, un encargo de prueba, el panel.
   Las pruebas de extremo a extremo se pueden lanzar contra él con `E2E_URL=https://<su-dominio>`.

Las sesiones abiertas en el dominio viejo no pasan al nuevo (son cookies de otro host): basta con volver
a entrar.
