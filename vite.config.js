import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/heic2any'))      return 'vendor-heic';
          if (id.includes('node_modules/jspdf'))         return 'vendor-jspdf';
          if (id.includes('node_modules/html2canvas'))   return 'vendor-html2canvas';
          if (id.includes('node_modules/docx'))          return 'vendor-docx';
          if (id.includes('node_modules/jszip'))         return 'vendor-jszip';
          if (id.includes('node_modules/lucide-react'))  return 'vendor-lucide';
          if (id.includes('node_modules/react-dom'))     return 'vendor-react';
          if (id.includes('node_modules/react-router'))  return 'vendor-router';
          if (id.includes('node_modules/react'))         return 'vendor-react';
        }
      }
    }
  }
});