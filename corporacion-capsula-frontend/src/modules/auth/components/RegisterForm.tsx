import { useState } from "react"
import { useNavigate } from "react-router-dom"

import bg from "../../../assets/4.webp"
import logo from "../../../assets/7.webp"
import capsule from "../../../assets/13.gif"
import { createUser } from "../services/authService"

const ROL_REGISTRO = "Usuario"
const AUTH_TYPE = "DNA_HUMAN"

const RegisterForm = () => {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!name || !age || !password) {
      setError("Completa todos los campos")
      return
    }

    const parsedAge = Number(age)
    if (!Number.isInteger(parsedAge) || parsedAge <= 0) {
      setError("La edad debe ser un numero entero positivo.")
      return
    }

    if (password.length < 8) {
      setError("La contrasena debe tener minimo 8 caracteres.")
      return
    }

    try {
      await createUser({
        name: name.trim(),
        age: parsedAge,
        idrol: ROL_REGISTRO,
        pass: password,
        authType: AUTH_TYPE,
      })

      setError("")
      navigate("/")
    } catch (err) {
      console.error("Error al registrar usuario:", err)
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo registrar. Verifica los datos o que el backend este funcionando."
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
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <img
        src={capsule}
        className="absolute bottom-10 left-10 w-24 opacity-60 animate-bounce hidden md:block"
      />

      <div className="relative w-full max-w-md px-4">
        <div className="bg-black/40 backdrop-blur-xl border border-cyan-400 rounded-2xl p-8 shadow-xl shadow-cyan-500/20">
          <div className="flex justify-center mb-6 relative">
            <div className="absolute w-28 h-28 bg-cyan-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>

            <img
              src={logo}
              className="w-28 h-16 object-contain relative z-10 drop-shadow-[0_0_20px_cyan]"
            />
          </div>

          <h2 className="text-white text-center text-2xl mb-2">REGISTRO</h2>
          <p className="text-gray-400 text-xs text-center mb-6">
            El backend espera <span className="text-cyan-300">name</span>,{" "}
            <span className="text-cyan-300">age</span>, <span className="text-cyan-300">idrol</span>,{" "}
            <span className="text-cyan-300">pass</span> y <span className="text-cyan-300">authType</span>.
          </p>

          <input
            className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
            placeholder="Nombre (name)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />

          <input
            className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
            placeholder="Edad (age)"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            inputMode="numeric"
          />

          <input
            type="password"
            className="w-full mb-5 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
            placeholder="Contrasena (pass, minimo 8 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          {error && (
            <p className="mb-4 text-sm text-red-300">{error}</p>
          )}

          <button
            type="button"
            className="w-full bg-cyan-400 text-black p-3 rounded-lg font-bold"
            onClick={handleSubmit}
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
