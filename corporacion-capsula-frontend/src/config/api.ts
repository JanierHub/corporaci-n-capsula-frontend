const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()

export const API_URL = import.meta.env.DEV
  ? "/api/v1"
  : configuredApiUrl || "/api/v1"
