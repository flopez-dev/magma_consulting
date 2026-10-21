---
description: Reproduce el CI en local — formato, lint, tipos, build y tests e2e
allowed-tools: Bash(npm run format:check), Bash(npm run lint), Bash(npm run check), Bash(npm run build), Bash(npm run test:e2e)
---

Ejecuta, en este orden, exactamente lo que hace `.github/workflows/ci.yml`:

1. `npm run format:check` — Prettier sin escribir.
2. `npm run lint` — ESLint.
3. `npm run check` — comprueba tipos con `astro check`.
4. Build con un base path que no es la raíz, que es el que de verdad ejercita `withBase()`
   en los enlaces internos:

   ```
   SITE_URL=https://magma-consulting.com BASE_PATH=/magma_consulting/ npm run build
   ```

5. `npm run test:e2e` — smoke tests de Playwright (levanta y para el preview server solo).

Si cualquier paso falla, muestra el error literal (no lo resumas) y para — no continúes
al siguiente paso ni intentes arreglarlo sin que se te pida. Si todos pasan, dilo
brevemente y no hagas nada más.
