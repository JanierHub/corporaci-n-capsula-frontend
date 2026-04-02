import { createContext, useContext, useState, useEffect } from "react"
import { Artefacto } from "../modules/artefactos/types/artefacto.types"

type ContextType = {
  artefactos: Artefacto[]
  addArtefacto: (a: Artefacto) => void
  updateArtefacto: (id: number, data: Partial<Artefacto>) => void
}

const ArtefactosContext = createContext<ContextType | null>(null)

export const ArtefactosProvider = ({ children }: any) => {
  const [artefactos, setArtefactos] = useState<Artefacto[]>([])

  //  CARGAR AL INICIAR
  useEffect(() => {
    const data = localStorage.getItem("artefactos")
    if (data) {
      setArtefactos(JSON.parse(data))
    }
  }, [])

  //  GUARDAR CADA VEZ QUE CAMBIA
  useEffect(() => {
    localStorage.setItem("artefactos", JSON.stringify(artefactos))
  }, [artefactos])

  const addArtefacto = (a: Artefacto) => {
    setArtefactos((prev) => [...prev, { ...a, id: Date.now() }])
  }

  const updateArtefacto = (id: number, data: Partial<Artefacto>) => {
    setArtefactos((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, ...data } : a
      )
    )
  }

  return (
    <ArtefactosContext.Provider value={{ artefactos, addArtefacto, updateArtefacto }}>
      {children}
    </ArtefactosContext.Provider>
  )
}

export const useArtefactos = () => {
  const ctx = useContext(ArtefactosContext)
  if (!ctx) throw new Error("useArtefactos fuera de provider")
  return ctx
}