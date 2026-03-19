import { defineConfig } from 'vite';

export default defineConfig({
  // If you are deploying to username.github.io/HEARTENZA-SERVICES/
  // set 'base' to '/HEARTENZA-SERVICES/'
  // If you are using a custom domain or username.github.io, set to '/'
  base: '/HEARTENZA-SERVICES/', 
  build: {
    outDir: 'dist',
  }
});
