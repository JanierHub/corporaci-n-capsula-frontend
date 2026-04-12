/**
 * Base del API (`/api/v1`).
 * - Sin `VITE_API_URL`: en dev usa ruta relativa + proxy de Vite → `http://localhost:3000` (ver `vite.config.ts`).
 * - Con `VITE_API_URL`: URL absoluta (útil si no usas proxy o en build contra otro host).
 */
export const API_URL =
  import.meta.env.VITE_API_URL?.trim() || "/api/v1"