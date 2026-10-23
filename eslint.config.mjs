// @ts-check
import js from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  {
    // El skill de diseño instalado localmente (.agents/, .claude/skills/design-taste-frontend/) no es
    // código del proyecto y está en .gitignore; ESLint no lee .gitignore, así que se excluye aquí.
    ignores: [
      'dist/',
      '.astro/',
      'node_modules/',
      'public/',
      '.agents/',
      '.claude/skills/design-taste-frontend/',
    ],
  },
  js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    languageOptions: {
      globals: {
        // Scripts inline en los componentes (menú móvil, reveal-al-scroll, etc.)
        // corren en el navegador, no en Node.
        document: 'readonly',
        window: 'readonly',
        matchMedia: 'readonly',
        IntersectionObserver: 'readonly',
        addEventListener: 'readonly',
      },
    },
  },
  {
    // Ficheros de configuración: corren en Node, no en el navegador.
    files: ['*.config.mjs', '*.config.ts'],
    languageOptions: {
      globals: {
        process: 'readonly',
      },
    },
  },
];
