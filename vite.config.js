import { defineConfig } from 'vite';

export default defineConfig({
  base: '/travel-shiori-2026/',
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
