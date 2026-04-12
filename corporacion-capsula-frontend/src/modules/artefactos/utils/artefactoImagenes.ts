/** Imágenes opcionales por id de artefacto (localStorage; no requiere columna en BD). */
const STORAGE_KEY = "capsule_artefacto_imagenes_v1"
/** ~2 MB en base64 (evita llenar localStorage). */
const MAX_DATA_URL_LENGTH = 2_800_000

type MapType = Record<string, string>

const loadMap = (): MapType => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const p = JSON.parse(raw) as MapType
    return p && typeof p === "object" ? p : {}
  } catch {
    return {}
  }
}

const saveMap = (m: MapType) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(m))
}

export const getImagenArtefacto = (id: number): string | undefined => {
  const v = loadMap()[String(id)]
  return typeof v === "string" && v.startsWith("data:image/") ? v : undefined
}

export const setImagenArtefacto = (id: number, dataUrl: string) => {
  if (dataUrl.length > MAX_DATA_URL_LENGTH) {
    throw new Error("La imagen es demasiado grande (prueba con otra más pequeña).")
  }
  const m = loadMap()
  m[String(id)] = dataUrl
  saveMap(m)
}

export const removeImagenArtefacto = (id: number) => {
  const m = loadMap()
  delete m[String(id)]
  saveMap(m)
}

export const enriquecerArtefactoConImagen = <T extends { id: number }>(
  a: T
): T & { imagenPersonalizada?: string } => ({
  ...a,
  imagenPersonalizada: getImagenArtefacto(a.id),
})
