// =========================================================
// VITE — páginas do site
// Cada página nova (ex.: outro case) entra na lista "input".
// =========================================================
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(root, 'index.html'),
        raiz: resolve(root, 'trabalhos/raiz/index.html'),
      },
    },
  },
});
