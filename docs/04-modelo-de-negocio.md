# Modelo de negocio

Dos niveles distintos que no hay que mezclar:

1. **Cómo vende Magic H4nds** (lo que la web tiene que soportar). Lo decide ella; la web se adapta.
2. **Cómo le cobras tú a ella** (la propuesta comercial). Lo decides tú.

## 1. Cómo vende Magic H4nds (y qué hace la web con eso)

Datos de `investigacion/`: casi todo es **bajo pedido y personalizable**, se cotiza por chat, se paga
con anticipo por transferencia y se envía a todo el país.

| Hoy (Instagram) | Con la web |
|---|---|
| El cliente se desplaza por 133 posts y 14 destacadas | Catálogo con 11 categorías, filtros por ocasión y buscador |
| Pregunta precio, tamaño y plazo por mensaje directo | La ficha dice tamaño, plazo, qué se personaliza y el precio "desde" si ella lo publica |
| Explica lo que quiere en varios mensajes | Formulario de encargo: producto, opciones, colores, talla, fotos de referencia, ciudad |
| Ella copia los datos a mano | El encargo llega ordenado a su panel y le avisa por correo; el cliente sigue en WhatsApp con un código de pedido |
| Políticas escondidas en una destacada de 2023 | Página "Cómo comprar": plazos, anticipo del 50 % o 3 cuotas, urgencia +10 %, envío contraentrega, sin devoluciones |
| Seguimiento por mensajes | Página de seguimiento con el código (MH4-0042): estado y fecha estimada |
| "No recibo pedidos hasta agosto" en una historia | Interruptor de **agenda abierta/cerrada** en el panel, con un mensaje que se ve en toda la web |

Lo que **no** cambia, para no romper lo que le funciona:

- **WhatsApp sigue siendo el canal de cierre.** La web prepara el pedido; la conversación y el pago
  siguen siendo personales, como hoy (Crochetos, la competencia más parecida, trabaja igual).
- **Pagos por transferencia** (Bancolombia / Nequi) como ahora. Sus datos bancarios no se publican:
  se muestran solo en el pedido confirmado. Una pasarela (Wompi) queda como mejora opcional.
- **Precios**: los que ella fije. Si no quiere publicarlos, la ficha dice "Cotiza por WhatsApp".

## 2. La propuesta comercial (tú → ella)

> **Documento interno.** El precio no se le comunica de entrada: primero se le muestra la demo y
> puede haber negociación. Este repositorio es privado por esto.

Contexto: es una conocida a la que le has comprado, no una amiga cercana. La relación pesa más que
maximizar el cobro: precio bajo y claro, sin mensualidades obligatorias.

### Precio decidido (1 de octubre de 2026)

| Paquete | Qué incluye | Precio |
|---|---|---|
| **Base: catálogo + panel** | Todo lo que tiene la demo (catálogo, fichas, encargo por WhatsApp, seguimiento, cómo comprar, quién teje) **más** el login y el panel de administración (productos, fotos, pedidos, clientes, agenda) | **$300.000 COP, pago único** |
| Extras (se cotizan aparte, suben el precio) | Carrito de compras, pasarela de pagos (Wompi/Nequi), cuentas de cliente con historial ampliado, nuevas secciones, campañas | A convenir |

Referencia del mercado colombiano en 2026: una web de catálogo para emprendimiento la cobran
freelancers entre **$800.000 y $2.500.000 COP** ([macgraficas](https://macgraficas.com/cuanto-vale-hacer-una-pagina-web-en-colombia/),
[cangrejodigital](https://cangrejodigital.com/diseno-web/cuanto-cuesta-pagina-web-colombia/)). $300.000 está muy por
debajo: es un precio de conocida, y conviene que ella lo perciba así (sin decirlo con esas palabras).

### Margen para negociar

- Si pide bajar: quitar del paquete base el login de clientes (dejar solo el panel de ella) antes que
  bajar la cifra.
- Si pide más cosas: todo lo de la columna "Extras" se cotiza aparte.
- Forma de pago sugerida: 50 % al empezar los ajustes y 50 % al entregar (el mismo esquema que ella
  usa con sus clientes, le resultará natural).

### Costes que quedan después de la entrega

Con un pago único, los costes recurrentes deben ser casi cero o de ella:

| Concepto | Quién lo paga | Coste |
|---|---|---|
| Dominio propio (si lo quiere, ej. `magich4nds.com`) | Ella, a su nombre | ≈ 10–15 USD/año |
| Hosting | Planes gratuitos (ver `06-infraestructura-y-costes.md`) | 0 |
| Base de datos, correo de avisos, fotos | Planes gratuitos de Neon, Resend y R2 | 0 |
| Mantenimiento | Opcional: cambios puntuales que te pida, cotizados aparte | — |

**Ojo con Vercel:** el plan Hobby no permite uso comercial. Mientras sea demo no hay venta; si ella la
compra, la web de producción pasa a una opción gratuita que sí lo permite (Cloudflare Workers) o a
Vercel Pro (20 USD/mes, que no encaja con un pago único). Detalle en `06-infraestructura-y-costes.md`.

### Condiciones a dejar por escrito (mensaje o documento corto)

- **Propiedad**: el dominio y las cuentas a su nombre (o transferibles); el contenido y las fotos son suyos.
- Qué incluye el precio base y que los extras se cotizan aparte.
- Una ronda de ajustes de diseño y textos incluida; cambios posteriores, a convenir.
- Uso de fotos de clientes y de personas en la web solo con su autorización.
