import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { componentTagger } from "lovable-tagger"; // Comment this line out

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // mode === "development" && componentTagger() // Comment this line out
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core (shared by all pages)
          'vendor-react': [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          // Three.js and 3D graphics (only used in LiquidEther and Art3DPreview)
          'vendor-three': [
            'three',
            '@react-three/fiber',
            '@react-three/drei',
            '@react-three/postprocessing',
          ],
          // Radix UI components (large UI library)
          'vendor-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip',
          ],
          // React Query and data fetching
          'vendor-query': [
            '@tanstack/react-query',
            '@tanstack/react-query-devtools',
          ],
          // Framer Motion animations
          'vendor-motion': [
            'framer-motion',
          ],
          // Form handling
          'vendor-forms': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod',
          ],
          // Markdown and content
          'vendor-content': [
            'react-markdown',
          ],
          // Supabase client
          'vendor-supabase': [
            '@supabase/supabase-js',
          ],
          // Icons
          'vendor-icons': [
            'lucide-react',
          ],
        },
      },
    },
    // Increase chunk size warning limit (after splitting, chunks will be smaller)
    chunkSizeWarningLimit: 600,
  },
  test: {
    globals: true,
    environment: "node",
  },
}));