// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// El default es un base path que no es la raíz (/magma_consulting/), para que
// `npm run dev`, el CI y los tests ejerciten withBase() en cada enlace interno.
// El workflow de Cloudflare lo sustituye por el real: SITE_URL=<dominio>
// BASE_PATH=/
const site = process.env.SITE_URL ?? 'https://magma-consulting.com';
const base = process.env.BASE_PATH ?? '/magma_consulting/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },

  // Las propuestas para el cliente (/v2/, /v3/) son noindex y no entran en el sitemap.
  integrations: [sitemap({ filter: (pagina) => !/\/v[23]\//.test(pagina) })],

  vite: { plugins: [tailwindcss()] },
});
