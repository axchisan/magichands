# Plan de desarrollo

Actualizado el 1 de octubre de 2026. Cada fase se publica sola en `magichands.axchisan.com` al hacer
`push` a `main` (Vercel). Nada pasa a `main` sin `npm run check` en verde (lint, tipos, pruebas unitarias
y de extremo a extremo).

## Hecho

| Fase | Resultado |
|---|---|
| 1–3 | Investigación, catálogo curado (73 productos, 21 fotos limpiadas con IA), kit de marca, arquitectura |
| 4. Web pública | Portada, catálogo con filtros y búsqueda, fichas, encargo por WhatsApp, seguimiento con pedidos de ejemplo, cómo comprar, quién teje, 404. 21 pruebas unitarias + 32 de extremo a extremo. Lighthouse móvil: rendimiento 88–98, accesibilidad 98–100 |
| 4b. Publicación | Repositorio privado `axchisan/magichands`; Vercel con despliegue automático; sin contraseña; WhatsApp real (`573115685168`); `noindex` mientras sea demo |

## Pendiente, en orden

### F5. Base de datos y datos semilla

- Proyecto Neon nuevo `magichands` (ramas `main` y `dev`); `DATABASE_URL` en Vercel por entorno.
- Drizzle ORM: esquema de `05-arquitectura.md`, migraciones versionadas en `web/drizzle/`.
- Script de semilla que carga `web/src/data/catalogo.json` (categorías, productos, fotos) y los ajustes.
- El catálogo público sigue siendo estático: se regenera al publicar cambios desde el panel
  (`revalidateTag`), así no se pierde velocidad.

Terminado cuando: la web pública se ve igual leyendo de la base de datos y las pruebas siguen en verde.

### F6. Login (Better Auth + Google + código por correo)

- Better Auth con adaptador Drizzle; ruta `/api/auth/[...all]`.
- Google: crear cliente OAuth en Google Cloud con estas URLs de redirección:
  - `https://magichands.axchisan.com/api/auth/callback/google`
  - `http://localhost:3000/api/auth/callback/google`
  - (más adelante) la de su dominio.
- Código de un solo uso por correo (plugin `emailOTP`) enviado con Resend desde `magichands@axchisan.com`.
- Rol `admin` para los correos de `ADMIN_EMAILS`; el resto, `cliente`.
- Páginas: `/entrar` y `/mi-cuenta` (sus pedidos). En la cabecera, "Entrar" / su nombre.
- Encargo con sesión: se guarda en la base de datos además de abrir WhatsApp; sin sesión, todo funciona
  como hoy.

Lo que necesito de ti: crear el cliente OAuth en Google Cloud (o darme acceso para hacerlo con Chrome)
y confirmar qué correos son admin.

Terminado cuando: se puede entrar con Google y con código, `/admin` responde 403 a un cliente, y hay
pruebas de extremo a extremo del acceso (con una cuenta de prueba local, nunca la real).

### F7. Panel de administración (`/admin`)

Diseñado para el celular de ella, en este orden (lo que más le ahorra trabajo primero):

1. **Pedidos**: lista por estado, ficha del pedido, cambiar estado (queda en el historial), registrar
   cotización, anticipo, saldo y fecha estimada, botón para abrir el chat de WhatsApp del cliente.
2. **Ajustes**: agenda abierta/cerrada y su mensaje, mostrar u ocultar precios, textos de "Cómo comprar",
   datos de pago privados.
3. **Productos**: crear, editar, ocultar, ordenar, marcar destacado, precio confirmado.
4. **Fotos**: subir desde el celular a R2 (bucket nuevo `magichands-media`); el navegador genera las
   variantes 480/960/1440 en WebP antes de subir.
5. **Clientes**: historial de pedidos por cliente.

Terminado cuando: ella puede gestionar un pedido de punta a punta y publicar un producto nuevo con foto
sin ayuda, y hay pruebas de extremo a extremo de esos dos recorridos.

### F8. Avisos y detalles

- Correo a ella (Resend) cuando entra un encargo; opcional al cliente cuando cambia el estado.
- Límite de envíos del formulario por IP; Turnstile si aparece spam.
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
