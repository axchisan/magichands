# Plan de la demo (fase 4) y del contacto (fase 5)

## Qué debe lograr la demo

Que en 2 minutos, desde su celular, ella vea **su** negocio mejor presentado y entienda que le ahorra
trabajo. Debe sentirse hecha para ella, no una plantilla.

## Alcance

Publicada en **https://magichands.axchisan.com** (Vercel; se actualiza con cada `push` a `main`).

| Parte | Estado | Cómo |
|---|---|---|
| Portada, catálogo, fichas, cómo comprar, quién teje | Hecho | Datos reales de `web/src/data/catalogo.json` |
| Encargo personalizado → WhatsApp | Hecho, con **su número real** (+57 311 568 5168) | Ojo: cualquier encargo de prueba le llega a ella; para probar sin molestarla, revisa el mensaje sin enviarlo |
| Seguimiento de pedido | Hecho, con 2 pedidos de ejemplo + los hechos en el navegador | Datos inventados y marcados como ejemplo |
| Login (Google y código por correo) y panel `/admin` | Pendiente: fases F6 y F7 de `08-plan-de-desarrollo.md` | Es lo que más trabajo le ahorra a ella |
| Pagos, carrito | Fuera del paquete base | Extras cotizados aparte |
| Precios | Ocultos (`mostrarPrecios: false`) hasta que ella los confirme | Regla: los precios los fija ella |

## Visibilidad y privacidad

- **Pública, sin contraseña** (decisión del 1 de octubre de 2026): cualquiera con el enlace la ve.
- `noindex` (meta, `robots.txt`): no aparece en Google mientras sea demo (`NEXT_PUBLIC_DEMO=1`).
- Aviso en el pie: versión de muestra, fotos y textos suyos tomados de su Instagram.
- Ninguna foto de clientes ni de personas que no sean ella o sus modelos; sus datos bancarios no aparecen.

## Orden de construcción

1. ~~Next.js 16 con los tokens de marca~~ (hecho)
2. ~~Portada y catálogo desde `catalogo.json`~~ (hecho)
3. ~~Ficha y encargo por WhatsApp~~ (hecho)
4. ~~Cómo comprar, quién teje, seguimiento~~ (hecho)
5. ~~Revisión en móvil y Lighthouse~~ (hecho: rendimiento 88–98, accesibilidad 98–100)
6. ~~Publicación~~ (hecho: Vercel + subdominio)
7. Base de datos, login y panel: `08-plan-de-desarrollo.md` (F5–F7)

## Contacto (fase 5)

Por mensaje directo de Instagram, que es el canal que ella usa. Corto, concreto y sin presión.
Borrador (tú lo ajustas a tu voz):

> Hola Yuliana, me encanta tu trabajo, sobre todo los funkos personalizados con la base grabada 💗
> Soy desarrollador web y me puse a revisar tu perfil: vi que el enlace de tu bio (linkr.bio) no
> abre y que tu catálogo está repartido entre historias y publicaciones, así que se me ocurrió
> armarte una versión de cómo podría verse una web para Magic H4nds, con tu catálogo ordenado y los
> pedidos llegando organizados a tu WhatsApp. Míralo aquí: magichands.axchisan.com
> Sin ningún compromiso ni pago por adelantado: si te gusta, la ajustamos a tu gusto y acordamos un
> precio; si no, no pasa nada.

Notas:

- Mencionar el **enlace roto** es útil: es un problema real y verificable que ella puede comprobar
  en un segundo (evidencia en `investigacion/evidencias/`).
- No mencionar precios de ella ni compararla con la competencia.
- Abrir el enlace desde el celular justo antes de enviarlo, para comprobar que carga.
- Precio interno de referencia: $300.000 (ver `04-modelo-de-negocio.md`); no se menciona en el primer mensaje.
