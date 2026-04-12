/**
 * Roles en JWT: `createSession({ role: credential.nombre_rol })` (ver `sessionController`).
 * Rutas de artefactos: `verifyRole("Administrador")` en `artifactRoute.ts`.
 * Otros roles en BD (p. ej. rolSchema): no pasan `verifyRole` salvo coincidencia exacta de string.
 */
export const SESSION_ROLE_KEY = "userRole"

/** Debe coincidir con `verifyRole("Administrador")` del backend. */
export const ROLE_ADMINISTRADOR = "Administrador"

export function getStoredUserRole(): string | null {
  if (typeof sessionStorage === "undefined") return null
  return sessionStorage.getItem(SESSION_ROLE_KEY)
}

export function isAdministrator(): boolean {
  return getStoredUserRole() === ROLE_ADMINISTRADOR
}
