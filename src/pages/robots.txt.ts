import type { APIRoute } from 'astro';
import { withBase } from '../lib/withBase';

// Rastreadores que recopilan contenido para entrenar modelos de IA. Los de búsqueda
// con IA (OAI-SearchBot, ChatGPT-User, PerplexityBot) quedan fuera a propósito, para
// que la web pueda citarse como fuente. robots.txt es voluntario: a quien no lo
// respete se le corta desde el panel de Cloudflare (Bot Fight Mode, AI Labyrinth).
const rastreadoresEntrenamientoIA = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'CCBot',
  'Google-Extended',
  'Applebot-Extended',
  'Bytespider',
  'meta-externalagent',
];

/**
 * Generado en build en vez de vivir en public/ porque la URL del sitemap
 * depende de SITE_URL/BASE_PATH, que cambian entre local/CI y Cloudflare
 * (ver astro.config.mjs): un robots.txt estático no podría apuntar al
 * sitemap correcto en los dos a la vez.
 */
export const GET: APIRoute = ({ site }) => {
  // En una copia que no sea el dominio real (preview) cierra el paso entero, no
  // solo a los bots de entrenamiento de IA. Ver el mismo flag en Base.astro.
  if (process.env.NOINDEX_SITE === 'true') {
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const sitemapUrl = new URL(withBase('/sitemap-index.xml'), site);

  const bloqueoIA = rastreadoresEntrenamientoIA.map((bot) => `User-agent: ${bot}`).join('\n');

  const body = `User-agent: *\nAllow: /\n\n${bloqueoIA}\nDisallow: /\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
