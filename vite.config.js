import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // IMPORTANTE: Cambia 'app-foraneo' por el nombre EXACTO que le pondrás a tu repositorio en GitHub
  base: '/app-foraneo/', 
})