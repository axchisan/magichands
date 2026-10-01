import type { MetadataRoute } from "next";
import { esDemo } from "@/lib/config";

// La demo es privada: no se indexa (docs/07-plan-demo.md).
export default function robots(): MetadataRoute.Robots {
  return esDemo ? { rules: { userAgent: "*", disallow: "/" } } : { rules: { userAgent: "*", allow: "/" } };
}
