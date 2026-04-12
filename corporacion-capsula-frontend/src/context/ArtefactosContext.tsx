import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react"
import { Artefacto } from "../modules/artefactos/types/artefacto.types"
import {
  activateArtefactoRequest,
  createArtefacto,
  deactivateArtefactoRequest,
  getArtefactos,
  updateArtefactoRequest,
} from "../modules/artefactos/services/artefactoService"
import {
  mergeFotosFromStorage,
  setStoredFotoDataUrl,
} from "../modules/artefactos/utils/artifactFotoStorage"

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

const sortArtefactos = (items: Artefacto[]) =>
  [...items].sort((a, b) => Number(a.id) - Number(b.id))

export const ArtefactosProvider = ({ children }: { children: ReactNode }) => {
  const [artefactos, setArtefactos] = useState<Artefacto[]>([])

  const loadArtefactos = useCallback(async () => {
    const data = mergeFotosFromStorage(await getArtefactos())

    setArtefactos((prev) =>
      sortArtefactos(
        data.map((incoming: Artefacto) => {
          const prevRow = prev.find((item) => item.id === incoming.id)
          return {
            ...prevRow,
            ...incoming,
            fotoDataUrl: incoming.fotoDataUrl ?? prevRow?.fotoDataUrl,
          }
        })
      )
    )
  }, [])

  const addArtefacto = useCallback(async (a: Partial<Artefacto>) => {
    const fechaActual = new Date().toISOString().split("T")[0]
    const tempId = Number(a.id ?? Date.now())
    const nuevoArtefacto: Artefacto = {
      id: tempId,
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
      tipoArtefacto: a.tipoArtefacto ?? "1",
      fotoDataUrl: a.fotoDataUrl,
    }

    setArtefactos((prev) => sortArtefactos([...prev, nuevoArtefacto]))

    try {
      const created = await createArtefacto(nuevoArtefacto)
      const finalId = created.id > 0 ? created.id : tempId
      if (a.fotoDataUrl) {
        setStoredFotoDataUrl(finalId, a.fotoDataUrl)
      }
      setArtefactos((prev) =>
        sortArtefactos(
          prev.map((artefacto) =>
            artefacto.id === tempId
              ? {
                  ...created,
                  id: finalId,
                  tipoArtefacto: created.tipoArtefacto ?? nuevoArtefacto.tipoArtefacto,
                  fotoDataUrl: a.fotoDataUrl ?? created.fotoDataUrl,
                }
              : artefacto
          )
        )
      )
    } catch {
      setArtefactos((prev) =>
        sortArtefactos(
          prev.map((artefacto) => (artefacto.id === tempId ? nuevoArtefacto : artefacto))
        )
      )
    }
  }, [])

  const updateArtefacto = useCallback(async (id: number, changes: Partial<Artefacto>) => {
    const fechaActual = new Date().toISOString().split("T")[0]

    if ("fotoDataUrl" in changes) {
      setStoredFotoDataUrl(id, changes.fotoDataUrl ? changes.fotoDataUrl : null)
    }

    try {
      const updated = await updateArtefactoRequest(id, changes)
      setArtefactos((prev) =>
        sortArtefactos(
          prev.map((artefacto) => {
            if (artefacto.id !== id) return artefacto
            return {
              ...updated,
              fotoDataUrl:
                changes.fotoDataUrl === null
                  ? undefined
                  : (changes.fotoDataUrl ?? updated.fotoDataUrl ?? artefacto.fotoDataUrl),
            }
          })
        )
      )
      void loadArtefactos()
    } catch {
      setArtefactos((prev) =>
        sortArtefactos(
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
      )
      void loadArtefactos()
    }
  }, [loadArtefactos])

  const toggleArtefactoEstado = useCallback(
    async (id: number) => {
      const actual = artefactos.find((artefacto) => artefacto.id === id)
      if (!actual) return

      try {
      const updated =
          actual.estado === "obsoleto"
            ? await activateArtefactoRequest(id)
            : await deactivateArtefactoRequest(id)
        setArtefactos((prev) =>
          sortArtefactos(
            prev.map((artefacto) =>
              artefacto.id === id
                ? {
                    ...artefacto,
                    ...updated,
                    fotoDataUrl: artefacto.fotoDataUrl ?? updated.fotoDataUrl,
                  }
                : artefacto
            )
          )
        )
        void loadArtefactos()
      } catch {
        await updateArtefacto(id, {
          estado: actual.estado === "obsoleto" ? "activo" : "obsoleto",
        })
      }
    },
    [artefactos, loadArtefactos, updateArtefacto]
  )

  const deactivateArtefacto = useCallback(async (id: number | string) => {
    const numericId = Number(id)
    const actual = artefactos.find((artefacto) => artefacto.id === numericId)
    if (!actual || actual.estado === "obsoleto") return

    try {
      const updated = await deactivateArtefactoRequest(numericId)
      setArtefactos((prev) =>
        sortArtefactos(
          prev.map((artefacto) =>
            artefacto.id === numericId
              ? {
                  ...artefacto,
                  ...updated,
                  fotoDataUrl: artefacto.fotoDataUrl ?? updated.fotoDataUrl,
                }
              : artefacto
          )
        )
      )
      void loadArtefactos()
      return
    } catch {
      await updateArtefacto(numericId, { estado: "obsoleto" })
    }
  }, [artefactos, loadArtefactos, updateArtefacto])

  const value = useMemo(
    () => ({
      artefactos,
      loadArtefactos,
      addArtefacto,
      updateArtefacto,
      toggleArtefactoEstado,
      deactivateArtefacto,
      getArtefactoById: (id: number) => artefactos.find((artefacto) => artefacto.id === Number(id)),
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
