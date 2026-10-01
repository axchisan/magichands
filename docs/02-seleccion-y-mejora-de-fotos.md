# Fase 2 — Selección de fotos y mejora con IA

## Resultado de la selección

- **73 productos** en 11 categorías, **263 fotos** elegidas, más **22 fotos de marca**
  (Hecho en Vélez, ropa puesta, cielo de Vélez, base grabada y proceso de tejido).
- Todo sale de `scripts/seleccion_catalogo.py` (la especificación del catálogo vive ahí) y se
  regenera con:

  ```
  python3 scripts/seleccion_catalogo.py && python3 scripts/galeria_revision.py
  ```

- Salidas:
  - `recursos/catalogo/seleccion/<categoria>/<producto>/01-principal.jpg, 02.jpg…`
  - `recursos/catalogo/seleccion/_marca/<grupo>/`
  - `recursos/catalogo/catalogo.json`: datos semilla de la web (nombre, descripción,
    personalización, tamaño, plazo, destacado, precio publicado y origen de cada foto).
  - `recursos/catalogo/revision.html`: **galería local para revisar la selección** (ábrela con doble clic).

| Categoría | Productos |
|---|---|
| Personalizados (estrella) | 8 |
| Tu mascota en amigurumi | 1 |
| Personajes | 19 |
| Amigurumis | 11 |
| Flores y ramos | 6 |
| Ropa tejida | 9 |
| Vestidos de baño | 4 |
| Bolsos y accesorios | 5 |
| Accesorios para mascotas | 3 |
| Llaveros | 2 |
| Hogar y navidad | 5 |

**Destacados para la portada (10):** funko personalizado, funko en cúpula, parejas y familias,
tu mascota en amigurumi, futbolistas, abejita, ramo de tulipanes, blusa orquídea, camisa unisex
y bolso veleño.

## Criterios aplicados

1. **Lo que vende hoy va primero.** Los personalizados sobre base grabada (historias 2025–2026)
   encabezan el catálogo aunque no estén en el grid.
2. **Foto principal = producto completo, nítido y centrado**, preferiblemente sobre su fondo de
   marca: fondo gris neutro con base "MAGIC HANDS" (personalizados) o la mano contra el cielo de
   Vélez (amigurumis y personajes). Se conservan los dos estilos: son su identidad.
3. Entre dos fotos iguales, gana la de **mayor resolución** (por ejemplo, Messi de 1440 px en lugar
   de la historia de 640 px).
4. Galería de 2 a 8 fotos por producto: ángulos, detalle del tejido, uso real (puesto, en la mascota).
5. **Fuera de la selección:** destacadas de clientes (caras de terceros), la destacada de datos
   bancarios, fotos borrosas y duplicados (4 pares detectados por hash perceptual).
6. **Personas en las fotos**: solo aparecen modelos que ella publicó para su propia marca (camisa,
   bolso veleño, tops, blusa). Las piezas personalizadas representan a clientes; en la versión final
   se le recomienda confirmar que puede mostrarlas.
7. **Precios**: `precio_publicado` guarda solo los 5 precios que ella publicó, con su fuente y año.
   Los precios los fija ella; en la web se muestran los que confirme.

## Mejora con IA

### Qué necesita cada foto

| Etiqueta | Fotos | Motivo |
|---|---|---|
| `revisar-texto` | 115 de 285 | Historias con texto incrustado ("Funko de policía ❤️"). Casi siempre está en la zona de fondo, arriba o abajo |
| `escalar` | 75 de 285 | Lado corto < 1000 px (historias 828×1472 y 640×1136, fotogramas de reel 720×1280) |
| sin etiqueta | 48 de 73 fotos principales | Listas para usar tal cual (publicaciones a 1440 px) |

### Reglas (no negociables)

- **Nunca cambiar el producto**: ni puntos, ni colores, ni forma, ni añadir detalles. La foto debe
  mostrar exactamente lo que ella entrega.
- Permitido: quitar texto y stickers, limpiar el fondo, corregir luz y balance de blancos, enfocar,
  escalar y recortar a formato de catálogo (4:5 para tarjetas, 1:1 para miniaturas).
- Siempre se guarda la original al lado. Salida en `recursos/catalogo/mejoradas-ia/<categoria>/<producto>/`
  con el mismo nombre de archivo.
- Revisión visual de cada resultado comparándolo con la original antes de usarlo.

### Instrucciones (prompts) estándar

**A. Quitar texto (historias):**
> Elimina todo el texto, los emojis y los stickers superpuestos de esta foto y reconstruye el fondo
> que había detrás de forma natural. No modifiques en absoluto el muñeco tejido, la mano ni la base
> de madera: deben quedar idénticos, punto por punto. Mantén la luz, el color y el encuadre originales.

**B. Escalar y enfocar:**
> Aumenta la resolución de esta foto al doble y mejora la nitidez de forma natural. Conserva la
> textura real del tejido a crochet; no inventes puntos ni detalles nuevos, no cambies colores ni
> proporciones.

**C. Luz y balance (fotos de cielo o interiores amarillentos):**
> Corrige suavemente la exposición y el balance de blancos para que los colores del tejido se vean
> fieles y luminosos. No cambies el fondo ni el producto.

**D. Fondo de catálogo (opcional, solo para una variante adicional, nunca la única):**
> Sustituye el fondo por un gris cálido liso con una sombra suave bajo el producto. El producto, la
> mano y la base de madera deben quedar exactamente iguales.

### Herramientas

- **Gemini (edición de imagen)** o similar para A y D: es la que mejor respeta el sujeto al editar.
- **Escalado** (B): un upscaler dedicado (Real-ESRGAN, Topaz, Magnific) da resultados más fieles que
  pedir el escalado a un modelo generativo.
- Las correcciones de C pueden hacerse sin IA (niveles y balance) desde un script.

### Lote 1 — fotos principales que necesitan trabajo (25)

Orden de trabajo: primero los destacados (★), que son los que se ven en la portada.

| # | Prioridad | Producto | Archivo | Tamaño | Qué hacer |
|---|---|---|---|---|---|
| 1 | Alta ★ | blusa-orquidea | `ropa/blusa-orquidea/01-principal.jpg` | 720×1280 | quitar texto, escalar ×2 |
| 2 | Alta ★ | funko-en-cupula | `personalizados/funko-en-cupula/01-principal.jpg` | 828×1472 | quitar texto, escalar ×2 |
| 3 | Alta ★ | funko-personalizado | `personalizados/funko-personalizado/01-principal.jpg` | 828×1472 | quitar texto, escalar ×2 |
| 4 | Alta ★ | parejas-y-familias | `personalizados/parejas-y-familias/01-principal.jpg` | 828×1472 | quitar texto, escalar ×2 |
| 5 | Alta ★ | tu-mascota-en-amigurumi | `mascotas/tu-mascota-en-amigurumi/01-principal.jpg` | 1170×2080 | quitar texto |
| 6 | Media | blusa-de-flor | `ropa/blusa-de-flor/01-principal.jpg` | 828×1472 | quitar texto, escalar ×2 |
| 7 | Media | figuras-religiosas | `personalizados/figuras-religiosas/01-principal.jpg` | 828×1472 | quitar texto, escalar ×2 |
| 8 | Media | gandalf | `personajes/gandalf/01-principal.jpg` | 828×1472 | quitar texto, escalar ×2 |
| 9 | Media | gorro | `ropa/gorro/01-principal.jpg` | 1440×960 | escalar ×2 |
| 10 | Media | graduados | `personalizados/graduados/01-principal.jpg` | 828×1472 | quitar texto, escalar ×2 |
| 11 | Media | harry-potter | `personajes/harry-potter/01-principal.jpg` | 828×1472 | quitar texto, escalar ×2 |
| 12 | Media | llaveros-personalizados | `personalizados/llaveros-personalizados/01-principal.jpg` | 828×1472 | quitar texto, escalar ×2 |
| 13 | Media | maceta-de-tulipanes | `flores/maceta-de-tulipanes/01-principal.jpg` | 1080×1920 | quitar texto |
| 14 | Media | personajes-tiernos | `personajes/personajes-tiernos/01-principal.jpg` | 828×1472 | quitar texto, escalar ×2 |
| 15 | Media | profesiones | `personalizados/profesiones/01-principal.jpg` | 828×1472 | quitar texto, escalar ×2 |
| 16 | Media | ramo-de-girasoles | `flores/ramo-de-girasoles/01-principal.jpg` | 1080×1920 | quitar texto |
| 17 | Media | ramo-de-rosas | `flores/ramo-de-rosas/01-principal.jpg` | 1080×1920 | quitar texto |
| 18 | Media | ramo-personalizado | `flores/ramo-personalizado/01-principal.jpg` | 1080×1920 | quitar texto |
| 19 | Media | ranita | `amigurumis/ranita/01-principal.jpg` | 1156×867 | escalar ×2 |
| 20 | Media | sasuke | `personajes/sasuke/01-principal.jpg` | 828×1472 | quitar texto, escalar ×2 |
| 21 | Media | selena | `personajes/selena/01-principal.jpg` | 1440×960 | escalar ×2 |
| 22 | Media | shrek | `personajes/shrek/01-principal.jpg` | 828×1472 | quitar texto, escalar ×2 |
| 23 | Media | tops-con-flecos | `ropa/tops-con-flecos/01-principal.jpg` | 1440×2560 | quitar texto |
| 24 | Media | tops-sencillos | `ropa/tops-sencillos/01-principal.jpg` | 1156×783 | escalar ×2 |
| 25 | Media | totoro | `personajes/totoro/01-principal.jpg` | 1080×1920 | quitar texto |

Las otras 48 fotos principales ya están listas. Las fotos de galería se mejoran en un segundo lote,
solo si se usan en la demo.

## Resultado del lote 1 (30 de septiembre de 2026)

- **21 fotos principales sin texto**, procesadas con Gemini (cuenta del usuario) usando la
  instrucción A ampliada ("quitar texto, emojis, dibujos y stickers; no tocar el producto").
- Guardadas en `recursos/catalogo/mejoradas-ia/<categoria>/<producto>/01-principal.jpg`;
  `catalogo.json` las enlaza en `archivo_ia` y la galería de revisión las marca en verde.
- **Revisión**: comparadas una a una con la original. Todas corresponden a su producto, el texto
  desapareció y el tejido, las caras, la base y el grabado "MAGIC HANDS" se conservan. La blusa
  orquídea sale ligeramente más saturada.
- **Resolución**: Gemini devuelve 768×1365 (la original de historia era 828×1472). Sirve de sobra
  para tarjetas y fichas (la web las mostrará a ≤ 600 px de ancho), pero **no escala**. Si se quieren
  para portada a pantalla completa, pasar por un upscaler dedicado.
- Quedan sin tocar las 4 principales que solo necesitaban escalado (selena, ranita, tops sencillos,
  gorro): a 1156–1440 px ya se ven bien en la web.
- Cómo se automatizó: Chrome con la extensión de Claude; las fotos llegan a la página de Gemini
  desde un puente local (ventana emergente + `postMessage`) y se pegan en el cuadro de texto; el
  resultado se descarga con el botón "Descargar imagen a tamaño completo".

## Pendiente

- [x] Procesar el lote 1 con Gemini (21 fotos).
- [ ] Opcional: escalar las fotos de portada con un upscaler dedicado.
- [ ] Lote 2 (fotos de galería con texto) solo para las que se usen en la demo.
- [ ] Vectorizar el logo (`recursos/marca/logo_original_1080.jpg`): "MH4" con sombra gris,
      "MAGIC H4NDS" y las manos alrededor.
- [ ] Extraer la paleta y la tipografía de marca a partir del logo y de las fotos.
- [ ] La blusa orquídea solo existe como reel (fotogramas de 720 px): a ella se le pueden pedir fotos
      en alta si acepta el proyecto.
