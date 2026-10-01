"""Selección de fotos del catálogo de Magic H4nds (fase 2).

Lee la especificación CATALOGO, copia las fotos elegidas desde recursos/instagram/ a
recursos/catalogo/seleccion/<categoria>/<producto>/ y escribe recursos/catalogo/catalogo.json.
Los originales no se modifican. Ejecutar desde la raíz del proyecto:

    python3 scripts/seleccion_catalogo.py

Rutas de origen abreviadas:
    C/NNN/MM  -> recursos/instagram/carruseles/NNN_<shortcode>/MM.jpg   (publicaciones, 1440 px)
    H/carpeta/NNN -> recursos/instagram/historias-destacadas/<carpeta>/NNN.jpg (historias)
    R/NNN     -> recursos/instagram/reels/fotogramas_blusa-orquidea/f_NNN.jpg (fotogramas del reel, 720 px)

Precios: solo los que ella publicó, con su fuente y año. Regla del proyecto: los precios los fija
ella; en la web se confirman con ella antes de mostrarse.
"""

import glob
import json
import os
import shutil

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IG = os.path.join(RAIZ, "recursos", "instagram")
SALIDA = os.path.join(RAIZ, "recursos", "catalogo", "seleccion")
MEJORADAS = os.path.join(RAIZ, "recursos", "catalogo", "mejoradas-ia")

H_ALIAS = {
    "01": "01_amigurumis", "02": "02_mascotas", "03": "03_tops", "04": "04_funkos-personalizados",
    "05": "05_clientes-mascotas", "08": "08_ramos-y-flores", "09": "09_tops-grannys",
    "10": "10_amigurumis-2022-2024", "12": "12_llaveros", "14": "14_tops-y-bikinis-2021",
}

CATEGORIAS = {
    "personalizados": "Personalizados",
    "mascotas": "Tu mascota en amigurumi",
    "personajes": "Personajes",
    "amigurumis": "Amigurumis",
    "flores": "Flores y ramos",
    "ropa": "Ropa tejida",
    "vestidos-de-bano": "Vestidos de baño",
    "bolsos": "Bolsos y accesorios",
    "accesorios-mascotas": "Accesorios para mascotas",
    "llaveros": "Llaveros",
    "hogar": "Hogar y navidad",
}

PLAZO = "15 a 20 días hábiles"

# Cada producto: slug, categoría, nombre, descripción, personalización, tamaño, precio publicado,
# destacado (para la portada) y fotos (la primera es la principal).
CATALOGO = [
    # ---------------- Personalizados (producto estrella actual) ----------------
    dict(slug="funko-personalizado", cat="personalizados", nombre="Funko personalizado",
         desc="Tu persona favorita convertida en amigurumi estilo funko, con su ropa, profesión y detalles, sobre base de madera grabada con Magic Hands.",
         pers=["persona a partir de fotos", "ropa y accesorios", "profesión", "base de madera grabada"],
         tam="15–25 cm", destacado=True,
         fotos=["H/04/024", "H/04/006", "H/04/014", "H/04/022", "H/04/013", "H/01/053", "H/01/049"]),
    dict(slug="funko-en-cupula", cat="personalizados", nombre="Funko en cúpula de vidrio",
         desc="Tu funko personalizado protegido del polvo en una cúpula de vidrio con base de madera.",
         pers=["persona a partir de fotos", "cúpula de vidrio"], tam="hasta 25 cm", destacado=True,
         fotos=["H/04/021", "H/04/020"]),
    dict(slug="parejas-y-familias", cat="personalizados", nombre="Parejas y familias",
         desc="Parejas, papá e hija, familias completas: todos juntos en una misma base.",
         pers=["número de personas", "ropa", "base (redonda o de corazón)"], tam="15–20 cm", destacado=True,
         fotos=["H/01/042", "H/01/055", "H/01/040", "H/04/005", "H/04/008", "H/10/026"]),
    dict(slug="profesiones", cat="personalizados", nombre="Profesiones y uniformes",
         desc="Enfermeras, ingenieros, militares, policías: el regalo perfecto para celebrar un logro.",
         pers=["uniforme", "accesorios", "nombre en la ropa"], tam="15–20 cm",
         fotos=["H/01/048", "H/01/050", "H/01/017", "H/01/006", "H/01/018", "H/01/022"]),
    dict(slug="graduados", cat="personalizados", nombre="Graduados",
         desc="El recuerdo de un grado con toga, birrete y el estilo de quien se gradúa.",
         pers=["toga y colores", "persona a partir de fotos"], tam="15–20 cm",
         fotos=["H/04/023", "H/04/015", "H/10/019"]),
    dict(slug="figuras-religiosas", cat="personalizados", nombre="Vírgenes y figuras religiosas",
         desc="Virgen de Guadalupe, del Carmen, de Fátima, angelitos y más, tejidos con todo el detalle.",
         pers=["advocación", "colores"], tam="16–20 cm",
         precio=dict(valor=75000, texto="$75.000", producto="Virgencita con denario 20 cm", fuente="H/10/016", anio="2023–2024"),
         fotos=["H/01/012", "H/01/013", "H/01/027", "H/01/054", "H/10/016", "H/10/043"]),
    dict(slug="llaveros-personalizados", cat="personalizados", nombre="Llaveros personalizados",
         desc="Tu persona favorita en versión mini para llevarla siempre contigo.",
         pers=["persona a partir de fotos"], tam="mini",
         fotos=["H/01/005", "H/01/052", "H/01/033", "H/01/001"]),
    dict(slug="campesina-velena", cat="personalizados", nombre="Campesina veleña",
         desc="Homenaje a la cultura y el folclor de Vélez, Santander, con su traje típico.",
         pers=["colores del traje"], tam="30 cm",
         fotos=["C/064/01", "H/10/001", "H/10/002", "C/064/03"]),

    # ---------------- Mascotas ----------------
    dict(slug="tu-mascota-en-amigurumi", cat="mascotas", nombre="Tu mascota en amigurumi",
         desc="Envíanos fotos de tu perro o gato y lo tejemos con sus colores, orejas y detalles.",
         pers=["a partir de fotos de tu mascota", "base de madera opcional"], tam="8–10 cm", destacado=True,
         precio=dict(valor=25000, texto="$25.000", producto="Amigurumi mascota 8–10 cm (varía según detalles y colores)", fuente="C/061", anio="2023"),
         fotos=["H/02/007", "H/02/006", "H/02/004", "H/02/005", "H/02/001", "H/02/003", "C/062/01", "C/061/01"]),

    # ---------------- Personajes ----------------
    dict(slug="harry-potter", cat="personajes", nombre="Harry Potter", desc="Harry con su varita y bufanda de Gryffindor; también en mini.",
         pers=["tamaño"], tam="10–20 cm", fotos=["H/01/023", "H/01/020", "H/10/004"]),
    dict(slug="dumbledore", cat="personajes", nombre="Albus Dumbledore", desc="El director de Hogwarts, con el color de traje que elijas.",
         pers=["color del traje"], tam="18–20 cm", fotos=["C/022/01", "C/022/02", "H/10/038"]),
    dict(slug="gandalf", cat="personajes", nombre="Gandalf", desc="El mago gris de El Señor de los Anillos.",
         pers=["tamaño"], tam="20 cm aprox.", fotos=["H/01/010", "H/01/036"]),
    dict(slug="coraline", cat="personajes", nombre="Coraline", desc="Coraline con su impermeable amarillo.",
         pers=["tamaño"], tam="20 cm", fotos=["C/024/01", "C/024/02", "C/024/03", "H/10/044"]),
    dict(slug="selena", cat="personajes", nombre="Selena Quintanilla", desc="La reina del tex-mex con su traje morado.",
         pers=["tamaño 10–30 cm"], tam="10–30 cm", fotos=["C/028/01", "C/028/02", "H/10/030"]),
    dict(slug="mirabel", cat="personajes", nombre="Mirabel Madrigal", desc="Porque Vélez es un encanto.",
         pers=["tamaño"], tam="30 cm", fotos=["C/066/01", "C/066/02", "H/10/005"]),
    dict(slug="one-piece", cat="personajes", nombre="Zoro y Luffy (One Piece)", desc="Los piratas de One Piece, juntos o por separado.",
         pers=["tamaño 10–30 cm"], tam="10–30 cm", fotos=["C/030/01", "C/030/03", "C/030/02", "H/10/024", "H/10/033"]),
    dict(slug="futbolistas", cat="personajes", nombre="Futbolistas", desc="Messi, Cristiano o tu jugador favorito con su camiseta.",
         pers=["jugador", "camiseta"], tam="20 cm",
         fotos=["C/038/01", "H/04/001", "C/038/02", "H/04/007", "H/04/019"]),
    dict(slug="goku", cat="personajes", nombre="Goku", desc="El guerrero de Dragon Ball.", pers=["tamaño"], tam="15 cm",
         fotos=["C/090/01", "C/090/02"]),
    dict(slug="naruto-kurama", cat="personajes", nombre="Naruto y Kurama", desc="Naruto y el zorro de nueve colas.",
         pers=["tamaño"], tam="15 cm aprox.", fotos=["C/080/01", "C/081/02", "C/081/01", "C/081/03"]),
    dict(slug="sasuke", cat="personajes", nombre="Sasuke Uchiha", desc="Sasuke de Naruto.", pers=["tamaño"], tam="15 cm",
         fotos=["H/01/031", "H/01/030"]),
    dict(slug="mandalorian-grogu", cat="personajes", nombre="Mandalorian y Grogu", desc="Este es el camino.",
         pers=["tamaño"], tam="—", fotos=["C/034/01", "C/034/02", "C/034/03", "H/10/012"]),
    dict(slug="appa", cat="personajes", nombre="Appa (Avatar)", desc="El bisonte volador de Avatar.",
         pers=["tamaño"], tam="24 × 17 cm", fotos=["C/026/01", "C/026/02", "C/026/03", "H/10/036"]),
    dict(slug="shrek", cat="personajes", nombre="Shrek", desc="Shrek, con o sin flor.", pers=["tamaño"], tam="—",
         fotos=["H/01/028", "H/01/029"]),
    dict(slug="personajes-tiernos", cat="personajes", nombre="Snoopy, Baymax, Sullivan y más",
         desc="Personajes de caricatura súper suaves.", pers=["personaje"], tam="—",
         fotos=["H/01/032", "H/01/024", "H/10/035", "H/10/025", "H/01/034"]),
    dict(slug="stitch", cat="personajes", nombre="Stitch y Angel", desc="La pareja de Lilo & Stitch, también como llaveros.",
         pers=["llavero o amigurumi"], tam="mini", fotos=["C/087/02", "C/087/01", "H/12/004"]),
    dict(slug="pochita", cat="personajes", nombre="Pochita", desc="El perrito motosierra de Chainsaw Man.",
         pers=["tamaño"], tam="6 × 11 cm", fotos=["C/039/01", "C/039/02", "H/10/041"]),
    dict(slug="frailejon-ernesto-perez", cat="personajes", nombre="Frailejón Ernesto Pérez",
         desc="El frailejón más querido de Colombia.", pers=["tamaño"], tam="15 cm",
         fotos=["C/073/01", "C/074/01", "C/075/01", "H/10/032"]),
    dict(slug="totoro", cat="personajes", nombre="Totoro", desc="Totoro súper suave.", pers=["tamaño"], tam="—",
         fotos=["H/10/014"]),

    # ---------------- Amigurumis ----------------
    dict(slug="abejita", cat="amigurumis", nombre="Abejita", desc="Nuestra clásica: suave, redondita y en tres tamaños, hasta gigante.",
         pers=["tamaño: mediana o gigante"], tam="mediana / gigante", destacado=True,
         fotos=["C/078/01", "C/077/02", "C/076/01", "C/089/01", "H/10/028", "C/098/01"]),
    dict(slug="conejito-gigante", cat="amigurumis", nombre="Conejito gigante", desc="Súper suavecito, con o sin ropita.",
         pers=["ropita", "colores"], tam="gigante", fotos=["C/047/02", "C/047/03", "C/047/01", "C/019/05", "C/019/04"]),
    dict(slug="oso-panda", cat="amigurumis", nombre="Oso panda", desc="Oso panda súper suave.", pers=["tamaño"], tam="—",
         fotos=["C/097/01", "C/095/01", "C/099/01"]),
    dict(slug="ranita", cat="amigurumis", nombre="Ranita", desc="Ranita tejida a mano, súper suave.", pers=["colores"], tam="—",
         fotos=["C/123/01", "C/121/01", "H/10/034"]),
    dict(slug="patico", cat="amigurumis", nombre="Patico", desc="Con ropita o sin ropita.", pers=["ropita"], tam="11–15 cm",
         fotos=["C/037/01", "C/037/03", "C/037/02", "H/10/040"]),
    dict(slug="colibri", cat="amigurumis", nombre="Colibrí", desc="En lana suavecita, varios colores.", pers=["colores"], tam="—",
         fotos=["C/036/02", "C/036/01", "H/10/011"]),
    dict(slug="oso-pera", cat="amigurumis", nombre="Osito pera", desc="La combinación perfecta entre un osito y una pera.",
         pers=["colores"], tam="—", fotos=["C/106/01", "C/106/02", "C/106/04"]),
    dict(slug="perrito", cat="amigurumis", nombre="Perrito", desc="Perrito tejido súper tierno.", pers=["colores"], tam="—",
         fotos=["C/031/01", "C/031/02"]),
    dict(slug="tiburon-sushi", cat="amigurumis", nombre="Tiburón sushi", desc="Un tiburón convertido en sushi.", pers=["colores"], tam="—",
         fotos=["C/033/02", "C/033/01", "C/033/03"]),
    dict(slug="fantasma", cat="amigurumis", nombre="Fantasmita", desc="Un fantasmita suave y tierno.", pers=["colores"], tam="—",
         fotos=["C/083/01"]),
    dict(slug="pesebre", cat="amigurumis", nombre="Pesebre / Nacimiento", desc="María, José y el Niño Dios, en caja de regalo.",
         pers=["colores"], tam="María y José 17 cm · Niño Dios 12 cm", fotos=["C/015/03", "C/015/04", "C/013/01", "C/015/08", "H/10/007"]),

    # ---------------- Flores ----------------
    dict(slug="tulipan", cat="flores", nombre="Tulipán individual", desc="Una flor que no se marchita, con tarjeta y dulce.",
         pers=["color"], tam="—",
         precio=dict(valor=12000, texto="$12.000", producto="Tulipán con tarjeta y dulce", fuente="C/067", anio="2023"),
         fotos=["C/067/01", "C/069/01", "C/070/01", "C/067/02"]),
    dict(slug="ramo-de-tulipanes", cat="flores", nombre="Ramo de tulipanes", desc="Ramos de 5 o 6 tulipanes en los colores que quieras.",
         pers=["número de flores", "colores"], tam="5–6 flores", destacado=True,
         fotos=["C/058/01", "H/08/001", "C/071/01", "C/060/01", "H/08/012"]),
    dict(slug="ramo-de-rosas", cat="flores", nombre="Ramo de rosas", desc="Rosas tejidas, solas o combinadas con tulipanes.",
         pers=["número de flores", "colores"], tam="—",
         precio=dict(valor=45000, texto="$45.000", producto="Ramito de 2 rosas y 3 tulipanes (día de la madre)", fuente="C/035", anio="2023"),
         fotos=["H/08/002", "C/035/01", "H/08/003"]),
    dict(slug="ramo-de-girasoles", cat="flores", nombre="Ramo de girasoles", desc="Girasoles solos o con tulipanes y lavandas.",
         pers=["combinación de flores"], tam="—", fotos=["H/08/016", "C/046/01", "H/08/004", "C/048/01", "H/08/014"]),
    dict(slug="ramo-personalizado", cat="flores", nombre="Ramo personalizado", desc="Hasta 16 flores: ramitas, lavandas, girasoles, rosas… tú lo diseñas.",
         pers=["flores", "colores", "tamaño"], tam="hasta 16 flores", fotos=["H/08/005", "C/008/02", "C/059/01", "C/008/01"]),
    dict(slug="maceta-de-tulipanes", cat="flores", nombre="Maceta de tulipanes", desc="Tulipanes en su propia matera tejida.",
         pers=["colores"], tam="—", fotos=["H/08/013"]),

    # ---------------- Ropa ----------------
    dict(slug="blusa-orquidea", cat="ropa", nombre="Blusa Orquídea", desc="Inspirada en las orquídeas colombianas. Edición limitada.",
         pers=["talla"], tam="todas las tallas", destacado=True, fotos=["R/028", "R/013", "R/024", "C/003/01"]),
    dict(slug="camisa-tejida-unisex", cat="ropa", nombre="Camisa tejida unisex", desc="Pieza artesanal única, suave y fresca.",
         pers=["talla", "colores"], tam="todas las tallas",
         fotos=["C/011/03", "C/010/01", "C/011/01", "C/012/01", "C/011/02"]),
    dict(slug="top-mariposa", cat="ropa", nombre="Top mariposa", desc="Top en forma de mariposa, en todas las tallas y colores.",
         pers=["talla", "colores"], tam="todas las tallas", fotos=["C/117/01", "C/040/01", "C/115/01", "C/116/01"]),
    dict(slug="blusa-grannys", cat="ropa", nombre="Blusa grannys", desc="Hecha 100 % a mano con cuadros granny en los colores que elijas.",
         pers=["talla", "colores"], tam="todas las tallas", fotos=["C/023/02", "H/09/012", "H/09/002", "C/023/01", "C/027/01"]),
    dict(slug="top-pentagrama", cat="ropa", nombre="Top pentagrama", desc="Top con cruce de tiras frontal.", pers=["talla", "colores"], tam="todas las tallas",
         fotos=["C/100/01", "C/102/01"]),
    dict(slug="tops-sencillos", cat="ropa", nombre="Tops tejidos", desc="Tops sencillos para combinar con todo; tú eliges el largo.",
         pers=["talla", "colores", "largo"], tam="XS–XL",
         precio=dict(valor=26000, texto="$26.000", producto="Top tejido talla S-M ajustable + clip de cabello (promoción)", fuente="H/03/008", anio="2025"),
         fotos=["C/126/01", "C/130/01", "H/09/013", "H/09/014", "H/03/008"]),
    dict(slug="tops-con-flecos", cat="ropa", nombre="Tops con flecos", desc="Diseños únicos con cuadros y flecos.", pers=["colores"], tam="—",
         fotos=["H/03/001", "H/03/004", "H/03/003"]),
    dict(slug="blusa-de-flor", cat="ropa", nombre="Blusa de flor", desc="Una de nuestras blusas más hermosas.", pers=["colores"], tam="—",
         fotos=["H/03/007", "H/03/006"]),
    dict(slug="gorro", cat="ropa", nombre="Gorro", desc="Súper suave y calientico, en cualquier color y tamaño.", pers=["color", "tamaño"], tam="—",
         fotos=["C/029/03", "C/029/01"]),

    # ---------------- Vestidos de baño ----------------
    dict(slug="vestido-de-bano-girasoles", cat="vestidos-de-bano", nombre="Vestido de baño girasoles", desc="Con apliques de girasol.",
         pers=["talla", "colores"], tam="todas las tallas", fotos=["C/044/01", "H/14/015"]),
    dict(slug="conjunto-fresas", cat="vestidos-de-bano", nombre="Conjunto fresas", desc="Falda, vestido de baño y bucket hat.",
         pers=["talla", "colores", "motivo"], tam="todas las tallas", fotos=["C/042/01"]),
    dict(slug="vestido-de-bano-patricio", cat="vestidos-de-bano", nombre="Vestido de baño Patricio", desc="Inspirado en Patricio Estrella.",
         pers=["talla"], tam="todas las tallas", fotos=["C/054/01", "H/09/015", "H/14/013"]),
    dict(slug="vestidos-de-bano", cat="vestidos-de-bano", nombre="Vestidos de baño", desc="Sencillos o de bronceado, en todas las tallas y colores.",
         pers=["talla", "colores", "motivo"], tam="todas las tallas", fotos=["C/107/01", "C/052/01", "C/053/01", "C/108/01"]),

    # ---------------- Bolsos ----------------
    dict(slug="bolso-veleno", cat="bolsos", nombre="Bolso veleño", desc="Hecho con orgullo veleño para las ferias y el Festival de la Guabina y el Tiple.",
         pers=["motivo", "colores"], tam="—", destacado=True,
         fotos=["C/007/01", "C/005/03", "C/006/01", "C/007/03", "C/005/05"]),
    dict(slug="canguro", cat="bolsos", nombre="Canguro / riñonera", desc="Con forro interno de tela y cremallera.",
         pers=["colores"], tam="—", fotos=["C/009/01", "C/009/03", "C/025/01", "C/025/02"]),
    dict(slug="bolsito-lavanda", cat="bolsos", nombre="Bolsito lavanda", desc="Incluye llaverito.", pers=["colores", "diseño"], tam="—",
         fotos=["C/056/01", "C/056/02"]),
    dict(slug="carga-botellas", cat="bolsos", nombre="Carga botellas", desc="Para llevar tu botella a todas partes.", pers=["colores", "diseño"], tam="—",
         fotos=["C/057/03", "C/057/01"]),
    dict(slug="tote-bags-bordadas", cat="bolsos", nombre="Bolsas de tela bordadas", desc="Tú eliges el diseño.", pers=["diseño"], tam="—",
         fotos=["C/091/01", "C/092/01", "C/093/01", "C/094/01"]),

    # ---------------- Accesorios para mascotas ----------------
    dict(slug="panoletas", cat="accesorios-mascotas", nombre="Pañoletas para mascotas", desc="Colores únicos, patrones a tu gusto.",
         pers=["colores", "talla"], tam="por talla", fotos=["C/018/04", "C/016/02", "C/017/04", "C/018/02", "C/016/06"]),
    dict(slug="collar-navideno", cat="accesorios-mascotas", nombre="Collar navideño", desc="Para que tu peludito también celebre la Navidad.",
         pers=["talla"], tam="por talla", fotos=["C/004/04", "C/004/02", "C/004/07"]),
    dict(slug="gorro-ranita-mascotas", cat="accesorios-mascotas", nombre="Gorro de ranita", desc="Para gatos y perros.",
         pers=["talla"], tam="por talla", fotos=["C/120/01", "C/118/01", "C/118/02"]),

    # ---------------- Llaveros ----------------
    dict(slug="llaveros-frutas-y-flores", cat="llaveros", nombre="Llaveros de frutas y flores", desc="Fresas, cerezas, girasoles y cactus, con cadena y argolla.",
         pers=["motivo"], tam="mini", fotos=["C/041/01", "C/105/01", "H/12/016", "H/12/017", "H/12/008"]),
    dict(slug="mini-amigurumis-llavero", cat="llaveros", nombre="Mini amigurumis llavero", desc="Dinosaurio, pingüino, totoro, conejito y más.",
         pers=["motivo"], tam="mini", fotos=["C/110/01", "H/12/014", "H/12/005", "C/112/01", "C/113/01"]),

    # ---------------- Hogar y navidad ----------------
    dict(slug="luces-de-flores", cat="hogar", nombre="Luces de flores", desc="De 1 o 2 metros; el color de las flores se personaliza.",
         pers=["largo", "color de las flores"], tam="1–2 m", fotos=["C/032/01", "C/032/02", "C/032/03"]),
    dict(slug="portavasos", cat="hogar", nombre="Portavasos", desc="Girasol o corazón, por unidad o en combo de 4.",
         pers=["diseño", "colores"], tam="—", fotos=["C/050/02", "C/051/01", "C/050/01", "C/051/02"]),
    dict(slug="joyero-tulipan", cat="hogar", nombre="Joyero tulipán", desc="También funciona como portavasos.", pers=["colores"], tam="—",
         fotos=["C/049/02", "C/049/01"]),
    dict(slug="planta-colgante", cat="hogar", nombre="Plantica colgante", desc="Para decorar tus espacios.", pers=["—"], tam="—",
         fotos=["C/055/01", "C/055/03"]),
    dict(slug="arbolitos-de-navidad", cat="hogar", nombre="Arbolitos de navidad", desc="Para colgar en tu árbol o regalar como recordatorio.",
         pers=["colores"], tam="—", fotos=["C/014/03", "C/014/05", "C/014/06", "C/014/08"]),
]

# Fotos de ambiente para la marca (portada, "Hecho en Vélez", "sobre mí").
MARCA = {
    # Página "Quién teje": su cara es la marca. Solo fotos donde se la ve bien y sin texto encima.
    # Un elemento puede ser "ref" o ("ref", (x0, y0, x1, y1)) para recortar (fracciones de la imagen);
    # "IA:<categoria>/<producto>" usa la foto principal mejorada con IA (sin texto).
    "quien-teje": ["C/005/02", ("R/013", (0, 0.28, 1, 1)), ("R/031", (0, 0.2, 1, 1))],
    "hecho-en-velez": ["C/005/02", "C/006/01", "C/007/02", "C/064/01", "H/10/001", "C/007/03", "C/005/04"],
    "lifestyle-ropa": ["C/010/02", "C/012/02", "C/009/02", "C/003/01"],
    "cielo-de-velez": ["C/036/02", "C/047/03", "C/030/01", "C/066/01", "C/078/01"],
    "base-grabada": ["IA:personalizados/funko-personalizado", "IA:personalizados/parejas-y-familias",
                     "IA:mascotas/tu-mascota-en-amigurumi", "IA:personalizados/graduados"],
    "proceso-tejiendo": [("R/005", (0, 0.42, 1, 1)), ("R/009", (0, 0.3, 1, 1)), ("R/021", (0, 0.42, 1, 1))],
}


def ruta(ref):
    tipo, a, *b = ref.split("/")
    if tipo == "R":
        return os.path.join(IG, "reels", "fotogramas_blusa-orquidea", f"f_{int(a):03d}.jpg")
    if tipo == "C":
        carpeta = glob.glob(os.path.join(IG, "carruseles", f"{int(a):03d}_*"))[0]
        # Las portadas de vídeo se guardaron como NN_video-portada.jpg
        return (glob.glob(os.path.join(carpeta, f"{int(b[0]):02d}*.jpg")) or [os.path.join(carpeta, "no-existe")])[0]
    return os.path.join(IG, "historias-destacadas", H_ALIAS[a], f"{int(b[0]):03d}.jpg")


def mejoras(ref, w, h):
    """Qué necesita la foto antes de ir a la web. Se revisa a mano al mejorarlas."""
    m = []
    if ref.startswith(("H/", "R/")):
        m.append("revisar-texto")  # las historias suelen tener texto incrustado
    if min(w, h) < 1000:
        m.append("escalar")
    if "video-portada" in ruta(ref):
        m.append("portada-de-video")
    return m


def copiar(ref, destino):
    recorte = None
    if isinstance(ref, tuple):
        ref, recorte = ref
    src = os.path.join(MEJORADAS, ref[3:], "01-principal.jpg") if ref.startswith("IA:") else ruta(ref)
    if not os.path.exists(src):
        raise FileNotFoundError(f"{ref} -> {src}")
    if recorte:
        im = Image.open(src).convert("RGB")
        w, h = im.size
        im.crop((round(recorte[0] * w), round(recorte[1] * h), round(recorte[2] * w), round(recorte[3] * h))).save(destino, quality=92)
    else:
        shutil.copy2(src, destino)
    w, h = Image.open(destino).size
    mej = [] if ref.startswith("IA:") or recorte else mejoras(ref, w, h)
    return dict(origen=os.path.relpath(src, RAIZ), ref=ref, recorte=recorte, ancho=w, alto=h, mejoras=mej)


def main():
    if os.path.isdir(SALIDA):
        shutil.rmtree(SALIDA)
    productos = []
    for p in CATALOGO:
        d = os.path.join(SALIDA, p["cat"], p["slug"])
        os.makedirs(d)
        fotos = []
        for i, ref in enumerate(p["fotos"], 1):
            nombre = f"{i:02d}-principal.jpg" if i == 1 else f"{i:02d}.jpg"
            info = copiar(ref, os.path.join(d, nombre))
            info["archivo"] = os.path.relpath(os.path.join(d, nombre), RAIZ)
            # Versión mejorada con IA (misma ruta bajo mejoradas-ia/), si ya existe
            ia = os.path.join(MEJORADAS, p["cat"], p["slug"], nombre)
            if os.path.exists(ia):
                info["archivo_ia"] = os.path.relpath(ia, RAIZ)
                info["mejoras_hechas"] = ["quitar-texto (Gemini)"]
            fotos.append(info)
        productos.append(dict(
            slug=p["slug"], categoria=p["cat"], categoria_nombre=CATEGORIAS[p["cat"]], nombre=p["nombre"],
            descripcion=p["desc"], personalizacion=p["pers"], tamano=p["tam"], plazo=PLAZO,
            destacado=p.get("destacado", False),
            precio_publicado=p.get("precio"),  # solo lo que ella publicó; confirmar antes de mostrar
            fotos=fotos))
    marca = {}
    for grupo, refs in MARCA.items():
        d = os.path.join(SALIDA, "_marca", grupo)
        os.makedirs(d)
        marca[grupo] = [dict(copiar(r, os.path.join(d, f"{i:02d}.jpg")), archivo=os.path.relpath(os.path.join(d, f"{i:02d}.jpg"), RAIZ))
                        for i, r in enumerate(refs, 1)]
    salida = dict(categorias=CATEGORIAS, productos=productos, marca=marca,
                  nota_precios="Los precios los fija ella. precio_publicado es solo lo que ya publicó; confirmar antes de mostrarlo.")
    with open(os.path.join(RAIZ, "recursos", "catalogo", "catalogo.json"), "w") as f:
        json.dump(salida, f, ensure_ascii=False, indent=2)
    n = sum(len(p["fotos"]) for p in productos)
    print(f"{len(productos)} productos, {n} fotos, {sum(len(v) for v in marca.values())} fotos de marca")


if __name__ == "__main__":
    main()
