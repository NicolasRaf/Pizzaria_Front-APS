/// <reference types="vite/client" />

import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: process.env.PORT || 8080, // Usa a porta 8080 no Render
    host: '0.0.0.0' // Permite acesso externo
  },
  preview: {
    port: 8080,
    host: '0.0.0.0'
  }
});

