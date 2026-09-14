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
        'driver-services': resolve(__dirname, 'driver-services.html'),
        'house-maintenance': resolve(__dirname, 'house-maintenance.html'),
        'medical-assistance': resolve(__dirname, 'medical-assistance.html'),
        'vehicle-maintenance': resolve(__dirname, 'vehicle-maintenance.html'),
        'delivery-errands': resolve(__dirname, 'delivery-errands.html'),
        'elderly-companion-services': resolve(__dirname, 'elderly-companion-services.html'),
        'gifts-special-occasions': resolve(__dirname, 'gifts-special-occasions.html'),
        testimonials: resolve(__dirname, 'testimonials.html'),
        tours: resolve(__dirname, 'tours.html'),
        'tour-details': resolve(__dirname, 'tour-details.html')
      }
    }
  }
});
