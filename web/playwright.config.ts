import { defineConfig, devices } from "@playwright/test";

const PUERTO = 3311;

// Pruebas de extremo a extremo.
// - Local, contra la build de producción (next start):  npm run test:e2e
// - Contra la demo desplegada:  E2E_URL=https://... E2E_USUARIO=... E2E_CLAVE=... npx playwright test
const remoto = process.env.E2E_URL;
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: remoto ?? `http://localhost:${PUERTO}`,
    httpCredentials: remoto
      ? { username: process.env.E2E_USUARIO ?? "", password: process.env.E2E_CLAVE ?? "" }
      : undefined,
    locale: "es-CO",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "escritorio", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "movil", use: { ...devices["Pixel 7"] } },
  ],
  webServer: remoto
    ? undefined
    : {
    command: `npx next start -p ${PUERTO}`,
    url: `http://localhost:${PUERTO}`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
