import path from 'node:path';
import fs from 'fs';
import { defineConfig } from 'vite';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import viteCompression from 'vite-plugin-compression';
import viteImagemin from 'vite-plugin-imagemin';

// TODO: Currently there is a bug where Vite dev dont handle trailing slash
// https://github.com/vitejs/vite/issues/6596
export default defineConfig(({command}) => ({
  base: process.env.PUBLIC_PATH,
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:`$is-dev: ${command === 'serve'};`
      }
    }
  },
  plugins: [
    svelte({
      preprocess: [vitePreprocess()],
    }),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 82,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        // plugins: [
        //   {
        //     name: 'removeViewBox',
        //   },
        //   {
        //     name: 'removeEmptyAttrs',
        //     active: false,
        //   },
        // ],
      },
    }),
    viteCompression({
      filter: /\.(js|mjs|json|css|map)$/i
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '$lib': path.resolve(__dirname, './src/lib')
    },
    preserveSymlinks: true,
  }
}));
