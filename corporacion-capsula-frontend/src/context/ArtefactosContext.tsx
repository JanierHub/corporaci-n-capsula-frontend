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

type ContextType = {
  artefactos: Artefacto[]
  loadArtefactos: () => Promise<void>
  addArtefacto: (a: ArtefactoFormPayload) => Promise<void>
  updateArtefacto: (id: number, changes: ArtefactoFormPayload) => Promise<void>
  toggleArtefactoEstado: (id: number) => Promise<void>
  deactivateArtefacto: (id: number | string) => Promise<void>
  getArtefactoById: (id: number) => Artefacto | undefined
}

const ArtefactosContext = createContext<ContextType | null>(null)

export const ArtefactosProvider = ({ children }: { children: ReactNode }) => {
  const [artefactos, setArtefactos] = useState<Artefacto[]>([])

  const loadArtefactos = useCallback(async () => {
    const data = await getArtefactos()
    setArtefactos(data)
  }, [])

  useEffect(() => {
    loadArtefactos()
  }, [loadArtefactos])

  const addArtefacto = useCallback(async (a: ArtefactoFormPayload) => {
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
  }, [loadArtefactos])

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
    if (updated) {
      setArtefactos((prev) =>
        prev.map((x) => (x.id === id ? enriquecerArtefactoConImagen(updated) : x))
      )
    }
    // Si el backend no devuelve datos completos, mantenemos la actualización local
  }, [])

  const toggleArtefactoEstado = useCallback(async (id: number) => {
    const actual = artefactos.find((a) => a.id === id)
    if (!actual) return

    // Determinar el nuevo estado
    const nuevoEstado = actual.estado === "obsoleto" ? "activo" : "obsoleto"
    
    // Actualizar localmente inmediatamente
    setArtefactos((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, estado: nuevoEstado } : a
      )
    )

    // Intentar sincronizar con backend (sin afectar el estado local si falla)
    try {
      if (actual.estado === "obsoleto") {
        await updateArtefactoRequest(id, { estado: nuevoEstado })
      } else {
        await deleteArtefacto(id)
      }
    } catch (error) {
      console.warn("No se pudo sincronizar con backend, pero el estado local se mantuvo:", error)
    }
  }, [artefactos])

  const deactivateArtefacto = useCallback(async (id: number | string) => {
    const nid = Number(id)
    // Actualizar localmente inmediatamente
    setArtefactos((prev) =>
      prev.map((a) =>
        a.id === nid ? { ...a, estado: "obsoleto" } : a
      )
    )

    // Intentar sincronizar con backend
    try {
      const updated = await deleteArtefacto(nid)
      if (updated) {
        setArtefactos((prev) =>
          prev.map((a) =>
            a.id === nid ? enriquecerArtefactoConImagen(updated) : a
          )
        )
      }
    } catch (error) {
      console.warn("No se pudo sincronizar con backend, pero el estado local se mantuvo:", error)
    }
  }, [])

  const value = useMemo(() => ({
    artefactos,
    loadArtefactos, // 🔥 CLAVE (esto faltaba)
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