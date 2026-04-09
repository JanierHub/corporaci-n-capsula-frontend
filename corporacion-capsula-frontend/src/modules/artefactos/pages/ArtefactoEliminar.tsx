import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
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
]

const HOLD_DURATION = 3000

const ArtefactoEliminar = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  // 🔥 MOCK (para que nunca falle)
  const artefacto = {
    id: id || "1",
    nombre: "Capsula Hoi Poi",
    codigo: "CAP-001",
    estado: "Activo",
    categoria: "DOMESTIC",
    nivelPeligrosidad: "Low",
    inventor: "Bulma",
  }

  const [razon, setRazon] = useState("")
  const [progreso, setProgreso] = useState(0)
  const [holding, setHolding] = useState(false)
  const [mostrarConfirm, setMostrarConfirm] = useState(false)
  const [error, setError] = useState("")
  const [eliminado, setEliminado] = useState(false)

  const intervalRef = useRef<any>(null)
  const startTimeRef = useRef<number | null>(null)

  const startHold = () => {
    if (!razon) {
      setError("Debes seleccionar una razón")
      return
    }

    setError("")
    setHolding(true)
    startTimeRef.current = Date.now()

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current || 0)
      const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100)

      setProgreso(pct)

      if (pct >= 100) {
        clearInterval(intervalRef.current)
        setHolding(false)
        setMostrarConfirm(true)
      }
    }, 30)
  }

  const stopHold = () => {
    clearInterval(intervalRef.current)
    setHolding(false)
    setProgreso(0)
  }

  const confirmarBorrado = () => {
    setEliminado(true)
    setTimeout(() => navigate("/artefactos"), 2000)
  }

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  const peligrosidadColor = {
    High: "text-red-400",
    Mid: "text-orange-400",
    Low: "text-green-400",
  }

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center text-white relative overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-red-950/80 backdrop-blur-sm" />
      <SaiyanParticles />

      {/* BOTÓN VOLVER */}
      <div className="fixed top-20 right-5 z-50">
        <button onClick={() => navigate("/artefactos")} className="flex flex-col items-center">
          <img src={esfera} className="w-12 drop-shadow-[0_0_10px_orange]" />
          <span className="text-yellow-300 text-sm font-bold">Volver</span>
        </button>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-6">

        {/* HEADER */}
        <div className="bg-red-600/30 border-2 border-red-500 rounded-t-xl px-6 py-3">
          <h1 className="text-red-300 font-bold uppercase">
            Desactivación de Artefacto
          </h1>
        </div>

        {/* CONTENIDO */}
        <div className="bg-red-950/60 border-2 border-t-0 border-red-500 rounded-b-xl p-6 grid grid-cols-2 gap-6">

          {/* INFO */}
          <div>
            <p className="font-bold text-lg">{artefacto.nombre}</p>
            <p>{artefacto.codigo}</p>
            <p className={peligrosidadColor[artefacto.nivelPeligrosidad]}>
              {artefacto.nivelPeligrosidad}
            </p>
          </div>

          {/* ACCIONES */}
          <div className="flex flex-col items-center gap-4">

            {/* SELECT */}
            <select
              value={razon}
              onChange={(e) => setRazon(e.target.value)}
              className="w-full p-2 bg-black border border-red-500 rounded"
            >
              <option value="">Seleccionar razón</option>
              {razonesBorrado.map(r => <option key={r}>{r}</option>)}
            </select>

            {error && <p className="text-red-400">{error}</p>}

            {/* 🔥 EFECTO ENERGÍA */}
            <div className={`relative w-32 h-32 flex items-center justify-center rounded-full border-4
              ${holding ? "border-red-400 shadow-[0_0_30px_red]" : "border-red-700/50"}
            `}>
              <div className={`absolute inset-0 rounded-full ${holding ? "bg-red-500/20 animate-pulse" : ""}`} />

              <svg viewBox="0 0 100 100" className={`w-20 h-20
                ${holding ? "opacity-100 drop-shadow-[0_0_8px_red]" : "opacity-40"}
              `}>
                <ellipse cx="50" cy="50" rx="30" ry="38" stroke="#ef4444" strokeWidth="2.5"/>
                <ellipse cx="50" cy="50" rx="22" ry="30" stroke="#ef4444" strokeWidth="2"/>
                <ellipse cx="50" cy="50" rx="14" ry="22" stroke="#ef4444" strokeWidth="2"/>
              </svg>
            </div>

            {/* BOTÓN */}
            <button
              onMouseDown={startHold}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              className={`px-6 py-2 rounded border
                ${holding
                  ? "bg-red-600 border-red-400"
                  : "bg-transparent border-red-600 text-red-400 hover:bg-red-600/20"
                }`}
            >
              {holding ? "Manteniendo..." : "Mantener para desactivar"}
            </button>

            {/* BARRA */}
            <div className="w-full bg-red-950 border border-red-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all"
                style={{ width: `${progreso}%` }}
              />
            </div>

          </div>
        </div>
      </div>

      {/* CONFIRM */}
      {mostrarConfirm && !eliminado && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">

    <div className="bg-black/90 border-2 border-red-500 rounded-xl p-8 w-[350px] text-center shadow-[0_0_40px_red]">

      <h2 className="text-red-400 font-bold uppercase tracking-widest mb-4">
        Verificación Biométrica
      </h2>

      {/* 🔥 HUELLA */}
      <div className="flex justify-center mb-6">
        <svg
          viewBox="0 0 100 100"
          className="w-24 h-24 text-red-400 animate-pulse drop-shadow-[0_0_10px_red]"
          fill="none"
        >
          <path d="M50 10 C70 20, 80 40, 50 90" stroke="currentColor" strokeWidth="2"/>
          <path d="M50 15 C65 25, 70 45, 50 85" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M50 20 C60 30, 60 50, 50 80" stroke="currentColor" strokeWidth="1"/>
        </svg>
      </div>

      {/* INFO */}
      <p className="text-white font-semibold mb-1">{artefacto.nombre}</p>
      <p className="text-red-400/70 text-sm mb-3">Razón: {razon}</p>

      {/* 🔥 BARRA DE CARGA */}
      <div className="w-full bg-red-950 border border-red-700 rounded-full h-3 overflow-hidden mb-4">
        <div
          className="h-full bg-red-500 transition-all duration-300 shadow-[0_0_10px_red]"
          style={{ width: `${progreso}%` }}
        />
      </div>

      <p className="text-red-300 text-xs mb-4">
        Escaneando huella...
      </p>

      {/* BOTONES */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/artefactos")}
          className="flex-1 py-2 border border-red-500 rounded text-red-300 hover:bg-red-900/40 transition"
        >
          Volver
        </button>

        <button
          onClick={confirmarBorrado}
          className="flex-1 py-2 bg-red-600 rounded text-white font-bold hover:bg-red-500 transition shadow-[0_0_10px_red]"
        >
          Confirmar
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  )
}

export default ArtefactoEliminar