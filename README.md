# Magic H4nds — Propuesta de web y catálogo

Proyecto *spec* (sin encargo previo): construir una versión funcional de la web de **Magic H4nds**
(`@magic.h4nds`, crochet y amigurumis hechos a mano en Vélez, Santander, Colombia) para presentársela
a la dueña sin compromiso. Si le gusta, se acuerda un precio y se pule a su gusto.

## Estado

- **Demo publicada**: https://magichands.axchisan.com (Vercel; se actualiza con cada `push` a `main`).
  Mientras el DNS propaga: https://magichands-iota.vercel.app
- **Repositorio**: https://github.com/axchisan/magichands (privado).
- **Precio interno**: $300.000 COP por el paquete base (catálogo + panel); extras aparte. No se le
  comunica de entrada (ver `docs/04-modelo-de-negocio.md`).

| Fase | Qué | Estado |
|---|---|---|
| 1 | Investigación y recopilación de recursos | Hecho |
| 2 | Catálogo curado, fotos con IA e identidad de marca | Hecho |
| 3 | Modelo de negocio, arquitectura, infraestructura | Hecho (actualizado 1 oct 2026) |
| 4 | Web pública y publicación en Vercel | Hecho |
| F5–F8 | Base de datos, login (Google + código por correo), panel, avisos | **Siguiente**: `docs/08-plan-de-desarrollo.md` |
| F9 | Presentación a ella | Pendiente |
| F10 | Traspaso a su dominio si acepta | Pendiente (`docs/09-dominio-portable.md`) |

## Estructura

```
docs/
  00-plan-de-investigacion.md   Qué queremos saber, cómo y el checklist de la fase 1
  01-principios-y-limites.md    Reglas de uso de sus fotos y datos durante el pitch
  02-seleccion-y-mejora-de-fotos.md  Criterios de selección, plan de IA y lote 1
  03-identidad-de-marca.md      Logo, paleta, tipografía y tono
  04-modelo-de-negocio.md       Cómo vende ella, qué hace la web y opciones de cobro tuyas
  05-arquitectura.md            Stack, páginas, panel, modelo de datos, seguridad
  06-infraestructura-y-costes.md  Vercel (demo), costes, opciones de producción y cuentas
  07-plan-demo.md               Alcance de la demo, visibilidad, mensaje de contacto
  08-plan-de-desarrollo.md      Qué está hecho y qué falta (F5–F10), con criterios de terminado
  09-dominio-portable.md        Cómo pasar del subdominio al dominio de ella
scripts/
  exportar_web.py               Exporta el catálogo y las fotos WebP a web/
  seleccion_catalogo.py         Especificación del catálogo; copia las fotos y genera catalogo.json
  galeria_revision.py           Genera recursos/catalogo/revision.html
investigacion/
  01-perfil-del-negocio.md      Quién es, qué vende, cómo vende (datos reales)
  02-diagnostico-digital.md     Problemas de su presencia actual y oportunidades
  03-inventario-de-productos.md Catálogo deducido de posts e historias, por categoría
  04-competencia.md             Tiendas colombianas con web: precios y flujos de pedido
  inventario_posts.csv / .json  Las 133 publicaciones categorizadas
  evidencias/                   Capturas que respaldan el diagnóstico (p. ej. enlace roto)
web/                            La web (Next.js 16): ver web/README.md
recursos/
  README.md                     Inventario de recursos y cómo se obtuvieron
  instagram/
    perfil/                     Foto de perfil (logo)
    posts/                      133 portadas de publicaciones (1440 px) + posts.json
    carruseles/                 Todas las fotos de cada publicación + feed.json (fechas, likes)
    historias-destacadas/       14 destacadas: 343 imágenes, 97 vídeos e historias.json
    reels/                      Reels de la blusa orquídea y de empacar pedidos + fotogramas
    capturas-originales/        Capturas tomadas a mano del perfil
  marca/                        Logo vectorial y variantes, favicons, tokens.css/json, marca.html
  catalogo/
    catalogo.json               Datos semilla de la web: 73 productos y sus fotos
    revision.html               Galería local para revisar la selección
    seleccion/                  Fotos elegidas por categoría/producto + _marca/
    mejoradas-ia/               21 fotos principales sin texto (Gemini), misma ruta que en seleccion/
```

## Hallazgos clave (resumen)

- **El único enlace de su bio (`linkr.bio/magic.h4nds`) está roto**: devuelve `NoSuchKey`.
  Hoy un cliente no tiene ningún canal de contacto fuera del DM de Instagram.
- **Cero presencia fuera de Instagram**: no aparece en buscadores, ni web, ni Facebook, ni TikTok indexados.
- El catálogo real vive en **14 historias destacadas** y 133 publicaciones sin orden, sin precios
  (solo 10 publicaciones mencionan precio) y sin forma de filtrar.
- Su **producto estrella actual** ya no está en el grid sino en las historias: amigurumis/"funkos"
  personalizados de personas reales sobre base de madera grabada con su marca, y mascotas en amigurumi.
- Su trabajo reciente está al nivel de tiendas con web, pero se presenta en historias sueltas.
- **Los precios los fija ella**: la web mostrará exactamente los que indique; no proponemos cambiarlos.
- Tiene **políticas claras** (50 % de anticipo o 3 cuotas, +10 % por urgencia, sin devoluciones,
  envío contraentrega, Bancolombia/Nequi) escondidas en una destacada de 2023.
- Todo es **bajo pedido y personalizable** (15–20 días hábiles, envíos nacionales): el flujo natural es
  *catálogo → personalizar → pedir cotización/pedido por WhatsApp*, no un e-commerce con carrito.

Detalle en `investigacion/`.
