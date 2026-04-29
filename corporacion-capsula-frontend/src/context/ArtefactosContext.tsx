import { ReactNode, createContext, useCallback, useContext, useMemo, useState, useEffect } from "react"
import { Artefacto, ArtefactoFormPayload } from "../modules/artefactos/types/artefacto.types"
import {
  createArtefacto,
  deleteArtefacto,
  getArtefactos,
  updateArtefactoRequest,
} from "../modules/artefactos/services/artefactoService"
import {
  enriquecerArtefactoConImagen,
  removeImagenArtefacto,
  setImagenArtefacto,
} from "../modules/artefactos/utils/artefactoImagenes"
import { triggerAuditRefresh } from "../modules/auditoria/services/auditService"
import { isAuthenticated, getStoredAccessToken } from "../modules/auth/utils/roles"

type ContextType = {
  artefactos: Artefacto[]
  loadArtefactos: () => Promise<void>
  addArtefacto: (a: ArtefactoFormPayload) => Promise<Artefacto | undefined>
  updateArtefacto: (id: number, changes: ArtefactoFormPayload) => Promise<void>
  toggleArtefactoEstado: (id: number) => Promise<void>
  deactivateArtefacto: (id: number | string) => Promise<void>
  getArtefactoById: (id: number) => Artefacto | undefined
}

const ArtefactosContext = createContext<ContextType | null>(null)

export const ArtefactosProvider = ({ children }: { children: ReactNode }) => {
  const [artefactos, setArtefactos] = useState<Artefacto[]>([])

  const loadArtefactos = useCallback(async () => {
    console.log("🔐 [ArtefactosContext] isAuthenticated:", isAuthenticated())
    console.log("🔐 [ArtefactosContext] Token:", getStoredAccessToken()?.substring(0, 30) + "...")
    
    if (!isAuthenticated()) {
      console.error("❌ [ArtefactosContext] Usuario no autenticado - no se cargarán artefactos")
      setArtefactos([])
      return
    }
    
    try {
      const data = await getArtefactos()
      // Los estados vienen del backend - persistencia real
      setArtefactos(data.map((a: Artefacto) => ({...a, estado: a.estado || "activo" as Artefacto["estado"]})))
    } catch (error) {
      console.error("❌ Error cargando artefactos desde API:", error)
      setArtefactos([]) // Array vacío si la API falla
    }
  }, [])

  useEffect(() => {
    loadArtefactos()
  }, []) // Solo ejecutar una vez al montar el componente

  const addArtefacto = useCallback(async (a: ArtefactoFormPayload): Promise<Artefacto | undefined> => {
    const { imagenDataUrl, ...rest } = a
    const newId = await createArtefacto(rest)
    if (newId != null && imagenDataUrl) {
      try {
        setImagenArtefacto(newId, imagenDataUrl)
      } catch (e) {
        console.error(e)
        window.alert(e instanceof Error ? e.message : "No se pudo guardar la imagen.")
      }
    }
    await loadArtefactos()
    console.log(" Artefacto creado, refrescando auditoría...")
    triggerAuditRefresh()
    // Retornar el artefacto creado
    return artefactos.find(art => art.id === newId) || { id: newId, ...rest } as Artefacto
  }, [loadArtefactos, artefactos])

  const updateArtefacto = useCallback(async (id: number, changes: ArtefactoFormPayload) => {
    const { imagenDataUrl, ...rest } = changes
    
    // Si solo estamos cambiando el estado, actualizamos localmente primero
    if (Object.keys(rest).length === 1 && 'estado' in rest) {
      setArtefactos((prev) =>
        prev.map((x) => (x.id === id ? { ...x, estado: rest.estado } : x))
      )
    }
    
    if (imagenDataUrl !== undefined) {
      try {
        if (!imagenDataUrl) removeImagenArtefacto(id)
        else setImagenArtefacto(id, imagenDataUrl)
      } catch (e) {
        console.error(e)
        window.alert(e instanceof Error ? e.message : "No se pudo guardar la imagen.")
        return
      }
    }
    
    const updated = await updateArtefactoRequest(id, rest)
    if (updated && Object.keys(rest).length > 1) {
      // Solo sobrescribir si hay cambios que no sean solo el estado
      setArtefactos((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, ...enriquecerArtefactoConImagen(updated), estado: a.estado } : a
        )
      )
    }
    // 🔥 Trigger refresh de auditoría para UPDATE
    if (Object.keys(rest).length > 0) {
      console.log("🔄 [ArtefactosContext] Artefacto actualizado, refrescando auditoría...")
      triggerAuditRefresh()
    }
    // Si el backend no devuelve datos completos, mantenemos la actualización local
  }, [])

  const toggleArtefactoEstado = useCallback(async (id: number) => {
    const actual = artefactos.find((a) => a.id === id)
    if (!actual) return

    // Siempre activar (volver al estado inicial)
    const nuevoEstado: Artefacto["estado"] = "activo"
    
    console.log(`Activando artefacto ${id} de ${actual.estado} a ${nuevoEstado}`)
    
    // Actualizar localmente inmediatamente (UI optimista)
    setArtefactos((prev) => prev.map((a) => a.id === id ? { ...a, estado: nuevoEstado } : a))

    // Sincronizar con backend - persistencia real
    try {
      await updateArtefactoRequest(id, { estado: "activo" }) // El servicio convierte a boolean
      console.log("✅ Estado activado en backend correctamente")
      // 🔥 Trigger refresh de auditoría
      console.log("🔄 [ArtefactosContext] Artefacto activado, refrescando auditoría...")
      triggerAuditRefresh()
    } catch (error) {
      console.error("❌ Error al activar en backend:", error)
      // Revertir en caso de error
      setArtefactos((prev) => prev.map((a) => a.id === id ? { ...a, estado: actual.estado } : a))
    }
  }, [artefactos, loadArtefactos])

  const deactivateArtefacto = useCallback(async (id: number | string) => {
    const nid = Number(id)
    const actual = artefactos.find((a) => a.id === nid)
    if (!actual) return
    
    // Actualizar localmente inmediatamente (UI optimista)
    setArtefactos((prev) => prev.map((a) => a.id === nid ? { ...a, estado: "obsoleto" as Artefacto["estado"] } : a))

    // Sincronizar con backend - persistencia real via PATCH
    try {
      await updateArtefactoRequest(nid, { estado: "obsoleto" }) // El servicio convierte a boolean
      console.log("✅ Estado desactivado en backend correctamente")
      // 🔥 Trigger refresh de auditoría
      console.log("🔄 [ArtefactosContext] Artefacto desactivado, refrescando auditoría...")
      triggerAuditRefresh()
    } catch (error) {
      console.error("❌ Error al desactivar en backend:", error)
      // Revertir en caso de error
      setArtefactos((prev) => prev.map((a) => a.id === nid ? { ...a, estado: actual.estado } : a))
    }
  }, [artefactos])

  const value = useMemo(() => ({
    artefactos,
    loadArtefactos,
    addArtefacto,
    updateArtefacto,
    toggleArtefactoEstado,
    deactivateArtefacto,
    getArtefactoById: (id: number) =>
      artefactos.find((a) => a.id === Number(id)),
  }), [artefactos, loadArtefactos, addArtefacto, updateArtefacto, toggleArtefactoEstado, deactivateArtefacto])

  return (
    <ArtefactosContext.Provider value={value}>
      {children}
    </ArtefactosContext.Provider>
  )
}

export const useArtefactos = () => {
  const ctx = useContext(ArtefactosContext)
  if (!ctx) throw new Error("Fuera del provider")
  return ctx
}