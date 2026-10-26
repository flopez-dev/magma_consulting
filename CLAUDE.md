# Magma Consulting

Web estática del cliente Magma Consulting (MDC Strategic Consulting, S.L.), consultoría de
telecomunicaciones para operadores locales y nacionales. Astro 7 + Tailwind v4, TypeScript strict. La home
(`/`) es la landing del negocio; además hay tres páginas legales (`/aviso-legal/`,
`/privacidad/`, `/cookies/`) y la 404.

Viene de `portfolio/projects/magma_consulting/` (HTML, CSS y JS a mano), migrada con la misma
estructura que `clinica_conecta` y `chantal_verdugo_house`. En octubre de 2026 la home se
rediseñó: el cliente eligió la propuesta v3, que salió de auditar la home con la skill
`ui-ux-pro-max` (patrón «Trust & Authority + Conversion») y añade la escena de partículas del
hero. Ya no hay paridad visual con el original. La skill está instalada solo en local
(`.claude/skills/ui-ux-pro-max/`, en `.gitignore`); se reinstala con
`npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max`.

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
  - `Header.astro` — cabecera fija con el logotipo completo (símbolo de 28 px, alineado con las
    minúsculas de la palabra y no con su caja),
    transparente sobre el hero; al pasar de 40 px de scroll el
    script le pone `data-scrolled` y se rellena de `carbon`. Menú móvil por debajo de 780 px
    (Escape cierra y devuelve el foco, el Tab da la vuelta dentro) y scroll suave a las anclas
    descontando la cabecera. En la home los enlaces son `#ancla`; en el resto,
    `withBase('/#ancla')`. El menú sigue el orden de la página: Trayectoria (`#credenciales`),
    Servicios, Nosotras y Contacto (`src/lib/secciones.ts`); Valores no está a propósito. En la home, un
    IntersectionObserver marca con `aria-current` el enlace de la sección que ocupa el centro.
  - `Hero.astro` — escena de scroll: un canvas lee el poster del vídeo y el símbolo de la marca
    y pone una partícula donde el poster tiene luz y donde el símbolo tiene forma. Al bajar, los
    puntos pasan de revueltos a formar la red, en remolino, y al final el símbolo, que gira media
    vuelta como el molinillo que es; después el vídeo y el `<img>` del símbolo toman el relevo.
    El escenario es `sticky` sobre un tramo vacío (`.hero-recorrido`, 140svh; 110svh en móvil),
    con CSS fuera de capa al final de `global.css`. Si es más alto que la pantalla, `--tope` lo
    sube lo justo sin meter nunca el eyebrow bajo la cabecera; el indicador de scroll se oculta
    en pantallas de menos de 820 px de alto, donde pisaría la franja de OMV. Sin JS, con movimiento reducido o si no puede
    leer las imágenes (`.sin-escena`) no hay escena: hero normal con poster y símbolo fijos.
    Sin dependencias.
  - `HeroContenido.astro` — texto del hero (CTA a `#contacto`, franja de OMV de referencia) y el
    símbolo (`favicon.png`, decorativo), que es el foco visual. Desde 1024 px el hero va en dos
    columnas: texto a la izquierda y el símbolo grande a la derecha (`[data-hero-marca]`, hasta
    23rem para que el titular no pase de tres líneas), con un halo de carbón detrás (`.hero-marca` en
    `global.css`) que lo separa de la red del vídeo y un brillo teal. Por debajo de 1024 px va
    pequeño junto al eyebrow y fuera del flujo, para que el escenario quepa en un móvil. Con
    escena, el halo y el brillo llegan con el relevo, no tapan las partículas.
  - `VideoFondo.astro` + `src/lib/videoHero.ts` — el vídeo (`public/img/hero-bg.webm|mp4` +
    poster, precargado en `index.astro`) sin `<source>` en el HTML: solo se descarga con
    pantalla ancha, sin ahorro de datos y sin movimiento reducido; si no, queda el poster. Botón
    de pausa (WCAG 2.2.2), pausa fuera de pantalla y con la escena esperando. El comentario de
    `VideoFondo.astro` documenta su procedencia y licencia (Pexels): mantenlo junto al asset.
  - En la página, tras el hero: `Credenciales.astro` (Trayectoria, en niebla: línea de cuatro
    hitos, horizontal desde 780 px y vertical debajo, los dos párrafos del cliente y el CTA),
    `Servicios.astro` (datos en `src/lib/servicios.ts`; empieza con `IndiceFases.astro`, tres
    fotos que llevan a `#fase-lanzar|conectar|operar`, tarjetas desde 900 px y lista compacta
    debajo; cada fase lleva un mailto con el asunto «Consulta sobre la fase «…»» y cada servicio
    su icono en un cuadro teal suave), `Valores.astro`, `Nosotras.astro` (datos en `src/lib/equipo.ts`; una socia por fila con el retrato
    de 17rem a la izquierda, apaisado encima en móvil) y `Contacto.astro`. `Valores` lleva un
    icono sobre cada valor y los secundarios como etiquetas; va antes que `Nosotras` para
    alternar fondos (oscuro, niebla, blanco, niebla, blanco, oscuro).
  - `Footer.astro` — pie en tres bloques (logotipo completo en blanco, razón social y domicilio en `<address>`,
    secciones, contacto con correo y LinkedIn) y una fila con el año (lo actualiza un script) y
    los enlaces legales con `aria-current`. Se monta fuera de `<main>`.
  - `Legal.astro` — monta las páginas legales: `Header`, franja oscura con el `h1`, el texto en
    el slot (`.legal-contenido`) y `Footer`.
  - `Boton.astro`, `Icono.astro`, `Revelar.astro` (reveal-al-scroll de `.reveal`; sin JS o con
    movimiento reducido todo queda visible).
- `src/lib/` — `sitio.ts` (nombre, título, descripciones, alt de la imagen OG), `contacto.ts`
  (correo, LinkedIn y los datos del titular que usan las páginas legales), `secciones.ts`
  (anclas del menú y del pie, rutas legales), `servicios.ts`, `equipo.ts`, `iconos.ts` (correo
  y LinkedIn en 24×24, y `iconos` con los trazados de Phosphor, MIT, viewBox 256: para añadir
  uno, copiar el `d` de `@phosphor-icons/core/assets/regular/<nombre>.svg`; no es dependencia),
  `jsonld.ts` (un `@graph` con el `ProfessionalService`, con `address`, `vatID`, catálogo y
  socias, y el `WebSite`; se genera desde `contacto.ts`, `servicios.ts` y `equipo.ts`, así que no
  puede divergir de la página visible) y `withBase.ts`. `contacto.ts` tiene `mailtoHref` (a
  secas, para las legales) y `mailtoConsultaHref` (con asunto, para la sección de contacto).
- `src/styles/global.css` — `@font-face`, tokens de Tailwind v4 (`@theme`), capa `base` y capa
  `components` (secciones, eyebrow, reveal, barras del menú, retratos en gris, `<details>` de
  «Ver más», texto legal) y, fuera de capa, la escena del hero. El foco es `teal-deep` sobre
  claro y `teal-light` sobre carbón (3:1 en los dos). Un único fichero; no crear otros `.css`.
- `src/fonts/` — `raleway.woff2` y `dm-sans.woff2` (variables, subconjunto latino) con sus
  licencias OFL. Viven en `src/` y no en `public/` para que Vite reescriba su URL con el base
  path.
- `public/img/` — logo (`logo.svg`, la palabra), `simbolo.svg` (el símbolo en vector para el
  hero, la cabecera, el pie y el favicon; vectorizado de `favicon.png`, coincide con él en un
  99,9 %: sustituir por el original si el cliente lo facilita), `logo-mark-512.png` para el
  JSON-LD, favicons (`.ico` y `.png` de respaldo del SVG), `og.jpg`, vídeo del hero,
  `servicios/` (las tres fotos del índice de fases) y `equipo/` (JPG + WebP). Las fotos de servicios y de las socias
  son las que ya publicaba la empresa y están marcadas para sustituir por fotografía propia.
- `public/_headers` — CSP, HSTS y caché (`/_astro/*` inmutable; `/img/*` una semana, no
  llevan hash). `public/_redirects` — URLs de la web anterior en WordPress → sus equivalentes.
  `public/.well-known/security.txt` — su `Expires` caduca el 2027-10-20 y hay que renovarlo.
- `tests/smoke.spec.ts` — en `/` y las tres legales: un `h1`, sin errores de consola ni overflow,
  menú móvil, «Ir al contenido», landmarks, sin marcadores `[ ]` ni «--» ni rayas (en el texto,
  title, metas, alt, aria-label, JSON-LD y `content` de los «Ver más»), canonical en
  `magma-consulting.com`, JSON-LD que parsea, sin `noindex`, imágenes cargadas. Además: el
  `@graph` (dirección, 7 servicios con `provider`, 2 socias, WebSite), «Ver más», enlaces
  externos en pestaña nueva, sección activa en el menú y su orden, mailto con asunto (también
  los de cada fase), índice de fases, legales → home, 404 y `robots.txt`. Del hero: vídeo que se
  pausa y no se descarga en móvil, símbolo decorativo, escena que acaba en vídeo y símbolo, y sin
  escena con movimiento reducido.

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
  página y `Disallow: /` en `robots.txt`). Lo pone `deploy-pages.yml`, la copia de test de
  `develop` en GitHub Pages; Cloudflare y CI construyen sin él.
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
  scroll, hover de botones y de las tarjetas de fases (solo con `hover: hover`), indicador de
  scroll (3 veces) y la escena de partículas del hero, que va ligada al scroll y nunca se mueve
  sola. Descartado a propósito: entrada animada del hero (retrasaría el LCP; la escena no anima
  el texto), contadores, parallax.
- Prettier ordena las clases de Tailwind (`prettier-plugin-tailwindcss`) — no reordenarlas a
  mano. Los textos con un enlace o un `<span>` en medio necesitan `{' '}` explícito donde Prettier
  parte la línea (ver el pie y `/privacidad/`), o las palabras se pegan.

## Ramas y despliegue

| Rama                   | Destino                                                       |
| :--------------------- | :------------------------------------------------------------ |
| `main`                 | Cloudflare Workers, en `magma-consulting.com`, bajo `/`        |
| `develop`              | GitHub Pages (`flopez-dev.github.io/magma_consulting/`), con noindex: entorno de test |
| Otras / PR             | Solo CI (formato, lint, tipos, build, tests); no se publican  |

El repositorio es **público** (por ahora). `develop` se publica en GitHub Pages con
`NOINDEX_SITE=true` (`deploy-pages.yml`); en Pages no aplican `_headers` (CSP) ni `_redirects`,
y su `robots.txt` bajo `/magma_consulting/` no lo lee ningún buscador, así que lo que evita la
indexación es el `<meta name="robots">`. La única copia indexable es la de producción.
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
