import { API_URL } from "../../../config/api"
import { Artefacto } from "../types/artefacto.types"

const API_CANDIDATES = [`${API_URL}/artefactos`, `${API_URL}/artifacts`]
const REQUEST_TIMEOUT = 5000

type ArtefactoApi = Partial<Artefacto> & {
  id?: number | string
  artifactId?: number | string
  id_artefacto?: number | string
  name?: string
  nombre_Artefacto?: string
  description?: string
  descripcion?: string
  descripcion_Artefacto?: string
  category?: string
  categoria?: string
  categoriaNombre?: string
  categoryName?: string
  id_categoria?: number | string
  origin?: string
  origen?: string
  source?: string
  dangerLevel?: number | string
  nivel_peligrosidad?: number | string
  confidentialityLevel?: number | string
  nivel_confidencialidad?: number | string
  confidentiality_level?: number | string
  state?: string
  estado?: string
  status?: string
  createdAt?: string
  fecha_creacion?: string
  fechaCreacion?: string
  updatedAt?: string
  fecha_actualizacion?: string
  fechaActualizacion?: string
  inventor?: string
  creator?: string
  createdBy?: string
  nombre_usuario?: string
}

const parseNivel = (value: unknown, fallback: number) => {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const numeric = Number(value)
    if (!Number.isNaN(numeric)) return numeric

    const mapped: Record<string, number> = {
      low: 1,
      medium: 2,
      high: 3,
    }

    return mapped[value.toLowerCase()] ?? fallback
  }
  return fallback
}

const normalizeCategoria = (value: unknown): Artefacto["categoria"] => {
  const categoria = String(value ?? "").toLowerCase()
  if (categoria.includes("transport")) return "transporte"
  if (categoria.includes("domestic")) return "domestico"
  if (categoria.includes("energy")) return "energia"
  if (categoria.includes("hogar")) return "domestico"
  return "defensa"
}

const normalizeOrigen = (value: unknown): Artefacto["origen"] => {
  const origen = String(value ?? "").toLowerCase()
  if (origen.includes("terri")) return "terrestre"
  return origen.includes("extra") ? "extraterrestre" : "terrestre"
}

const normalizeEstado = (value: unknown): NonNullable<Artefacto["estado"]> => {
  const estado = String(value ?? "").toLowerCase()
  if (estado.includes("prueba")) return "en_pruebas"
  if (estado.includes("obsoleto") || estado.includes("inactive")) return "obsoleto"
  return "activo"
}

export const normalizeArtefacto = (item: ArtefactoApi): Artefacto => ({
  id: Number(item.id ?? item.artifactId ?? item.id_artefacto ?? 0),
  nombre: item.nombre ?? item.name ?? "Artefacto sin nombre",
  descripcion: item.descripcion ?? item.description ?? "",
  categoria: item.categoria ?? normalizeCategoria(item.category),
  origen: item.origen ?? normalizeOrigen(item.origin),
  nivelPeligrosidad: parseNivel(item.dangerLevel ?? item.nivel_peligrosidad, 1),
  nivelConfidencialidad: parseNivel(item.confidentialityLevel ?? item.nivel_confidencialidad, 1),
  estado: item.estado ?? normalizeEstado(item.state),
  inventor: item.inventor ?? item.creator ?? "",
  fechaCreacion: item.fechaCreacion ?? item.createdAt ?? "",
  fechaActualizacion: item.fechaActualizacion ?? item.updatedAt ?? "",
})

const artefactosMock: Artefacto[] = [
  normalizeArtefacto({
    id: 1,
    name: "Capsula Hoi Poi",
    description: "Permite almacenar objetos en miniatura",
    category: "transport",
    origin: "terrestre",
    dangerLevel: "low",
    state: "activo",
    inventor: "Bulma",
    createdAt: "2026-04-10",
  }),
]

const fetchWithTimeout = async (input: RequestInfo | URL, init?: RequestInit) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
}

const parseJsonSafely = async (response: Response) => {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

const requestFirstAvailable = async () => {
  for (const baseUrl of API_CANDIDATES) {
    try {
      const res = await fetchWithTimeout(baseUrl)
      if (res.ok) return res
    } catch {}
  }
  throw new Error("No API disponible")
}

// 🔥 CORREGIDO
export const getArtefactos = async (): Promise<Artefacto[]> => {
  try {
    const response = await requestFirstAvailable()
    const data = await parseJsonSafely(response)

    console.log("DATA API:", data)

    const payload =
      Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.artifacts)
        ? data.artifacts
        : Array.isArray(data?.artefactos)
        ? data.artefactos
        : []

    if (!payload || payload.length === 0) {
      console.warn("Usando mock porque API está vacía")
      return artefactosMock
    }

    return payload.map(normalizeArtefacto)

  } catch (error) {
    console.error("Error API:", error)
    return artefactosMock
  }
}

export const createArtefacto = async (data: Partial<Artefacto>) => {
  return normalizeArtefacto({ ...data, id: Date.now() })
}

export const updateArtefactoRequest = async (id: number, data: Partial<Artefacto>) => {
  return normalizeArtefacto({ ...data, id })
}

export const deleteArtefacto = async () => {
  return true
}