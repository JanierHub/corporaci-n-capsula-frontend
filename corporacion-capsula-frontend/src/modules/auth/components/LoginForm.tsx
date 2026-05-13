import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Html5Qrcode } from "html5-qrcode"

import bg from "../../../assets/3.jpg"
import logo from "../../../assets/5.gif"
import capsule from "../../../assets/13.gif"
import { loginUser } from "../services/authService"
import { persistSessionFromLoginResponse, SESSION_USER_NAME_KEY, getStoredAccessToken } from "../utils/roles"
import { prefetchCache } from "../../../services/optimisticCache"
import { getArtefactos } from "../../artefactos/services/artefactoService"
import { getAllRoles, getAllUsers } from "../services/userService"

// ─── Tipos ───────────────────────────────────────────────────────────────────
type QrScannerState = "idle" | "scanning" | "success" | "error"

const LoginForm = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // ── Campos del formulario ──
  const [userName, setUserName] = useState("")
  const [password, setPassword]   = useState("")
  const [error, setError]         = useState("")

  // ── Estado del escáner QR ──
  const [showScanner, setShowScanner]     = useState(false)
  const [scannerState, setScannerState]   = useState<QrScannerState>("idle")
  const [scannerMessage, setScannerMessage] = useState("")
  const [isSubmitting, setIsSubmitting]   = useState(false)

  const html5QrRef   = useRef<Html5Qrcode | null>(null)
  const scannerRunning = useRef(false)

  // ─── Detener cámara ────────────────────────────────────────────────────────
  const stopCamera = async () => {
    if (html5QrRef.current && scannerRunning.current) {
      try {
        await html5QrRef.current.stop()
        html5QrRef.current.clear()
      } catch (_) {
        // ignorar si ya estaba detenida
      }
      scannerRunning.current = false
    }
  }

  // ─── Limpiar al desmontar ──────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  // ─── Iniciar cámara cuando el modal aparece ────────────────────────────────
  useEffect(() => {
    if (!showScanner) return

    // Pequeño delay para que el DOM esté listo
    const timer = setTimeout(() => {
      startQrScanner()
    }, 300)

    return () => clearTimeout(timer)
  }, [showScanner])

  // ─── Validar formulario antes de abrir cámara ──────────────────────────────
  const handleLoginClick = () => {
    if (!userName.trim()) {
      setError("Por favor ingresa tu nombre de usuario.")
      return
    }
    if (!password) {
      setError("Por favor ingresa tu contraseña.")
      return
    }
    setError("")
    setScannerState("idle")
    setScannerMessage("")
    setShowScanner(true)
  }

  // ─── Iniciar escáner ───────────────────────────────────────────────────────
  const startQrScanner = async () => {
    const elementId = "qr-reader"
    const el = document.getElementById(elementId)
    if (!el) return

    try {
      html5QrRef.current = new Html5Qrcode(elementId)

      await html5QrRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // ── QR detectado ──
          onQrSuccess(decodedText)
        },
        (_errorMessage) => {
          // ignorar errores de frame (son continuos mientras busca)
        }
      )
      scannerRunning.current = true
      setScannerState("scanning")
    } catch (err) {
      setScannerState("error")
      setScannerMessage("No se pudo acceder a la cámara. Verifica los permisos.")
    }
  }

  // ─── QR leído exitosamente → llamar a la API ──────────────────────────────
  const onQrSuccess = async (biometria: string) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setScannerState("success")
    setScannerMessage(`Código detectado. Verificando...`)

    await stopCamera()

    try {
      console.log("🔐 [LoginForm] Login con biometría QR para:", userName.trim())

      const session = await loginUser({
        userName: userName.trim(),
        password,
        biometria,
      })

      console.log("🔐 [LoginForm] Respuesta del backend:", session)

      localStorage.setItem(SESSION_USER_NAME_KEY, userName.trim())
      persistSessionFromLoginResponse(session)

      const savedToken = getStoredAccessToken()
      console.log("🔐 [LoginForm] Token guardado:", savedToken ? "✅ SÍ" : "❌ NO")

      window.dispatchEvent(new Event("auth-login"))

      const token = getStoredAccessToken()
      if (token) {
        console.log("🚀 Iniciando prefetch de datos...")
        prefetchCache("artefactos", getArtefactos)
          .then(() => console.log("✅ Artefactos precargados"))
          .catch((e) => console.error("❌ Error precargando artefactos:", e))
        prefetchCache("roles", getAllRoles)
          .then(() => console.log("✅ Roles precargados"))
          .catch((e) => console.error("❌ Error precargando roles:", e))
        prefetchCache("users", getAllUsers)
          .then(() => console.log("✅ Usuarios precargados"))
          .catch((e) => console.error("❌ Error precargando usuarios:", e))
      }

      setError("")
      setShowScanner(false)

      const state = location.state as { from?: string } | undefined
      const raw = state?.from
      const safePath =
        typeof raw === "string" && raw.startsWith("/") && !raw.startsWith("//")
          ? raw
          : "/home"
      navigate(safePath, { replace: true })
    } catch (err) {
      console.error("Error al iniciar sesión:", err)
      const msg =
        err instanceof Error ? err.message : "No se pudo iniciar sesión."
      setScannerState("error")
      setScannerMessage(msg)
      setIsSubmitting(false)
    }
  }

  // ─── Cerrar modal / reintentar ─────────────────────────────────────────────
  const handleCloseScanner = async () => {
    await stopCamera()
    setShowScanner(false)
    setScannerState("idle")
    setScannerMessage("")
    setIsSubmitting(false)
  }

  const handleRetry = async () => {
    setScannerState("idle")
    setScannerMessage("")
    setIsSubmitting(false)
    await startQrScanner()
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ════════════════════ FONDO + FORMULARIO ════════════════════ */}
      <div
        className="w-full h-full min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <img
          src={capsule}
          className="absolute top-10 right-10 w-24 opacity-60 animate-bounce hidden md:block"
        />

        <div className="relative w-full max-w-md px-4">
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-400 rounded-2xl p-8">

            <div className="flex justify-center mb-6">
              <img src={logo} className="w-32 h-20 object-contain" />
            </div>

            <h2 className="text-white text-center text-2xl mb-6">
              CAPSULE CORP
            </h2>

            <input
              className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
              placeholder="Nombre"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoComplete="username"
            />

            <input
              type="password"
              className="w-full mb-5 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <p className="text-gray-400 text-xs mb-5">
              En esta versión, los usuarios nuevos los crea un administrador autenticado desde el sistema.
            </p>

            {error && (
              <p className="mb-4 text-sm text-red-300">{error}</p>
            )}

            <button
              className="w-full bg-cyan-400 text-black p-3 rounded-lg font-bold flex items-center justify-center gap-2"
              onClick={handleLoginClick}
            >
              {/* Ícono de cámara pequeño para indicar que abrirá la cámara */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              Iniciar sesión
            </button>

            <p className="text-gray-300 text-sm text-center mt-6">
              Si necesitas un usuario nuevo, debe crearlo un administrador desde dentro del sistema.
            </p>

          </div>
        </div>
      </div>

      {/* ════════════════════ MODAL DE CÁMARA QR ════════════════════ */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm mx-4 bg-black/70 border border-cyan-400 rounded-2xl p-6 flex flex-col items-center gap-4">

            {/* Botón cerrar */}
            <button
              onClick={handleCloseScanner}
              className="absolute top-3 right-3 text-cyan-400 hover:text-white transition-colors"
              title="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-cyan-400 font-bold text-lg text-center">
              Verificación biométrica
            </h3>
            <p className="text-gray-300 text-sm text-center">
              Muestra tu <span className="text-cyan-300 font-semibold">Tarjeta Capsule Corp</span> frente a la cámara
            </p>

            {/* Contenedor del escáner — html5-qrcode monta aquí */}
            <div
              id="qr-reader"
              className="w-full rounded-xl overflow-hidden border border-cyan-400/50"
              style={{ minHeight: "260px" }}
            />

            {/* Indicador de estado */}
            {scannerState === "scanning" && (
              <div className="flex items-center gap-2 text-cyan-400 text-sm animate-pulse">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                Escaneando...
              </div>
            )}

            {scannerState === "success" && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {scannerMessage || "Código detectado. Verificando..."}
              </div>
            )}

            {scannerState === "error" && (
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="flex items-center gap-2 text-red-400 text-sm text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {scannerMessage || "Error en la verificación."}
                </div>
                <button
                  onClick={handleRetry}
                  className="w-full bg-cyan-400/20 border border-cyan-400 text-cyan-400 p-2 rounded-lg text-sm font-semibold hover:bg-cyan-400 hover:text-black transition-colors"
                >
                  Reintentar
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  )
}

export default LoginForm
