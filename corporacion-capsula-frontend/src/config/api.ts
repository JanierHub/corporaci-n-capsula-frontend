// URL del backend - debe apuntar directamente al servidor backend
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()

// En desarrollo, apuntar directamente al backend en localhost:3000
// En producción, usar la variable de entorno o la ruta relativa
export const API_URL = configuredApiUrl || "http://localhost:3000/api/v1"
