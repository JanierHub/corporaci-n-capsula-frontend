import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useArtefactos } from "../../../context/ArtefactosContext"
import bg from "../../../assets/3.jpg"
import SaiyanParticles from "../../../components/SaiyanParticles"
import esfera from "../../../assets/7.webp"

const razonesBorrado = [
  "Falla de Diseño Crítica",
  "Obsoleto",
  "Clasificación Alpha",
  "Destruido en combate",
  "Prototipo fallido",
  "Reemplazado por nueva versión",
  "Material inestable",
  "Orden de Corporación Cápsula",
]

const HOLD_DURATION = 5000

const ArtefactoDelete = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { artefactos } = useArtefactos()

  const artefacto = artefactos.find(a => String(a.id) === id)

  const [razon, setRazon] = useState("")
  const [progreso, setProgreso] = useState(0)
  const [holding, setHolding] = useState(false)
  const [mostrarConfirm, setMostrarConfirm] = useState(false)
  const [error, setError] = useState("")
  const [eliminado, setEliminado] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number | null>(null)

  // Si no encuentra el artefacto, regresa a la lista
  if (!artefacto) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-400 text-xl">
        Artefacto no encontrado.{" "}
        <button onClick={() => navigate("/artefactos")} className="ml-3 underline">
          Volver
        </button>
      </div>
    )
  }

  const startHold = () => {
    if (!razon) { setError("Debes seleccionar una razón de borrado"); return }
    setError("")
    setHolding(true)
    startTimeRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current || 0)
      const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100)
      setProgreso(pct)
      if (pct >= 100) {
        clearInterval(intervalRef.current!)
        setHolding(false)
        setMostrarConfirm(true)
      }
    }, 30)
  }

        const stopHold = () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
            setHolding(false)
            setProgreso(0)
        }

        const { deleteArtefacto } = useArtefactos()

        const confirmarBorrado = () => {
        deleteArtefacto(Number(id))
        setEliminado(true)
        setTimeout(() => navigate("/artefactos"), 2000)
        }

        const cancelarBorrado = () => {
            setMostrarConfirm(false)
            setProgreso(0)
        }

        useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

        const peligrosidadColor: Record<string, string> = {
            Alto: "text-red-400",
            Medio: "text-orange-400",
            Bajo: "text-green-400",
        }

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center text-white relative overflow-hidden"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-red-950/80 backdrop-blur-sm" />
      <SaiyanParticles />

      <div className="fixed top-20 right-5 z-50">
        <button onClick={() => navigate("/artefactos")} className="flex flex-col items-center">
          <img src={esfera} className="w-12 drop-shadow-[0_0_10px_orange]" />
          <span className="text-yellow-300 text-sm font-bold">Volver</span>
        </button>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-6">

        <div className="bg-red-600/30 border-2 border-red-500 rounded-t-xl px-6 py-3 flex items-center gap-3">
          <span className="text-2xl">⚠</span>
          <h1 className="text-red-300 font-bold tracking-widest uppercase text-lg">
            Advertencia — Acción Crítica de Borrado
          </h1>
        </div>

        <div className="bg-red-950/60 border-2 border-t-0 border-red-500 rounded-b-xl p-6 grid grid-cols-2 gap-6">

          <div className="flex flex-col gap-4">
            <div className="border border-red-500/50 rounded-lg p-4 bg-black/40">
              <p className="text-red-400 text-xs uppercase tracking-widest mb-2 font-semibold">Artefacto</p>
              <p className="text-white font-bold text-lg">{artefacto.nombre}</p>
              <p className="text-red-300/70 text-sm font-mono">{artefacto.codigo}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-red-400/60 text-xs uppercase">Estado</p>
                  <p className="text-white">{artefacto.estado}</p>
                </div>
                <div>
                  <p className="text-red-400/60 text-xs uppercase">Categoría</p>
                  <p className="text-white">{artefacto.categoria}</p>
                </div>
                <div>
                  <p className="text-red-400/60 text-xs uppercase">Peligrosidad</p>
                  <p className={`font-bold ${peligrosidadColor[artefacto.nivelPeligrosidad] || "text-white"}`}>
                    {artefacto.nivelPeligrosidad}
                  </p>
                </div>
                <div>
                  <p className="text-red-400/60 text-xs uppercase">Inventor</p>
                  <p className="text-white">{artefacto.inventor}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-red-300 text-xs uppercase tracking-widest font-semibold mb-1 block">
                Razón del Borrado *
              </label>
              <select
                value={razon}
                onChange={e => { setRazon(e.target.value); setError("") }}
                className="w-full p-2 bg-black/60 border border-red-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Seleccionar razón</option>
                {razonesBorrado.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-red-300 font-bold uppercase tracking-widest text-sm mb-1">
                Desactivación Permanente
              </p>
              <p className="text-red-400/60 text-xs">Mantén presionado 5 segundos para confirmar</p>
            </div>

            <div className={`relative w-36 h-36 flex items-center justify-center rounded-full border-4 transition-all duration-300
              ${holding ? "border-red-400 shadow-[0_0_30px_red]" : "border-red-700/50 shadow-[0_0_10px_rgba(200,0,0,0.3)]"}`}>
              <div className={`absolute inset-0 rounded-full transition-all duration-300 ${holding ? "bg-red-500/20 animate-pulse" : "bg-transparent"}`} />
              <svg viewBox="0 0 100 100" className={`w-20 h-20 transition-all duration-300 ${holding ? "opacity-100 drop-shadow-[0_0_8px_red]" : "opacity-40"}`} fill="none">
                <ellipse cx="50" cy="50" rx="30" ry="38" stroke="#ef4444" strokeWidth="2.5"/>
                <ellipse cx="50" cy="50" rx="22" ry="30" stroke="#ef4444" strokeWidth="2"/>
                <ellipse cx="50" cy="50" rx="14" ry="22" stroke="#ef4444" strokeWidth="2"/>
                <ellipse cx="50" cy="50" rx="6" ry="13" stroke="#ef4444" strokeWidth="2"/>
                <path d="M50 12 Q70 25 68 50 Q66 70 50 80" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                <path d="M50 20 Q65 32 63 55 Q61 72 50 80" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>

            <button
              onMouseDown={startHold}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={startHold}
              onTouchEnd={stopHold}
              className={`px-8 py-3 rounded font-bold uppercase tracking-widest text-sm border-2 transition-all select-none
                ${holding
                  ? "bg-red-600 border-red-400 text-white shadow-[0_0_20px_red]"
                  : "bg-transparent border-red-600 text-red-400 hover:bg-red-600/20"
                }`}
            >
              {holding ? "Manteniendo..." : "Mantener para borrar"}
            </button>

            <div className="w-full bg-red-950 border border-red-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-75 shadow-[0_0_8px_red]"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {mostrarConfirm && !eliminado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-red-950 border-2 border-red-500 rounded-xl p-8 max-w-sm w-full mx-4 shadow-[0_0_40px_red] text-center">
            <p className="text-3xl mb-3">🗑</p>
            <h2 className="text-red-300 font-bold text-lg uppercase tracking-widest mb-2">¿Confirmar borrado?</h2>
            <p className="text-white font-semibold mb-1">{artefacto.nombre}</p>
            <p className="text-red-400/70 text-sm mb-1">Razón: {razon}</p>
            <p className="text-red-400/50 text-xs mb-6">Esta acción es irreversible</p>
            <div className="flex gap-3">
              <button onClick={cancelarBorrado} className="flex-1 py-2 border border-red-500 rounded text-red-300 hover:bg-red-900/40 transition font-semibold">
                Cancelar
              </button>
              <button onClick={confirmarBorrado} className="flex-1 py-2 bg-red-600 rounded text-white font-bold hover:bg-red-500 transition shadow-[0_0_10px_red]">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {eliminado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-6xl mb-4">💥</p>
            <p className="text-red-400 font-bold text-2xl uppercase tracking-widest">Artefacto Eliminado</p>
            <p className="text-red-400/60 text-sm mt-2">Redirigiendo...</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default ArtefactoDelete