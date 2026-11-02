import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { historyApiFallback: true },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('preload-helper') || id.includes('vite/'))
            return 'vendor-react';
          if (id.includes('node_modules/@react-oauth'))
            return 'vendor-oauth';
          if (id.includes('node_modules/heic2any'))
            return 'vendor-heic';
          if (id.includes('node_modules/docx'))
            return 'vendor-docx';
          if (id.includes('node_modules/jszip'))
            return 'vendor-jszip';
          if (id.includes('node_modules/lucide-react'))
            return 'vendor-lucide';
          if (id.includes('node_modules/react-dom'))
            return 'vendor-react';
          if (id.includes('node_modules/react-router'))
            return 'vendor-router';
          if (id.includes('node_modules/react'))
            return 'vendor-react';
        }
      }
    }
  }
});
