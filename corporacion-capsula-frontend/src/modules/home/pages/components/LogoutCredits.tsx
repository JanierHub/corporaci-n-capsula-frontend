import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import creditsBg from "../../../../assets/creditos.mp4"

const LogoutCredits = () => {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoEnded, setVideoEnded] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 50)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (videoEnded) {
      const t = setTimeout(() => setShowButton(true), 400)
      return () => clearTimeout(t)
    }
  }, [videoEnded])

  return (
    <div
      className={`relative w-full h-screen overflow-hidden bg-black text-white transition-opacity duration-700 ${fadeIn ? "opacity-100" : "opacity-0"}`}
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        autoPlay
        className="absolute w-full h-full object-cover"
        onEnded={() => setVideoEnded(true)}
      >
        <source src={creditsBg} type="video/mp4" />
      </video>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/30" />

      {/* BOTÓN IR AL LOGIN — aparece al terminar el video */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-end pb-20 transition-opacity duration-700 ${showButton ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <p className="text-cyan-300/80 text-sm tracking-[0.3em] uppercase mb-6 font-light">
          Sesión cerrada
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-10 py-4 rounded-xl font-bold tracking-widest text-sm uppercase bg-black/50 border border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-black transition-all duration-300 backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.7)]"
        >
          🚀 Ir al Inicio de Sesión
        </button>

        <p className="text-gray-500 text-xs mt-4 tracking-widest">
          CAPSULE CORP SYSTEM · HASTA PRONTO
        </p>
      </div>

      {/* BOTÓN SALTAR */}
      {!videoEnded && (
        <button
          onClick={() => {
            if (videoRef.current) videoRef.current.pause()
            setVideoEnded(true)
          }}
          className="absolute top-6 right-6 z-20 text-xs text-gray-400 hover:text-cyan-300 border border-gray-600 hover:border-cyan-400 px-3 py-1.5 rounded-lg transition-all duration-200 backdrop-blur-sm bg-black/30"
        >
          Saltar ⏭
        </button>
      )}
    </div>
  )
}

export default LogoutCredits
