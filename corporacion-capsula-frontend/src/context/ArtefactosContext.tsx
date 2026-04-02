import { createContext, useContext, useState, useEffect } from "react"

type Artefacto = {
  id: number
  nombre: string
  descripcion: string
  categoria: string
  origen: string
  nivelPeligrosidad: string
  estado: string
  inventor: string
  fecha: string
}

type ContextType = {
  artefactos: Artefacto[]
  addArtefacto: (a: Omit<Artefacto, "id">) => void
  updateArtefacto: (id: number, data: Partial<Artefacto>) => void
}

const ArtefactosContext = createContext<ContextType | null>(null)

export const ArtefactosProvider = ({ children }: any) => {
  const [artefactos, setArtefactos] = useState<Artefacto[]>([])

  useEffect(() => {
    const data = localStorage.getItem("artefactos")
    if (data) setArtefactos(JSON.parse(data))
  }, [])

  useEffect(() => {
    localStorage.setItem("artefactos", JSON.stringify(artefactos))
  }, [artefactos])

  const addArtefacto = (a: Omit<Artefacto, "id">) => {
    setArtefactos(prev => [...prev, { ...a, id: Date.now() }])
  }

  const updateArtefacto = (id: number, data: Partial<Artefacto>) => {
    setArtefactos(prev =>
      prev.map(a => (a.id === id ? { ...a, ...data } : a))
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
  if (!ctx) throw new Error("fuera del provider")
  return ctx
}