import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        services: resolve(__dirname, 'services.html'),
        testimonials: resolve(__dirname, 'testimonials.html'),
        tours: resolve(__dirname, 'tours.html'),
        'tour-details': resolve(__dirname, 'tour-details.html')
      }
    }
  }
});
