import { useState } from "react"
import { getUsers } from "../services/authService"

const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async () => {
    try {
      // 🔹 intento real (backend)
      const users = await getUsers()

      const user = users.find(
        (u: any) => u.email === email && u.password === password
      )

      if (user) {
        alert("Login correcto (backend)")
      } else {
        alert("Credenciales incorrectas")
      }

    } catch (error) {
      console.warn("Backend no disponible, usando modo simulado")

      // 🔹 fallback (simulación)
      if (email === "admin@test.com" && password === "1234") {
        alert("Login correcto (simulado)")
      } else {
        alert("Credenciales incorrectas")
      }
    }
  }

  return (
    <div className="bg-black/40 backdrop-blur-lg p-6 rounded-xl border border-cyan-400 w-80">
      <h2 className="text-xl text-white mb-4">Iniciar sesión</h2>

      <input
        className="w-full mb-3 p-2 bg-black border border-cyan-400 text-white"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full mb-3 p-2 bg-black border border-cyan-400 text-white"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="w-full bg-cyan-400 text-black p-2 rounded-lg hover:bg-cyan-300 transition"
        onClick={handleSubmit}
      >
        Iniciar sesión
      </button>
    </div>
  )
}

export default LoginForm