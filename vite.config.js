import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { historyApiFallback: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/heic2any')) return 'vendor-heic';
          if (id.includes('node_modules/jspdf')) return 'vendor-jspdf';
          if (id.includes('node_modules/html2canvas')) return 'vendor-html2canvas';
          if (id.includes('node_modules/docx')) return 'vendor-docx';
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom/')
          ) return 'vendor-react';
          if (id.includes('node_modules/lucide-react')) return 'vendor-lucide';
        }
      }
    }
  }
});