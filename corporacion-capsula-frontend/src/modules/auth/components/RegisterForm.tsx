import { useState } from "react"
import { useNavigate } from "react-router-dom"

import bg from "../../../assets/4.webp"
import logo from "../../../assets/7.webp"
import capsule from "../../../assets/13.gif"
import { createUser } from "../services/authService"
import { getStoredUserRole, isAdministrator } from "../utils/roles"

const ROLE_OPTIONS = [
  { value: 1, label: "Administrador" },
  { value: 2, label: "Directora de Innovacion" },
  { value: 3, label: "Experto en tecnologia extraterrestre" },
  { value: 4, label: "Especialista en seguridad" },
  { value: 5, label: "Inventor/Tester" },
  { value: 6, label: "Gestor de proyectos" },
  { value: 7, label: "Usuario" },
]

const RegisterForm = () => {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("7")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async () => {
    if (!name || !age || !password) {
      setError("Debes completar todos los campos")
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
      setError("La contrasena debe tener minimo 8 caracteres.")
      setSuccess("")
      return
    }

    try {
      await createUser({
        nombre: name.trim(),
        edad: parsedAge,
        contraseña: password,
        rol: Number(role),
      })

      setName("")
      setAge("")
      setPassword("")
      setRole("7")
      setError("")
      setSuccess("Usuario creado correctamente.")
    } catch (err) {
      console.error("Error al crear usuario:", err)
      setSuccess("")
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo crear el usuario."
      )
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
            <img
              src={logo}
              className="w-28 h-16 object-contain mx-auto mb-6"
            />

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

          <h2 className="text-white text-center text-2xl mb-2">
            CREAR USUARIO
          </h2>

          <p className="text-gray-400 text-xs text-center mb-6">
            El backend crea el usuario usando la cookie del administrador actual.
          </p>

          <input
            className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />

          <input
            className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
            placeholder="Edad"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            inputMode="numeric"
          />

          <input
            type="password"
            className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
            placeholder="Contrasena"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          <select
            className="w-full mb-5 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value} - {option.label}
              </option>
            ))}
          </select>

          {error ? (
            <p className="mb-4 text-sm text-red-300">{error}</p>
          ) : null}

          {success ? (
            <p className="mb-4 text-sm text-emerald-300">{success}</p>
          ) : null}

          <button
            className="w-full bg-cyan-400 text-black p-3 rounded-lg font-bold"
            onClick={handleSubmit}
          >
            Crear usuario
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
