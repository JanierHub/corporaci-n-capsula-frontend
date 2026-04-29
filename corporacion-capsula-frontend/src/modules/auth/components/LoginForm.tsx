import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import bg from "../../../assets/3.jpg"
import logo from "../../../assets/5.gif"
import capsule from "../../../assets/13.gif"
import { loginUser } from "../services/authService"
import { persistSessionFromLoginResponse, SESSION_USER_NAME_KEY, getStoredAccessToken } from "../utils/roles"
import { prefetchCache } from "../../../services/optimisticCache"
import { getArtefactos } from "../../artefactos/services/artefactoService"
import { getAllRoles, getAllUsers } from "../services/userService"
import { API_URL } from "../../../config/api"

const LoginForm = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    try {
      console.log("🔐 [LoginForm] Intentando login con usuario:", userName.trim())
      
      const session = await loginUser({
        userName: userName.trim(),
        password,
      })
      
      console.log("🔐 [LoginForm] Respuesta del backend:", session)
      console.log("🔐 [LoginForm] Token en session.data:", session.data?.substring(0, 50) + "...")
      console.log("🔐 [LoginForm] Token en session.token:", session.token?.substring(0, 50) + "...")
      console.log("🔐 [LoginForm] Token en session.session:", session.session?.substring(0, 50) + "...")

      localStorage.setItem(SESSION_USER_NAME_KEY, userName.trim())
      persistSessionFromLoginResponse(session)
      
      // Verificar si el token se guardó
      const savedToken = getStoredAccessToken()
      console.log("🔐 [LoginForm] Token guardado en localStorage:", savedToken ? "✅ SÍ" : "❌ NO")
      
      // Disparar evento para que ArtefactosContext recargue
      window.dispatchEvent(new Event('auth-login'))
      
      // Pre-fetch: Cargar datos en caché después del login
      // Esto permite que la navegación sea instantánea
      const token = getStoredAccessToken()
      if (token) {
        console.log("🚀 Iniciando prefetch de datos...")
        
        // Cargar artefactos en background
        prefetchCache("artefactos", getArtefactos)
          .then(() => console.log("✅ Artefactos precargados"))
          .catch((e) => console.error("❌ Error precargando artefactos:", e))
        
        // Cargar roles en background
        prefetchCache("roles", getAllRoles)
          .then(() => console.log("✅ Roles precargados"))
          .catch((e) => console.error("❌ Error precargando roles:", e))
        
        // Cargar usuarios en background
        prefetchCache("users", getAllUsers)
          .then(() => console.log("✅ Usuarios precargados"))
          .catch((e) => console.error("❌ Error precargando usuarios:", e))
      }
      
      setError("")
      const state = location.state as { from?: string } | undefined
      const raw = state?.from
      const safePath =
        typeof raw === "string" &&
        raw.startsWith("/") &&
        !raw.startsWith("//")
          ? raw
          : "/home"
      navigate(safePath, { replace: true })
    } catch (err) {
      console.error("Error al iniciar sesion:", err)
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo iniciar sesion."
      )
    }
  }

  return (
    <div
      className="w-full h-full min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

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
            En esta version, los usuarios nuevos los crea un administrador autenticado desde el sistema.
          </p>

          {error ? (
            <p className="mb-4 text-sm text-red-300">{error}</p>
          ) : null}

          <button
            className="w-full bg-cyan-400 text-black p-3 rounded-lg font-bold"
            onClick={handleSubmit}
          >
            Iniciar sesión
          </button>

          <p className="text-gray-300 text-sm text-center mt-6">
            Si necesitas un usuario nuevo, debe crearlo un administrador desde dentro del sistema.
          </p>

        </div>
      </div>
    </div>
  )
}

export default LoginForm
