import { API_URL } from "../../../config/api"
import { Artefacto } from "../types/artefacto.types"

const API = `${API_URL}/artefactos`

type ArtefactoApi = Partial<Artefacto> & {
  id?: number | string
  name?: string
  description?: string
  category?: string
  origin?: string
  dangerLevel?: number | string
  confidentialityLevel?: number | string
  state?: string
  createdAt?: string
  updatedAt?: string
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
  return "defensa"
}

const normalizeOrigen = (value: unknown): Artefacto["origen"] => {
  const origen = String(value ?? "").toLowerCase()
  return origen.includes("extra") ? "extraterrestre" : "terrestre"
}

const normalizeEstado = (value: unknown): NonNullable<Artefacto["estado"]> => {
  const estado = String(value ?? "").toLowerCase()

  if (estado.includes("prueba")) return "en_pruebas"
  if (estado.includes("obsolete") || estado.includes("inactivo") || estado.includes("desactiv") || estado.includes("obsoleto")) {
    return "obsoleto"
  }

  return "activo"
}

export const normalizeArtefacto = (item: ArtefactoApi): Artefacto => ({
  id: Number(item.id ?? 0),
  nombre: item.nombre ?? item.name ?? "Artefacto sin nombre",
  descripcion: item.descripcion ?? item.description ?? "",
  categoria: item.categoria ?? normalizeCategoria(item.category),
  origen: item.origen ?? normalizeOrigen(item.origin),
  nivelPeligrosidad: item.nivelPeligrosidad ?? parseNivel(item.dangerLevel, 1),
  nivelConfidencialidad:
    item.nivelConfidencialidad ?? parseNivel(item.confidentialityLevel, 1),
  estado: item.estado ?? normalizeEstado(item.state),
  inventor: item.inventor ?? "",
  fechaCreacion: item.fechaCreacion ?? item.createdAt ?? "",
  fechaActualizacion: item.fechaActualizacion ?? item.updatedAt ?? "",
})

const artefactosMock: Artefacto[] = [
  normalizeArtefacto({
    id: 1,
    name: "Capsula Hoi Poi",
    description: "Permite almacenar objetos en miniatura",
    category: "TRANSPORT",
    origin: "TERRICOLA",
    dangerLevel: "Low",
    state: "Activo",
    inventor: "Bulma",
    createdAt: "2026-04-10",
  }),
]

export const getArtefactos = async () => {
  try {
    const response = await fetch(API)
    const data = await response.json()
    const payload = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : []

    return payload.map(normalizeArtefacto)
  } catch {
    return artefactosMock
  }
}

export const createArtefacto = async (data: Partial<Artefacto>) => {
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  const payload = await response.json()
  return normalizeArtefacto(payload?.data ?? payload ?? data)
}

export const updateArtefactoRequest = async (id: number, data: Partial<Artefacto>) => {
  const response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  const payload = await response.json()
  return normalizeArtefacto(payload?.data ?? payload ?? { ...data, id })
}

export const deleteArtefacto = async (id: number) => {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE",
  })
  return response.json()
}
