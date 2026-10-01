# Inventario de recursos

Todo lo descargado el 30 de septiembre de 2026 desde el Instagram público de `@magic.h4nds`,
con la sesión de Chrome del usuario. Los originales **no se editan**: cualquier versión retocada va a
`catalogo/`.

## `instagram/`

| Carpeta / archivo | Contenido | Cantidad |
|---|---|---|
| `perfil/logo_magic_h4nds_1080.jpg` | Logo (foto de perfil de @magic.h4nds, verificada por su texto alternativo) | 1080 px |
| `posts/NNN_tipo_SHORTCODE.jpg` | Portada de cada publicación, en orden del grid (001 = más reciente) | 133 (1440 px) |
| `posts.json` | Orden, tipo, URL y texto completo de cada publicación | 133 |
| `carruseles/NNN_SHORTCODE/NN.jpg` | **Todas** las fotos de cada publicación (carruseles completos, 1440 px) | 303 fotos |
| `feed.json` | Fecha, likes, comentarios, reproducciones y lista de imágenes por publicación | 133 |
| `historias-destacadas/NN_nombre/` | Imágenes (`NNN.jpg`), vídeos (`NNN.mp4`) y portada (`_portada.jpg`) de cada destacada | 343 imágenes, 97 vídeos |
| `historias-destacadas/historias.json` | Fecha, tipo, tamaño, menciones y enlaces de cada historia | 14 destacadas |
| `capturas-originales/` | Capturas de pantalla tomadas a mano del perfil | 7 |
| `reels/` | Vídeos de los reels 002 (empacar pedidos) y 003 (blusa orquídea), más fotogramas de la blusa (2 por segundo) | 2 vídeos, 33 fotogramas |

### Destacadas

| Carpeta | Título en Instagram | Historias | Periodo | Uso para la web |
|---|---|---|---|---|
| `01_amigurumis` | Amigurumis | 60 | feb 2025 – jul 2026 | **Catálogo principal**: personalizados sobre fondo neutro, base de madera con logo |
| `02_mascotas` | Mascotas 💓 | 7 | dic 2024 – sep 2026 | Línea "tu mascota en amigurumi" |
| `03_tops` | Tops🌷 | 8 | feb 2025 – ene 2026 | Ropa reciente sobre maniquí (un precio: top S-M $26.000) |
| `04_funkos-personalizados` | Funkos 🔥 | 24 | dic 2024 – abr 2026 | **Producto estrella**: funko personalizado, base grabada, cúpula de vidrio |
| `05_clientes-mascotas` | Clientes 🐕 😺 | 11 | nov 2024 – jul 2025 | Testimonios de pañoletas (mascotas de clientes) |
| `06_clientes-2024-2025` | Clientes 🥰 | 62 | mar 2024 – oct 2025 | Testimonios; **personas reales** → solo con permiso |
| `07_clientes-2023` | Clientes 💗 | 24 | mar 2023 – feb 2024 | Testimonios antiguos |
| `08_ramos-y-flores` | (sin título) | 17 | ago 2022 – sep 2023 | Línea de ramos |
| `09_tops-grannys` | (sin título) | 16 | ago 2022 – may 2024 | Tops y blusas grannys |
| `10_amigurumis-2022-2024` | Amigurumis | 46 | ago 2022 – abr 2024 | Amigurumis con cielo de Vélez; precios sueltos (virgencita 20 cm $75.000) |
| `11_informacion` | Información | 3 | jul 2023 | **Políticas**: plazos, anticipo, cuotas, urgencia, pagos (contiene datos bancarios → no publicar) |
| `12_llaveros` | (sin título) | 18 | ago 2021 – ene 2023 | Llaveros |
| `13_clientes-2022` | clientes 022✿ | 17 | feb – dic 2022 | Testimonios antiguos |
| `14_tops-y-bikinis-2021` | tops/bikinis ✿ | 16 | sep 2021 – ago 2022 | Ropa de baño antigua |

## Otras carpetas

- `marca/logo_original_1080.jpg` — logo a 1080 px; base para vectorizarlo en la fase 2.
- `catalogo/seleccion/` — fotos elegidas por producto, generadas por `scripts/seleccion_catalogo.py`; ver `docs/02-seleccion-y-mejora-de-fotos.md`.
- `catalogo/catalogo.json` y `catalogo/revision.html` — datos semilla y galería de revisión.
- `catalogo/mejoradas-ia/` — versiones con luz/fondo/nitidez mejorados; siempre junto a la original (fase 2).

## Advertencias

- `11_informacion/003.jpg` muestra número de cuenta, cédula y Nequi de la dueña. Es material de
  referencia privado: no se usa en la demo ni se copia a la documentación.
- Las carpetas `clientes*` tienen caras de terceros. Ver `docs/01-principios-y-limites.md`.
