import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Las páginas del catálogo se generan en el build y se sirven desde los assets estáticos.
// Cuando haya panel con datos que cambian, se pasa a la caché incremental en R2.
export default defineCloudflareConfig({
	incrementalCache: staticAssetsIncrementalCache,
	enableCacheInterception: true,
});
