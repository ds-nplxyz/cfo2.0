import { defineConfig } from 'vite';

export default defineConfig({
  root: 'editor',
  build: {
    outDir: '../public',
    emptyOutDir: false,
    assetsDir: 'editor/assets',
    rollupOptions: { input: 'edit.html' }
  }
});
