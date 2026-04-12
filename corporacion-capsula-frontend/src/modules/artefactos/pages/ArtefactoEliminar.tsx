import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useArtefactos } from "../../../context/ArtefactosContext"
import { isAdministrator } from "../../auth/utils/roles"
import { gifPorIdTipo } from "../constants/artifactVisuals"
import bg from "../../../assets/3.jpg"
import esfera from "../../../assets/7.webp"

const HOLD_DURATION = 3000

const ArtefactoEliminar = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { artefactos, deactivateArtefacto, loadArtefactos, toggleArtefactoEstado } = useArtefactos()

  const artefacto = artefactos.find((a) => a.id === Number(id))

  const [progreso, setProgreso] = useState(0)
  const [holding, setHolding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!artefacto) {
      loadArtefactos()
    }
  }, [artefacto, loadArtefactos])

  const confirmarDesactivar = async () => {
    if (!id || isSubmitting) return

    setIsSubmitting(true)
    await deactivateArtefacto(id)
    navigate("/artefactos")
  }

  const activar = async () => {
    if (!id || isSubmitting || artefacto?.estado !== "obsoleto") return
    setIsSubmitting(true)
    try {
      await toggleArtefactoEstado(Number(id))
      navigate("/artefactos")
    } finally {
      setIsSubmitting(false)
    }
  }

  const startHold = () => {
    if (isSubmitting || artefacto?.estado === "obsoleto") return

    setHolding(true)
    startTimeRef.current = Date.now()

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current || 0)
      const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100)

      setProgreso(pct)

      if (pct >= 100) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        setHolding(false)
        void confirmarDesactivar()
      }
    }, 30)
  }

  const stopHold = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
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

  if (artefacto && !isAdministrator()) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-white relative"
        style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative z-10 bg-black/80 p-6 rounded-xl border border-amber-500 w-96 text-center">
          <h2 className="text-amber-300 text-xl mb-3">Permiso denegado</h2>
          <p className="text-gray-300 text-sm mb-4">
            Solo usuarios con rol <strong>Administrador</strong> pueden activar o desactivar artefactos (así lo exige el API).
          </p>
          <button
            type="button"
            onClick={() => navigate("/artefactos")}
            className="px-6 py-2 bg-yellow-400 text-black rounded hover:bg-orange-500 font-bold"
          >
            Volver al inventario
          </button>
        </div>
      </div>
    )
  }

  if (!artefacto) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-white relative"
        style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative z-10 bg-black/80 p-6 rounded-xl border border-red-500 w-80 text-center">
          <h2 className="text-red-400 text-xl mb-3">Cargando artefacto</h2>
          <p className="text-gray-300 mb-4">Estamos buscando el registro para desactivarlo.</p>
          <button
            onClick={() => navigate("/artefactos")}
            className="px-6 py-2 bg-yellow-400 text-black rounded hover:bg-orange-500"
          >
            Volver
          </button>
        </div>
      </div>
    )
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

      <div
        className={`relative z-10 bg-black/80 p-6 rounded-xl w-80 border ${
          artefacto.estado === "obsoleto" ? "border-green-500" : "border-red-500"
        }`}
      >
        <h2
          className={`text-xl mb-3 ${
            artefacto.estado === "obsoleto" ? "text-green-400" : "text-red-400"
          }`}
        >
          {artefacto.estado === "obsoleto" ? "Artefacto desactivado" : "Desactivar Artefacto"}
        </h2>

        <div className="w-full h-36 rounded-lg overflow-hidden border border-orange-500/50 mb-3 bg-black/40">
          <img
            src={artefacto.fotoDataUrl || gifPorIdTipo(artefacto.tipoArtefacto)}
            alt=""
            className="w-full h-full object-contain"
          />
        </div>

        <p className="font-bold">{artefacto.nombre}</p>
        <p className="text-sm text-gray-300 mb-2">{artefacto.descripcion}</p>

        <p className={artefacto.estado === "obsoleto" ? "text-red-400 font-bold" : "text-green-400"}>
          {artefacto.estado === "obsoleto" ? "Inactivo — no está en uso" : "Activo"}
        </p>

        {artefacto.estado === "obsoleto" ? (
          <>
            <p className="text-xs text-gray-400 mt-3 mb-2">
              Puedes volver a activarlo cuando lo necesites.
            </p>
            <button
              type="button"
              onClick={() => void activar()}
              disabled={isSubmitting}
              className="mt-2 px-6 py-2 border border-green-500 bg-green-700/40 text-green-300 rounded w-full hover:bg-green-600/50 disabled:opacity-60 font-bold"
            >
              {isSubmitting ? "Activando…" : "✓ Activar artefacto"}
            </button>
          </>
        ) : (
          <>
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
              onTouchStart={startHold}
              onTouchEnd={stopHold}
              disabled={isSubmitting}
              className="mt-4 px-6 py-2 border border-red-500 text-red-400 rounded w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Desactivando..." : "Mantener para desactivar"}
            </button>

            <div className="w-full bg-gray-700 h-2 mt-2 rounded">
              <div className="bg-red-500 h-2 rounded" style={{ width: `${progreso}%` }} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ArtefactoEliminar
