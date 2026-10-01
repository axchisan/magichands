"""Imagen para compartir el enlace (Open Graph, 1200x630): titular de la marca y fotos de productos.

    python3 scripts/og_imagen.py <Gloock.ttf> <Figtree.ttf>   -> web/src/app/opengraph-image.jpg
"""
import os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(RAIZ, "web", "public", "img")
W, H = 1200, 630
TINTA, CREMA, LINO, ROSA = (14, 12, 11), (242, 210, 182), (251, 246, 241), (226, 129, 128)

serif = lambda t: ImageFont.truetype(sys.argv[1], t)
def sans(t, peso="Regular"):
    f = ImageFont.truetype(sys.argv[2], t)
    f.set_variation_by_name(peso)
    return f

lienzo = Image.new("RGB", (W, H), TINTA)
# Halo cálido detrás de las fotos
halo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ImageDraw.Draw(halo).ellipse((640, 40, 1260, 640), fill=(163, 60, 78, 90))
lienzo.paste(halo.filter(ImageFilter.GaussianBlur(120)), (0, 0), halo.filter(ImageFilter.GaussianBlur(120)))

def tarjeta(ruta, ancho, angulo):
    im = Image.open(ruta).convert("RGB")
    alto = round(ancho * 1.3)
    # recorte centrado 10:13
    r = im.width / im.height
    if r > ancho / alto:
        nw = round(im.height * ancho / alto); im = im.crop(((im.width - nw) // 2, 0, (im.width + nw) // 2, im.height))
    else:
        nh = round(im.width * alto / ancho); im = im.crop((0, (im.height - nh) // 2, im.width, (im.height + nh) // 2))
    im = im.resize((ancho, alto), Image.LANCZOS)
    borde = 8
    t = Image.new("RGBA", (ancho + 2 * borde, alto + 2 * borde), (0, 0, 0, 0))
    m = Image.new("L", t.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, *t.size), 26, fill=255)
    fondo = Image.new("RGBA", t.size, LINO + (255,)); t.paste(fondo, (0, 0), m)
    mi = Image.new("L", (ancho, alto), 0); ImageDraw.Draw(mi).rounded_rectangle((0, 0, ancho, alto), 20, fill=255)
    t.paste(im, (borde, borde), mi)
    return t.rotate(angulo, expand=True, resample=Image.BICUBIC)

def pegar(t, x, y):
    sombra = Image.new("RGBA", t.size, (0, 0, 0, 0))
    sombra.paste((0, 0, 0, 150), (0, 0), t.split()[3])
    sombra = sombra.filter(ImageFilter.GaussianBlur(18))
    lienzo.paste(sombra, (x + 10, y + 18), sombra)
    lienzo.paste(t, (x, y), t)

pegar(tarjeta(f"{P}/p/ramo-de-tulipanes/01-960.webp", 225, 8), 640, 74)
pegar(tarjeta(f"{P}/p/tu-mascota-en-amigurumi/01-960.webp", 220, -7), 918, 46)
pegar(tarjeta(f"{P}/p/funko-personalizado/01-960.webp", 262, 2), 772, 236)

d = ImageDraw.Draw(lienzo)
logo = Image.open(f"{P}/marca/mh4-sin-fondo.webp").convert("RGBA")
logo = logo.resize((150, round(150 * logo.height / logo.width)), Image.LANCZOS)
lienzo.paste(logo, (64, 52), logo)
y = 150
for linea in ("Lo que imaginas,", "tejido punto", "por punto"):
    d.text((62, y), linea, font=serif(70), fill=CREMA); y += 78
d.text((64, y + 22), "Amigurumis personalizados, flores que no se", font=sans(27), fill=LINO)
d.text((64, y + 58), "marchitan y ropa tejida a mano.", font=sans(27), fill=LINO)
# Pastilla
texto = "Vélez, Santander · Envíos a todo Colombia"
f = sans(22, "SemiBold"); w = d.textlength(texto, font=f)
d.rounded_rectangle((64, 540, 64 + w + 44, 540 + 46), 23, fill=(163, 60, 78))
d.text((86, 551), texto, font=f, fill=(255, 255, 255))

salida = os.path.join(RAIZ, "web", "src", "app", "opengraph-image.jpg")
lienzo.save(salida, "JPEG", quality=88, optimize=True, progressive=True)
print(salida, os.path.getsize(salida) // 1024, "KB")


# ---------------------------------------------------------------- Una por producto: web/public/img/p/<slug>/og.jpg
import json, textwrap

def og_producto(p):
    global lienzo
    lienzo = Image.new("RGB", (W, H), TINTA)
    halo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(halo).ellipse((-150, 0, 560, 700), fill=(163, 60, 78, 85))
    h2 = halo.filter(ImageFilter.GaussianBlur(120)); lienzo.paste(h2, (0, 0), h2)
    pegar(tarjeta(f"{RAIZ}/web/public{p['fotos'][0]['src']}-960.webp", 360, -3), 70, 50)
    d = ImageDraw.Draw(lienzo)
    x = 540
    lg = Image.open(f"{P}/marca/mh4-sin-fondo.webp").convert("RGBA"); lg = lg.resize((110, round(110 * lg.height / lg.width)), Image.LANCZOS)
    lienzo.paste(lg, (x, 70), lg)
    lineas = textwrap.wrap(p["nombre"], 16)[:3]
    tam = 76 if len(lineas) == 1 else 64
    y = 175
    for l in lineas:
        d.text((x - 2, y), l, font=serif(tam), fill=CREMA); y += tam + 10
    desc = textwrap.wrap(p["descripcion"], 38)[:3]
    if len(textwrap.wrap(p["descripcion"], 38)) > 3: desc[-1] = desc[-1].rstrip(".,") + "…"
    y += 18
    for l in desc:
        d.text((x, y), l, font=sans(26), fill=LINO); y += 36
    texto = "Tejido a mano · Encárgalo por WhatsApp"
    f = sans(22, "SemiBold"); w = d.textlength(texto, font=f)
    d.rounded_rectangle((x, 540, x + w + 44, 586), 23, fill=(163, 60, 78))
    d.text((x + 22, 551), texto, font=f, fill=(255, 255, 255))
    salida = f"{RAIZ}/web/public/img/p/{p['slug']}/og.jpg"
    lienzo.save(salida, "JPEG", quality=84, optimize=True, progressive=True)
    return os.path.getsize(salida)

datos = json.load(open(os.path.join(RAIZ, "web", "src", "data", "catalogo.json")))
tam = [og_producto(p) for p in datos["productos"]]
print(len(tam), "imágenes de producto,", max(tam) // 1024, "KB la más pesada")
