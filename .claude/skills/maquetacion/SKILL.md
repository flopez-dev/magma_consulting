---
name: maquetacion
description: Reglas de maquetación del sitio Magma Consulting — paleta, ritmo de página, tipografía, capas de Tailwind y accesibilidad. Úsala al crear o modificar cualquier sección, componente o página Astro del sitio.
---

# Maquetación de Magma Consulting

Reglas visuales del sitio, implícitas en el código: `src/pages/index.astro`, los componentes de
sección de `src/components/` y `src/styles/global.css`.

## Paleta («estratos»)

- Tokens de marca en el `@theme` de `global.css`: `white`, `mist`, `mist-deep` (fondos claros y
  filetes); `carbon`, `carbon-soft` (cabecera, secciones oscuras, títulos, tarjeta de contacto);
  `teal`, `teal-deep`, `teal-light` (el único color de marca, del logo); `ink`, `ink-soft`
  (texto).
- Nunca un hexadecimal suelto en una clase: si hace falta un tono nuevo, al `@theme`. No usar las
  escalas de color de Tailwind (`slate`, `emerald`…). Los blancos con opacidad (`text-white/85`,
  `border-white/15`) sobre `carbon` sí están permitidos: son los del diseño original.
- Contraste: `teal` sobre blanco da ~2,4:1 — solo cifras grandes, filetes, iconos y fondos de
  botón (con texto `carbon`). Texto teal sobre blanco, siempre `teal-deep`; sobre oscuro,
  `teal-light`. Cuerpo de texto: `ink`/`ink-soft`.

## Tipografía

- `font-display` (Raleway, 800 en títulos, 700 en menú, botones, etiquetas y cifras) y
  `font-sans` (DM Sans) para el cuerpo, a 17 px y `line-height` 1,7. Los tamaños de `h1`–`h4`
  están en la capa `base`.
- No usar `text-base`, `text-lg`… de Tailwind: fijan también `line-height` y rompen el ritmo.
  Usar `text-[1rem]`.
- Tipografías autoalojadas en `src/fonts/` con su `@font-face`; nunca `<link>` a Google Fonts.

## Ritmo de página

- Cada sección es `<section id="…" class="seccion [seccion-niebla|seccion-oscura]"
  aria-labelledby>` y su contenido va en `<div class="seccion-interior">` (1200 px de ancho
  máximo, 1 rem de margen lateral). Alternan blanco, niebla y carbón; entre una y otra, filetes
  de 1 px (`mist-deep` sobre claro, `teal` en el borde del hero y del pie).
- Jerarquía: `h1` solo en el hero (y en la franja de las legales), `h2` por sección con un
  `<p class="eyebrow">` encima (`eyebrow eyebrow-oscuro` sobre fondo oscuro), `h3`/`h4` debajo.
  `seccion-entradilla` para el párrafo de introducción.
- Los bloques que entran al hacer scroll llevan la clase `reveal`; el script es `Revelar.astro`.
- Breakpoints `max-[Npx]:` (780 menú y contacto, 720 fases y socias, 860/480 valores, 640 tira
  de fotos, 560 hero), no mobile-first, para conservar el diseño original.

## Capas de Tailwind

- Utilidades en el marcado. En `global.css`, capa `components`, solo lo que no cabe:
  pseudo-elementos (`.nav-toggle-barras`, `.tira-foto`, `.ver-mas`, `.valores-extra`), reglas en
  cascada (`.seccion-oscura`, `.legal-contenido`) y estado que escribe el JS (`.reveal`).
- Las utilidades ganan a `components`: no poner una utilidad de `display`/`margin` en un elemento
  cuya clase de componente ya los fija.
- Dentro de `.seccion-oscura` todo `<p>` es blanco al 82 %; para otro color, una utilidad
  `text-*` (o `eyebrow-oscuro`, que ya gana).

## Accesibilidad

- Foco visible global (`:focus-visible`, 3 px teal); no quitarlo.
- Enlaces que abren pestaña nueva: `target="_blank" rel="noopener"` y un `<span class="sr-only">
  (se abre en una pestaña nueva)</span>` (lo comprueba un test).
- Iconos decorativos con `aria-hidden` (el componente `Icono` lo hace solo).
- Nada se mueve con `prefers-reduced-motion: reduce` (ni el vídeo del hero, ni el reveal, ni el
  indicador de scroll, ni el zoom de las fotos); sin JS, todo el contenido sigue visible.
- Los textos con un enlace en medio necesitan `{' '}` explícito donde Prettier parte la línea.
