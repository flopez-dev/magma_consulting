---
description: Crea una página nueva en src/pages/ siguiendo el patrón del sitio
argument-hint: <ruta> <título>
---

Argumentos: `$ARGUMENTS` — el primero es la ruta (p. ej. `servicios-ftth`), el resto es el título
de la página (puede tener espacios).

El sitio es una landing de una sola página más las legales, así que una página nueva es la
excepción: pregunta antes si no debería ser una sección de `src/pages/index.astro`. Si de verdad
es una página:

Crea `src/pages/<ruta>.astro`:

- Si es una página de texto (legal o similar), móntala con `<Legal titulo="…" description="…"
  etiqueta="…">` (`src/components/Legal.astro`), como `src/pages/cookies.astro`.
- Si no, envuélvela en `<Base>` (`src/layouts/Base.astro`) con un `title` (el título dado,
  sufijado con ` | Magma Consulting`) y una `description` breve y real en español, con `Header`
  delante y `Footer` después de un `<main id="main">` (el enlace «Ir al contenido» apunta ahí).
  `noindex` solo si la página no debe indexarse.
- Si lleva bloques con `reveal`, añade `<Revelar />` al final.
- Cualquier `href`/`src` interno pasa por `withBase()` (`src/lib/withBase.ts`).
- Sigue la skill `maquetacion`: tokens del `@theme`, `seccion`/`seccion-interior`, eyebrow
  encima de cada `h2`.
- Datos de contacto y del titular desde `src/lib/contacto.ts`, nunca a mano.
- Si debe enlazarse desde el pie, añádela a `legales` en `src/lib/secciones.ts`, y al array
  `PAGES` de `tests/smoke.spec.ts`.

Al terminar, ejecuta `npm run check` y `npm run build` para confirmar que no hay errores.
