import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
// https://vite.dev/config/
export default defineConfig({
  // Absolute, not './' — relative asset URLs resolve against the current document, so
  // on a nested route like /mechanical they would request /mechanical/assets/... and 404.
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          framer: ['framer-motion'],
          lenis: ['lenis'],
          icons: ['lucide-react'],
          // react-router-dom is deliberately NOT split out: every route needs it on
          // first paint, so a separate chunk only buys an extra request.
        },
      },
    },
  },
});
