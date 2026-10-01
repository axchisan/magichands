"""Genera recursos/catalogo/revision.html: galería local para revisar la selección del catálogo."""
import html
import json
import os

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAT = os.path.join(RAIZ, "recursos", "catalogo")
c = json.load(open(os.path.join(CAT, "catalogo.json")))

ETIQ = {"revisar-texto": "texto incrustado", "escalar": "baja resolución", "portada-de-video": "portada de vídeo"}


def rel(p):
    return os.path.relpath(os.path.join(RAIZ, p), CAT)


def foto(f, principal=False):
    if f.get("archivo_ia"):
        tags = '<span class="tag ia">mejorada con IA</span>'
        src = f["archivo_ia"]
        extra = f' · <a href="{rel(f["archivo"])}" target="_blank">original</a>'
    else:
        tags = "".join(f'<span class="tag">{ETIQ[m]}</span>' for m in f["mejoras"])
        src, extra = f["archivo"], ""
    return (f'<figure class="{"principal" if principal else ""}"><a href="{rel(src)}" target="_blank">'
            f'<img loading="lazy" src="{rel(src)}" alt=""></a>'
            f'<figcaption><code>{f["ref"]}</code> {f["ancho"]}×{f["alto"]} {tags}{extra}</figcaption></figure>')


secciones = []
for cat, nombre in c["categorias"].items():
    ps = [p for p in c["productos"] if p["categoria"] == cat]
    tarjetas = []
    for p in ps:
        precio = ""
        if p["precio_publicado"]:
            pp = p["precio_publicado"]
            precio = f'<p class="precio">Precio publicado por ella: {pp["texto"]} — {html.escape(pp["producto"])} ({pp["anio"]}). <b>Confirmar con ella.</b></p>'
        tarjetas.append(
            f'<article><header><h3>{html.escape(p["nombre"])}{" <span class=estrella>★ destacado</span>" if p["destacado"] else ""}</h3>'
            f'<p>{html.escape(p["descripcion"])}</p><p class="meta">Tamaño: {html.escape(p["tamano"])} · Plazo: {p["plazo"]} · '
            f'Personalizable: {html.escape(", ".join(p["personalizacion"]))}</p>{precio}</header>'
            f'<div class="fotos">{"".join(foto(f, i == 0) for i, f in enumerate(p["fotos"]))}</div></article>')
    secciones.append(f'<section id="{cat}"><h2>{nombre} <small>{len(ps)}</small></h2>{"".join(tarjetas)}</section>')

marca = "".join(f'<article><header><h3>{g}</h3></header><div class="fotos">{"".join(foto(f) for f in fs)}</div></article>'
                for g, fs in c["marca"].items())
nav = "".join(f'<a href="#{k}">{v}</a>' for k, v in c["categorias"].items()) + '<a href="#marca">Marca</a>'
n = sum(len(p["fotos"]) for p in c["productos"])

page = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Revisión del catálogo</title><style>
:root{{--bg:#fbf7f4;--fg:#2b2320;--mut:#7d6f69;--acc:#c2185b;--card:#fff;--line:#eadfd9}}
@media (prefers-color-scheme:dark){{:root{{--bg:#1b1715;--fg:#f1e9e5;--mut:#a89a94;--acc:#f48fb1;--card:#26201d;--line:#3a312d}}}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif}}
nav{{position:sticky;top:0;background:var(--bg);border-bottom:1px solid var(--line);padding:10px 16px;display:flex;gap:14px;overflow-x:auto;z-index:2}}
nav a{{color:var(--acc);text-decoration:none;white-space:nowrap}}main{{max-width:1200px;margin:auto;padding:16px}}
h1{{margin:.2em 0}}h2{{border-bottom:2px solid var(--acc);padding-bottom:4px;margin-top:40px}}h2 small{{color:var(--mut);font-weight:400}}
article{{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px;margin:14px 0}}
h3{{margin:0 0 4px}}.meta{{color:var(--mut);font-size:13px;margin:4px 0}}.precio{{font-size:13px;background:#fff3cd;color:#5c4400;padding:6px 8px;border-radius:6px}}
.estrella{{font-size:12px;color:var(--acc);font-weight:600}}
.fotos{{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:10px}}
figure{{margin:0}}figure img{{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:8px;display:block;background:var(--line)}}
figure.principal img{{outline:3px solid var(--acc)}}figcaption{{font-size:11px;color:var(--mut);margin-top:3px}}
.tag.ia{{background:#2e7d32}}.tag{{display:inline-block;background:var(--acc);color:#fff;border-radius:4px;padding:0 4px;margin:1px 2px 0 0;font-size:10px}}
</style></head><body><nav>{nav}</nav><main>
<h1>Revisión del catálogo — Magic H4nds</h1>
<p>{len(c["productos"])} productos · {n} fotos. La foto con borde es la principal. Etiquetas = mejora pendiente. Origen: <code>C/NNN/MM</code> publicación, <code>H/carpeta/NNN</code> historia.</p>
<p class="meta">{html.escape(c["nota_precios"])}</p>
{"".join(secciones)}<section id="marca"><h2>Fotos de marca</h2>{marca}</section></main></body></html>"""
open(os.path.join(CAT, "revision.html"), "w").write(page)
print("ok", os.path.join(CAT, "revision.html"))
