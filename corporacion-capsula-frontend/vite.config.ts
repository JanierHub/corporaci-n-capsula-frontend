import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // En dev: el front llama a `/api/v1/...` (mismo origen) y Vite reenvía a Express.
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
})