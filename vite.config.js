import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // 🚀 FAANG-Level Production Optimizations
  build: {
    target: 'esnext',
    minify: 'esbuild', // Faster and smaller than terser
    cssMinify: true,
    cssCodeSplit: true,
    modulePreload: { polyfill: true },
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        // Group huge dependencies into separate chunks for better caching
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-core';
            if (id.includes('framer-motion')) return 'vendor-animation';
            if (id.includes('three')) return 'vendor-visuals';
            if (id.includes('lucide')) return 'vendor-icons';
            return 'vendor-utils';
          }
        },
        // Premium fingerprinted filenames
        chunkFileNames: 'static/js/[name].[hash].js',
        entryFileNames: 'static/js/[name].[hash].js',
        assetFileNames: 'static/[ext]/[name].[hash].[ext]',
      },
    },
  },

  // 🛡️ Remove debugging noise in production
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
