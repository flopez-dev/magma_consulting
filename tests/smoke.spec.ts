import { test, expect } from '@playwright/test';

// Batería mínima de lo que se comprobó a mano al migrar la landing: un único h1, sin errores
// de consola ni overflow horizontal, el menú móvil, el enlace «Ir al contenido», los
// landmarks, los invariantes de SEO y la 404.
// '' (no '/') para la home: con un baseURL que acaba en `/magma_consulting/`, un path que
// empiece por '/' resuelve contra el origen y se sale del base path.
const PAGES = ['', 'aviso-legal/', 'privacidad/', 'cookies/'];

for (const path of PAGES) {
  test.describe(`${path || '/'}`, () => {
    test('carga sin errores, con un único h1 y sin overflow horizontal', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(String(err)));

      const response = await page.goto(path);
      expect(response?.ok()).toBeTruthy();

      await expect(page.locator('h1')).toHaveCount(1);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);

      expect(errors).toEqual([]);
    });

    test('el menú móvil abre, cierra y Escape devuelve el foco al botón', async ({
      page,
      isMobile,
    }) => {
      test.skip(!isMobile, 'El botón de menú solo es visible en viewports móviles');

      await page.goto(path);
      const toggle = page.locator('[data-nav-toggle]');
      const nav = page.locator('#nav');

      await expect(nav).toBeHidden();
      await toggle.click();
      await expect(nav).toBeVisible();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(toggle).toHaveAccessibleName('Cerrar menú');

      await page.keyboard.press('Escape');
      await expect(nav).toBeHidden();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(toggle).toBeFocused();

      // Objetivo táctil de al menos 44 px (WCAG 2.2, 2.5.8 pide 24 como mínimo).
      const caja = await toggle.boundingBox();
      expect(caja?.width).toBeGreaterThanOrEqual(44);
      expect(caja?.height).toBeGreaterThanOrEqual(44);
    });

    test('el primer Tab enfoca «Ir al contenido» y lleva al <main>', async ({ page }) => {
      await page.goto(path);

      await page.keyboard.press('Tab');
      const salto = page.getByRole('link', { name: 'Ir al contenido' });
      await expect(salto).toBeFocused();
      await expect(salto).toBeInViewport();
      await expect(salto).toHaveAttribute('href', '#main');
      await expect(page.locator('main#main')).toHaveCount(1);
    });

    test('landmarks: un <main>, un <footer> fuera de él y navegaciones con nombre', async ({
      page,
    }) => {
      await page.goto(path);

      await expect(page.locator('main')).toHaveCount(1);
      // El pie es el landmark contentinfo solo si no cuelga de <main> ni de una sección.
      await expect(page.locator('body > footer')).toHaveCount(1);
      await expect(page.locator('main footer')).toHaveCount(0);

      const sinNombre = await page
        .locator('nav')
        .evaluateAll(
          (navs) =>
            navs.filter((n) => !n.getAttribute('aria-label') && !n.getAttribute('aria-labelledby'))
              .length,
        );
      expect(sinNombre).toBe(0);
    });

    // Lo que no debe llegar nunca a producción: marcadores sin rellenar y los guiones
    // largos o dobles que delatan un texto sin revisar. Se mira el texto visible y el de
    // los desplegables, no los scripts ni los estilos.
    test('el texto no lleva marcadores [ ] ni «--» ni rayas largas', async ({ page }) => {
      await page.goto(path);

      const texto = await page.evaluate(() => {
        const trozos: string[] = [];
        const recorrido = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (recorrido.nextNode()) {
          const nodo = recorrido.currentNode;
          const padre = nodo.parentElement?.tagName;
          if (padre === 'SCRIPT' || padre === 'STYLE' || padre === 'NOSCRIPT') continue;
          trozos.push(nodo.textContent ?? '');
        }
        return trozos.join(' ');
      });

      expect(texto).not.toMatch(/\[[A-Z_]{4,}\]|REPLACE_WITH/);
      expect(texto).not.toMatch(/--|—/);
    });

    test('SEO: un canonical absoluto en el dominio, JSON-LD válido y robots coherente', async ({
      page,
    }) => {
      await page.goto(path);

      const canonicales = await page
        .locator('link[rel="canonical"]')
        .evaluateAll((l) => l.map((e) => e.getAttribute('href') ?? ''));
      expect(canonicales).toHaveLength(1);
      expect(canonicales[0]).toMatch(/^https:\/\/magma-consulting\.com\//);

      // Todos los bloques JSON-LD tienen que parsear y declarar su contexto.
      const bloques = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((b) => b.map((e) => e.textContent ?? ''));
      for (const bloque of bloques) {
        const datos = JSON.parse(bloque);
        expect(JSON.stringify(datos)).toContain('schema.org');
      }

      // Un build con NOINDEX_SITE=true (una preview) bloquea todo; el de producción solo
      // la 404. CI construye sin la variable.
      test.skip(process.env.NOINDEX_SITE === 'true', 'Build con NOINDEX_SITE: todo va noindex');
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    });

    test('las imágenes cargan', async ({ page }) => {
      await page.goto(path);

      const rotas = await page
        .locator('img')
        .evaluateAll((imgs) =>
          (imgs as HTMLImageElement[])
            .filter((img) => !img.complete || img.naturalWidth === 0)
            .map((img) => img.currentSrc || img.src),
        );
      expect(rotas).toEqual([]);
    });
  });
}

test('el JSON-LD de la home declara los siete servicios y las dos socias', async ({ page }) => {
  await page.goto('');
  const datos = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ?? '',
  );
  expect(datos['@type']).toBe('ProfessionalService');
  expect(datos.hasOfferCatalog.itemListElement).toHaveLength(7);
  expect(datos.founder).toHaveLength(2);
  await expect(page.locator('#servicios article')).toHaveCount(7);
  await expect(page.locator('#nosotras article')).toHaveCount(2);
});

test('el «Ver más» de cada socia despliega su trayectoria', async ({ page }) => {
  await page.goto('');
  const detalle = page.locator('#nosotras details').first();
  await detalle.scrollIntoViewIfNeeded();
  await expect(detalle.locator('p')).toBeHidden();
  await detalle.locator('summary').click();
  await expect(detalle.locator('p')).toBeVisible();
});

test('los enlaces externos abren en pestaña nueva y lo anuncian', async ({ page }) => {
  await page.goto('');
  const externos = page.locator('a[href^="https://"]');
  expect(await externos.count()).toBeGreaterThan(0);
  for (const enlace of await externos.all()) {
    await expect(enlace).toHaveAttribute('target', '_blank');
    await expect(enlace).toHaveAttribute('rel', /noopener/);
    await expect(enlace).toContainText('(se abre en una pestaña nueva)');
  }
});

// Las páginas legales comparten cabecera y pie con la home: el logo lleva a la home y el
// menú a sus secciones.
for (const path of ['aviso-legal/', 'privacidad/', 'cookies/']) {
  test(`${path} enlaza a la home y a sus secciones`, async ({ page }) => {
    await page.goto(path);

    const base = new URL(page.url()).pathname.replace(path, '');
    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((enlaces) => enlaces.map((a) => a.getAttribute('href') ?? ''));

    expect(hrefs).toContain(base);
    expect(hrefs).toContain(`${base}#servicios`);
    expect(hrefs).toContain(`${base}#contacto`);
    await expect(page.locator(`footer a[href="${base}${path}"]`)).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
}

// Una ruta que no existe sirve la 404 (con su estado HTTP) y ofrece volver al inicio. Sin
// comprobar la consola: el propio 404 se registra como error.
test('una ruta inexistente muestra la 404, con noindex y sin canonical', async ({ page }) => {
  const response = await page.goto('ruta-que-no-existe/');
  expect(response?.status()).toBe(404);

  await expect(page.locator('h1')).toHaveText('Página no encontrada');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', /\/$/);
});

// `robots.txt` lo genera una ruta de Astro según el entorno de build. En producción deja
// pasar a los buscadores y bloquea a los rastreadores de entrenamiento de IA; en la copia
// con NOINDEX_SITE=true (una preview) lo cierra todo.
test('robots.txt coincide con el entorno de build', async ({ request }) => {
  const respuesta = await request.get('robots.txt');
  expect(respuesta.ok()).toBeTruthy();
  const cuerpo = await respuesta.text();

  if (process.env.NOINDEX_SITE === 'true') {
    expect(cuerpo).toBe('User-agent: *\nDisallow: /\n');
  } else {
    expect(cuerpo).toContain('Allow: /');
    expect(cuerpo).toContain('User-agent: GPTBot');
    expect(cuerpo).toMatch(/Sitemap: https:\/\/.+\/sitemap-index\.xml/);
  }
});
