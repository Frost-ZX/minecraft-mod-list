import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

import vue from '@vitejs/plugin-vue';

export default defineConfig({

  base: './',
  plugins: [
    viteSingleFile({
      deleteInlinedFiles: true,
      removeViteModuleLoader: false,
      useRecommendedBuildConfig: false,
    }),
    vue(),
  ],
  publicDir: 'public',

  build: {

    assetsDir: 'assets',
    outDir: 'dist',

    // 适配 viteSingleFile
    assetsInlineLimit: 104857600, // 100MB
    cssCodeSplit: false,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },

  },

  server: {
    host: '127.0.0.1',
    port: 9000,
  },

});
