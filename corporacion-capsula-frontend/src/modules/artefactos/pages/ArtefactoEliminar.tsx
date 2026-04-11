import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useArtefactos } from "../../../context/ArtefactosContext"
import bg from "../../../assets/3.jpg"
import esfera from "../../../assets/7.webp"

const HOLD_DURATION = 3000

const ArtefactoEliminar = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { artefactos, deactivateArtefacto, loadArtefactos } = useArtefactos()

  const artefacto = artefactos.find((a) => a.id === Number(id))

  const [progreso, setProgreso] = useState(0)
  const [holding, setHolding] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!artefacto) {
      loadArtefactos()
    }
  }, [artefacto, loadArtefactos])

  const confirmar = async () => {
    if (!id) return

    await deactivateArtefacto(id)
    navigate("/artefactos")
  }

  const startHold = () => {
    setHolding(true)
    startTimeRef.current = Date.now()

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current || 0)
      const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100)

      setProgreso(pct)

      if (pct >= 100) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        setHolding(false)
        confirmar()
      }
    }, 30)
  }

  const stopHold = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setHolding(false)
    setProgreso(0)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  if (!artefacto) {
    return <div className="text-white p-10">Cargando...</div>
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white relative"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
    >
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="fixed top-20 right-5 z-50">
        <button onClick={() => navigate("/artefactos")} className="flex flex-col items-center">
          <img src={esfera} className="w-12" />
          <span className="text-yellow-300 text-sm font-bold">Volver</span>
        </button>
      </div>

      <div className="relative z-10 bg-black/80 p-6 rounded-xl border border-red-500 w-80">
        <h2 className="text-red-400 text-xl mb-3">
          Desactivar Artefacto
        </h2>

        <p className="font-bold">{artefacto.nombre}</p>
        <p className="text-sm text-gray-300 mb-2">{artefacto.descripcion}</p>

        <p className={artefacto.estado === "obsoleto" ? "text-red-400" : "text-green-400"}>
          {artefacto.estado === "obsoleto" ? "Inactivo" : "Activo"}
        </p>

        <div
          className={`relative w-32 h-32 mx-auto mt-4 flex items-center justify-center rounded-full border-4
          ${holding ? "border-red-400 shadow-[0_0_30px_red]" : "border-red-700/50"}`}
        >
          <div className={`absolute inset-0 rounded-full ${holding ? "bg-red-500/20 animate-pulse" : ""}`} />

          <svg
            viewBox="0 0 24 24"
            className={`w-12 h-12 ${holding ? "text-red-400 scale-110" : "text-red-700"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 3c-3 0-5 2-5 5 0 2 1 3 2 4 1 1 2 2 2 4" />
            <path d="M12 3c3 0 5 2 5 5 0 2-1 3-2 4-1 1-2 2-2 4" />
          </svg>
        </div>

        <button
          onMouseDown={startHold}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          className="mt-4 px-6 py-2 border border-red-500 text-red-400 rounded w-full"
        >
          Mantener para desactivar
        </button>

        <div className="w-full bg-gray-700 h-2 mt-2 rounded">
          <div className="bg-red-500 h-2 rounded" style={{ width: `${progreso}%` }} />
        </div>
      </div>
    </div>
  )
}

export default ArtefactoEliminar
