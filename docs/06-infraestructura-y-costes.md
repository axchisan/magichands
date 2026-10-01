# Infraestructura y costes

## Servicios

| Servicio | Plan | Coste | Límite relevante |
|---|---|---|---|
| Cloudflare Workers (hosting) | Paid | **5 USD/mes** | 10 M peticiones/mes incluidas; el gratuito (100.000/día, 3 MB, 10 ms CPU) puede quedarse corto para Next.js ([docs](https://developers.cloudflare.com/workers/platform/pricing/)) |
| Cloudflare R2 (fotos) | Gratis | 0 | 10 GB; el catálogo actual pesa ≈ 50 MB |
| Cloudflare Access (login del panel) | Zero Trust Free | 0 | 50 usuarios |
| Cloudflare Turnstile (antispam) | Gratis | 0 | — |
| Neon Postgres | Free | 0 | Suficiente para miles de pedidos; se suspende sin uso (arranque en frío de ~1 s en el panel) |
| Resend (correo de avisos) | Free | 0 | 3.000 correos/mes |
| Dominio `magich4nds.com` | Cloudflare Registrar | **≈ 10–11 USD/año** | Libre a 30 sep 2026 (también `.co` y `.com.co`) |
| WhatsApp | App Business de ella | 0 | — |

**Coste real de operación: ≈ 6 USD/mes** (5 USD de Workers + dominio prorrateado). Sin Workers de
pago, ≈ 1 USD/mes, si la app cabe en el plan gratuito.

Alternativa descartada: Vercel. Hobby no permite uso comercial ([fuente](https://justinmckelvey.com/blog/is-vercel-free))
y Pro cuesta 20 USD/mes.

## Cuentas: demo y producción

| Etapa | Dónde |
|---|---|
| **Demo** (pitch) | Tus cuentas: Cloudflare (`axchisan923@gmail.com`), Neon (`leftyrancuentabot@gmail.com`) en un proyecto **nuevo** `magich4nds-demo`. No tocar `axchisan` ni `axchisan-media` |
| **Producción** (si acepta) | Dominio y cuenta de Cloudflare **a su nombre**; tú como miembro con permisos. Neon y Resend: proyecto propio, transferible |

Así ella es dueña de lo suyo desde el primer día, y quitarte acceso es solo quitar un miembro.

## Entornos

- `main` → producción (`magich4nds.com`).
- Ramas de vista previa → `*.workers.dev` con `noindex`.
- Neon: rama `main` (producción) y rama `dev` (pruebas con copia de datos).

## Operación

- Copias: Neon permite restaurar a un punto reciente (en el plan gratuito la ventana es corta), así
  que además se hace un export semanal de productos y pedidos a JSON en R2.
- Monitorización: analítica de Cloudflare (gratis, sin cookies) para visitas y productos más vistos.
- Lo que ella hace sola: productos, fotos, pedidos, agenda, textos. Lo que pasa por ti: diseño,
  nuevas funciones, dominio.
