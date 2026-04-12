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
    setArtefactos((prev) =>
      prev.map((x) => (x.id === id ? enriquecerArtefactoConImagen(updated) : x))
    )
  }, [])

  const toggleArtefactoEstado = useCallback(async (id: number) => {
    const actual = artefactos.find((a) => a.id === id)
    if (!actual) return

    if (actual.estado === "obsoleto") {
      await updateArtefacto(id, { estado: "activo" })
      return
    }

    const updated = await deleteArtefacto(id)
    if (updated) {
      setArtefactos((prev) =>
        prev.map((a) =>
          a.id === id ? enriquecerArtefactoConImagen(updated) : a
        )
      )
    } else {
      await loadArtefactos()
    }
  }, [artefactos, updateArtefacto, loadArtefactos])

  const deactivateArtefacto = useCallback(async (id: number | string) => {
    const nid = Number(id)
    const updated = await deleteArtefacto(nid)
    if (updated) {
      setArtefactos((prev) =>
        prev.map((a) =>
          a.id === nid ? enriquecerArtefactoConImagen(updated) : a
        )
      )
    } else {
      await loadArtefactos()
    }
  }, [loadArtefactos])

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