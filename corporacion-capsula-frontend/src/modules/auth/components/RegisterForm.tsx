import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import bg from "../../../assets/4.webp"
import logo from "../../../assets/7.webp"
import capsule from "../../../assets/13.gif"
import { createUser, getAllRoles, checkUserExists, type Role } from "../services/userService"
import { getStoredUserRole, isAdministrator } from "../utils/roles"
import { logoutUser } from "../services/authService"
import { clearStoredSession } from "../utils/roles"

const RegisterForm = () => {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [password, setPassword] = useState("")
  const [biometria, setBiometria] = useState("")
  const [adn, setAdn] = useState("")
  const [role, setRole] = useState("7")
  const [authType, setAuthType] = useState<"DNA_SAIYAN" | "DNA_HUMAN">("DNA_HUMAN") // ← nuevo
  const [roles, setRoles] = useState<Role[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingName, setCheckingName] = useState(false)
  const [nameExists, setNameExists] = useState(false)

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await getAllRoles()
        setRoles(rolesData)
        if (rolesData.length > 0) {
          setRole(String(rolesData[0].id_rol))
        }
      } catch (err) {
        console.error("Error cargando roles:", err)
      }
    }
    loadRoles()
  }, [])

  useEffect(() => {
    if (!name.trim()) {
      setNameExists(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      setCheckingName(true)
      try {
        const exists = await checkUserExists(name.trim())
        setNameExists(exists)
        if (exists) {
          setError("Este nombre de usuario ya existe")
        } else {
          setError("")
        }
      } catch (err) {
        console.error("Error validando nombre:", err)
      } finally {
        setCheckingName(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [name])

  const handleSubmit = async () => {
    if (!name || !age || !password) {
      setError("Debes completar todos los campos obligatorios (nombre, edad, contraseña)")
      setSuccess("")
      return
    }

    if (nameExists) {
      setError("Este nombre de usuario ya existe. Elige otro.")
      setSuccess("")
      return
    }

    const parsedAge = Number(age)
    if (!Number.isInteger(parsedAge) || parsedAge <= 0) {
      setError("La edad debe ser un numero entero positivo.")
      setSuccess("")
      return
    }

    if (password.length < 8) {
      setError("La contraseña debe tener minimo 8 caracteres.")
      setSuccess("")
      return
    }

    setLoading(true)
    try {
      await createUser({
        nombre: name.trim(),
        edad: parsedAge,
        contraseña: password,
        biometria: biometria.trim() || undefined,
        adn: adn.trim() || undefined,
        rol: Number(role),
        authType, // ← nuevo
      })

      setName("")
      setAge("")
      setPassword("")
      setBiometria("")
      setAdn("")
      setRole(roles.length > 0 ? String(roles[0].id_rol) : "7")
      setAuthType("DNA_HUMAN") // ← reset
      setError("")
      setSuccess("Usuario creado exitosamente. Puedes crear otro o volver al panel.")
    } catch (err) {
      console.error("Error al crear usuario:", err)
      setSuccess("")
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo crear el usuario. Intente nuevamente."
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isAdministrator()) {
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
        <div className="relative w-full max-w-md px-4">
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-400 rounded-2xl p-8 shadow-xl shadow-cyan-500/20 text-center">
            <img src={logo} className="w-28 h-16 object-contain mx-auto mb-6" />
            <h2 className="text-white text-2xl mb-4">Acceso restringido</h2>
            <p className="text-gray-300 text-sm mb-3">
              Solo un <span className="text-cyan-300 font-semibold">Administrador</span> autenticado puede crear usuarios desde este formulario.
            </p>
            <p className="text-gray-400 text-xs mb-6">
              Rol detectado: {getStoredUserRole() || "Sin sesion"}
            </p>
            <button
              type="button"
              className="w-full bg-cyan-400 text-black p-3 rounded-lg font-bold"
              onClick={() => navigate("/home")}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    )
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
        className="absolute bottom-10 left-10 w-24 opacity-60 animate-bounce hidden md:block"
      />

      <div className="relative w-full max-w-md px-4">
        <div className="bg-black/40 backdrop-blur-xl border border-cyan-400 rounded-2xl p-8 shadow-xl shadow-cyan-500/20">
          <div className="flex justify-center mb-6">
            <img src={logo} className="w-28 h-16 object-contain" />
          </div>

          <h2 className="text-white text-center text-2xl mb-2">CREAR USUARIO</h2>

          <p className="text-gray-400 text-xs text-center mb-6">
            El backend crea el usuario usando la cookie del administrador actual.
          </p>

          <div className="relative">
            <input
              className={`w-full mb-1 p-3 bg-black/60 border ${nameExists ? "border-red-400" : "border-cyan-400"} text-white rounded-lg`}
              placeholder="Nombre *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            {checkingName && (
              <span className="absolute right-3 top-3 text-xs text-gray-400">Verificando...</span>
            )}
            {nameExists && (
              <p className="text-red-400 text-xs mb-2">Este nombre ya existe</p>
            )}
          </div>

          <input
            className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
            placeholder="Edad *"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            inputMode="numeric"
          />

          <input
            type="password"
            className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
            placeholder="Contraseña * (min. 8 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          <label className="text-gray-400 text-sm mb-1 block">Rol *</label>
          <select
            className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.length === 0 ? (
              <option value="7">Cargando roles...</option>
            ) : (
              roles.map((r) => (
                <option key={r.id_rol} value={r.id_rol}>
                  {r.nombre_rol} ({r.nivel_seguridad})
                </option>
              ))
            )}
          </select>

          {/* ← NUEVO: selector authType */}
          <label className="text-gray-400 text-sm mb-1 block">Tipo de autenticación *</label>
          <select
            className="w-full mb-5 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
            value={authType}
            onChange={(e) => setAuthType(e.target.value as "DNA_SAIYAN" | "DNA_HUMAN")}
          >
            <option value="DNA_HUMAN">DNA_HUMAN — Humano estándar</option>
            <option value="DNA_SAIYAN">DNA_SAIYAN — Guerrero Saiyan</option>
          </select>

          {error ? <p className="mb-4 text-sm text-red-300">{error}</p> : null}
          {success ? <p className="mb-4 text-sm text-emerald-300">{success}</p> : null}

          <button
            className="w-full bg-cyan-400 text-black p-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={loading || nameExists}
          >
            {loading ? "Creando..." : "Crear usuario"}
          </button>
          <button
            onClick={async () => {
              try { await logoutUser() } catch (_) {}
              clearStoredSession()
              navigate("/")
            }}
            className="w-full mt-2 border border-red-400/50 text-red-400 p-3 rounded-lg font-bold hover:bg-red-400/10 transition"
            >
            Cerrar sesión
            </button>

          <p className="text-gray-300 text-sm text-center mt-4">
            ¿Quieres volver al panel?{" "}
            <span
              className="text-cyan-400 cursor-pointer hover:underline"
              onClick={() => navigate("/home")}
            >
              Ir al inicio
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm