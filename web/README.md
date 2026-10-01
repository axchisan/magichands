# Magic H4nds — web

Catálogo y encargos de Magic H4nds (crochet hecho a mano en Vélez, Santander). Next.js 16 (App Router).

- Producción (demo): https://magichands.axchisan.com — Vercel, proyecto `magichands`, se publica con cada `push` a `main`.
- Documentación del proyecto: `../docs/` (arquitectura en `05`, plan en `08`, cambio de dominio en `09`).

## Empezar

```bash
cd web
npm ci
npm run dev          # http://localhost:3000
```

Requiere Node 24. La configuración pública está en `.env` (WhatsApp, URL del sitio, modo demo); los
secretos irán en `.env.local` (ignorado por git) y en las variables de Vercel.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (genera las ~95 páginas estáticas) |
| `npm run lint` | ESLint |
| `npm run typecheck` | Tipos de rutas + TypeScript |
| `npm test` | Pruebas unitarias (Vitest): lógica de WhatsApp, pedidos, filtros e integridad del catálogo |
| `npm run test:e2e` | Build + pruebas de extremo a extremo (Playwright, escritorio y móvil) contra `next start` |
| `npm run check` | Todo lo anterior: lo que debe pasar antes de fusionar a `main` |
| `npm run db:generate` | Genera una migración de Drizzle a partir de `src/db/schema.ts` |
| `npm run db:migrate` | Aplica las migraciones (rama `dev`, o la de `DATABASE_URL` si se pasa) |
| `npm run db:semilla` | Carga o actualiza el catálogo en la base de datos (idempotente) |
| `npm run correos:vista` | Genera los correos del sistema como HTML en `test-results/correos/` para revisarlos |
| `npm run deploy:cloudflare` | Alternativa: compila con OpenNext y despliega en Cloudflare Workers |

Pruebas de extremo a extremo contra un sitio publicado:

```bash
E2E_URL=https://magichands.axchisan.com npx playwright test --grep-invert capturas
```

Las capturas de revisión visual quedan en `test-results/capturas/` y el informe en `playwright-report/`.

Revisión visual pantalla a pantalla (iPhone, Android y escritorio) y recorrido de una clienta en celular:

```bash
npx next start -p 3311 &
node tests/visual/auditoria.mjs http://localhost:3311 test-results/auditoria
node tests/visual/interaccion-movil.mjs http://localhost:3311 test-results/interaccion
```

## Estructura

```
src/
  app/                 Rutas: / catalogo catalogo/[categoria] p/[slug] encargo pedido como-comprar sobre-mi
  components/          Cabecera, Pie, CirculoManos (portada), TarjetaProducto, Galeria,
                       CatalogoFiltrable, FormularioEncargo, Seguimiento, PasosPedido…
  lib/
    catalogo.ts        Lectura tipada de src/data/catalogo.json
    config.ts          Datos del negocio: WhatsApp, plazo, agenda, mostrarPrecios
    whatsapp.ts        Código de pedido, mensaje del encargo, enlace wa.me
    pedidos.ts         Estados, pedidos de ejemplo y búsqueda del seguimiento
    filtros.ts         Búsqueda sin tildes y filtros del catálogo
    image-loader.ts    Cargador de next/image para las variantes WebP pregeneradas
  data/catalogo.json   Generado por ../scripts/exportar_web.py (no editar a mano)
public/img/            Fotos en WebP a 480/960/1440 px (generadas por el mismo script)
tests/unit/            Vitest
tests/e2e/             Playwright
```

## Catálogo e imágenes

El catálogo se mantiene fuera de la web y se exporta:

```bash
# desde la raíz del repositorio
python3 scripts/seleccion_catalogo.py   # especificación del catálogo -> recursos/catalogo/catalogo.json
python3 scripts/exportar_web.py         # -> web/src/data/catalogo.json y web/public/img/
```

`seleccion_catalogo.py` necesita las descargas originales de Instagram (`recursos/instagram/`), que no
están en el repositorio (pesan 270 MB y contienen datos de terceros). Con el panel (fase F7 del plan),
los productos y fotos nuevos se gestionarán desde la web y estos scripts quedarán solo para la carga inicial.

Imágenes: `next/image` usa un cargador propio (`src/lib/image-loader.ts`) que elige entre las variantes
pregeneradas; no hay optimización en tiempo de ejecución (sin coste en Vercel ni en Cloudflare).

## Base de datos, login y panel

- **Neon** `magichands`: rama `main` = producción; rama `dev` = `web/.env.local`, vistas previas y pruebas.
  Producción a mano: `DATABASE_URL=<cadena de main> npx drizzle-kit migrate` (y `npm run db:semilla`).
- **Better Auth** (`src/lib/auth.ts`): Google y código por correo. Secretos en `web/.env.local` (local) y
  en Vercel: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`,
  `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAILS`.
- **Acceso al panel**: una sola regla en `src/lib/acceso.ts`. Con `NEXT_PUBLIC_PANEL_ABIERTO=1`
  (presentación) cualquiera ve el panel en vista previa, con celulares ocultos; con `0`, solo los
  correos de `ADMIN_EMAILS`.
- Las pruebas e2e escriben en la rama `dev` y no envían correos (`CORREO_SIMULADO=1`).
- **Catálogo**: la web lee productos, categorías y ajustes de la base (`src/lib/catalogo-db.ts`,
  `src/lib/ajustes.ts`) con caché; el panel invalida con `src/lib/revalidar.ts`. `src/data/catalogo.json`
  queda solo como carga inicial (`npm run db:semilla`, que no pisa lo editado; `--forzar` sí).
- **Fotos subidas**: Vercel Blob `magichands-fotos` (`BLOB_READ_WRITE_TOKEN`). `/api/fotos` autoriza
  subidas solo a administradores; ver `src/lib/fotos.ts` y `src/components/FotosProducto.tsx`.
- **Correos** (`src/lib/correos/`, plantilla común con la marca en `plantilla.ts`): código de acceso;
  encargo nuevo (a `ADMIN_EMAILS`); encargo recibido y cambios de estado (al cliente, solo si hizo el
  encargo con su cuenta: sin cuenta no tenemos su correo). Logos en `public/img/correo/` (PNG).

## Configuración del negocio

`src/lib/config.ts`:

- `whatsapp`: de `NEXT_PUBLIC_WHATSAPP` (hoy `573115685168`, su número).
- `agenda.abierta` / `agenda.mensaje`: aviso en toda la web cuando cierra la agenda.
- `mostrarPrecios`: `false` hasta que ella confirme precios (los guardados son de 2021–2025).
- `NEXT_PUBLIC_DEMO=1`: `noindex` y aviso de demo en el pie.

En la fase F7 estos ajustes pasan a la tabla `ajustes` y se editan desde `/admin/ajustes`.

## Despliegue

- **Vercel**: automático. Directorio raíz `web`, Node 24, framework Next.js. Variables por entorno
  con `vercel env` (desde la raíz del repo, que es donde está enlazado el proyecto).
- **Cloudflare (alternativa)**: `npm run deploy:cloudflare` (worker `magich4nds-demo`). Ver
  `../docs/06-infraestructura-y-costes.md` para cuándo conviene.

## Calidad comprobada (1 de octubre de 2026)

- Lint y tipos sin errores; 47 pruebas unitarias; 47 de extremo a extremo en local (encargo guardado y
  seguido, campo trampa, login, panel en vista previa).
- Lighthouse móvil: rendimiento 88–98, accesibilidad 98–100, buenas prácticas 100
  (SEO 66 por el `noindex` intencionado de la demo).
