import { test, expect } from '@playwright/test';

// Propuesta v2 (/v2/): no se indexa ni entra en el sitemap, y cumple los mismos mínimos que la
// home: un único h1, sin errores de consola, sin overflow, sin rayas en el texto y con las
// imágenes cargadas. El pie propio de la v2 tiene razón social y correo.
// '' (no '/') por el mismo motivo que en smoke.spec.ts: el baseURL ya lleva el base path.
const RUTA = 'v2/';

test('v2 carga sin errores, con un único h1 y sin overflow horizontal', async ({ page }) => {
  const errores: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errores.push(msg.text());
  });
  page.on('pageerror', (err) => errores.push(String(err)));

  const respuesta = await page.goto(RUTA);
  expect(respuesta?.ok()).toBeTruthy();

  await expect(page.locator('h1')).toHaveCount(1);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);

  expect(errores).toEqual([]);
});

test('v2 es noindex y no declara canonical', async ({ page }) => {
  await page.goto(RUTA);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test('v2 no aparece en el sitemap', async ({ request }) => {
  const indice = await request.get('sitemap-index.xml');
  expect(indice.ok()).toBeTruthy();
  const sitemap = await request.get(
    (await indice.text()).match(/<loc>([^<]+sitemap-0\.xml)<\/loc>/)?.[1] ?? 'sitemap-0.xml',
  );
  expect(await sitemap.text()).not.toContain('/v2/');
});

test('v2 no usa rayas ni dobles guiones en el texto visible', async ({ page }) => {
  await page.goto(RUTA);
  const texto = await page.locator('main').innerText();
  expect(texto).not.toMatch(/[—–]|--/);
});

test('las imágenes de v2 cargan', async ({ page }) => {
  await page.goto(RUTA);
  const rotas = await page
    .locator('img')
    .evaluateAll((imgs) =>
      (imgs as HTMLImageElement[])
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.src),
    );
  expect(rotas).toEqual([]);
});

test('el selector de fase muestra una sola fase a la vez y mantiene el correo con asunto', async ({
  page,
}) => {
  await page.goto(RUTA);
  const fases = page.locator('.v2-fase');
  await expect(fases).toHaveCount(3);

  await page.getByRole('button', { name: 'Conectar' }).click();
  await expect(page.getByRole('button', { name: 'Conectar' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('.v2-fase:not([data-oculta])')).toHaveCount(1);
  await expect(page.locator('.v2-fase:not([data-oculta])')).toContainText('Servicios de FTTH');

  await expect(page.locator('.v2-escribir')).toHaveAttribute('href', /subject=/);
});

test('el pie de v2 lleva razón social, domicilio y correo', async ({ page }) => {
  await page.goto(RUTA);
  const pie = page.locator('footer');
  await expect(pie).toContainText('MDC Strategic Consulting, S.L.');
  await expect(pie).toContainText('Avda. de Bruselas');
  await expect(pie.locator('a[href^="mailto:"]')).toHaveCount(1);
});
