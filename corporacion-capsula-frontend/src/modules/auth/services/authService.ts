import { API_URL } from "../../../config/api"

export type LoginBody = {
  userName: string
  password: string
}

export type LoginResponse = {
  message?: string
  messageError?: string
  data?: string
  session?: string
  token?: string
  rol?: string
  nombreRol?: string
}

export type CreateUserBody = {
  nombre: string
  edad: number
  contraseña: string
  rol: number
}

const extractErrorMessage = (payload: unknown, fallback: string) => {
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
    "messageError" in payload &&
    typeof payload.messageError === "string" &&
    payload.messageError.trim()
  ) {
    return payload.messageError
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
    credentials: "include", // Enviar cookies para autenticación (backend usa req.cookies.token)
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  let payload: unknown = null

  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new Error(extractErrorMessage(payload, `HTTP ${response.status}`))
  }

  return payload as T
}

export const loginUser = async (data: LoginBody) => {
  return requestJson<LoginResponse>(`${API_URL}/session`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export const createUser = async (data: CreateUserBody) => {
  return requestJson(`${API_URL}/user`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export const logoutUser = async () => {
  return requestJson(`${API_URL}/session`, {
    method: "DELETE",
  })
}
