export const SESSION_ROLE_KEY = "userRole"
export const SESSION_USER_NAME_KEY = "userName"
export const SESSION_ACCESS_TOKEN_KEY = "accessToken"
export const PERSISTED_ROLE_KEY = "userRolePersisted" // No se borra al cerrar sesión

export const normalizeRole = (value: string | null) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()

export const getStoredUserRole = () => localStorage.getItem(SESSION_ROLE_KEY)

export const getStoredUserName = () => localStorage.getItem(SESSION_USER_NAME_KEY)

export const getPersistedRole = () => localStorage.getItem(PERSISTED_ROLE_KEY)

/** Sesión iniciada en esta app: requiere nombre de usuario + token/rol activo.
 * El rol persistente (PERSISTED_ROLE_KEY) solo se usa para recuperar el rol al iniciar sesión,
 * NO para mantener la sesión activa después de logout.
 */
export const isAuthenticated = (): boolean => {
  const user = getStoredUserName()?.trim()
  if (!user) return false // Se requiere nombre de usuario para sesión activa
  
  if (getStoredAccessToken()) return true
  
  const role = getStoredUserRole()?.trim()
  return Boolean(role) // Solo rol de sesión activa, NO el persistido
}

export const isAdministrator = () =>
  normalizeRole(getStoredUserRole() ?? getPersistedRole()) === normalizeRole("Administrador")

export const isProjectManager = () =>
  normalizeRole(getStoredUserRole() ?? getPersistedRole()) === normalizeRole("Gestor de proyectos")

export const isUser = () =>
  normalizeRole(getStoredUserRole() ?? getPersistedRole()) === normalizeRole("Usuario")

export const isInnovationDirector = () =>
  normalizeRole(getStoredUserRole() ?? getPersistedRole()) === normalizeRole("Directora de Innovacion")

export const canViewArtifacts = () => {
  const role = getStoredUserRole() ?? getPersistedRole()
  return role !== null && role !== undefined && role.trim() !== ""
}

export const canManageArtifacts = () => {
  const role = normalizeRole(getStoredUserRole() ?? getPersistedRole())
  return role === normalizeRole("Administrador") || 
         role === normalizeRole("Gestor de proyectos") || 
         role === normalizeRole("Directora de Innovacion") ||
         role === normalizeRole("Usuario")
}

export const canDeleteArtifacts = () => 
  normalizeRole(getStoredUserRole() ?? getPersistedRole()) === normalizeRole("Administrador")

/** Admin tiene acceso a todo. Si no es admin, verifica el rol específico. */
export const isAdminOrRole = (roleName: string): boolean => {
  const currentRole = normalizeRole(getStoredUserRole() ?? getPersistedRole())
  if (currentRole === normalizeRole("Administrador")) return true
  return currentRole === normalizeRole(roleName)
}

/** Admin puede acceder a cualquier módulo. */
export const canAccessModule = (allowedRoles: string[]): boolean => {
  const currentRole = normalizeRole(getStoredUserRole() ?? getPersistedRole())
  if (currentRole === normalizeRole("Administrador")) return true
  return allowedRoles.some(r => normalizeRole(r) === currentRole)
}

// HU-10: Restricción por nivel de seguridad
// Niveles de seguridad según roles (del más alto al más bajo)
const ROLE_SECURITY_LEVELS: Record<string, number> = {
  "administrador": 5,
  "experto en tecnologia extraterrestre": 5,
  "directora de innovacion": 4,
  "especialista en seguridad": 4,
  "inventor/tester": 3,
  "gestor de proyectos": 3,
  "usuario": 1,
}

/**
 * Obtiene el nivel de seguridad del usuario actual (1-5)
 * HU-10: Restricción visual por nivel de seguridad
 */
export const getCurrentSecurityLevel = (): number => {
  const currentRole = normalizeRole(getStoredUserRole() ?? getPersistedRole())
  return ROLE_SECURITY_LEVELS[currentRole] ?? 1
}

/**
 * Verifica si el usuario puede ver contenido de cierto nivel de seguridad
 * @param contentLevel Nivel de seguridad del contenido (1-5)
 * HU-10: Solo restricción visual, la validación real es backend
 */
export const canViewContentBySecurityLevel = (contentLevel: number): boolean => {
  const userLevel = getCurrentSecurityLevel()
  return userLevel >= contentLevel
}

/**
 * Verifica si el usuario puede ver artefactos según su peligrosidad/confidencialidad
 * @param dangerLevel Nivel de peligrosidad (1-10)
 * @param confLevel Nivel de confidencialidad (1-10)
 * HU-10: Solo restricción visual
 */
export const canViewArtifactByLevels = (dangerLevel: number, confLevel: number): boolean => {
  const userLevel = getCurrentSecurityLevel()
  // Mapeo: nivel de seguridad usuario -> máximo nivel artefacto visible
  const maxArtifactLevel = userLevel * 2 // Nivel 5 puede ver hasta 10
  return dangerLevel <= maxArtifactLevel && confLevel <= maxArtifactLevel
}

/**
 * Obtiene etiqueta del nivel de seguridad actual
 */
export const getSecurityLevelLabel = (): string => {
  const level = getCurrentSecurityLevel()
  const labels: Record<number, string> = {
    1: "Nivel 1 - Básico",
    3: "Nivel 3 - Operativo",
    4: "Nivel 4 - Táctico/Estratégico",
    5: "Nivel 5 - Clasificado/Total",
  }
  return labels[level] || `Nivel ${level}`
}

export const clearStoredSession = () => {
  localStorage.removeItem(SESSION_ROLE_KEY)
  localStorage.removeItem(SESSION_USER_NAME_KEY)
  localStorage.removeItem(SESSION_ACCESS_TOKEN_KEY)
}

/** Valor guardado en login como `session.data`: puede ser JWT o nombre de rol. */
export const looksLikeJwt = (value: string) =>
  /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value.trim())

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4)
    const json = atob(padded)
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

/** Mapeo opcional idRol -> etiqueta (debe coincidir con el backend). */
const ROL_ID_LABEL: Record<number, string> = {
  1: "Administrador",
  2: "Directora de Innovacion",
  3: "Experto en tecnologia extraterrestre",
  4: "Especialista en seguridad",
  5: "Inventor/Tester",
  6: "Gestor de proyectos",
  7: "Usuario",
}

export const roleLabelFromJwtPayload = (payload: Record<string, unknown> | null): string | null => {
  if (!payload) return null
  const direct =
    typeof payload.rolNombre === "string"
      ? payload.rolNombre
      : typeof payload.roleName === "string"
        ? payload.roleName
        : typeof payload.nombreRol === "string"
          ? payload.nombreRol
          : typeof payload.role === "string"
            ? payload.role
            : null
  if (direct?.trim()) return direct.trim()
  const id = payload.idRol ?? payload.rolId ?? payload.rol
  if (typeof id === "number" && ROL_ID_LABEL[id]) return ROL_ID_LABEL[id]
  if (typeof id === "string") {
    const n = Number(id)
    if (!Number.isNaN(n) && ROL_ID_LABEL[n]) return ROL_ID_LABEL[n]
  }
  return null
}

/** Tras login: guarda JWT y nombre de rol legible (no el token en userRole). */
export const persistSessionFromLoginResponse = (session: {
  data?: string
  session?: string
  token?: string
  rol?: string
  nombreRol?: string
}) => {
  const candidates = [session.token, session.session, session.data]
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.trim())

  const jwt = candidates.find((c) => looksLikeJwt(c))
  if (jwt) {
    // Guardar en localStorage para el frontend
    localStorage.setItem(SESSION_ACCESS_TOKEN_KEY, jwt)
    
    // Guardar como cookie para el backend (que espera req.cookies.token)
    document.cookie = `token=${jwt}; path=/; SameSite=None; Secure`
    
    const label =
      (typeof session.rol === "string" && session.rol.trim()) ||
      (typeof session.nombreRol === "string" && session.nombreRol.trim()) ||
      roleLabelFromJwtPayload(decodeJwtPayload(jwt)) ||
      "Usuario"
    localStorage.setItem(SESSION_ROLE_KEY, label)
    localStorage.setItem(PERSISTED_ROLE_KEY, label) // Persistir para siguiente sesión
    return
  }

  const plain = candidates[0] ?? session.data?.trim() ?? ""
  if (plain && !looksLikeJwt(plain)) {
    localStorage.setItem(SESSION_ROLE_KEY, plain)
    localStorage.setItem(PERSISTED_ROLE_KEY, plain) // Persistir para siguiente sesión
  }
}

export const getStoredAccessToken = () => localStorage.getItem(SESSION_ACCESS_TOKEN_KEY)?.trim()

/** Restaura el rol desde la clave persistente (para usar después de login). */
export const restoreRoleFromPersistence = (): string | null => {
  const persisted = localStorage.getItem(PERSISTED_ROLE_KEY)
  if (persisted) {
    localStorage.setItem(SESSION_ROLE_KEY, persisted)
    return persisted
  }
  return null
}

/** Cabecera Bearer: token dedicado o JWT legado guardado en userRole. */
export const getBearerAuthHeader = (): Record<string, string> | undefined => {
  const raw = getStoredAccessToken() ?? getStoredUserRole()?.trim()
  if (!raw || !looksLikeJwt(raw)) return undefined
  return { Authorization: `Bearer ${raw}` }
}

/** Obtener credenciales de autenticación para headers */
export const getAuthCredentials = (): Record<string, string> | undefined => {
  // Primero intentar con el token JWT dedicado
  const token = getStoredAccessToken()
  if (token && token.trim()) {
    return { Authorization: `Bearer ${token}` }
  }
  
  // Fallback: intentar con el rol guardado (podría ser un JWT legacy)
  const role = getStoredUserRole()
  if (role && looksLikeJwt(role)) {
    return { Authorization: `Bearer ${role}` }
  }
  
  // Sin credenciales disponibles
  return undefined
}
