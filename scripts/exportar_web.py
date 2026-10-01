"""Exporta el catálogo a la web (web/).

Lee recursos/catalogo/catalogo.json (generado por seleccion_catalogo.py) y produce:

- web/public/img/p/<producto>/<NN>-<ancho>.webp   variantes 480/960/1440 px de cada foto
- web/public/img/marca/...                         fotos de ambiente y logos optimizados
- web/src/data/catalogo.json                       datos que lee Next.js

Usa la versión mejorada con IA cuando existe. Ejecutar desde la raíz del proyecto:

    python3 scripts/exportar_web.py
"""

import json
import os
import shutil

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOGO = os.path.join(RAIZ, "recursos", "catalogo", "catalogo.json")
MARCA = os.path.join(RAIZ, "recursos", "marca")
PUBLIC = os.path.join(RAIZ, "web", "public", "img")
DATOS = os.path.join(RAIZ, "web", "src", "data", "catalogo.json")

ANCHOS = (480, 960, 1440)  # deben coincidir con images.deviceSizes en web/next.config.ts
CALIDAD = 78

# Texto de cada categoría para la web (tono de la marca, frases cortas).
CATEGORIAS = {
    "personalizados": "Tu persona favorita tejida con su ropa, su profesión y sus detalles, sobre base de madera grabada.",
    "mascotas": "Nos mandas fotos de tu perro o tu gato y lo tejemos con sus colores y sus orejas.",
    "personajes": "Tus personajes de películas, series, anime y fútbol, tejidos bajo pedido.",
    "amigurumis": "Abejitas, conejitos, pandas y más, súper suavecitos.",
    "flores": "Ramos que no se marchitan, con los colores y las flores que elijas.",
    "ropa": "Blusas, tops y camisas tejidas a mano, en tu talla y tus colores.",
    "vestidos-de-bano": "Vestidos de baño tejidos en todas las tallas y colores.",
    "bolsos": "Bolsos, canguros y accesorios hechos con orgullo veleño.",
    "accesorios-mascotas": "Pañoletas, collares y gorritos para que tu peludito también estrene.",
    "llaveros": "Mini amigurumis, frutas y flores para llevar en tus llaves.",
    "hogar": "Luces, portavasos, plantas y adornos de navidad para tu casa.",
}

# Ocasiones (filtro del catálogo) por producto.
OCASIONES = {
    "regalo": ["funko-personalizado", "funko-en-cupula", "parejas-y-familias", "profesiones", "graduados",
               "llaveros-personalizados", "tu-mascota-en-amigurumi", "ramo-de-tulipanes", "ramo-de-rosas",
               "ramo-de-girasoles", "ramo-personalizado", "tulipan", "abejita", "conejito-gigante", "futbolistas"],
    "amor-y-amistad": ["parejas-y-familias", "ramo-de-rosas", "ramo-de-tulipanes", "tulipan", "stitch",
                       "llaveros-personalizados", "ramo-personalizado"],
    "dia-de-la-madre": ["ramo-de-tulipanes", "ramo-de-rosas", "ramo-de-girasoles", "ramo-personalizado",
                        "tulipan", "maceta-de-tulipanes", "figuras-religiosas"],
    "navidad": ["pesebre", "arbolitos-de-navidad", "collar-navideno", "luces-de-flores", "figuras-religiosas"],
    "grados": ["graduados", "profesiones"],
}
OCASIONES_NOMBRE = {
    "regalo": "Para regalar",
    "amor-y-amistad": "Amor y amistad",
    "dia-de-la-madre": "Día de la madre",
    "navidad": "Navidad",
    "grados": "Grados",
}

# Fotos de producto en la mano para el círculo de la portada (producto, índice de foto).
HERO = [
    ("funko-personalizado", 0), ("abejita", 0), ("tu-mascota-en-amigurumi", 0), ("ramo-de-tulipanes", 0),
    ("coraline", 0), ("futbolistas", 0), ("colibri", 0), ("conejito-gigante", 0),
]


def variantes(src, destino_base):
    """Escribe <destino_base>-<ancho>.webp para 480/960/1440. Devuelve (ancho, alto, anchos)."""
    im = Image.open(src)
    im = im.convert("RGB")
    w, h = im.size
    hechos = []
    for ancho in ANCHOS:
        # Siempre se escriben los tres nombres para que el cargador de next/image sea trivial;
        # si la foto es más pequeña que el ancho, se guarda a su tamaño original (sin ampliar).
        a = min(ancho, w)
        v = im if a == w else im.resize((a, round(h * a / w)), Image.LANCZOS)
        v.save(f"{destino_base}-{ancho}.webp", "WEBP", quality=CALIDAD, method=6)
        hechos.append(ancho)
    return w, h, hechos


def main():
    c = json.load(open(CATALOGO))
    if os.path.isdir(PUBLIC):
        shutil.rmtree(PUBLIC)
    os.makedirs(os.path.join(PUBLIC, "p"))
    os.makedirs(os.path.join(PUBLIC, "marca"))

    productos = []
    for p in c["productos"]:
        d = os.path.join(PUBLIC, "p", p["slug"])
        os.makedirs(d)
        fotos = []
        for i, f in enumerate(p["fotos"], 1):
            src = os.path.join(RAIZ, f.get("archivo_ia") or f["archivo"])
            base = os.path.join(d, f"{i:02d}")
            w, h, _ = variantes(src, base)
            fotos.append({
                "src": f"/img/p/{p['slug']}/{i:02d}",
                "ancho": w, "alto": h,
                "alt": f"{p['nombre']} tejido a mano por Magic H4nds" if i == 1 else f"{p['nombre']}, foto {i}",
                "ia": bool(f.get("archivo_ia")),
            })
        productos.append({
            "slug": p["slug"],
            "categoria": p["categoria"],
            "nombre": p["nombre"],
            "descripcion": p["descripcion"],
            "personalizacion": [x for x in p["personalizacion"] if x != "—"],
            "tamano": None if p["tamano"] in ("—", "") else p["tamano"],
            "plazo": p["plazo"],
            "destacado": p["destacado"],
            "precioReferencia": p["precio_publicado"],
            "ocasiones": [o for o, slugs in OCASIONES.items() if p["slug"] in slugs],
            "fotos": fotos,
        })

    por_slug = {p["slug"]: p for p in productos}
    hero = [{**por_slug[s]["fotos"][i], "producto": s, "nombre": por_slug[s]["nombre"]} for s, i in HERO]

    # Fotos de ambiente (Hecho en Vélez, proceso...)
    marca = {}
    for grupo, fotos in c["marca"].items():
        d = os.path.join(PUBLIC, "marca", grupo)
        os.makedirs(d)
        marca[grupo] = []
        for i, f in enumerate(fotos, 1):
            w, h, _ = variantes(os.path.join(RAIZ, f["archivo"]), os.path.join(d, f"{i:02d}"))
            marca[grupo].append({"src": f"/img/marca/{grupo}/{i:02d}", "ancho": w, "alto": h})

    # Logos: rasterizados ligeros para la web (los SVG trazados pesan ~300-450 KB)
    for nombre in ("logo-completo", "monograma-mh4-oscuro", "monograma-mh4-sin-fondo", "mh4-oscuro", "mh4-sin-fondo"):
        im = Image.open(os.path.join(MARCA, f"{nombre}.png")).convert("RGBA")
        im.save(os.path.join(PUBLIC, "marca", f"{nombre}.webp"), "WEBP", quality=90, method=6)

    datos = {
        "categorias": [
            {"slug": k, "nombre": v, "descripcion": CATEGORIAS[k],
             "total": sum(1 for p in productos if p["categoria"] == k)}
            for k, v in c["categorias"].items()
        ],
        "ocasiones": [{"slug": k, "nombre": v} for k, v in OCASIONES_NOMBRE.items()],
        "productos": productos,
        "hero": hero,
        "marca": marca,
    }
    os.makedirs(os.path.dirname(DATOS), exist_ok=True)
    with open(DATOS, "w") as f:
        json.dump(datos, f, ensure_ascii=False, indent=1)

    total = sum(os.path.getsize(os.path.join(r, x)) for r, _, fs in os.walk(PUBLIC) for x in fs)
    archivos = sum(len(fs) for _, _, fs in os.walk(PUBLIC))
    print(f"{len(productos)} productos, {archivos} imágenes, {total / 1e6:.1f} MB en web/public/img")


if __name__ == "__main__":
    main()
