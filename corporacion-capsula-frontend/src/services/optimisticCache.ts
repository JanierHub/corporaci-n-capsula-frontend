/**
 * Optimistic Cache Service
 * Estrategia: UI primero, backend segundo
 * - Muestra datos inmediatamente desde localStorage
 * - Sincroniza con backend en segundo plano
 * - Pre-fetch después del login
 */

const CACHE_PREFIX = "capsule_cache_"
const CACHE_EXPIRY = 1000 * 60 * 30 // 30 minutos

interface CacheItem<T> {
  data: T
  timestamp: number
  synced: boolean // Indica si está sincronizado con backend
}

// Guardar en caché
export const setCache = <T>(key: string, data: T, synced = false): void => {
  const item: CacheItem<T> = {
    data,
    timestamp: Date.now(),
    synced
  }
  localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item))
}

// Obtener de caché
export const getCache = <T>(key: string): T | null => {
  const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`)
  if (!raw) return null
  
  try {
    const item: CacheItem<T> = JSON.parse(raw)
    const isExpired = Date.now() - item.timestamp > CACHE_EXPIRY
    
    if (isExpired && !item.synced) {
      // Si expiró y no está sincronizado, eliminar
      localStorage.removeItem(`${CACHE_PREFIX}${key}`)
      return null
    }
    
    return item.data
  } catch {
    return null
  }
}

// Verificar si hay datos en caché
export const hasCache = (key: string): boolean => {
  return getCache(key) !== null
}

// Marcar como sincronizado con backend
export const markSynced = (key: string): void => {
  const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`)
  if (!raw) return
  
  try {
    const item: CacheItem<unknown> = JSON.parse(raw)
    item.synced = true
    item.timestamp = Date.now()
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item))
  } catch {
    // Silenciar errores
  }
}

// Limpiar caché específico
export const clearCache = (key: string): void => {
  localStorage.removeItem(`${CACHE_PREFIX}${key}`)
}

// Limpiar toda la caché
export const clearAllCache = (): void => {
  Object.keys(localStorage)
    .filter(key => key.startsWith(CACHE_PREFIX))
    .forEach(key => localStorage.removeItem(key))
}

// Pre-fetch: Guardar datos del backend en caché
export const prefetchCache = async <T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T> => {
  try {
    const data = await fetchFn()
    setCache(key, data, true) // Marcado como sincronizado
    return data
  } catch (error) {
    // Si falla el fetch, intentar retornar caché
    const cached = getCache<T>(key)
    if (cached) return cached
    throw error
  }
}

// Optimistic Update: Actualizar UI inmediatamente, luego backend
export const optimisticUpdate = async <T>(
  key: string,
  newData: T,
  updateFn: () => Promise<T>
): Promise<T> => {
  // 1. Guardar estado anterior por si falla
  const previousData = getCache<T>(key)
  
  // 2. Actualizar caché inmediatamente (Optimistic)
  setCache(key, newData, false) // No sincronizado aún
  
  try {
    // 3. Intentar sincronizar con backend
    const serverData = await updateFn()
    // 4. Éxito: marcar como sincronizado
    setCache(key, serverData, true)
    return serverData
  } catch (error) {
    // 5. Error: restaurar estado anterior
    if (previousData) {
      setCache(key, previousData, true)
    } else {
      clearCache(key)
    }
    throw error
  }
}

// Lazy Load: Cargar de caché primero, luego actualizar del backend
export const lazyLoad = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  onUpdate?: (data: T) => void
): Promise<T> => {
  // 1. Retornar caché inmediatamente si existe
  const cached = getCache<T>(key)
  
  // 2. En segundo plano, actualizar del backend
  const updateFromServer = async (): Promise<T> => {
    try {
      const data = await fetchFn()
      setCache(key, data, true)
      onUpdate?.(data)
      return data
    } catch (error) {
      console.warn(`Lazy load failed for ${key}:`, error)
      // Si hay caché, retornarla aunque sea vieja
      if (cached) return cached
      throw error
    }
  }
  
  if (cached) {
    // Retornar caché inmediatamente y actualizar en background
    updateFromServer()
    return cached
  }
  
  // Si no hay caché, esperar al backend
  return updateFromServer()
}
