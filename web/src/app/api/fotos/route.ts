import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { exigirAdminCompleto } from "@/lib/admin";
import { RUTA_FOTO } from "@/lib/fotos";

// Autoriza las subidas de fotos desde el navegador a Vercel Blob (el archivo no pasa por aquí).
// Solo administradores, solo WebP/JPEG y solo en la carpeta del producto.
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const respuesta = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        await exigirAdminCompleto();
        if (!RUTA_FOTO.test(pathname)) throw new Error("Ruta no válida");
        return { allowedContentTypes: ["image/webp", "image/jpeg"], maximumSizeInBytes: 4 * 1024 * 1024, addRandomSuffix: false, allowOverwrite: false };
      },
    });
    return NextResponse.json(respuesta);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 400 });
  }
}
