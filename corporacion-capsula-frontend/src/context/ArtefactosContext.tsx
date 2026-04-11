import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react"
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

const artefactosIniciales: Artefacto[] = [
  {
    id: 1,
    nombre: "Capsula Hoi Poi",
    descripcion: "Permite almacenar objetos en miniatura",
    categoria: "domestico",
    origen: "terrestre",
    nivelPeligrosidad: 1,
    nivelConfidencialidad: 2,
    estado: "activo",
    inventor: "Dr. Brief",
    fechaCreacion: "2026-01-12",
    fechaActualizacion: "2026-01-12",
  },
  {
    id: 2,
    nombre: "Scouter",
    descripcion: "Mide el nivel de poder de los enemigos",
    categoria: "defensa",
    origen: "extraterrestre",
    nivelPeligrosidad: 3,
    nivelConfidencialidad: 4,
    estado: "en_pruebas",
    inventor: "Bulma",
    fechaCreacion: "2026-02-08",
    fechaActualizacion: "2026-02-08",
  },
  {
    id: 3,
    nombre: "Radar del Dragón",
    descripcion: "Detecta las esferas del dragón",
    categoria: "energia",
    origen: "terrestre",
    nivelPeligrosidad: 2,
    nivelConfidencialidad: 3,
    estado: "obsoleto",
    inventor: "Dr. Hedo",
    fechaCreacion: "2026-03-04",
    fechaActualizacion: "2026-03-04",
  },
]

export const ArtefactosProvider = ({ children }: { children: ReactNode }) => {
  const [artefactos, setArtefactos] = useState<Artefacto[]>(artefactosIniciales)

  const loadArtefactos = useCallback(async () => {
    const data = await getArtefactos()
    if (data.length > 0) {
      setArtefactos(data)
    }
  }, [])

  const addArtefacto = useCallback(async (a: Partial<Artefacto>) => {
    const fechaActual = new Date().toISOString().split("T")[0]
    const nuevoArtefacto: Artefacto = {
      id: Number(a.id ?? Date.now()),
      nombre: a.nombre ?? "Nuevo artefacto",
      descripcion: a.descripcion ?? "",
      categoria: a.categoria ?? "defensa",
      origen: a.origen ?? "terrestre",
      nivelPeligrosidad: a.nivelPeligrosidad ?? 1,
      nivelConfidencialidad: a.nivelConfidencialidad ?? 1,
      estado: a.estado ?? "activo",
      inventor: a.inventor ?? "",
      fechaCreacion: a.fechaCreacion ?? fechaActual,
      fechaActualizacion: fechaActual,
    }

    try {
      const created = await createArtefacto(nuevoArtefacto)
      setArtefactos((prev) => [...prev, created])
    } catch {
      setArtefactos((prev) => [...prev, nuevoArtefacto])
    }
  }, [])

  const updateArtefacto = useCallback(async (id: number, changes: Partial<Artefacto>) => {
    const fechaActual = new Date().toISOString().split("T")[0]

    try {
      const updated = await updateArtefactoRequest(id, changes)
      setArtefactos((prev) =>
        prev.map((artefacto) => (artefacto.id === id ? updated : artefacto))
      )
    } catch {
      setArtefactos((prev) =>
        prev.map((artefacto) =>
          artefacto.id === id
            ? {
                ...artefacto,
                ...changes,
                fechaActualizacion: fechaActual,
              }
            : artefacto
        )
      )
    }
  }, [])

  const toggleArtefactoEstado = useCallback(async (id: number) => {
    const actual = artefactos.find((artefacto) => artefacto.id === id)
    if (!actual) return

    await updateArtefacto(id, {
      estado: actual.estado === "obsoleto" ? "activo" : "obsoleto",
    })
  }, [artefactos, updateArtefacto])

  const deactivateArtefacto = useCallback(async (id: number | string) => {
    const numericId = Number(id)
    const actual = artefactos.find((artefacto) => artefacto.id === numericId)
    if (!actual) return

    try {
      await deleteArtefacto(numericId)
    } catch {
      // Si el backend no tiene endpoint de desactivación, mantenemos el cambio local.
    }

    await updateArtefacto(numericId, { estado: "obsoleto" })
  }, [artefactos, updateArtefacto])

  const value = useMemo(
    () => ({
      artefactos,
      loadArtefactos,
      addArtefacto,
      updateArtefacto,
      toggleArtefactoEstado,
      deactivateArtefacto,
      getArtefactoById: (id: number) => artefactos.find((artefacto) => artefacto.id === id),
    }),
    [addArtefacto, artefactos, deactivateArtefacto, loadArtefactos, toggleArtefactoEstado, updateArtefacto]
  )

  return (
    <ArtefactosContext.Provider value={value}>
      {children}
    </ArtefactosContext.Provider>
  )
}

export const useArtefactos = () => {
  const ctx = useContext(ArtefactosContext)
  if (!ctx) throw new Error("useArtefactos fuera de provider")
  return ctx
}
