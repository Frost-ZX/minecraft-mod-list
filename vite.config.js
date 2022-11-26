import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';

export default defineConfig({

  base: './',
  plugins: [vue()],
  publicDir: 'public',

  build: {
    assetsDir: 'assets',
    assetsInlineLimit: 0,
    outDir: 'dist',
  },

  server: {
    host: '127.0.0.1',
    port: 9000,
  },

});
