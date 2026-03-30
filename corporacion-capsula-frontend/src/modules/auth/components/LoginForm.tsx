import { useState } from "react"
import { useNavigate } from "react-router-dom"

import bg from "../../../assets/3.jpg"
import logo from "../../../assets/5.gif"
import capsule from "../../../assets/13.gif"

const LoginForm = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = () => {
    if (email === "admin@test.com" && password === "1234") {
      alert("Login correcto")
    } else {
      alert("Credenciales incorrectas")
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
        className="absolute top-10 right-10 w-24 opacity-60 animate-bounce hidden md:block"
      />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-2 h-2 bg-cyan-400 rounded-full top-10 left-10 animate-ping"></div>
        <div className="absolute w-2 h-2 bg-cyan-300 rounded-full top-1/4 right-20 animate-ping delay-200"></div>
        <div className="absolute w-1.5 h-1.5 bg-cyan-200 rounded-full top-1/2 left-1/4 animate-pulse"></div>
        <div className="absolute w-2 h-2 bg-cyan-400 rounded-full bottom-20 left-20 animate-ping delay-300"></div>
        <div className="absolute w-1 h-1 bg-cyan-300 rounded-full bottom-10 right-10 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md px-4">
        <div className="bg-black/40 backdrop-blur-xl border border-cyan-400 rounded-2xl p-8 shadow-xl shadow-cyan-500/20">

          <div className="flex justify-center mb-6 relative">
            <div className="absolute w-32 h-32 bg-cyan-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>

            <img
              src={logo}
              className="w-32 h-20 object-contain relative z-10 drop-shadow-[0_0_25px_cyan]"
            />
          </div>

          <h2 className="text-white text-center text-2xl mb-6 tracking-widest">
            CAPSULE CORP
          </h2>

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
            Iniciar sesión
          </button>

          <p className="text-gray-300 text-sm text-center mt-4">
            ¿No tienes cuenta?{" "}
            <span
              className="text-cyan-400 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Regístrate
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm