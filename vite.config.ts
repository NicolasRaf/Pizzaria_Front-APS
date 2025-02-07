import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: './', // ou '/' se estiver hospedando em um domínio root
  server: {
    host: true, // Permite acesso na rede local
    port: 5173 // ou outra porta desejada
  },
  preview: {
    allowedHosts: ["localhost", "pizzaria-front-teste.onrender.com"]
  }
});
