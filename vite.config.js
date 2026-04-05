import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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

  build: {
    // Modern browsers only — smaller bundles
    target: ['es2020', 'chrome87', 'firefox78', 'safari14'],
    chunkSizeWarningLimit: 600,

    // Aggressive minification
    minify: 'esbuild',
    cssMinify: true,

    // Enable CSS code-splitting (each chunk gets its own CSS)
    cssCodeSplit: true,

    // Inline tiny assets as base64 to save HTTP requests
    assetsInlineLimit: 4096, // 4kb

    // Manual chunks — prevents a single giant bundle
    rollupOptions: {
      output: {
        // Group large deps into their own chunks cached by CDN / browser
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/framer-motion')) return 'vendor-framer';
          if (id.includes('node_modules/three')) return 'vendor-three';
          if (id.includes('node_modules/lucide-react')) return 'vendor-lucide';
          if (id.includes('node_modules/@stomp') || id.includes('node_modules/sockjs-client')) return 'vendor-ws';
          if (id.includes('node_modules/')) return 'vendor-misc';
        },
        // Clean chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },

  server: {
    port: 3000,
    proxy: {
      // Chat REST → DIRECT to Chat service (port 8082)
      '/api/chat': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/chat/, ''),
      },
      // AI REST → DIRECT to Chat service (port 8082)
      '/api/ai': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/ai/, '/ai'),
      },
      // Auth REST → through API Gateway (port 8080)
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // WebSocket → DIRECT to Chat service (port 8082)
      '/chat': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
})
