import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las fotos se pregeneran en WebP (scripts/exportar_web.py) a estos anchos exactos;
    // el cargador solo elige el archivo, no hay optimización en tiempo de ejecución.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [480, 960, 1440],
    imageSizes: [240],
    qualities: [78],
  },
  poweredByHeader: false,
};

export default nextConfig;

import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
