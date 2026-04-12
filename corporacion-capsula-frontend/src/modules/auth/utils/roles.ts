/**
 * Roles en JWT: `createSession({ role: credential.nombre_rol })` (ver `sessionController`).
 * Rutas de artefactos: `verifyRole("Administrador")` en `artifactRoute.ts`.
 * Otros roles en BD (p. ej. rolSchema): no pasan `verifyRole` salvo coincidencia exacta de string.
 */
export const SESSION_ROLE_KEY = "userRole"

/** Debe coincidir con `verifyRole("Administrador")` del backend. */
export const ROLE_ADMINISTRADOR = "Administrador"
export const ROLE_USUARIO = "Usuario"

function normalizeRole(value: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
}

export function getStoredUserRole(): string | null {
  if (typeof sessionStorage === "undefined") return null
  return sessionStorage.getItem(SESSION_ROLE_KEY)
}

export function isAdministrator(): boolean {
  return normalizeRole(getStoredUserRole()) === normalizeRole(ROLE_ADMINISTRADOR)
}

export function canEditArtifacts(): boolean {
  const role = normalizeRole(getStoredUserRole())
  return role === normalizeRole(ROLE_ADMINISTRADOR) || role === normalizeRole(ROLE_USUARIO)
}
