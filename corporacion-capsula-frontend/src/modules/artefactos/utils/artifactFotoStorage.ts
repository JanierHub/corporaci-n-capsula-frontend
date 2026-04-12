import type { Artefacto } from "../types/artefacto.types"

const PREFIX = "capsula-artifact-foto:"

export function getStoredFotoDataUrl(artifactId: number): string | undefined {
  try {
    return localStorage.getItem(`${PREFIX}${artifactId}`) ?? undefined
  } catch {
    return undefined
  }
}

export function setStoredFotoDataUrl(artifactId: number, dataUrl: string | null): void {
  try {
    const key = `${PREFIX}${artifactId}`
    if (dataUrl) localStorage.setItem(key, dataUrl)
    else localStorage.removeItem(key)
  } catch {
    /* quota / private mode */
  }
}

export function mergeFotosFromStorage(items: Artefacto[]): Artefacto[] {
  return items.map((a) => {
    const stored = getStoredFotoDataUrl(a.id)
    if (!stored) return a
    return { ...a, fotoDataUrl: stored }
  })
}
