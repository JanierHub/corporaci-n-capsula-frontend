// URL del backend - usa proxy Vite en desarrollo para evitar CORS
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()

// En desarrollo, usar ruta relativa para usar el proxy Vite
// El proxy reenviará /api/v1/* a http://localhost:3000/api/v1/*
// En producción, usar la variable de entorno configurada
export const API_URL = configuredApiUrl || "/api/v1"
