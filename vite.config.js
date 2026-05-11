import { defineConfig } from 'vite';
import viteString from 'vite-plugin-string';

export default defineConfig({
  plugins: [
    viteString({
      compress: false
    })
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['three', 'gsap']
  },
  server: {
    port: 3000,
    open: true,
    hmr: {
        overlay: true
    }
  },
  css: {
    devSourcemap: true
  }
});