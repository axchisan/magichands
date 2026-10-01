# Diagnóstico de presencia digital

Fecha de revisión: 30 de septiembre de 2026.

## Situación actual

| Canal | Estado | Impacto |
|---|---|---|
| Instagram `@magic.h4nds` | Activo. 133 publicaciones, 1.424 seguidores, 14 historias destacadas | Único canal real |
| Botones de contacto en el perfil | No se ve categoría ni botón de contacto/correo/llamar (tipo de cuenta sin verificar) | El cliente no tiene atajo para contactarla |
| Enlace de la bio `linkr.bio/magic.h4nds` | **Roto** — responde `NoSuchKey` (ver `evidencias/linkrbio_roto_2026-09-30.jpg`) | Quien toca el enlace llega a una pantalla de error |
| Web propia | No existe | — |
| Google / buscadores | Sin resultados para "magic h4nds" | Nadie la encuentra si no la sigue ya |
| WhatsApp visible | No hay número ni botón en el perfil | Contacto solo por DM |
| Facebook / TikTok | Sin cuentas encontradas | — |

## Problemas para el cliente

1. **No hay catálogo navegable.** Los productos están repartidos en 133 publicaciones cronológicas y
   14 destacadas con títulos poco descriptivos (tres se llaman "Clientes", cuatro no tienen título).
   Quien busca "un ramo" o "un top talla S" tiene que desplazarse por todo.
2. **Casi no hay precios.** Solo 10 de 133 publicaciones dicen un precio. Obliga a escribir por DM
   para todo, y muchos clientes no escriben.
3. **La personalización, que es su fuerte, no se explica en un solo sitio.** Cada post repite "bajo
   pedido, puedes elegir colores, 15 a 20 días hábiles".
4. **Sin canal de contacto directo** (el enlace está roto y no hay WhatsApp visible).
5. **No hay forma de hacer seguimiento de un pedido** ni de ver qué opinan otros clientes fuera de
   historias que caducan en la memoria.

## Problemas para ella (inferidos)

- Responde las mismas preguntas por DM una y otra vez (precio, tamaños, plazos, envío).
- Pedidos y encargos personalizados se gestionan de memoria o en chats.
- Sus productos no lucen como merecen: el trabajo reciente (funkos con base grabada, cúpula de
  vidrio) está al nivel de tiendas con web, pero se presenta en historias sueltas. Los precios son
  decisión suya y no forman parte de la propuesta.

## Fortalezas que la web debe potenciar

- **Estilo fotográfico propio y reconocible**: el producto sostenido en la mano contra el cielo azul y
  los tejados de Vélez. Es identidad de marca gratis.
- **Arraigo local**: campesina veleña, bolsos para el Festival de la Guabina y el Tiple, Mirabel
  "porque Vélez es un encanto". Diferencia frente a tiendas genéricas.
- **Variedad**: amigurumis, ropa, flores, mascotas, decoración, navidad — da para un catálogo rico.
- **Personalización** (tu mascota, tu persona favorita, tu personaje) = alto valor percibido.
- **Prueba social**: tres destacadas de clientes con sus productos.
- Tono cercano y tierno ("uwu", corazones): la web debe sonar como ella, no corporativa.

## Oportunidad (hipótesis para la fase 3)

Una web que funcione como **catálogo + generador de pedidos**, no como e-commerce clásico:

- Catálogo filtrable por categoría, ocasión (regalo, navidad, día de la madre, amor y amistad) y
  "personalizable".
- Ficha de producto con fotos, tamaño, plazo, "desde $X" y opciones de personalización.
- Botón "Pedir por WhatsApp" que abre el chat con el mensaje ya redactado (producto, colores, talla).
- Formulario de encargo personalizado con subida de foto de referencia (mascota, persona).
- Panel sencillo para que ella cargue productos y vea los pedidos (sin tocar código).
- Sección de clientes felices y "Hecho en Vélez".

Se desarrolla en `docs/` en la fase 3 (arquitectura, infraestructura, costes).

## Actividad y engagement (133 publicaciones, junio 2021 – septiembre 2026)

Datos de `recursos/instagram/feed.json`.

| Año | Publicaciones en el grid |
|---|---|
| 2021 | 43 |
| 2022 | 45 |
| 2023 | 15 |
| 2024 | 18 |
| 2025 | 9 |
| 2026 | 3 |

- **El grid está casi abandonado; el negocio vive en historias**, que caducan. Justo lo que vende hoy
  (funkos personalizados) no aparece en el grid, así que quien visita el perfil ve un catálogo de
  2021–2022. Una web con catálogo persistente resuelve exactamente eso.
- **Mejor publicación con diferencia**: reel de la blusa "orquídea" (abril 2026) — 238 likes,
  ~5.000 reproducciones. El vídeo y la ropa con storytelling funcionan; el vídeo de empacar pedidos
  también (79 likes, 2.600 reproducciones).
- **Sorteos y concursos** generan la mayor conversación (concurso del día de la madre 2022:
  231 comentarios).
- Media de likes por línea: ropa ≈ 44, mascotas ≈ 32, personajes ≈ 32, bolsos ≈ 31, amigurumis ≈ 30,
  flores ≈ 30, ropa de baño ≈ 23. No hay una línea perdedora: todas justifican estar en el catálogo.
- 35 publicaciones etiquetadas en "Vélez, Santander": la identidad local ya forma parte de su marca.
