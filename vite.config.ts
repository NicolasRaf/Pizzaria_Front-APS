import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  preview: {
    allowedHosts: ["pizzaria-front-teste.onrender.com"]
  }
});
