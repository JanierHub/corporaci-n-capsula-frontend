import { useState } from "react"

const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = () => {
    console.log("Datos:", { email, password })
  }

  return (
    <div className="bg-black/40 backdrop-blur-lg p-6 rounded-xl border border-cyan-400 w-80">
      <h2 className="text-xl text-white mb-4">Iniciar sesión</h2>

      <input
        className="w-full mb-3 p-2 bg-black border border-cyan-400 text-white"
        placeholder="Correo electrónico"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full mb-3 p-2 bg-black border border-cyan-400 text-white"
        placeholder="Contraseña"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="w-full bg-cyan-400 text-black p-2 rounded-lg"
        onClick={handleSubmit}
      >
        Iniciar sesión
      </button>
    </div>
  )
}

export default LoginForm