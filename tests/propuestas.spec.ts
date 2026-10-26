import { test, expect } from '@playwright/test';

// Propuestas para el cliente (/v2/ y /v3/): no se indexan, no están en el sitemap y cumplen
// los mismos mínimos que la home. En la v3, la escena de partículas del hero con movimiento y
// el hero quieto de la v2 con movimiento reducido.
const PROPUESTAS = ['v2/', 'v3/'];

for (const path of PROPUESTAS) {
  test.describe(`/${path}`, () => {
    test('carga sin errores, con un único h1, sin overflow y con imágenes', async ({ page }) => {
      const errores: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errores.push(msg.text());
      });
      page.on('pageerror', (err) => errores.push(String(err)));

      const respuesta = await page.goto(path);
      expect(respuesta?.ok()).toBeTruthy();
      await expect(page.locator('h1')).toHaveCount(1);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);

      const rotas = await page
        .locator('img')
        .evaluateAll((imgs) =>
          (imgs as HTMLImageElement[])
            .filter((img) => !img.complete || img.naturalWidth === 0)
            .map((img) => img.currentSrc || img.src),
        );
      expect(rotas).toEqual([]);
      expect(errores).toEqual([]);
    });

    test('va noindex, sin canonical y fuera del sitemap', async ({ page, request }) => {
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);

      const sitemap = await (await request.get('sitemap-0.xml')).text();
      expect(sitemap).not.toContain(`/${path}`);
    });

    test('ningún texto lleva «--» ni rayas', async ({ page }) => {
      await page.goto(path);
      const textos = await page.evaluate(() => {
        const trozos: string[] = [document.title];
        const recorrido = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (recorrido.nextNode()) {
          const padre = recorrido.currentNode.parentElement?.tagName;
          if (padre === 'SCRIPT' || padre === 'STYLE') continue;
          trozos.push(recorrido.currentNode.textContent ?? '');
        }
        document
          .querySelectorAll('[alt], [aria-label]')
          .forEach((e) =>
            trozos.push(e.getAttribute('alt') ?? '', e.getAttribute('aria-label') ?? ''),
          );
        return trozos.join(' ');
      });
      expect(textos).not.toMatch(/--|—|–/);
    });

    test('el menú sigue el orden de la página y sus anclas son locales', async ({
      page,
      isMobile,
    }) => {
      await page.goto(path);
      if (isMobile) await page.locator('[data-nav-toggle]').click();
      const enlaces = await page
        .locator('#nav a')
        .evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      expect(enlaces).toEqual(['#credenciales', '#servicios', '#nosotras', '#contacto']);
    });

    test('cada fase de servicios abre el correo con su asunto', async ({ page }) => {
      await page.goto(path);
      const asuntos = await page
        .locator('#servicios a[href^="mailto:"]')
        .evaluateAll((as) =>
          as.map((a) => new URL(a.getAttribute('href') ?? '').searchParams.get('subject')),
        );
      expect(asuntos).toEqual([
        'Consulta sobre la fase «Lanzar»',
        'Consulta sobre la fase «Conectar»',
        'Consulta sobre la fase «Operar»',
      ]);
    });
  });
}

test('el vídeo de la v2 se puede pausar y en móvil no se descarga', async ({ page, isMobile }) => {
  await page.goto('v2/');
  const boton = page.locator('[data-hero-pausa]');
  if (isMobile) {
    await expect(boton).toBeHidden();
    await expect(page.locator('[data-hero-video] source')).toHaveCount(0);
    return;
  }
  await expect(boton).toBeVisible();
  await expect(boton).toHaveAccessibleName('Pausar el vídeo de fondo');
  await boton.click();
  await expect(boton).toHaveAccessibleName('Reanudar el vídeo de fondo');
  expect(await page.locator('[data-hero-video]').evaluate((v: HTMLVideoElement) => v.paused)).toBe(
    true,
  );
});

test('la v3 forma la imagen con el scroll y el vídeo toma el relevo', async ({ page }) => {
  await page.goto('v3/');
  const seccion = page.locator('#hero');
  await expect(seccion).toHaveAttribute('data-escena', 'viva');
  await expect(page.locator('[data-particulas]')).toBeVisible();

  // El hero es más alto que la pantalla: es el tramo que se recorre con el escenario fijo.
  const { altoHero, altoPantalla } = await page.evaluate(() => ({
    altoHero: document.getElementById('hero')?.offsetHeight ?? 0,
    altoPantalla: window.innerHeight,
  }));
  expect(altoHero).toBeGreaterThan(altoPantalla * 1.8);

  // Al principio solo hay puntos; al final del tramo, el vídeo a su opacidad de siempre.
  const opacidadVideo = () =>
    page
      .locator('[data-hero-video]')
      .evaluate((v) => Number(getComputedStyle(v).opacity).toFixed(2));
  expect(await opacidadVideo()).toBe('0.00');
  await page.evaluate((y) => window.scrollTo(0, y), altoHero - altoPantalla);
  await expect.poll(opacidadVideo).toBe('0.40');
  await expect(page.locator('[data-particulas]')).toHaveCSS('opacity', '0');
});

test.describe('con movimiento reducido', () => {
  test.use({ reducedMotion: 'reduce' });

  test('la v3 no monta la escena y el hero queda como el de la v2', async ({ page }) => {
    await page.goto('v3/');
    await expect(page.locator('#hero')).not.toHaveAttribute('data-escena', 'viva');
    await expect(page.locator('[data-particulas]')).toBeHidden();
    await expect(page.locator('.hero-recorrido')).toHaveCSS('height', '0px');
    await expect(page.locator('[data-hero-video]')).toHaveCSS('opacity', '0.4');
  });
});

for (const path of PROPUESTAS) {
  test(`el índice de fases de /${path} lleva a cada fase y sustituye a la tira de fotos`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(page.locator('.tira-foto')).toHaveCount(0);

    const indice = page.locator('#servicios ul a[href^="#fase-"]');
    const destinos = await indice.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(destinos).toEqual(['#fase-lanzar', '#fase-conectar', '#fase-operar']);
    for (const destino of destinos) await expect(page.locator(destino ?? '')).toHaveCount(1);

    await indice.nth(1).click();
    await expect(page).toHaveURL(/#fase-conectar$/);
    await expect(page.locator('#fase-conectar')).toBeInViewport();
  });
}
