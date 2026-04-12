import { API_URL } from "../../../config/api"
import { Artefacto } from "../types/artefacto.types"
import { categoriaToIdCategoria, idCategoriaToCategoria } from "../utils/artifactMaps"

/**
 * Artefactos: `GET/POST/PATCH /api/v1/artifacts`, desactivar `PATCH /artifacts/:id/deactivate` (equipo).
 * Si no existe esa ruta, se intenta `DELETE /artifacts/:id` como respaldo.
 */
const ARTIFACTS_URL = `${API_URL}/artifacts`
const REQUEST_TIMEOUT = 5000

type ArtefactoApi = Partial<Artefacto> & {
  id?: number | string
  id_artefacto?: number | string
  artifactId?: number | string
  codigo?: string
  code?: string
  name?: string
  nombre_artefacto?: string
  nombre_Artefacto?: string
  description?: string
  descripcion?: string
  descripcion_Artefacto?: string
  category?: string
  categoria?: string
  id_categoria?: number | string
  origen?: string
  origin?: string
  source?: string
  dangerLevel?: number | string
  nivel_peligrosidad?: number | string
  nivelConfidencialidad?: number | string
  confidentialityLevel?: string
  nivel_confidencialidad?: number | string
  confidentiality_level?: number | string
  state?: string | boolean
  estado?: string | boolean
  status?: string | boolean
  id_tipo?: number | string
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
  id_usuario?: string | number
  fotoDataUrl?: string
}

const parseNivel = (value: unknown, fallback: number) => {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const numeric = Number(value)
    if (!Number.isNaN(numeric)) return numeric

    const mapped: Record<string, number> = {
      low: 1,
      mid: 2,
      medium: 2,
      high: 3,
      restricted: 2,
      confidential: 3,
      "ultra-confidential": 4,
      public: 1,
    }

    return mapped[value.toLowerCase()] ?? fallback
  }

  return fallback
}

const today = () => new Date().toISOString().split("T")[0]

/** Backend crea con `YYYY-MM-DD`; la BD puede devolver `dd/mm/aaaa`. */
const normalizeFechaCreacion = (value?: string): string => {
  if (!value) return today()
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10)
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [d, m, y] = value.split("/")
    return `${y}-${m}-${d}`
  }
  return today()
}

const normalizeCategoria = (value: unknown): Artefacto["categoria"] => {
  if (value === undefined || value === null || value === "") return "defensa"
  if (typeof value === "number" || /^\d+$/.test(String(value))) {
    return idCategoriaToCategoria(value)
  }

  const categoria = String(value ?? "").toLowerCase()

  if (categoria.includes("transport")) return "transporte"
  if (categoria.includes("domestic")) return "domestico"
  if (categoria.includes("energy")) return "energia"
  return "defensa"
}

const normalizeOrigen = (value: unknown): Artefacto["origen"] => {
  const origen = String(value ?? "").toLowerCase()
  if (origen.includes("saiya")) return "saiyajin"
  if (origen.includes("name")) return "namekiano"
  return origen.includes("extra") ? "extraterrestre" : "terrestre"
}

const normalizeEstado = (value: unknown): NonNullable<Artefacto["estado"]> => {
  if (typeof value === "boolean") {
    return value ? "activo" : "obsoleto"
  }

  const estado = String(value ?? "").toLowerCase()
  if (estado.includes("prueba")) return "en_pruebas"
  if (estado.includes("inactivo") || estado.includes("obsoleto") || estado.includes("desactiv")) {
    return "obsoleto"
  }

  return "activo"
}

const origenToBackend = (value?: Partial<Artefacto>["origen"]) => {
  switch (value) {
    case "saiyajin":
      return "SAIYAJIN"
    case "namekiano":
      return "NAMEKIANO"
    case "terrestre":
    case "extraterrestre":
    default:
      return "TERRICOLA"
  }
}

const confidentialityToBackend = (value?: number) => {
  switch (value) {
    case 2:
      return "Restricted"
    case 3:
      return "Confidential"
    case 4:
      return "Ultra-confidential"
    case 1:
    default:
      return "Public"
  }
}

const estadoToBackendBoolean = (estado?: Artefacto["estado"]): boolean =>
  estado !== undefined && estado !== "obsoleto"

export const normalizeArtefacto = (item: ArtefactoApi): Artefacto => ({
  id: Number(item.id ?? item.id_artefacto ?? item.artifactId ?? 0),
  nombre:
    item.nombre ??
    item.nombre_artefacto ??
    item.nombre_Artefacto ??
    item.name ??
    "Artefacto sin nombre",
  descripcion: item.descripcion ?? item.descripcion_Artefacto ?? item.description ?? "",
  codigo: item.codigo ?? item.code ?? "",
  tipoArtefacto: item.id_tipo !== undefined ? String(item.id_tipo) : "",
  idUsuario: item.id_usuario ? String(item.id_usuario) : "",
  categoria: normalizeCategoria(item.id_categoria ?? item.categoria ?? item.category),
  origen: normalizeOrigen(item.origen ?? item.origin ?? item.source),
  nivelPeligrosidad: parseNivel(item.nivelPeligrosidad ?? item.dangerLevel ?? item.nivel_peligrosidad, 1),
  nivelConfidencialidad: parseNivel(
    item.nivelConfidencialidad ?? item.confidentialityLevel ?? item.nivel_confidencialidad ?? item.confidentiality_level,
    1
  ),
  estado: normalizeEstado(item.estado ?? item.state ?? item.status),
  inventor: item.inventor ?? item.creator ?? item.createdBy ?? item.nombre_usuario ?? "",
  fechaCreacion: normalizeFechaCreacion(item.fechaCreacion ?? item.fecha_creacion ?? item.createdAt),
  fechaActualizacion: normalizeFechaCreacion(item.fechaActualizacion ?? item.fecha_actualizacion ?? item.updatedAt),
  fotoDataUrl: item.fotoDataUrl,
})

const artefactosMock: Artefacto[] = [
  normalizeArtefacto({
    id_artefacto: 1,
    nombre_artefacto: "Capsula Hoi Poi",
    descripcion: "Permite almacenar objetos en miniatura",
    id_categoria: 2,
    origen: "TERRICOLA",
    nivel_peligrosidad: 1,
    estado: true,
    fecha_creacion: "2026-01-12",
    id_tipo: 1,
  }),
]

const fetchWithTimeout = async (input: RequestInfo | URL, init?: RequestInit) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    return await fetch(input, {
      credentials: "include",
      ...init,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeoutId)
  }
}

const parseJsonSafely = async (response: Response) => {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/** POST `createArtifactSchema`: fechas `YYYY-MM-DD`, `id_categoria` 1–4, `origen` enum backend. */
const toCreatePayload = (data: Partial<Artefacto>) => {
  const fecha =
    data.fechaCreacion && /^\d{4}-\d{2}-\d{2}$/.test(data.fechaCreacion) ? data.fechaCreacion : today()

  return {
    nombre_artefacto: data.nombre ?? "",
    descripcion: data.descripcion ?? "",
    fecha_creacion: fecha,
    id_tipo: Math.max(1, Number(data.tipoArtefacto ?? 1)),
    id_categoria: categoriaToIdCategoria(data.categoria),
    origen: origenToBackend(data.origen),
    nivel_peligrosidad: Math.min(5, Math.max(1, Number(data.nivelPeligrosidad ?? 1))) as 1 | 2 | 3 | 4 | 5,
    confidentialityLevel: confidentialityToBackend(data.nivelConfidencialidad),
  }
}

/** PATCH `patchArtifactSchema`: snake_case, coincide con `artifactModel.updateArtifact`. */
const toUpdatePayload = (data: Partial<Artefacto>): Record<string, unknown> => {
  const payload: Record<string, unknown> = {}

  if (data.nombre !== undefined) payload.nombre_artefacto = data.nombre
  if (data.descripcion !== undefined) payload.descripcion = data.descripcion
  if (data.categoria !== undefined) payload.id_categoria = categoriaToIdCategoria(data.categoria)
  if (data.origen !== undefined) payload.origen = origenToBackend(data.origen)
  if (data.nivelPeligrosidad !== undefined) {
    payload.nivel_peligrosidad = Math.min(5, Math.max(1, Number(data.nivelPeligrosidad)))
  }
  if (data.estado !== undefined) {
    payload.estado = estadoToBackendBoolean(data.estado)
  }

  return payload
}

const unwrapArtifactBody = (payload: Record<string, unknown> | null): ArtefactoApi =>
  (payload?.data ?? payload) as ArtefactoApi

export const getArtefactos = async () => {
  try {
    const response = await fetchWithTimeout(ARTIFACTS_URL, { method: "GET" })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await parseJsonSafely(response)
    const payload = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.artifacts)
          ? data.artifacts
          : Array.isArray(data?.artefactos)
            ? data.artefactos
            : []

    return payload.map(normalizeArtefacto).filter((item: Artefacto) => item.id > 0)
  } catch {
    return artefactosMock
  }
}

export const createArtefacto = async (data: Partial<Artefacto>) => {
  const response = await fetchWithTimeout(ARTIFACTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toCreatePayload(data)),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const payload = (await parseJsonSafely(response)) as Record<string, unknown> | null
  const inner = unwrapArtifactBody(payload)
  return normalizeArtefacto({
    nombre_artefacto: data.nombre,
    descripcion: data.descripcion,
    id_categoria: categoriaToIdCategoria(data.categoria),
    origen: origenToBackend(data.origen),
    nivel_peligrosidad: data.nivelPeligrosidad,
    fotoDataUrl: data.fotoDataUrl,
    ...inner,
  })
}

export const updateArtefactoRequest = async (id: number, data: Partial<Artefacto>) => {
  const { fotoDataUrl: _foto, ...rest } = data
  const body = toUpdatePayload(rest)
  if (Object.keys(body).length === 0) {
    return normalizeArtefacto({
      id_artefacto: id,
      nombre: data.nombre,
      nombre_artefacto: data.nombre,
      descripcion: data.descripcion,
      id_categoria: data.categoria ? categoriaToIdCategoria(data.categoria) : undefined,
      origen: data.origen ? origenToBackend(data.origen) : undefined,
      nivel_peligrosidad: data.nivelPeligrosidad,
      estado: data.estado !== undefined ? estadoToBackendBoolean(data.estado) : undefined,
      fotoDataUrl: data.fotoDataUrl ?? undefined,
      fechaActualizacion: today(),
    })
  }

  try {
    const response = await fetchWithTimeout(`${ARTIFACTS_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const payload = (await parseJsonSafely(response)) as Record<string, unknown> | null
    const inner = unwrapArtifactBody(payload)
    return normalizeArtefacto({
      ...data,
      id_artefacto: id,
      ...inner,
    })
  } catch {
    return normalizeArtefacto({
      id_artefacto: id,
      nombre: data.nombre,
      nombre_artefacto: data.nombre,
      descripcion: data.descripcion,
      id_categoria: data.categoria ? categoriaToIdCategoria(data.categoria) : undefined,
      origen: data.origen ? origenToBackend(data.origen) : undefined,
      nivel_peligrosidad: data.nivelPeligrosidad,
      estado: data.estado !== undefined ? estadoToBackendBoolean(data.estado) : undefined,
      fechaActualizacion: today(),
    })
  }
}

/** Desactivar: `PATCH /artifacts/:id/deactivate` (cookie JWT si la ruta está protegida). */
export const deactivateArtefactoRequest = async (id: number) => {
  let response = await fetchWithTimeout(`${ARTIFACTS_URL}/${id}/deactivate`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  })

  if (!response.ok && response.status === 404) {
    response = await fetchWithTimeout(`${ARTIFACTS_URL}/${id}`, { method: "DELETE" })
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const payload = (await parseJsonSafely(response)) as Record<string, unknown> | null
  const inner = unwrapArtifactBody(payload)
  return normalizeArtefacto({
    ...inner,
    id_artefacto: id,
    estado: false,
  })
}

/** Reactivar: `PATCH /artifacts/:id/activate` si existe; si no, `PATCH /artifacts/:id` con `estado: true`. */
export const activateArtefactoRequest = async (id: number) => {
  let response = await fetchWithTimeout(`${ARTIFACTS_URL}/${id}/activate`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  })

  if (!response.ok && (response.status === 404 || response.status === 405)) {
    return updateArtefactoRequest(id, { estado: "activo" })
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const payload = (await parseJsonSafely(response)) as Record<string, unknown> | null
  const inner = unwrapArtifactBody(payload)
  return normalizeArtefacto({
    ...inner,
    id_artefacto: id,
    estado: true,
  })
}
