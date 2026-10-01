# Plan de la demo (fase 4) y del contacto (fase 5)

## Qué debe lograr la demo

Que en 2 minutos, desde su celular, ella vea **su** negocio mejor presentado y entienda que le ahorra
trabajo. Debe sentirse hecha para ella, no una plantilla.

## Alcance

| Parte | En la demo | Cómo |
|---|---|---|
| Portada, catálogo, fichas, cómo comprar, sobre mí | **Completo** | Datos reales de `catalogo.json`, fotos de `seleccion/` y `mejoradas-ia/` |
| Encargo personalizado → WhatsApp | **Funciona**, pero el WhatsApp de destino es **el tuyo** | No se publica su número sin permiso |
| Seguimiento de pedido | Con 2–3 pedidos de ejemplo | Datos inventados y marcados como ejemplo |
| Panel `/admin` | **Navegable** con datos de ejemplo | Muestra pedidos, productos y el interruptor de agenda |
| Pagos, dominio propio, correo | No | Se activan si acepta |
| Precios | Solo los 5 que ella publicó, marcados "precio de referencia" | Regla: los precios los fija ella |

## Protección

- Dirección `*.workers.dev` (o `demo.axchisan.com`) con `noindex` y `robots.txt` cerrado.
- Acceso con contraseña sencilla (o Cloudflare Access con su correo) para que solo la vea ella.
- Ninguna foto de clientes ni de personas que no sean ella o sus modelos.
- Sus datos bancarios no aparecen.

## Orden de construcción

1. Proyecto Next.js 16 + OpenNext en Cloudflare, con los tokens de marca.
2. Portada y catálogo a partir de `catalogo.json` (sin base de datos aún: lectura del JSON).
3. Ficha de producto y formulario de encargo con salida a WhatsApp.
4. Cómo comprar, sobre mí, seguimiento con datos de ejemplo.
5. Panel con Neon (rama demo) y subida de fotos a R2.
6. Revisión en móvil (Lighthouse ≥ 90 en rendimiento y accesibilidad) y despliegue protegido.

Los pasos 1–4 ya bastan para el pitch; el 5 suma mucho porque es lo que le ahorra trabajo a ella.

## Contacto (fase 5)

Por mensaje directo de Instagram, que es el canal que ella usa. Corto, concreto y sin presión.
Borrador (tú lo ajustas a tu voz):

> Hola Yuliana, me encanta tu trabajo, sobre todo los funkos personalizados con la base grabada 💗
> Soy desarrollador web y me puse a revisar tu perfil: vi que el enlace de tu bio (linkr.bio) no
> abre y que tu catálogo está repartido entre historias y publicaciones, así que se me ocurrió
> armarte una versión de cómo podría verse una web para Magic H4nds, con tu catálogo ordenado y los
> pedidos llegando organizados a WhatsApp.
> Ya la tengo hecha y te la puedo mostrar sin ningún compromiso ni pago por adelantado. Si te gusta,
> la ajustamos a tu gusto y acordamos un precio; si no, no pasa nada. ¿Te comparto el enlace?

Notas:

- Mencionar el **enlace roto** es útil: es un problema real y verificable que ella puede comprobar
  en un segundo (evidencia en `investigacion/evidencias/`).
- No mencionar precios de ella ni compararla con la competencia.
- Enviar el enlace solo cuando responda, y desde el celular abrirlo antes para comprobar que carga.
