import { useState } from "react"
import { useNavigate } from "react-router-dom"

import bg from "../../../assets/3.jpg"
import logo from "../../../assets/5.gif"
import capsule from "../../../assets/13.gif"

const LoginForm = () => {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: name,
          password,
          authHash: "test",
        }),
      })

      const data = await res.json()

      console.log("LOGIN:", data)

      if (res.ok) {
        localStorage.setItem("userName", name) // 🔥 guardar nombre
        navigate("/home")
      } else {
        alert("Credenciales incorrectas")
      }

    } catch (error) {
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
            Iniciar sesión
          </button>

          <p className="text-gray-300 text-sm text-center mt-6">
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