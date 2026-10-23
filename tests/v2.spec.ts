import { test, expect } from '@playwright/test';

// Propuesta v2 (/v2/): no se indexa ni entra en el sitemap, y cumple los mismos mínimos que la
// home. Además: la cabecera enlaza a sus propias secciones, la carta de capas compone el correo
// con lo que falta, las escenas corren en escritorio y se quedan en reposo con movimiento
// reducido, y nada se pide a otro origen (la CSP solo permite 'self').
// 'v2/' sin barra inicial por el mismo motivo que en smoke.spec.ts: el baseURL lleva el base path.
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

test('v2 no pide nada a otro origen', async ({ page, baseURL }) => {
  const origen = new URL(baseURL ?? '').origin;
  const ajenas: string[] = [];
  page.on('request', (peticion) => {
    const url = peticion.url();
    if (!url.startsWith(origen) && !url.startsWith('data:')) ajenas.push(url);
  });
  await page.goto(RUTA);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForLoadState('networkidle');
  expect(ajenas).toEqual([]);
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
  const texto = await page.locator('body').innerText();
  expect(texto).not.toMatch(/[—–]|--/);
});

test('las imágenes de v2 cargan', async ({ page }) => {
  await page.goto(RUTA);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForLoadState('networkidle');
  const rotas = await page
    .locator('img')
    .evaluateAll((imgs) =>
      (imgs as HTMLImageElement[])
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.src),
    );
  expect(rotas).toEqual([]);
});

test('la cabecera de v2 enlaza a sus propias secciones', async ({ page }) => {
  await page.goto(RUTA);
  const anclas = await page
    .locator('header a[href^="#"]')
    .evaluateAll((enlaces) => enlaces.map((a) => a.getAttribute('href')));
  expect(anclas.length).toBeGreaterThan(1);
  for (const ancla of anclas) {
    await expect(page.locator(ancla ?? '')).toHaveCount(1);
  }
});

test('la carta de capas cuenta lo que falta y lo pone en el correo', async ({ page }) => {
  await page.goto(RUTA);
  const capa = page.locator('[data-capa="Telefonía móvil"] button');
  await capa.click();
  await expect(capa).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-resumen]')).toHaveText('Te faltan 6 de 7.');

  const href = decodeURIComponent((await page.locator('[data-pedir]').getAttribute('href')) ?? '');
  expect(href).toMatch(/^mailto:/);
  expect(href).toContain('Ya tengo: Telefonía móvil.');
  expect(href).toContain('Me falta: Planes de negocio');
});

test('las escenas corren en escritorio', async ({ page, isMobile }) => {
  test.skip(isMobile, 'En móvil las escenas enseñan su composición final');
  await page.goto(RUTA);
  await expect(page.locator('section.scene.is-live')).toHaveCount(2);
});

test.describe('con movimiento reducido', () => {
  test.use({ reducedMotion: 'reduce' });

  test('las escenas se quedan en su composición final', async ({ page }) => {
    await page.goto(RUTA);
    await expect(page.locator('section.scene.is-rest')).toHaveCount(2);
    await expect(page.locator('section.scene.is-live')).toHaveCount(0);
  });
});

test('el pie de v2 lleva razón social, domicilio y correo', async ({ page }) => {
  await page.goto(RUTA);
  const pie = page.locator('footer');
  await expect(pie).toContainText('MDC Strategic Consulting, S.L.');
  await expect(pie).toContainText('Avda. de Bruselas');
  await expect(pie.locator('a[href^="mailto:"]')).toHaveCount(1);
});
