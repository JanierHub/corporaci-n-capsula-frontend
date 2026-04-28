import { ReactNode, createContext, useCallback, useContext, useMemo, useState, useEffect } from "react"
import { Artefacto, ArtefactoFormPayload } from "../modules/artefactos/types/artefacto.types"
import {
  createArtefacto,
  deleteArtefacto,
  getArtefactos,
  updateArtefactoRequest,
  normalizeArtefacto,
} from "../modules/artefactos/services/artefactoService"
import {
  enriquecerArtefactoConImagen,
  removeImagenArtefacto,
  setImagenArtefacto,
} from "../modules/artefactos/utils/artefactoImagenes"

// 🔄 MOCKS LOCALES para fallback cuando API falla
const mockArtefactosFallback: Artefacto[] = [
  {
    id: 1,
    nombre: "Capsula Hoi Poi",
    descripcion: "Permite almacenar objetos en miniatura",
    categoria: "transporte" as const,
    origen: "terrestre" as const,
    nivelPeligrosidad: 1,
    nivelConfidencialidad: 1,
    estado: "activo" as const,
    inventor: "Bulma",
    fechaCreacion: "2026-04-10",
    fechaActualizacion: "",
  },
  {
    id: 2,
    nombre: "Scouter",
    descripcion: "Dispositivo de detección de energía",
    categoria: "defensa" as const,
    origen: "extraterrestre" as const,
    nivelPeligrosidad: 2,
    nivelConfidencialidad: 2,
    estado: "activo" as const,
    inventor: "Freezer",
    fechaCreacion: "2026-04-11",
    fechaActualizacion: "",
  },
  {
    id: 3,
    nombre: "Varita Mágica",
    descripcion: "Transforma objetos en conejos",
    categoria: "domestico" as const,
    origen: "terrestre" as const,
    nivelPeligrosidad: 1,
    nivelConfidencialidad: 1,
    estado: "obsoleto" as const,
    inventor: "Bulma",
    fechaCreacion: "2026-04-12",
    fechaActualizacion: "",
  },
  {
    id: 4,
    nombre: "Espada Z",
    descripcion: "Arma legendaria de los saiyajin",
    categoria: "defensa" as const,
    origen: "extraterrestre" as const,
    nivelPeligrosidad: 3,
    nivelConfidencialidad: 3,
    estado: "obsoleto" as const,
    inventor: "Kaioshin",
    fechaCreacion: "2026-04-13",
    fechaActualizacion: "",
  },
].map(a => enriquecerArtefactoConImagen(a))

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
    try {
      const data = await getArtefactos()
      
      // Si no hay datos, usar mocks locales como fallback
      let artefactosData = data
      if (!data || data.length === 0) {
        console.warn("⚠️ No hay datos de API - usando mocks locales")
        artefactosData = mockArtefactosFallback
      }
      
      // Restaurar estados desde localStorage con prioridad sobre el estado por defecto
      const estadosGuardados = localStorage.getItem('artefactos_estados')
      if (estadosGuardados) {
        try {
          const estados = JSON.parse(estadosGuardados)
          const dataConEstados = artefactosData.map((artefacto: Artefacto) => {
            const estadoGuardado = estados[artefacto.id.toString()]
            if (estadoGuardado) {
              return { ...artefacto, estado: estadoGuardado as Artefacto["estado"] }
            }
            return { ...artefacto, estado: "activo" as Artefacto["estado"] }
          })
          setArtefactos(dataConEstados)
        } catch (error) {
          console.warn("Error cargando estados guardados:", error)
          setArtefactos(artefactosData.map((a: Artefacto) => ({...a, estado: "activo" as Artefacto["estado"]})))
        }
      } else {
        setArtefactos(artefactosData.map((a: Artefacto) => ({...a, estado: "activo" as Artefacto["estado"]})))
      }
    } catch (error) {
      console.error("❌ Error cargando artefactos:", error)
      // Fallback final - usar mocks locales
      setArtefactos(mockArtefactosFallback.map((a: Artefacto) => ({...a, estado: "activo" as Artefacto["estado"]})))
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
    // Si el backend no devuelve datos completos, mantenemos la actualización local
  }, [])

  const toggleArtefactoEstado = useCallback(async (id: number) => {
    const actual = artefactos.find((a) => a.id === id)
    if (!actual) return

    // Siempre activar (volver al estado inicial)
    const nuevoEstado: Artefacto["estado"] = "activo"
    
    console.log(`Activando artefacto ${id} de ${actual.estado} a ${nuevoEstado}`)
    
    // Actualizar localmente inmediatamente
    setArtefactos((prev) => {
      const nuevosArtefactos = prev.map((a) =>
        a.id === id ? { ...a, estado: nuevoEstado } : a
      )
      
      // Eliminar del localStorage los artefactos que se activan
      const estadosGuardados = localStorage.getItem('artefactos_estados')
      if (estadosGuardados) {
        try {
          const estados = JSON.parse(estadosGuardados)
          delete estados[id.toString()] // Eliminar este artefacto del storage
          localStorage.setItem('artefactos_estados', JSON.stringify(estados))
          console.log("Artefacto eliminado de localStorage:", id, "Estados restantes:", estados)
        } catch (error) {
          console.warn("Error actualizando localStorage:", error)
        }
      }
      
      return nuevosArtefactos
    })

    // Sincronizar con backend y mantener estado local
    try {
      await updateArtefactoRequest(id, { estado: nuevoEstado })
      console.log("Estado guardado en backend correctamente")
    } catch (error) {
      console.warn("No se pudo sincronizar con backend, pero el estado local se mantuvo:", error)
    }
  }, [artefactos, loadArtefactos])

  const deactivateArtefacto = useCallback(async (id: number | string) => {
    const nid = Number(id)
    // Actualizar localmente inmediatamente
    setArtefactos((prev) => {
      const nuevosArtefactos = prev.map((a) =>
        a.id === nid ? { ...a, estado: "obsoleto" as Artefacto["estado"] } : a
      )
      
      // Guardar estados en localStorage - usar string keys para evitar TypeScript errors
      const estados: Record<string, string> = {}
      nuevosArtefactos.forEach(a => {
        if (a.estado !== "activo" && a.estado) { // Solo guardar estados no activos y no undefined
          estados[a.id.toString()] = a.estado
        }
      })
      localStorage.setItem('artefactos_estados', JSON.stringify(estados))
      console.log("Deactivate - Estados guardados en localStorage:", estados)
      
      return nuevosArtefactos
    })

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