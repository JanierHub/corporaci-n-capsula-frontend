import { ReactNode, createContext, useCallback, useContext, useMemo, useState, useEffect } from "react"
import { Artefacto } from "../modules/artefactos/types/artefacto.types"
import {
  createArtefacto,
  deleteArtefacto,
  getArtefactos,
  updateArtefactoRequest,
} from "../modules/artefactos/services/artefactoService"

type ContextType = {
  artefactos: Artefacto[]
  loadArtefactos: () => Promise<void>
  addArtefacto: (a: Partial<Artefacto>) => Promise<void>
  updateArtefacto: (id: number, changes: Partial<Artefacto>) => Promise<void>
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

  const addArtefacto = useCallback(async (a: Partial<Artefacto>) => {
    const nuevo = await createArtefacto(a)
    setArtefactos((prev) => [...prev, nuevo])
  }, [])

  const updateArtefacto = useCallback(async (id: number, changes: Partial<Artefacto>) => {
    const updated = await updateArtefactoRequest(id, changes)
    setArtefactos((prev) =>
      prev.map((a) => (a.id === id ? updated : a))
    )
  }, [])

  const toggleArtefactoEstado = useCallback(async (id: number) => {
    const actual = artefactos.find((a) => a.id === id)
    if (!actual) return

    await updateArtefacto(id, {
      estado: actual.estado === "obsoleto" ? "activo" : "obsoleto",
    })
  }, [artefactos, updateArtefacto])

  const deactivateArtefacto = useCallback(async (id: number | string) => {
    await deleteArtefacto(Number(id))
    await updateArtefacto(Number(id), { estado: "obsoleto" })
  }, [updateArtefacto])

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