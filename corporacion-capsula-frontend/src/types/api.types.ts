/**
 * Contrato del API Corporación Cápsula (backend `/api/v1`).
 * Nombres alineados con el back (snake_case en JSON donde aplique).
 *
 * ## Base URL y CORS
 * - Prefijo: `http(s)://<host>:<PORT>/api/v1` (local típico: `PORT=3000` → `http://localhost:3000/api/v1`).
 * - Front: `VITE_API_URL=http://localhost:3000/api/v1` en `.env`.
 * - **Cookies:** el login guarda el JWT en la cookie `token`. Rutas protegidas: `credentials: "include"`.
 * - **CORS:** el backend usa `FRONTEND_URL` (por defecto `http://localhost:5173`); abrir la app desde esa URL.
 *
 * ## Errores habituales
 * - **400:** validación Zod — `message`: array de `{ field, message }`.
 * - **401:** token requerido / inválido.
 * - **403:** rol insuficiente.
 * - **404:** recurso no encontrado.
 */

// -----------------------------------------------------------------------------
// Auth / JWT
// -----------------------------------------------------------------------------

/** Payload JWT decodificado (referencia; el back firma `{ role }`). */
export type JwtPayload = {
  /** Igual a `nombre_rol` en la tabla `rol`, ej. `"Administrador"`. */
  role: string
}

/** POST `/auth/login` (público). `userName` debe coincidir con `usuario.nombre` en BD. */
export type LoginBody = {
  userName: string
  /** mínimo 8 caracteres */
  password: string
}

/** Respuesta típica 200; `data` = nombre del rol; cookie `token` también seteada. */
export type LoginResponse = {
  message?: string
  /** `nombre_rol`, ej. `"Administrador"`. */
  data: string
  session?: string
}

/** DELETE `/auth/logout` — requiere cookie `token`. */
export type LogoutResponse = {
  message?: string
}

// -----------------------------------------------------------------------------
// Roles (BD)
// -----------------------------------------------------------------------------

/** IDs usados en `PATCH /users/:id/role` (body `role`). */
export type RoleId = 1 | 2 | 3 | 4 | 5 | 6 | 7

/** Referencia: `verifyRole` compara el string exacto con `nombre_rol` (ej. `"Administrador"`). */
export const ROLE_BY_ID: Record<RoleId, string> = {
  1: "Administrador",
  2: "Directora de Innovacion",
  3: "Experto en tecnologia extraterrestre",
  4: "Especialista en seguridad",
  5: "Inventor/Tester",
  6: "Gestor de proyectos",
  7: "Usuario",
}

// -----------------------------------------------------------------------------
// Usuarios
// -----------------------------------------------------------------------------

/** POST `/user` — cuerpo en inglés (público en el repo actual). */
export type CreateUserBody = {
  name: string
  age: number
  /** Nombre del rol como en BD, ej. `"Administrador"` (no el número). */
  idrol: string
  pass: string
  authType: string
}

/** GET `/user` — solo rol Administrador (cookie + JWT). */

/** PATCH `/users/:id/role` — solo Administrador; `id` en URL = id numérico del usuario en BD. */
export type PatchUserRoleBody = {
  role: RoleId
}

// -----------------------------------------------------------------------------
// Artefactos (wire / BD)
// -----------------------------------------------------------------------------

/** Origen permitido al crear/editar (enum del API). */
export type Origen = "TERRICOLA" | "SAIYAJIN" | "NAMEKIANO"

/** Confidencialidad (crear, opcional). Si la columna no existe en SQL, el back puede validar y no persistir. */
export type ConfidentialityLevel =
  | "Public"
  | "Restricted"
  | "Confidential"
  | "Ultra-confidential"

/** Fila típica lista/get desde BD (snake_case). */
export type Artifact = {
  id_artefacto: number
  /** 1–5 (1 = sin peligro … 5 = máximo). */
  nivel_peligrosidad: number
  nombre_artefacto: string
  descripcion: string
  /** 1 | 2 | 3 | 4 — mapear etiquetas DEFENSE/TRANSPORT/etc. según convención BD/equipo. */
  id_categoria: number
  /** ≥ 1; significado según tabla `tipo` en BD. */
  id_tipo: number
  origen: string
  estado: boolean
  fecha_creacion: string
}

/** POST `/artifacts` — todos los endpoints de artefactos requieren Administrador + cookie. */
export type CreateArtifactBody = {
  nombre_artefacto: string
  descripcion: string
  /** `"YYYY-MM-DD"`. */
  fecha_creacion: string
  id_tipo: number
  id_categoria: 1 | 2 | 3 | 4
  origen: Origen
  nivel_peligrosidad: 1 | 2 | 3 | 4 | 5
  confidentialityLevel?: ConfidentialityLevel
}

/** PATCH `/artifacts/:id` — al menos un campo. */
export type PatchArtifactBody = {
  nombre_artefacto?: string
  descripcion?: string
  id_categoria?: 1 | 2 | 3 | 4
  origen?: Origen
  nivel_peligrosidad?: 1 | 2 | 3 | 4 | 5
  estado?: boolean
}

/**
 * PATCH `/artifacts/:id/deactivate` — sin body (misma lógica que soft delete).
 * DELETE `/artifacts/:id` — soft delete / desactivar.
 */

/** Error de validación Zod (400). */
export type ApiValidationIssue = {
  field: string
  message: string
}

export type ApiValidationErrorBody = {
  message: ApiValidationIssue[]
}
