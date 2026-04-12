import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useArtefactos } from "../../../context/ArtefactosContext"
import { isAdministrator } from "../../auth/utils/roles"
import bg from "../../../assets/3.jpg"
import esfera from "../../../assets/7.webp"

const HOLD_DURATION = 3000

const ArtefactoEliminar = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getArtefactoById, deactivateArtefacto } = useArtefactos()

  const artefacto = getArtefactoById(Number(id))

  const [progreso, setProgreso] = useState(0)
  const [holding, setHolding] = useState(false)

  const intervalRef = useRef<any>(null)
  const startTimeRef = useRef<number | null>(null)

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
        clearInterval(intervalRef.current)
        confirmar()
      }
    }, 30)
  }

  const stopHold = () => {
    clearInterval(intervalRef.current)
    setHolding(false)
    setProgreso(0)
  }

  if (!isAdministrator()) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-white p-8"
        style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 text-center max-w-md">
          <p className="text-lg mb-4">Solo un administrador puede desactivar artefactos.</p>
          <button
            type="button"
            className="px-4 py-2 bg-orange-500 rounded-lg font-bold"
            onClick={() => navigate("/artefactos")}
          >
            Volver al inventario
          </button>
        </div>
      </div>
    )
  }

  if (!artefacto) return <div className="text-white p-10">Cargando...</div>

  return (
    <div className="min-h-screen flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
    >
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="fixed top-20 right-5">
        <button onClick={() => navigate("/artefactos")}>
          <img src={esfera} className="w-12" />
        </button>
      </div>

      <div className="relative z-10 bg-black/80 p-6 rounded-xl border border-red-500 w-80">

        <h2 className="text-red-400 text-xl mb-3">
          Desactivar Artefacto
        </h2>

        <p>{artefacto.nombre}</p>

        <p className={artefacto.estado === "obsoleto" ? "text-red-400" : "text-green-400"}>
          {artefacto.estado === "obsoleto" ? "Inactivo" : "Activo"}
        </p>

        <div className="w-32 h-32 mx-auto mt-4 border rounded-full flex items-center justify-center">
          🖐
        </div>

        <button
          onMouseDown={startHold}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          className="mt-4 w-full border border-red-500 py-2"
        >
          Mantener para desactivar
        </button>

        <div className="w-full bg-gray-700 h-2 mt-2">
          <div className="bg-red-500 h-2" style={{ width: `${progreso}%` }} />
        </div>

      </div>
    </div>
  )
}

export default ArtefactoEliminar