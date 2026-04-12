import { useState } from "react"
import { useNavigate } from "react-router-dom"

import bg from "../../../assets/4.webp"
import logo from "../../../assets/7.webp"
import capsule from "../../../assets/13.gif"

const RegisterForm = () => {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async () => {
    if (!name || !password) {
      alert("Debes completar los campos")
      return
    }

    try {
      const res = await fetch("http://localhost:3000/api/v1/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,              // 🔥 CORRECTO
          edad: 18,                 // 🔥 OBLIGATORIO
          contraseña: password,     // 🔥 CORRECTO
        }),
      })

      const data = await res.json()

      console.log("REGISTER:", data)

      if (res.ok) {
        const userId = data?.data?.id

        if (userId) {
          localStorage.setItem("userId", String(userId))
        }

        alert("Usuario creado correctamente 🚀")
        navigate("/")
      } else {
        alert("Error:\n" + JSON.stringify(data, null, 2))
      }

    } catch (error) {
      console.log(error)
      alert("Error de conexión")
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
        className="absolute bottom-10 left-10 w-24 opacity-60 animate-bounce hidden md:block"
      />

      {/* partículas */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-2 h-2 bg-cyan-400 rounded-full top-10 left-10 animate-ping"></div>
        <div className="absolute w-2 h-2 bg-cyan-300 rounded-full top-1/4 right-20 animate-ping delay-200"></div>
      </div>

      <div className="relative w-full max-w-md px-4">
        <div className="bg-black/40 backdrop-blur-xl border border-cyan-400 rounded-2xl p-8">

          <div className="flex justify-center mb-6">
            <img src={logo} className="w-28 h-16 object-contain" />
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