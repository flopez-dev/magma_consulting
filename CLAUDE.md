# Magma Consulting

Web estática del cliente Magma Consulting (MDC Strategic Consulting, S.L.), consultoría de
telecomunicaciones para operadores locales. Astro 7 + Tailwind v4, TypeScript strict. La home
(`/`) es la landing del negocio; además hay tres páginas legales (`/aviso-legal/`,
`/privacidad/`, `/cookies/`) y la 404.

Viene de `portfolio/projects/magma_consulting/` (HTML, CSS y JS a mano), migrada con la misma
estructura que `clinica_conecta` y `chantal_verdugo_house` y con paridad visual: misma altura de
la home a 1440/820/390 px. Diferencias a propósito con el original: el botón «Contacto» del
menú lleva relleno lateral, los eyebrows de las secciones oscuras salen en `teal-light` (en el
original una regla en cascada los dejaba blancos) y la cabecera de las páginas legales deja
sitio a la cabecera fija.

## Comandos

| Comando               | Acción                                                                |
| :-------------------- | :-------------------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo en `localhost:4321` (arráncalo en background) |
| `npm run build`        | Build de producción en `./dist/`                                     |
| `npm run preview`      | Sirve localmente el build de producción                              |
| `npm run check`        | Comprueba tipos con `astro check`                                     |
| `npm run format`       | Formatea el repo con Prettier (`--write`)                            |
| `npm run format:check` | Comprueba formato sin escribir — es lo que corre en CI                |
| `npm run lint`         | ESLint sobre `.astro`/`.ts`                                           |
| `npm run test:e2e`     | Smoke tests de Playwright (`tests/smoke.spec.ts`)                     |

## Estructura

- `src/pages/` — `index.astro` (home), `aviso-legal.astro`, `privacidad.astro`,
  `cookies.astro`, `404.astro` y `robots.txt.ts` (dinámico, ver más abajo).
- `src/layouts/Base.astro` — layout único; toda página lo envuelve. Pone `html.js`, el `<head>`
  (canonical, Open Graph, favicons, precarga de Raleway) y el enlace «Ir al contenido», que
  apunta al `<main id="main">`: toda página nueva tiene que poner ese `id` en su `<main>`.
- `src/components/`, una sección por componente con los **mismos ids de ancla** que el HTML
  original (`#hero`, `#servicios`, `#credenciales`, `#nosotras`, `#valores`, `#contacto`):
  - `Header.astro` — cabecera fija, transparente sobre el hero; al pasar de 40 px de scroll el
    script le pone `data-scrolled` y se rellena de `carbon`. Menú móvil por debajo de 780 px
    (Escape cierra y devuelve el foco, el Tab da la vuelta dentro) y scroll suave a las anclas
    descontando la cabecera. En la home los enlaces son `#ancla`; en el resto,
    `withBase('/#ancla')`. El menú es Servicios, Trayectoria (`#credenciales`), Nosotras y
    Contacto (`src/lib/secciones.ts`); Valores no está a propósito. En la home, un
    IntersectionObserver marca con `aria-current` el enlace de la sección que ocupa el centro.
  - `Hero.astro` — vídeo de fondo (`public/img/hero-bg.webm|mp4` + poster, precargado en
    `index.astro`). El script lo pausa con movimiento reducido (también si la preferencia
    cambia en vivo) y cuando sale de pantalla. CTA principal a `#contacto`; la franja de abajo
    enseña los OMV de referencia (las cifras ya están en la entradilla). El comentario del componente documenta su
    procedencia y licencia (Pexels): mantenlo junto al asset.
  - `Servicios.astro` (datos en `src/lib/servicios.ts`), `TiraFotos.astro`,
    `Credenciales.astro`, `Nosotras.astro` (datos en `src/lib/equipo.ts`), `Valores.astro`,
    `Contacto.astro`.
  - `Footer.astro` — pie con anclas, LinkedIn, año (lo actualiza un script) y enlaces legales
    con `aria-current` en la página actual. Se monta fuera de `<main>`.
  - `Legal.astro` — monta las páginas legales: `Header`, franja oscura con el `h1`, el texto en
    el slot (`.legal-contenido`) y `Footer`.
  - `Boton.astro`, `Icono.astro`, `Revelar.astro` (reveal-al-scroll de `.reveal`; sin JS o con
    movimiento reducido todo queda visible).
- `src/lib/` — `sitio.ts` (nombre, título, descripciones, alt de la imagen OG), `contacto.ts`
  (correo, LinkedIn y los datos del titular que usan las páginas legales), `secciones.ts`
  (anclas del menú y del pie, rutas legales), `servicios.ts`, `equipo.ts`, `iconos.ts`,
  `jsonld.ts` (un `@graph` con el `ProfessionalService`, con `address`, `vatID`, catálogo y
  socias, y el `WebSite`; se genera desde `contacto.ts`, `servicios.ts` y `equipo.ts`, así que no
  puede divergir de la página visible) y `withBase.ts`. `contacto.ts` tiene `mailtoHref` (a
  secas, para las legales) y `mailtoConsultaHref` (con asunto, para la sección de contacto).
- `src/styles/global.css` — `@font-face`, tokens de Tailwind v4 (`@theme`), capa `base` y capa
  `components` (secciones, eyebrow, reveal, barras del menú, duotono de la tira de fotos,
  retratos en gris, `<details>` de «Ver más», texto legal). Un único fichero; no crear otros
  `.css`.
- `src/fonts/` — `raleway.woff2` y `dm-sans.woff2` (variables, subconjunto latino) con sus
  licencias OFL. Viven en `src/` y no en `public/` para que Vite reescriba su URL con el base
  path.
- `public/img/` — logo (`logo.svg`, `logo-mark-512.png` para el JSON-LD), favicons, `og.jpg`,
  vídeo del hero, `servicios/` y `equipo/` (JPG + WebP). Las fotos de servicios y de las socias
  son las que ya publicaba la empresa y están marcadas para sustituir por fotografía propia.
- `public/_headers` — CSP, HSTS y caché (`/_astro/*` inmutable; `/img/*` una semana, no
  llevan hash). `public/_redirects` — URLs de la web anterior en WordPress → sus equivalentes.
  `public/.well-known/security.txt` — su `Expires` caduca el 2027-10-20 y hay que renovarlo.
- `tests/smoke.spec.ts` — en `/` y las tres legales: un `h1`, sin errores de consola ni overflow,
  menú móvil, «Ir al contenido», landmarks, sin marcadores `[ ]` ni «--» ni rayas (en el texto,
  title, metas, alt, aria-label, JSON-LD y `content` de los «Ver más»), canonical en
  `magma-consulting.com`, JSON-LD que parsea, sin `noindex`, imágenes cargadas. Además: el
  `@graph` (dirección, 7 servicios con `provider`, 2 socias, WebSite), «Ver más», enlaces
  externos en pestaña nueva, sección activa en el menú, mailto con asunto, legales → home, 404
  y `robots.txt`.

## Reglas no obvias

- **CSP en `public/_headers`: solo `'self'`.** Es lo que hace cumplir lo que afirman
  `/privacidad/` y `/cookies/` (sin terceros, sin cookies, sin formularios: `form-action
  'none'`). Si se añade un recurso externo (fuentes, analítica, mapas, vídeo incrustado) o un
  formulario, ampliar la CSP y reescribir esas dos páginas. `script-src` lleva
  `'unsafe-inline'` porque Astro incrusta scripts con hash cambiante y el JSON-LD va inline.
- **`robots.txt.ts` bloquea a los rastreadores de entrenamiento de IA** (GPTBot, ClaudeBot,
  CCBot, Google-Extended…) pero deja pasar a los de búsqueda con IA, igual que en
  `clinica_conecta`.
- **`withBase()` en todo `href`/`src` interno escrito a mano** (`src/lib/withBase.ts`). Astro
  solo antepone `base` a los assets que empaqueta; un `href="/privacidad/"` a pelo se rompe en
  el build de CI, que va bajo `/magma_consulting/`.
- Toda página se envuelve en `<Base title="…" description="…">`. `noindex` solo lo lleva
  `404.astro` (y entonces no declara canonical). El sitemap (`@astrojs/sitemap`) deja fuera la
  404 por su cuenta.
- **`NOINDEX_SITE=true` bloquea la indexación de todo el sitio** (`noindex, nofollow` en cada
  página y `Disallow: /` en `robots.txt`). Hoy no lo pone ningún workflow; se conserva por si se
  publica una copia que no sea el dominio real.
- Tailwind v4 **sin** `tailwind.config.js`: los tokens viven en `@theme`. Paleta «estratos»:
  `teal` (único color de marca, del logo; nunca en cuerpo de texto), `teal-deep` (enlaces y
  texto teal sobre blanco), `teal-light` (teal sobre oscuro), `carbon`, `carbon-soft`, `mist`,
  `mist-deep`, `ink`, `ink-soft`. Tipografía: `font-display` (Raleway) para títulos, menú y
  botones; `font-sans` (DM Sans) para el cuerpo. Ver la skill `maquetacion`.
- `trailingSlash: 'always'` + `build.format: 'directory'`: los enlaces internos llevan barra
  final.
- **Tipografías autoalojadas, nunca `<link>` a Google Fonts.**
- **Media con licencia que lo permita.** El texto y las fotos de la web anterior son del
  cliente; el vídeo del hero es de Pexels (uso comercial libre). Cualquier stock nuevo necesita
  una licencia que permita explícitamente su uso comercial, anotada junto al asset.
- El sitio es `lang="es"`: copy, comentarios de código y mensajes de commit en español.
- **Nada de «--» ni rayas (—, –) en ningún texto que llegue al usuario**, incluidos metas, alt y
  `content:` de CSS: delatan un texto escrito a máquina. El «Ver más» dibuja su +/− con
  gradientes por eso. Lo comprueba un test. Evitar también los dos puntos encadenados y las
  tríadas de adjetivos en el texto propio.
- **Movimiento**: todo lo que se mueve va detrás de `prefers-reduced-motion: no-preference`
  (los cambios de color, como el de los retratos, no cuentan y se aplican siempre). Lo que
  anima: reveal al hacer scroll (escalonado con `--i` en Valores), menú móvil (opacidad y 8 px,
  `@starting-style`), «Ver más» (`::details-content` + `interpolate-size`), cabecera al hacer
  scroll, hover de botones y fotos (solo con `hover: hover`), indicador de scroll (3 veces).
  Descartado a propósito: entrada animada del hero (retrasaría el LCP), contadores, parallax.
- Prettier ordena las clases de Tailwind (`prettier-plugin-tailwindcss`) — no reordenarlas a
  mano. Los textos con un enlace o un `<span>` en medio necesitan `{' '}` explícito donde Prettier
  parte la línea (ver el pie y `/privacidad/`), o las palabras se pegan.

## Ramas y despliegue

| Rama                   | Destino                                                       |
| :--------------------- | :------------------------------------------------------------ |
| `main`                 | Cloudflare Workers, en `magma-consulting.com`, bajo `/`        |
| `develop` y otras / PR | Solo CI (formato, lint, tipos, build, tests); no se publican  |

El repositorio es **privado** y no hay GitHub Pages: la única copia pública es la de producción.
`astro.config.mjs` lee `SITE_URL`/`BASE_PATH` de variables de entorno; cada workflow pasa las
suyas. `.github/dependabot.yml` abre cada semana PR de dependencias y de acciones **contra
`develop`** (no contra `main`, que se despliega directo a producción). `.nvmrc` fija Node 22, la
misma línea que usa el CI. `allowScripts` de `package.json` fija la versión exacta de `workerd`:
al subir wrangler, actualizarla o su `postinstall` queda bloqueado.

`portfolio` sigue publicando su propia copia de la landing (con `noindex`) como pieza de
portfolio; su `wrangler.jsonc.disabled` no despliega nada. El Worker `magma-consulting` solo se
despliega desde este repo.

## Estado conocido (no son bugs)

- `deploy-cloudflare.yml` necesita los secretos `CLOUDFLARE_API_TOKEN_MAGMA_CONSULTING` (ojo: no
  se llama `CLOUDFLARE_API_TOKEN`) y `CLOUDFLARE_ACCOUNT_ID` en GitHub. Si el último paso falla,
  mira primero los secretos y los permisos del token.
- **El dominio todavía no está en Cloudflare** (octubre de 2026: DNS en Arsys, apex en el
  WordPress). La zona tiene que darse de alta en la misma cuenta antes del primer deploy, sin
  perder los registros de Microsoft 365 (MX, SPF, `MS=…`, `autodiscover`). Pasos en `README.md`.
- **Bot Fight Mode / JavaScript Detections de Cloudflare tiene que estar desactivado.** Si no,
  Cloudflare crea la cookie `cf_clearance` y `/cookies/` deja de ser cierta. Se comprueba con un
  navegador real, no con `curl`.
- `workers_dev` y `preview_urls` están en `false`: la web solo se sirve en el dominio propio
  (apex y `www`; el canonical es el apex).
- `/privacidad/` nombra como encargados a Cloudflare (alojamiento: IP de quien visita) y a
  Microsoft 365 (buzón de `info@`), con su transferencia a EE. UU. Si cambia el alojamiento, el
  proveedor de correo o se añade cualquier tratamiento nuevo, hay que actualizarla y cambiar su
  constante `actualizado`.
- El copy de la home sigue el documento de cambios del cliente de octubre de 2026: «Trayectoria»
  es solo texto (sin las cifras grandes) y las socias no llevan cargo, ni en la página ni en el
  JSON-LD. No los repongas. Los textos que vienen de ese documento (entradilla del hero, h2 de
  Servicios, Servicios para empresas, los dos párrafos de Trayectoria, textos de Contacto) solo
  admiten correcciones ortográficas sin consultar al cliente.
- `www` se sirve desde el Worker pero tiene que redirigir al apex con una Redirect Rule del
  panel de Cloudflare (`_redirects` no puede cambiar de dominio). Ver `README.md`.
- No hay formulario de contacto a propósito: el contacto es un `mailto:`. El comentario de
  `Contacto.astro` recoge qué habría que tocar si se añade uno.

## Antes de dar algo por terminado

Ejecuta `/verificar`, o manualmente:

```
npm run format:check && npm run lint && npm run check
SITE_URL=https://magma-consulting.com BASE_PATH=/magma_consulting/ npm run build
npm run test:e2e
```

Un base path que no sea la raíz es el que de verdad ejercita `withBase()` (el de producción es
`/`). Es lo mismo que hace `.github/workflows/ci.yml`.
