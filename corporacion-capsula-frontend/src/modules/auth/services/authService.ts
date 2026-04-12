import { API_URL } from "../../../config/api"
import type { CreateUserBody, LoginBody, LoginResponse } from "../../../types/api.types"

export type { LoginResponse } from "../../../types/api.types"

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
    throw new Error(`HTTP ${response.status}`)
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
