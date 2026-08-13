import type { Plugin } from 'vite';

import { copyFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

const DEV_SERVER_PORT = 9090;
const DIST_DIRECTORY = fileURLToPath(new URL('./dist', import.meta.url));
const GITHUB_PAGES_ROUTE_PATHS = [
  '/feedback',
  '/infinite-scroll',
  '/modal',
  '/tabs',
  '/todo',
  '/users',
] as const;

function createGitHubPagesRoutes(): Plugin {
  return {
    name: 'github-pages-routes',
    apply: 'build',
    async closeBundle() {
      const indexFile = join(DIST_DIRECTORY, 'index.html');

      await copyFile(indexFile, join(DIST_DIRECTORY, '404.html'));

      await Promise.all(
        GITHUB_PAGES_ROUTE_PATHS.map(async (path) => {
          const routeName = path.slice(1);
          const routeDirectory = join(DIST_DIRECTORY, routeName);

          await mkdir(routeDirectory, { recursive: true });
          await Promise.all([
            copyFile(indexFile, join(DIST_DIRECTORY, `${routeName}.html`)),
            copyFile(indexFile, join(routeDirectory, 'index.html')),
          ]);
        }),
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/EME/',
  plugins: [vue(), vueDevTools(), createGitHubPagesRoutes()],
  preview: {
    port: DEV_SERVER_PORT,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@ui': fileURLToPath(new URL('./src/components/ui', import.meta.url)),
    },
  },
  server: {
    port: DEV_SERVER_PORT,
    strictPort: true,
  },
});
