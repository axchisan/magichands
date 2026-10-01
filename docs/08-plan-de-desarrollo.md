# Plan de desarrollo

Actualizado el 1 de octubre de 2026 (base de datos, login y panel de pedidos publicados). Cada fase se publica sola en `magichands.axchisan.com` al hacer
`push` a `main` (Vercel). Nada pasa a `main` sin `npm run check` en verde (lint, tipos, pruebas unitarias
y de extremo a extremo).

## Hecho

| Fase | Resultado |
|---|---|
| 1–3 | Investigación, catálogo curado (73 productos, 21 fotos limpiadas con IA), kit de marca, arquitectura |
| 4. Web pública | Portada, catálogo con filtros y búsqueda, fichas, encargo por WhatsApp, seguimiento con pedidos de ejemplo, cómo comprar, quién teje, 404. 21 pruebas unitarias + 32 de extremo a extremo. Lighthouse móvil: rendimiento 88–98, accesibilidad 98–100 |
| 4b. Publicación | Repositorio privado `axchisan/magichands`; Vercel con despliegue automático; sin contraseña; WhatsApp real (`573115685168`); `noindex` mientras sea demo |
| 4c. Google OAuth (1 oct 2026) | Proyecto de Google Cloud `magic-h4nds` (sin organización, transferible). App "Magic H4nds" **publicada en producción** (público externo, solo permisos básicos: sin verificación). Cliente web "Web Magic H4nds" con orígenes `https://magichands.axchisan.com` y `http://localhost:3000` y retorno `/api/auth/callback/google` en ambos. Verificado: la URL registrada abre el selector de cuentas y una no registrada da `redirect_uri_mismatch`. Credenciales en Vercel (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `ADMIN_EMAILS`) y en `web/.env.local` |
| 4e. Pulido móvil (1 oct 2026) | Auditoría pantalla a pantalla en iPhone 13, Android 360 px y escritorio (`web/tests/visual/`). Cambios: menú lateral en celular, rejillas a 2 columnas (el catálogo bajó de 40.900 a 12.800 px), ficha con carrusel deslizable y barra fija "Encargar / WhatsApp", pasos y pie compactos, formulario con teclas "Siguiente", sin globos nativos de error y zonas táctiles ≥ 44 px, y `/sobre-mi` rehecha (fotos de ella sin texto encima, retrato con traje típico, proceso de la blusa Orquídea). Causa del desorden de `/sobre-mi`: faltaba `img { height: auto }` |
| 4d. Legal | `/privacidad` y `/terminos` (Ley 1581 de 2012); en demo, el responsable declarado es el desarrollador |

| F5. Base de datos (1 oct 2026) | Neon `magichands` (ramas `main` = producción y `dev` = local, vistas previas y pruebas). Drizzle con migraciones en `web/drizzle/`, aplicadas en las dos ramas. Semilla `npm run db:semilla` cargada en ambas: 11 categorías, 73 productos, 263 fotos. El catálogo público sigue leyendo el JSON estático hasta que el panel edite productos (F7.3) |
| F6. Login (1 oct 2026) | Better Auth: Google y código de 6 números por correo (Resend, `magichands@axchisan.com`), límites de intentos guardados en la base de datos, `/entrar` (Google primero; el correo, detrás de "No uso Gmail"), `/mi-cuenta`, avatar en la cabecera. Administradores: `ADMIN_EMAILS` |
| F7.1 Pedidos (1 oct 2026) | Los encargos se guardan (cliente + pedido + historial) y avisan por correo a los administradores; campo trampa contra robots y máximo 5 encargos por celular en una hora. Panel `/admin/pedidos`: pestañas por estado, 20 por página, ficha con WhatsApp al cliente, estado, total, anticipo, fecha estimada, notas internas e historial |
| F7 Panel completo (1 oct 2026) | Productos, fotos (Vercel Blob), clientes y ajustes; catálogo público desde la base de datos con caché. Ver F7 abajo |
| Panel para la presentación | `NEXT_PUBLIC_PANEL_ABIERTO=1` (en `web/.env`): botón "Panel" en la cabecera y panel sin login en modo vista previa (celulares de clientes ocultos). Regla única en `web/src/lib/acceso.ts`. **Al traspaso: poner `0`** y queda solo para `ADMIN_EMAILS` |

## Pendiente, en orden

### F7. Panel de administración (`/admin`) — hecho (1 oct 2026)

Diseñado para el celular de ella. Secciones:

1. **Pedidos**: lista por estado, ficha, estado (con correo al cliente con cuenta), cotización, anticipo,
   fecha estimada, notas internas, historial, WhatsApp al cliente.
2. **Productos**: lista con búsqueda (sin tildes), filtro por categoría y ocultos; crear (el slug sale del
   nombre y no cambia), editar, ocultar, destacar, precio confirmado (con el precio viejo publicado como
   referencia), ocasiones.
3. **Fotos**: subir varias desde el celular (el navegador genera 480/960/1440 en WebP, o JPEG en Safari) a
   Vercel Blob; ordenar, elegir portada, borrar (borra también los archivos).
4. **Clientes**: lista con búsqueda por nombre, ciudad o celular; ficha con sus pedidos, notas y WhatsApp.
5. **Ajustes**: agenda abierta/cerrada con su aviso; mostrar precios (solo los confirmados).

La web pública lee el catálogo y los ajustes de la base de datos con caché (`unstable_cache`, etiquetas
`catalogo` y `ajustes`); al guardar en el panel se invalida y las páginas estáticas se regeneran en la
siguiente visita. Los productos nuevos se generan en su primera visita.

En la **vista previa** (panel abierto) los cambios del catálogo, fotos, ajustes y notas de clientes no se
guardan: se ven los formularios con un aviso. Los pedidos sí se pueden mover para probar el flujo.

`npm run db:semilla` ya no pisa lo que ella edite: solo agrega lo que falta (`--forzar` reescribe).

Pendiente menor: datos de pago privados en Ajustes y textos de "Cómo comprar" editables (si ella los pide).

### F8. Avisos y detalles

- Hecho: correo a los administradores cuando entra un encargo y límite por celular. Falta: aviso opcional
  al cliente cuando cambia el estado; Turnstile si aparece spam.
- Vercel Analytics.
- Lote 2 de fotos con IA (fotos de galería con texto incrustado), con la receta de Gemini ya documentada.

### F9. Presentación a ella (pitch)

- Revisar la demo en su celular y en el tuyo.
- Mensaje de contacto (borrador en `07-plan-demo.md`) con el enlace `magichands.axchisan.com`.
- Si pregunta por precio: ver `04-modelo-de-negocio.md` (base $300.000, extras aparte).

### F10. Si acepta: traspaso

- Ajustes que pida (una ronda incluida).
- Confirmar precios con ella y activar `mostrarPrecios`.
- Dominio propio (si lo quiere) y paso a producción según `06` (recomendado Cloudflare Workers).
- Cambio de dominio con la lista de `09-dominio-portable.md`.
- `NEXT_PUBLIC_PANEL_ABIERTO=0` y su correo en `ADMIN_EMAILS` (Vercel): el panel queda solo para ella.
- `NEXT_PUBLIC_DEMO=0` (se indexa y desaparece el aviso de demo); SEO local y ficha de Google.
- Cuentas a su nombre y capacitación corta (15 minutos por videollamada).

### Extras (fuera del paquete base, se cotizan)

Carrito de compras, pasarela de pagos (Wompi con Nequi/PSE/tarjeta para el anticipo), cupones,
historial ampliado de cliente, blog o novedades.

## Convenciones de trabajo

- Ramas cortas por funcionalidad (`f6-login`, `f7-pedidos`…) con vista previa automática en Vercel;
  se fusionan a `main` cuando `npm run check` está en verde.
- Variables secretas solo en Vercel (`vercel env`); localmente en `web/.env.local` (ignorado por git).
- Cada fase actualiza este documento y `web/README.md`.
