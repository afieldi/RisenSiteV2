import { defineConfig, type Connect, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const PAGES = ['leagues', 'contact'];

// Serve /leagues as leagues.html etc. in dev and preview, matching GitHub Pages' extensionless URLs.
function cleanUrls(): Plugin {
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    const [path, query] = (req.url ?? '').split('?');
    const page = path.replace(/^\/|\/$/g, '');
    if (PAGES.includes(page)) req.url = `/${page}.html${query ? `?${query}` : ''}`;
    next();
  };
  return {
    name: 'clean-urls',
    configureServer: server => { server.middlewares.use(rewrite); },
    configurePreviewServer: server => { server.middlewares.use(rewrite); },
  };
}

export default defineConfig({
  plugins: [react(), cleanUrls()],
  // Relative base works for both username.github.io/repo-name/ and custom domains.
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        leagues: resolve(import.meta.dirname, 'leagues.html'),
        contact: resolve(import.meta.dirname, 'contact.html'),
      },
    },
  },
});
