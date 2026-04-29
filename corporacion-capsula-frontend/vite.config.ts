import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    /** Proxy para evitar CORS en desarrollo */
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        // El backend usa /api/v1/* directamente, no reescribir
      },
    },
  },
})
