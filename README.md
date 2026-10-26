# Magma Consulting

Web estática de Magma Consulting (MDC Strategic Consulting, S.L.), consultoría de
telecomunicaciones para operadores locales y nacionales. Construida con [Astro](https://astro.build/) y
[Tailwind CSS v4](https://tailwindcss.com/), desplegada como Worker de Cloudflare en
[magma-consulting.com](https://magma-consulting.com).

## Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando                | Acción                                                  |
| :--------------------- | :------------------------------------------------------ |
| `npm install`          | Instala las dependencias                                |
| `npm run dev`          | Arranca el servidor de desarrollo en `localhost:4321`   |
| `npm run build`        | Genera el sitio de producción en `./dist/`              |
| `npm run preview`      | Sirve localmente el build de producción                 |
| `npm run check`        | Comprueba tipos con `astro check`                       |
| `npm run format`       | Formatea el repo con Prettier                           |
| `npm run lint`         | ESLint sobre `.astro`/`.ts`                             |
| `npm run test:e2e`     | Smoke tests de Playwright                               |

Convenciones del repo (base path, Tailwind v4, maquetación) están en
[`CLAUDE.md`](./CLAUDE.md).

## Ramas y despliegue

| Rama                   | Destino                                                                         |
| :--------------------- | :------------------------------------------------------------------------------ |
| `main`                 | Cloudflare Workers, en [magma-consulting.com](https://magma-consulting.com) — producción |
| `develop`              | GitHub Pages, en [flopez-dev.github.io/magma_consulting](https://flopez-dev.github.io/magma_consulting/) — test, con noindex |
| Otras / PR             | Solo CI: formato, lint, tipos, build y tests e2e (no se publican)               |

`astro.config.mjs` lee `SITE_URL` y `BASE_PATH` de variables de entorno. Por defecto el sitio
se construye bajo `/magma_consulting/` (en local y en el CI, para comprobar los enlaces
internos) y bajo `/` en Cloudflare, en el dominio propio. La copia de `develop` en GitHub
Pages se construye con `NOINDEX_SITE=true` para que no se indexe.

## Puesta en marcha (configuración manual, fuera del repo)

### 1. Secretos en GitHub

Para que `deploy-cloudflare.yml` despliegue, tiene que haber en
**Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_API_TOKEN_MAGMA_CONSULTING` — token de API de Cloudflare creado con la
  plantilla «Edit Cloudflare Workers», limitado a la cuenta y a la zona
  `magma-consulting.com` (el mismo tipo de token que el de clinica_conecta). Si el deploy falla
  al crear el dominio personalizado con un error de autenticación, añade al token el permiso
  *Zone › DNS › Edit* sobre esa zona.
- `CLOUDFLARE_ACCOUNT_ID` — el ID de la cuenta de Cloudflare.

Sin ellos, ese workflow falla en el último paso. Una vez creados, relánzalo desde
**Actions → Deploy site to Cloudflare Workers → Run workflow**.

### 2. El dominio en Cloudflare

Hoy (octubre de 2026) los DNS de `magma-consulting.com` están en Arsys (`servidoresdns.net`)
y el apex apunta al WordPress. Antes del primer deploy:

1. Dar de alta la zona `magma-consulting.com` en la **misma cuenta** de Cloudflare que recibe
   el deploy, y cambiar los nameservers en el registrador. Wrangler crea los registros del
   Worker (`custom_domain` en `wrangler.jsonc`), pero la zona no la crea.
2. Al importar los registros, **conservar los del correo (Microsoft 365)**: el `MX`
   (`magmaconsulting-com01c.mail.protection.outlook.com`), el `TXT` de SPF
   (`v=spf1 include:spf.protection.outlook.com -all`), el `TXT` `MS=…` de verificación y el
   `CNAME` `autodiscover` → `autodiscover.outlook.com`. Si no, `info@magma-consulting.com`
   deja de recibir correo.
3. Borrar los registros `A`/`CNAME` del apex y de `www` que apuntan al WordPress: Wrangler no
   los sobrescribe y el deploy falla si existen.
4. En **Security → Bots**, dejar desactivado Bot Fight Mode / JavaScript Detections: si no,
   Cloudflare instala la cookie `cf_clearance` y `/cookies/` dejaría de ser cierta.

5. En **Rules → Redirect Rules**, crear una regla «Redirect from WWW to root» (plantilla de
   Cloudflare): `https://www.magma-consulting.com/*` → `https://magma-consulting.com/${1}`, 301,
   conservando la query string. Hoy el WordPress hace ese 301; sin la regla, `www` serviría una
   copia con código 200. `_redirects` no puede hacerlo porque cambia de dominio.
6. En **SSL/TLS → Edge Certificates**, activar «Always Use HTTPS».
7. El día del cambio, en Google Search Console: verificar el dominio por DNS, enviar
   `https://magma-consulting.com/sitemap-index.xml` y retirar el antiguo `wp-sitemap.xml`.

`public/_redirects` lleva las URLs del WordPress (`/servicios/`, `/nosotras/`,
`/politica-de-privacidad-2/`…) a sus equivalentes, así que no se pierden enlaces ni
posicionamiento al cambiar.
