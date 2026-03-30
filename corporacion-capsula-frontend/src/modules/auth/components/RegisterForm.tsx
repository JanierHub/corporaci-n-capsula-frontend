import { useState } from "react"
import { useNavigate } from "react-router-dom"

import bg from "../../../assets/4.webp"
import logo from "../../../assets/7.webp"
import capsule from "../../../assets/13.gif"

const RegisterForm = () => {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = () => {
    if (name && email && password) {
      alert("Registro exitoso")
    } else {
      alert("Completa todos los campos")
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

          <h2 className="text-white text-center text-2xl mb-6">
            REGISTRO
          </h2>

          <input
            className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full mb-5 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full bg-cyan-400 text-black p-3 rounded-lg font-bold"
            onClick={handleSubmit}
          >
            Registrarse
          </button>

          <p className="text-gray-300 text-sm text-center mt-4">
            ¿Ya tienes cuenta?{" "}
            <span
              className="text-cyan-400 cursor-pointer hover:underline"
              onClick={() => navigate("/")}
            >
              Iniciar sesión
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm