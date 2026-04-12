import { API_URL } from "../../../config/api"
import type { CreateUserBody, LoginBody, LoginResponse } from "../../../types/api.types"

export type { LoginResponse } from "../../../types/api.types"

const parseErrorMessage = (payload: unknown, fallback: string) => {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    Array.isArray(payload.message)
  ) {
    const issues = payload.message
      .map((issue) => {
        if (!issue || typeof issue !== "object") return null
        const field = "field" in issue ? String(issue.field ?? "") : ""
        const message = "message" in issue ? String(issue.message ?? "") : ""
        return [field, message].filter(Boolean).join(": ")
      })
      .filter(Boolean)

    if (issues.length > 0) {
      return issues.join(" | ")
    }
  }

  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string" &&
    payload.message.trim()
  ) {
    return payload.message
  }

  return fallback
}

const requestJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    let payload: unknown = null
    try {
      payload = await response.json()
    } catch {
      payload = null
    }

    throw new Error(parseErrorMessage(payload, `HTTP ${response.status}`))
  }

  return response.json()
}

export const getUsers = async () => {
  return requestJson(`${API_URL}/user`)
}

/**
 * Login según backend: cookie `token` (JWT). Cuerpo: `userName` + `password` (mín. 8 caracteres).
 * Tras login, las rutas protegidas (p. ej. desactivar artefacto) envían la cookie automáticamente con `credentials: "include"`.
 */
export const loginUser = async (data: LoginBody): Promise<LoginResponse> => {
  return requestJson<LoginResponse>(`${API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export const logoutUser = async () => {
  return requestJson(`${API_URL}/auth/logout`, {
    method: "DELETE",
  })
}

/** POST `/user` — ver `CreateUserBody` en `api.types.ts`. */
export const createUser = async (data: CreateUserBody) => {
  return requestJson(`${API_URL}/user`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}
