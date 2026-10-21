import { defineConfig, devices } from '@playwright/test';

// Mismo base path que usa CI (`.github/workflows/ci.yml`) — es el que de
// verdad ejercita withBase() en los enlaces internos. Es también el default
// de astro.config.mjs cuando BASE_PATH no está definida.
const BASE_PATH = process.env.BASE_PATH ?? '/magma_consulting/';
const PORT = 4321;

// Sin `webServer`: `astro preview` en esta versión se demoniza siempre (se
// separa a segundo plano incluso sin --background), y Playwright trata la
// salida inmediata del proceso padre como un fallo ("exited early") aunque
// el servidor real siga sirviendo. El script `npm run test:e2e` orquesta
// build → preview --background → tests → preview stop a mano; no ejecutar
// `playwright test` suelto sin haber levantado el preview antes.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}${BASE_PATH}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
