import { API_URL } from "../../../config/api"
import { getAuthCredentials } from "../../auth/utils/roles"
import { Artefacto } from "../types/artefacto.types"
import { enriquecerArtefactoConImagen } from "../utils/artefactoImagenes"

/** El backend expone `artifacts` (401 sin token); `artefactos` suele ser 404. */
const API_CANDIDATES = [`${API_URL}/artifacts`, `${API_URL}/artefactos`]
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
  id_tipo?: number | string
  origin?: string
  origen?: string
  source?: string
  dangerLevel?: number | string
  nivel_peligrosidad?: number | string
  confidentialityLevel?: number | string
  nivel_confidencialidad?: number | string
  confidentiality_level?: number | string
  state?: string
  estado?: string | boolean
  status?: string
  nombre_artefacto?: string
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

/** `id_categoria` en BD (backend artifactSchema categoryEnum 1–4). */
const categoriaFromId = (id: unknown): Artefacto["categoria"] | undefined => {
  const n = typeof id === "string" ? Number(id) : typeof id === "number" ? id : NaN
  if (Number.isNaN(n)) return undefined
  const map: Record<number, Artefacto["categoria"]> = {
    1: "transporte",
    2: "domestico",
    3: "energia",
    4: "defensa",
  }
  return map[n]
}

const normalizeOrigen = (value: unknown): Artefacto["origen"] => {
  const origen = String(value ?? "").toLowerCase()
  if (origen.includes("terri")) return "terrestre"
  return origen.includes("extra") ? "extraterrestre" : "terrestre"
}

const normalizeEstado = (value: unknown): NonNullable<Artefacto["estado"]> => {
  // Priorizar booleanos del backend
  if (value === false) return "obsoleto"
  if (value === true) return "activo"
  
  // Manejar strings
  const estado = String(value ?? "").toLowerCase()
  if (estado.includes("prueba")) return "en_pruebas"
  if (estado.includes("obsoleto") || estado.includes("inactive") || estado === "false") return "obsoleto"
  if (estado.includes("activo") || estado.includes("active") || estado === "true") return "activo"
  
  // Default a activo si no se puede determinar
  return "activo"
}

export const normalizeArtefacto = (item: ArtefactoApi): Artefacto => {
  const rawOrigen =
    typeof item.origen === "string" && item.origen.trim()
      ? item.origen.trim()
      : undefined
  const idCat =
    typeof item.id_categoria === "number"
      ? item.id_categoria
      : typeof item.id_categoria === "string"
        ? Number(item.id_categoria)
        : undefined
  const idTipoNum =
    typeof item.id_tipo === "number"
      ? item.id_tipo
      : typeof item.id_tipo === "string"
        ? Number(item.id_tipo)
        : undefined

  return {
    id: Number(item.id ?? item.artifactId ?? item.id_artefacto ?? 0),
    nombre:
      item.nombre ??
      item.name ??
      item.nombre_artefacto ??
      item.nombre_Artefacto ??
      "Artefacto sin nombre",
    descripcion: item.descripcion ?? item.description ?? "",
    categoria:
      item.categoria ??
      categoriaFromId(item.id_categoria) ??
      normalizeCategoria(item.category),
    origen: rawOrigen
      ? normalizeOrigen(rawOrigen)
      : item.origen
        ? normalizeOrigen(item.origen)
        : normalizeOrigen(item.origin),
    origenDb: rawOrigen,
    nivelPeligrosidad: parseNivel(item.dangerLevel ?? item.nivel_peligrosidad, 1),
    nivelConfidencialidad: parseNivel(
      item.confidentialityLevel ?? item.nivel_confidencialidad,
      1
    ),
    estado:
      typeof item.estado === "boolean"
        ? normalizeEstado(item.estado)
        : item.estado ?? normalizeEstado(item.state ?? item.status),
    inventor: item.inventor ?? item.creator ?? "",
    fechaCreacion:
      item.fechaCreacion ?? item.createdAt ?? item.fecha_creacion ?? "",
    fechaActualizacion:
      item.fechaActualizacion ?? item.updatedAt ?? item.fecha_actualizacion ?? "",
    idCategoria: Number.isFinite(idCat as number) ? idCat : undefined,
    idTipo: Number.isFinite(idTipoNum as number) ? idTipoNum : undefined,
  }
}

const artefactosMock: Artefacto[] = [
  normalizeArtefacto({
    id: 1,
    nombre: "Capsula Hoi Poi",
    descripcion: "Permite almacenar objetos en miniatura",
    categoria: "transporte",
    origen: "terrestre",
    nivel_peligrosidad: 1,
    estado: "activo",
    inventor: "Bulma",
    fecha_creacion: "2026-04-10",
  }),
  normalizeArtefacto({
    id: 2,
    nombre: "Scouter",
    descripcion: "Dispositivo de detección de energía",
    categoria: "defensa",
    origen: "extraterrestre",
    nivel_peligrosidad: 2,
    estado: "activo",
    inventor: "Freezer",
    fecha_creacion: "2026-04-11",
  }),
  normalizeArtefacto({
    id: 3,
    nombre: "Varita Mágica",
    descripcion: "Transforma objetos en conejos",
    categoria: "domestico",
    origen: "terrestre",
    nivel_peligrosidad: 1,
    estado: "obsoleto",
    inventor: "Bulma",
    fecha_creacion: "2026-04-12",
  }),
  normalizeArtefacto({
    id: 4,
    nombre: "Espada Z",
    descripcion: "Arma legendaria de los saiyajin",
    categoria: "defensa",
    origen: "extraterrestre",
    nivel_peligrosidad: 3,
    estado: "obsoleto",
    inventor: "Kaioshin",
    fecha_creacion: "2026-04-13",
  }),
]

const fetchWithTimeout = async (input: RequestInfo | URL, init?: RequestInit) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
  const headers = new Headers(init?.headers)
  
  // La autenticación se maneja por cookies, no por headers
  // El backend lee el token desde req.cookies.token

  try {
    return await fetch(input, {
      ...init,
      credentials: "include", // Enviar cookies para autenticación (backend usa req.cookies.token)
      headers,
      signal: controller.signal,
    })
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
      if (res.status !== 404) return res
    } catch {}
  }
  throw new Error("No API disponible")
}

// 🔥 SOLO USA API REAL - NO MOCKS
export const getArtefactos = async (): Promise<Artefacto[]> => {
  try {
    console.log("🔍 Intentando cargar artefactos...")
    console.log("🌐 API_URL:", API_URL)
    console.log("🔗 Candidatos:", API_CANDIDATES)
    
    const response = await requestFirstAvailable()
    console.log("📡 Response status:", response.status, response.url)

    if (!response.ok) {
      const body = await parseJsonSafely(response)
      console.error("❌ Error API:", response.status, body)
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await parseJsonSafely(response)
    console.log("📦 Raw data:", data)

    const extractPayload = (raw: unknown): unknown[] => {
      if (Array.isArray(raw)) return raw
      if (!raw || typeof raw !== "object") return []
      const o = raw as Record<string, unknown>
      const keys = [
        "data",
        "artifacts",
        "artefactos",
        "rows",
        "items",
        "results",
        "result",
        "records",
      ] as const
      for (const k of keys) {
        const v = o[k]
        if (Array.isArray(v)) return v
      }
      const nested = o.data ?? o.payload
      if (nested && typeof nested === "object" && !Array.isArray(nested)) {
        const inner = extractPayload(nested)
        if (inner.length > 0) return inner
      }
      return []
    }

    const payload = extractPayload(data)
    console.log("✅ Payload extraído:", payload.length, "items")

    if (!payload || payload.length === 0) {
      console.warn("⚠️ API devolvió lista vacía")
      return []
    }

    console.log("✅ Artefactos cargados desde API:", payload.length)
    return (payload as any[]).map(normalizeArtefacto).map(enriquecerArtefactoConImagen)

  } catch (error) {
    console.error("❌ Error cargando artefactos:", error)
    throw error
  }
}

const extractCreateError = (payload: unknown) => {
  if (payload && typeof payload === "object" && "message" in payload) {
    const m = (payload as { message: unknown }).message
    if (typeof m === "string" && m.trim()) return m
    if (Array.isArray(m)) {
      const parts = m
        .map((item) => {
          if (!item || typeof item !== "object") return null
          const field = "field" in item ? String((item as { field?: string }).field ?? "") : ""
          const msg = "message" in item ? String((item as { message?: string }).message ?? "") : ""
          return [field, msg].filter(Boolean).join(": ")
        })
        .filter(Boolean)
      if (parts.length) return parts.join(" | ")
    }
  }
  return "No se pudo crear el artefacto"
}

/** POST al backend; devuelve el `id_artefacto` creado o null. */
export const createArtefacto = async (
  data: Partial<Artefacto> & { imagenDataUrl?: string | null }
): Promise<number | null> => {
  const { imagenDataUrl: _img, ...fields } = data
  const rawFecha = (fields.fechaCreacion ?? "").trim().slice(0, 10)
  const fechaCreacion = /^\d{4}-\d{2}-\d{2}$/.test(rawFecha)
    ? rawFecha
    : new Date().toISOString().slice(0, 10)

  const idCat = fields.idCategoria ?? 1
  const idTipo = fields.idTipo ?? 1
  const np = fields.nivelPeligrosidad ?? 1
  const o = (fields.origenDb ?? "TERRICOLA").toUpperCase()
  const origen =
    o === "TERRICOLA" || o === "SAIYAJIN" || o === "NAMEKIANO" ? o : "TERRICOLA"

  const nombre = fields.nombre?.trim() ?? ""
  const descripcion = fields.descripcion?.trim() ?? ""
  if (!nombre || !descripcion) {
    throw new Error("Nombre y descripción son obligatorios.")
  }

  const body = {
    nombre_artefacto: nombre,
    descripcion,
    fecha_creacion: fechaCreacion,
    id_tipo: idTipo,
    id_categoria: idCat,
    origen,
    nivel_peligrosidad: np,
  }

  const res = await fetchWithTimeout(`${API_URL}/artifacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await parseJsonSafely(res)
    console.error("POST artefacto:", res.status, err)
    throw new Error(extractCreateError(err))
  }

  const raw = await parseJsonSafely(res)
  const row =
    raw &&
    typeof raw === "object" &&
    "data" in raw &&
    (raw as { data?: unknown }).data &&
    typeof (raw as { data: unknown }).data === "object"
      ? (raw as { data: ArtefactoApi }).data
      : null
  if (row && typeof row === "object") {
    const nid = Number((row as ArtefactoApi).id_artefacto ?? (row as ArtefactoApi).id ?? 0)
    return Number.isFinite(nid) && nid > 0 ? nid : null
  }
  return null
}

export const fetchArtefactoById = async (id: number): Promise<Artefacto | null> => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/artifacts/${id}`)
    if (!res.ok) return null
    const raw = await parseJsonSafely(res)
    if (!raw || typeof raw !== "object") return null
    return enriquecerArtefactoConImagen(normalizeArtefacto(raw as ArtefactoApi))
  } catch {
    return null
  }
}

type PatchBody = {
  nombre_artefacto?: string
  descripcion?: string
  id_categoria?: number
  origen?: string
  nivel_peligrosidad?: number
  estado?: boolean
}

const estadoToBool = (e: Artefacto["estado"] | undefined): boolean | undefined => {
  if (e === undefined) return undefined
  // Convertir strings del frontend a booleanos del backend
  return e === "activo" ? true : false
}

export const updateArtefactoRequest = async (
  id: number,
  data: Partial<Artefacto> & { imagenDataUrl?: string | null }
) => {
  const { imagenDataUrl: _i, ...patch } = data
  const body: PatchBody = {}
  if (patch.nombre !== undefined) body.nombre_artefacto = patch.nombre
  if (patch.descripcion !== undefined) body.descripcion = patch.descripcion
  if (patch.idCategoria !== undefined) body.id_categoria = patch.idCategoria
  if (patch.origenDb !== undefined) body.origen = patch.origenDb
  if (patch.nivelPeligrosidad !== undefined) body.nivel_peligrosidad = patch.nivelPeligrosidad
  const est = estadoToBool(patch.estado)
  if (est !== undefined) body.estado = est

  try {
    const res = await fetchWithTimeout(`${API_URL}/artifacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const errBody = await parseJsonSafely(res)
      console.error("PATCH artefacto:", res.status, errBody)
      return normalizeArtefacto({ ...patch, id } as ArtefactoApi)
    }
    const raw = await parseJsonSafely(res)
    const row =
      raw &&
      typeof raw === "object" &&
      "data" in raw &&
      (raw as { data?: unknown }).data &&
      typeof (raw as { data?: unknown }).data === "object"
        ? (raw as { data: ArtefactoApi }).data
        : raw
    if (row && typeof row === "object") {
      return normalizeArtefacto(row as ArtefactoApi)
    }
  } catch (e) {
    console.error("updateArtefactoRequest", e)
  }
  return normalizeArtefacto({ ...patch, id } as ArtefactoApi)
}

export const deleteArtefacto = async (id: number): Promise<Artefacto | null> => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/artifacts/${id}`, {
      method: "DELETE",
    })
    if (!res.ok) {
      const errBody = await parseJsonSafely(res)
      console.error("DELETE artefacto:", res.status, errBody)
      return null
    }
    const raw = await parseJsonSafely(res)
    const row =
      raw &&
      typeof raw === "object" &&
      "data" in raw &&
      (raw as { data?: unknown }).data &&
      typeof (raw as { data?: unknown }).data === "object"
        ? (raw as { data: ArtefactoApi }).data
        : raw
    if (row && typeof row === "object") {
      return normalizeArtefacto(row as ArtefactoApi)
    }
  } catch (e) {
    console.error("deleteArtefacto", e)
  }
  return null
}

// HU-08: Filtros de artefactos backend-driven
export interface ArtefactoFilters {
  categoria?: string
  origen?: string
  nivel_confidencialidad?: number
  nivel_peligrosidad?: number
  estado?: boolean
  busqueda?: string
}

export const searchArtefactos = async (filters: ArtefactoFilters): Promise<Artefacto[]> => {
  try {
    // Construir query params
    const params = new URLSearchParams()
    if (filters.categoria && filters.categoria !== "todas") {
      params.append("categoria", filters.categoria)
    }
    if (filters.origen && filters.origen !== "todos") {
      params.append("origen", filters.origen)
    }
    if (filters.nivel_confidencialidad !== undefined) {
      params.append("nivel_confidencialidad", String(filters.nivel_confidencialidad))
    }
    if (filters.nivel_peligrosidad !== undefined) {
      params.append("nivel_peligrosidad", String(filters.nivel_peligrosidad))
    }
    if (filters.estado !== undefined) {
      params.append("estado", String(filters.estado))
    }
    if (filters.busqueda) {
      params.append("q", filters.busqueda)
    }

    const queryString = params.toString()
    const url = `${API_URL}/artifacts${queryString ? `?${queryString}` : ""}`
    
    console.log("🔍 Buscando artefactos con filtros:", url)
    
    const res = await fetchWithTimeout(url)
    
    if (!res.ok) {
      const body = await parseJsonSafely(res)
      console.error("❌ Error API filtros:", res.status, body)
      // Si el backend no soporta filtros, retornar todos y filtrar localmente
      return getArtefactos()
    }

    const data = await parseJsonSafely(res)
    
    const extractPayload = (raw: unknown): unknown[] => {
      if (Array.isArray(raw)) return raw
      if (!raw || typeof raw !== "object") return []
      const o = raw as Record<string, unknown>
      const keys = ["data", "artifacts", "artefactos", "rows", "items", "results", "result", "records"]
      for (const k of keys) {
        const v = o[k]
        if (Array.isArray(v)) return v
      }
      return []
    }

    const payload = extractPayload(data)
    console.log("✅ Artefactos filtrados:", payload.length)
    
    return (payload as any[]).map(normalizeArtefacto).map(enriquecerArtefactoConImagen)
  } catch (error) {
    console.error("❌ Error en búsqueda con filtros:", error)
    // Fallback: retornar todos los artefactos
    return getArtefactos()
  }
}
