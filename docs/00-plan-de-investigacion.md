# Plan de investigación — Fase 1

Objetivo: reunir lo necesario para presentar una propuesta que se sienta **hecha para ella**, no una
plantilla: sus productos, sus fotos, su voz, sus problemas reales y una solución que encaje con cómo
trabaja hoy.

## 1. Preguntas que debemos responder

### Negocio
- [x] ¿Qué vende? → amigurumis, ropa tejida (tops, blusas, camisas, vestidos de baño), bolsos y
      canguros, flores y ramos, accesorios para mascotas, llaveros, decoración, navidad.
- [x] ¿Dónde está? → Vélez, Santander (Colombia). Envíos nacionales.
- [x] ¿Cómo vende? → bajo pedido, personalizable, 15–20 días hábiles; algunos productos con entrega inmediata.
- [x] ¿Desde cuándo? → agosto de 2021 (~5 años).
- [x] ¿Rango de precios? → precios sueltos de $12.000 a $75.000 (ver inventario). Hay que pedírselos a ella.
- [x] ¿Medios de pago y envío? → Bancolombia y Nequi, 50 % de anticipo o 3 cuotas, envío contraentrega.
- [x] ¿Quién está detrás? → Yuliana (para el trato en el pitch, no para publicarlo).
- [ ] ¿Vende también en ferias/puntos físicos? → hay posts de ferias de Vélez (Festival de la Guabina y el Tiple).

### Clientes
- [x] ¿Quién compra? → regalos (día de la madre, amor y amistad, navidad), fans de personajes
      (anime, Harry Potter, Star Wars, fútbol), dueños de mascotas, ropa para jóvenes.
- [ ] ¿Qué preguntan más? → inferir de comentarios y de las destacadas "Clientes".
- [x] ¿Qué productos generan más interacción? → ropa y reels; ver diagnóstico.

### Presencia digital
- [x] Perfil de Instagram: 133 publicaciones, 1.424 seguidores, 521 seguidos.
- [x] Enlace de la bio: **roto**.
- [x] Otras redes / buscadores: sin resultados.
- [ ] ¿Tiene WhatsApp Business? ¿Cuenta de empresa o personal en Instagram? (categoría, botón de contacto).

### Marca
- [x] Logo: manos alrededor de "MH4 · Magic Hands" sobre fondo negro (foto de perfil).
- [x] Logo: vectorizado con variantes (ver `docs/03-identidad-de-marca.md`).
- [x] Paleta, tipografía y tono → `docs/03-identidad-de-marca.md`.

## 2. Fuentes

| Fuente | Método | Estado |
|---|---|---|
| Perfil de Instagram | Chrome con sesión iniciada, lectura del DOM | Hecho |
| 133 publicaciones (portada + texto) | Descarga en la página, empaquetado ZIP | Hecho |
| 14 historias destacadas (imágenes + vídeos) | API interna de Instagram desde la sesión | Hecho — 343 imágenes, 97 vídeos |
| Carruseles completos, fechas y likes | API de media por publicación | Hecho — 303 fotos, feed.json |
| linkr.bio | Navegador | Hecho — roto |
| Búsqueda web | WebSearch | Hecho — sin resultados |
| Competencia (tiendas de amigurumi en Colombia con web) | WebSearch + WebFetch | Hecho — ver `investigacion/04-competencia.md` |

## 3. Entregables de la fase 1

1. `recursos/` completo y ordenado.
2. `investigacion/01-perfil-del-negocio.md`
3. `investigacion/02-diagnostico-digital.md`
4. `investigacion/03-inventario-de-productos.md` — cada producto con categoría, fotos disponibles,
   precio si lo hay, personalización y plazo. Es la base de datos semilla del catálogo.
5. Lista corta de **fotos candidatas** para la portada y el catálogo (fase 2).

## 4. Criterio para elegir fotos (fase 2)

- Producto nítido, completo y centrado. Su estilo propio (mano sosteniendo el amigurumi contra cielo
  azul y el pueblo de fondo) es muy reconocible: **conservarlo** como identidad visual, no reemplazarlo
  por fondos blancos genéricos.
- Una foto principal por producto + detalles.
- Mejora con IA solo de luz, nitidez, recorte y fondo; nunca inventar detalles del tejido que no existen
  (sería vender algo distinto a lo que ella entrega).
