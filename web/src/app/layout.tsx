import type { Metadata, Viewport } from "next";
import { Figtree, Gloock } from "next/font/google";
import { Cabecera } from "@/components/Cabecera";
import { Pie } from "@/components/Pie";
import { AvisoAgenda } from "@/components/AvisoAgenda";
import { esDemo } from "@/lib/config";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// "optional": si la fuente de títulos no llega a tiempo en la primera visita, se usa la de respaldo
// y no se repinta el titular (mejor LCP en redes lentas); en la siguiente visita ya está en caché.
const gloock = Gloock({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "optional" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-texto", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Magic H4nds · Amigurumis y tejidos a mano en Vélez, Santander",
    template: "%s · Magic H4nds",
  },
  description:
    "Amigurumis personalizados, flores que no se marchitan, ropa y accesorios tejidos a mano en Vélez, Santander. Bajo pedido y con envíos a todo Colombia.",
  // La demo no se indexa: es una propuesta privada (docs/07-plan-demo.md).
  robots: esDemo ? { index: false, follow: false } : undefined,
  // La imagen para compartir es app/opengraph-image.jpg (scripts/og_imagen.py).
  openGraph: {
    title: "Magic H4nds · Tejido a mano en Vélez, Santander",
    description:
      "Lo que imaginas, tejido punto por punto: amigurumis personalizados, flores que no se marchitan y ropa tejida a mano. Encárgalo por WhatsApp.",
    siteName: "Magic H4nds",
    locale: "es_CO",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0e0c0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CO" className={`${gloock.variable} ${figtree.variable}`}>
      <body>
        <a className="saltar" href="#contenido">
          Saltar al contenido
        </a>
        <AvisoAgenda />
        <Cabecera />
        <main id="contenido">{children}</main>
        <Pie />
        <Analytics />
      </body>
    </html>
  );
}
