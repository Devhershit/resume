import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('react') || id.includes('react-dom')) return 'vendor-core'
          if (id.includes('lucide-react') || id.includes('react-draggable')) return 'vendor-ui'
          if (id.includes('gsap')) return 'vendor-animation'
          if (id.includes('ogl')) return 'vendor-rendering'
          if (id.includes('zustand')) return 'vendor-state'
          return 'vendor-misc'
        },
      },
    },
    // Use default tooling-compatible output without extra optional minifier deps.
    minify: false,
    chunkSizeWarningLimit: 600,
  },
  // Enable compression during development preview
  preview: {
    compress: true,
  },
})
