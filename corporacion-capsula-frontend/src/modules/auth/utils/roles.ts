export const SESSION_ROLE_KEY = "userRole"
export const SESSION_USER_NAME_KEY = "userName"
export const SESSION_ACCESS_TOKEN_KEY = "accessToken"

const normalizeRole = (value: string | null) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()

export const getStoredUserRole = () => localStorage.getItem(SESSION_ROLE_KEY)

export const getStoredUserName = () => localStorage.getItem(SESSION_USER_NAME_KEY)

/** Sesión iniciada en esta app: nombre + token o rol (no basta con manipular solo una clave). */
export const isAuthenticated = (): boolean => {
  const user = getStoredUserName()?.trim()
  if (!user) return false
  if (getStoredAccessToken()) return true
  const role = getStoredUserRole()?.trim()
  return Boolean(role)
}

export const isAdministrator = () =>
  normalizeRole(getStoredUserRole()) === normalizeRole("Administrador")

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
    localStorage.setItem(SESSION_ACCESS_TOKEN_KEY, jwt)
    const label =
      (typeof session.rol === "string" && session.rol.trim()) ||
      (typeof session.nombreRol === "string" && session.nombreRol.trim()) ||
      roleLabelFromJwtPayload(decodeJwtPayload(jwt)) ||
      "Usuario"
    localStorage.setItem(SESSION_ROLE_KEY, label)
    return
  }

  const plain = candidates[0] ?? session.data?.trim() ?? ""
  if (plain && !looksLikeJwt(plain)) {
    localStorage.setItem(SESSION_ROLE_KEY, plain)
  }
}

export const getStoredAccessToken = () => localStorage.getItem(SESSION_ACCESS_TOKEN_KEY)?.trim()

/** Cabecera Bearer: token dedicado o JWT legado guardado en userRole. */
export const getBearerAuthHeader = (): Record<string, string> | undefined => {
  const raw = getStoredAccessToken() ?? getStoredUserRole()?.trim()
  if (!raw || !looksLikeJwt(raw)) return undefined
  return { Authorization: `Bearer ${raw}` }
}
