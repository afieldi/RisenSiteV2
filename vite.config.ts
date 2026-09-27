import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
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
