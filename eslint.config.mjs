// @ts-check
import js from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  {
    ignores: ['dist/', '.astro/', 'node_modules/', 'public/'],
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
