# Infraestructura y costes

## Dónde vive hoy (demo)

| Pieza | Servicio | Detalle |
|---|---|---|
| Código | GitHub `axchisan/magichands` (**privado**) | Repositorio único: docs, scripts, recursos curados y `web/` |
| Web | Vercel, proyecto `magichands` (equipo `axchisan923-2669s-projects`, plan Hobby) | Directorio raíz `web`, Node 24, Next.js |
| Despliegue | Automático: cada `push` a `main` → producción; cada rama o PR → vista previa | Sin pasos manuales |
| Dominio | `magichands.axchisan.com` (CNAME en Hostinger → `cname.vercel-dns.com`) | También responde en `magichands-iota.vercel.app` |
| Google OAuth | Google Cloud, proyecto `magic-h4nds` (sin organización), app publicada | Cliente "Web Magic H4nds" |
| Base de datos, login, fotos subidas, correos | En uso (1 oct 2026) | Neon `magichands`, Better Auth, Vercel Blob `magichands-fotos`, Resend |

Las URLs de vista previa de ramas (`magichands-git-…vercel.app`) quedan protegidas por la protección de
despliegues de Vercel (solo tu cuenta); la de producción y el subdominio son públicas.

Recursos en uso que **no** se tocan: `axchisan.com` y su proyecto `axchisan-com`, bucket R2
`axchisan-media`, proyecto Neon `axchisan`, registros DNS `api` y `gastos`.

## Servicios y costes

| Servicio | Plan | Coste | Límite relevante |
|---|---|---|---|
| Vercel | Hobby | 0 | **Solo uso no comercial** ([fuente](https://justinmckelvey.com/blog/is-vercel-free)); 100 GB de transferencia/mes |
| Neon Postgres | Free | 0 | Suficiente para miles de pedidos; se suspende sin uso (arranque en frío ~1 s) |
| Better Auth | Librería (dentro de la app) | 0 | — |
| Google OAuth | Google Cloud (pantalla de consentimiento) | 0 | Requiere publicar la app OAuth para usuarios externos |
| Vercel Blob (`magichands-fotos`) | Hobby | 0 | 1 GB; en producción se puede pasar a Cloudflare R2 (10 GB gratis) |
| Resend | Free | 0 | 3.000 correos/mes, 100/día |
| Dominio de ella (opcional) | Cloudflare Registrar | ≈ 10–11 USD/año | `magich4nds.com`, `.co` y `.com.co` libres al 30 sep 2026 |

**Coste de operación de la demo: 0.**

## Producción si ella compra (decisión pendiente)

Con un cobro único de $300.000 (ver `04-modelo-de-negocio.md`), la operación tiene que costar casi cero.

| Opción | Coste | A favor | En contra |
|---|---|---|---|
| **A. Cloudflare Workers** (OpenNext, ya probado: build de 1,1 MB comprimido) | 0 en plan gratuito; 5 USD/mes si hiciera falta el de pago | Permite uso comercial; dominio de ella en Cloudflare en el mismo sitio | Cambiar de plataforma de despliegue (scripts ya listos: `npm run deploy:cloudflare`); el plan gratuito limita CPU a 10 ms por petición, a vigilar con login y base de datos |
| **B. Vercel Pro** | 20 USD/mes | Mismo flujo que la demo | No encaja con un pago único; alguien tiene que pagarlo cada mes |
| **C. Vercel Hobby en una cuenta de ella** | 0 | Fácil | Sigue siendo uso comercial: incumple los términos |

Recomendación: **A**. El código se mantiene portable (`web/wrangler.jsonc`, `web/open-next.config.ts`)
para no depender de Vercel.

## Cuentas: demo y producción

| Etapa | Dónde |
|---|---|
| **Demo** | Tus cuentas: GitHub, Vercel, Neon (`leftyrancuentabot@gmail.com`, proyecto **nuevo** `magichands`), Vercel Blob (almacén **nuevo** `magichands-fotos`), Resend (dominio `axchisan.com`) y Google Cloud (proyecto OAuth nuevo) |
| **Producción** | Dominio y Cloudflare a nombre de ella, con tu usuario como miembro. Neon y las fotos (Blob o R2) en proyectos transferibles. Resend con su dominio. El cliente OAuth de Google se puede quedar en tu proyecto añadiendo su dominio, o pasar a uno suyo |

## Entornos

| Entorno | Rama | URL | Base de datos |
|---|---|---|---|
| Producción (demo) | `main` | `magichands.axchisan.com` | Neon rama `main` |
| Vistas previas | cualquier otra rama | `magichands-git-<rama>-….vercel.app` | Neon rama `dev` |
| Local | — | `localhost:3000` | Neon rama `dev` |

## Operación

- Copias: export semanal de productos y pedidos a JSON (tarea programada), además de la restauración
  a un punto reciente de Neon.
- Monitorización: Vercel Analytics (gratis en Hobby) para visitas y páginas más vistas.
- Lo que ella hace sola: productos, fotos, pedidos, agenda, textos. Lo que pasa por ti: diseño,
  funciones nuevas, dominio.
