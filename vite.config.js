import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },

  define: {
    global: "window",
  },

  build: {
    target: "esnext",
    minify: "esbuild",
    cssCodeSplit: true,
    cssMinify: true,
    sourcemap: false,
    // Drop console/debugger in prod
    esbuild: {
      drop: ["console", "debugger"],
    },
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom', 'react-router-dom'],
          'vendor-animations': ['framer-motion'],
          'vendor-3d': ['three'],
          'vendor-ui': ['lucide-react'],
          'vendor-emoji': ['emoji-picker-react'],
          'vendor-auth': ['@react-oauth/google'],
          'vendor-http': ['axios', '@stomp/stompjs'],
        },
        chunkFileNames: 'static/js/[name].[hash].js',
        entryFileNames: 'static/js/[name].[hash].js',
        assetFileNames: 'static/[ext]/[name].[hash].[ext]',
      },
    },
    // Raise warning limit so builds don't look noisy
    chunkSizeWarningLimit: 600,
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://api.bharanidharan.dev',
        changeOrigin: true,
        secure: false,
      },
      '/chat': {
        target: 'https://api.bharanidharan.dev',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
