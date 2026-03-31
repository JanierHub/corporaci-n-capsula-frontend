import { createContext, useContext, useState } from "react"
import { Artefacto } from "../modules/artefactos/types/artefacto.types"

type ContextType = {
  artefactos: Artefacto[]
  addArtefacto: (a: Artefacto) => void
}

const ArtefactosContext = createContext<ContextType | null>(null)

export const ArtefactosProvider = ({ children }: any) => {
  const [artefactos, setArtefactos] = useState<Artefacto[]>([])

  const addArtefacto = (a: Artefacto) => {
    setArtefactos((prev) => [...prev, { ...a, id: Date.now() }])
  }

  return (
    <ArtefactosContext.Provider value={{ artefactos, addArtefacto }}>
      {children}
    </ArtefactosContext.Provider>
  )
}

export const useArtefactos = () => {
  const ctx = useContext(ArtefactosContext)
  if (!ctx) throw new Error("useArtefactos fuera de provider")
  return ctx
}